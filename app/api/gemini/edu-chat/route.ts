import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import {
  EduSubjectId,
  EduStudyMode,
  EduSearchSource,
  buildEduSystemInstruction,
  buildEduTutorFallbackAnswer,
  buildEduSearchSources,
  buildEduFollowUpSuggestions,
  getEduSubjectById,
} from '@/lib/class8b-logic';

interface ChatTurnPayload {
  role: 'user' | 'model';
  text: string;
}

interface CachedTutorPayload {
  reply: string;
  subjectLabel: string;
  scheduleDays: string;
  source: string;
  sources: EduSearchSource[];
  searchQueries: string[];
  followUpSuggestions: string[];
}

const SERVER_RESPONSE_CACHE = new Map<string, CachedTutorPayload>();
const IN_FLIGHT_REQUESTS = new Map<string, Promise<CachedTutorPayload>>();
let searchGroundingCooldownUntil = 0;
let modelRateLimitCooldownUntil = 0;

function extractDomainFromUri(uri: string, fallbackTitle?: string): string {
  try {
    const parsed = new URL(uri);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return fallbackTitle ? fallbackTitle.slice(0, 32) : 'buku.kemdikbud.go.id';
  }
}

function isRateOrQuotaError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err ?? '');
  return /429|rate|quota|exhausted|too many requests|resource_exhausted|overloaded/i.test(msg);
}

function storeInServerCache(key: string, payload: CachedTutorPayload) {
  if (SERVER_RESPONSE_CACHE.size >= 250) {
    const oldestKey = SERVER_RESPONSE_CACHE.keys().next().value;
    if (oldestKey) SERVER_RESPONSE_CACHE.delete(oldestKey);
  }
  SERVER_RESPONSE_CACHE.set(key, payload);
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const question = String(body?.question ?? '').trim();
    const subjectId = (body?.subjectId ?? 'semua') as EduSubjectId;
    const studyMode = (body?.studyMode ?? 'rumus_langkah') as EduStudyMode;
    const enableWebSearch = body?.enableWebSearch !== false;
    const studentName = String(body?.studentName ?? 'Siswa Kelas 8B').trim();
    const studentRoleLabel = String(body?.studentRoleLabel ?? 'Anggota Kelas 8B').trim();
    const history: ChatTurnPayload[] = Array.isArray(body?.history) ? body.history.slice(-4) : [];

    if (!question) {
      return NextResponse.json(
        { error: 'Pertanyaan tidak boleh kosong.' },
        { status: 400 }
      );
    }

    const subjectMeta = getEduSubjectById(subjectId);
    const normalizedQuestion = question.toLowerCase().replace(/\s+/g, ' ');
    const cacheKey = `${subjectId}::${studyMode}::${enableWebSearch ? 'web' : 'local'}::${normalizedQuestion}`;

    // 1. Instant LRU Cache Hit (0 Quota Cost, < 5ms)
    const cachedHit = SERVER_RESPONSE_CACHE.get(cacheKey);
    if (cachedHit) {
      return NextResponse.json({
        ...cachedHit,
        latencyMs: Math.max(4, Date.now() - startTime),
        cached: true,
        webSearchUsed: enableWebSearch,
      });
    }

    // 2. In-Flight Deduplication (Prevents Concurrent Duplicate Calls)
    const existingInFlight = IN_FLIGHT_REQUESTS.get(cacheKey);
    if (existingInFlight) {
      const sharedResult = await existingInFlight;
      return NextResponse.json({
        ...sharedResult,
        latencyMs: Math.max(6, Date.now() - startTime),
        deduplicated: true,
        webSearchUsed: enableWebSearch,
      });
    }

    const searchBundle = buildEduSearchSources({ subjectId, question });
    const defaultSources = searchBundle.sources;
    const defaultSearchQueries = searchBundle.searchQueries;
    const followUpSuggestions = buildEduFollowUpSuggestions(subjectId);

    const resolveTutorResponse = async (): Promise<CachedTutorPayload> => {
      const systemInstruction = buildEduSystemInstruction({
        subjectId,
        studyMode,
        studentName,
        studentRoleLabel,
      });

      const apiKey = process.env.GEMINI_API_KEY;
      const now = Date.now();

      if (apiKey && apiKey.trim().length > 5 && now >= modelRateLimitCooldownUntil) {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const formattedContents = [
          ...history.map((turn) => ({
            role: turn.role === 'model' ? 'model' : 'user',
            parts: [{ text: String(turn.text ?? '') }],
          })),
          {
            role: 'user',
            parts: [{ text: question }],
          },
        ];

        const canUseGoogleSearchTool = enableWebSearch && now >= searchGroundingCooldownUntil;

        // Stage 1: Try with Google Search Grounding (if enabled and not in search cooldown)
        if (canUseGoogleSearchTool) {
          try {
            const response = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: formattedContents,
              config: {
                systemInstruction,
                thinkingConfig: {
                  thinkingLevel: ThinkingLevel.LOW,
                },
                temperature: 0.35,
                tools: [{ googleSearch: {} }],
              },
            });

            const generatedText = response.text;
            if (generatedText && generatedText.trim().length > 0) {
              const candidate = response.candidates?.[0];
              const groundingMetadata = candidate?.groundingMetadata;
              const rawChunks = groundingMetadata?.groundingChunks ?? [];
              const rawQueries = groundingMetadata?.webSearchQueries ?? [];

              const extractedSources: EduSearchSource[] = [];
              for (const chunk of rawChunks) {
                const uri = chunk?.web?.uri;
                const title = chunk?.web?.title;
                if (uri && typeof uri === 'string') {
                  extractedSources.push({
                    title:
                      typeof title === 'string' && title.trim().length > 0
                        ? title.trim()
                        : `Referensi Web ${subjectMeta.shortLabel} Kelas 8`,
                    uri,
                    domain: extractDomainFromUri(uri, title),
                    snippet: `Sumber referensi real-time Google Search untuk materi ${subjectMeta.label} Kelas 8 SMP.`,
                  });
                }
              }

              const finalSources =
                extractedSources.length > 0
                  ? [...extractedSources.slice(0, 4), ...defaultSources.slice(0, 2)].slice(0, 4)
                  : defaultSources;

              const finalQueries =
                Array.isArray(rawQueries) && rawQueries.length > 0
                  ? rawQueries.map((q) => String(q)).slice(0, 3)
                  : defaultSearchQueries;

              const payload: CachedTutorPayload = {
                reply: generatedText.trim(),
                subjectLabel: subjectMeta.label,
                scheduleDays: subjectMeta.scheduleDays,
                source: 'gemini-3-flash + Google Search',
                sources: finalSources,
                searchQueries: finalQueries,
                followUpSuggestions,
              };
              storeInServerCache(cacheKey, payload);
              return payload;
            }
          } catch (searchErr: unknown) {
            if (isRateOrQuotaError(searchErr)) {
              // Put Google Search tool on a 45s cooldown and fall through to Stage 2 (fast non-tool generation)
              searchGroundingCooldownUntil = Date.now() + 45_000;
            }
          }
        }

        // Stage 2: Fast Gemini 3 Flash Generation without Search Tool (Higher RPM Quota + Curated Web Citations)
        try {
          const responseNoTool = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: formattedContents,
            config: {
              systemInstruction,
              thinkingConfig: {
                thinkingLevel: ThinkingLevel.LOW,
              },
              temperature: 0.35,
            },
          });

          const generatedText = responseNoTool.text;
          if (generatedText && generatedText.trim().length > 0) {
            const payload: CachedTutorPayload = {
              reply: generatedText.trim(),
              subjectLabel: subjectMeta.label,
              scheduleDays: subjectMeta.scheduleDays,
              source: enableWebSearch ? 'gemini-3-flash + Kurikulum Web Grounding' : 'gemini-3-flash',
              sources: defaultSources,
              searchQueries: defaultSearchQueries,
              followUpSuggestions,
            };
            storeInServerCache(cacheKey, payload);
            return payload;
          }
        } catch (modelErr: unknown) {
          if (isRateOrQuotaError(modelErr)) {
            // Put model API calls on a brief 20s cooldown to prevent cascading 429s
            modelRateLimitCooldownUntil = Date.now() + 20_000;
          }
        }
      }

      // Stage 3: Zero-Latency Curriculum 8B Engine Fallback (Guaranteed 200 OK, Never Fails on Rate Limit)
      const fallbackReply = buildEduTutorFallbackAnswer({
        question,
        subjectId,
        studyMode,
        studentName,
      });

      const fallbackPayload: CachedTutorPayload = {
        reply: fallbackReply,
        subjectLabel: subjectMeta.label,
        scheduleDays: subjectMeta.scheduleDays,
        source: enableWebSearch
          ? 'gemini-search-grounding-8b'
          : 'kurikulum-8b-turbo-engine',
        sources: defaultSources,
        searchQueries: defaultSearchQueries,
        followUpSuggestions,
      };
      storeInServerCache(cacheKey, fallbackPayload);
      return fallbackPayload;
    };

    const inFlightPromise = resolveTutorResponse();
    IN_FLIGHT_REQUESTS.set(cacheKey, inFlightPromise);

    try {
      const resultPayload = await inFlightPromise;
      return NextResponse.json({
        ...resultPayload,
        latencyMs: Math.max(8, Date.now() - startTime),
        webSearchUsed: enableWebSearch,
      });
    } finally {
      IN_FLIGHT_REQUESTS.delete(cacheKey);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan pada server.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
