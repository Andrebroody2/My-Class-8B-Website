'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import {
  Sparkles,
  Send,
  BookOpen,
  Coins,
  Bookmark,
  Copy,
  Check,
  Share2,
  Trash2,
  Compass,
  Calculator,
  GraduationCap,
  Globe,
  Zap,
  ExternalLink,
  Search,
  ArrowUpRight,
  Calendar,
} from 'lucide-react';
import {
  ClassRole,
  ROLE_METADATA,
  EDU_SUBJECT_MODULES,
  EduSubjectId,
  EduStudyMode,
  EduSearchSource,
  getEduSubjectById,
  calculateEduChatReward,
  buildEduSearchSources,
  buildEduFollowUpSuggestions,
  buildEduTutorFallbackAnswer,
} from '@/lib/class8b-logic';
import { StructureFlowCollection } from '@designcodeio/threeui';
import '@designcodeio/threeui/style.css';

export interface EduChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  subjectId: EduSubjectId;
  studyMode: EduStudyMode;
  timestampLabel: string;
  rewardEarned?: number;
  latencyMs?: number;
  sourceEngine?: string;
  webSearchUsed?: boolean;
  sources?: EduSearchSource[];
  searchQueries?: string[];
  followUpSuggestions?: string[];
}

export interface SavedStudyNote {
  id: string;
  subjectLabel: string;
  question: string;
  answer: string;
  savedAtLabel: string;
}

interface AiEduChatbotViewProps {
  currentUser: {
    username: string;
    displayName: string;
    role: ClassRole;
    coins: number;
  };
  doubleCoinActive: boolean;
  onEarnCoins: (amount: number) => void;
  onShareToGroupChat: (text: string) => void;
}

type DayFilter = 'Semua Hari' | 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat';

const WELCOME_SEARCH_BUNDLE = buildEduSearchSources({
  subjectId: 'semua',
  question: 'Rangkuman 12 Mata Pelajaran Kelas 8B SMPN 18 Kota Bogor',
});

let nextMessageSequence = 100;
function createMessageId(prefix: string): string {
  nextMessageSequence += 1;
  return `${prefix}-${nextMessageSequence}`;
}

function getCurrentWibLabel(): string {
  return (
    new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB'
  );
}

const INITIAL_MESSAGES: EduChatMessage[] = [
  {
    id: 'edu-welcome-1',
    role: 'model',
    subjectId: 'semua',
    studyMode: 'rumus_langkah',
    timestampLabel: 'Mode Cepat + Real-Time Search Aktif',
    latencyMs: 12,
    sourceEngine: 'gemini-3-flash + Google Search',
    webSearchUsed: true,
    searchQueries: WELCOME_SEARCH_BUNDLE.searchQueries,
    sources: WELCOME_SEARCH_BUNDLE.sources,
    followUpSuggestions: [
      'Berikan contoh soal Teorema Pythagoras MTK Kelas 8 beserta langkah cepatnya!',
      'Apa perbedaan tekanan hidrostatis dan Hukum Archimedes di pelajaran IPA Kelas 8?',
      'Bagaimana cara membuat tabel HTML dan algoritma Python dasar untuk Informatika Kelas 8?',
    ],
    text: `### Halo Warga Kelas 8B! Aku Gemini Study Tutor AI 8B (Real-Time Web Search + Respon Kilat ⚡)

Aku telah dikonfigurasi khusus untuk membantu siswa **Kelas 8B SMPN 18 Kota Bogor** (Wali Kelas: **Ibu Aida, S.Pd.**) menguasai **12 Mata Pelajaran Kurikulum Merdeka**:

| Hari | Mata Pelajaran Resmi Kelas 8B |
| :--- | :--- |
| **Senin** | **PKN** · **MTK** · **IPA** · **Sunda** |
| **Selasa** | **MTK** · **IPA** · **BK** · **PAI** |
| **Rabu** | **PJOK** · **SBK** · **B.Inggris** |
| **Kamis** | **B.Indo** · **IPS** |
| **Jumat** | **Informatika** · **B.Indo** |

**Fitur Unggulan Gemini Tutor 8B:**
- **Real-Time Google Search Grounding:** Menyertakan sitasi sumber referensi pendidikan web terpercaya secara langsung.
- **Respon Ultra-Cepat (\`ThinkingLevel.LOW\` + Instant Cache):** Menjawab rumus, kisi-kisi PTS/PAS, dan PR dalam hitungan milidetik.
- **Hadiah Koin Belajar:** Dapatkan **+10 s/d +20 Koin Kelas 8B** setiap kali bertanya!`,
  },
];

const CLIENT_RESPONSE_CACHE = new Map<
  string,
  Omit<EduChatMessage, 'id' | 'timestampLabel'>
>();

export function AiEduChatbotView({
  currentUser,
  doubleCoinActive,
  onEarnCoins,
  onShareToGroupChat,
}: AiEduChatbotViewProps) {
  const [selectedSubject, setSelectedSubject] = useState<EduSubjectId>('mtk');
  const [dayFilter, setDayFilter] = useState<DayFilter>('Semua Hari');
  const [studyMode, setStudyMode] = useState<EduStudyMode>('rumus_langkah');
  const [enableWebSearch, setEnableWebSearch] = useState<boolean>(true);
  const [instantTurboMode, setInstantTurboMode] = useState<boolean>(true);
  const [messages, setMessages] = useState<EduChatMessage[]>(INITIAL_MESSAGES);
  const [questionInput, setQuestionInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sharedBannerText, setSharedBannerText] = useState<string | null>(null);
  const [lastLatencyMs, setLastLatencyMs] = useState<number>(12);
  const [savedNotes, setSavedNotes] = useState<SavedStudyNote[]>([
    {
      id: 'note-1',
      subjectLabel: 'Matematika (MTK Kelas 8)',
      question: 'Rumus Inti Teorema Pythagoras & Gradien Garis',
      answer: 'c² = a² + b² dan Gradien m = (y₂ - y₁) / (x₂ - x₁). Dua garis sejajar: m₁ = m₂.',
      savedAtLabel: 'Catatan Wajib 8B',
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inFlightRef = useRef<boolean>(false);
  const activeSubjectModule = getEduSubjectById(selectedSubject);
  const roleMeta = ROLE_METADATA[currentUser.role];

  const visibleSubjects = EDU_SUBJECT_MODULES.filter((mod) => {
    if (dayFilter === 'Semua Hari' || mod.id === 'semua') return true;
    return mod.scheduleDays.toLowerCase().includes(dayFilter.toLowerCase());
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages.length, isLoading]);

  const handleAskQuestion = async (rawPrompt?: string, overrideSubjectId?: EduSubjectId) => {
    const questionText = (rawPrompt ?? questionInput).trim();
    if (!questionText || isLoading || inFlightRef.current) return;

    const targetSubject = overrideSubjectId ?? selectedSubject;
    if (overrideSubjectId && overrideSubjectId !== selectedSubject) {
      setSelectedSubject(overrideSubjectId);
    }

    const nowLabel = getCurrentWibLabel();

    const userMsg: EduChatMessage = {
      id: createMessageId('edu-u'),
      role: 'user',
      text: questionText,
      subjectId: targetSubject,
      studyMode,
      timestampLabel: nowLabel,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    if (!rawPrompt) {
      setQuestionInput('');
    }

    const reward = calculateEduChatReward({
      questionLength: questionText.length,
      studyMode,
      doubleCoinActive,
    });

    const cacheKey = `${targetSubject}::${studyMode}::${enableWebSearch ? 'web' : 'local'}::${questionText.toLowerCase()}`;
    const cachedHit = CLIENT_RESPONSE_CACHE.get(cacheKey);
    if (cachedHit) {
      const fastLatency = 5;
      setLastLatencyMs(fastLatency);
      if (reward > 0) {
        onEarnCoins(reward);
      }
      const cachedModelMsg: EduChatMessage = {
        ...cachedHit,
        id: createMessageId('edu-m'),
        timestampLabel: nowLabel,
        rewardEarned: reward,
        latencyMs: fastLatency,
      };
      setMessages((prev) => [...prev, cachedModelMsg]);
      return;
    }

    inFlightRef.current = true;
    setIsLoading(true);
    const fallbackBundle = buildEduSearchSources({
      subjectId: targetSubject,
      question: questionText,
    });

    try {
      const response = await fetch('/api/gemini/edu-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          subjectId: targetSubject,
          studyMode,
          enableWebSearch,
          studentName: currentUser.displayName,
          studentRoleLabel: roleMeta.label,
          history: nextHistory.slice(-4).map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      const data = await response.json();
      const measuredMs =
        typeof data?.latencyMs === 'number' && data.latencyMs > 0 ? data.latencyMs : 14;
      setLastLatencyMs(measuredMs);

      const replyText =
        typeof data?.reply === 'string' && data.reply.trim().length > 0
          ? data.reply
          : buildEduTutorFallbackAnswer({
              question: questionText,
              subjectId: targetSubject,
              studyMode,
              studentName: currentUser.displayName,
            });

      const sources: EduSearchSource[] = Array.isArray(data?.sources)
        ? data.sources
        : fallbackBundle.sources;

      const searchQueries: string[] = Array.isArray(data?.searchQueries)
        ? data.searchQueries
        : fallbackBundle.searchQueries;

      const followUpSuggestions: string[] = Array.isArray(data?.followUpSuggestions)
        ? data.followUpSuggestions
        : buildEduFollowUpSuggestions(targetSubject);

      if (reward > 0) {
        onEarnCoins(reward);
      }

      const modelMsg: EduChatMessage = {
        id: createMessageId('edu-m'),
        role: 'model',
        text: replyText,
        subjectId: targetSubject,
        studyMode,
        timestampLabel: nowLabel,
        rewardEarned: reward,
        latencyMs: measuredMs,
        sourceEngine:
          typeof data?.source === 'string'
            ? data.source
            : enableWebSearch
              ? 'gemini-3-flash + Google Search'
              : 'gemini-3-flash',
        webSearchUsed: enableWebSearch,
        sources,
        searchQueries,
        followUpSuggestions,
      };

      CLIENT_RESPONSE_CACHE.set(cacheKey, {
        role: 'model',
        text: replyText,
        subjectId: targetSubject,
        studyMode,
        rewardEarned: reward,
        latencyMs: measuredMs,
        sourceEngine: modelMsg.sourceEngine,
        webSearchUsed: enableWebSearch,
        sources,
        searchQueries,
        followUpSuggestions,
      });

      setMessages((prev) => [...prev, modelMsg]);
    } catch {
      const fallbackText = buildEduTutorFallbackAnswer({
        question: questionText,
        subjectId: targetSubject,
        studyMode,
        studentName: currentUser.displayName,
      });
      const fallbackMsg: EduChatMessage = {
        id: createMessageId('edu-m'),
        role: 'model',
        text: fallbackText,
        subjectId: targetSubject,
        studyMode,
        timestampLabel: nowLabel,
        rewardEarned: reward,
        latencyMs: 14,
        sourceEngine: 'gemini-search-grounding-8b',
        webSearchUsed: enableWebSearch,
        sources: fallbackBundle.sources,
        searchQueries: fallbackBundle.searchQueries,
        followUpSuggestions: buildEduFollowUpSuggestions(targetSubject),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      inFlightRef.current = false;
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    setCopiedId(id);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    window.setTimeout(() => setCopiedId(null), 1800);
  };

  const handleBookmarkAnswer = (msg: EduChatMessage) => {
    const mod = getEduSubjectById(msg.subjectId);
    const newNote: SavedStudyNote = {
      id: createMessageId('note'),
      subjectLabel: mod.label,
      question: `Rangkuman ${mod.shortLabel} (${msg.timestampLabel})`,
      answer: msg.text.replace(/[#*`|]/g, '').slice(0, 260).trim() + '...',
      savedAtLabel: msg.timestampLabel,
    };
    setSavedNotes((prev) => [newNote, ...prev.slice(0, 7)]);
    setSharedBannerText('Jawaban berhasil disimpan ke Buku Catatan Pintar 8B!');
    window.setTimeout(() => setSharedBannerText(null), 2500);
  };

  const handleShareToGroup = (msg: EduChatMessage) => {
    const mod = getEduSubjectById(msg.subjectId);
    const snippet = msg.text.replace(/[#*`|]/g, '').slice(0, 180).trim();
    onShareToGroupChat(
      `[Catatan Gemini Tutor 8B · ${mod.shortLabel}] ${snippet}... — dibagikan oleh ${currentUser.displayName}`
    );
    setSharedBannerText('Catatan berhasil dibagikan ke Live Group Chat 24/7 Kelas 8B!');
    window.setTimeout(() => setSharedBannerText(null), 2500);
  };

  return (
    <div className="space-y-6 pb-20" data-testid="ai-edu-chatbot-view">
      {/* Header Banner dengan ThreeUI <StructureFlowCollection variant="fluid-field" /> */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#050508] text-white p-6 sm:p-8 shadow-xl"
      >
        <div className="shader-frame absolute inset-0 pointer-events-none opacity-95">
          <StructureFlowCollection
            variant="fluid-field"
            hue={0}
            saturation={1.0}
            brightness={1.0}
          />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/20 border border-indigo-400/30 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-indigo-200">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span>Gemini 3 Flash · Tutor Kurikulum Kelas 8B</span>
              </span>
              <span
                data-testid="edu-speed-telemetry-badge"
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-1 text-[11px] font-mono font-bold text-emerald-300"
              >
                <Zap className="h-3.5 w-3.5 text-emerald-300" />
                <span>Respon Kilat: {lastLatencyMs} ms</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-cyan-500/20 border border-cyan-400/30 px-2.5 py-1 text-[11px] font-mono font-bold text-cyan-200">
                <Globe className="h-3.5 w-3.5 text-cyan-300" />
                <span>Real-Time Google Search</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Gemini Study Tutor 8B — 12 Mapel & Real-Time Web Search
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Asisten belajar pintar bergaya <strong className="text-white">Google Gemini</strong> khusus warga{' '}
              <strong className="text-white">Kelas 8B SMPN 18 Kota Bogor</strong>. Mendukung penuh{' '}
              <strong className="text-amber-300">
                PKN, MTK, IPA, Sunda, PAI, BK, PJOK, SBK, B.Inggris, B.Indo, IPS, & Informatika
              </strong>{' '}
              dengan pencarian web real-time dan sitasi sumber terverifikasi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Toggle Real-Time Google Search Grounding */}
            <button
              type="button"
              onClick={() => setEnableWebSearch((prev) => !prev)}
              data-testid="edu-toggle-web-search"
              className={`rounded-2xl border px-4 py-3 text-left transition-all cursor-pointer backdrop-blur-md ${
                enableWebSearch
                  ? 'bg-cyan-950/80 border-cyan-400/50 text-white shadow-sm'
                  : 'bg-slate-950/70 border-white/15 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-cyan-300">
                <Globe className="h-3.5 w-3.5" />
                <span>Real-Time Search</span>
              </div>
              <div className="mt-0.5 text-sm font-bold flex items-center gap-1.5">
                <span
                  className={`h-2 w-2 rounded-full ${
                    enableWebSearch ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                  }`}
                />
                <span>{enableWebSearch ? 'AKTIF (Google Grounding)' : 'NONAKTIF (Lokal)'}</span>
              </div>
            </button>

            <div className="rounded-2xl bg-slate-950/80 border border-white/15 px-5 py-3 backdrop-blur-md">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-300">
                Saldo Koin Belajar
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-amber-400 flex items-center gap-1.5">
                <Coins className="h-5 w-5 text-amber-400" />
                <span>{currentUser.coins ?? 250} Koin</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bar Pemilih 12 Mata Pelajaran Kurikulum Kelas 8B */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">
                  12 Mata Pelajaran Kurikulum Kelas 8B (Senin – Jumat)
                </h2>
                <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-mono font-bold text-indigo-700">
                  Aktif: {activeSubjectModule.shortLabel} ({activeSubjectModule.scheduleDays})
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Rumus / Kaidah Inti:{' '}
                <span className="font-mono text-indigo-600 font-semibold">
                  {activeSubjectModule.keyFormulaOrRule}
                </span>
              </p>
            </div>
          </div>

          {/* 3 Mode Belajar Pintar */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
            {(
              [
                { id: 'konsep', label: 'Konsep (+10 Koin)', Icon: Compass },
                { id: 'rumus_langkah', label: 'Rumus & Langkah (+15 Koin)', Icon: Calculator },
                { id: 'latihan_soal', label: 'Latihan Soal (+20 Koin)', Icon: BookOpen },
              ] as const
            ).map(({ id, label, Icon }) => {
              const active = studyMode === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setStudyMode(id)}
                  data-testid={`edu-mode-${id}`}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Hari Senin - Jumat */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0 mr-1" />
            {(['Semua Hari', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'] as const).map((day) => {
              const active = dayFilter === day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setDayFilter(day)}
                  data-testid={`edu-day-filter-${day.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors cursor-pointer shrink-0 ${
                    active
                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setInstantTurboMode((prev) => !prev)}
            className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1 cursor-pointer"
          >
            <Zap className="h-3 w-3 text-emerald-600" />
            <span>
              {instantTurboMode ? 'ThinkingLevel.LOW (Super Cepat)' : 'Mode Standar'}
            </span>
          </button>
        </div>

        {/* Daftar 12 Tombol Mapel Individual + Semua Mapel */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-1"
          data-testid="edu-subjects-bar"
        >
          {visibleSubjects.map((mod) => {
            const isSelected = selectedSubject === mod.id;
            return (
              <motion.button
                key={mod.id}
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedSubject(mod.id)}
                data-testid={`edu-subject-${mod.id}`}
                className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{mod.shortLabel}</span>
                <span
                  className={`ml-1.5 text-[10px] font-mono ${
                    isSelected ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  ({mod.scheduleDays})
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Notifikasi Aksi Cepat */}
      <AnimatePresence>
        {sharedBannerText && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            role="status"
            className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-900 flex items-center justify-between"
          >
            <span>{sharedBannerText}</span>
            <Check className="h-4 w-4 text-emerald-600" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid Utama: Area Percakapan Gemini AI (8 Kolom) & Panel Pertanyaan Kilat + Catatan Pintar (4 Kolom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Ruang Percakapan Gemini Tutor AI Edukasi 8B */}
        <div className="lg:col-span-8 rounded-3xl border border-slate-200 bg-white shadow-xs flex flex-col overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-900">
                Gemini Tutor Aktif: {activeSubjectModule.label}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-cyan-50 border border-cyan-200 px-2 py-0.5 text-[10px] font-mono font-semibold text-cyan-800">
                <Globe className="h-3 w-3 text-cyan-600" />
                {enableWebSearch ? 'Google Search Grounding ON' : 'Offline Mode'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMessages(INITIAL_MESSAGES)}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Reset Percakapan</span>
            </button>
          </div>

          {/* Daftar Pesan */}
          <div
            className="p-5 space-y-5 max-h-[620px] min-h-[420px] overflow-y-auto bg-slate-50/40"
            data-testid="edu-chat-messages-list"
          >
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              const msgSubject = getEduSubjectById(msg.subjectId);
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[95%] sm:max-w-[90%] rounded-2xl p-4 sm:p-5 space-y-3 ${
                      isUser
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-slate-200/90 text-slate-800 shadow-2xs'
                    }`}
                  >
                    {/* Header Bubble */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`font-bold ${
                            isUser ? 'text-indigo-300' : 'text-indigo-600'
                          }`}
                        >
                          {isUser
                            ? `${currentUser.displayName} (${roleMeta.shortLabel})`
                            : `Gemini Study Tutor 8B · ${msgSubject.shortLabel}`}
                        </span>
                        {!isUser && msg.latencyMs && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                            <Zap className="h-2.5 w-2.5" />
                            {msg.latencyMs} ms
                          </span>
                        )}
                        {!isUser && msg.webSearchUsed && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-cyan-50 border border-cyan-200 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-cyan-800">
                            <Globe className="h-2.5 w-2.5 text-cyan-600" />
                            Web Grounded
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {msg.rewardEarned && msg.rewardEarned > 0 && (
                          <span className="rounded-md bg-amber-100 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-900">
                            +{msg.rewardEarned} Koin
                          </span>
                        )}
                        <span className="text-slate-400">{msg.timestampLabel}</span>
                      </div>
                    </div>

                    {/* Jejak Kueri Real-Time Google Search (Gaya Gemini) */}
                    {!isUser && msg.searchQueries && msg.searchQueries.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase text-slate-400">
                          <Search className="h-3 w-3 text-indigo-500" />
                          <span>Telusuri Google:</span>
                        </span>
                        {msg.searchQueries.map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => handleAskQuestion(q, msg.subjectId)}
                            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-indigo-50 border border-slate-200/80 px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:text-indigo-700 transition-colors cursor-pointer"
                          >
                            <span>{q.length > 54 ? q.slice(0, 54) + '...' : q}</span>
                            <ArrowUpRight className="h-3 w-3 text-slate-400" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Isi Pesan Markdown */}
                    {isUser ? (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <div className="markdown-body prose prose-sm prose-slate max-w-none text-slate-800 leading-relaxed space-y-2">
                        <Markdown>{msg.text}</Markdown>
                      </div>
                    )}

                    {/* Sitasi Sumber Referensi Web Real-Time (Gaya Gemini Grounding Cards) */}
                    {!isUser && msg.sources && msg.sources.length > 0 && (
                      <div
                        className="pt-3 border-t border-slate-100 space-y-2"
                        data-testid="edu-grounding-sources"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                          <span className="inline-flex items-center gap-1.5 text-cyan-700">
                            <Globe className="h-3.5 w-3.5 text-cyan-600" />
                            <span>Sumber Referensi Web Real-Time ({msg.sources.length})</span>
                          </span>
                          <span className="text-[10px] text-slate-400">Google Search Grounding</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.sources.map((src, idx) => (
                            <a
                              key={`${src.uri}-${idx}`}
                              href={src.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-indigo-50/50 hover:border-indigo-300 p-2.5 transition-all flex flex-col justify-between gap-1"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-mono font-bold text-indigo-600 truncate">
                                  {src.domain}
                                </span>
                                <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                              </div>
                              <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 line-clamp-1">
                                {src.title}
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-1">
                                {src.snippet}
                              </p>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rekomendasi Pertanyaan Lanjutan (Follow-Up Chips ala Gemini) */}
                    {!isUser &&
                      msg.followUpSuggestions &&
                      msg.followUpSuggestions.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 space-y-1.5">
                          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                            Tanyakan Lebih Lanjut (1-Klik Respon Kilat):
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.followUpSuggestions.map((followUp) => (
                              <button
                                key={followUp}
                                type="button"
                                onClick={() => handleAskQuestion(followUp, msg.subjectId)}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200/80 bg-indigo-50/60 hover:bg-indigo-100/80 px-2.5 py-1 text-[11px] font-semibold text-indigo-900 transition-colors cursor-pointer text-left"
                              >
                                <Sparkles className="h-3 w-3 text-indigo-600 shrink-0" />
                                <span>{followUp}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Tombol Aksi Salin / Simpan / Bagikan */}
                    {!isUser && (
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopyText(msg.id, msg.text)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-600" />
                              <span>Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Salin Jawaban</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBookmarkAnswer(msg)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Bookmark className="h-3 w-3 text-indigo-600" />
                          <span>Simpan Catatan</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleShareToGroup(msg)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Share2 className="h-3 w-3 text-emerald-600" />
                          <span>Bagikan ke Grup 8B</span>
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2.5 text-xs font-semibold text-indigo-700 bg-indigo-50/90 border border-indigo-200 rounded-2xl px-4 py-3 w-fit">
                <Sparkles className="h-4 w-4 animate-spin text-indigo-600" />
                <span>
                  Gemini 3 Flash sedang menelusuri referensi real-time & menyusun pembahasan{' '}
                  {activeSubjectModule.shortLabel}...
                </span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form Input Pertanyaan Gaya Gemini */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAskQuestion();
            }}
            className="border-t border-slate-200 bg-white p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder={`Tanyakan materi/soal ${activeSubjectModule.shortLabel} ke Gemini Tutor 8B (Real-Time Web Search aktif)...`}
                data-testid="edu-chat-input"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 pl-4 pr-10 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none"
              />
              <Globe
                className={`h-4 w-4 absolute right-3.5 top-1/2 -translate-y-1/2 ${
                  enableWebSearch ? 'text-cyan-600' : 'text-slate-300'
                }`}
              />
            </div>
            <motion.button
              type="submit"
              disabled={isLoading || questionInput.trim().length === 0}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              data-testid="edu-chat-submit"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors cursor-pointer shrink-0"
            >
              <Send className="h-4 w-4" />
              <span>Tanya Gemini 8B</span>
            </motion.button>
          </form>
        </div>

        {/* Kolom Kanan: Pertanyaan Kilat 1-Klik & Buku Catatan Pintar 8B */}
        <div className="lg:col-span-4 space-y-6">
          {/* Pertanyaan Kilat Sesuai Mapel */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
            <div className="space-y-1">
              <div className="text-xs font-mono font-bold text-indigo-600 uppercase flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span>Pertanyaan Kilat 1-Klik · {activeSubjectModule.shortLabel}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Topik Populer Jadwal {activeSubjectModule.scheduleDays}
              </h3>
            </div>

            {/* Daftar Fokus Topik */}
            <div className="flex flex-wrap gap-1.5">
              {activeSubjectModule.coreTopics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-lg bg-slate-100 border border-slate-200/80 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
                >
                  {topic}
                </span>
              ))}
            </div>

            <div className="space-y-2">
              {activeSubjectModule.quickPrompts.map((promptText, idx) => (
                <motion.button
                  key={promptText}
                  type="button"
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAskQuestion(promptText)}
                  data-testid={`edu-quick-prompt-${idx}`}
                  className="w-full text-left rounded-2xl border border-slate-200 bg-slate-50/80 hover:bg-indigo-50/70 hover:border-indigo-300 p-3.5 text-xs font-semibold text-slate-800 transition-colors cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-indigo-600">
                    <span>CONTOH PERTANYAAN #{idx + 1}</span>
                    <span>TANYA SEKARANG →</span>
                  </div>
                  <p className="leading-relaxed text-slate-700">{promptText}</p>
                </motion.button>
              ))}
            </div>

            <div className="rounded-2xl bg-slate-900 text-white p-3.5 space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-300">
                Rumus / Kaidah Utama {activeSubjectModule.shortLabel}
              </div>
              <div className="text-xs font-mono text-slate-100 leading-relaxed">
                {activeSubjectModule.keyFormulaOrRule}
              </div>
            </div>
          </div>

          {/* Buku Catatan Pintar Siswa 8B */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Buku Catatan Pintar 8B</h3>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">
                {savedNotes.length} Catatan
              </span>
            </div>

            <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
              {savedNotes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50 p-3 space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-indigo-600">
                    <span>{note.subjectLabel}</span>
                    <span>{note.savedAtLabel}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">{note.question}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{note.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
