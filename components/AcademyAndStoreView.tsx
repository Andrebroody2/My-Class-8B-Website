'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Coins,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  BookOpen,
  Layers,
  Flame,
} from 'lucide-react';
import {
  GRADE_8_QUIZ_BANK,
  GRADE_8_FLASHCARDS,
  CLASS_STORE_ITEMS,
  calculateQuizReward,
} from '@/lib/class8b-logic';
import { BannerArtwork, TitleInsignia } from './BannerArtwork';

interface AcademyAndStoreViewProps {
  initialMode: 'akademi' | 'toko';
  coins: number;
  unlockedItems: string[];
  equippedBanner: string;
  equippedTitle: string;
  doubleCoinActive: boolean;
  storeDiscountActive: boolean;
  onEarnCoins: (amount: number, reason: string) => void;
  onPurchaseItem: (itemId: string) => { success: boolean; error?: string };
  onEquipBanner: (bannerId: string) => void;
  onEquipTitle: (titleId: string) => void;
}

export function AcademyAndStoreView({
  initialMode,
  coins,
  unlockedItems,
  equippedBanner,
  equippedTitle,
  doubleCoinActive,
  storeDiscountActive,
  onEarnCoins,
  onPurchaseItem,
  onEquipBanner,
  onEquipTitle,
}: AcademyAndStoreViewProps) {
  const [activeTab, setActiveTab] = useState<'kuis' | 'flashcard' | 'toko'>(
    initialMode === 'toko' ? 'toko' : 'kuis'
  );

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<{
    correct: boolean;
    earned: number;
    explanation: string;
  } | null>(null);

  // Flashcard state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [claimedCards, setClaimedCards] = useState<string[]>([]);

  // Store state
  const [storeFilter, setStoreFilter] = useState<'semua' | 'banner' | 'title'>('semua');
  const [storeNotice, setStoreNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null
  );

  const currentQuestion = GRADE_8_QUIZ_BANK[quizIndex];
  const currentCard = GRADE_8_FLASHCARDS[cardIndex];

  const handleAnswerQuiz = (optIndex: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optIndex);
    const isCorrect = optIndex === currentQuestion.correctIndex;
    if (isCorrect) {
      const earned = calculateQuizReward(currentQuestion.coinReward, streak, doubleCoinActive);
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setQuizFeedback({
        correct: true,
        earned,
        explanation: currentQuestion.explanation,
      });
      onEarnCoins(earned, `Kuis ${currentQuestion.subject}`);
    } else {
      setStreak(0);
      setQuizFeedback({
        correct: false,
        earned: 0,
        explanation: currentQuestion.explanation,
      });
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setQuizFeedback(null);
    setQuizIndex((prev) => (prev + 1) % GRADE_8_QUIZ_BANK.length);
  };

  const handleClaimFlashcard = () => {
    if (claimedCards.includes(currentCard.id)) return;
    const reward = doubleCoinActive ? currentCard.coinReward * 2 : currentCard.coinReward;
    setClaimedCards((prev) => [...prev, currentCard.id]);
    onEarnCoins(reward, `Flashcard ${currentCard.frontTitle}`);
  };

  const handleBuyOrEquip = (itemId: string, type: 'banner' | 'title') => {
    setStoreNotice(null);
    if (unlockedItems.includes(itemId)) {
      if (type === 'banner') {
        onEquipBanner(itemId);
        setStoreNotice({
          type: 'ok',
          text: 'Banner berhasil dipasang ke profil Dashboard & ruang Live Chat 24/7!',
        });
      } else {
        onEquipTitle(itemId);
        setStoreNotice({ type: 'ok', text: 'Gelar kehormatan berhasil dipasang!' });
      }
      return;
    }

    const res = onPurchaseItem(itemId);
    if (!res.success) {
      setStoreNotice({ type: 'err', text: res.error || 'Gagal membeli item.' });
    } else {
      if (type === 'banner') onEquipBanner(itemId);
      else onEquipTitle(itemId);
      setStoreNotice({
        type: 'ok',
        text: 'Pembelian berhasil! Koleksi langsung dipasang ke profil Kelas 8B kamu.',
      });
    }
  };

  const filteredStoreItems = CLASS_STORE_ITEMS.filter((item) => {
    if (storeFilter === 'semua') return true;
    return item.type === storeFilter;
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Header & Saldo Koin */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="text-xs font-semibold text-indigo-600">
            Kurikulum Merdeka Kelas 8 SMP · Sistem Ekonomi Koin &amp; Toko Eksklusif 8B
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Arena Edukasi Koin &amp; Toko Banner Kelas 8B
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <motion.div
            key={coins}
            initial={{ scale: 0.94 }}
            animate={{ scale: 1 }}
            className="rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-50 to-white px-4 py-2.5 flex items-center gap-2 shadow-2xs"
          >
            <Coins className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-medium text-slate-600">Saldo Kamu:</span>
            <span className="font-mono font-bold text-base text-slate-900 tabular-nums">
              {coins} Koin
            </span>
          </motion.div>

          <div className="flex items-center gap-1 rounded-2xl bg-slate-200/75 p-1.5">
            {(
              [
                { id: 'kuis', label: 'Kuis Kelas 8', icon: BookOpen },
                { id: 'flashcard', label: 'Flashcard Swipe', icon: Layers },
                { id: 'toko', label: 'Toko Eksklusif 8B', icon: ShoppingBag },
              ] as const
            ).map((tab) => {
              const IconComp = tab.icon;
              const isAct = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
                    isAct ? 'text-white' : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  {isAct && (
                    <motion.span
                      layoutId="academyModeTab"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute inset-0 rounded-xl bg-slate-900"
                    />
                  )}
                  <IconComp className="relative z-10 h-3.5 w-3.5" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {doubleCoinActive && (
        <motion.div
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          className="rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 via-amber-100/70 to-amber-50 px-5 py-3.5 flex items-center justify-between text-xs text-amber-950"
        >
          <span className="font-bold">
            Event Bonus Koin 2x Lipat Aktif (Diaktifkan oleh Owner / Bu Aida): Semua hadiah Kuis
            dan Flashcard digandakan!
          </span>
          <span className="font-mono font-bold">2X REWARD</span>
        </motion.div>
      )}

      {/* TAB 1: KUIS KURIKULUM KELAS 8 SMP */}
      {activeTab === 'kuis' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <motion.div
            key={currentQuestion.id}
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.22 }}
            className="lg:col-span-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-bold text-indigo-700">{currentQuestion.subject}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  Soal {quizIndex + 1} dari {GRADE_8_QUIZ_BANK.length}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono tabular-nums">
                <span className="inline-flex items-center gap-1 text-slate-700 font-semibold">
                  <Flame className="h-3.5 w-3.5 text-orange-500" />
                  Streak: {streak}x
                </span>
                <span className="font-bold text-amber-600">
                  Hadiah: +
                  {calculateQuizReward(currentQuestion.coinReward, streak, doubleCoinActive)} Koin
                </span>
              </div>
            </div>

            {/* Progress Bar Soal */}
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.round(((quizIndex + 1) / GRADE_8_QUIZ_BANK.length) * 100)}%`,
                }}
                className="h-full rounded-full bg-slate-900"
              />
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {currentQuestion.question}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isRight = idx === currentQuestion.correctIndex;
                let btnStyle =
                  'border-slate-200/90 bg-white text-slate-900 hover:border-slate-900 hover:bg-slate-50';
                if (selectedOption !== null) {
                  if (isRight) {
                    btnStyle = 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'border-red-500 bg-red-50 text-red-900';
                  } else {
                    btnStyle = 'border-slate-200 bg-slate-50 text-slate-400';
                  }
                }

                return (
                  <motion.button
                    key={idx}
                    type="button"
                    whileHover={selectedOption === null ? { y: -2 } : undefined}
                    whileTap={selectedOption === null ? { scale: 0.98 } : undefined}
                    disabled={selectedOption !== null}
                    onClick={() => handleAnswerQuiz(idx)}
                    className={`rounded-2xl border p-4 text-left text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                  >
                    <span>
                      <span className="font-mono text-xs font-bold mr-2 opacity-70">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      {opt}
                    </span>
                    {selectedOption !== null && isRight && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    )}
                    {selectedOption !== null && isSelected && !isRight && (
                      <XCircle className="h-4 w-4 text-red-600 shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {quizFeedback && (
              <motion.div
                initial={{ y: 8 }}
                animate={{ y: 0 }}
                className={`rounded-2xl border p-4 space-y-2 ${
                  quizFeedback.correct
                    ? 'border-emerald-300 bg-emerald-50/90 text-emerald-950'
                    : 'border-amber-300 bg-amber-50/90 text-amber-950'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>
                    {quizFeedback.correct
                      ? `Jawaban Tepat! Saldo kamu bertambah +${quizFeedback.earned} Koin Kelas 8B.`
                      : 'Jawaban kurang tepat. Pelajari pembahasan singkat di bawah ini:'}
                  </span>
                </div>
                <p className="text-xs leading-relaxed">{quizFeedback.explanation}</p>
              </motion.div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('flashcard')}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Beralih ke Mode Flashcard →
              </button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNextQuestion}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <span>Soal Berikutnya</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </motion.button>
            </div>
          </motion.div>

          <div className="lg:col-span-4 rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900">
              Panduan Meraih Koin Kelas 8B
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Seluruh soal dirancang mengikuti materi Kurikulum Merdeka Kelas 8 SMP Negeri 18 Kota
              Bogor (Matematika, IPA, IPS, Bahasa Indonesia, PPKn, dan Bahasa Inggris).
            </p>
            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span>Jawaban Kuis Benar</span>
                <span className="font-mono font-bold text-amber-600">+25 s/d +30 Koin</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span>Bonus Jawaban Beruntun (Streak)</span>
                <span className="font-mono font-bold text-amber-600">+5 s/d +25 Koin</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span>Hafalan Kartu Flashcard</span>
                <span className="font-mono font-bold text-amber-600">+15 Koin / Kartu</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Menyelesaikan Tugas Sekolah</span>
                <span className="font-mono font-bold text-amber-600">+30 s/d +50 Koin</span>
              </div>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setActiveTab('toko')}
              className="w-full rounded-xl border border-slate-900 bg-slate-900 px-4 py-3 text-xs font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Tukarkan Koin di Toko Eksklusif 8B →
            </motion.button>
          </div>
        </div>
      )}

      {/* TAB 2: FLASHCARD INTERAKTIF KELAS 8 */}
      {activeTab === 'flashcard' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold text-indigo-700">{currentCard.subject}</span>
              <span className="font-mono font-semibold tabular-nums">
                Kartu {cardIndex + 1} / {GRADE_8_FLASHCARDS.length}
              </span>
            </div>

            <motion.div
              key={`${currentCard.id}-${isFlipped ? 'back' : 'front'}`}
              initial={{ rotateX: 12, y: 6 }}
              animate={{ rotateX: 0, y: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              onClick={() => setIsFlipped(!isFlipped)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setIsFlipped(!isFlipped);
              }}
              className={`min-h-[240px] rounded-3xl border p-6 sm:p-8 flex flex-col justify-between transition-colors cursor-pointer shadow-md ${
                isFlipped
                  ? 'border-slate-900 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white'
                  : 'border-slate-200 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 text-slate-900 hover:border-slate-400'
              }`}
            >
              <div className="text-xs font-semibold opacity-75">
                {isFlipped
                  ? 'Jawaban & Rumus Kunci (Klik kartu untuk balik ke soal)'
                  : 'Pertanyaan Konsep Kurikulum Kelas 8 (Klik kartu untuk membalik)'}
              </div>

              <div className="space-y-3 my-4">
                <h2 className="text-xl sm:text-2xl font-bold">{currentCard.frontTitle}</h2>
                <p className="text-sm sm:text-base leading-relaxed">
                  {isFlipped ? currentCard.backAnswer : currentCard.frontPrompt}
                </p>
                {isFlipped && (
                  <div className="inline-block rounded-xl bg-white/10 border border-white/15 px-4 py-2 font-mono text-xs font-bold text-amber-300">
                    {currentCard.formulaOrKey}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs opacity-75">
                <span>Sentuh / Klik kartu untuk animasi balik</span>
                <span className="font-mono font-bold">+{currentCard.coinReward} Koin</span>
              </div>
            </motion.div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <motion.button
                  type="button"
                  whileHover={{ x: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setIsFlipped(false);
                    setCardIndex((prev) =>
                      prev === 0 ? GRADE_8_FLASHCARDS.length - 1 : prev - 1
                    );
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Sebelumnya</span>
                </motion.button>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Balik Kartu</span>
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setIsFlipped(false);
                    setCardIndex((prev) => (prev + 1) % GRADE_8_FLASHCARDS.length);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <span>Berikutnya</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </motion.button>
              </div>

              {claimedCards.includes(currentCard.id) ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Koin Kartu Ini Sudah Diklaim</span>
                </span>
              ) : (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClaimFlashcard}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>
                    Sudah Hafal (+
                    {doubleCoinActive ? currentCard.coinReward * 2 : currentCard.coinReward} Koin)
                  </span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TOKO EKSKLUSIF KELAS 8B (BANNERS & TITLES) */}
      {activeTab === 'toko' && (
        <div className="space-y-6">
          {/* Live Equipped Banner & Title Preview Stage */}
          <BannerArtwork
            bannerId={equippedBanner}
            className="min-h-[140px] w-full rounded-3xl border border-slate-800 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
              <div className="space-y-1">
                <div className="text-xs text-amber-300 font-medium">
                  Pratinjau Langsung Kosmetik Profil &amp; Live Chat 24/7 Kamu
                </div>
                <div className="text-xl font-bold">
                  {CLASS_STORE_ITEMS.find((i) => i.id === equippedBanner)?.name ||
                    'Standar Akademik 8B'}
                </div>
                <div className="pt-1">
                  <TitleInsignia titleId={equippedTitle} size="md" />
                </div>
              </div>
              <div className="text-xs text-slate-200 max-w-xs">
                Setiap Banner dan Gelar yang kamu pasang otomatis dilihat oleh seluruh teman Kelas
                8B di Live Group Chat!
              </div>
            </div>
          </BannerArtwork>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">
                Koleksi Seni Banner Arsitektural &amp; Gelar Kehormatan Kelas 8B
              </h2>
              <p className="text-xs text-slate-600">
                Dirancang khusus dengan ilustrasi resolusi tinggi &amp; geometri vektor — bukan
                sekadar emoji biasa.
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-xl bg-slate-200/70 p-1">
              {(['semua', 'banner', 'title'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setStoreFilter(f)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg capitalize transition-colors cursor-pointer ${
                    storeFilter === f
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f === 'semua'
                    ? 'Semua Koleksi'
                    : f === 'banner'
                    ? 'Banner Profil'
                    : 'Gelar / Title'}
                </button>
              ))}
            </div>
          </div>

          {storeNotice && (
            <motion.div
              initial={{ y: -6 }}
              animate={{ y: 0 }}
              role="status"
              className={`rounded-2xl border px-4 py-3 text-xs font-bold ${
                storeNotice.type === 'ok'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                  : 'border-red-200 bg-red-50 text-red-800'
              }`}
            >
              {storeNotice.text}
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredStoreItems.map((item, idx) => {
              const isOwned = unlockedItems.includes(item.id);
              const isEquipped =
                item.type === 'banner'
                  ? equippedBanner === item.id
                  : equippedTitle === item.id;
              const effectivePrice = storeDiscountActive
                ? Math.floor(item.price * 0.5)
                : item.price;

              return (
                <motion.div
                  key={item.id}
                  initial={{ y: 12 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                  whileHover={{ y: -4 }}
                  className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all"
                >
                  <div className="space-y-3.5">
                    {item.type === 'banner' ? (
                      <BannerArtwork
                        bannerId={item.id}
                        className="h-32 w-full rounded-2xl border border-slate-800"
                      >
                        <div className="flex items-center justify-between text-xs text-white">
                          <span className="font-bold">{item.name}</span>
                          <span className="font-mono text-amber-300">{item.rarity}</span>
                        </div>
                        <div className="text-xs text-slate-200">
                          Pratinjau Latar Profil &amp; Live Chat Kelas 8B
                        </div>
                      </BannerArtwork>
                    ) : (
                      <div className="h-28 w-full rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 flex flex-col justify-between border border-slate-800">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Lencana Gelar Kehormatan</span>
                          <span className="font-mono text-amber-300">{item.rarity}</span>
                        </div>
                        <div>
                          <TitleInsignia titleId={item.id} size="md" />
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-base font-bold text-slate-900">{item.name}</h3>
                        <span className="font-mono text-xs font-bold text-amber-600 tabular-nums">
                          {effectivePrice === 0 ? 'Gratis Bawaan' : `${effectivePrice} Koin`}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-slate-500">
                      {isEquipped
                        ? 'Sedang Dipakai'
                        : isOwned
                        ? 'Sudah Dimiliki'
                        : 'Tersedia di Toko 8B'}
                    </span>

                    <motion.button
                      type="button"
                      whileHover={!isEquipped ? { scale: 1.03 } : undefined}
                      whileTap={!isEquipped ? { scale: 0.97 } : undefined}
                      disabled={isEquipped}
                      onClick={() => handleBuyOrEquip(item.id, item.type)}
                      className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isEquipped
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                          : isOwned
                          ? 'bg-slate-900 text-white hover:bg-slate-800'
                          : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                      }`}
                    >
                      {isEquipped
                        ? 'Terpasang Aktif'
                        : isOwned
                        ? 'Pasang Sekarang'
                        : `Beli (${effectivePrice} Koin)`}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
