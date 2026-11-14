'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  KeyRound,
  X,
  Lock,
  Eye,
  EyeOff,
  ShieldAlert,
  Fingerprint,
  UserCheck,
  Award,
} from 'lucide-react';
import {
  ClassRole,
  ROLE_METADATA,
  validateClassLogin,
  requiresRolePin,
} from '@/lib/class8b-logic';

interface LoginVerificationModalProps {
  isOpen: boolean;
  initialRole?: ClassRole;
  customCodes: string[];
  onClose: () => void;
  onSuccessLogin: (session: {
    username: string;
    displayName: string;
    role: ClassRole;
    verifiedBy: string;
  }) => void;
  onGoogleSignIn?: () => Promise<{ ok: boolean; message?: string }>;
  onRegisterDynamicCode?: (newCode: string) => void;
}

type ClearanceTier = 'siswa' | 'pengurus' | 'otoritas';

const TIER_ROLES: Record<ClearanceTier, ClassRole[]> = {
  siswa: ['siswa'],
  pengurus: [
    'ketua_kelas',
    'wakil_ketua',
    'bendahara_1',
    'bendahara_2',
    'sekretaris_1',
    'sekretaris_2',
  ],
  otoritas: ['owner', 'teacher'],
};

function getTierForRole(role: ClassRole): ClearanceTier {
  if (role === 'owner' || role === 'teacher') return 'otoritas';
  if (role === 'siswa') return 'siswa';
  return 'pengurus';
}

export function LoginVerificationModal({
  isOpen,
  initialRole = 'siswa',
  customCodes,
  onClose,
  onSuccessLogin,
  onGoogleSignIn,
}: LoginVerificationModalProps) {
  const [clearanceTier, setClearanceTier] = useState<ClearanceTier>(() =>
    getTierForRole(initialRole)
  );
  const [selectedRole, setSelectedRole] = useState<ClassRole>(initialRole);

  // Strictly empty inputs — ZERO pre-filled credentials, ZERO 1-click auto-fill
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [rolePin, setRolePin] = useState('');

  // Visibility toggles for masked inputs
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpCode, setShowOtpCode] = useState(false);
  const [showPin, setShowPin] = useState(false);

  // Anti-Brute-Force State (SEC-04)
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = window.setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          setFailedAttempts(0);
          setErrorMsg('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [lockoutSeconds]);

  if (!isOpen) return null;

  const handleSelectTier = (tier: ClearanceTier) => {
    setClearanceTier(tier);
    const defaultRoleForTier = TIER_ROLES[tier][0];
    setSelectedRole(defaultRoleForTier);
    // Reset all sensitive fields when switching clearance tiers so nothing carries over
    setPassword('');
    setVerificationCode('');
    setRolePin('');
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    setErrorMsg('');

    if (!displayName.trim() || displayName.trim().length < 2) {
      setErrorMsg('Nama Lengkap / Panggilan wajib diketik manual (minimal 2 karakter).');
      return;
    }

    const result = validateClassLogin({
      username,
      password,
      verificationCode,
      role: selectedRole,
      rolePin,
      customCodes,
    });

    if (!result.valid) {
      const nextFailures = failedAttempts + 1;
      setFailedAttempts(nextFailures);
      if (nextFailures >= 5) {
        setLockoutSeconds(30);
        setErrorMsg(
          'Proteksi Anti-Brute Force (SEC-04) Aktif! Terlalu banyak percobaan gagal. Gerbang login dikunci selama 30 detik.'
        );
      } else {
        setErrorMsg(
          result.error || 'Kredensial atau Kode Verifikasi tidak sesuai dengan jabatan.'
        );
      }
      return;
    }

    setFailedAttempts(0);
    onSuccessLogin({
      username: username.trim().toLowerCase(),
      displayName: displayName.trim(),
      role: selectedRole,
      verifiedBy: result.issuer || 'Sistem Keamanan Berlapis 8B',
    });
  };

  const needsPin = requiresRolePin(selectedRole);
  const isPowerRole = selectedRole === 'owner' || selectedRole === 'teacher';

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 sm:p-5 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        <motion.div
          initial={{ scale: 0.95, y: 14, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          className="w-full max-w-4xl rounded-3xl border border-slate-800 bg-white shadow-2xl max-h-[93vh] overflow-y-auto overflow-x-hidden grid grid-cols-1 lg:grid-cols-12"
        >
          {/* LEFT PANEL ON DESKTOP / BOTTOM ON MOBILE: ARCHITECTURAL OBSIDIAN SECURITY SHIELD (5 COLS) */}
          <div className="order-2 lg:order-1 lg:col-span-5 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 p-5 sm:p-7 text-white flex flex-col justify-between space-y-5 border-t lg:border-t-0 lg:border-r border-slate-800">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-[11px] font-mono font-bold text-amber-300">
                <Fingerprint className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>STRICT MANUAL AUTH · NO AUTO-FILL</span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-white leading-snug">
                  Protokol Keamanan Berlapis Kelas 8B
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Seluruh akses instan 1-klik telah dihapus permanen. Setiap pengguna wajib
                  mengetik manual <strong className="text-white">Username</strong>,{' '}
                  <strong className="text-white">Kata Sandi</strong>,{' '}
                  <strong className="text-amber-300">Kode OTP/Mandat</strong>, dan{' '}
                  <strong className="text-amber-300">PIN Jabatan</strong>.
                </p>
              </div>

              {/* 3-Tier Security Clearance Architecture Breakdown */}
              <div className="space-y-2 pt-1">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 space-y-1">
                  <div className="flex items-center justify-between gap-2 text-xs font-bold text-emerald-300">
                    <span className="whitespace-nowrap">Tingkat 1 · Siswa 8B</span>
                    <span className="font-mono text-[11px] whitespace-nowrap shrink-0">
                      Sandi + OTP Siswa
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Wajib mengetik Sandi Kelas 8B &amp; Kode OTP Siswa resmi dari Bu Aida. Tidak
                    dapat membuka akses pengurus atau guru.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 space-y-1">
                  <div className="flex items-center justify-between gap-2 text-xs font-bold text-sky-300">
                    <span className="whitespace-nowrap">Tingkat 2 · Pengurus Inti</span>
                    <span className="font-mono text-[11px] whitespace-nowrap shrink-0">
                      Mandat + PIN 4-Digit
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Ketua, Wakil, Sekretaris 1–2, dan Bendahara 1–2 wajib mengetik Kode Mandat
                    spesifik per jabatan serta PIN Pengurus 4-Digit.
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-3 space-y-1">
                  <div className="flex items-center justify-between gap-2 text-xs font-bold text-amber-300">
                    <span className="whitespace-nowrap">Tingkat 3 · Owner &amp; Bu Aida</span>
                    <span className="font-mono text-[11px] whitespace-nowrap shrink-0">
                      Root + PIN 6-Digit
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-200 leading-relaxed">
                    Akses 45 Fitur Komando dikunci ketat dengan Sandi Master, Kode Otoritas Root,
                    dan PIN Keamanan 6-Digit.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Security Telemetry */}
            <div className="space-y-2 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-slate-400 whitespace-nowrap">Proteksi Anti-Brute Force:</span>
                <span
                  className={`font-mono font-bold tabular-nums whitespace-nowrap shrink-0 ${
                    failedAttempts > 0 ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {lockoutSeconds > 0
                    ? `TERKUNCI (${lockoutSeconds}d)`
                    : `Gagal: ${failedAttempts} / 5`}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 leading-relaxed">
                5 kali kesalahan input berturut-turut akan mengunci formulir secara otomatis selama
                30 detik.
              </div>
            </div>
          </div>

          {/* RIGHT PANEL ON DESKTOP / TOP ON MOBILE: STRICT MULTI-FACTOR LOGIN FORM (7 COLS) */}
          <div className="order-1 lg:order-2 lg:col-span-7 p-5 sm:p-8 flex flex-col justify-between space-y-4 bg-white">
            <div className="space-y-4">
              {/* Modal Header Row with Title & Close Button */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-mono font-bold text-indigo-700">
                    VERIFIKASI MANUAL · TANPA AUTO-FILL
                  </div>
                  <h2
                    id="login-modal-title"
                    className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900"
                  >
                    Masuk Portal Kelas 8B SMPN 18
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Tutup dialog login"
                  className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Clearance Tier Tabs */}
              <div
                role="tablist"
                aria-label="Pilih Tingkat Otoritas Login"
                className="grid grid-cols-3 gap-1 rounded-2xl bg-slate-100 p-1"
              >
                {(
                  [
                    { id: 'siswa', label: 'Siswa 8B', icon: UserCheck },
                    { id: 'pengurus', label: 'Pengurus', icon: Award },
                    { id: 'otoritas', label: 'Owner / Guru', icon: ShieldCheck },
                  ] as const
                ).map((tab) => {
                  const Icon = tab.icon;
                  const active = clearanceTier === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => handleSelectTier(tab.id)}
                      className={`relative inline-flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        active ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="clearanceTabPill"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          className="absolute inset-0 rounded-xl bg-slate-900 shadow-xs"
                        />
                      )}
                      <Icon className="relative z-10 h-3.5 w-3.5 shrink-0" />
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Clearance Notice Banner */}
              <div
                className={`rounded-2xl border px-4 py-3 text-xs flex items-start gap-2.5 ${
                  clearanceTier === 'otoritas'
                    ? 'border-amber-300 bg-amber-50/80 text-amber-950'
                    : clearanceTier === 'pengurus'
                    ? 'border-indigo-200 bg-indigo-50/70 text-indigo-950'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                <Lock className="h-4 w-4 shrink-0 mt-0.5 text-slate-800" />
                <div className="leading-relaxed">
                  {clearanceTier === 'otoritas' ? (
                    <>
                      <strong>Mode Otoritas Tertinggi (Owner &amp; Wali Kelas Bu Aida):</strong>{' '}
                      Ketik manual Username Terdaftar, Kata Sandi Master, Kode Otoritas Khusus, dan{' '}
                      <span className="font-mono font-bold">PIN 6-Digit</span>.
                    </>
                  ) : clearanceTier === 'pengurus' ? (
                    <>
                      <strong>Mode Pengurus Inti Kelas 8B:</strong> Pilih jabatan spesifik Anda.
                      Wajib mengetik Kode Mandat sesuai SK Jabatan dan{' '}
                      <span className="font-mono font-bold">PIN Pengurus 4-Digit</span>.
                    </>
                  ) : (
                    <>
                      <strong>Mode Anggota Siswa Kelas 8B:</strong> Ketik manual nama lengkapmu,
                      Kata Sandi Kelas 8B, dan Kode Verifikasi OTP resmi dari Ibu Aida.
                    </>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
                {/* Role Selection Dropdown (Filtered strictly by selected clearance tier) */}
                <div>
                  <label
                    htmlFor="login-role"
                    className="block text-xs font-bold text-slate-800 mb-1.5"
                  >
                    Jabatan / Peran yang Diverifikasi
                  </label>
                  <select
                    id="login-role"
                    data-testid="login-role-select"
                    value={selectedRole}
                    onChange={(e) => {
                      setSelectedRole(e.target.value as ClassRole);
                      setPassword('');
                      setVerificationCode('');
                      setRolePin('');
                      setErrorMsg('');
                    }}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-slate-900 focus:outline-none transition-colors"
                  >
                    {TIER_ROLES[clearanceTier].map((roleKey) => (
                      <option key={roleKey} value={roleKey}>
                        {ROLE_METADATA[roleKey].label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Username & Full Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      htmlFor="login-username"
                      className="block text-xs font-bold text-slate-800 mb-1 whitespace-nowrap"
                    >
                      {isPowerRole ? 'Username Akun Terdaftar' : 'Username Akun Kelas 8B'}
                    </label>
                    <input
                      id="login-username"
                      data-testid="login-username-input"
                      name="strict_user_8b"
                      type="text"
                      required
                      autoComplete="off"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setErrorMsg('');
                      }}
                      placeholder={
                        selectedRole === 'owner'
                          ? 'Ketik username Owner...'
                          : selectedRole === 'teacher'
                          ? 'Ketik username Bu Aida...'
                          : 'Contoh: naufal8b'
                      }
                      maxLength={50}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="login-displayname"
                      className="block text-xs font-bold text-slate-800 mb-1 whitespace-nowrap"
                    >
                      Nama Lengkap / Identitas 8B
                    </label>
                    <input
                      id="login-displayname"
                      data-testid="login-displayname-input"
                      name="strict_display_8b"
                      type="text"
                      required
                      autoComplete="off"
                      value={displayName}
                      onChange={(e) => {
                        setDisplayName(e.target.value);
                        setErrorMsg('');
                      }}
                      placeholder="Ketik nama asli Anda..."
                      maxLength={80}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Password & Security PIN (if Officer/Owner/Teacher) */}
                <div
                  className={`grid grid-cols-1 ${
                    needsPin ? 'sm:grid-cols-2' : ''
                  } gap-3.5`}
                >
                  <div>
                    <label
                      htmlFor="login-password"
                      className="block text-xs font-bold text-slate-800 mb-1 whitespace-nowrap"
                    >
                      {isPowerRole
                        ? 'Kata Sandi Master Otoritas'
                        : needsPin
                        ? 'Kata Sandi Pengurus 8B'
                        : 'Kata Sandi Kelas 8B'}
                    </label>
                    <div className="relative">
                      <input
                        id="login-password"
                        data-testid="login-password-input"
                        name="strict_pass_8b"
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setErrorMsg('');
                        }}
                        placeholder="Ketik kata sandi..."
                        className="w-full rounded-xl border border-slate-300 pl-3.5 pr-10 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {needsPin && (
                    <div>
                      <label
                        htmlFor="login-role-pin"
                        className="block text-xs font-bold text-slate-800 mb-1 whitespace-nowrap"
                      >
                        {isPowerRole
                          ? 'PIN Otoritas (6 Digit)'
                          : 'PIN Pengurus (4 Digit)'}
                      </label>
                      <div className="relative">
                        <input
                          id="login-role-pin"
                          data-testid="login-pin-input"
                          name="strict_pin_8b"
                          type={showPin ? 'text' : 'password'}
                          inputMode="numeric"
                          required
                          autoComplete="new-password"
                          maxLength={isPowerRole ? 6 : 4}
                          value={rolePin}
                          onChange={(e) => {
                            setRolePin(e.target.value.replace(/\D/g, ''));
                            setErrorMsg('');
                          }}
                          placeholder={isPowerRole ? '•••••• (6 Digit)' : '•••• (4 Digit)'}
                          className="w-full rounded-xl border border-slate-300 pl-3.5 pr-10 py-2.5 text-sm font-mono font-bold tracking-widest text-slate-900 focus:border-slate-900 focus:outline-none transition-colors tabular-nums"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPin((prev) => !prev)}
                          aria-label={showPin ? 'Sembunyikan PIN' : 'Lihat PIN'}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          {showPin ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Strict Masked OTP / Mandate Verification Code Box (Zero Public Code Leaks) */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="login-verification-code"
                      className="flex items-center gap-2 text-xs font-bold text-slate-900 whitespace-nowrap"
                    >
                      <KeyRound className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>
                        {isPowerRole
                          ? 'Kode Otoritas Khusus (Root / Guru)'
                          : needsPin
                          ? `Kode Mandat (${ROLE_METADATA[selectedRole].shortLabel})`
                          : 'Kode Verifikasi OTP Siswa'}
                      </span>
                    </label>
                    <span className="text-[11px] font-mono text-slate-500 whitespace-nowrap shrink-0">
                      Terenkripsi · Wajib
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      id="login-verification-code"
                      data-testid="login-otp-input"
                      name="strict_otp_8b"
                      type={showOtpCode ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={verificationCode}
                      onChange={(e) => {
                        setVerificationCode(e.target.value.toUpperCase());
                        setErrorMsg('');
                      }}
                      placeholder="Ketik kode verifikasi rahasia..."
                      className="w-full rounded-xl border border-slate-300 bg-white pl-3.5 pr-10 py-2.5 text-sm font-mono font-bold text-slate-900 tracking-wider focus:border-slate-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOtpCode((prev) => !prev)}
                      aria-label={
                        showOtpCode ? 'Sembunyikan kode verifikasi' : 'Lihat kode verifikasi'
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showOtpCode ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Demi keamanan Kelas 8B SMPN 18 Kota Bogor, kode OTP tidak pernah ditampilkan
                    atau diisi otomatis di layar publik.
                  </p>
                </div>

                {errorMsg && (
                  <motion.div
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    role="alert"
                    className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-xs font-semibold text-red-800 flex items-start gap-2.5"
                  >
                    <ShieldAlert className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  <motion.button
                    type="submit"
                    data-testid="submit-login-btn"
                    disabled={lockoutSeconds > 0}
                    whileHover={lockoutSeconds > 0 ? undefined : { scale: 1.01 }}
                    whileTap={lockoutSeconds > 0 ? undefined : { scale: 0.98 }}
                    className={`w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-white transition-colors shadow-sm whitespace-nowrap shrink-0 ${
                      lockoutSeconds > 0
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-slate-900 hover:bg-slate-800 cursor-pointer'
                    }`}
                  >
                    <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>
                      {lockoutSeconds > 0
                        ? `Terkunci Sementara (${lockoutSeconds} Detik)`
                        : `Verifikasi & Masuk (${ROLE_METADATA[selectedRole].shortLabel})`}
                    </span>
                  </motion.button>

                  {onGoogleSignIn && (
                    <button
                      type="button"
                      disabled={lockoutSeconds > 0}
                      onClick={async () => {
                        setErrorMsg('');
                        const res = await onGoogleSignIn();
                        if (!res.ok && res.message) {
                          setErrorMsg(res.message);
                        }
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Lock className="h-3.5 w-3.5 shrink-0" />
                      <span>Google Auth</span>
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
