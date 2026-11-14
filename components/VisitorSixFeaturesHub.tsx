'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Calculator,
  BookOpenCheck,
  BarChart3,
  Sparkles,
  IdCard,
  CheckCircle2,
  Search,
  Heart,
  Copy,
  HelpCircle,
} from 'lucide-react';
import {
  DaySchedule,
  SCHOOLBAG_ITEMS_BY_DAY,
  FormulaMode,
  calculateScienceMathFormula,
  searchSundaDictionary,
  INITIAL_VISITOR_POLL,
  VisitorPollOption,
  SHOWCASE_KARYA_8B,
  ShowcaseKaryaItem,
  generateVisitorPassCard,
} from '@/lib/class8b-logic';

export function VisitorSixFeaturesHub() {
  const [activeHubTab, setActiveHubTab] = useState<'semua' | 'akademik' | 'interaktif'>('semua');

  // =========================================================================
  // FITUR VISITOR #1: CEK BUKU & PERLENGKAPAN TAS HARIAN (SENIN - JUMAT)
  // =========================================================================
  const [bagDay, setBagDay] = useState<DaySchedule['day']>('Senin');
  const [checkedBagIds, setCheckedBagIds] = useState<string[]>(['sen-1', 'sen-2']);

  const currentBagItems = SCHOOLBAG_ITEMS_BY_DAY[bagDay];
  const checkedInCurrentDay = currentBagItems.filter((i) => checkedBagIds.includes(i.id)).length;
  const bagProgressPct =
    currentBagItems.length > 0
      ? Math.round((checkedInCurrentDay / currentBagItems.length) * 100)
      : 0;

  const toggleBagItem = (id: string) => {
    setCheckedBagIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // =========================================================================
  // FITUR VISITOR #2: LAB KALKULATOR RUMUS CEPAT MTK & IPA KELAS 8
  // =========================================================================
  const [formulaMode, setFormulaMode] = useState<FormulaMode>('pythagoras');
  const [inputA, setInputA] = useState<number>(6);
  const [inputB, setInputB] = useState<number>(8);

  const calcResult = calculateScienceMathFormula({
    mode: formulaMode,
    a: inputA,
    b: inputB,
    c: 10,
  });

  // =========================================================================
  // FITUR VISITOR #3: KAMUS MINI & UNGGAH-UNGGUH BASA SUNDA BOGOR
  // =========================================================================
  const [sundaQuery, setSundaQuery] = useState('');
  const sundaResults = searchSundaDictionary(sundaQuery);

  // =========================================================================
  // FITUR VISITOR #4: POLLING PUBLIK SUARA PENGUNJUNG KELAS 8B
  // =========================================================================
  const [pollOptions, setPollOptions] = useState<VisitorPollOption[]>(INITIAL_VISITOR_POLL);
  const [votedPollId, setVotedPollId] = useState<string | null>(null);

  const totalPollVotes = pollOptions.reduce((acc, o) => acc + o.votes, 0);

  const handleVotePoll = (optionId: string) => {
    if (votedPollId === optionId) return;
    setPollOptions((prev) =>
      prev.map((opt) => {
        if (opt.id === optionId) return { ...opt, votes: opt.votes + 1 };
        if (votedPollId && opt.id === votedPollId) return { ...opt, votes: Math.max(0, opt.votes - 1) };
        return opt;
      })
    );
    setVotedPollId(optionId);
  };

  // =========================================================================
  // FITUR VISITOR #5: ETALASE PAMERAN KARYA & PROYEK SISWA 8B
  // =========================================================================
  const [karyaFilter, setKaryaFilter] = useState<'Semua' | 'Informatika' | 'IPA' | 'SBK' | 'B. Indo'>('Semua');
  const [karyaItems, setKaryaItems] = useState<ShowcaseKaryaItem[]>(SHOWCASE_KARYA_8B);
  const [likedKaryaIds, setLikedKaryaIds] = useState<string[]>([]);

  const filteredKarya = karyaItems.filter(
    (k) => karyaFilter === 'Semua' || k.subjectTag === karyaFilter
  );

  const handleLikeKarya = (id: string) => {
    if (likedKaryaIds.includes(id)) return;
    setLikedKaryaIds((prev) => [...prev, id]);
    setKaryaItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, likes: item.likes + 1 } : item))
    );
  };

  // =========================================================================
  // FITUR VISITOR #6: GENERATOR KARTU KUNJUNGAN DIGITAL & FAQ SMPN 18
  // =========================================================================
  const [passName, setPassName] = useState('Ibu Kartika');
  const [passRole, setPassRole] = useState('Orang Tua Siswa 8B');
  const [passPurpose, setPassPurpose] = useState('Melihat Jadwal Pelajaran & Karya Siswa');
  const [passCopied, setPassCopied] = useState(false);

  const visitorPass = generateVisitorPassCard({
    visitorName: passName,
    visitorRole: passRole,
    purpose: passPurpose,
  });

  const handleCopyPass = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(visitorPass.formattedPass).catch(() => {});
    }
    setPassCopied(true);
    window.setTimeout(() => setPassCopied(false), 2500);
  };

  return (
    <section
      id="fitur-visitor-8b"
      className="space-y-8 border-b border-slate-200 pb-16"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-indigo-700 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>6 Fitur Publik Interaktif · Terbuka Tanpa Login untuk Tamu &amp; Siswa</span>
          </div>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Pusat Utilitas &amp; Eksplorasi Pengunjung Kelas 8B
          </h2>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
          {(
            [
              { id: 'semua', label: 'Semua 6 Fitur Pengunjung' },
              { id: 'akademik', label: 'Tas Harian, Rumus & Sunda' },
              { id: 'interaktif', label: 'Polling, Karya & Kartu Tamu' },
            ] as const
          ).map((tab) => {
            const active = activeHubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveHubTab(tab.id)}
                className={`relative min-h-[40px] rounded-lg px-3.5 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active ? 'text-white' : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="visitorHubTabPill"
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

      {/* =====================================================================
          KELOMPOK A (FITUR VISITOR 1, 2, 3): TAS HARIAN, KALKULATOR RUMUS, KAMUS SUNDA
         ===================================================================== */}
      {(activeHubTab === 'semua' || activeHubTab === 'akademik') && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
        >
          {/* FITUR VISITOR #1: CEK BUKU & PERLENGKAPAN TAS HARIAN SENIN - JUMAT */}
          <motion.div
            whileHover={{ y: -3 }}
            className="lg:col-span-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5 sm:p-6 flex flex-col justify-between space-y-4 transition-colors hover:border-slate-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <div className="text-[11px] font-semibold text-indigo-700">
                    Fitur Pengunjung #01
                  </div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-slate-800" />
                    <span>Cek Buku Tas Harian 8B</span>
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-700 tabular-nums">
                  {bagProgressPct}% Siap
                </span>
              </div>

              <div className="flex items-center gap-1 overflow-x-auto rounded-lg bg-slate-200/75 p-1">
                {(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setBagDay(d)}
                    className={`min-h-[34px] flex-1 rounded-md px-2 py-1 text-[11px] font-bold transition-colors cursor-pointer ${
                      bagDay === d
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:text-slate-950'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                {currentBagItems.map((item) => {
                  const checked = checkedBagIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleBagItem(item.id)}
                      className={`min-h-[44px] w-full rounded-xl border p-3 text-left flex items-center justify-between gap-2.5 transition-colors cursor-pointer ${
                        checked
                          ? 'border-emerald-300 bg-emerald-50/70 text-emerald-950'
                          : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold leading-snug">{item.label}</div>
                        <div className="text-[10px] text-slate-500">{item.category}</div>
                      </div>
                      <CheckCircle2
                        className={`h-4 w-4 shrink-0 ${
                          checked ? 'text-emerald-600' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Sesuai jadwal resmi Hari {bagDay}</span>
              <span className="font-mono font-bold text-slate-800 tabular-nums">
                {checkedInCurrentDay}/{currentBagItems.length} Barang
              </span>
            </div>
          </motion.div>

          {/* FITUR VISITOR #2: LAB KALKULATOR RUMUS CEPAT MTK & IPA KELAS 8 */}
          <motion.div
            whileHover={{ y: -3 }}
            className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 flex flex-col justify-between space-y-4 transition-colors hover:border-slate-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <div className="text-[11px] font-semibold text-indigo-700">
                    Fitur Pengunjung #02
                  </div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-indigo-600" />
                    <span>Kalkulator Rumus MTK &amp; IPA</span>
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-slate-600">
                  {calcResult.formulaLabel}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: 'pythagoras', label: 'Pythagoras' },
                    { id: 'gradien', label: 'Gradien Garis' },
                    { id: 'hidrostatis', label: 'Tekanan IPA' },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setFormulaMode(m.id);
                      if (m.id === 'pythagoras') {
                        setInputA(6);
                        setInputB(8);
                      } else if (m.id === 'gradien') {
                        setInputA(12);
                        setInputB(3);
                      } else {
                        setInputA(1000);
                        setInputB(2);
                      }
                    }}
                    className={`min-h-[38px] rounded-xl border text-[11px] font-bold transition-colors cursor-pointer ${
                      formulaMode === m.id
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="calc-input-a"
                    className="block text-[11px] font-semibold text-slate-600 mb-1"
                  >
                    {formulaMode === 'pythagoras'
                      ? 'Sisi Tegak a (cm)'
                      : formulaMode === 'gradien'
                      ? 'Perubahan Δy'
                      : 'Massa Jenis ρ (kg/m³)'}
                  </label>
                  <input
                    id="calc-input-a"
                    type="number"
                    inputMode="decimal"
                    value={inputA}
                    onChange={(e) => setInputA(Number(e.target.value))}
                    className="min-h-[44px] w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono font-bold text-slate-900 tabular-nums"
                  />
                </div>

                <div>
                  <label
                    htmlFor="calc-input-b"
                    className="block text-[11px] font-semibold text-slate-600 mb-1"
                  >
                    {formulaMode === 'pythagoras'
                      ? 'Sisi Alas b (cm)'
                      : formulaMode === 'gradien'
                      ? 'Perubahan Δx'
                      : 'Kedalaman h (meter)'}
                  </label>
                  <input
                    id="calc-input-b"
                    type="number"
                    inputMode="decimal"
                    value={inputB}
                    onChange={(e) => setInputB(Number(e.target.value))}
                    className="min-h-[44px] w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono font-bold text-slate-900 tabular-nums"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-900 bg-[#0F172A] p-4 text-white space-y-1.5">
                <div className="text-[11px] font-mono text-amber-300">
                  Hasil Perhitungan Instan:
                </div>
                <div className="text-xl font-mono font-extrabold text-white tabular-nums">
                  {calcResult.resultText}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {calcResult.stepExplanation}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              Materi MTK &amp; IPA Hari Senin &amp; Selasa Kelas 8B
            </div>
          </motion.div>

          {/* FITUR VISITOR #3: KAMUS MINI & UNGGAH-UNGGUH BASA SUNDA BOGOR */}
          <motion.div
            whileHover={{ y: -3 }}
            className="lg:col-span-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5 sm:p-6 flex flex-col justify-between space-y-4 transition-colors hover:border-slate-300"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <div className="text-[11px] font-semibold text-indigo-700">
                    Fitur Pengunjung #03
                  </div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <BookOpenCheck className="h-4 w-4 text-emerald-700" />
                    <span>Kamus Mini Basa Sunda Bogor</span>
                  </h3>
                </div>
                <span className="font-mono text-[11px] font-bold text-emerald-700">
                  Mapel Senin
                </span>
              </div>

              <div className="relative">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  aria-label="Cari kosakata Basa Sunda atau Indonesia"
                  value={sundaQuery}
                  onChange={(e) => setSundaQuery(e.target.value)}
                  placeholder="Cari kata Sunda / Indonesia (mis. wilujeng, nuhun)..."
                  className="min-h-[42px] w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                {sundaResults.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-xl border border-slate-200 bg-white p-3 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-slate-900">{entry.sunda}</span>
                      <span className="text-[10px] font-mono font-semibold text-indigo-700">
                        {entry.ragam}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-emerald-700">
                      Arti: {entry.indonesia}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug italic">
                      &ldquo;{entry.example}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
              Muatan Lokal Basa Sunda SMPN 18 Kota Bogor
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* =====================================================================
          KELOMPOK B (FITUR VISITOR 4, 5, 6): POLLING PUBLIK, PAMERAN KARYA, KARTU TAMU & FAQ
         ===================================================================== */}
      {(activeHubTab === 'semua' || activeHubTab === 'interaktif') && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
        >
          {/* FITUR VISITOR #4: POLLING PUBLIK MATA PELAJARAN FAVORIT KELAS 8B */}
          <motion.div
            whileHover={{ y: -3 }}
            className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 flex flex-col justify-between space-y-4 transition-colors hover:border-slate-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <div className="text-[11px] font-semibold text-indigo-700">
                    Fitur Pengunjung #04
                  </div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-amber-600" />
                    <span>Polling Publik Mapel Favorit 8B</span>
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-slate-600 tabular-nums">
                  {totalPollVotes} Suara
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Ketuk salah satu rumpun mata pelajaran Kelas 8B untuk memberikan suara dukunganmu:
              </p>

              <div className="space-y-2.5">
                {pollOptions.map((opt) => {
                  const pct =
                    totalPollVotes > 0 ? Math.round((opt.votes / totalPollVotes) * 100) : 0;
                  const isVoted = votedPollId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleVotePoll(opt.id)}
                      className={`min-h-[54px] w-full rounded-xl border p-3 text-left transition-all cursor-pointer ${
                        isVoted
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-[#F8FAFC] text-slate-900 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs font-bold">
                        <span>{opt.label}</span>
                        <span className="font-mono tabular-nums">{pct}%</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[10px] opacity-80">
                        <span>Jadwal: {opt.scheduleDay}</span>
                        <span className="font-mono tabular-nums">{opt.votes} dukungan</span>
                      </div>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200/60 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.35 }}
                          className={`h-full rounded-full ${
                            isVoted ? 'bg-amber-400' : 'bg-indigo-600'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              {votedPollId
                ? 'Terima kasih! Suara kamu sudah tercatat di Polling Kelas 8B.'
                : 'Pilih satu opsi di atas untuk melihat pembaruan grafik.'}
            </div>
          </motion.div>

          {/* FITUR VISITOR #5: ETALASE PAMERAN KARYA & PROYEK SISWA 8B */}
          <motion.div
            whileHover={{ y: -3 }}
            className="lg:col-span-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5 sm:p-6 flex flex-col justify-between space-y-4 transition-colors hover:border-slate-300"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <div className="text-[11px] font-semibold text-indigo-700">
                    Fitur Pengunjung #05
                  </div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                    <span>Etalase Karya Siswa Kelas 8B</span>
                  </h3>
                </div>
                <span className="font-mono text-xs text-slate-500">
                  {filteredKarya.length} Karya
                </span>
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {(['Semua', 'Informatika', 'IPA', 'SBK', 'B. Indo'] as const).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setKaryaFilter(tag)}
                    className={`min-h-[32px] rounded-lg px-2.5 py-1 text-[11px] font-bold whitespace-nowrap cursor-pointer ${
                      karyaFilter === tag
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="space-y-2.5 max-h-[255px] overflow-y-auto pr-1">
                {filteredKarya.map((item) => {
                  const liked = likedKaryaIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold text-indigo-700">
                          {item.subjectTag}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleLikeKarya(item.id)}
                          className={`min-h-[30px] inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-mono font-bold tabular-nums transition-colors cursor-pointer ${
                            liked
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <Heart
                            className={`h-3 w-3 ${liked ? 'fill-rose-500 text-rose-500' : ''}`}
                          />
                          <span>{item.likes}</span>
                        </button>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{item.summary}</p>
                      <div className="text-[10px] text-slate-400 font-medium">{item.creator}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
              Ketuk tombol hati untuk memberi apresiasi karya siswa 8B
            </div>
          </motion.div>

          {/* FITUR VISITOR #6: GENERATOR KARTU KUNJUNGAN DIGITAL & FAQ INTERAKTIF */}
          <motion.div
            whileHover={{ y: -3 }}
            className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 flex flex-col justify-between space-y-4 transition-colors hover:border-slate-300"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <div className="text-[11px] font-semibold text-indigo-700">
                    Fitur Pengunjung #06
                  </div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <IdCard className="h-4 w-4 text-slate-800" />
                    <span>Kartu Tamu Digital &amp; Info 8B</span>
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-700">
                  {visitorPass.passCode}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label
                    htmlFor="vpass-name"
                    className="block text-[11px] font-semibold text-slate-600 mb-1"
                  >
                    Nama Pengunjung
                  </label>
                  <input
                    id="vpass-name"
                    type="text"
                    value={passName}
                    onChange={(e) => setPassName(e.target.value)}
                    maxLength={50}
                    className="min-h-[40px] w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label
                    htmlFor="vpass-role"
                    className="block text-[11px] font-semibold text-slate-600 mb-1"
                  >
                    Peran Tamu
                  </label>
                  <select
                    id="vpass-role"
                    value={passRole}
                    onChange={(e) => setPassRole(e.target.value)}
                    className="min-h-[40px] w-full rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900"
                  >
                    <option value="Orang Tua Siswa 8B">Orang Tua Siswa 8B</option>
                    <option value="Guru SMPN 18 Bogor">Guru SMPN 18 Bogor</option>
                    <option value="Teman Lintas Kelas">Teman Lintas Kelas</option>
                    <option value="Tamu Sekolah">Tamu Sekolah</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="vpass-purpose"
                  className="block text-[11px] font-semibold text-slate-600 mb-1"
                >
                  Keperluan Kunjungan
                </label>
                <input
                  id="vpass-purpose"
                  type="text"
                  value={passPurpose}
                  onChange={(e) => setPassPurpose(e.target.value)}
                  maxLength={80}
                  className="min-h-[40px] w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
                />
              </div>

              <div className="rounded-2xl border border-slate-900 bg-[#0F172A] p-3.5 text-white space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-amber-300">
                  <span>PAS KUNJUNGAN RESMI 8B</span>
                  <span>{visitorPass.passCode}</span>
                </div>
                <div className="text-xs font-bold truncate">{passName || 'Tamu Kelas 8B'}</div>
                <div className="text-[11px] text-slate-300 truncate">
                  {passRole} · {passPurpose}
                </div>
                <button
                  type="button"
                  onClick={handleCopyPass}
                  className="min-h-[36px] w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-[11px] font-bold text-white transition-colors cursor-pointer"
                >
                  <Copy className="h-3 w-3 text-amber-300" />
                  <span>
                    {passCopied ? 'Kartu Tamu Berhasil Disalin!' : 'Salin Bukti Kartu Tamu'}
                  </span>
                </button>
              </div>

              {/* Native Accessible Accordion FAQ per Modern Web Guidance */}
              <div className="space-y-1.5 pt-1">
                <details className="group rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs">
                  <summary className="font-bold text-slate-800 cursor-pointer flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5">
                      <HelpCircle className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Bagaimana cara mendapatkan Kode OTP Siswa?</span>
                    </span>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform">
                      ▾
                    </span>
                  </summary>
                  <p className="mt-1.5 text-[11px] text-slate-600 leading-relaxed">
                    Kode OTP dibagikan langsung oleh Wali Kelas Ibu Aida, S.Pd. atau Owner Web di
                    grup kelas resmi agar hanya anggota Kelas 8B yang dapat masuk.
                  </p>
                </details>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              Terhubung dengan Buku Tamu Kelas 8B SMPN 18 Bogor
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
