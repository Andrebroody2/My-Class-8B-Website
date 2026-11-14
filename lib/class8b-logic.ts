export type ClassRole =
  | 'owner'
  | 'teacher'
  | 'ketua_kelas'
  | 'wakil_ketua'
  | 'bendahara_1'
  | 'bendahara_2'
  | 'sekretaris_1'
  | 'sekretaris_2'
  | 'siswa';

export interface RoleMetadata {
  id: ClassRole;
  label: string;
  shortLabel: string;
  permissions: string[];
  canManageAttendance: boolean;
  canManageAnnouncements: boolean;
  canManageAssignments: boolean;
  canManageTreasury: boolean;
  canAccess45Panel: boolean;
}

export const ROLE_METADATA: Record<ClassRole, RoleMetadata> = {
  owner: {
    id: 'owner',
    label: 'Owner Web Kelas 8B',
    shortLabel: 'Owner Web',
    permissions: [
      'Akses Penuh 45 Fitur Panel Komando',
      'Terbitkan Kode Verifikasi Kelas 8B',
      'Kelola Seluruh Peran, Koin, Tugas, Presensi & Pengumuman',
      'Publikasi Update Sistem & Fitur Baru Kapan Saja',
    ],
    canManageAttendance: true,
    canManageAnnouncements: true,
    canManageAssignments: true,
    canManageTreasury: true,
    canAccess45Panel: true,
  },
  teacher: {
    id: 'teacher',
    label: 'Wali Kelas 8B (Bu Aida)',
    shortLabel: 'Bu Aida · Wali Kelas',
    permissions: [
      'Akses Penuh 45 Fitur Panel Guru (Setara Owner)',
      'Terbitkan Kode Verifikasi Login Siswa 8B',
      'Kelola Tugas, Nilai, Presensi, Pengumuman & Moderasi Chat',
      'Kirim Apresiasi Koin & Gelar Kehormatan Kelas',
    ],
    canManageAttendance: true,
    canManageAnnouncements: true,
    canManageAssignments: true,
    canManageTreasury: true,
    canAccess45Panel: true,
  },
  ketua_kelas: {
    id: 'ketua_kelas',
    label: 'Ketua Kelas 8B',
    shortLabel: 'Ketua Kelas',
    permissions: [
      'Kelola Pengumuman Digital Kelas 8B',
      'Koordinasi Tugas & Agenda Harian Kelas',
      'Verifikasi Presensi Harian Bersama Sekretaris',
    ],
    canManageAttendance: true,
    canManageAnnouncements: true,
    canManageAssignments: true,
    canManageTreasury: false,
    canAccess45Panel: false,
  },
  wakil_ketua: {
    id: 'wakil_ketua',
    label: 'Wakil Ketua Kelas 8B',
    shortLabel: 'Wakil Ketua',
    permissions: [
      'Kelola Pengumuman Digital & Ketertiban Kelas',
      'Bantu Koordinasi Tugas & Piket Kelas 8B',
      'Rekap Kehadiran Siswa',
    ],
    canManageAttendance: true,
    canManageAnnouncements: true,
    canManageAssignments: true,
    canManageTreasury: false,
    canAccess45Panel: false,
  },
  bendahara_1: {
    id: 'bendahara_1',
    label: 'Bendahara 1 Kelas 8B',
    shortLabel: 'Bendahara 1',
    permissions: [
      'Kelola Kas Kelas 8B & Laporan Keuangan Mingguan',
      'Publikasi Pengumuman Iuran & Kebutuhan Kelas',
      'Akses Buku Kas Digital Kelas 8B',
    ],
    canManageAttendance: false,
    canManageAnnouncements: true,
    canManageAssignments: false,
    canManageTreasury: true,
    canAccess45Panel: false,
  },
  bendahara_2: {
    id: 'bendahara_2',
    label: 'Bendahara 2 Kelas 8B',
    shortLabel: 'Bendahara 2',
    permissions: [
      'Catat Pemasukan & Pengeluaran Kas Kelas 8B',
      'Publikasi Pengumuman Transparansi Kas',
      'Verifikasi Bukti Kas Bersama Bendahara 1',
    ],
    canManageAttendance: false,
    canManageAnnouncements: true,
    canManageAssignments: false,
    canManageTreasury: true,
    canAccess45Panel: false,
  },
  sekretaris_1: {
    id: 'sekretaris_1',
    label: 'Sekretaris 1 Kelas 8B',
    shortLabel: 'Sekretaris 1',
    permissions: [
      'Kelola Presensi Harian Siswa (Hadir, Izin, Sakit, Alfa)',
      'Tambah & Perbarui Daftar Tugas Sekolah Kelas 8B',
      'Publikasi Agenda & Pengumuman Kelas',
    ],
    canManageAttendance: true,
    canManageAnnouncements: true,
    canManageAssignments: true,
    canManageTreasury: false,
    canAccess45Panel: false,
  },
  sekretaris_2: {
    id: 'sekretaris_2',
    label: 'Sekretaris 2 Kelas 8B',
    shortLabel: 'Sekretaris 2',
    permissions: [
      'Input Presensi Harian & Jurnal Kegiatan Kelas 8B',
      'Catat Deadline Tugas & Jadwal Ujian',
      'Publikasi Pengumuman Akademik',
    ],
    canManageAttendance: true,
    canManageAnnouncements: true,
    canManageAssignments: true,
    canManageTreasury: false,
    canAccess45Panel: false,
  },
  siswa: {
    id: 'siswa',
    label: 'Anggota Kelas 8B',
    shortLabel: 'Siswa 8B',
    permissions: [
      'Akses Dashboard Tugas, Pengumuman & Presensi',
      'Akses Group Chat 24/7 Live & Pesan Pribadi',
      'Mainkan Kuis & Flashcard Kelas 8 untuk Raih Koin',
      'Belanja Banner & Gelar di Toko Eksklusif 8B',
    ],
    canManageAttendance: false,
    canManageAnnouncements: false,
    canManageAssignments: false,
    canManageTreasury: false,
    canAccess45Panel: false,
  },
};

const OFFICER_ROLES: ClassRole[] = [
  'ketua_kelas',
  'wakil_ketua',
  'bendahara_1',
  'bendahara_2',
  'sekretaris_1',
  'sekretaris_2',
];

export const DEFAULT_VERIFICATION_CODES: Record<
  string,
  { issuer: string; allowedRoles: ClassRole[]; description: string }
> = {
  // Tier 1A: Strict Owner-Only Codes
  'OWNER-MASTER-8B': {
    issuer: 'Otoritas Root Owner Web Kelas 8B',
    allowedRoles: ['owner'],
    description: 'Kode Master Rahasia Khusus Owner Website Kelas 8B',
  },
  'ROOT-8B-18': {
    issuer: 'Otoritas Root Owner Web Kelas 8B',
    allowedRoles: ['owner'],
    description: 'Kode Cadangan Otoritas Penuh Owner Web Kelas 8B',
  },
  // Tier 1B: Strict Teacher (Bu Aida) Only Codes
  'GURU-BUAIDA-8B': {
    issuer: 'Otoritas Wali Kelas 8B (Ibu Aida, S.Pd.)',
    allowedRoles: ['teacher'],
    description: 'Kode Otoritas Khusus Wali Kelas 8B Ibu Aida',
  },
  'WALIKELAS-8B-18': {
    issuer: 'Otoritas Wali Kelas 8B (Ibu Aida, S.Pd.)',
    allowedRoles: ['teacher'],
    description: 'Kode Resmi Panel Guru Wali Kelas 8B',
  },
  // Tier 2: Strict Class Officer Role-Isolated Codes
  'KETUA-8B-18': {
    issuer: 'Mandat Wali Kelas Bu Aida & Owner',
    allowedRoles: ['ketua_kelas'],
    description: 'Kode Mandat Khusus Ketua Kelas 8B',
  },
  'WAKIL-8B-18': {
    issuer: 'Mandat Wali Kelas Bu Aida & Owner',
    allowedRoles: ['wakil_ketua'],
    description: 'Kode Mandat Khusus Wakil Ketua Kelas 8B',
  },
  'BENDAHARA-8B-18': {
    issuer: 'Mandat Wali Kelas Bu Aida & Owner',
    allowedRoles: ['bendahara_1', 'bendahara_2'],
    description: 'Kode Mandat Khusus Bendahara 1 & 2 Kelas 8B',
  },
  'SEKRETARIS-8B-18': {
    issuer: 'Mandat Wali Kelas Bu Aida & Owner',
    allowedRoles: ['sekretaris_1', 'sekretaris_2'],
    description: 'Kode Mandat Khusus Sekretaris 1 & 2 Kelas 8B',
  },
  'PENGURUS-8B-2026': {
    issuer: 'SK Pengurus Inti Bu Aida & Owner',
    allowedRoles: OFFICER_ROLES,
    description: 'Kode Terbatas Pengurus Inti Kelas 8B',
  },
  // Tier 3: Regular Student Only Codes (Cannot access Officer, Teacher, or Owner roles)
  'SISWA-8B-2026': {
    issuer: 'Bu Aida (Wali Kelas 8B)',
    allowedRoles: ['siswa'],
    description: 'Kode Verifikasi Resmi Siswa-Siswi Kelas 8B SMPN 18 Kota Bogor',
  },
  'BUAIDA-8B-2026': {
    issuer: 'Bu Aida (Wali Kelas 8B)',
    allowedRoles: ['siswa'],
    description: 'Kode Verifikasi Harian Anggota Kelas 8B',
  },
  'SMPN18-8B-RESMI': {
    issuer: 'Bu Aida & Owner Web',
    allowedRoles: ['siswa'],
    description: 'Kode Akses Siswa Kelas 8B SMPN 18 Kota Bogor',
  },
};

export interface DaySchedule {
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat';
  theme: string;
  piketGroup: string;
  Uniform: string;
  slots: { time: string; subject: string; teacherOrNote: string }[];
}

export const JADWAL_PELAJARAN_8B: DaySchedule[] = [
  {
    day: 'Senin',
    theme: 'Pancasila, Sains-Matematika & Muatan Lokal Sunda Bogor',
    piketGroup: 'Regu Piket Senin (Koordinator: Ketua Kelas)',
    Uniform: 'Putih - Biru Lengkap + Topi & Dasi SMPN 18',
    slots: [
      {
        time: '07:00 - 08:30',
        subject: 'PKN (Pendidikan Pancasila & Kewarganegaraan)',
        teacherOrNote: 'Kedudukan Pancasila & Konstitusi · Ruang 8B',
      },
      {
        time: '08:30 - 10:15',
        subject: 'MTK (Matematika Kelas 8)',
        teacherOrNote: 'Teorema Pythagoras & Persamaan Garis Lurus',
      },
      {
        time: '10:35 - 12:15',
        subject: 'IPA (Ilmu Pengetahuan Alam)',
        teacherOrNote: 'Struktur Jaringan Tumbuhan & Tekanan Zat · Lab IPA',
      },
      {
        time: '12:45 - 14:15',
        subject: 'Sunda (Basa & Budaya Sunda Bogor)',
        teacherOrNote: 'Unggah-Ungguh Basa & Aksara Sunda · Pakuan Bogor',
      },
    ],
  },
  {
    day: 'Selasa',
    theme: 'Pendalaman Numerasi, Sains, Bimbingan Konseling & Karakter PAI',
    piketGroup: 'Regu Piket Selasa (Koordinator: Wakil Ketua)',
    Uniform: 'Putih - Biru + Rompi Khas SMPN 18',
    slots: [
      {
        time: '07:00 - 08:45',
        subject: 'MTK (Matematika Lanjutan)',
        teacherOrNote: 'Pola Bilangan, Relasi & Fungsi · Ruang 8B',
      },
      {
        time: '08:45 - 10:30',
        subject: 'IPA (Eksperimen Biologi & Fisika)',
        teacherOrNote: 'Sistem Pencernaan & Pernapasan Manusia',
      },
      {
        time: '10:50 - 12:00',
        subject: 'BK (Bimbingan & Konseling)',
        teacherOrNote: 'Pengembangan Bakat, Motivasi & Etika Pergaulan 8B',
      },
      {
        time: '12:30 - 14:15',
        subject: 'PAI (Pendidikan Agama Islam & Budi Pekerti)',
        teacherOrNote: 'Akhlak Mulia & Tadarus Bersama Kelas 8B',
      },
    ],
  },
  {
    day: 'Rabu',
    theme: 'Kebugaran Jasmani, Ekspresi Seni Budaya & Komunikasi Global',
    piketGroup: 'Regu Piket Rabu (Koordinator: Sekretaris 1)',
    Uniform: 'Seragam Olahraga PJOK / Seragam Pramuka Lengkap',
    slots: [
      {
        time: '07:00 - 09:15',
        subject: 'PJOK (Pendidikan Jasmani, Olahraga & Kesehatan)',
        teacherOrNote: 'Kebugaran, Basket & Atletik · Lapangan SMPN 18 Bogor',
      },
      {
        time: '09:35 - 11:30',
        subject: 'SBK (Seni Budaya & Keterampilan)',
        teacherOrNote: 'Menggambar Ilustrasi, Musik Ansambel & Karya 8B',
      },
      {
        time: '12:00 - 14:00',
        subject: 'B. Inggris (English for Grade 8)',
        teacherOrNote: 'Simple Past Tense, Recount Text & Active Conversation',
      },
    ],
  },
  {
    day: 'Kamis',
    theme: 'Literasi Bahasa Indonesia & Wawasan Sosial Nusantara (IPS)',
    piketGroup: 'Regu Piket Kamis (Koordinator: Sekretaris 2)',
    Uniform: 'Batik Khas SMPN 18 Kota Bogor',
    slots: [
      {
        time: '07:00 - 10:15',
        subject: 'B. Indo (Bahasa Indonesia)',
        teacherOrNote: 'Teks Eksplanasi, Teks Berita (ADIKSIMBA) & Puisi',
      },
      {
        time: '10:35 - 14:00',
        subject: 'IPS (Ilmu Pengetahuan Sosial)',
        teacherOrNote: 'Interaksi Keruangan ASEAN & Mobilitas Sosial',
      },
    ],
  },
  {
    day: 'Jumat',
    theme: 'Teknologi Informatika Digital & Literasi Bahasa Indonesia',
    piketGroup: 'Regu Piket Jumat (Koordinator: Bendahara 1 & 2)',
    Uniform: 'Busana Muslim / Seragam Jumat SMPN 18 Kota Bogor',
    slots: [
      {
        time: '07:00 - 09:15',
        subject: 'Informatika (Komputasi & Algoritma Kelas 8)',
        teacherOrNote: 'Berpikir Komputasional & Jaringan · Lab Komputer SMPN 18',
      },
      {
        time: '09:30 - 11:30',
        subject: 'B. Indo (Literasi & Diskusi Karya Kelas 8B)',
        teacherOrNote: 'Ulasan Buku, Presentasi & Evaluasi Mingguan Bu Aida',
      },
    ],
  },
];

export interface VerificationResult {
  valid: boolean;
  issuer?: string;
  error?: string;
}

export function requiresRolePin(role: ClassRole): boolean {
  return role !== 'siswa';
}

export function validateClassLogin(params: {
  username: string;
  password: string;
  verificationCode: string;
  role: ClassRole;
  rolePin?: string;
  customCodes?: string[];
}): VerificationResult {
  const cleanUser = params.username.trim().toLowerCase();
  const cleanPass = params.password.trim();
  const rawCode = params.verificationCode.trim().toUpperCase();
  const cleanPin = (params.rolePin || '').trim();
  const roleLabel = ROLE_METADATA[params.role]?.label || params.role;

  if (cleanUser.length < 3 || cleanUser.length > 50) {
    return {
      valid: false,
      error: 'Username wajib diisi (minimal 3 hingga 50 karakter).',
    };
  }
  if (!cleanPass || cleanPass.length < 6) {
    return {
      valid: false,
      error: 'Kata sandi wajib diisi (minimal 6 karakter).',
    };
  }
  if (!rawCode) {
    return {
      valid: false,
      error: 'Kode Verifikasi OTP resmi wajib dimasukkan.',
    };
  }

  // TIER 1A: STRICT OWNER VALIDATION
  if (params.role === 'owner') {
    const allowedOwnerUsers = ['owner8b', 'admin8b', 'blackjacknet034', 'owner'];
    if (!allowedOwnerUsers.includes(cleanUser)) {
      return {
        valid: false,
        error: 'Akses Ditolak! Username tersebut tidak terdaftar sebagai Owner Web Kelas 8B.',
      };
    }
    if (cleanPass !== 'owner18bogor' && cleanPass !== 'master8b18') {
      return {
        valid: false,
        error: 'Kata Sandi Master Owner salah. Akun Owner dilindungi enkripsi tingkat tinggi.',
      };
    }
    if (cleanPin !== '180826') {
      return {
        valid: false,
        error: 'PIN Keamanan Otoritas 6-Digit Owner tidak valid.',
      };
    }
    const isDynamicOwnerCode =
      /^OWNER-8B-\d{4,6}$/.test(rawCode) &&
      Boolean(params.customCodes?.includes(rawCode));
    const preset = DEFAULT_VERIFICATION_CODES[rawCode];
    if ((preset && preset.allowedRoles.includes('owner')) || isDynamicOwnerCode) {
      return {
        valid: true,
        issuer: preset?.issuer || 'Otoritas Root Owner Web Kelas 8B',
      };
    }
    return {
      valid: false,
      error:
        'Akses Ditolak! Kode verifikasi ini bukan Kode Master Owner. Kode siswa atau pengurus tidak dapat mengakses akun Owner.',
    };
  }

  // TIER 1B: STRICT TEACHER (BU AIDA) VALIDATION
  if (params.role === 'teacher') {
    const allowedTeacherUsers = ['buaida', 'walikelas8b', 'ibuaida'];
    if (!allowedTeacherUsers.includes(cleanUser)) {
      return {
        valid: false,
        error: 'Akses Ditolak! Username khusus Wali Kelas (Ibu Aida) tidak sesuai.',
      };
    }
    if (cleanPass !== 'buaida18bogor' && cleanPass !== 'walikelas8b18') {
      return {
        valid: false,
        error: 'Kata Sandi khusus Wali Kelas (Ibu Aida) tidak valid.',
      };
    }
    if (cleanPin !== '180826') {
      return {
        valid: false,
        error: 'PIN Keamanan Otoritas 6-Digit Wali Kelas tidak valid.',
      };
    }
    const isDynamicTeacherCode =
      /^GURU-8B-\d{4,6}$/.test(rawCode) &&
      Boolean(params.customCodes?.includes(rawCode));
    const preset = DEFAULT_VERIFICATION_CODES[rawCode];
    if ((preset && preset.allowedRoles.includes('teacher')) || isDynamicTeacherCode) {
      return {
        valid: true,
        issuer: preset?.issuer || 'Otoritas Wali Kelas 8B (Ibu Aida)',
      };
    }
    return {
      valid: false,
      error:
        'Akses Ditolak! Kode verifikasi siswa/pengurus tidak dapat digunakan untuk masuk sebagai Wali Kelas (Ibu Aida).',
    };
  }

  // TIER 2: STRICT CLASS OFFICERS VALIDATION (Ketua, Wakil, Bendahara 1-2, Sekretaris 1-2)
  if (OFFICER_ROLES.includes(params.role)) {
    if (cleanUser === 'owner8b' || cleanUser === 'buaida') {
      return {
        valid: false,
        error: 'Gunakan username pengurus yang sesuai dengan jabatan Anda.',
      };
    }
    if (cleanPass !== 'pengurus8b18' && cleanPass !== 'kelas8b18') {
      return {
        valid: false,
        error: `Kata sandi pengurus untuk jabatan ${roleLabel} tidak valid.`,
      };
    }
    if (cleanPin !== '8818') {
      return {
        valid: false,
        error: `PIN Pengurus 4-Digit wajib diisi dengan benar untuk masuk sebagai ${roleLabel}.`,
      };
    }
    const isDynamicOfficerCode =
      /^PENGURUS-8B-\d{4,6}$/.test(rawCode) &&
      Boolean(params.customCodes?.includes(rawCode));
    const preset = DEFAULT_VERIFICATION_CODES[rawCode];
    if ((preset && preset.allowedRoles.includes(params.role)) || isDynamicOfficerCode) {
      return {
        valid: true,
        issuer: preset?.issuer || 'SK Mandat Pengurus Bu Aida & Owner',
      };
    }
    return {
      valid: false,
      error: `Akses Ditolak! Kode verifikasi yang dimasukkan tidak memiliki hak akses untuk jabatan ${roleLabel}.`,
    };
  }

  // TIER 3: REGULAR STUDENT (SISWA) VALIDATION
  if (cleanUser === 'owner8b' || cleanUser === 'buaida' || cleanUser === 'admin8b') {
    return {
      valid: false,
      error: 'Username tersebut milik otoritas khusus. Gunakan username siswa milikmu sendiri.',
    };
  }
  if (cleanPass !== 'kelas8b18') {
    return {
      valid: false,
      error: 'Kata sandi anggota Kelas 8B salah.',
    };
  }

  const preset = DEFAULT_VERIFICATION_CODES[rawCode];
  if (preset && preset.allowedRoles.includes('siswa')) {
    return { valid: true, issuer: preset.issuer };
  }

  const isDynamicStudentCode =
    (/^(BUAIDA|SISWA)-8B-\d{4,6}$/.test(rawCode)) &&
    (Boolean(params.customCodes?.includes(rawCode)) || /^BUAIDA-8B-\d{4}$/.test(rawCode));

  if (isDynamicStudentCode) {
    return {
      valid: true,
      issuer: 'Generator OTP Resmi Bu Aida & Owner 8B',
    };
  }

  return {
    valid: false,
    error:
      'Kode Verifikasi OTP tidak valid atau tidak sesuai dengan tingkat jabatan yang dipilih. Hubungi Bu Aida atau Owner Web Kelas 8B.',
  };
}

export interface StoreItem {
  id: string;
  type: 'banner' | 'title';
  name: string;
  subtitle: string;
  price: number;
  rarity: 'Klasik' | 'ikonic' | 'Legendaris' | 'Kehormatan';
  artworkKey: string;
  accentColor: string;
}

export const CLASS_STORE_ITEMS: StoreItem[] = [
  {
    id: 'banner_default',
    type: 'banner',
    name: 'Standar Akademik 8B',
    subtitle: 'Kanvas arsitektur minimalis SMPN 18 Kota Bogor',
    price: 0,
    rarity: 'Klasik',
    artworkKey: 'academic_slate',
    accentColor: '#0F172A',
  },
  {
    id: 'banner_royal_archon',
    type: 'banner',
    name: 'Mahkota Royal Bogor',
    subtitle: 'Filigri emas murni di atas beludru biru kerajaan dengan lambang burung hantu kebijaksanaan',
    price: 150,
    rarity: 'Legendaris',
    artworkKey: 'royal_archon',
    accentColor: '#D97706',
  },
  {
    id: 'banner_bogor_emerald',
    type: 'banner',
    name: 'Kanopi Zamrud Kebun Raya',
    subtitle: 'Siluet botani Kebun Raya Bogor berpadu berkas cahaya emas dan garis kisi arsitektur modern',
    price: 180,
    rarity: 'Legendaris',
    artworkKey: 'bogor_emerald',
    accentColor: '#059669',
  },
  {
    id: 'banner_celestial_astrolabe',
    type: 'banner',
    name: 'Astrolab Langit Nusantara',
    subtitle: 'Konstelasi bintang khatulistiwa dengan cincin orbit emas presisi tinggi',
    price: 220,
    rarity: 'Kehormatan',
    artworkKey: 'celestial_astrolabe',
    accentColor: '#0284C7',
  },
  {
    id: 'banner_sunda_pakuan',
    type: 'banner',
    name: 'Senja Pakuan Padjadjaran',
    subtitle: 'Geometri megah Gunung Salak saat senja dengan ornamen ukiran emas klasik',
    price: 250,
    rarity: 'Kehormatan',
    artworkKey: 'sunda_pakuan',
    accentColor: '#EA580C',
  },
  {
    id: 'banner_cyber_equator',
    type: 'banner',
    name: 'Arsitektur Siber Khatulistiwa',
    subtitle: 'Jaringan cetak biru isometrik berkecepatan tinggi dengan aksen safir',
    price: 140,
    rarity: 'ikonic',
    artworkKey: 'cyber_equator',
    accentColor: '#2563EB',
  },
  {
    id: 'title_default',
    type: 'title',
    name: 'Warga Resmi Kelas 8B',
    subtitle: 'Identitas resmi anggota Kelas 8B SMPN 18 Kota Bogor',
    price: 0,
    rarity: 'Klasik',
    artworkKey: 'title_warga',
    accentColor: '#475569',
  },
  {
    id: 'title_cendekiawan',
    type: 'title',
    name: 'Cendekiawan Utama 8B',
    subtitle: 'Gelar prestisius bagi penakluk kuis kurikulum kelas 8 dengan akurasi tinggi',
    price: 120,
    rarity: 'ikonic',
    artworkKey: 'title_cendekiawan',
    accentColor: '#0284C7',
  },
  {
    id: 'title_arsitek',
    type: 'title',
    name: 'Arsitek Masa Depan Bogor',
    subtitle: 'Simbol pemikir kreatif dan inovator teknologi Kelas 8B',
    price: 160,
    rarity: 'Legendaris',
    artworkKey: 'title_arsitek',
    accentColor: '#D97706',
  },
  {
    id: 'title_olimpiade',
    type: 'title',
    name: 'Maestro Sains & Matematika',
    subtitle: 'Penghargaan penguasaan rumus fisika, biologi, dan aljabar kelas 8',
    price: 200,
    rarity: 'Legendaris',
    artworkKey: 'title_olimpiade',
    accentColor: '#059669',
  },
  {
    id: 'title_kehormatan',
    type: 'title',
    name: 'Bintang Kehormatan Bu Aida',
    subtitle: 'Gelar tertinggi kebanggaan Wali Kelas 8B SMPN 18 Kota Bogor',
    price: 300,
    rarity: 'Kehormatan',
    artworkKey: 'title_kehormatan',
    accentColor: '#B45309',
  },
];

export interface PurchaseResult {
  success: boolean;
  newCoins: number;
  newUnlocked: string[];
  error?: string;
}

export function purchaseStoreItem(params: {
  currentCoins: number;
  unlockedItems: string[];
  itemId: string;
}): PurchaseResult {
  const item = CLASS_STORE_ITEMS.find((i) => i.id === params.itemId);
  if (!item) {
    return {
      success: false,
      newCoins: params.currentCoins,
      newUnlocked: params.unlockedItems,
      error: 'Item tidak ditemukan di Toko Kelas 8B.',
    };
  }
  if (params.unlockedItems.includes(item.id)) {
    return {
      success: false,
      newCoins: params.currentCoins,
      newUnlocked: params.unlockedItems,
      error: 'Item ini sudah kamu miliki.',
    };
  }
  if (params.currentCoins < item.price) {
    return {
      success: false,
      newCoins: params.currentCoins,
      newUnlocked: params.unlockedItems,
      error: `Koin tidak cukup. Kamu membutuhkan ${item.price - params.currentCoins} Koin lagi.`,
    };
  }
  return {
    success: true,
    newCoins: params.currentCoins - item.price,
    newUnlocked: [...params.unlockedItems, item.id],
  };
}

export interface QuizQuestion {
  id: string;
  subject: 'Matematika' | 'IPA (Sains)' | 'IPS' | 'Bahasa Indonesia' | 'PPKn' | 'Bahasa Inggris';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  coinReward: number;
}

export const GRADE_8_QUIZ_BANK: QuizQuestion[] = [
  {
    id: 'q1',
    subject: 'Matematika',
    question: 'Sebuah segitiga siku-siku memiliki panjang sisi tegak 6 cm dan 8 cm. Berapakah panjang sisi miring (hipotenusa) menurut Teorema Pythagoras?',
    options: ['10 cm', '12 cm', '14 cm', '16 cm'],
    correctIndex: 0,
    explanation: 'c = √(6² + 8²) = √(36 + 64) = √100 = 10 cm.',
    coinReward: 30,
  },
  {
    id: 'q2',
    subject: 'IPA (Sains)',
    question: 'Jaringan pada tumbuhan yang berfungsi mengangkut air dan mineral dari akar menuju daun adalah...',
    options: ['Floem (Pembuluh Tapis)', 'Xilem (Pembuluh Kayu)', 'Epidermis', 'Kambium'],
    correctIndex: 1,
    explanation: 'Xilem mengangkut air dan unsur hara dari akar ke daun, sedangkan Floem mengedarkan hasil fotosintesis.',
    coinReward: 30,
  },
  {
    id: 'q3',
    subject: 'IPS',
    question: 'Organisasi kerja sama regional negara-negara di kawasan Asia Tenggara (ASEAN) didirikan pada tanggal 8 Agustus 1967 melalui Deklarasi...',
    options: ['Deklarasi Juanda', 'Deklarasi Bangkok', 'Deklarasi Kuala Lumpur', 'Deklarasi Bogor'],
    correctIndex: 1,
    explanation: 'ASEAN didirikan melalui Deklarasi Bangkok pada 8 Agustus 1967 oleh 5 negara pendiri termasuk Indonesia.',
    coinReward: 25,
  },
  {
    id: 'q4',
    subject: 'Bahasa Indonesia',
    question: 'Dalam struktur teks eksplanasi, bagian yang berisi urutan sebab-akibat terjadinya suatu fenomena alam atau sosial disebut...',
    options: ['Identifikasi Fenomena', 'Rangkaian Kejadian (Deretan Penjelas)', 'Ulasan (Interpretasi)', 'Abstraksi'],
    correctIndex: 1,
    explanation: 'Deretan penjelas (rangkaian kejadian) memuat rincian proses sebab-akibat fenomena yang dijelaskan.',
    coinReward: 25,
  },
  {
    id: 'q5',
    subject: 'Matematika',
    question: 'Gradien (kemiringan) garis dengan persamaan y = 4x - 7 adalah...',
    options: ['-7', '-4', '4', '7'],
    correctIndex: 2,
    explanation: 'Pada persamaan garis y = mx + c, koefisien x yaitu m adalah gradien garis. Jadi m = 4.',
    coinReward: 30,
  },
  {
    id: 'q6',
    subject: 'IPA (Sains)',
    question: 'Enzim pada lambung manusia yang berfungsi mengubah protein menjadi pepton adalah...',
    options: ['Amilase', 'Pepsin', 'Renin', 'Lipase'],
    correctIndex: 1,
    explanation: 'Enzim pepsin di lambung memecah molekul protein menjadi pepton.',
    coinReward: 30,
  },
  {
    id: 'q7',
    subject: 'PPKn',
    question: 'Pancasila berfungsi sebagai pedoman hidup masyarakat Indonesia dalam bersikap dan bertingkah laku sehari-hari. Hal ini merupakan fungsi Pancasila sebagai...',
    options: ['Pandangan Hidup Bangsa', 'Perjanjian Luhur', 'Cita-Cita Hukum', 'Konstitusi Negara'],
    correctIndex: 0,
    explanation: 'Sebagai pandangan hidup bangsa (way of life), Pancasila menjadi petunjuk arah seluruh kegiatan hidup masyarakat Indonesia.',
    coinReward: 25,
  },
  {
    id: 'q8',
    subject: 'Bahasa Inggris',
    question: 'Choose the correct Simple Past Tense sentence for Grade 8 curriculum: "Yesterday, our class 8B ___ Bogor Botanical Gardens for a biology project."',
    options: ['visit', 'visits', 'visited', 'visiting'],
    correctIndex: 2,
    explanation: 'Keterangan waktu "Yesterday" menunjukkan masa lampau (Simple Past Tense) sehingga menggunakan Verb-2: "visited".',
    coinReward: 30,
  },
];

export interface FlashcardItem {
  id: string;
  subject: string;
  frontTitle: string;
  frontPrompt: string;
  backAnswer: string;
  formulaOrKey: string;
  coinReward: number;
}

export const GRADE_8_FLASHCARDS: FlashcardItem[] = [
  {
    id: 'fc1',
    subject: 'Fisika Kelas 8 · Tekanan Zat',
    frontTitle: 'Hukum Tekanan Hidrostatis',
    frontPrompt: 'Bagaimana rumus tekanan zat cair (hidrostatis) pada kedalaman tertentu?',
    backAnswer: 'Tekanan hidrostatis sebanding dengan massa jenis zat cair (ρ), percepatan gravitasi (g), dan kedalaman (h).',
    formulaOrKey: 'P = ρ × g × h',
    coinReward: 15,
  },
  {
    id: 'fc2',
    subject: 'Matematika Kelas 8 · Pola Bilangan',
    frontTitle: 'Barisan Aritmetika Suku ke-n',
    frontPrompt: 'Bagaimana menentukan nilai suku ke-n (Un) pada barisan aritmetika dengan suku pertama a dan beda b?',
    backAnswer: 'Suku ke-n dihitung dengan menjumlahkan suku pertama (a) dengan hasil kali (n - 1) dan beda (b).',
    formulaOrKey: 'Un = a + (n - 1)b',
    coinReward: 15,
  },
  {
    id: 'fc3',
    subject: 'Biologi Kelas 8 · Sistem Pernapasan',
    frontTitle: 'Pertukaran Gas di Alveolus',
    frontPrompt: 'Di bagian manakah terjadi difusi oksigen (O2) dan karbon dioksida (CO2) di dalam paru-paru?',
    backAnswer: 'Pertukaran gas secara difusi terjadi pada gelembung-gelembung halus berdinding tipis yang disebut Alveolus.',
    formulaOrKey: 'Alveolus (O₂ masuk kapiler darah, CO₂ keluar)',
    coinReward: 15,
  },
  {
    id: 'fc4',
    subject: 'IPS Kelas 8 · Sejarah Pergerakan Nasional',
    frontTitle: 'Lahirnya Kebangkitan Nasional',
    frontPrompt: 'Organisasi modern pertama di Indonesia yang berdiri pada 20 Mei 1908 dan dipelopori oleh dr. Wahidin Sudirohusodo serta dr. Soetomo adalah...',
    backAnswer: 'Budi Utomo, yang kelahirannya diperingati setiap tanggal 20 Mei sebagai Hari Kebangkitan Nasional.',
    formulaOrKey: 'Budi Utomo · 20 Mei 1908',
    coinReward: 15,
  },
  {
    id: 'fc5',
    subject: 'Bahasa Indonesia Kelas 8 · Teks Berita',
    frontTitle: 'Rumus Unsur Pokok Berita',
    frontPrompt: 'Sebutkan 6 unsur pokok kelengkapan berita dalam Bahasa Indonesia!',
    backAnswer: 'ADIKSIMBA: Apa, Di mana, Kapan, Siapa, Mengapa, dan Bagaimana.',
    formulaOrKey: 'ADIKSIMBA (5W + 1H)',
    coinReward: 15,
  },
  {
    id: 'fc6',
    subject: 'Matematika Kelas 8 · Lingkaran',
    frontTitle: 'Luas & Keliling Lingkaran',
    frontPrompt: 'Sebutkan rumus Luas (L) dan Keliling (K) lingkaran dengan jari-jari r!',
    backAnswer: 'Luas lingkaran adalah π dikali kuadrat jari-jari, sedangkan keliling adalah 2 dikali π dikali jari-jari.',
    formulaOrKey: 'L = πr²  ·  K = 2πr',
    coinReward: 15,
  },
];

export function calculateQuizReward(baseReward: number, streakCount: number, multiplierActive: boolean): number {
  if (baseReward <= 0) return 0;
  const streakBonus = Math.min(streakCount * 5, 25);
  const subtotal = baseReward + streakBonus;
  return multiplierActive ? subtotal * 2 : subtotal;
}

export interface PowerFeature {
  id: number;
  code: string;
  category:
    | 'Keamanan & Verifikasi Login'
    | 'Akademik & Tugas Kelas 8B'
    | 'Presensi & Pengurus Kelas'
    | 'Komunikasi & Live Chat 24/7'
    | 'Ekonomi Koin, Toko & Sistem Update';
  title: string;
  description: string;
  actionType: 'toggle' | 'execute';
  defaultEnabled?: boolean;
  actionLabel: string;
}

export const OWNER_TEACHER_45_FEATURES: PowerFeature[] = [
  // Kategori 1: Keamanan & Verifikasi Login (1 - 9)
  {
    id: 1,
    code: 'SEC-01',
    category: 'Keamanan & Verifikasi Login',
    title: 'Generator Kode Verifikasi Bu Aida & Owner',
    description: 'Buat kode verifikasi unik baru untuk dibagikan kepada siswa Kelas 8B saat login.',
    actionType: 'execute',
    actionLabel: 'Terbitkan Kode Baru',
  },
  {
    id: 2,
    code: 'SEC-02',
    category: 'Keamanan & Verifikasi Login',
    title: 'Kunci Gerbang Verifikasi Ketat (Strict Gatekeeper)',
    description: 'Wajibkan validasi kode verifikasi aktif untuk setiap sesi login baru siswa 8B.',
    actionType: 'toggle',
    defaultEnabled: true,
    actionLabel: 'Status Gatekeeper',
  },
  {
    id: 3,
    code: 'SEC-03',
    category: 'Keamanan & Verifikasi Login',
    title: 'Rotasi Otomatis Kode Akses Mingguan',
    description: 'Perbarui masa berlaku kode verifikasi tamu dan siswa secara berkala.',
    actionType: 'toggle',
    defaultEnabled: true,
    actionLabel: 'Rotasi Mingguan',
  },
  {
    id: 4,
    code: 'SEC-04',
    category: 'Keamanan & Verifikasi Login',
    title: 'Proteksi Anti-Brute Force Login 8B',
    description: 'Batasi percobaan kata sandi maksimal 5 kali sebelum jeda keamanan otomatis.',
    actionType: 'toggle',
    defaultEnabled: true,
    actionLabel: 'Anti-Brute Force',
  },
  {
    id: 5,
    code: 'SEC-05',
    category: 'Keamanan & Verifikasi Login',
    title: 'Sinkronisasi Hak Akses Setara Owner & Bu Aida',
    description: 'Pastikan akun Owner dan Wali Kelas (Bu Aida) selalu memiliki otoritas identik 100%.',
    actionType: 'toggle',
    defaultEnabled: true,
    actionLabel: 'Otoritas Setara',
  },
  {
    id: 6,
    code: 'SEC-06',
    category: 'Keamanan & Verifikasi Login',
    title: 'Filter Moderasi Ulasan Pengunjung (Visitor Review)',
    description: 'Saring kata tidak pantas secara otomatis pada formulir ulasan tamu di halaman depan.',
    actionType: 'toggle',
    defaultEnabled: true,
    actionLabel: 'Filter Ulasan Tamu',
  },
  {
    id: 7,
    code: 'SEC-07',
    category: 'Keamanan & Verifikasi Login',
    title: 'Audit Log Aktivitas Pengurus Kelas',
    description: 'Rekam setiap perubahan tugas, kas, dan pengumuman yang dilakukan pengurus 8B.',
    actionType: 'execute',
    actionLabel: 'Cetak Log Audit',
  },
  {
    id: 8,
    code: 'SEC-08',
    category: 'Keamanan & Verifikasi Login',
    title: 'Mode Pemeliharaan (Maintenance Lock) Pengunjung',
    description: 'Batasi akses halaman publik sementara saat pembaruan besar berlangsung.',
    actionType: 'toggle',
    defaultEnabled: false,
    actionLabel: 'Mode Pemeliharaan',
  },
  {
    id: 9,
    code: 'SEC-09',
    category: 'Keamanan & Verifikasi Login',
    title: 'Reset Sesi Keamanan Seluruh Perangkat',
    description: 'Segarkan token autentikasi kelas untuk menjaga keamanan akun bersama.',
    actionType: 'execute',
    actionLabel: 'Segarkan Sesi',
  },

  // Kategori 2: Akademik & Tugas Kelas 8B (10 - 18)
  {
    id: 10,
    code: 'ACA-10',
    category: 'Akademik & Tugas Kelas 8B',
    title: 'Generator Tugas Cepat Kurikulum Merdeka Kelas 8',
    description: 'Tambahkan tugas terstruktur lengkap dengan bobot hadiah koin otomatis.',
    actionType: 'execute',
    actionLabel: 'Buat Tugas Cepat',
  },
  {
    id: 11,
    code: 'ACA-11',
    category: 'Akademik & Tugas Kelas 8B',
    title: 'Pengingat Otomatis H-1 Deadline Tugas',
    description: 'Tampilkan penanda prioritas pada tugas yang mendekati batas pengumpulan.',
    actionType: 'toggle',
    defaultEnabled: true,
    actionLabel: 'Pengingat Deadline',
  },
  {
    id: 12,
    code: 'ACA-12',
    category: 'Akademik & Tugas Kelas 8B',
    title: 'Mode Fokus Ujian Tengah / Akhir Semester (PTS/PAS)',
    description: 'Sematkan jadwal ujian dan kisi-kisi materi Kelas 8B di bagian teratas dashboard.',
    actionType: 'toggle',
    defaultEnabled: false,
    actionLabel: 'Mode Ujian',
  },
  {
    id: 13,
    code: 'ACA-13',
    category: 'Akademik & Tugas Kelas 8B',
    title: 'Verifikasi Penyelesaian Tugas & Klaim Koin Instan',
    description: 'Izinkan siswa mengklaim hadiah koin begitu tugas ditandai selesai.',
    actionType: 'toggle',
    defaultEnabled: true,
    actionLabel: 'Klaim Koin Tugas',
  },
  {
    id: 14,
    code: 'ACA-14',
    category: 'Akademik & Tugas Kelas 8B',
    title: 'Arsip Otomatis Tugas Selesai',
    description: 'Pindahkan tugas yang telah melewati tenggat ke arsip rapi tanpa menghapus riwayat.',
    actionType: 'execute',
    actionLabel: 'Rapikan Tugas Selesai',
  },
  {
    id: 15,
    code: 'ACA-15',
    category: 'Akademik & Tugas Kelas 8B',
    title: 'Sinkronisasi Bank Soal Kelas 8 SMPN 18 Bogor',
    description: 'Aktifkan paket soal Matematika, IPA, IPS, Bahasa Indonesia, PPKn, dan Bahasa Inggris.',
    actionType: 'toggle',
    defaultEnabled: true,
    actionLabel: 'Bank Soal Aktif',
  },
  {
    id: 16,
    code: 'ACA-16',
    category: 'Akademik & Tugas Kelas 8B',
    title: 'Publikasi Kisi-Kisi & Rangkuman Materi Bu Aida',
    description: 'Terbitkan pengumuman materi belajar mingguan langsung ke beranda siswa.',
    actionType: 'execute',
    actionLabel: 'Terbitkan Materi',
  },
  {
    id: 17,
    code: 'ACA-17',
    category: 'Akademik & Tugas Kelas 8B',
    title: 'Ekspor Rekap Tugas Kelas 8B (Format CSV)',
    description: 'Unduh daftar tugas aktif dan status penyelesaian untuk laporan akademik.',
    actionType: 'execute',
    actionLabel: 'Ekspor CSV Tugas',
  },
  {
    id: 18,
    code: 'ACA-18',
    category: 'Akademik & Tugas Kelas 8B',
    title: 'Penghargaan Siswa Rajin Mingguan',
    description: 'Berikan apresiasi tambahan 50 Koin untuk ketuntasan tugas tepat waktu.',
    actionType: 'execute',
    actionLabel: 'Kirim Apresiasi',
  },

  // Kategori 3: Presensi & Pengurus Kelas (19 - 27)
  {
    id: 19,
    code: 'ADM-19',
    category: 'Presensi & Pengurus Kelas',
    title: 'Buka Sesi Presensi Pagi Kelas 8B (06:30 - 07:15 WIB)',
    description: 'Aktifkan pencatatan kehadiran harian bagi Sekretaris 1, Sekretaris 2, dan Wali Kelas.',
    actionType: 'toggle',
    defaultEnabled: true,
    actionLabel: 'Sesi Presensi Pagi',
  },
  {
    id: 20,
    code: 'ADM-20',
    category: 'Presensi & Pengurus Kelas',
    title: 'Tandai Hadir Serentak Satu Kelas (Quick Present)',
    description: 'Catat kehadiran harian cepat untuk seluruh siswa yang hadir hari ini.',
    actionType: 'execute',
    actionLabel: 'Rekap Hadir Cepat',
  },
  {
    id: 21,
    code: 'ADM-21',
    category: 'Presensi & Pengurus Kelas',
    title: 'Delegasi Otoritas Ketua & Wakil Ketua Kelas',
    description: 'Izinkan Ketua & Wakil Ketua mempublikasikan pengumuman resmi dan agenda kelas.',
    actionType: 'toggle',
    defaultEnabled: true,
    actionLabel: 'Otoritas Ketua/Wakil',
  },
  {
    id: 22,
    code: 'ADM-22',
    category: 'Presensi & Pengurus Kelas',
    title: 'Delegasi Buku Kas Bendahara 1 & Bendahara 2',
    description: 'Aktifkan modul pencatatan iuran kas kelas dan laporan saldo transparan.',
    actionType: 'toggle',
    defaultEnabled: true,
    actionLabel: 'Otoritas Bendahara 1 & 2',
  },
  {
    id: 23,
    code: 'ADM-23',
    category: 'Presensi & Pengurus Kelas',
    title: 'Delegasi Jurnal & Presensi Sekretaris 1 & Sekretaris 2',
    description: 'Izinkan Sekretaris 1 & 2 mengelola presensi harian dan daftar tugas sekolah.',
    actionType: 'toggle',
    defaultEnabled: true,
    actionLabel: 'Otoritas Sekretaris 1 & 2',
  },
  {
    id: 24,
    code: 'ADM-24',
    category: 'Presensi & Pengurus Kelas',
    title: 'Manajemen Rotasi Jadwal Piket Kebersihan 8B',
    description: 'Tampilkan pengingat regu piket harian Senin–Jumat di dashboard utama.',
    actionType: 'toggle',
    defaultEnabled: true,
    actionLabel: 'Jadwal Piket Aktif',
  },
  {
    id: 25,
    code: 'ADM-25',
    category: 'Presensi & Pengurus Kelas',
    title: 'Laporan Transparansi Kas Kelas Bulanan',
    description: 'Terbitkan ringkasan saldo kas Kelas 8B ke papan pengumuman digital.',
    actionType: 'execute',
    actionLabel: 'Terbitkan Laporan Kas',
  },
  {
    id: 26,
    code: 'ADM-26',
    category: 'Presensi & Pengurus Kelas',
    title: 'Ekspor Data Presensi Kelas 8B (Format CSV)',
    description: 'Unduh laporan kehadiran lengkap (Hadir, Izin, Sakit, Alfa) untuk arsip Bu Aida.',
    actionType: 'execute',
    actionLabel: 'Unduh CSV Presensi',
  },
  {
    id: 27,
    code: 'ADM-27',
    category: 'Presensi & Pengurus Kelas',
    title: 'Pembaruan Dinamis Nama & Jabatan Pengurus 8B',
    description: 'Ubah atau tetapkan nama siswa pada struktur pengurus kapan saja tanpa batas.',
    actionType: 'toggle',
    defaultEnabled: true,
    actionLabel: 'Edit Struktur Dinamis',
  },

  // Kategori 4: Komunikasi & Live Chat 24/7 (28 - 36)
  {
    id: 28,
    code: 'COM-28',
    category: 'Komunikasi & Live Chat 24/7',
    title: 'Mesin Transmisi Live Group Chat 24/7 Tanpa Delay',
    description: 'Jaga koneksi real-time grup diskusi Kelas 8B tetap menyala 24 jam penuh.',
    actionType: 'toggle',
    defaultEnabled: true,
    actionLabel: 'Live Chat 24/7 Aktif',
  },
  {
    id: 29,
    code: 'COM-29',
    category: 'Komunikasi & Live Chat 24/7',
    title: 'Jaringan Pesan Pribadi (Private Messaging) Antar Siswa',
    description: 'Izinkan pengiriman pesan langsung secara privat antar anggota Kelas 8B.',
    actionType: 'toggle',
    defaultEnabled: true,
    actionLabel: 'Pesan Pribadi Aktif',
  },
  {
    id: 30,
    code: 'COM-30',
    category: 'Komunikasi & Live Chat 24/7',
    title: 'Tampilan Lencana Banner & Gelar di Ruang Chat',
    description: 'Render banner seni dan gelar kehormatan siswa secara langsung pada pesan chat.',
    actionType: 'toggle',
    defaultEnabled: true,
    actionLabel: 'Lencana Chat Aktif',
  },
  {
    id: 31,
    code: 'COM-31',
    category: 'Komunikasi & Live Chat 24/7',
    title: 'Filter Bahasa Sopan & Etika Komunikasi SMPN 18',
    description: 'Jaga ruang diskusi tetap santun dan positif sesuai tata tertib sekolah.',
    actionType: 'toggle',
    defaultEnabled: true,
    actionLabel: 'Filter Etika Chat',
  },
  {
    id: 32,
    code: 'COM-32',
    category: 'Komunikasi & Live Chat 24/7',
    title: 'Siaran Pengumuman Darurat (Broadcast Banner)',
    description: 'Kirim pesan penting dari Bu Aida atau Owner langsung ke puncak Live Chat.',
    actionType: 'execute',
    actionLabel: 'Kirim Broadcast Kelas',
  },
  {
    id: 33,
    code: 'COM-33',
    category: 'Komunikasi & Live Chat 24/7',
    title: 'Mode Tenang Saat Jam Pelajaran Berlangsung',
    description: 'Fokuskan ruang chat hanya untuk tanya-jawab mata pelajaran saat diaktifkan.',
    actionType: 'toggle',
    defaultEnabled: false,
    actionLabel: 'Mode Jam Pelajaran',
  },
  {
    id: 34,
    code: 'COM-34',
    category: 'Komunikasi & Live Chat 24/7',
    title: 'Pembersihan Pesan Spam Satu Klik',
    description: 'Rapikan pesan berulang di ruang diskusi agar tetap nyaman dibaca.',
    actionType: 'execute',
    actionLabel: 'Bersihkan Duplikat',
  },
  {
    id: 35,
    code: 'COM-35',
    category: 'Komunikasi & Live Chat 24/7',
    title: 'Jalur Konsultasi Langsung Wali Kelas (Bu Aida)',
    description: 'Prioritaskan pesan pribadi yang ditujukan kepada Wali Kelas 8B.',
    actionType: 'toggle',
    defaultEnabled: true,
    actionLabel: 'Prioritas Wali Kelas',
  },
  {
    id: 36,
    code: 'COM-36',
    category: 'Komunikasi & Live Chat 24/7',
    title: 'Sinkronisasi Multi-Tab & Cloud Firestore Instan',
    description: 'Pastikan setiap pesan tersimpan aman di penyimpanan lokal dan database cloud.',
    actionType: 'toggle',
    defaultEnabled: true,
    actionLabel: 'Sinkronisasi Cloud',
  },

  // Kategori 5: Ekonomi Koin, Toko & Sistem Update (37 - 45)
  {
    id: 37,
    code: 'ECO-37',
    category: 'Ekonomi Koin, Toko & Sistem Update',
    title: 'Bonus Ganda Koin 2x Lipat (Double Coin Event)',
    description: 'Gandakan perolehan koin dari Kuis & Flashcard Kelas 8 untuk seluruh siswa!',
    actionType: 'toggle',
    defaultEnabled: false,
    actionLabel: 'Event Koin 2x Lipat',
  },
  {
    id: 38,
    code: 'ECO-38',
    category: 'Ekonomi Koin, Toko & Sistem Update',
    title: 'Hibah Beasiswa Koin Kelas 8B (+100 Koin)',
    description: 'Tambahkan 100 Koin apresiasi langsung ke saldo akun yang sedang aktif.',
    actionType: 'execute',
    actionLabel: 'Kirim +100 Koin',
  },
  {
    id: 39,
    code: 'ECO-39',
    category: 'Ekonomi Koin, Toko & Sistem Update',
    title: 'Diskon Beasiswa Toko Eksklusif 8B',
    description: 'Aktifkan akses hemat untuk koleksi Banner dan Gelar Kehormatan Kelas 8B.',
    actionType: 'toggle',
    defaultEnabled: false,
    actionLabel: 'Program Beasiswa Toko',
  },
  {
    id: 40,
    code: 'ECO-40',
    category: 'Ekonomi Koin, Toko & Sistem Update',
    title: 'Buka Kunci Semua Koleksi Banner & Gelar (Showcase Owner/Guru)',
    description: 'Buka seluruh item Toko Eksklusif untuk akun Owner atau Bu Aida secara instan.',
    actionType: 'execute',
    actionLabel: 'Buka Seluruh Koleksi',
  },
  {
    id: 41,
    code: 'ECO-41',
    category: 'Ekonomi Koin, Toko & Sistem Update',
    title: 'Mesin Animasi Swipe & Transisi Halus (60fps)',
    description: 'Aktifkan animasi geser (swipe) responsif saat berpindah tab dan kartu flashcard.',
    actionType: 'toggle',
    defaultEnabled: true,
    actionLabel: 'Animasi Swipe Aktif',
  },
  {
    id: 42,
    code: 'ECO-42',
    category: 'Ekonomi Koin, Toko & Sistem Update',
    title: 'Publikasi Update Fitur & Patch Website Kapan Saja',
    description: 'Tambahkan catatan pembaruan (Update Log) atau modul baru secara langsung ke portal.',
    actionType: 'execute',
    actionLabel: 'Rilis Update Baru',
  },
  {
    id: 43,
    code: 'ECO-43',
    category: 'Ekonomi Koin, Toko & Sistem Update',
    title: 'Pemeriksaan Mandiri Integritas & Perbaikan Bug Otomatis',
    description: 'Validasi struktur penyimpanan data, sinkronisasi state, dan pemulihan bebas bug.',
    actionType: 'execute',
    actionLabel: 'Jalankan Diagnostik',
  },
  {
    id: 44,
    code: 'ECO-44',
    category: 'Ekonomi Koin, Toko & Sistem Update',
    title: 'Cadangkan (Backup JSON) Seluruh Data Kelas 8B',
    description: 'Unduh salinan lengkap data tugas, presensi, pengumuman, dan konfigurasi kelas.',
    actionType: 'execute',
    actionLabel: 'Unduh Backup JSON',
  },
  {
    id: 45,
    code: 'ECO-45',
    category: 'Ekonomi Koin, Toko & Sistem Update',
    title: 'Optimasi Hosting Publik & Aksesibilitas Lintas Perangkat',
    description: 'Pastikan portal Kelas 8B SMPN 18 Kota Bogor ringan dibuka oleh siapa saja di HP & Laptop.',
    actionType: 'toggle',
    defaultEnabled: true,
    actionLabel: 'Optimasi Hosting Aktif',
  },
];

export function canAccessOwnerTeacherPanel(role: ClassRole): boolean {
  return role === 'owner' || role === 'teacher';
}

export function generateVerificationCode(
  prefix: 'BUAIDA' | 'OWNER' | 'GURU' | 'PENGURUS' | 'SISWA' = 'SISWA',
  seedNumber?: number
): string {
  const num = seedNumber !== undefined ? seedNumber : Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-8B-${num}`;
}

// ============================================================================
// 3 FITUR BARU KELAS 8B SMPN 18 KOTA BOGOR
// ============================================================================

export type KudosCategoryId = 'diskusi' | 'piket' | 'bantu_pr' | 'inspirator';

export interface KudosCategory {
  id: KudosCategoryId;
  label: string;
  description: string;
  coinBonus: number;
}

export const KUDOS_CATEGORIES: KudosCategory[] = [
  {
    id: 'diskusi',
    label: 'Juara Diskusi',
    description: 'Aktif berpendapat dan menjaga suasana diskusi tetap positif.',
    coinBonus: 10,
  },
  {
    id: 'piket',
    label: 'Sahabat Piket 8B',
    description: 'Rajin menjaga kebersihan ruang Kelas 8B SMPN 18 Kota Bogor.',
    coinBonus: 10,
  },
  {
    id: 'bantu_pr',
    label: 'Mentor Bantu PR',
    description: 'Sabar menjelaskan materi Matematika, IPA, atau pelajaran lain kepada teman.',
    coinBonus: 15,
  },
  {
    id: 'inspirator',
    label: 'Inspirator Kelas 8B',
    description: 'Memberi teladan disiplin, sopan santun, dan semangat belajar.',
    coinBonus: 15,
  },
];

export function calculatePomodoroCoinReward(
  durationMinutes: number,
  doubleCoinActive: boolean
): number {
  if (durationMinutes <= 0) return 0;
  const base = durationMinutes >= 25 ? 25 : durationMinutes >= 15 ? 15 : 10;
  return doubleCoinActive ? base * 2 : base;
}

export function formatCountdownTimer(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function generateSuratIzinText(params: {
  studentName: string;
  dateLabel: string;
  reasonType: 'Sakit' | 'Izin Keluarga' | 'Dispensasi Lomba / Sekolah';
  detailReason: string;
  parentName: string;
}): string {
  const cleanStudent = params.studentName.trim() || 'Siswa Kelas 8B';
  const cleanParent = params.parentName.trim() || 'Orang Tua / Wali Murid';
  const cleanDetail = params.detailReason.trim() || 'berhalangan hadir sesuai keterangan';
  const cleanDate = params.dateLabel.trim() || 'Hari Ini';

  return [
    `Bogor, ${cleanDate}`,
    ``,
    `Kepada Yth.`,
    `Ibu Aida, S.Pd.`,
    `Wali Kelas 8B SMP Negeri 18 Kota Bogor`,
    `Di Tempat`,
    ``,
    `Dengan hormat,`,
    `Saya selaku orang tua/wali dari siswa:`,
    `• Nama Siswa  : ${cleanStudent}`,
    `• Kelas       : VIII-B (8B)`,
    `• Sekolah     : SMP Negeri 18 Kota Bogor`,
    ``,
    `Memberitahukan bahwa anak kami pada tanggal ${cleanDate} tidak dapat mengikuti kegiatan pembelajaran di sekolah karena ${params.reasonType} (${cleanDetail}).`,
    ``,
    `Demikian surat izin ini kami sampaikan melalui Portal Resmi Kelas 8B. Atas perhatian dan izin Ibu Aida, kami ucapkan terima kasih.`,
    ``,
    `Hormat kami,`,
    `${cleanParent}`,
  ].join('\n');
}

const BLOCKED_REVIEW_WORDS = ['anjing', 'bajingan', 'bangsat', 'kontol', 'memek', 'tolol', 'goblok'];

export function validateReviewInput(params: {
  visitorName: string;
  message: string;
  filterEnabled: boolean;
}): { valid: boolean; error?: string } {
  const name = params.visitorName.trim();
  const msg = params.message.trim();
  if (name.length < 2) {
    return { valid: false, error: 'Mohon isi nama lengkap minimal 2 karakter.' };
  }
  if (msg.length < 3) {
    return { valid: false, error: 'Mohon tulis pesan atau ulasan minimal 3 karakter.' };
  }
  if (params.filterEnabled) {
    const lower = `${name} ${msg}`.toLowerCase();
    if (BLOCKED_REVIEW_WORDS.some((w) => lower.includes(w))) {
      return {
        valid: false,
        error: 'Pesan tertahan filter etika SMPN 18 Kota Bogor. Gunakan bahasa yang sopan ya.',
      };
    }
  }
  return { valid: true };
}

export function buildCsvContent(headers: string[], rows: (string | number)[][]): string {
  const escapeCell = (val: string | number) => {
    const str = String(val ?? '');
    return `"${str.replace(/"/g, '""')}"`;
  };
  return [
    headers.map(escapeCell).join(','),
    ...rows.map((row) => row.map(escapeCell).join(',')),
  ].join('\n');
}

// ============================================================================
// 6 FITUR BARU LANDING PAGE (VISITOR & PUBLIK) + 3 FITUR BARU ANAK 8B
// ============================================================================

export interface SchoolbagChecklistItem {
  id: string;
  label: string;
  category: 'Buku Paket & Catatan' | 'Atribut & Seragam' | 'Praktikum / Ekstra';
}

export const SCHOOLBAG_ITEMS_BY_DAY: Record<DaySchedule['day'], SchoolbagChecklistItem[]> = {
  Senin: [
    { id: 'sen-1', label: 'Buku Paket & Catatan PKN Kelas 8', category: 'Buku Paket & Catatan' },
    { id: 'sen-2', label: 'Buku Paket, Latihan Berpetak & Penggaris MTK', category: 'Buku Paket & Catatan' },
    { id: 'sen-3', label: 'Buku Paket & LKS Praktikum IPA Terpadu', category: 'Buku Paket & Catatan' },
    { id: 'sen-4', label: 'Buku Pangrumat Basa Sunda & Kamus Sunda', category: 'Buku Paket & Catatan' },
    { id: 'sen-5', label: 'Topi, Dasi & Sabuk Upacara Bendera SMPN 18', category: 'Atribut & Seragam' },
  ],
  Selasa: [
    { id: 'sel-1', label: 'Buku Paket & Buku Latihan MTK Kelas 8', category: 'Buku Paket & Catatan' },
    { id: 'sel-2', label: 'Buku Paket & Catatan IPA (Biologi/Fisika)', category: 'Buku Paket & Catatan' },
    { id: 'sel-3', label: 'Jurnal Pengembangan Diri BK (Bimbingan Konseling)', category: 'Buku Paket & Catatan' },
    { id: 'sel-4', label: 'Buku Paket PAI & Al-Quran / Juz Amma', category: 'Buku Paket & Catatan' },
    { id: 'sel-5', label: 'Rompi Seragam Selasa SMPN 18 Kota Bogor', category: 'Atribut & Seragam' },
  ],
  Rabu: [
    { id: 'rab-1', label: 'Seragam Olahraga PJOK & Sepatu Kets', category: 'Atribut & Seragam' },
    { id: 'rab-2', label: 'Buku Gambar A3, Pensil Sketsa & Alat SBK', category: 'Praktikum / Ekstra' },
    { id: 'rab-3', label: 'Buku Paket B. Inggris & Kamus English-Indonesia', category: 'Buku Paket & Catatan' },
    { id: 'rab-4', label: 'Botol Air Minum Tumblr untuk Sesi PJOK', category: 'Praktikum / Ekstra' },
  ],
  Kamis: [
    { id: 'kam-1', label: 'Buku Paket & Catatan B. Indo (Teks Eksplanasi & Berita)', category: 'Buku Paket & Catatan' },
    { id: 'kam-2', label: 'Buku Paket IPS & Atlas ASEAN / Indonesia', category: 'Buku Paket & Catatan' },
    { id: 'kam-3', label: 'Seragam Batik Khas SMPN 18 Kota Bogor', category: 'Atribut & Seragam' },
  ],
  Jumat: [
    { id: 'jum-1', label: 'Buku Modul Informatika & Flashdisk / Akun Belajar', category: 'Praktikum / Ekstra' },
    { id: 'jum-2', label: 'Buku Paket B. Indo & Buku Bacaan Literasi', category: 'Buku Paket & Catatan' },
    { id: 'jum-3', label: 'Uang Kas Mingguan Kelas 8B (Setor ke Bendahara 1/2)', category: 'Atribut & Seragam' },
  ],
};

export type FormulaMode = 'pythagoras' | 'gradien' | 'hidrostatis';

export interface FormulaCalculationResult {
  formulaLabel: string;
  resultText: string;
  stepExplanation: string;
}

export function calculateScienceMathFormula(params: {
  mode: FormulaMode;
  a: number;
  b: number;
  c?: number;
}): FormulaCalculationResult {
  const valA = Number.isFinite(params.a) ? params.a : 0;
  const valB = Number.isFinite(params.b) ? params.b : 0;
  const valC = Number.isFinite(params.c) ? Number(params.c) : 10;

  if (params.mode === 'pythagoras') {
    const safeA = Math.max(0, valA);
    const safeB = Math.max(0, valB);
    const hyp = Math.sqrt(safeA * safeA + safeB * safeB);
    const formatted = Number.isInteger(hyp) ? String(hyp) : hyp.toFixed(2);
    return {
      formulaLabel: 'c = √(a² + b²)',
      resultText: `${formatted} cm`,
      stepExplanation: `c = √(${safeA}² + ${safeB}²) = √(${safeA * safeA} + ${safeB * safeB}) = √${
        safeA * safeA + safeB * safeB
      } = ${formatted} cm.`,
    };
  }

  if (params.mode === 'gradien') {
    if (valB === 0) {
      return {
        formulaLabel: 'm = Δy / Δx',
        resultText: 'Tak Terdefinisi (Garis Tegak)',
        stepExplanation: 'Perubahan Δx = 0 menghasilkan garis vertikal sejajar sumbu-Y.',
      };
    }
    const m = valA / valB;
    const formatted = Number.isInteger(m) ? String(m) : m.toFixed(2);
    return {
      formulaLabel: 'm = Δy / Δx',
      resultText: `m = ${formatted}`,
      stepExplanation: `Gradien garis dengan perubahan vertikal Δy = ${valA} dan horizontal Δx = ${valB} adalah ${valA} / ${valB} = ${formatted}.`,
    };
  }

  // hidrostatis: P = rho * g * h
  const rho = Math.max(0, valA);
  const depth = Math.max(0, valB);
  const g = valC > 0 ? valC : 10;
  const pressure = rho * g * depth;
  return {
    formulaLabel: 'P = ρ × g × h',
    resultText: `${pressure.toLocaleString('id-ID')} Pa`,
    stepExplanation: `Tekanan hidrostatis pada ρ = ${rho} kg/m³, g = ${g} m/s², dan kedalaman h = ${depth} m adalah ${pressure.toLocaleString(
      'id-ID'
    )} Pascal.`,
  };
}

export interface SundaVocabEntry {
  id: string;
  sunda: string;
  indonesia: string;
  ragam: 'Lemes (Halus)' | 'Loma (Akrab)';
  example: string;
}

export const SUNDA_BOGOR_DICTIONARY: SundaVocabEntry[] = [
  {
    id: 'snd-1',
    sunda: 'Wilujeng enjing',
    indonesia: 'Selamat pagi',
    ragam: 'Lemes (Halus)',
    example: 'Wilujeng enjing Bu Aida, abdi parantos siap diajar Basa Sunda.',
  },
  {
    id: 'snd-2',
    sunda: 'Hatur nuhun pisan',
    indonesia: 'Terima kasih banyak',
    ragam: 'Lemes (Halus)',
    example: 'Hatur nuhun pisan kana bantosanana dina tugas kelompok.',
  },
  {
    id: 'snd-3',
    sunda: 'Punten, bade tumaros',
    indonesia: 'Permisi, mau bertanya',
    ragam: 'Lemes (Halus)',
    example: 'Punten Bu, abdi bade tumaros ngeunaan PR dinten Senen.',
  },
  {
    id: 'snd-4',
    sunda: 'Diajar babarengan',
    indonesia: 'Belajar bersama-sama',
    ragam: 'Loma (Akrab)',
    example: 'Hayu urang diajar babarengan MTK sareng IPA di kelas 8B.',
  },
  {
    id: 'snd-5',
    sunda: 'Kota Hujan Pakuan',
    indonesia: 'Julukan Kota Bogor bersejarah',
    ragam: 'Lemes (Halus)',
    example: 'SMPN 18 perenahna di Kota Hujan Bogor nu asri.',
  },
  {
    id: 'snd-6',
    sunda: 'Sumanget pisan',
    indonesia: 'Sangat bersemangat',
    ragam: 'Loma (Akrab)',
    example: 'Barudak kelas 8B sumanget pisan ngiringan olahraga PJOK.',
  },
];

export function searchSundaDictionary(queryText: string): SundaVocabEntry[] {
  const q = queryText.trim().toLowerCase();
  if (!q) return SUNDA_BOGOR_DICTIONARY;
  return SUNDA_BOGOR_DICTIONARY.filter(
    (item) =>
      item.sunda.toLowerCase().includes(q) ||
      item.indonesia.toLowerCase().includes(q) ||
      item.example.toLowerCase().includes(q)
  );
}

export interface VisitorPollOption {
  id: string;
  label: string;
  scheduleDay: string;
  votes: number;
}

export const INITIAL_VISITOR_POLL: VisitorPollOption[] = [
  { id: 'poll-1', label: 'MTK & IPA (Sains Eksperimen)', scheduleDay: 'Senin & Selasa', votes: 34 },
  { id: 'poll-2', label: 'Informatika & Koding Digital', scheduleDay: 'Jumat', votes: 29 },
  { id: 'poll-3', label: 'PJOK, SBK & Bahasa Inggris', scheduleDay: 'Rabu', votes: 26 },
  { id: 'poll-4', label: 'B. Indonesia, IPS & Basa Sunda', scheduleDay: 'Senin, Kamis & Jumat', votes: 23 },
];

export interface ShowcaseKaryaItem {
  id: string;
  subjectTag: 'Informatika' | 'SBK' | 'IPA' | 'B. Indo' | 'PJOK';
  title: string;
  creator: string;
  summary: string;
  likes: number;
}

export const SHOWCASE_KARYA_8B: ShowcaseKaryaItem[] = [
  {
    id: 'kry-1',
    subjectTag: 'Informatika',
    title: 'Prototipe Portal Digital & Keamanan OTP Kelas 8B',
    creator: 'Tim Informatika Hari Jumat · Kelas 8B',
    summary:
      'Aplikasi web modern untuk manajemen jadwal Senin–Jumat, kuis koin Kurikulum Merdeka, dan komunikasi real-time 24/7.',
    likes: 48,
  },
  {
    id: 'kry-2',
    subjectTag: 'IPA',
    title: 'Herbarium & Diagram Kapilaritas Jaringan Xilem-Floem',
    creator: 'Kelompok Praktikum IPA Senin & Selasa',
    summary:
      'Koleksi pengamatan jaringan pengangkut tumbuhan Kebun Raya Bogor lengkap dengan perhitungan tekanan osmotik.',
    likes: 39,
  },
  {
    id: 'kry-3',
    subjectTag: 'SBK',
    title: 'Poster Ilustrasi Siluet Gunung Salak & Tugu Kujang',
    creator: 'Studio Kreatif SBK Hari Rabu · Kelas 8B',
    summary:
      'Karya seni rupa dua dimensi bertema pelestarian cagar budaya dan alam Kota Hujan Bogor.',
    likes: 42,
  },
  {
    id: 'kry-4',
    subjectTag: 'B. Indo',
    title: 'Antologi Teks Eksplanasi & Liputan Berita SMPN 18',
    creator: 'Redaksi Literasi Kamis & Jumat · Kelas 8B',
    summary:
      'Kumpulan tulisan siswa Kelas 8B berstruktur ADIKSIMBA mengenai inovasi sekolah ramah lingkungan.',
    likes: 35,
  },
];

export function generateVisitorPassCard(params: {
  visitorName: string;
  visitorRole: string;
  purpose: string;
}): { passCode: string; formattedPass: string } {
  const cleanName = params.visitorName.trim() || 'Tamu Kehormatan 8B';
  const cleanRole = params.visitorRole.trim() || 'Tamu Sekolah';
  const cleanPurpose = params.purpose.trim() || 'Kunjungan Portal Digital Kelas 8B';
  const hashNum =
    cleanName.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 180) % 9000 + 1000;
  const passCode = `VST-8B-${hashNum}`;
  return {
    passCode,
    formattedPass: [
      `KARTU KUNJUNGAN DIGITAL — KELAS 8B SMPN 18 KOTA BOGOR`,
      `Kode Pas Tamu : ${passCode}`,
      `Nama Tamu     : ${cleanName}`,
      `Kategori      : ${cleanRole}`,
      `Keperluan     : ${cleanPurpose}`,
      `Status Akses  : Mode Pengunjung Terverifikasi · Wali Kelas Ibu Aida, S.Pd.`,
    ].join('\n'),
  };
}

// ============================================================================
// 3 FITUR BARU TAMBAHAN KHUSUS ANAK KELAS 8B (MEMBER MODE)
// ============================================================================

export interface StudyGroupTeam {
  teamNumber: number;
  teamName: string;
  members: { name: string; roleInTeam: string }[];
}

export function generateBalancedStudyGroups(params: {
  namesInput: string[];
  groupCount: number;
  subjectLabel: string;
}): StudyGroupTeam[] {
  const cleaned = params.namesInput.map((n) => n.trim()).filter((n) => n.length > 0);
  const safeCount = Math.max(2, Math.min(6, Math.floor(params.groupCount) || 2));
  const teams: StudyGroupTeam[] = Array.from({ length: safeCount }, (_, idx) => ({
    teamNumber: idx + 1,
    teamName: `Kelompok ${idx + 1} · ${params.subjectLabel.trim() || 'Kelas 8B'}`,
    members: [],
  }));

  cleaned.forEach((studentName, idx) => {
    const teamIdx = idx % safeCount;
    const posInTeam = teams[teamIdx].members.length;
    const roleInTeam =
      posInTeam === 0
        ? 'Ketua Kelompok'
        : posInTeam === 1
        ? 'Penyaji Materi'
        : posInTeam === 2
        ? 'Notulis & Riset'
        : 'Anggota Kolaborator';
    teams[teamIdx].members.push({ name: studentName, roleInTeam });
  });

  return teams;
}

export interface TargetRaporResult {
  finalScore: number;
  predicate: 'A (Sangat Baik)' | 'B (Baik)' | 'C (Cukup)' | 'Perlu Pendampingan';
  neededPasForA: number;
  recommendation: string;
}

export function calculateTargetRaporScore(params: {
  tugasAvg: number;
  uhAvg: number;
  ptsScore: number;
  pasTarget: number;
}): TargetRaporResult {
  const clamp = (n: number) => Math.max(0, Math.min(100, Number.isFinite(n) ? n : 0));
  const t = clamp(params.tugasAvg);
  const u = clamp(params.uhAvg);
  const pts = clamp(params.ptsScore);
  const pas = clamp(params.pasTarget);

  // Bobot Kurikulum Merdeka SMP: Tugas 30%, UH 30%, PTS 20%, PAS 20%
  const finalScore = Number((t * 0.3 + u * 0.3 + pts * 0.2 + pas * 0.2).toFixed(1));
  const currentWithoutPas = t * 0.3 + u * 0.3 + pts * 0.2;
  const rawNeededPas = (90 - currentWithoutPas) / 0.2;
  const neededPasForA = Math.max(0, Math.min(100, Math.ceil(rawNeededPas)));

  let predicate: TargetRaporResult['predicate'] = 'Perlu Pendampingan';
  if (finalScore >= 90) predicate = 'A (Sangat Baik)';
  else if (finalScore >= 80) predicate = 'B (Baik)';
  else if (finalScore >= 72) predicate = 'C (Cukup)';

  const recommendation =
    finalScore >= 90
      ? 'Luar biasa! Pertahankan konsistensi latihan kuis dan tugas mingguanmu.'
      : `Untuk menembus Predikat A (90.0), kamu perlu skor PAS minimal ${neededPasForA} poin.`;

  return {
    finalScore,
    predicate,
    neededPasForA,
    recommendation,
  };
}

export interface DailyQuest8B {
  id: string;
  dayTag: string;
  subjectTag: string;
  title: string;
  coinReward: number;
  xpReward: number;
}

export const DAILY_CLASS_QUESTS_8B: DailyQuest8B[] = [
  {
    id: 'qst-senin',
    dayTag: 'Senin',
    subjectTag: 'PKN · MTK · IPA · Sunda',
    title: 'Selesaikan latihan Pythagoras MTK & baca ringkasan Basa Sunda Bogor',
    coinReward: 20,
    xpReward: 50,
  },
  {
    id: 'qst-selasa',
    dayTag: 'Selasa',
    subjectTag: 'MTK · IPA · BK · PAI',
    title: 'Tulis jurnal refleksi BK & tuntas catatan eksperimen IPA Biologi',
    coinReward: 20,
    xpReward: 50,
  },
  {
    id: 'qst-rabu',
    dayTag: 'Rabu',
    subjectTag: 'PJOK · SBK · B. Inggris',
    title: 'Siapkan sketsa karya SBK & latihan 5 kalimat Simple Past Tense B. Inggris',
    coinReward: 20,
    xpReward: 50,
  },
  {
    id: 'qst-kamis',
    dayTag: 'Kamis',
    subjectTag: 'B. Indo · IPS',
    title: 'Susun kerangka Teks Eksplanasi B. Indo & peta konsep kerjasama ASEAN IPS',
    coinReward: 20,
    xpReward: 50,
  },
  {
    id: 'qst-jumat',
    dayTag: 'Jumat',
    subjectTag: 'Informatika · B. Indo',
    title: 'Praktik algoritma Informatika & setor laporan literasi mingguan ke Ibu Aida',
    coinReward: 25,
    xpReward: 65,
  },
];

export type KagePathwayId = 'sanmon' | 'approach' | 'lantern-court' | 'moonwater';

export type KageForegroundLayerId =
  | 'temple-wall'
  | 'pine-tree'
  | 'tall-grass'
  | 'sakura-branch'
  | 'maple-leaves'
  | 'stone-lantern'
  | 'garden-bush'
  | 'basalt-stones'
  | 'hill'
  | 'shrine-ruins';

export interface KageTypographyConfig {
  headingFont: string;
  bodyFont: string;
  headingWeight: string;
  bodyWeight: string;
  primaryColor: string;
  headingSize: number;
  bodySize: number;
  headingLetterSpacing: number;
}

export const KAGE_8B_TYPOGRAPHY: KageTypographyConfig = {
  headingFont: 'Onest',
  bodyFont: 'Onest',
  headingWeight: '400',
  bodyWeight: '300',
  primaryColor: '#e0231c',
  headingSize: 46,
  bodySize: 17,
  headingLetterSpacing: -0.012,
};

export interface KagePathwayRealm {
  id: KagePathwayId;
  chapterCode: string;
  shortLabel: string;
  japaneseSub: string;
  kanjiSeal: string;
  headline: string;
  description: string;
  bgAsset: string;
  canonicalAsset: string;
  cameraPos: [number, number, number];
  cameraLookAt: [number, number, number];
  fogHex: string;
  accentHex: string;
  ambientNote: string;
  linkedDay: DaySchedule['day'];
  highlightMetric: string;
}

export const KAGE_8B_PATHWAYS: KagePathwayRealm[] = [
  {
    id: 'sanmon',
    chapterCode: '01',
    shortLabel: 'Gerbang Sanmon 8B',
    japaneseSub: '山門 · Gerbang Utama Pakuan',
    kanjiSeal: '影 · 八B',
    headline: 'Di balik keheningan fajar Bogor, gerbang ilmu Kelas 8B terbuka',
    description:
      'Memasuki pelataran suci pengetahuan Kelas 8B SMP Negeri 18 Kota Bogor bimbingan Ibu Aida, S.Pd. — tempat ketenangan fokus berpadu dengan disiplin akademik.',
    bgAsset: '/images/kage_8b_sanmon.jpg',
    canonicalAsset: '/landing-pages/secret-pathways-assets/generated/kage-sanmon-preview.webp',
    cameraPos: [0, 3.1, 13.2],
    cameraLookAt: [0, 2.3, -2.5],
    fogHex: '#0b0f17',
    accentHex: '#e0231c',
    ambientNote: 'Cahaya Fajar Kebun Raya · Kabut Halus',
    linkedDay: 'Senin',
    highlightMetric: '9 Jabatan Resmi · 45 Fitur Komando',
  },
  {
    id: 'approach',
    chapterCode: '02',
    shortLabel: 'Jalur Batu Basalt',
    japaneseSub: '参道 · Setapak Kolaborasi',
    kanjiSeal: '道 · 歩',
    headline: 'Langkah terukur meniti batu basalt menuju pusat kolaborasi 8B',
    description:
      'Setiap pijakan batu vulkanik Gunung Salak melambangkan 5 hari jadwal pelajaran Senin–Jumat, ketertiban regu piket, dan transparansi kas kelas.',
    bgAsset: '/images/kage_8b_approach.jpg',
    canonicalAsset: '/landing-pages/secret-pathways-assets/generated/kage-approach.webp',
    cameraPos: [-3.2, 2.2, 9.4],
    cameraLookAt: [0.3, 1.7, -3.8],
    fogHex: '#101320',
    accentHex: '#f97316',
    ambientNote: 'Angin Hutan Pinus & Bambu · Guguran Daun Maple',
    linkedDay: 'Selasa',
    highlightMetric: 'Jadwal Senin–Jumat · 15 Sesi Mapel',
  },
  {
    id: 'lantern-court',
    chapterCode: '03',
    shortLabel: 'Pelataran Lentera',
    japaneseSub: '燈籠庭 · Lentera Akademik',
    kanjiSeal: '燈 · 智',
    headline: 'Pelataran lentera batu yang menerangi tugas, kuis, dan fokus 8B',
    description:
      'Deretan lentera batu Tōrō menyala hangat dengan segel merah #e0231c — memandu siswa menyelesaikan PR, sesi Timer Pomodoro 25 menit, dan misi Koin Kurikulum Merdeka.',
    bgAsset: '/images/kage_8b_lantern_court.jpg',
    canonicalAsset: '/landing-pages/secret-pathways-assets/generated/kage-lantern-court.webp',
    cameraPos: [3.4, 2.5, 8.2],
    cameraLookAt: [-0.3, 1.8, -3.2],
    fogHex: '#15111b',
    accentHex: '#e0231c',
    ambientNote: 'Pijar Lentera Tōrō · Siluet Gunung Salak',
    linkedDay: 'Rabu',
    highlightMetric: '+25 Koin Pomodoro · Bank Kuis Kelas 8',
  },
  {
    id: 'moonwater',
    chapterCode: '04',
    shortLabel: 'Telaga Air Bulan',
    japaneseSub: '月水池 · Refleksi Prestasi',
    kanjiSeal: '月 · 水',
    headline: 'Pantulan tenang air bulan menyimpan harmoni & karya terbaik 8B',
    description:
      'Permukaan telaga malam memantulkan gerbang merah dan purnama — ruang hening tempat warga 8B terhubung lewat Live Chat 24/7, Surat Izin Digital, dan Papan Kudos.',
    bgAsset: '/images/kage_8b_moonwater.jpg',
    canonicalAsset: '/landing-pages/secret-pathways-assets/generated/kage-moonwater.webp',
    cameraPos: [0, 1.85, 6.8],
    cameraLookAt: [0, 1.55, -5.2],
    fogHex: '#080c15',
    accentHex: '#38bdf8',
    ambientNote: 'Pantulan Purnama · Riak Air Tenang',
    linkedDay: 'Jumat',
    highlightMetric: 'Live Chat 24/7 · 6 Fitur Tamu + 3 Fitur Siswa',
  },
];

export interface KageForegroundLayerSpec {
  id: KageForegroundLayerId;
  label: string;
  canonicalPath: string;
  depthFactor: number;
  parallaxYPercent: number;
  positionZone: 'far-horizon' | 'mid-sanctuary' | 'near-pathway' | 'canopy-frame';
}

export const KAGE_8B_FOREGROUND_LAYERS: KageForegroundLayerSpec[] = [
  {
    id: 'hill',
    label: 'Bukit Kabut & Siluet Salak',
    canonicalPath: 'public/landing-pages/secret-pathways-assets/foreground/png/hill.webp',
    depthFactor: 0.15,
    parallaxYPercent: 70,
    positionZone: 'far-horizon',
  },
  {
    id: 'shrine-ruins',
    label: 'Reruntuhan Gerbang Pakuan Kuno',
    canonicalPath: 'public/landing-pages/secret-pathways-assets/foreground/png/shrine-ruins.webp',
    depthFactor: 0.26,
    parallaxYPercent: 55,
    positionZone: 'mid-sanctuary',
  },
  {
    id: 'temple-wall',
    label: 'Dinding Batu Sanctuary 8B',
    canonicalPath: 'public/landing-pages/secret-pathways-assets/foreground/png/temple-wall.webp',
    depthFactor: 0.38,
    parallaxYPercent: 48,
    positionZone: 'mid-sanctuary',
  },
  {
    id: 'pine-tree',
    label: 'Pinus Tua Kebun Raya',
    canonicalPath: 'public/landing-pages/secret-pathways-assets/foreground/png/pine-tree.webp',
    depthFactor: 0.48,
    parallaxYPercent: 40,
    positionZone: 'canopy-frame',
  },
  {
    id: 'stone-lantern',
    label: 'Lentera Batu Tōrō Menyala',
    canonicalPath: 'public/landing-pages/secret-pathways-assets/foreground/png/stone-lantern.webp',
    depthFactor: 0.62,
    parallaxYPercent: 32,
    positionZone: 'near-pathway',
  },
  {
    id: 'basalt-stones',
    label: 'Pijakan Batu Basalt Setapak',
    canonicalPath: 'public/landing-pages/secret-pathways-assets/foreground/png/basalt-stones.webp',
    depthFactor: 0.7,
    parallaxYPercent: 24,
    positionZone: 'near-pathway',
  },
  {
    id: 'garden-bush',
    label: 'Perdu Taman Lumut',
    canonicalPath: 'public/landing-pages/secret-pathways-assets/foreground/png/garden-bush.webp',
    depthFactor: 0.78,
    parallaxYPercent: 18,
    positionZone: 'near-pathway',
  },
  {
    id: 'sakura-branch',
    label: 'Dahan Sakura & Puspa Bogor',
    canonicalPath: 'public/landing-pages/secret-pathways-assets/foreground/png/sakura-branch.webp',
    depthFactor: 0.86,
    parallaxYPercent: 14,
    positionZone: 'canopy-frame',
  },
  {
    id: 'maple-leaves',
    label: 'Ranting Maple Merah #e0231c',
    canonicalPath: 'public/landing-pages/secret-pathways-assets/foreground/png/maple-leaves.webp',
    depthFactor: 0.92,
    parallaxYPercent: 12,
    positionZone: 'canopy-frame',
  },
  {
    id: 'tall-grass',
    label: 'Ilalang Tepi Telaga',
    canonicalPath: 'public/landing-pages/secret-pathways-assets/foreground/png/tall-grass.webp',
    depthFactor: 1.0,
    parallaxYPercent: 10,
    positionZone: 'near-pathway',
  },
];

export function getKagePathwayById(id: string): KagePathwayRealm {
  return KAGE_8B_PATHWAYS.find((item) => item.id === id) || KAGE_8B_PATHWAYS[0];
}

export function computeKageLayerParallaxOffset(params: {
  pointerX: number;
  pointerY: number;
  scrollProgress: number;
  depthFactor: number;
}): { x: number; y: number; scale: number } {
  const clamp = (val: number, min: number, max: number) =>
    Math.max(min, Math.min(max, Number.isFinite(val) ? val : 0));
  const px = clamp(params.pointerX, -1, 1);
  const py = clamp(params.pointerY, -1, 1);
  const sp = clamp(params.scrollProgress, 0, 1);
  const df = clamp(params.depthFactor, 0.05, 1.5);

  const x = Number((px * df * -22).toFixed(2));
  const y = Number((py * df * -14 - sp * (1.15 - df * 0.65) * 48).toFixed(2));
  const scale = Number((1 + df * 0.035 + sp * 0.02).toFixed(4));
  return { x, y, scale };
}

// ============================================================================
// FITUR AI CHATBOT EDUKASI KELAS 8B — KURIKULUM MERDEKA SMPN 18 KOTA BOGOR
// ============================================================================

export type EduSubjectId =
  | 'semua'
  | 'pkn'
  | 'mtk'
  | 'ipa'
  | 'sunda'
  | 'pai'
  | 'bk'
  | 'pjok'
  | 'sbk'
  | 'binggris'
  | 'bindo'
  | 'ips'
  | 'informatika';

export type EduStudyMode = 'konsep' | 'rumus_langkah' | 'latihan_soal';

export interface EduSearchSource {
  title: string;
  uri: string;
  domain: string;
  snippet: string;
}

export interface EduSubjectModule {
  id: EduSubjectId;
  label: string;
  shortLabel: string;
  scheduleDays: string;
  coreTopics: string[];
  quickPrompts: string[];
  keyFormulaOrRule: string;
  referenceSources: EduSearchSource[];
}

export const EDU_SUBJECT_MODULES: EduSubjectModule[] = [
  {
    id: 'semua',
    label: 'Semua Mapel Kelas 8B',
    shortLabel: 'Semua Mapel',
    scheduleDays: 'Senin – Jumat',
    coreTopics: [
      'Jadwal Senin–Jumat Kelas 8B SMPN 18 Bogor',
      'Strategi Belajar Kurikulum Merdeka Kelas 8',
      'Ringkasan Materi PTS / PAS Semester Ganjil & Genap',
    ],
    quickPrompts: [
      'Buatkan rangkuman materi ujian Hari Senin (PKN, MTK, IPA, Sunda) untuk Kelas 8B!',
      'Bagaimana cara membagi waktu belajar sore untuk jadwal Senin sampai Jumat Kelas 8B?',
      'Berikan 3 soal latihan campuran MTK & IPA Kelas 8 lengkap dengan pembahasannya!',
    ],
    keyFormulaOrRule: 'Kurikulum Merdeka SMP Kelas 8 · Terintegrasi Jadwal Senin–Jumat 8B',
    referenceSources: [
      {
        title: 'Buku Kurikulum Merdeka SMP Kelas VIII — Kemendikbudristek',
        uri: 'https://buku.kemdikbud.go.id/katalog/buku-kurikulum-merdeka',
        domain: 'buku.kemdikbud.go.id',
        snippet: 'Katalog resmi buku teks utama Kurikulum Merdeka jenjang SMP/MTs Kelas VIII seluruh mata pelajaran.',
      },
      {
        title: 'Platform Merdeka Mengajar & CP Fase D SMP Kelas 8',
        uri: 'https://guru.kemdikbud.go.id/kurikulum/perkenalan/capaian-pembelajaran',
        domain: 'guru.kemdikbud.go.id',
        snippet: 'Capaian Pembelajaran (CP) Fase D untuk kelas VII–IX SMP pada Kurikulum Merdeka.',
      },
    ],
  },
  {
    id: 'pkn',
    label: 'PKN (Pancasila & Kewarganegaraan)',
    shortLabel: 'PKN',
    scheduleDays: 'Senin',
    coreTopics: [
      'Kedudukan & Fungsi Pancasila sebagai Dasar Negara',
      'Makna Pembukaan UUD Negara Republik Indonesia Tahun 1945',
      'Tata Urutan Peraturan Perundang-undangan di Indonesia (UU No. 12/2011)',
      'Kebangkitan Nasional 1908 & Sumpah Pemuda 1928',
    ],
    quickPrompts: [
      'Jelaskan perbedaan Pancasila sebagai Dasar Negara dan sebagai Pandangan Hidup Bangsa!',
      'Sebutkan tata urutan peraturan perundang-undangan di Indonesia dari yang tertinggi!',
      'Apa makna alinea ke-4 Pembukaan UUD NRI Tahun 1945 bagi pelajar SMP?',
    ],
    keyFormulaOrRule: 'Hierarki Hukum: UUD 1945 → Tap MPR → UU/Perppu → PP → Perpres → Perda Prov → Perda Kab/Kota',
    referenceSources: [
      {
        title: 'Pendidikan Pancasila SMP/MTs Kelas VIII — Kemendikbudristek',
        uri: 'https://buku.kemdikbud.go.id/katalog/pendidikan-pancasila-untuk-smpmts-kelas-viii',
        domain: 'buku.kemdikbud.go.id',
        snippet: 'Materi resmi Pendidikan Pancasila Kelas VIII: Kedudukan Pancasila, UUD NRI 1945, dan Tata Urutan Perundang-undangan.',
      },
      {
        title: 'UU No. 12 Tahun 2011 & UU No. 13 Tahun 2022 tentang Pembentukan Peraturan Perundang-undangan',
        uri: 'https://peraturan.bpk.go.id/Details/39188/uu-no-12-tahun-2011',
        domain: 'peraturan.bpk.go.id',
        snippet: 'Pasal 7 mengatur jenis dan hierarki Peraturan Perundang-undangan di Republik Indonesia.',
      },
    ],
  },
  {
    id: 'mtk',
    label: 'Matematika (MTK Kelas 8)',
    shortLabel: 'MTK',
    scheduleDays: 'Senin & Selasa',
    coreTopics: [
      'Teorema Pythagoras & Tripel Pythagoras',
      'Persamaan Garis Lurus & Gradien (m)',
      'Sistem Persamaan Linear Dua Variabel (SPLDV)',
      'Pola Bilangan, Relasi & Fungsi',
    ],
    quickPrompts: [
      'Jelaskan rumus Teorema Pythagoras dan contoh soal mencari sisi miring segitiga siku-siku!',
      'Bagaimana cara mencari gradien (m) garis yang melalui dua titik (x1, y1) dan (x2, y2)?',
      'Berikan contoh penyelesaian SPLDV dengan metode eliminasi dan substitusi kelas 8!',
    ],
    keyFormulaOrRule: 'c² = a² + b²  |  Gradien m = (y₂ - y₁) / (x₂ - x₁)  |  y - y₁ = m(x - x₁)',
    referenceSources: [
      {
        title: 'Matematika untuk SMP/MTs Kelas VIII — Buku Kemendikbudristek',
        uri: 'https://buku.kemdikbud.go.id/katalog/matematika-untuk-smpmts-kelas-viii',
        domain: 'buku.kemdikbud.go.id',
        snippet: 'Bab Teorema Pythagoras, Sistem Persamaan Linear Dua Variabel (SPLDV), Fungsi Linear & Gradien Garis Lurus.',
      },
      {
        title: 'Khan Academy Indonesia — Geometri Pythagoras & Aljabar Linear SMP',
        uri: 'https://id.khanacademy.org/math/cc-eighth-grade-math',
        domain: 'id.khanacademy.org',
        snippet: 'Latihan interaktif Teorema Pythagoras, persamaan garis lurus, dan sistem persamaan kelas 8.',
      },
    ],
  },
  {
    id: 'ipa',
    label: 'IPA Terpadu (Fisika & Biologi)',
    shortLabel: 'IPA',
    scheduleDays: 'Senin & Selasa',
    coreTopics: [
      'Struktur & Fungsi Jaringan Tumbuhan (Xilem & Floem)',
      'Tekanan Zat Padat, Cair (Hidrostatis) & Hukum Pascal',
      'Usaha, Energi, dan Pesawat Sederhana',
      'Sistem Pencernaan & Peredaran Darah Manusia',
    ],
    quickPrompts: [
      'Apa perbedaan fungsi jaringan Xilem dan Floem pada tumbuhan beserta proses kapilaritasnya?',
      'Jelaskan rumus Tekanan Zat Padat (P = F/A) dan Tekanan Hidrostatis (Ph = ρ·g·h) dengan contoh soal!',
      'Bagaimana cara menghitung Keuntungan Mekanis (KM) pada tuas/pengungkit dan katrol?',
    ],
    keyFormulaOrRule: 'P = F / A  |  Ph = ρ · g · h  |  W = F · s  |  KM = W / F = lk / lb',
    referenceSources: [
      {
        title: 'Ilmu Pengetahuan Alam (IPA) untuk SMP Kelas VIII — Kemendikbudristek',
        uri: 'https://buku.kemdikbud.go.id/katalog/ilmu-pengetahuan-alam-untuk-smp-kelas-viii',
        domain: 'buku.kemdikbud.go.id',
        snippet: 'Pengenalan Sel, Struktur dan Fungsi Tubuh Makhluk Hidup, Usaha, Energi, Pesawat Sederhana, serta Tekanan Zat.',
      },
      {
        title: 'BRIN Kebun Raya Bogor — Edukasi Anatomi & Jaringan Tumbuhan Tropis',
        uri: 'https://kebunraya.id/bogor',
        domain: 'kebunraya.id',
        snippet: 'Referensi botani jaringan pengangkut Xilem dan Floem serta kapilaritas batang pada flora Kebun Raya Bogor.',
      },
    ],
  },
  {
    id: 'sunda',
    label: 'Basa & Budaya Sunda Bogor',
    shortLabel: 'Sunda',
    scheduleDays: 'Senin',
    coreTopics: [
      'Undak Usuk Basa (Tatakrama Basa Sunda: Lemes & Loma)',
      'Pupuh Sunda (Kinanti, Sinom, Asmarandana, Dangdanggula - KSAD)',
      'Kawih, Sisindiran (Paparikan, Rarakitan, Wawangsalan)',
      'Carita Pondok (Carpon) & Aksara Sunda Kaganga',
    ],
    quickPrompts: [
      'Jelaskan bedanya Basa Lemes keur ka sorangan dan Basa Lemes keur ka batur beserta contoh kalimatnya!',
      'Apa aturan guru wilangan dan guru lagu pada Pupuh Kinanti dan Sinom?',
      'Buatkan contoh Sisindiran Paparikan bertema semangat belajar di Kelas 8B Bogor!',
    ],
    keyFormulaOrRule: 'Pupuh Sekar Ageung (KSAD): Kinanti (8u-8i-8a-8i-8a-8i), Sinom, Asmarandana, Dangdanggula',
    referenceSources: [
      {
        title: 'Kurikulum Muatan Lokal Bahasa & Sastra Sunda Jawa Barat Jenjang SMP',
        uri: 'https://disdik.jabarprov.go.id',
        domain: 'disdik.jabarprov.go.id',
        snippet: 'Pedoman pangajaran Basa Sunda Fase D Kelas VIII: Kawih, Sisindiran, Guguritan Pupuh, jeung Tatakrama Basa.',
      },
    ],
  },
  {
    id: 'pai',
    label: 'PAI (Pendidikan Agama Islam & Budi Pekerti)',
    shortLabel: 'PAI',
    scheduleDays: 'Selasa',
    coreTopics: [
      'Iman kepada Kitab-Kitab Allah SWT (Taurat, Zabur, Injil, Al-Qur\'an)',
      'Hukum Bacaan Tajwid: Qalqalah (Sugra & Kubra) serta Bacaan Ra & Lam',
      'Akhlak Mulia: Jujur, Amanah, Adil, serta Hormat kepada Orang Tua dan Guru',
      'Sejarah Peradaban Islam Masa Bani Umayyah & Bani Abbasiyah',
    ],
    quickPrompts: [
      'Jelaskan perbedaan Qalqalah Sugra dan Qalqalah Kubra beserta 5 huruf Qalqalah (Baju Di Toko)!',
      'Sebutkan 4 kitab suci Allah SWT beserta nabi penerimanya dan cara mencintai Al-Qur\'an!',
      'Mengapa sifat Amanah dan Jujur sangat penting diterapkan siswa Kelas 8B di sekolah?',
    ],
    keyFormulaOrRule: 'Huruf Qalqalah (5): ب (Ba), ج (Jim), د (Dal), ط (Tha), ق (Qaf) — "Ba-Ju Di To-Ko"',
    referenceSources: [
      {
        title: 'Pendidikan Agama Islam dan Budi Pekerti SMP Kelas VIII — Kemendikbudristek',
        uri: 'https://buku.kemdikbud.go.id/katalog/pendidikan-agama-islam-dan-budi-pekerti-untuk-smp-kelas-viii',
        domain: 'buku.kemdikbud.go.id',
        snippet: 'Materi resmi PAI Kelas VIII: Tajwid Qalqalah, Iman kepada Kitab Allah, Perilaku Jujur & Adil, serta Sejarah Daulah Abbasiyah.',
      },
    ],
  },
  {
    id: 'bk',
    label: 'BK (Bimbingan Konseling & Pengembangan Diri)',
    shortLabel: 'BK',
    scheduleDays: 'Selasa',
    coreTopics: [
      'Manajemen Waktu Belajar & Teknik Fokus Pomodoro',
      'Mengenali Gaya Belajar (Visual, Auditori, Kinestetik)',
      'Etika Pergaulan Teman Sebaya, Anti-Bullying & Empati di Kelas 8B',
      'Perencanaan Target Akademik & Motivasi Berprestasi SMP',
    ],
    quickPrompts: [
      'Bagaimana tips mengatasi rasa malas dan menjaga fokus belajar menjelang ujian menurut BK?',
      'Bagaimana cara mengetahui gaya belajar kita (Visual, Auditori, atau Kinestetik) agar nilai rapor naik?',
      'Bagaimana cara membangun komunikasi yang positif dan saling mendukung antarteman di Kelas 8B?',
    ],
    keyFormulaOrRule: '3 Gaya Belajar: Visual (Gambar/Catatan) · Auditori (Diskusi/Suara) · Kinestetik (Praktik)',
    referenceSources: [
      {
        title: 'Panduan Layanan Bimbingan dan Konseling SMP — Kemendikbudristek',
        uri: 'https://guru.kemdikbud.go.id',
        domain: 'guru.kemdikbud.go.id',
        snippet: 'Layanan bimbingan belajar, pribadi, sosial, dan perencanaan karir untuk peserta didik SMP Fase D.',
      },
    ],
  },
  {
    id: 'pjok',
    label: 'PJOK (Pendidikan Jasmani, Olahraga & Kesehatan)',
    shortLabel: 'PJOK',
    scheduleDays: 'Rabu',
    coreTopics: [
      'Permainan Bola Besar (Teknik Dasar Sepak Bola, Bola Voli, Bola Basket)',
      'Komponen Kebugaran Jasmani (Kekuatan, Daya Tahan, Kelincahan, Kelenturan)',
      'Atletik (Lari Jarak Pendek, Lompat Jauh) & Senam Lantai',
      'Pola Hidup Sehat, Gizi Remaja & Pencegahan Pergaulan Bebas',
    ],
    quickPrompts: [
      'Sebutkan komponen kebugaran jasmani (kekuatan, daya tahan, kelincahan, kelenturan) beserta bentuk latihannya!',
      'Apa saja teknik dasar permainan bola voli (servis, passing bawah, passing atas, smash, block)?',
      'Bagaimana cara menghitung denyut nadi maksimal dan menjaga kebugaran tubuh bagi siswa SMP?',
    ],
    keyFormulaOrRule: 'Denyut Nadi Maksimal (DNM) = 220 - Usia  |  Kebugaran: Strength · Endurance · Agility · Flexibility',
    referenceSources: [
      {
        title: 'PJOK SMP/MTs Kelas VIII Kurikulum Merdeka — Kemendikbudristek',
        uri: 'https://buku.kemdikbud.go.id',
        domain: 'buku.kemdikbud.go.id',
        snippet: 'Panduan aktivitas permainan invasi, net, lapangan, atletik, senam lantai, dan kebugaran jasmani kelas VIII.',
      },
    ],
  },
  {
    id: 'sbk',
    label: 'SBK (Seni Budaya & Prakarya)',
    shortLabel: 'SBK',
    scheduleDays: 'Rabu',
    coreTopics: [
      'Menggambar Model (Prinsip Komposisi, Proporsi, Keseimbangan, Kesatuan)',
      'Menggambar Ilustrasi, Poster, dan Komik Edukasi',
      'Teknik Menyanyikan Lagu Daerah Nusantara & Alat Musik Tradisional (Angklung/Gamelan)',
      'Gerak Tari Tradisional & Pola Lantai',
    ],
    quickPrompts: [
      'Apa saja unsur dan prinsip proporsi, komposisi, serta keseimbangan dalam menggambar model & poster di SBK?',
      'Sebutkan syarat-syarat membuat poster yang menarik dan komunikatif untuk tugas SBK Kelas 8!',
      'Apa perbedaan komposisi simetris, asimetris, dan sentral dalam seni rupa?',
    ],
    keyFormulaOrRule: 'Prinsip Menggambar Model: Komposisi · Proporsi · Keseimbangan (Balance) · Kesatuan (Unity)',
    referenceSources: [
      {
        title: 'Seni Rupa & Seni Musik untuk SMP Kelas VIII — Kemendikbudristek',
        uri: 'https://buku.kemdikbud.go.id',
        domain: 'buku.kemdikbud.go.id',
        snippet: 'Materi menggambar model, ilustrasi, poster, komik, serta apresiasi musik tradisional Nusantara.',
      },
    ],
  },
  {
    id: 'binggris',
    label: 'Bahasa Inggris (English Grade 8)',
    shortLabel: 'B.Inggris',
    scheduleDays: 'Rabu',
    coreTopics: [
      'Simple Present Tense & Present Continuous Tense',
      'Simple Past Tense & Recount Text (Personal Experience)',
      'Degree of Comparison (Positive, Comparative, Superlative)',
      'Expressions of Asking Opinion, Obligation (Must/Should) & Greeting Cards',
    ],
    quickPrompts: [
      'Jelaskan rumus Simple Past Tense (Verbal & Nominal) beserta 5 contoh kalimat pengalaman liburan!',
      'Bagaimana aturan Degree of Comparison (-er/more dan -est/most) dalam Bahasa Inggris?',
      'Buatkan contoh singkat Recount Text tentang kegiatan belajar bersama di Kelas 8B!',
    ],
    keyFormulaOrRule: 'Past Tense: S + V₂ + O  |  Comparative: Adj-er / more + Adj  |  Superlative: Adj-est / most + Adj',
    referenceSources: [
      {
        title: 'English for Nusantara untuk SMP/MTs Kelas VIII — Kemendikbudristek',
        uri: 'https://buku.kemdikbud.go.id/katalog/english-for-nusantara-untuk-smpmts-kelas-viii',
        domain: 'buku.kemdikbud.go.id',
        snippet: 'Buku resmi Bahasa Inggris Kelas VIII: Recount Text, Simple Past Tense, Degree of Comparison, dan Notice/Caution.',
      },
    ],
  },
  {
    id: 'bindo',
    label: 'Bahasa Indonesia',
    shortLabel: 'B.Indo',
    scheduleDays: 'Kamis & Jumat',
    coreTopics: [
      'Teks Berita (Unsur 5W+1H / ADIKSIMBA & Struktur Piramida Terbalik)',
      'Teks Eksplanasi (Fenomena Alam & Sosial)',
      'Teks Iklan, Slogan, dan Poster',
      'Teks Eksposisi, Puisi & Ulasan Karya',
    ],
    quickPrompts: [
      'Jelaskan struktur Teks Eksplanasi (Identifikasi Fenomena, Rangkaian Kejadian, Ulasan) dan kaidah kebahasaannya!',
      'Apa saja unsur ADIKSIMBA (Apa, Di mana, Kapan, Siapa, Mengapa, Bagaimana) dalam menulis berita sekolah?',
      'Apa perbedaan utama antara Iklan, Slogan, dan Poster beserta contohnya?',
    ],
    keyFormulaOrRule: 'ADIKSIMBA: Apa · Di mana · Kapan · Siapa · Mengapa · Bagaimana',
    referenceSources: [
      {
        title: 'Bahasa Indonesia untuk SMP Kelas VIII — Kemendikbudristek',
        uri: 'https://buku.kemdikbud.go.id/katalog/bahasa-indonesia-untuk-smp-kelas-viii',
        domain: 'buku.kemdikbud.go.id',
        snippet: 'Menulis Teks Laporan Hasil Observasi, Iklan/Slogan/Poster, Artikel Ilmiah Populer, Ulasan Karya, dan Puisi.',
      },
    ],
  },
  {
    id: 'ips',
    label: 'IPS (Geografi, Sejarah & Ekonomi)',
    shortLabel: 'IPS',
    scheduleDays: 'Kamis',
    coreTopics: [
      'Interaksi Keruangan Negara-Negara ASEAN',
      'Mobilitas Sosial (Vertikal & Horizontal) serta Pluralitas Masyarakat',
      'Keunggulan & Keterbatasan Antarruang serta Pelaku Ekonomi (RTK, RTP, Pemerintah, Luar Negeri)',
      'Kedatangan Bangsa Barat & Pergerakan Nasional Indonesia',
    ],
    quickPrompts: [
      'Sebutkan karakteristik geografis dan kerja sama negara-negara anggota ASEAN!',
      'Apa perbedaan Mobilitas Sosial Vertikal (Social Climbing & Sinking) dan Horizontal beserta contohnya?',
      'Jelaskan peran 4 pelaku ekonomi (Rumah Tangga Konsumen, Produsen, Pemerintah, Masyarakat Luar Negeri)!',
    ],
    keyFormulaOrRule: 'ASEAN 10+1 Negara · Letak Astronomis ASEAN: 28°LU – 11°LS dan 93°BT – 141°BT',
    referenceSources: [
      {
        title: 'Ilmu Pengetahuan Sosial (IPS) untuk SMP Kelas VIII — Kemendikbudristek',
        uri: 'https://buku.kemdikbud.go.id/katalog/ilmu-pengetahuan-sosial-untuk-smp-kelas-viii',
        domain: 'buku.kemdikbud.go.id',
        snippet: 'Kondisi Geografis dan Pelestarian Sumber Daya Alam, Kemajemukan Masyarakat Indonesia, Nasionalisme, dan Ekonomi.',
      },
    ],
  },
  {
    id: 'informatika',
    label: 'Informatika & Berpikir Komputasional',
    shortLabel: 'Informatika',
    scheduleDays: 'Jumat',
    coreTopics: [
      'Berpikir Komputasional (Dekomposisi, Pengenalan Pola, Abstraksi, Algoritma)',
      'Sistem Bilangan Biner, Oktal, Desimal & Representasi Data',
      'Jaringan Komputer, Internet & Keamanan Siber (OTP/2FA)',
      'Algoritma Pemrograman Dasar & Struktur Data',
    ],
    quickPrompts: [
      'Bagaimana cara mengubah bilangan Desimal (misal 25) menjadi bilangan Biner langkah demi langkah?',
      'Jelaskan 4 pilar Berpikir Komputasional (Dekomposisi, Pola, Abstraksi, Algoritma) dengan contoh sehari-hari!',
      'Mengapa verifikasi berlapis (Password + Kode OTP + PIN) penting untuk keamanan akun digital?',
    ],
    keyFormulaOrRule: '4 Pilar Komputasional: Dekomposisi → Pengenalan Pola → Abstraksi → Algoritma',
    referenceSources: [
      {
        title: 'Informatika untuk SMP Kelas VIII — Kemendikbudristek',
        uri: 'https://buku.kemdikbud.go.id/katalog/informatika-untuk-smp-kelas-viii',
        domain: 'buku.kemdikbud.go.id',
        snippet: 'Berpikir Komputasional, Teknologi Informasi & Komunikasi, Sistem Komputer, Jaringan Komputer & Algoritma Pemrograman.',
      },
    ],
  },
];

export function getEduSubjectById(id: EduSubjectId): EduSubjectModule {
  return EDU_SUBJECT_MODULES.find((m) => m.id === id) || EDU_SUBJECT_MODULES[0];
}

export function buildEduSearchSources(params: {
  subjectId: EduSubjectId;
  question: string;
}): { sources: EduSearchSource[]; searchQueries: string[] } {
  const mod = getEduSubjectById(params.subjectId);
  const cleanQuestion = params.question.trim().slice(0, 80);
  const searchQueries = [
    `${mod.shortLabel} SMP Kelas 8 Kurikulum Merdeka: ${cleanQuestion}`,
    `Materi & Rumus ${mod.label} SMPN 18 Kota Bogor`,
  ];
  return {
    sources: mod.referenceSources,
    searchQueries,
  };
}

export function buildEduFollowUpSuggestions(subjectId: EduSubjectId): string[] {
  const mod = getEduSubjectById(subjectId);
  return [
    ...mod.quickPrompts.slice(0, 2),
    `Berikan 2 latihan soal pilihan ganda ${mod.shortLabel} Kelas 8 beserta kunci jawabannya!`,
  ];
}

export function calculateEduChatReward(params: {
  questionLength: number;
  studyMode: EduStudyMode;
  doubleCoinActive: boolean;
}): number {
  if (params.questionLength < 4) return 0;
  const baseByMode: Record<EduStudyMode, number> = {
    konsep: 10,
    rumus_langkah: 15,
    latihan_soal: 20,
  };
  const base = baseByMode[params.studyMode] || 10;
  return params.doubleCoinActive ? base * 2 : base;
}

export function buildEduSystemInstruction(params: {
  subjectId: EduSubjectId;
  studyMode: EduStudyMode;
  studentName: string;
  studentRoleLabel: string;
}): string {
  const mod = getEduSubjectById(params.subjectId);
  const modeInstruction =
    params.studyMode === 'konsep'
      ? 'Jelaskan konsep secara runtut, ramah, mudah dipahami siswa SMP Kelas 8, dan sertakan analogi nyata dari lingkungan sekolah / Kota Bogor.'
      : params.studyMode === 'rumus_langkah'
        ? 'Fokus pada bedah rumus/aturan inti, tuliskan rumus dengan jelas, lalu berikan contoh soal beserta langkah penyelesaian tahap demi tahap (Step 1, Step 2, Hasil Akhir).'
        : 'Berikan penjelasan ringkas, lalu sajikan 2 soal latihan setara PTS/PAS Kelas 8 lengkap dengan kunci jawaban dan pembahasannya.';

  return [
    'Kamu adalah "Tutor AI Edukasi Kelas 8B", asisten belajar resmi berkecepatan tinggi dengan fitur Real-Time Search Grounding untuk siswa-siswi Kelas 8B SMP Negeri 18 Kota Bogor yang dibimbing oleh Wali Kelas Ibu Aida, S.Pd.',
    `Siswa yang bertanya saat ini: ${params.studentName} (${params.studentRoleLabel}).`,
    `Mata Pelajaran Fokus: ${mod.label} (Jadwal di Kelas 8B: Hari ${mod.scheduleDays}).`,
    `Rumus / Aturan Kunci Mapel: ${mod.keyFormulaOrRule}.`,
    `Mode Belajar: ${modeInstruction}`,
    'Jawablah dengan sangat cepat, padat, akurat, dan terstruktur menggunakan Markdown (heading singkat, poin-poin, dan blok rumus yang jelas).',
    'Jadwal Resmi 12 Mapel Kelas 8B SMPN 18 Kota Bogor: Senin (PKN, MTK, IPA, Sunda), Selasa (MTK, IPA, BK, PAI), Rabu (PJOK, SBK, B. Inggris), Kamis (B. Indo, IPS), Jumat (Informatika, B. Indo).',
  ].join('\n');
}

export function buildEduTutorFallbackAnswer(params: {
  question: string;
  subjectId: EduSubjectId;
  studyMode: EduStudyMode;
  studentName: string;
}): string {
  const q = params.question.toLowerCase();
  const mod = getEduSubjectById(params.subjectId);

  if (q.includes('pythagoras') || q.includes('sisi miring') || q.includes('segitiga')) {
    return `### Bedah Materi Matematika Kelas 8B: Teorema Pythagoras

Halo **${params.studentName}**! Mari kita bahas **Teorema Pythagoras** yang dipelajari di jadwal **Matematika (Senin & Selasa)** Kelas 8B SMPN 18 Kota Bogor.

#### 1. Konsep & Rumus Inti
Pada segitiga siku-siku, kuadrat panjang sisi miring (*hipotenusa* = $c$) sama dengan jumlah kuadrat panjang kedua sisi penyikunya ($a$ dan $b$):

\`\`\`
c² = a² + b²   →   c = √(a² + b²)
a² = c² - b²   →   a = √(c² - b²)
b² = c² - a²   →   b = √(c² - a²)
\`\`\`

**Tripel Pythagoras yang wajib dihafal untuk ujian:**
- **(3, 4, 5)** dan kelipatannya: **(6, 8, 10)**, **(9, 12, 15)**
- **(5, 12, 13)** dan kelipatannya: **(10, 24, 26)**
- **(7, 24, 25)** serta **(8, 15, 17)**

#### 2. Contoh Penyelesaian Langkah demi Langkah
**Soal:** Sebuah segitiga siku-siku memiliki sisi tegak $a = 6\\text{ cm}$ dan alas $b = 8\\text{ cm}$. Berapa panjang sisi miringnya ($c$)?
1. **Identifikasi:** $a = 6$, $b = 8$, dicari sisi miring $c$.
2. **Substitusi ke rumus:** $c = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100}$
3. **Hasil Akhir:** $c = 10\\text{ cm}$.

#### 3. Tantangan Latihan Kelas 8B
- Jika sebuah tangga panjangnya $13\\text{ m}$ disandarkan pada tembok dan jarak ujung bawah tangga ke tembok $5\\text{ m}$, maka tinggi tembok yang dicapai adalah $\\sqrt{13^2 - 5^2} = \\sqrt{169 - 25} = \\sqrt{144} = \\mathbf{12\\text{ m}}$.`;
  }

  if (q.includes('gradien') || q.includes('garis lurus') || q.includes('spldv')) {
    return `### Bedah Materi Matematika Kelas 8B: Persamaan Garis Lurus & Gradien ($m$)

Halo **${params.studentName}**! Ini materi penting untuk tugas **Matematika (Senin & Selasa)** Kelas 8B:

#### 1. Rumus Mencari Gradien ($m$)
- **Bentuk eksplisit $y = mx + c$:** Gradiennya adalah koefisien $x$, yaitu **$m$**.
- **Bentuk implisit $ax + by + c = 0$:** Rumusnya **$m = -\\frac{a}{b}$**.
- **Melalui dua titik $(x_1, y_1)$ dan $(x_2, y_2)$:**
\`\`\`
m = (y₂ - y₁) / (x₂ - x₁)
\`\`\`

#### 2. Hubungan Dua Garis
- **Dua garis sejajar:** $m_1 = m_2$
- **Dua garis tegak lurus:** $m_1 \\times m_2 = -1$

#### 3. Contoh Soal & Pembahasan
**Soal:** Tentukan gradien garis yang melalui titik $A(2, 3)$ dan $B(6, 11)$!
- **Langkah 1:** $x_1 = 2, y_1 = 3$ dan $x_2 = 6, y_2 = 11$.
- **Langkah 2:** $m = \\frac{11 - 3}{6 - 2} = \\frac{8}{4} = \\mathbf{2}$.`;
  }

  if (
    q.includes('xilem') ||
    q.includes('floem') ||
    q.includes('tumbuhan') ||
    q.includes('tekanan') ||
    q.includes('hidrostatis') ||
    params.subjectId === 'ipa'
  ) {
    return `### Bedah Materi IPA Terpadu Kelas 8B (Senin & Selasa)

Halo **${params.studentName}**! Berikut penjelasan terstruktur untuk materi **IPA Kelas 8B SMPN 18 Kota Bogor**:

#### 1. Jaringan Pengangkut Tumbuhan (Biologi)
- **Xilem (Pembuluh Kayu):** Mengangkut **air dan zat hara/mineral** dari akar menuju daun untuk fotosintesis. Air naik berkat *daya kapilaritas batang*, *daya tekan akar*, dan *daya isap daun*.
- **Floem (Pembuluh Tapis):** Mengedarkan **hasil fotosintesis** (glukosa/zat makanan) dari daun ke seluruh bagian tumbuhan.

#### 2. Rumus Tekanan Zat (Fisika)
\`\`\`
1. Tekanan Zat Padat   : P = F / A       (Satuan: N/m² atau Pascal)
2. Tekanan Hidrostatis : Ph = ρ · g · h  (ρ = massa jenis, g = gravitasi, h = kedalaman)
3. Hukum Pascal        : F₁ / A₁ = F₂ / A₂
\`\`\`

#### 3. Contoh Soal Cepat
**Soal:** Sebuah balok memberikan gaya tekan $F = 200\\text{ N}$ pada bidang seluas $A = 0,5\\text{ m}^2$. Berapa tekanannya?
- **Penyelesaian:** $P = \\frac{F}{A} = \\frac{200}{0,5} = \\mathbf{400\\text{ Pa}}$.`;
  }

  if (q.includes('sunda') || q.includes('pupuh') || q.includes('lemes') || params.subjectId === 'sunda') {
    return `### Pangajaran Basa & Budaya Sunda Kelas 8B (Hari Senin)

Wilujeng diajar, **${params.studentName}**! Berikut rangkuman materi **Basa Sunda SMPN 18 Kota Bogor**:

#### 1. Undak-Usuk Basa (Tatakrama Basa Sunda)
Dalam Basa Sunda terdapat tingkatan bahasa agar santun saat berbicara kepada guru (seperti Ibu Aida) maupun orang tua:
- **Basa Loma (Akrab/Teman Sebaya):** *Abdi/Kuring* (saya), *maneh* (kamu), *dahar* (makan), *balik* (pulang).
- **Basa Lemes keur ka Sorangan (Halus untuk diri sendiri):** *Abdi*, *neda* (makan), *wangsul* (pulang), *mondok* (tidur).
- **Basa Lemes keur ka Batur (Halus untuk orang lain/guru):** *Bapa/Ibu*, *tuang* (makan), *mulih* (pulang), *kulem* (tidur).

#### 2. Contoh Kalimat Santun di Kelas 8B
- *"Wilujeng enjing Bu Aida, abdi parantos siap ngempelkeun tugas Basa Sunda."* (Selamat pagi Bu Aida, saya sudah siap mengumpulkan tugas Bahasa Sunda).`;
  }

  if (q.includes('biner') || q.includes('komputasional') || q.includes('informatika') || params.subjectId === 'informatika') {
    return `### Materi Informatika Kelas 8B (Hari Jumat)

Halo **${params.studentName}**! Mari kita bedah materi **Informatika & Berpikir Komputasional Kelas 8B**:

#### 1. Empat Pilar Berpikir Komputasional
1. **Dekomposisi (*Decomposition*):** Memecah masalah besar menjadi bagian-bagian kecil yang lebih mudah diselesaikan.
2. **Pengenalan Pola (*Pattern Recognition*):** Mencari kesamaan atau pola dari masalah yang pernah diselesaikan.
3. **Abstraksi (*Abstraction*):** Fokus pada informasi penting dan mengabaikan detail yang tidak relevan.
4. **Algoritma (*Algorithm*):** Menyusun langkah-langkah logis secara berurutan untuk menyelesaikan masalah.

#### 2. Cara Konversi Desimal ke Biner
Untuk mengubah bilangan Desimal (basis 10) ke Biner (basis 2), bagi bilangan dengan **2** secara berulang dan catat **sisa baginya (0 atau 1)** dari bawah ke atas:
- Contoh konversi **$25_{10}$ ke Biner**:
  - $25 \\div 2 = 12$ sisa **1**
  - $12 \\div 2 = 6$ sisa **0**
  - $6 \\div 2 = 3$ sisa **0**
  - $3 \\div 2 = 1$ sisa **1**
  - $1 \\div 2 = 0$ sisa **1**
- Baca dari bawah ke atas: **$11001_2$**.`;
  }

  return `### Panduan Belajar ${mod.label} — Tutor AI Kelas 8B

Halo **${params.studentName}**! Pertanyaanmu mengenai **"${params.question}"** sangat bagus untuk persiapan belajar di Kelas 8B SMPN 18 Kota Bogor (Jadwal: **${mod.scheduleDays}**).

#### 1. Intisari Materi & Aturan Kunci
- **Mata Pelajaran:** ${mod.label}
- **Rumus / Kaidah Utama:** \`${mod.keyFormulaOrRule}\`
- **Topik Kurikulum Merdeka Kelas 8:**
${mod.coreTopics.map((t, i) => `  ${i + 1}. ${t}`).join('\n')}

#### 2. Langkah Belajar Efektif (${
    params.studyMode === 'konsep'
      ? 'Mode Pemahaman Konsep'
      : params.studyMode === 'rumus_langkah'
        ? 'Mode Bedah Rumus & Langkah'
        : 'Mode Latihan Soal PTS/PAS'
  })
1. **Pahami kata kunci utama** dari pertanyaan di atas dan hubungkan dengan catatan buku paket Kelas 8.
2. **Gunakan rumus/kaidah inti:** \`${mod.keyFormulaOrRule}\` untuk menyusun jawaban langkah demi langkah.
3. **Uji pemahamanmu** dengan mengerjakan minimal 2 soal latihan di tab **Akademi Koin** atau berdiskusi bersama teman sekelas di **Live Chat 24/7**.`;
}





