'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  Play,
  Plus,
  KeyRound,
  Sparkles,
  Users,
  Copy,
} from 'lucide-react';
import {
  ClassRole,
  ROLE_METADATA,
  OWNER_TEACHER_45_FEATURES,
  canAccessOwnerTeacherPanel,
} from '@/lib/class8b-logic';
import { StructureFlowCollection } from '@designcodeio/threeui';
import '@designcodeio/threeui/style.css';

interface OwnerTeacher45PanelProps {
  currentUserRole: ClassRole;
  currentUserName: string;
  featureStates: Record<number, boolean>;
  onToggleFeature: (featureId: number) => void;
  onExecuteFeature: (featureId: number) => void;
  customCodes: string[];
  officerNames: Record<string, string>;
  onUpdateOfficerName: (roleKey: string, newName: string) => void;
  onPublishWebsiteUpdate: (version: string, title: string, notes: string) => void;
  onSwitchToOwnerOrTeacherDemo: (role: 'owner' | 'teacher') => void;
  lastActionStatus: string;
}

export function OwnerTeacher45Panel({
  currentUserRole,
  currentUserName,
  featureStates,
  onToggleFeature,
  onExecuteFeature,
  customCodes,
  officerNames,
  onUpdateOfficerName,
  onPublishWebsiteUpdate,
  onSwitchToOwnerOrTeacherDemo,
  lastActionStatus,
}: OwnerTeacher45PanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua (45 Fitur)');
  const [updateVersion, setUpdateVersion] = useState('v2.5.0');
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateNotes, setUpdateNotes] = useState('');
  const [selectedRoleToEdit, setSelectedRoleToEdit] = useState<string>('ketua_kelas');
  const [newOfficerNameInput, setNewOfficerNameInput] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const hasAccess = canAccessOwnerTeacherPanel(currentUserRole);

  if (!hasAccess) {
    return (
      <motion.div
        initial={{ scale: 0.96, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        className="my-12 max-w-2xl mx-auto rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 text-center space-y-5 shadow-lg"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <div className="text-xs font-mono text-indigo-600 font-semibold">
            Area Terproteksi · Otoritas Setara Owner &amp; Wali Kelas 8B
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Panel Komando 45 Fitur Khusus Owner &amp; Ibu Aida
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Saat ini kamu masuk sebagai{' '}
            <span className="font-semibold text-slate-900">
              {ROLE_METADATA[currentUserRole].label}
            </span>
            . Sesuai aturan sistem Kelas 8B SMPN 18 Kota Bogor, hanya akun{' '}
            <strong>Owner Web</strong> dan <strong>Ibu Aida (Wali Kelas 8B)</strong> yang dapat
            menggunakan 45 fitur penuh di panel ini.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSwitchToOwnerOrTeacherDemo('owner')}
            className="rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Verifikasi Login Owner Web (Wajib Sandi + OTP + PIN)
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSwitchToOwnerOrTeacherDemo('teacher')}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Verifikasi Login Bu Aida (Wajib Sandi + OTP + PIN)
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const categories = [
    'Semua (45 Fitur)',
    'Keamanan & Verifikasi Login',
    'Akademik & Tugas Kelas 8B',
    'Presensi & Pengurus Kelas',
    'Komunikasi & Live Chat 24/7',
    'Ekonomi Koin, Toko & Sistem Update',
  ];

  const filteredFeatures = OWNER_TEACHER_45_FEATURES.filter((feat) => {
    const matchesCat =
      selectedCategory === 'Semua (45 Fitur)' || feat.category === selectedCategory;
    const matchesQuery =
      feat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feat.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handlePublishUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateTitle.trim() || !updateNotes.trim()) return;
    onPublishWebsiteUpdate(
      updateVersion.trim() || 'v2.5',
      updateTitle.trim(),
      updateNotes.trim()
    );
    setUpdateTitle('');
    setUpdateNotes('');
  };

  const handleSaveOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfficerNameInput.trim()) return;
    onUpdateOfficerName(selectedRoleToEdit, newOfficerNameInput.trim());
    setNewOfficerNameInput('');
  };

  const handleCopyCode = (code: string) => {
    setCopiedCode(code);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
  };

  const allCodes = Array.from(
    new Set([
      'OWNER-MASTER-8B',
      'GURU-BUAIDA-8B',
      'KETUA-8B-18',
      'WAKIL-8B-18',
      'BENDAHARA-8B-18',
      'SEKRETARIS-8B-18',
      'BUAIDA-8B-2026',
      ...customCodes,
    ])
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Header Panel Komando Setara Owner & Bu Aida dengan ThreeUI Fluid Field Shader */}
      <motion.div
        initial={{ y: 10 }}
        animate={{ y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#050508] text-white p-6 sm:p-8 space-y-4 shadow-xl"
      >
        <div className="shader-frame absolute inset-0 pointer-events-none opacity-90">
          <StructureFlowCollection
            variant="fluid-field"
            hue={0}
            saturation={1.00}
            brightness={1.00}
          />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-amber-300 font-semibold">
              OTORITAS PENUH SETARA (100% POWER PARITY) · OWNER PANEL &amp; TEACHER PANEL (BU AIDA)
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Pusat Komando 45 Fitur — {ROLE_METADATA[currentUserRole].label}
            </h1>
            <p className="text-xs text-slate-300">
              Operator Aktif: {currentUserName} · Seluruh 45 modul di bawah ini terhubung langsung
              dengan sistem Kelas 8B SMPN 18 Kota Bogor.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-950/75 border border-white/15 px-5 py-3.5 text-right shrink-0 backdrop-blur-md">
            <div className="text-xs text-slate-300">Total Fitur Terpasang</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-amber-400">
              45 / 45 Aktif
            </div>
          </div>
        </div>

        {lastActionStatus && (
          <motion.div
            key={lastActionStatus}
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            role="status"
            className="relative z-10 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 px-4 py-3 text-xs font-semibold text-emerald-200 flex items-center justify-between"
          >
            <span>Status Eksekusi: {lastActionStatus}</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          </motion.div>
        )}
      </motion.div>

      {/* 3 Modul Cepat: Kode Verifikasi Aktif, Rilis Update Website Kapan Saja, & Edit Nama Pengurus */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Brankas Kode Verifikasi Per-Jabatan (Hanya Terlihat oleh Owner & Bu Aida) */}
        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-3xl border border-slate-200 bg-white p-6 space-y-3 flex flex-col justify-between shadow-2xs"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-amber-600" />
                <span>Brankas Kode Mandat &amp; OTP</span>
              </h2>
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onExecuteFeature(1)}
                className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
              >
                + Terbitkan OTP Siswa
              </motion.button>
            </div>
            <p className="text-xs text-slate-600">
              Kode ini disembunyikan dari publik. Klik untuk menyalin dan berikan sesuai jabatan:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {allCodes.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleCopyCode(code)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-xs font-bold transition-colors cursor-pointer ${
                    copiedCode === code
                      ? 'bg-emerald-900 text-emerald-200'
                      : 'bg-amber-100/80 text-amber-950 hover:bg-amber-200'
                  }`}
                >
                  <span>{code}</span>
                  <Copy className="h-3 w-3 opacity-70" />
                </button>
              ))}
            </div>
          </div>
          <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
            {copiedCode
              ? `Kode ${copiedCode} berhasil disalin ke papan klip!`
              : 'PIN Owner/Bu Aida: 180826 · PIN Pengurus: 8818'}
          </div>
        </motion.div>

        {/* 2. Rilis Update Website Kapan Saja */}
        <motion.form
          whileHover={{ y: -2 }}
          onSubmit={handlePublishUpdate}
          className="rounded-3xl border border-slate-200 bg-white p-6 space-y-3 shadow-2xs"
        >
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span>Tambah Update Website Kapan Saja</span>
          </h2>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              aria-label="Versi Update"
              value={updateVersion}
              onChange={(e) => setUpdateVersion(e.target.value)}
              placeholder="v2.5.0"
              className="rounded-xl border border-slate-300 px-2.5 py-2 text-xs font-mono text-slate-900"
            />
            <input
              type="text"
              aria-label="Judul Update"
              value={updateTitle}
              onChange={(e) => setUpdateTitle(e.target.value)}
              placeholder="Judul Fitur / Update..."
              className="col-span-2 rounded-xl border border-slate-300 px-2.5 py-2 text-xs text-slate-900"
            />
          </div>
          <input
            type="text"
            aria-label="Catatan Update"
            value={updateNotes}
            onChange={(e) => setUpdateNotes(e.target.value)}
            placeholder="Deskripsi singkat pembaruan untuk Kelas 8B..."
            className="w-full rounded-xl border border-slate-300 px-2.5 py-2 text-xs text-slate-900"
          />
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Publikasikan Update ke Seluruh Kelas</span>
          </button>
        </motion.form>

        {/* 3. Edit Dinamis Nama Pejabat Struktur Kelas 8B */}
        <motion.form
          whileHover={{ y: -2 }}
          onSubmit={handleSaveOfficer}
          className="rounded-3xl border border-slate-200 bg-white p-6 space-y-3 shadow-2xs"
        >
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-700" />
            <span>Atur Nama Pengurus Kelas 8B</span>
          </h2>
          <select
            aria-label="Pilih Jabatan Kelas 8B"
            value={selectedRoleToEdit}
            onChange={(e) => setSelectedRoleToEdit(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-900"
          >
            <option value="ketua_kelas">Ketua Kelas ({officerNames.ketua_kelas})</option>
            <option value="wakil_ketua">Wakil Ketua ({officerNames.wakil_ketua})</option>
            <option value="bendahara_1">Bendahara 1 ({officerNames.bendahara_1})</option>
            <option value="bendahara_2">Bendahara 2 ({officerNames.bendahara_2})</option>
            <option value="sekretaris_1">Sekretaris 1 ({officerNames.sekretaris_1})</option>
            <option value="sekretaris_2">Sekretaris 2 ({officerNames.sekretaris_2})</option>
          </select>
          <input
            type="text"
            aria-label="Nama Siswa Pemegang Jabatan"
            value={newOfficerNameInput}
            onChange={(e) => setNewOfficerNameInput(e.target.value)}
            placeholder="Ketik nama teman sekelas..."
            className="w-full rounded-xl border border-slate-300 px-2.5 py-2 text-xs text-slate-900"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
          >
            Simpan Nama Pengurus
          </button>
        </motion.form>
      </div>

      {/* Filter & Pencarian 45 Fitur */}
      <div className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              aria-label="Cari dari 45 fitur panel kontrol"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor kode atau nama fitur..."
              className="w-full rounded-2xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Grid 45 Fitur dengan Animasi & Saklar Modern */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFeatures.map((feat) => {
            const isEnabled = Boolean(featureStates[feat.id]);
            return (
              <motion.div
                key={feat.id}
                whileHover={{ y: -3 }}
                className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition-all shadow-2xs ${
                  feat.actionType === 'toggle' && isEnabled
                    ? 'border-slate-300 bg-white'
                    : 'border-slate-200/90 bg-white'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono font-bold text-indigo-700">
                      #{String(feat.id).padStart(2, '0')} · {feat.code}
                    </span>
                    <span className="truncate max-w-[180px]">{feat.category}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{feat.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{feat.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {feat.actionType === 'toggle' ? (
                    <>
                      <span
                        className={`text-xs font-bold ${
                          isEnabled ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      >
                        {isEnabled ? 'Status: Aktif' : 'Status: Nonaktif'}
                      </span>
                      <button
                        type="button"
                        onClick={() => onToggleFeature(feat.id)}
                        className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                          isEnabled
                            ? 'bg-slate-900 text-white hover:bg-slate-800'
                            : 'border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            isEnabled ? 'bg-emerald-400' : 'bg-slate-400'
                          }`}
                        />
                        <span>{isEnabled ? 'Matikan' : 'Aktifkan'}</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-slate-500">Eksekusi Instan</span>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onExecuteFeature(feat.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-300 transition-colors cursor-pointer"
                      >
                        <Play className="h-3 w-3 fill-slate-950" />
                        <span>{feat.actionLabel}</span>
                      </motion.button>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
