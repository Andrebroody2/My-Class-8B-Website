'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  CheckCircle2,
  Plus,
  Calendar,
  Megaphone,
  ClipboardCheck,
  Wallet,
  Coins,
  Sparkles,
  Clock,
  TrendingUp,
  Box,
} from 'lucide-react';
import { ClassRole, ROLE_METADATA, JADWAL_PELAJARAN_8B, DaySchedule } from '@/lib/class8b-logic';
import { BannerArtwork, TitleInsignia } from './BannerArtwork';
import { Bogor3DMasterpieceStage } from './Bogor3DMasterpieceStage';
import { StructureFlowCollection } from '@designcodeio/threeui';
import '@designcodeio/threeui/style.css';

const listStaggerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.03,
    },
  },
};

const assignmentCardVariants: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 360,
      damping: 26,
    },
  },
  exit: {
    opacity: 0,
    y: -14,
    scale: 0.95,
    transition: { duration: 0.18 },
  },
};

const announcementItemVariants: Variants = {
  hidden: { opacity: 0, x: 20, y: 12, scale: 0.97 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 380,
      damping: 28,
    },
  },
  exit: {
    opacity: 0,
    x: -16,
    scale: 0.95,
    transition: { duration: 0.16 },
  },
};

export interface AssignmentItem {
  id: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  pointsReward: number;
  status: 'aktif' | 'selesai';
  authorName: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  category: string;
  authorName: string;
  authorRole: string;
  pinned: boolean;
  createdAtLabel: string;
}

export interface AttendanceItem {
  id: string;
  studentName: string;
  date: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alfa';
  note: string;
  recordedBy: string;
}

export interface TreasuryItem {
  id: string;
  description: string;
  type: 'pemasukan' | 'pengeluaran';
  amount: number;
  recordedBy: string;
  dateLabel: string;
}

export interface UpdateLogItem {
  id: string;
  version: string;
  title: string;
  notes: string;
  author: string;
  dateLabel: string;
}

interface ClassDashboardViewProps {
  currentUser: {
    username: string;
    displayName: string;
    role: ClassRole;
    coins: number;
    equippedBanner: string;
    equippedTitle: string;
    verifiedBy: string;
  };
  assignments: AssignmentItem[];
  onAddAssignment: (a: Omit<AssignmentItem, 'id' | 'status' | 'authorName'>) => void;
  onCompleteAssignment: (id: string) => void;
  announcements: AnnouncementItem[];
  onAddAnnouncement: (a: {
    title: string;
    content: string;
    category: string;
    pinned: boolean;
  }) => void;
  attendance: AttendanceItem[];
  onAddAttendance: (r: {
    studentName: string;
    date: string;
    status: 'hadir' | 'izin' | 'sakit' | 'alfa';
    note: string;
  }) => void;
  treasury: TreasuryItem[];
  onAddTreasury: (t: {
    description: string;
    type: 'pemasukan' | 'pengeluaran';
    amount: number;
  }) => void;
  updateLogs: UpdateLogItem[];
  examModeActive: boolean;
  piketScheduleActive: boolean;
  onOpenAiTutor?: () => void;
}

export function ClassDashboardView({
  currentUser,
  assignments,
  onAddAssignment,
  onCompleteAssignment,
  announcements,
  onAddAnnouncement,
  attendance,
  onAddAttendance,
  treasury,
  onAddTreasury,
  updateLogs,
  examModeActive,
  piketScheduleActive,
  onOpenAiTutor,
}: ClassDashboardViewProps) {
  const roleMeta = ROLE_METADATA[currentUser.role];
  const [assignmentFilter, setAssignmentFilter] = useState<'semua' | 'aktif' | 'selesai'>('semua');
  const [selectedScheduleDay, setSelectedScheduleDay] = useState<DaySchedule['day']>('Senin');
  const [show3DObservatory, setShow3DObservatory] = useState(false);

  // ThreeUI StructureFlowCollection (variant="fluid-field") state — default hue=0, saturation=1.00, brightness=1.00
  const [fluidHue, setFluidHue] = useState<number>(0);
  const [fluidSaturation, setFluidSaturation] = useState<number>(1.0);
  const [fluidBrightness, setFluidBrightness] = useState<number>(1.0);
  const [showShaderTuner, setShowShaderTuner] = useState<boolean>(false);

  // Form states for Assignments
  const [showNewAssignment, setShowNewAssignment] = useState(false);
  const [asgSubject, setAsgSubject] = useState('Matematika');
  const [asgTitle, setAsgTitle] = useState('');
  const [asgDesc, setAsgDesc] = useState('');
  const [asgDue, setAsgDue] = useState('Jumat, 20 Nov 2026');
  const [asgReward, setAsgReward] = useState(40);

  // Form states for Announcements
  const [showNewAnnouncement, setShowNewAnnouncement] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState('Akademik 8B');
  const [annPinned, setAnnPinned] = useState(false);

  // Form states for Attendance
  const [attStudentName, setAttStudentName] = useState('');
  const [attDate, setAttDate] = useState('2026-11-14');
  const [attStatus, setAttStatus] = useState<'hadir' | 'izin' | 'sakit' | 'alfa'>('hadir');
  const [attNote, setAttNote] = useState('Tepat waktu');

  // Form states for Treasury (Bendahara 1 & 2)
  const [kasDesc, setKasDesc] = useState('');
  const [kasType, setKasType] = useState<'pemasukan' | 'pengeluaran'>('pemasukan');
  const [kasAmount, setKasAmount] = useState(10000);

  const filteredAssignments = assignments.filter((a) => {
    if (assignmentFilter === 'semua') return true;
    return a.status === assignmentFilter;
  });

  const completedAssignmentsCount = assignments.filter((a) => a.status === 'selesai').length;
  const completionPercent =
    assignments.length > 0 ? Math.round((completedAssignmentsCount / assignments.length) * 100) : 0;

  const totalKasSaldo = treasury.reduce(
    (acc, item) => (item.type === 'pemasukan' ? acc + item.amount : acc - item.amount),
    0
  );

  const activeDaySchedule =
    JADWAL_PELAJARAN_8B.find((d) => d.day === selectedScheduleDay) || JADWAL_PELAJARAN_8B[0];

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (asgTitle.trim().length < 3 || asgDesc.trim().length < 3) return;
    onAddAssignment({
      subject: asgSubject,
      title: asgTitle.trim(),
      description: asgDesc.trim(),
      dueDate: asgDue.trim() || 'Segera',
      pointsReward: Number(asgReward) || 30,
    });
    setAsgTitle('');
    setAsgDesc('');
    setShowNewAssignment(false);
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (annTitle.trim().length < 3 || annContent.trim().length < 3) return;
    onAddAnnouncement({
      title: annTitle.trim(),
      content: annContent.trim(),
      category: annCategory,
      pinned: annPinned,
    });
    setAnnTitle('');
    setAnnContent('');
    setShowNewAnnouncement(false);
  };

  const handleCreateAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (attStudentName.trim().length < 2) return;
    onAddAttendance({
      studentName: attStudentName.trim(),
      date: attDate,
      status: attStatus,
      note: attNote.trim() || '-',
    });
    setAttStudentName('');
  };

  const handleCreateTreasury = (e: React.FormEvent) => {
    e.preventDefault();
    if (kasDesc.trim().length < 2 || kasAmount <= 0) return;
    onAddTreasury({
      description: kasDesc.trim(),
      type: kasType,
      amount: Number(kasAmount),
    });
    setKasDesc('');
  };

  return (
    <div className="space-y-8 pb-20">
      {/* ThreeUI StructureFlowCollection (variant="fluid-field") — Dashboard Utama Siswa 8B, Pengurus, Owner & Bu Aida */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-3xl border border-slate-800/90 bg-[#050508] text-white shadow-2xl"
        data-testid="dashboard-fluid-field-hero"
      >
        {/* Configured <StructureFlowCollection variant="fluid-field" hue={0} saturation={1.00} brightness={1.00} /> */}
        <div className="shader-frame absolute inset-0 h-full w-full pointer-events-none">
          <StructureFlowCollection
            variant="fluid-field"
            hue={fluidHue}
            saturation={fluidSaturation}
            brightness={fluidBrightness}
          />
        </div>

        {/* Architectural Grid & Content Overlay (Aura UI Fluid Field + Profil Kelas 8B) */}
        <div className="relative z-10 p-6 sm:p-8 space-y-6">
          {/* Top Architectural Telemetry Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center border border-white/30 bg-white/5">
                <div className="h-2 w-2 bg-white" />
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono tracking-wider text-slate-300 uppercase">
                <span className="font-semibold text-white">SMPN 18 Kota Bogor</span>
                <span aria-hidden="true" className="text-white/30">/</span>
                <span className="text-indigo-300">Fluid Field Shader · Kelas 8B</span>
                <span aria-hidden="true" className="text-white/30">·</span>
                <span className="text-emerald-300">Terverifikasi oleh {currentUser.verifiedBy}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowShaderTuner((prev) => !prev)}
                data-testid="toggle-fluid-shader-tuner"
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-mono font-semibold text-white hover:bg-white/15 transition-colors cursor-pointer backdrop-blur-md"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
                <span>
                  Fluid Field ({fluidHue}° · {fluidSaturation.toFixed(2)}x · {fluidBrightness.toFixed(2)}x)
                </span>
              </button>
              <BannerArtwork
                bannerId={currentUser.equippedBanner}
                className="hidden"
              >
                <span />
              </BannerArtwork>
            </div>
          </div>

          {/* Main Dashboard Identity & Coin Balance Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-indigo-300">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span>
                  Dashboard Utama Terpadu · Siswa 8B · Pengurus · Owner · Ibu Aida
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white">
                {currentUser.displayName}
              </h1>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <TitleInsignia titleId={currentUser.equippedTitle} size="md" />
                <span className="text-xs text-slate-400" aria-hidden="true">
                  ·
                </span>
                <span className="text-xs font-semibold text-indigo-200">
                  Jabatan Aktif: {roleMeta.label}
                </span>
                <span className="text-xs text-slate-400" aria-hidden="true">
                  ·
                </span>
                <span className="text-xs font-mono text-amber-300">
                  @{currentUser.username}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 rounded-2xl bg-slate-950/75 border border-white/15 px-5 py-3.5 backdrop-blur-md shadow-lg"
              >
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-300">
                    Saldo Koin Kelas 8B
                  </div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-amber-400 flex items-center gap-1.5">
                    <Coins className="h-5 w-5 text-amber-400" />
                    <span>{currentUser.coins ?? 250} Koin</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Interactive Shader Uniform / Filter Tuner (Hue / Saturation / Brightness) */}
          <AnimatePresence>
            {showShaderTuner && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div
                  className="rounded-2xl border border-white/15 bg-slate-950/80 p-4 backdrop-blur-md grid grid-cols-1 sm:grid-cols-4 gap-4 items-center"
                  data-testid="fluid-shader-tuner-panel"
                >
                  <label className="space-y-1 text-xs">
                    <div className="flex justify-between font-mono text-slate-300">
                      <span>HUE</span>
                      <span className="text-indigo-300">{fluidHue}°</span>
                    </div>
                    <input
                      type="range"
                      min={-180}
                      max={180}
                      step={5}
                      value={fluidHue}
                      onChange={(e) => setFluidHue(Number(e.target.value))}
                      className="w-full accent-indigo-400 cursor-pointer"
                    />
                  </label>
                  <label className="space-y-1 text-xs">
                    <div className="flex justify-between font-mono text-slate-300">
                      <span>SATURATION</span>
                      <span className="text-indigo-300">{fluidSaturation.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={2}
                      step={0.05}
                      value={fluidSaturation}
                      onChange={(e) => setFluidSaturation(Number(e.target.value))}
                      className="w-full accent-indigo-400 cursor-pointer"
                    />
                  </label>
                  <label className="space-y-1 text-xs">
                    <div className="flex justify-between font-mono text-slate-300">
                      <span>BRIGHTNESS</span>
                      <span className="text-indigo-300">{fluidBrightness.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min={0.35}
                      max={1.65}
                      step={0.05}
                      value={fluidBrightness}
                      onChange={(e) => setFluidBrightness(Number(e.target.value))}
                      className="w-full accent-indigo-400 cursor-pointer"
                    />
                  </label>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setFluidHue(0);
                        setFluidSaturation(1.0);
                        setFluidBrightness(1.0);
                      }}
                      className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-mono font-semibold text-white hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      Reset (0 / 1.00 / 1.00)
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Architectural Specs & 3D Monument Trigger */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex flex-wrap items-center gap-3">
              <span>Hak Akses Aktif: {roleMeta.permissions.slice(0, 2).join(' · ')}</span>
              <span aria-hidden="true" className="text-white/30">·</span>
              <span className="font-mono text-[11px] text-indigo-300">
                GLSL Simplex Noise · 60fps Fluid Field
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {onOpenAiTutor && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onOpenAiTutor}
                  data-testid="open-ai-tutor-from-dashboard"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-400 transition-colors cursor-pointer shadow-sm"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>Tanya Tutor AI Pelajaran 8B</span>
                </motion.button>
              )}
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setShow3DObservatory((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-300 transition-colors cursor-pointer"
              >
                <Box className="h-3.5 w-3.5" />
                <span>{show3DObservatory ? 'Tutup Studio 3D 8B' : 'Buka Monumen 3D 8B'}</span>
              </motion.button>
              <div className="font-mono tabular-nums text-amber-200">
                @{currentUser.username} · Kelas 8B
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {show3DObservatory && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            <Bogor3DMasterpieceStage
              onSelectDayFrom3D={(day) => {
                setSelectedScheduleDay(day);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bento Progress & Live Stats Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ y: -3 }}
          className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-2.5 shadow-2xs"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
              <span>Progres Penyelesaian Tugas</span>
            </span>
            <span className="font-mono font-bold text-slate-900 tabular-nums">
              {completedAssignmentsCount} / {assignments.length} Selesai ({completionPercent}%)
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-emerald-500"
            />
          </div>
          <div className="text-xs text-slate-500">
            Tandai tugas selesai untuk mengklaim hadiah koin otomatis
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="rounded-2xl border border-slate-200/90 bg-white p-5 flex items-center justify-between gap-4 shadow-2xs"
        >
          <div className="space-y-1">
            <div className="text-xs font-medium text-slate-500">Saldo Buku Kas Kelas 8B</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-emerald-700">
              Rp {totalKasSaldo.toLocaleString('id-ID')}
            </div>
            <div className="text-xs text-slate-500">
              Transparansi Bendahara 1 &amp; Bendahara 2
            </div>
          </div>
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200/70 p-3 text-emerald-700">
            <Wallet className="h-6 w-6" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="rounded-2xl border border-slate-200/90 bg-white p-5 flex items-center justify-between gap-4 shadow-2xs"
        >
          <div className="space-y-1">
            <div className="text-xs font-medium text-slate-500">Rekap Presensi Kelas 8B</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {attendance.length} Catatan Aktif
            </div>
            <div className="text-xs text-slate-500">
              Dikelola Sekretaris 1, Sekretaris 2 &amp; Bu Aida
            </div>
          </div>
          <div className="rounded-2xl bg-indigo-50 border border-indigo-200/70 p-3 text-indigo-700">
            <ClipboardCheck className="h-6 w-6" />
          </div>
        </motion.div>
      </div>

      {/* Banner Mode Fokus Ujian (Jika diaktifkan dari Panel 45 Fitur) */}
      {examModeActive && (
        <motion.div
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          className="rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 to-amber-100/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-amber-950">
              Mode Fokus PTS / PAS Kelas 8B Sedang Aktif
            </div>
            <p className="text-xs text-amber-900">
              Diaktifkan oleh Bu Aida / Owner: Utamakan penyelesaian tugas prioritas dan latihan
              soal di tab Akademi Koin.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-amber-950 shrink-0">
            PRIORITAS AKADEMIK
          </span>
        </motion.div>
      )}

      {/* Grid Utama: Tugas Siswa Kelas 8B (Kiri 7 Kolom) & Pengumuman + Jadwal (Kanan 5 Kolom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Tugas Siswa Kelas 8B */}
        <section className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <div className="text-xs font-semibold text-indigo-600">
                Manajemen Tugas &amp; PR Sekolah
              </div>
              <h2 className="text-xl font-bold text-slate-900">Daftar Tugas Siswa Kelas 8B</h2>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-xl bg-slate-200/70 p-1">
                {(['semua', 'aktif', 'selesai'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setAssignmentFilter(st)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors capitalize cursor-pointer ${
                      assignmentFilter === st
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {roleMeta.canManageAssignments && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowNewAssignment(!showNewAssignment)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Tugas</span>
                </motion.button>
              )}
            </div>
          </div>

          {showNewAssignment && roleMeta.canManageAssignments && (
            <motion.form
              initial={{ y: -8 }}
              animate={{ y: 0 }}
              onSubmit={handleCreateAssignment}
              className="rounded-2xl border border-slate-300 bg-slate-50 p-5 space-y-3 shadow-sm"
            >
              <div className="text-xs font-bold text-slate-900">
                Tambah Tugas Baru (Otoritas {roleMeta.shortLabel})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label
                    htmlFor="asg-subject"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Mata Pelajaran
                  </label>
                  <select
                    id="asg-subject"
                    value={asgSubject}
                    onChange={(e) => setAsgSubject(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                  >
                    <option value="Matematika">Matematika</option>
                    <option value="IPA (Sains)">IPA (Sains)</option>
                    <option value="IPS">IPS</option>
                    <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                    <option value="Bahasa Inggris">Bahasa Inggris</option>
                    <option value="PPKn">PPKn</option>
                    <option value="Informatika">Informatika</option>
                    <option value="Seni Budaya">Seni Budaya</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="asg-due"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Batas Pengumpulan
                  </label>
                  <input
                    id="asg-due"
                    type="text"
                    value={asgDue}
                    onChange={(e) => setAsgDue(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label
                    htmlFor="asg-reward"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Hadiah Koin 8B
                  </label>
                  <input
                    id="asg-reward"
                    type="number"
                    min={10}
                    max={500}
                    value={asgReward}
                    onChange={(e) => setAsgReward(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="asg-title"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Judul Tugas
                </label>
                <input
                  id="asg-title"
                  type="text"
                  value={asgTitle}
                  onChange={(e) => setAsgTitle(e.target.value)}
                  placeholder="Contoh: Latihan Bab 4 Persamaan Garis Lurus Hal. 142"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="asg-desc"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Instruksi Detail
                </label>
                <textarea
                  id="asg-desc"
                  rows={2}
                  value={asgDesc}
                  onChange={(e) => setAsgDesc(e.target.value)}
                  placeholder="Kerjakan di buku latihan masing-masing dan kumpulkan ke meja Bu Aida..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewAssignment(false)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white cursor-pointer"
                >
                  Simpan &amp; Terbitkan Tugas
                </button>
              </div>
            </motion.form>
          )}

          <motion.div
            variants={listStaggerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3.5"
          >
            <AnimatePresence mode="popLayout">
              {filteredAssignments.map((asg, idx) => (
                <motion.article
                  key={asg.id}
                  layout
                  variants={assignmentCardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{
                    type: 'spring',
                    stiffness: 360,
                    damping: 26,
                    delay: idx * 0.04,
                  }}
                  whileHover={{ y: -4, scale: 1.008 }}
                  className={`rounded-2xl border p-5 space-y-3 transition-colors shadow-2xs ${
                    asg.status === 'selesai'
                      ? 'border-emerald-200/80 bg-emerald-50/30'
                      : 'border-slate-200/90 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-bold text-indigo-700">{asg.subject}</span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Tenggat: {asg.dueDate}</span>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>Oleh {asg.authorName}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{asg.title}</h3>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-bold text-amber-600 tabular-nums">
                        +{asg.pointsReward} Koin
                      </div>
                      <div className="text-xs text-slate-500">
                        {asg.status === 'selesai' ? 'Telah Selesai' : 'Tugas Aktif'}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">{asg.description}</p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-500">
                      {asg.status === 'selesai'
                        ? 'Tugas ini sudah ditandai tuntas dan koin telah masuk ke saldo kamu.'
                        : 'Klik tombol di kanan setelah selesai mengerjakan untuk klaim koin.'}
                    </span>

                    {asg.status === 'aktif' ? (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onCompleteAssignment(asg.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                        <span>Selesai (+{asg.pointsReward} Koin)</span>
                      </motion.button>
                    ) : (
                      <motion.span
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 whitespace-nowrap shrink-0"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Koin Diklaim</span>
                      </motion.span>
                    )}
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Kolom Pengumuman Digital & Jadwal Cepat Kelas 8B */}
        <section className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <div className="text-xs font-semibold text-indigo-600">Papan Informasi Resmi</div>
                <h2 className="text-xl font-bold text-slate-900">Pengumuman Digital 8B</h2>
              </div>

              {roleMeta.canManageAnnouncements && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowNewAnnouncement(!showNewAnnouncement)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Megaphone className="h-3.5 w-3.5" />
                  <span>Buat Info</span>
                </motion.button>
              )}
            </div>

            {showNewAnnouncement && roleMeta.canManageAnnouncements && (
              <motion.form
                initial={{ y: -8 }}
                animate={{ y: 0 }}
                onSubmit={handleCreateAnnouncement}
                className="rounded-2xl border border-slate-300 bg-slate-50 p-4 space-y-3"
              >
                <div className="text-xs font-bold text-slate-900">
                  Publikasikan Pengumuman Kelas 8B ({roleMeta.shortLabel})
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label
                      htmlFor="ann-cat"
                      className="block text-xs font-medium text-slate-700 mb-1"
                    >
                      Kategori
                    </label>
                    <select
                      id="ann-cat"
                      value={annCategory}
                      onChange={(e) => setAnnCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900"
                    >
                      <option value="Wali Kelas (Bu Aida)">Wali Kelas (Bu Aida)</option>
                      <option value="Akademik 8B">Akademik 8B</option>
                      <option value="Info Pengurus">Info Pengurus</option>
                      <option value="Kas & Bendahara">Kas &amp; Bendahara</option>
                      <option value="Piket & Kebersihan">Piket &amp; Kebersihan</option>
                    </select>
                  </div>
                  <div className="flex items-end pb-1">
                    <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={annPinned}
                        onChange={(e) => setAnnPinned(e.target.checked)}
                        className="rounded border-slate-300"
                      />
                      <span>Sematkan di Atas</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="ann-title"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Judul Pengumuman
                  </label>
                  <input
                    id="ann-title"
                    type="text"
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    placeholder="Contoh: Persiapan Praktikum IPA di Laboratorium"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="ann-content"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Isi Pengumuman
                  </label>
                  <textarea
                    id="ann-content"
                    rows={3}
                    value={annContent}
                    onChange={(e) => setAnnContent(e.target.value)}
                    placeholder="Tuliskan rincian pengumuman untuk seluruh warga Kelas 8B..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewAnnouncement(false)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white cursor-pointer"
                  >
                    Terbitkan
                  </button>
                </div>
              </motion.form>
            )}

            <motion.div
              variants={listStaggerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              <AnimatePresence mode="popLayout">
                {announcements.map((ann, idx) => (
                  <motion.article
                    key={ann.id}
                    layout
                    variants={announcementItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 28,
                      delay: idx * 0.05,
                    }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    className={`rounded-2xl border p-5 space-y-2 transition-colors ${
                      ann.pinned
                        ? 'border-slate-900 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shadow-md'
                        : 'border-slate-200/90 bg-white text-slate-900 shadow-2xs'
                    }`}
                  >
                    <div
                      className={`flex flex-wrap items-center gap-2 text-xs ${
                        ann.pinned ? 'text-amber-300' : 'text-slate-500'
                      }`}
                    >
                      <span className="font-bold">{ann.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{ann.authorName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{ann.createdAtLabel}</span>
                    </div>
                    <h3 className="text-sm font-bold leading-snug">{ann.title}</h3>
                    <p
                      className={`text-xs leading-relaxed ${
                        ann.pinned ? 'text-slate-200' : 'text-slate-600'
                      }`}
                    >
                      {ann.content}
                    </p>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Interactive Mini Schedule & Piket Card */}
          {piketScheduleActive && (
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-semibold text-indigo-600">
                    Jadwal Pelajaran &amp; Piket 8B
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Agenda Hari {activeDaySchedule.day}
                  </h3>
                </div>
                <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
                  {JADWAL_PELAJARAN_8B.map((d) => (
                    <button
                      key={d.day}
                      type="button"
                      onClick={() => setSelectedScheduleDay(d.day)}
                      className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                        selectedScheduleDay === d.day
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {d.day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 text-xs space-y-1">
                <div className="font-bold text-slate-900">{activeDaySchedule.piketGroup}</div>
                <div className="text-slate-600">Seragam: {activeDaySchedule.Uniform}</div>
              </div>

              <div className="space-y-2">
                {activeDaySchedule.slots.map((s) => (
                  <div
                    key={s.time}
                    className="flex items-center justify-between gap-2 text-xs border-b border-slate-100 pb-2 last:border-b-0 last:pb-0"
                  >
                    <span className="font-semibold text-slate-800 truncate">{s.subject}</span>
                    <span className="font-mono text-slate-500 tabular-nums shrink-0 inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {s.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Bagian Presensi Harian & Buku Kas Pengurus Kelas 8B */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-slate-200">
        {/* Presensi Kehadiran Siswa Kelas 8B */}
        <section className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-indigo-600">
                Dikelola oleh Owner, Bu Aida, Ketua/Wakil &amp; Sekretaris 1/2
              </div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-slate-700" />
                <span>Presensi Kehadiran Digital Kelas 8B</span>
              </h2>
            </div>
            <span className="text-xs font-mono tabular-nums text-slate-500">
              {attendance.length} Catatan Presensi
            </span>
          </div>

          {roleMeta.canManageAttendance ? (
            <form
              onSubmit={handleCreateAttendance}
              className="rounded-2xl border border-slate-200 bg-white p-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end shadow-2xs"
            >
              <div className="sm:col-span-4">
                <label htmlFor="att-name" className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Siswa 8B (Ketik Bebas)
                </label>
                <input
                  id="att-name"
                  type="text"
                  value={attStudentName}
                  onChange={(e) => setAttStudentName(e.target.value)}
                  placeholder="Ketik nama teman sekelas..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                />
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="att-status"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Status Kehadiran
                </label>
                <select
                  id="att-status"
                  value={attStatus}
                  onChange={(e) =>
                    setAttStatus(e.target.value as 'hadir' | 'izin' | 'sakit' | 'alfa')
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-900"
                >
                  <option value="hadir">Hadir</option>
                  <option value="izin">Izin</option>
                  <option value="sakit">Sakit</option>
                  <option value="alfa">Alfa</option>
                </select>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="att-note" className="block text-xs font-medium text-slate-700 mb-1">
                  Keterangan
                </label>
                <input
                  id="att-note"
                  type="text"
                  value={attNote}
                  onChange={(e) => setAttNote(e.target.value)}
                  placeholder="Tepat waktu / Surat dokter"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Catat
                </button>
              </div>
            </form>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
              Pencatatan presensi dilakukan oleh Sekretaris 1, Sekretaris 2, Ketua/Wakil Kelas, Ibu
              Aida, atau Owner Web.
            </div>
          )}

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-4">Nama Siswa / Anggota 8B</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Keterangan</th>
                  <th className="py-3 px-4">Dicatat Oleh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {attendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">{rec.studentName}</td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-600">{rec.date}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-bold uppercase ${
                          rec.status === 'hadir'
                            ? 'text-emerald-700'
                            : rec.status === 'sakit' || rec.status === 'izin'
                            ? 'text-amber-700'
                            : 'text-red-700'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{rec.note}</td>
                    <td className="py-3 px-4 text-slate-500">{rec.recordedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Buku Kas Bendahara 1 & Bendahara 2 + Riwayat Update Website */}
        <section className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-xs font-semibold text-indigo-600">
                  Otoritas Bendahara 1, Bendahara 2, Bu Aida &amp; Owner
                </div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-slate-700" />
                  <span>Buku Kas Transparan Kelas 8B</span>
                </h2>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">Saldo Kas Kelas</div>
                <div className="text-base font-bold font-mono tabular-nums text-emerald-700">
                  Rp {totalKasSaldo.toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            {roleMeta.canManageTreasury && (
              <form
                onSubmit={handleCreateTreasury}
                className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-2xs"
              >
                <div className="text-xs font-bold text-slate-900">
                  Catat Transaksi Kas ({roleMeta.shortLabel})
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    aria-label="Jenis Transaksi Kas"
                    value={kasType}
                    onChange={(e) => setKasType(e.target.value as 'pemasukan' | 'pengeluaran')}
                    className="rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900"
                  >
                    <option value="pemasukan">Pemasukan Kas (+)</option>
                    <option value="pengeluaran">Pengeluaran Kas (-)</option>
                  </select>
                  <input
                    type="number"
                    aria-label="Nominal Kas dalam Rupiah"
                    value={kasAmount}
                    onChange={(e) => setKasAmount(Number(e.target.value))}
                    className="rounded-xl border border-slate-300 px-2.5 py-1.5 text-xs font-mono text-slate-900"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    aria-label="Keterangan Transaksi Kas"
                    value={kasDesc}
                    onChange={(e) => setKasDesc(e.target.value)}
                    placeholder="Contoh: Iuran Kas Mingguan / Beli Spidol Papan Tulis"
                    className="flex-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white cursor-pointer"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 shadow-2xs">
              {treasury.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex items-center justify-between gap-3 text-xs hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <div className="font-semibold text-slate-900">{item.description}</div>
                    <div className="text-slate-500">
                      Dicatat oleh {item.recordedBy} · {item.dateLabel}
                    </div>
                  </div>
                  <div
                    className={`font-mono font-bold tabular-nums shrink-0 ${
                      item.type === 'pemasukan' ? 'text-emerald-700' : 'text-red-600'
                    }`}
                  >
                    {item.type === 'pemasukan' ? '+' : '-'}Rp {item.amount.toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Log Pembaruan (Update Log) Dinamis */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-600" />
                <span>Riwayat Update Website Kelas 8B</span>
              </div>
              <span className="text-xs font-mono text-indigo-600 font-semibold">Live Engine</span>
            </div>
            <div className="space-y-2.5">
              {updateLogs.map((u) => (
                <div
                  key={u.id}
                  className="border-t border-slate-100 pt-2.5 first:border-t-0 first:pt-0"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-900">
                      {u.version} · {u.title}
                    </span>
                    <span className="text-slate-400 font-mono">{u.dateLabel}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-600">{u.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
