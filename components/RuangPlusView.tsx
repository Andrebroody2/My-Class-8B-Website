'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Award,
  HeartHandshake,
  FileText,
  Copy,
  Send,
  CheckCircle2,
  Coins,
  Lightbulb,
  Users,
  Shuffle,
  Calculator,
  Trophy,
  Sparkles,
} from 'lucide-react';
import {
  KUDOS_CATEGORIES,
  KudosCategoryId,
  calculatePomodoroCoinReward,
  formatCountdownTimer,
  generateSuratIzinText,
  generateBalancedStudyGroups,
  calculateTargetRaporScore,
  DAILY_CLASS_QUESTS_8B,
  ClassRole,
} from '@/lib/class8b-logic';

export interface KudosEntry {
  id: string;
  senderName: string;
  recipientName: string;
  categoryId: KudosCategoryId;
  note: string;
  timeLabel: string;
}

export interface AspirationItem {
  id: string;
  authorLabel: string;
  topic: string;
  message: string;
  timeLabel: string;
}

interface RuangPlusViewProps {
  currentUser: {
    username: string;
    displayName: string;
    role: ClassRole;
    coins: number;
  };
  doubleCoinActive: boolean;
  onEarnCoins: (amount: number) => void;
  kudosList: KudosEntry[];
  onSendKudos: (entry: Omit<KudosEntry, 'id' | 'timeLabel'>) => void;
  aspirations: AspirationItem[];
  onAddAspiration: (item: Omit<AspirationItem, 'id' | 'timeLabel'>) => void;
  onSubmitSuratIzin: (params: {
    studentName: string;
    reasonType: 'Sakit' | 'Izin Keluarga' | 'Dispensasi Lomba / Sekolah';
    detailReason: string;
    letterText: string;
  }) => void;
  onBroadcastToGroupChat?: (text: string) => void;
}

const DEFAULT_CLASSMATE_ROSTER = [
  'Rizky Pratama',
  'Siti Nurhaliza',
  'Naufal Akbar',
  'Alya Rahmawati',
  'Dika Saputra',
  'Putri Maharani',
  'Fajar Siddiq',
  'Nabila Azzahra',
  'Rafa Aditya',
  'Zahra Amelia',
  'Gilang Ramadhan',
  'Kirana Lestari',
];

const OFFICIAL_8B_SUBJECTS = [
  'PKN (Senin)',
  'MTK (Senin & Selasa)',
  'IPA (Senin & Selasa)',
  'Basa Sunda (Senin)',
  'BK (Selasa)',
  'PAI (Selasa)',
  'PJOK (Rabu)',
  'SBK (Rabu)',
  'B. Inggris (Rabu)',
  'B. Indonesia (Kamis & Jumat)',
  'IPS (Kamis)',
  'Informatika (Jumat)',
];

export function RuangPlusView({
  currentUser,
  doubleCoinActive,
  onEarnCoins,
  kudosList,
  onSendKudos,
  aspirations,
  onAddAspiration,
  onSubmitSuratIzin,
  onBroadcastToGroupChat,
}: RuangPlusViewProps) {
  const [moduleFilter, setModuleFilter] = useState<
    'semua' | 'misi_kelompok' | 'rapor_pomodoro' | 'izin_kudos'
  >('semua');

  // =========================================================================
  // FITUR ANAK 8B BARU #1: GENERATOR KELOMPOK BELAJAR & PIKET ACAK ADIL
  // =========================================================================
  const [rosterText, setRosterText] = useState(DEFAULT_CLASSMATE_ROSTER.join(', '));
  const [groupCount, setGroupCount] = useState<number>(3);
  const [groupSubject, setGroupSubject] = useState<string>('IPA (Praktikum Senin & Selasa)');
  const [shuffledRoster, setShuffledRoster] = useState<string[]>(DEFAULT_CLASSMATE_ROSTER);
  const [groupNotice, setGroupNotice] = useState<string>('');

  const parsedNames = rosterText
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const activeTeams = generateBalancedStudyGroups({
    namesInput: shuffledRoster.length > 0 ? shuffledRoster : parsedNames,
    groupCount,
    subjectLabel: groupSubject,
  });

  const handleShuffleTeams = () => {
    const base = parsedNames.length >= 2 ? [...parsedNames] : [...DEFAULT_CLASSMATE_ROSTER];
    for (let i = base.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [base[i], base[j]] = [base[j], base[i]];
    }
    setShuffledRoster(base);
    setGroupNotice(
      `Berhasil mengacak ${base.length} siswa Kelas 8B menjadi ${groupCount} kelompok adil untuk ${groupSubject}!`
    );
  };

  const handleShareGroupsToChat = () => {
    const summaryText = activeTeams
      .map(
        (t) =>
          `${t.teamName}: ${t.members.map((m) => `${m.name} (${m.roleInTeam})`).join(', ')}`
      )
      .join(' | ');
    if (onBroadcastToGroupChat) {
      onBroadcastToGroupChat(`[PEMBAGIAN KELOMPOK 8B — ${groupSubject}]: ${summaryText}`);
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(summaryText).catch(() => {});
    }
    setGroupNotice('Susunan kelompok berhasil disalin & dikirim ke Live Group Chat 24/7 Kelas 8B!');
  };

  // =========================================================================
  // FITUR ANAK 8B BARU #2: KALKULATOR TARGET NILAI RAPOR & PREDIKAT PAS 8B
  // =========================================================================
  const [raporSubject, setRaporSubject] = useState<string>(OFFICIAL_8B_SUBJECTS[1]);
  const [tugasAvg, setTugasAvg] = useState<number>(88);
  const [uhAvg, setUhAvg] = useState<number>(86);
  const [ptsScore, setPtsScore] = useState<number>(85);
  const [pasTarget, setPasTarget] = useState<number>(92);
  const [savedTargets, setSavedTargets] = useState<
    { subject: string; finalScore: number; predicate: string }[]
  >([
    { subject: 'MTK (Senin & Selasa)', finalScore: 90.4, predicate: 'A (Sangat Baik)' },
    { subject: 'Informatika (Jumat)', finalScore: 92.0, predicate: 'A (Sangat Baik)' },
  ]);
  const [raporNotice, setRaporNotice] = useState<string>('');

  const raporResult = calculateTargetRaporScore({
    tugasAvg,
    uhAvg,
    ptsScore,
    pasTarget,
  });

  const handleSaveRaporTarget = () => {
    setSavedTargets((prev) => [
      {
        subject: raporSubject,
        finalScore: raporResult.finalScore,
        predicate: raporResult.predicate,
      },
      ...prev.filter((item) => item.subject !== raporSubject),
    ]);
    onEarnCoins(10);
    setRaporNotice(
      `Target Rapor ${raporSubject} (${raporResult.finalScore} · ${raporResult.predicate}) disimpan! +10 Koin.`
    );
  };

  // =========================================================================
  // FITUR ANAK 8B BARU #3: PAPAN TANTANGAN MISI HARIAN KELAS 8B (DAILY QUESTS)
  // =========================================================================
  const [completedQuestIds, setCompletedQuestIds] = useState<string[]>(['qst-senin']);
  const [questNotice, setQuestNotice] = useState<string>('');

  const handleClaimQuest = (questId: string, title: string, coinReward: number) => {
    if (completedQuestIds.includes(questId)) return;
    const finalReward = doubleCoinActive ? coinReward * 2 : coinReward;
    setCompletedQuestIds((prev) => [...prev, questId]);
    onEarnCoins(finalReward);
    setQuestNotice(`Misi "${title}" selesai! Kamu menerima +${finalReward} Koin Kelas 8B.`);
  };

  const totalQuestXp = completedQuestIds.reduce((acc, qId) => {
    const found = DAILY_CLASS_QUESTS_8B.find((q) => q.id === qId);
    return acc + (found ? found.xpReward : 0);
  }, 120);

  // =========================================================================
  // FITUR #4: TIMER FOKUS BELAJAR POMODORO 8B
  // =========================================================================
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [focusSubject, setFocusSubject] = useState<string>('MTK (Senin & Selasa)');
  const [focusSessionsDone, setFocusSessionsDone] = useState<number>(0);
  const [pomodoroNotice, setPomodoroNotice] = useState<string>('');

  useEffect(() => {
    if (!isRunning) return;
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          const reward = calculatePomodoroCoinReward(durationMinutes, doubleCoinActive);
          onEarnCoins(reward);
          setFocusSessionsDone((s) => s + 1);
          setPomodoroNotice(
            `Sesi Fokus ${focusSubject} (${durationMinutes} menit) selesai! +${reward} Koin masuk ke saldo kamu.`
          );
          return durationMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isRunning, durationMinutes, doubleCoinActive, focusSubject, onEarnCoins]);

  const handleSelectDuration = (mins: number) => {
    setIsRunning(false);
    setDurationMinutes(mins);
    setSecondsLeft(mins * 60);
    setPomodoroNotice('');
  };

  const handleCompleteFocusNow = () => {
    setIsRunning(false);
    const reward = calculatePomodoroCoinReward(durationMinutes, doubleCoinActive);
    onEarnCoins(reward);
    setFocusSessionsDone((s) => s + 1);
    setSecondsLeft(durationMinutes * 60);
    setPomodoroNotice(
      `Target Belajar ${focusSubject} tuntas! +${reward} Koin berhasil ditambahkan ke dompet Kelas 8B kamu.`
    );
  };

  const totalSec = durationMinutes * 60;
  const progressRatio = totalSec > 0 ? (totalSec - secondsLeft) / totalSec : 0;
  const ringCircumference = 2 * Math.PI * 54;
  const ringDashOffset = ringCircumference * (1 - progressRatio);

  // =========================================================================
  // FITUR #5: PAPAN APRESIASI TEMAN (KUDOS BOARD 8B)
  // =========================================================================
  const [kudosRecipient, setKudosRecipient] = useState('');
  const [kudosCat, setKudosCat] = useState<KudosCategoryId>('bantu_pr');
  const [kudosNote, setKudosNote] = useState('');
  const [kudosNotice, setKudosNotice] = useState('');

  const handleKudosSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (kudosRecipient.trim().length < 2 || kudosNote.trim().length < 3) return;
    onSendKudos({
      senderName: currentUser.displayName,
      recipientName: kudosRecipient.trim(),
      categoryId: kudosCat,
      note: kudosNote.trim(),
    });
    onEarnCoins(5);
    setKudosRecipient('');
    setKudosNote('');
    setKudosNotice('Apresiasi terkirim ke Papan Kudos Kelas 8B! Kamu mendapat +5 Koin.');
  };

  // =========================================================================
  // FITUR #6: SURAT IZIN DIGITAL KE BU AIDA & KOTAK ASPIRASI 8B
  // =========================================================================
  const [izinStudentName, setIzinStudentName] = useState(currentUser.displayName);
  const [izinDate, setIzinDate] = useState('Hari Ini · 14 Nov 2026');
  const [izinReasonType, setIzinReasonType] = useState<
    'Sakit' | 'Izin Keluarga' | 'Dispensasi Lomba / Sekolah'
  >('Sakit');
  const [izinDetail, setIzinDetail] = useState('Istirahat di rumah sesuai anjuran dokter');
  const [izinParentName, setIzinParentName] = useState('Orang Tua / Wali Murid');
  const [izinNotice, setIzinNotice] = useState('');

  const [aspTopic, setAspTopic] = useState('Kebersihan & Piket Kelas');
  const [aspText, setAspText] = useState('');
  const [aspAnon, setAspAnon] = useState(false);
  const [aspNotice, setAspNotice] = useState('');

  const formattedLetter = generateSuratIzinText({
    studentName: izinStudentName,
    dateLabel: izinDate,
    reasonType: izinReasonType,
    detailReason: izinDetail,
    parentName: izinParentName,
  });

  const handleCopyLetter = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(formattedLetter).catch(() => {});
    }
    setIzinNotice('Naskah surat izin resmi untuk Ibu Aida berhasil disalin!');
  };

  const handleSendLetter = () => {
    onSubmitSuratIzin({
      studentName: izinStudentName.trim() || currentUser.displayName,
      reasonType: izinReasonType,
      detailReason: izinDetail.trim() || '-',
      letterText: formattedLetter,
    });
    setIzinNotice(
      'Surat izin terkirim otomatis ke Pesan Pribadi Ibu Aida (Wali Kelas) & rekap Presensi 8B!'
    );
  };

  const handleAddAspirationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aspText.trim().length < 5) return;
    onAddAspiration({
      authorLabel: aspAnon ? 'Warga Kelas 8B (Anonim)' : currentUser.displayName,
      topic: aspTopic,
      message: aspText.trim(),
    });
    setAspText('');
    setAspNotice('Aspirasi kamu telah dicatat ke Papan Ide Kelas 8B!');
  };

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-semibold text-indigo-700 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>6 Modul Produktivitas &amp; Kolaborasi Eksklusif Warga Kelas 8B</span>
          </div>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Ruang Plus 8B: Kelompok, Target Rapor, Misi, Pomodoro &amp; Surat Izin
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-mono font-bold text-amber-800 tabular-nums flex items-center gap-1.5">
            <Coins className="h-4 w-4 text-amber-500" />
            <span>{currentUser.coins} Koin</span>
            <span className="text-slate-300">|</span>
            <span>{totalQuestXp} XP</span>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto rounded-xl bg-slate-200/75 p-1">
            {(
              [
                { id: 'semua', label: 'Semua (6 Fitur)' },
                { id: 'misi_kelompok', label: 'Kelompok & Misi' },
                { id: 'rapor_pomodoro', label: 'Rapor & Pomodoro' },
                { id: 'izin_kudos', label: 'Surat Izin & Kudos' },
              ] as const
            ).map((tab) => {
              const active = moduleFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setModuleFilter(tab.id)}
                  className={`relative min-h-[38px] rounded-lg px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active ? 'text-white' : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="ruangPlusFilterPill"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="absolute inset-0 rounded-lg bg-slate-900"
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =====================================================================
          BARIS 1 (3 FITUR BARU KHUSUS ANAK 8B):
          1. GENERATOR KELOMPOK BELAJAR ACAK ADIL
          2. PAPAN MISI HARIAN KELAS 8B (SENIN - JUMAT)
         ===================================================================== */}
      {(moduleFilter === 'semua' || moduleFilter === 'misi_kelompok') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* FITUR BARU ANAK 8B #1: GENERATOR KELOMPOK BELAJAR & PIKET ACAK ADIL */}
          <section className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="text-xs font-semibold text-indigo-700">
                  Fitur Eksklusif Anak 8B #1
                </div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-slate-800" />
                  <span>Generator Kelompok Belajar &amp; Tugas Acak Adil</span>
                </h2>
              </div>
              <span className="font-mono text-xs font-bold text-slate-600 tabular-nums">
                {parsedNames.length} Siswa · {groupCount} Tim
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label
                  htmlFor="group-subject-select"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Mata Pelajaran / Proyek Kelompok
                </label>
                <select
                  id="group-subject-select"
                  value={groupSubject}
                  onChange={(e) => setGroupSubject(e.target.value)}
                  className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900"
                >
                  <option value="IPA (Praktikum Senin & Selasa)">
                    IPA (Praktikum Senin &amp; Selasa)
                  </option>
                  <option value="MTK (Diskusi Pythagoras & Gradien)">
                    MTK (Diskusi Pythagoras &amp; Gradien)
                  </option>
                  <option value="PKN & Basa Sunda (Hari Senin)">
                    PKN &amp; Basa Sunda (Hari Senin)
                  </option>
                  <option value="BK & PAI (Diskusi Hari Selasa)">
                    BK &amp; PAI (Diskusi Hari Selasa)
                  </option>
                  <option value="PJOK, SBK & B. Inggris (Hari Rabu)">
                    PJOK, SBK &amp; B. Inggris (Hari Rabu)
                  </option>
                  <option value="B. Indo & IPS (Hari Kamis)">
                    B. Indo &amp; IPS (Hari Kamis)
                  </option>
                  <option value="Informatika & B. Indo (Hari Jumat)">
                    Informatika &amp; B. Indo (Hari Jumat)
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="group-count-select"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Jumlah Kelompok
                </label>
                <select
                  id="group-count-select"
                  value={groupCount}
                  onChange={(e) => setGroupCount(Number(e.target.value))}
                  className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900"
                >
                  <option value={2}>2 Kelompok</option>
                  <option value={3}>3 Kelompok</option>
                  <option value={4}>4 Kelompok</option>
                  <option value={5}>5 Kelompok</option>
                  <option value={6}>6 Kelompok</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="roster-names-input"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Daftar Nama Siswa (pisahkan dengan koma)
              </label>
              <textarea
                id="roster-names-input"
                rows={2}
                value={rosterText}
                onChange={(e) => {
                  setRosterText(e.target.value);
                  setShuffledRoster(
                    e.target.value
                      .split(/[\n,]+/)
                      .map((s) => s.trim())
                      .filter(Boolean)
                  );
                }}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
              />
            </div>

            {groupNotice && (
              <div
                role="status"
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-900"
              >
                {groupNotice}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2.5">
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={handleShuffleTeams}
                className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
              >
                <Shuffle className="h-4 w-4 text-amber-400" />
                <span>Acak Ulang Kelompok</span>
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={handleShareGroupsToChat}
                className="min-h-[44px] inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5 text-indigo-600" />
                <span>Salin &amp; Kirim ke Live Chat 8B</span>
              </motion.button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {activeTeams.map((team) => (
                <div
                  key={team.teamNumber}
                  className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-3.5 space-y-2"
                >
                  <div className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-1.5">
                    Kelompok {team.teamNumber}
                  </div>
                  <ul className="space-y-1.5 text-xs">
                    {team.members.map((m, idx) => (
                      <li key={idx} className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-slate-800 truncate">{m.name}</span>
                        <span className="text-[10px] font-mono text-indigo-700 shrink-0">
                          {m.roleInTeam === 'Ketua Kelompok' ? 'Ketua' : m.roleInTeam.split(' ')[0]}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* FITUR BARU ANAK 8B #3: PAPAN TANTANGAN MISI HARIAN KELAS 8B */}
          <section className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="text-xs font-semibold text-indigo-700">
                  Fitur Eksklusif Anak 8B #2
                </div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  <span>Misi Harian Jadwal Kelas 8B</span>
                </h2>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-700 tabular-nums">
                {completedQuestIds.length}/{DAILY_CLASS_QUESTS_8B.length} Tuntas
              </span>
            </div>

            {questNotice && (
              <div
                role="status"
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-semibold text-emerald-900"
              >
                {questNotice}
              </div>
            )}

            <div className="space-y-2.5">
              {DAILY_CLASS_QUESTS_8B.map((quest) => {
                const isDone = completedQuestIds.includes(quest.id);
                const rewardVal = doubleCoinActive ? quest.coinReward * 2 : quest.coinReward;
                return (
                  <div
                    key={quest.id}
                    className={`rounded-2xl border p-3.5 flex items-center justify-between gap-3 transition-colors ${
                      isDone
                        ? 'border-emerald-200 bg-emerald-50/50'
                        : 'border-slate-200 bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 text-[11px] font-mono">
                        <span className="font-bold text-indigo-700">{quest.dayTag}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-600 truncate">{quest.subjectTag}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900 leading-snug">
                        {quest.title}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isDone}
                      onClick={() => handleClaimQuest(quest.id, quest.title, quest.coinReward)}
                      className={`min-h-[40px] rounded-xl px-3 py-2 text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        isDone
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      {isDone ? 'Selesai ✓' : `Klaim +${rewardVal} Koin`}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          BARIS 2: KALKULATOR TARGET NILAI RAPOR 8B + TIMER POMODORO 8B
         ===================================================================== */}
      {(moduleFilter === 'semua' || moduleFilter === 'rapor_pomodoro') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* FITUR BARU ANAK 8B #2: KALKULATOR TARGET NILAI RAPOR & PREDIKAT PAS */}
          <section className="lg:col-span-6 rounded-3xl border border-slate-200 bg-white p-6 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="text-xs font-semibold text-indigo-700">
                  Fitur Eksklusif Anak 8B #3
                </div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-indigo-600" />
                  <span>Kalkulator Target Rapor &amp; Skor PAS 8B</span>
                </h2>
              </div>
              <span className="font-mono text-xs font-bold text-indigo-700 tabular-nums">
                12 Mapel Resmi
              </span>
            </div>

            <div>
              <label
                htmlFor="rapor-subject-select"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Pilih Mata Pelajaran Kelas 8B
              </label>
              <select
                id="rapor-subject-select"
                value={raporSubject}
                onChange={(e) => setRaporSubject(e.target.value)}
                className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900"
              >
                {OFFICIAL_8B_SUBJECTS.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label
                  htmlFor="score-tugas"
                  className="block text-[11px] font-semibold text-slate-600 mb-1"
                >
                  Rata Tugas (30%)
                </label>
                <input
                  id="score-tugas"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={100}
                  value={tugasAvg}
                  onChange={(e) => setTugasAvg(Number(e.target.value))}
                  className="min-h-[44px] w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono font-bold text-slate-900 tabular-nums"
                />
              </div>
              <div>
                <label
                  htmlFor="score-uh"
                  className="block text-[11px] font-semibold text-slate-600 mb-1"
                >
                  Ulangan Harian (30%)
                </label>
                <input
                  id="score-uh"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={100}
                  value={uhAvg}
                  onChange={(e) => setUhAvg(Number(e.target.value))}
                  className="min-h-[44px] w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono font-bold text-slate-900 tabular-nums"
                />
              </div>
              <div>
                <label
                  htmlFor="score-pts"
                  className="block text-[11px] font-semibold text-slate-600 mb-1"
                >
                  Nilai PTS (20%)
                </label>
                <input
                  id="score-pts"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={100}
                  value={ptsScore}
                  onChange={(e) => setPtsScore(Number(e.target.value))}
                  className="min-h-[44px] w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono font-bold text-slate-900 tabular-nums"
                />
              </div>
              <div>
                <label
                  htmlFor="score-pas"
                  className="block text-[11px] font-semibold text-slate-600 mb-1"
                >
                  Target PAS (20%)
                </label>
                <input
                  id="score-pas"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={100}
                  value={pasTarget}
                  onChange={(e) => setPasTarget(Number(e.target.value))}
                  className="min-h-[44px] w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono font-bold text-slate-900 tabular-nums"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-900 bg-[#0F172A] p-4 text-white space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-[11px] text-slate-300">Estimasi Nilai Akhir Rapor</div>
                  <div className="text-2xl font-mono font-extrabold text-amber-300 tabular-nums">
                    {raporResult.finalScore} · {raporResult.predicate}
                  </div>
                </div>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={handleSaveRaporTarget}
                  className="min-h-[40px] rounded-xl bg-amber-400 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-300 cursor-pointer"
                >
                  Simpan Target (+10 Koin)
                </motion.button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {raporResult.recommendation}
              </p>
            </div>

            {raporNotice && (
              <div
                role="status"
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-900"
              >
                {raporNotice}
              </div>
            )}

            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-700">Target Rapor Tersimpan:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {savedTargets.map((t) => (
                  <div
                    key={t.subject}
                    className="rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-slate-800 truncate">{t.subject}</span>
                    <span className="font-mono font-bold text-indigo-700 tabular-nums shrink-0">
                      {t.finalScore} ({t.predicate.split(' ')[0]})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FITUR #4: TIMER FOKUS BELAJAR POMODORO 8B */}
          <section className="lg:col-span-6 rounded-3xl border border-slate-200 bg-white p-6 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="text-xs font-semibold text-indigo-700">
                  Fitur Produktivitas #4
                </div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Timer className="h-5 w-5 text-slate-800" />
                  <span>Timer Fokus Belajar Pomodoro 8B</span>
                </h2>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-700 tabular-nums">
                {focusSessionsDone} Sesi Selesai
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* SVG Progress Ring */}
              <div className="relative h-36 w-36 flex items-center justify-center shrink-0">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 128 128">
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="8"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    fill="none"
                    stroke="#0F172A"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringDashOffset}
                    style={{ transition: 'stroke-dashoffset 0.35s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-mono text-2xl font-extrabold text-slate-900 tabular-nums">
                    {formatCountdownTimer(secondsLeft)}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">
                    +{calculatePomodoroCoinReward(durationMinutes, doubleCoinActive)} Koin
                  </span>
                </div>
              </div>

              <div className="flex-1 w-full space-y-3">
                <div>
                  <label
                    htmlFor="pomodoro-subject"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Target Mata Pelajaran Jadwal 8B
                  </label>
                  <select
                    id="pomodoro-subject"
                    value={focusSubject}
                    onChange={(e) => setFocusSubject(e.target.value)}
                    className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900"
                  >
                    {OFFICIAL_8B_SUBJECTS.map((subj) => (
                      <option key={subj} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { mins: 25, label: '25m Fokus' },
                    { mins: 15, label: '15m Kilat' },
                    { mins: 5, label: '5m Santai' },
                  ].map((opt) => (
                    <button
                      key={opt.mins}
                      type="button"
                      onClick={() => handleSelectDuration(opt.mins)}
                      className={`min-h-[40px] rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                        durationMinutes === opt.mins
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {pomodoroNotice && (
              <div
                role="status"
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-900"
              >
                {pomodoroNotice}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsRunning((r) => !r)}
                className="min-h-[44px] flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
              >
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{isRunning ? 'Jeda Timer' : 'Mulai Fokus Belajar'}</span>
              </motion.button>

              <button
                type="button"
                onClick={() => {
                  setIsRunning(false);
                  setSecondsLeft(durationMinutes * 60);
                }}
                aria-label="Reset timer fokus"
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handleCompleteFocusNow}
                className="min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-300 cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Tandai Selesai (+Koin)</span>
              </button>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          BARIS 3: PAPAN KUDOS TEMAN + SURAT IZIN DIGITAL BU AIDA & ASPIRASI
         ===================================================================== */}
      {(moduleFilter === 'semua' || moduleFilter === 'izin_kudos') && (
        <div className="space-y-6">
          {/* FITUR #5: PAPAN APRESIASI TEMAN (KUDOS BOARD 8B) */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="text-xs font-semibold text-indigo-700">
                  Fitur Apresiasi Kelas #5
                </div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <HeartHandshake className="h-5 w-5 text-emerald-600" />
                  <span>Papan Apresiasi Teman (Kudos 8B)</span>
                </h2>
              </div>
              <span className="font-mono text-xs font-bold text-slate-500 tabular-nums">
                {kudosList.length} Apresiasi
              </span>
            </div>

            <form onSubmit={handleKudosSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="kudos-recipient"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Nama Teman / Guru yang Diapresiasi
                  </label>
                  <input
                    id="kudos-recipient"
                    type="text"
                    value={kudosRecipient}
                    onChange={(e) => setKudosRecipient(e.target.value)}
                    placeholder="Contoh: Ibu Aida / Regu Piket Senin"
                    maxLength={60}
                    className="min-h-[44px] w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="kudos-category"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Pilih Lencana Kebaikan
                  </label>
                  <select
                    id="kudos-category"
                    value={kudosCat}
                    onChange={(e) => setKudosCat(e.target.value as KudosCategoryId)}
                    className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                  >
                    {KUDOS_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  aria-label="Ucapan terima kasih atau semangat untuk teman 8B"
                  value={kudosNote}
                  onChange={(e) => setKudosNote(e.target.value)}
                  placeholder="Tulis ucapan terima kasih atau semangat untuk teman 8B..."
                  maxLength={180}
                  className="min-h-[44px] flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900"
                />
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.96 }}
                  className="min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Award className="h-4 w-4 text-amber-400" />
                  <span>Kirim (+5 Koin)</span>
                </motion.button>
              </div>
            </form>

            {kudosNotice && (
              <div
                role="status"
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-900"
              >
                {kudosNotice}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[240px] overflow-y-auto pr-1">
              {kudosList.map((k) => {
                const catMeta = KUDOS_CATEGORIES.find((c) => c.id === k.categoryId);
                return (
                  <div
                    key={k.id}
                    className="rounded-xl border border-slate-200/80 bg-[#F8FAFC] p-3.5 space-y-1"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-slate-900">
                        {k.senderName} → {k.recipientName}
                      </span>
                      <span className="font-semibold text-indigo-700">
                        {catMeta?.label || 'Apresiasi 8B'} · {k.timeLabel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{k.note}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* FITUR #6: SURAT IZIN DIGITAL KE BU AIDA & KOTAK ASPIRASI KELAS 8B */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <section className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 space-y-5 shadow-2xs">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="text-xs font-semibold text-indigo-700">
                    Fitur Administrasi Siswa #6A
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-slate-800" />
                    <span>Generator Surat Izin Digital ke Ibu Aida</span>
                  </h2>
                </div>
                <span className="text-xs text-slate-500 font-medium">Format Resmi SMPN 18</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="izin-student"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Nama Siswa
                  </label>
                  <input
                    id="izin-student"
                    type="text"
                    value={izinStudentName}
                    onChange={(e) => setIzinStudentName(e.target.value)}
                    className="min-h-[44px] w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="izin-reason-type"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Alasan Tidak Hadir
                  </label>
                  <select
                    id="izin-reason-type"
                    value={izinReasonType}
                    onChange={(e) =>
                      setIzinReasonType(
                        e.target.value as 'Sakit' | 'Izin Keluarga' | 'Dispensasi Lomba / Sekolah'
                      )
                    }
                    className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                  >
                    <option value="Sakit">Sakit</option>
                    <option value="Izin Keluarga">Izin Keluarga</option>
                    <option value="Dispensasi Lomba / Sekolah">Dispensasi Lomba / Sekolah</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="izin-date"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Tanggal Izin
                  </label>
                  <input
                    id="izin-date"
                    type="text"
                    value={izinDate}
                    onChange={(e) => setIzinDate(e.target.value)}
                    className="min-h-[44px] w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="izin-parent"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Nama Orang Tua / Wali
                  </label>
                  <input
                    id="izin-parent"
                    type="text"
                    value={izinParentName}
                    onChange={(e) => setIzinParentName(e.target.value)}
                    className="min-h-[44px] w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="izin-detail"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Keterangan Singkat
                </label>
                <input
                  id="izin-detail"
                  type="text"
                  value={izinDetail}
                  onChange={(e) => setIzinDetail(e.target.value)}
                  className="min-h-[44px] w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <pre className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
                {formattedLetter}
              </pre>

              {izinNotice && (
                <div
                  role="status"
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-900"
                >
                  {izinNotice}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyLetter}
                  className="min-h-[44px] inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Salin Teks Surat</span>
                </button>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={handleSendLetter}
                  className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5 text-amber-400" />
                  <span>Kirim ke Presensi &amp; DM Ibu Aida</span>
                </motion.button>
              </div>
            </section>

            {/* KOTAK ASPIRASI & IDE KEMAJUAN KELAS 8B */}
            <section className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 space-y-5 shadow-2xs">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="text-xs font-semibold text-indigo-700">
                    Fitur Suara Warga #6B
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    <span>Kotak Aspirasi &amp; Ide Kelas 8B</span>
                  </h2>
                </div>
                <span className="font-mono text-xs text-slate-500">{aspirations.length} Ide</span>
              </div>

              <form onSubmit={handleAddAspirationSubmit} className="space-y-3">
                <div>
                  <label
                    htmlFor="asp-topic"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Topik Usulan
                  </label>
                  <select
                    id="asp-topic"
                    value={aspTopic}
                    onChange={(e) => setAspTopic(e.target.value)}
                    className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                  >
                    <option value="Kebersihan & Piket Kelas">Kebersihan &amp; Piket Kelas</option>
                    <option value="Kelompok Belajar & PR">Kelompok Belajar &amp; PR</option>
                    <option value="Kas & Kegiatan Kelas 8B">Kas &amp; Kegiatan Kelas 8B</option>
                    <option value="Fitur Baru Website 8B">Fitur Baru Website 8B</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="asp-msg"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Saran atau Ide untuk Ibu Aida &amp; Pengurus
                  </label>
                  <textarea
                    id="asp-msg"
                    rows={3}
                    value={aspText}
                    onChange={(e) => setAspText(e.target.value)}
                    placeholder="Tuliskan saran membangun agar Kelas 8B makin kompak..."
                    maxLength={300}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer min-h-[36px]">
                  <input
                    type="checkbox"
                    checked={aspAnon}
                    onChange={(e) => setAspAnon(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  <span>Kirim secara anonim (tanpa menampilkan nama)</span>
                </label>

                {aspNotice && (
                  <div
                    role="status"
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-900"
                  >
                    {aspNotice}
                  </div>
                )}

                <button
                  type="submit"
                  className="min-h-[44px] w-full rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
                >
                  Sampaikan Aspirasi Kelas 8B
                </button>
              </form>

              <div className="space-y-2.5 max-h-[210px] overflow-y-auto pr-1">
                {aspirations.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-xl border border-slate-200/80 bg-[#F8FAFC] p-3.5 space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-bold text-indigo-700">{a.topic}</span>
                      <span>
                        {a.authorLabel} · {a.timeLabel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{a.message}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
