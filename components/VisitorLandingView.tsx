'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Star,
  Send,
  Users,
  CheckCircle2,
  Calendar,
  Clock,
  Coins,
  Zap,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';
import {
  ROLE_METADATA,
  ClassRole,
  JADWAL_PELAJARAN_8B,
  DaySchedule,
  GRADE_8_QUIZ_BANK,
  validateReviewInput,
} from '@/lib/class8b-logic';
import { ParallaxComponent } from '@/components/ui/parallax-scrolling';
import { VisitorSixFeaturesHub } from '@/components/VisitorSixFeaturesHub';
import { Bogor3DMasterpieceStage } from '@/components/Bogor3DMasterpieceStage';

export interface VisitorReviewItem {
  id: string;
  visitorName: string;
  relation: string;
  message: string;
  rating: number;
  createdAtLabel: string;
}

interface VisitorLandingViewProps {
  activeSection: 'beranda' | 'profil' | 'struktur' | 'ulasan';
  onNavigateSection: (sec: 'beranda' | 'profil' | 'struktur' | 'ulasan') => void;
  onOpenLogin: (preselectedRole?: ClassRole) => void;
  reviews: VisitorReviewItem[];
  onAddReview: (review: {
    visitorName: string;
    relation: string;
    message: string;
    rating: number;
  }) => void;
  officerNames: Record<string, string>;
  announcementsCount: number;
  assignmentsCount: number;
  reviewFilterEnabled?: boolean;
}

export function VisitorLandingView({
  activeSection,
  onNavigateSection,
  onOpenLogin,
  reviews,
  onAddReview,
  officerNames,
  announcementsCount,
  assignmentsCount,
  reviewFilterEnabled = true,
}: VisitorLandingViewProps) {
  const [visitorName, setVisitorName] = useState('');
  const [relation, setRelation] = useState('Tamu Sekolah');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [selectedRoleInfo, setSelectedRoleInfo] = useState<ClassRole>('ketua_kelas');
  const [selectedDay, setSelectedDay] = useState<DaySchedule['day']>('Senin');

  // Interactive Mini-Quiz Sandbox on Landing Page
  const [demoQuizIdx, setDemoQuizIdx] = useState(0);
  const [demoSelectedOpt, setDemoSelectedOpt] = useState<number | null>(null);
  const [demoSimulatedCoins, setDemoSimulatedCoins] = useState(120);

  const currentSchedule =
    JADWAL_PELAJARAN_8B.find((d) => d.day === selectedDay) || JADWAL_PELAJARAN_8B[0];
  const sampleQuestion = GRADE_8_QUIZ_BANK[demoQuizIdx];

  const handleDemoQuizPick = (optIdx: number) => {
    if (demoSelectedOpt !== null) return;
    setDemoSelectedOpt(optIdx);
    if (optIdx === sampleQuestion.correctIndex) {
      setDemoSimulatedCoins((prev) => prev + sampleQuestion.coinReward);
    }
  };

  const handleNextDemoQuestion = () => {
    setDemoSelectedOpt(null);
    setDemoQuizIdx((prev) => (prev + 1) % GRADE_8_QUIZ_BANK.length);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');
    const check = validateReviewInput({
      visitorName,
      message,
      filterEnabled: reviewFilterEnabled,
    });
    if (!check.valid) {
      setReviewError(check.error || 'Mohon periksa kembali ulasan Anda.');
      return;
    }
    onAddReview({
      visitorName: visitorName.trim(),
      relation: relation.trim() || 'Pengunjung',
      message: message.trim(),
      rating,
    });
    setVisitorName('');
    setMessage('');
    setReviewSuccess('Terima kasih! Ulasan kamu langsung tampil di halaman Kelas 8B.');
  };

  const rolesList: ClassRole[] = [
    'owner',
    'teacher',
    'ketua_kelas',
    'wakil_ketua',
    'bendahara_1',
    'bendahara_2',
    'sekretaris_1',
    'sekretaris_2',
    'siswa',
  ];

  const scrollToId = (id: string) => {
    if (typeof document !== 'undefined') {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white text-slate-900">
      {/* FULL-BLEED KAGE 8B SECRET PATHWAYS 3D + PARALLAX HERO STAGE FOR SMPN 18 BOGOR */}
      <section id="beranda">
        <ParallaxComponent
          onOpenLogin={(role) => onOpenLogin(role)}
          onNavigateReviews={() => onNavigateSection('ulasan')}
          onExploreSchedule={() => scrollToId('jadwal-8b')}
          onSelectDayFromPathway={(day) => setSelectedDay(day)}
          assignmentsCount={assignmentsCount}
          reviewsCount={reviews.length}
        />
      </section>

      {/* EDITORIAL LETTER & PORTAL CAPABILITIES ON CRISP WHITE CANVAS */}
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 space-y-20 py-14 sm:py-20">
        {/* SECTION 01: EDITORIAL NOTE FROM WALI KELAS BU AIDA & OWNER (ECHOES INTERCOM CEO LETTER) */}
        {activeSection === 'beranda' && (
          <motion.section
            initial={{ opacity: 1, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start border-b border-slate-200 pb-16"
          >
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-semibold text-indigo-700">
                Pesan Resmi Wali Kelas 8B &amp; Pengembang Portal
              </div>
              <h2
                className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-[1.12]"
                style={{ textWrap: 'balance' }}
              >
                Dari Ibu Aida &amp; Owner: Menuju Kelas 8B yang lebih tertib dan kolaboratif
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Seluruh warga Kelas 8B SMP Negeri 18 Kota Bogor kini terhubung dalam ruang digital
                yang terlindungi Kode Verifikasi resmi—terpisah jelas antara halaman tamu publik dan
                ruang belajar internal kelas.
              </p>

              {/* Editorial Key Metrics Strip (No pill clutter, tabular-nums) */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200">
                <div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">9</div>
                  <div className="text-xs text-slate-500">Peran Spesifik</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">45</div>
                  <div className="text-xs text-slate-500">Fitur Guru &amp; Owner</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-emerald-700">
                    {assignmentsCount}+{announcementsCount}
                  </div>
                  <div className="text-xs text-slate-500">Tugas &amp; Info Aktif</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 aspect-[16/9]">
                <img
                  src="/images/smpn18_collab_study.jpg"
                  alt="Suasana belajar kolaboratif siswa Kelas 8B SMP Negeri 18 Kota Bogor"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-1">
                {[
                  {
                    num: '01.',
                    title: 'Akses Aman Berlapis',
                    desc: 'Kode OTP & PIN memisahkan siswa, pengurus inti, Ibu Aida, dan Owner.',
                  },
                  {
                    num: '02.',
                    title: 'Belajar & Koin 8B',
                    desc: 'Timer Pomodoro, Kuis Kurikulum Merdeka, dan Toko Banner Arsitektur.',
                  },
                  {
                    num: '03.',
                    title: 'Ramah HP Android',
                    desc: 'Navigasi jempol responsif, geser antar tab mulus, dan ekspor data instan.',
                  },
                ].map((item) => (
                  <div key={item.num} className="space-y-1.5">
                    <div className="text-xs font-mono font-bold text-indigo-700">{item.num}</div>
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* SECTION 01B: MASTERPIECE 3D WEBGL SHOWCASE UNTUK PENGUNJUNG LANDING PAGE */}
        {activeSection === 'beranda' && (
          <Bogor3DMasterpieceStage
            onSelectDayFrom3D={(day) => {
              setSelectedDay(day);
            }}
          />
        )}

        {/* SECTION 02: SIMULASI KUIS KILAT KURIKULUM MERDEKA */}
        {activeSection === 'beranda' && (
          <motion.section
            initial={{ opacity: 1, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.3 }}
            className="space-y-6 border-b border-slate-200 pb-16"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5" />
                  <span>Simulasi Interaktif · Kurikulum Merdeka Kelas 8</span>
                </div>
                <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Coba Kuis Kilat Berhadiah Koin Kelas 8B
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <motion.div
                  key={demoSimulatedCoins}
                  initial={{ scale: 1.12 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                  className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 flex items-center gap-2 min-h-[44px]"
                >
                  <Coins className="h-4 w-4 text-amber-600" />
                  <span className="text-xs text-slate-600 font-medium">Simulasi:</span>
                  <span className="font-mono font-bold text-sm text-slate-900 tabular-nums">
                    {demoSimulatedCoins} Koin
                  </span>
                </motion.div>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNextDemoQuestion}
                  className="min-h-[44px] inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Soal Lainnya</span>
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-bold text-indigo-700">{sampleQuestion.subject}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono font-semibold text-amber-700 tabular-nums">
                    Hadiah +{sampleQuestion.coinReward} Koin
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {sampleQuestion.question}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sampleQuestion.options.map((opt, idx) => {
                    const isPicked = demoSelectedOpt === idx;
                    const isCorrect = idx === sampleQuestion.correctIndex;
                    let styleClass =
                      'border-slate-200 bg-white text-slate-900 hover:border-slate-900';
                    if (demoSelectedOpt !== null) {
                      if (isCorrect) {
                        styleClass = 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold';
                      } else if (isPicked) {
                        styleClass = 'border-red-500 bg-red-50 text-red-900';
                      } else {
                        styleClass = 'border-slate-200 bg-slate-50 text-slate-400';
                      }
                    }
                    return (
                      <motion.button
                        key={idx}
                        type="button"
                        whileHover={demoSelectedOpt === null ? { y: -2 } : undefined}
                        whileTap={demoSelectedOpt === null ? { scale: 0.97 } : undefined}
                        onClick={() => handleDemoQuizPick(idx)}
                        className={`min-h-[48px] rounded-xl border p-3.5 text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-2 cursor-pointer ${styleClass}`}
                      >
                        <span>
                          <strong className="font-mono mr-1.5">
                            {String.fromCharCode(65 + idx)}.
                          </strong>
                          {opt}
                        </span>
                        {demoSelectedOpt !== null && isCorrect && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-5 rounded-2xl border border-slate-900 bg-[#0F172A] p-6 text-white flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="text-xs font-mono text-amber-300">
                    Akademi &amp; Toko Eksklusif 8B
                  </div>
                  <h4 className="text-lg font-bold leading-snug">
                    {demoSelectedOpt === null
                      ? 'Pilih satu jawaban untuk melihat cara kerja Koin Kelas 8B.'
                      : demoSelectedOpt === sampleQuestion.correctIndex
                      ? `Tepat! +${sampleQuestion.coinReward} Koin berhasil ditambahkan.`
                      : 'Belum tepat! Berikut pembahasan singkatnya:'}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {demoSelectedOpt !== null
                      ? sampleQuestion.explanation
                      : 'Di dalam portal member, setiap koin dari Kuis, Flashcard, Tugas, dan Timer Pomodoro dapat dibelanjakan untuk Banner & Gelar profil Kelas 8B.'}
                  </p>
                </div>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onOpenLogin('siswa')}
                  className="min-h-[44px] w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-xs font-bold text-slate-950 hover:bg-amber-300 transition-colors cursor-pointer"
                >
                  <span>Masuk untuk Simpan Koin &amp; Buka Toko</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </motion.button>
              </div>
            </div>
          </motion.section>
        )}

        {/* SECTION 03: JADWAL PELAJARAN INTERAKTIF SENIN – JUMAT */}
        {activeSection === 'beranda' && (
          <motion.section
            id="jadwal-8b"
            initial={{ opacity: 1, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.3 }}
            className="space-y-6 border-b border-slate-200 pb-16"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-indigo-700 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Jadwal Akademik &amp; Regu Piket Mingguan</span>
                </div>
                <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Jadwal Pelajaran Kelas 8B (Senin – Jumat)
                </h2>
              </div>

              <div className="flex items-center gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
                {JADWAL_PELAJARAN_8B.map((item) => {
                  const isActive = selectedDay === item.day;
                  return (
                    <button
                      key={item.day}
                      type="button"
                      onClick={() => setSelectedDay(item.day)}
                      className={`relative min-h-[40px] rounded-lg px-4 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive ? 'text-white' : 'text-slate-700 hover:text-slate-950'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="scheduleDayPill"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          className="absolute inset-0 rounded-lg bg-slate-900"
                        />
                      )}
                      <span className="relative z-10">{item.day}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <motion.div
              key={currentSchedule.day}
              initial={{ y: 8, opacity: 0.4 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.22 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
            >
              <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="text-xs font-mono font-bold text-indigo-700">
                    Hari {currentSchedule.day} · Kelas 8B
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {currentSchedule.theme}
                  </h3>
                  <div className="pt-2 space-y-2.5 text-xs text-slate-700 border-t border-slate-200">
                    <div>
                      <div className="text-slate-500">Seragam Wajib:</div>
                      <div className="font-semibold text-slate-900">{currentSchedule.Uniform}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Regu Piket Kebersihan:</div>
                      <div className="font-semibold text-emerald-700">
                        {currentSchedule.piketGroup}
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onOpenLogin('siswa')}
                  className="min-h-[44px] w-full rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Buka Tugas Hari {currentSchedule.day} →
                </motion.button>
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {currentSchedule.slots.map((slot, index) => (
                    <motion.div
                      key={`${currentSchedule.day}-${slot.time}`}
                      layout
                      initial={{ opacity: 0, y: 16, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.96 }}
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 28,
                        delay: index * 0.05,
                      }}
                      whileHover={{ y: -4, scale: 1.01 }}
                      className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between transition-colors hover:border-slate-300 shadow-2xs"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1.5 font-mono font-bold text-indigo-700 tabular-nums">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{slot.time} WIB</span>
                          </span>
                          <span className="font-mono text-slate-400">Sesi 0{index + 1}</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 leading-snug">
                          {slot.subject}
                        </h4>
                      </div>
                      <div className="pt-3 mt-3 border-t border-slate-100 text-xs text-slate-500">
                        {slot.teacherOrNote}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Ringkasan Cepat Matriks Jadwal Senin - Jumat Kelas 8B */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {[
                { day: 'Senin' as const, list: 'PKN · MTK · IPA · Sunda' },
                { day: 'Selasa' as const, list: 'MTK · IPA · BK · PAI' },
                { day: 'Rabu' as const, list: 'PJOK · SBK · B. Inggris' },
                { day: 'Kamis' as const, list: 'B. Indo · IPS' },
                { day: 'Jumat' as const, list: 'Informatika · B. Indo' },
              ].map((row) => {
                const isSelected = selectedDay === row.day;
                return (
                  <button
                    key={row.day}
                    type="button"
                    onClick={() => setSelectedDay(row.day)}
                    className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-[#F8FAFC] text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`text-xs font-bold ${
                        isSelected ? 'text-amber-300' : 'text-indigo-700'
                      }`}
                    >
                      Hari {row.day}
                    </div>
                    <div
                      className={`mt-1 text-xs font-semibold leading-snug ${
                        isSelected ? 'text-white' : 'text-slate-700'
                      }`}
                    >
                      {row.list}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* SECTION 03B: 6 FITUR BARU PUBLIK UNTUK PENGUNJUNG LANDING PAGE */}
        {activeSection === 'beranda' && <VisitorSixFeaturesHub />}

        {/* SECTION 04: PEMISAHAN AKSES PENGUNJUNG VS WARGA KELAS 8B */}
        {(activeSection === 'beranda' || activeSection === 'profil') && (
          <motion.section
            id="profil"
            initial={{ opacity: 1, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.3 }}
            className="space-y-6 border-b border-slate-200 pb-16"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-indigo-700">
                  Arsitektur Akses Terpisah
                </div>
                <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Pemisahan Mode Pengunjung &amp; Anggota Resmi Kelas 8B
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onOpenLogin('siswa')}
                className="min-h-[44px] inline-flex items-center text-xs font-bold text-slate-900 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                Masuk dengan Kode Verifikasi →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-700">Sedang Aktif · Publik</span>
                  <span className="font-mono text-slate-500">Tanpa Login</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Mode Pengunjung Website</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Terbuka untuk orang tua siswa, guru SMPN 18 Kota Bogor, dan tamu sekolah yang
                  membuka tautan portal:
                </p>
                <ul className="space-y-2.5 text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Membaca profil kelas, jadwal pelajaran Senin–Jumat &amp; pratinjau interaktif
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Melihat susunan pengurus 9 jabatan Kelas 8B SMPN 18 Kota Bogor</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Mengirim &amp; membaca Ulasan Pengunjung (Visitor Reviews) secara publik</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-900 bg-[#0F172A] text-white p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-300">Khusus Warga 8B</span>
                  <span className="font-mono text-slate-300">Wajib Verifikasi OTP</span>
                </div>
                <h3 className="text-lg font-bold text-white">Mode Anggota Resmi Kelas 8B</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Setelah memverifikasi Username, Kata Sandi &amp; Kode OTP dari Ibu Aida atau
                  Owner Web:
                </p>
                <ul className="space-y-2.5 text-sm text-slate-200">
                  <li className="flex items-start gap-2.5">
                    <BookOpen className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Dashboard Tugas Sekolah, Presensi Harian, Buku Kas &amp; Pengumuman</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <MessageSquare className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Live Group Chat 24/7 Real-Time &amp; Pesan Pribadi (DM) antarsiswa</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      Akademi Koin, Toko Banner, Timer Pomodoro, Surat Izin Digital &amp; 45 Fitur
                      Guru/Owner
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.section>
        )}

        {/* SECTION 05: STRUKTUR KEPENGURUSAN 9 PERAN KELAS 8B */}
        {(activeSection === 'beranda' || activeSection === 'struktur') && (
          <motion.section
            id="struktur"
            initial={{ opacity: 1, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.3 }}
            className="space-y-6 border-b border-slate-200 pb-16"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-indigo-700">
                  Otoritas &amp; Hak Akses Spesifik 9 Peran
                </div>
                <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Struktur Kepengurusan Kelas 8B SMPN 18 Kota Bogor
                </h2>
              </div>
              <div className="text-xs text-slate-500">
                Ketuk salah satu jabatan untuk memeriksa wewenang resminya
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {rolesList.map((roleKey) => {
                  const meta = ROLE_METADATA[roleKey];
                  const active = selectedRoleInfo === roleKey;
                  const holderName = officerNames[roleKey] || meta.shortLabel;
                  return (
                    <motion.button
                      key={roleKey}
                      type="button"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setSelectedRoleInfo(roleKey)}
                      className={`min-h-[84px] text-left rounded-2xl border p-4 transition-all cursor-pointer ${
                        active
                          ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`text-xs font-semibold ${
                          active ? 'text-amber-300' : 'text-indigo-700'
                        }`}
                      >
                        {meta.shortLabel}
                      </div>
                      <div className="mt-1 font-bold text-sm truncate">{meta.label}</div>
                      <div
                        className={`mt-1.5 text-xs truncate ${
                          active ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {holderName}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <motion.div
                key={selectedRoleInfo}
                initial={{ y: 8, opacity: 0.4 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="lg:col-span-5 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div>
                      <div className="text-xs font-medium text-slate-500">
                        Rincian Wewenang Peran
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {ROLE_METADATA[selectedRoleInfo].label}
                      </h3>
                    </div>
                    <div className="rounded-xl bg-white border border-slate-200 p-2.5 text-slate-700">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="text-xs text-slate-500">
                    Pejabat Aktif:{' '}
                    <span className="font-bold text-slate-900">
                      {officerNames[selectedRoleInfo] || ROLE_METADATA[selectedRoleInfo].shortLabel}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-800">
                      Hak Akses di Portal Kelas 8B:
                    </div>
                    {ROLE_METADATA[selectedRoleInfo].permissions.map((perm, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <span className="font-mono text-xs font-bold text-indigo-700 mt-0.5">
                          0{idx + 1}.
                        </span>
                        <span>{perm}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-500">Masuk dengan peran ini?</span>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onOpenLogin(selectedRoleInfo)}
                    className="min-h-[44px] rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Verifikasi Masuk →
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* SECTION 06: ULASAN PENGUNJUNG (VISITOR REVIEWS) */}
        {(activeSection === 'beranda' || activeSection === 'ulasan') && (
          <motion.section
            id="ulasan"
            initial={{ opacity: 1, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-indigo-700">
                  Buku Tamu Digital &amp; Apresiasi Publik
                </div>
                <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Ulasan Pengunjung Website Kelas 8B
                </h2>
              </div>
              <div className="text-xs text-slate-500">
                Terbuka untuk pengunjung, orang tua siswa, guru SMPN 18, dan teman lintas kelas
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <form
                onSubmit={handleReviewSubmit}
                className="lg:col-span-5 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 space-y-4 self-start"
              >
                <h3 className="text-base font-bold text-slate-900">
                  Tulis Ulasan &amp; Dukungan untuk Kelas 8B
                </h3>

                <div>
                  <label
                    htmlFor="visitor-name-input"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Nama Lengkap / Panggilan
                  </label>
                  <input
                    id="visitor-name-input"
                    type="text"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder="Contoh: Ibu Rina / Daffa 8A"
                    maxLength={60}
                    className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="visitor-relation-select"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Kategori Pengunjung
                    </label>
                    <select
                      id="visitor-relation-select"
                      value={relation}
                      onChange={(e) => setRelation(e.target.value)}
                      className="min-h-[44px] w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 bg-white focus:border-slate-900 focus:outline-none"
                    >
                      <option value="Tamu Sekolah">Tamu Sekolah</option>
                      <option value="Orang Tua Siswa">Orang Tua Siswa</option>
                      <option value="Guru SMPN 18">Guru SMPN 18</option>
                      <option value="Teman Kelas Lain">Teman Kelas Lain</option>
                      <option value="Alumni SMPN 18">Alumni SMPN 18</option>
                    </select>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Penilaian Bintang
                    </span>
                    <div className="flex items-center gap-0.5 pt-1">
                      {[1, 2, 3, 4, 5].map((starVal) => (
                        <motion.button
                          key={starVal}
                          type="button"
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.88 }}
                          onClick={() => setRating(starVal)}
                          aria-label={`Beri rating ${starVal} bintang`}
                          className="min-h-[40px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-amber-50 transition-colors cursor-pointer"
                        >
                          <Star
                            className={`h-5 w-5 ${
                              starVal <= rating
                                ? 'fill-amber-400 text-amber-500'
                                : 'text-slate-300'
                            }`}
                          />
                        </motion.button>
                      ))}
                      <span className="ml-1 font-mono text-xs font-bold text-slate-700 tabular-nums">
                        {rating}.0
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="visitor-message-input"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Pesan atau Kesan
                  </label>
                  <textarea
                    id="visitor-message-input"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tuliskan kesan atau semangat untuk Kelas 8B SMPN 18 Kota Bogor..."
                    maxLength={500}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                  />
                </div>

                {reviewError && (
                  <p className="text-xs font-semibold text-red-600" role="alert">
                    {reviewError}
                  </p>
                )}
                {reviewSuccess && (
                  <p className="text-xs font-semibold text-emerald-700" role="status">
                    {reviewSuccess}
                  </p>
                )}

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.96 }}
                  className="min-h-[46px] w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Publikasikan Ulasan Pengunjung</span>
                </motion.button>
              </form>

              <div className="lg:col-span-7 space-y-3.5">
                {reviews.map((rev, idx) => (
                  <motion.article
                    key={rev.id}
                    initial={{ y: 8, opacity: 0.4 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.22, delay: Math.min(idx * 0.03, 0.15) }}
                    className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-2 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-bold text-sm text-slate-900">{rev.visitorName}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-medium text-indigo-700">{rev.relation}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{rev.createdAtLabel}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-600 font-mono text-xs font-bold tabular-nums shrink-0">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{rev.message}</p>
                  </motion.article>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
