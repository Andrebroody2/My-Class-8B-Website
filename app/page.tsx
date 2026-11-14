'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, MotionConfig } from 'motion/react';
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Bot,
} from 'lucide-react';
import {
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  limit,
  doc,
  setDoc,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  testFirestoreConnection,
  handleFirestoreError,
  OperationType,
} from '@/lib/firebase';
import {
  ClassRole,
  ROLE_METADATA,
  CLASS_STORE_ITEMS,
  OWNER_TEACHER_45_FEATURES,
  purchaseStoreItem,
  generateVerificationCode,
  buildCsvContent,
} from '@/lib/class8b-logic';
import { VisitorLandingView, VisitorReviewItem } from '@/components/VisitorLandingView';
import { LoginVerificationModal } from '@/components/LoginVerificationModal';
import {
  ClassDashboardView,
  AssignmentItem,
  AnnouncementItem,
  AttendanceItem,
  TreasuryItem,
  UpdateLogItem,
} from '@/components/ClassDashboardView';
import {
  LiveChatAndDmView,
  GroupChatMessage,
  DirectMessageItem,
} from '@/components/LiveChatAndDmView';
import { AcademyAndStoreView } from '@/components/AcademyAndStoreView';
import { OwnerTeacher45Panel } from '@/components/OwnerTeacher45Panel';
import { RuangPlusView, KudosEntry, AspirationItem } from '@/components/RuangPlusView';
import { AiEduChatbotView } from '@/components/AiEduChatbotView';
import { InteractiveClickFX } from '@/components/ui/interactive-click-fx';

type LoggedInTab = 'dashboard' | 'aichat' | 'chat' | 'akademi' | 'ruangplus' | 'toko' | 'panel45';
type VisitorSection = 'beranda' | 'profil' | 'struktur' | 'ulasan';

interface ClassSession {
  username: string;
  displayName: string;
  role: ClassRole;
  verifiedBy: string;
  coins: number;
  equippedBanner: string;
  equippedTitle: string;
  unlockedItems: string[];
}

const STORAGE_KEYS = {
  session: 'kelas8b_strict_auth_v4',
  legacySession: 'kelas8b_session',
  reviews: 'kelas8b_reviews',
  assignments: 'kelas8b_assignments',
  announcements: 'kelas8b_announcements',
  attendance: 'kelas8b_attendance',
  treasury: 'kelas8b_treasury',
  groupMessages: 'kelas8b_group_messages',
  directMessages: 'kelas8b_direct_messages',
  updateLogs: 'kelas8b_update_logs',
  customCodes: 'kelas8b_custom_codes',
  officerNames: 'kelas8b_officer_names',
  kudos: 'kelas8b_kudos',
  aspirations: 'kelas8b_aspirations',
  featureStates: 'kelas8b_feature_states',
} as const;

const INITIAL_REVIEWS: VisitorReviewItem[] = [
  {
    id: 'rev-1',
    visitorName: 'Ibu Hj. Kartika, M.Pd.',
    relation: 'Tamu Sekolah',
    message:
      'Website Kelas 8B SMPN 18 Kota Bogor sangat rapi, modern, dan membantu siswa mengatur jadwal tugas serta transparansi kas kelas.',
    rating: 5,
    createdAtLabel: '13 Nov 2026',
  },
  {
    id: 'rev-2',
    visitorName: 'Bapak Hendra Wijaya',
    relation: 'Orang Tua Siswa',
    message:
      'Sistem keamanan login dengan Kode Verifikasi dari Bu Aida membuat kami tenang karena ruang diskusi kelas benar-benar terjaga khusus untuk anak-anak 8B.',
    rating: 5,
    createdAtLabel: '13 Nov 2026',
  },
  {
    id: 'rev-3',
    visitorName: 'Raka Pratama (Kelas 9A)',
    relation: 'Teman Kelas Lain',
    message:
      'Desain banner di toko koinnya keren banget! Kuis Kurikulum Merdeka kelas 8-nya juga seru buat latihan ujian.',
    rating: 5,
    createdAtLabel: '14 Nov 2026',
  },
];

const INITIAL_ASSIGNMENTS: AssignmentItem[] = [
  {
    id: 'asg-1',
    subject: 'Matematika',
    title: 'Latihan Bab 4: Persamaan Garis Lurus & Gradien',
    description:
      'Kerjakan soal latihan halaman 148 nomor 1 sampai 8 di buku latihan Matematika. Tulis langkah penyelesaian secara lengkap.',
    dueDate: 'Senin, 16 Nov 2026',
    pointsReward: 40,
    status: 'aktif',
    authorName: 'Sekretaris 1 (8B)',
  },
  {
    id: 'asg-2',
    subject: 'IPA (Sains)',
    title: 'Laporan Pengamatan Struktur Jaringan Tumbuhan (Xilem & Floem)',
    description:
      'Susun ringkasan hasil pengamatan penampang batang dan daun beserta tabel fungsi jaringan pengangkut.',
    dueDate: 'Rabu, 18 Nov 2026',
    pointsReward: 45,
    status: 'aktif',
    authorName: 'Ibu Aida (Wali Kelas 8B)',
  },
  {
    id: 'asg-3',
    subject: 'Bahasa Indonesia',
    title: 'Menyusun Teks Eksplanasi Fenomena Hujan di Kota Bogor',
    description:
      'Buat teks eksplanasi 3 paragraf (Identifikasi Fenomena, Rangkaian Kejadian, dan Ulasan) tentang curah hujan di Kota Hujan Bogor.',
    dueDate: 'Jumat, 20 Nov 2026',
    pointsReward: 35,
    status: 'aktif',
    authorName: 'Sekretaris 2 (8B)',
  },
];

const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: 'Arahan Wali Kelas: Persiapan Penilaian Akhir Semester Ganjil 8B',
    content:
      'Selamat datang di Portal Resmi Kelas 8B SMPN 18 Kota Bogor! Pastikan seluruh tugas mingguan diselesaikan tepat waktu dan manfaatkan fitur Kuis, Flashcard & Timer Pomodoro untuk latihan mandiri.',
    category: 'Wali Kelas (Bu Aida)',
    authorName: 'Ibu Aida',
    authorRole: 'Wali Kelas 8B',
    pinned: true,
    createdAtLabel: 'Hari Ini · 07:00 WIB',
  },
  {
    id: 'ann-2',
    title: 'Transparansi Iuran Kas Mingguan & Perlengkapan Kelas 8B',
    content:
      'Bendahara 1 dan Bendahara 2 telah memperbarui catatan saldo kas kelas. Dana minggu ini digunakan untuk pengadaan spidol papan tulis dan penghapus baru.',
    category: 'Kas & Bendahara',
    authorName: 'Bendahara 1 & 2',
    authorRole: 'Bendahara Kelas 8B',
    pinned: false,
    createdAtLabel: 'Kemarin · 14:20 WIB',
  },
];

const INITIAL_ATTENDANCE: AttendanceItem[] = [
  {
    id: 'att-1',
    studentName: 'Perwakilan Pengurus Ketua Kelas 8B',
    date: '2026-11-13',
    status: 'hadir',
    note: 'Hadir tepat waktu pukul 06:40 WIB',
    recordedBy: 'Sekretaris 1',
  },
  {
    id: 'att-2',
    studentName: 'Perwakilan Sekretaris & Bendahara 8B',
    date: '2026-11-13',
    status: 'hadir',
    note: 'Piket pagi & menyiapkan jurnal kelas',
    recordedBy: 'Ibu Aida',
  },
];

const INITIAL_TREASURY: TreasuryItem[] = [
  {
    id: 'kas-1',
    description: 'Saldo Kas Awal Semester Ganjil Kelas 8B',
    type: 'pemasukan',
    amount: 450000,
    recordedBy: 'Bendahara 1',
    dateLabel: '02 Nov 2026',
  },
  {
    id: 'kas-2',
    description: 'Iuran Kas Mingguan Kolektif Kelas 8B',
    type: 'pemasukan',
    amount: 160000,
    recordedBy: 'Bendahara 2',
    dateLabel: '10 Nov 2026',
  },
  {
    id: 'kas-3',
    description: 'Pembelian 6 Spidol Boardmarker, Tinta Isi Ulang & Taplak Meja Guru',
    type: 'pengeluaran',
    amount: 85000,
    recordedBy: 'Bendahara 1',
    dateLabel: '12 Nov 2026',
  },
];

const INITIAL_GROUP_MESSAGES: GroupChatMessage[] = [
  {
    id: 'gmsg-1',
    senderUsername: 'buaida',
    senderName: 'Ibu Aida (Wali Kelas 8B)',
    senderRole: 'teacher',
    senderBanner: 'banner_royal_archon',
    senderTitle: 'title_kehormatan',
    text: 'Assalamualaikum anak-anak Kelas 8B SMPN 18 Kota Bogor! Ruang Live Chat 24/7 ini sudah aktif. Gunakan untuk berdiskusi PR dan saling membantu ya.',
    timeLabel: '07:15 WIB',
  },
  {
    id: 'gmsg-2',
    senderUsername: 'owner8b',
    senderName: 'Owner Web Kelas 8B',
    senderRole: 'owner',
    senderBanner: 'banner_bogor_emerald',
    senderTitle: 'title_arsitek',
    text: 'Halo teman-teman 8B! Jangan lupa kumpulkan Koin dari menu Akademi & Timer Pomodoro supaya bisa beli Banner dan Gelar keren di Toko Eksklusif 8B.',
    timeLabel: '07:18 WIB',
  },
  {
    id: 'gmsg-3',
    senderUsername: 'ketua8b',
    senderName: 'Ketua Kelas 8B',
    senderRole: 'ketua_kelas',
    senderBanner: 'banner_celestial_astrolabe',
    senderTitle: 'title_cendekiawan',
    text: 'Siap Bu Aida dan Owner! Untuk teman-teman yang piket besok pagi, datang lebih awal ya.',
    timeLabel: '07:22 WIB',
  },
];

const INITIAL_DIRECT_MESSAGES: DirectMessageItem[] = [
  {
    id: 'dm-1',
    senderUsername: 'buaida',
    senderName: 'Ibu Aida (Wali Kelas 8B)',
    recipientUsername: 'owner8b',
    recipientName: 'Owner Web Kelas 8B',
    text: 'Terima kasih sudah membangun portal Kelas 8B SMPN 18 Kota Bogor dengan 45 fitur lengkap untuk kelas kita.',
    timeLabel: '07:10 WIB',
  },
  {
    id: 'dm-2',
    senderUsername: 'sekretaris1',
    senderName: 'Sekretaris 1 (8B)',
    recipientUsername: 'buaida',
    recipientName: 'Ibu Aida (Wali Kelas 8B)',
    text: 'Selamat pagi Bu Aida, rekap presensi dan daftar tugas minggu ini sudah saya perbarui di Dashboard.',
    timeLabel: '07:25 WIB',
  },
];

const INITIAL_UPDATE_LOGS: UpdateLogItem[] = [
  {
    id: 'upd-1',
    version: 'v3.0.0',
    title: 'Landing Page Panorama Bogor, 3 Fitur Ruang Plus & Navigasi Android',
    notes:
      'Menambahkan Timer Fokus Pomodoro, Papan Apresiasi Kudos 8B, Surat Izin Digital ke Ibu Aida & Kotak Aspirasi, serta sinkronisasi penyimpanan penuh dan ekspor CSV/JSON.',
    author: 'Owner Web & Bu Aida',
    dateLabel: '14 Nov 2026',
  },
];

const INITIAL_KUDOS: KudosEntry[] = [
  {
    id: 'kudos-1',
    senderName: 'Ibu Aida (Wali Kelas 8B)',
    recipientName: 'Pengurus Inti & Regu Piket 8B',
    categoryId: 'piket',
    note: 'Terima kasih sudah menjaga kebersihan ruang kelas 8B dan merapikan papan tulis sebelum jam pelajaran pertama.',
    timeLabel: 'Hari Ini · 07:30 WIB',
  },
  {
    id: 'kudos-2',
    senderName: 'Ketua Kelas 8B',
    recipientName: 'Sekretaris 1 & Bendahara 1',
    categoryId: 'inspirator',
    note: 'Catatan tugas Matematika dan laporan kas mingguan selalu akurat dan tepat waktu!',
    timeLabel: 'Kemarin · 15:10 WIB',
  },
];

const INITIAL_ASPIRATIONS: AspirationItem[] = [
  {
    id: 'asp-1',
    authorLabel: 'Warga Kelas 8B',
    topic: 'Kelompok Belajar & PR',
    message:
      'Bagaimana kalau setiap hari Kamis sepulang sekolah diadakan sesi belajar bareng Matematika Bab Garis Lurus di perpustakaan?',
    timeLabel: 'Hari Ini',
  },
];

const DEFAULT_OFFICER_NAMES: Record<string, string> = {
  owner: 'Owner Web Kelas 8B',
  teacher: 'Ibu Aida, S.Pd.',
  ketua_kelas: 'Ketua Kelas 8B (Aktif)',
  wakil_ketua: 'Wakil Ketua 8B (Aktif)',
  bendahara_1: 'Bendahara 1 Kelas 8B',
  bendahara_2: 'Bendahara 2 Kelas 8B',
  sekretaris_1: 'Sekretaris 1 Kelas 8B',
  sekretaris_2: 'Sekretaris 2 Kelas 8B',
  siswa: 'Seluruh Siswa-Siswi Kelas 8B',
};

function safePersist(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota or privacy mode errors
  }
}

function triggerFileDownload(filename: string, content: string, mimeType: string) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch {
    // ignore in restricted headless environments
  }
}

export default function Kelas8BPortalPage() {
  // Session State (null = Visitor Split Mode, non-null = Verified Classmate Mode)
  const [session, setSession] = useState<ClassSession | null>(null);
  const [visitorSection, setVisitorSection] = useState<VisitorSection>('beranda');
  const [activeTab, setActiveTab] = useState<LoggedInTab>('dashboard');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [preselectedLoginRole, setPreselectedLoginRole] = useState<ClassRole>('siswa');
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  // Data States
  const [reviews, setReviews] = useState<VisitorReviewItem[]>(INITIAL_REVIEWS);
  const [assignments, setAssignments] = useState<AssignmentItem[]>(INITIAL_ASSIGNMENTS);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(INITIAL_ANNOUNCEMENTS);
  const [attendance, setAttendance] = useState<AttendanceItem[]>(INITIAL_ATTENDANCE);
  const [treasury, setTreasury] = useState<TreasuryItem[]>(INITIAL_TREASURY);
  const [groupMessages, setGroupMessages] = useState<GroupChatMessage[]>(INITIAL_GROUP_MESSAGES);
  const [directMessages, setDirectMessages] =
    useState<DirectMessageItem[]>(INITIAL_DIRECT_MESSAGES);
  const [updateLogs, setUpdateLogs] = useState<UpdateLogItem[]>(INITIAL_UPDATE_LOGS);
  const [kudosList, setKudosList] = useState<KudosEntry[]>(INITIAL_KUDOS);
  const [aspirations, setAspirations] = useState<AspirationItem[]>(INITIAL_ASPIRATIONS);
  const [customCodes, setCustomCodes] = useState<string[]>(['KELAS8B-HEBAT']);
  const [officerNames, setOfficerNames] = useState<Record<string, string>>(DEFAULT_OFFICER_NAMES);

  // 45 Features State
  const [featureStates, setFeatureStates] = useState<Record<number, boolean>>(() => {
    const map: Record<number, boolean> = {};
    OWNER_TEACHER_45_FEATURES.forEach((f) => {
      if (f.actionType === 'toggle') {
        map[f.id] = Boolean(f.defaultEnabled);
      }
    });
    return map;
  });
  const [lastPanelStatus, setLastPanelStatus] = useState('');

  // BroadcastChannel for zero-delay 24/7 live sync across tabs
  const channelRef = useRef<BroadcastChannel | null>(null);
  // Touch swipe tracking
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    testFirestoreConnection();

    queueMicrotask(() => {
      try {
        localStorage.removeItem(STORAGE_KEYS.legacySession);
        const readJson = <T,>(k: string): T | null => {
          const raw = localStorage.getItem(k);
          return raw ? (JSON.parse(raw) as T) : null;
        };

        const savedSession = readJson<ClassSession>(STORAGE_KEYS.session);
        if (savedSession) setSession(savedSession);

        const savedReviews = readJson<VisitorReviewItem[]>(STORAGE_KEYS.reviews);
        if (savedReviews) setReviews(savedReviews);

        const savedAssignments = readJson<AssignmentItem[]>(STORAGE_KEYS.assignments);
        if (savedAssignments) setAssignments(savedAssignments);

        const savedAnnouncements = readJson<AnnouncementItem[]>(STORAGE_KEYS.announcements);
        if (savedAnnouncements) setAnnouncements(savedAnnouncements);

        const savedAttendance = readJson<AttendanceItem[]>(STORAGE_KEYS.attendance);
        if (savedAttendance) setAttendance(savedAttendance);

        const savedTreasury = readJson<TreasuryItem[]>(STORAGE_KEYS.treasury);
        if (savedTreasury) setTreasury(savedTreasury);

        const savedGroup = readJson<GroupChatMessage[]>(STORAGE_KEYS.groupMessages);
        if (savedGroup) setGroupMessages(savedGroup);

        const savedDms = readJson<DirectMessageItem[]>(STORAGE_KEYS.directMessages);
        if (savedDms) setDirectMessages(savedDms);

        const savedUpdates = readJson<UpdateLogItem[]>(STORAGE_KEYS.updateLogs);
        if (savedUpdates) setUpdateLogs(savedUpdates);

        const savedCodes = readJson<string[]>(STORAGE_KEYS.customCodes);
        if (savedCodes) setCustomCodes(savedCodes);

        const savedOfficers = readJson<Record<string, string>>(STORAGE_KEYS.officerNames);
        if (savedOfficers) setOfficerNames(savedOfficers);

        const savedKudos = readJson<KudosEntry[]>(STORAGE_KEYS.kudos);
        if (savedKudos) setKudosList(savedKudos);

        const savedAsp = readJson<AspirationItem[]>(STORAGE_KEYS.aspirations);
        if (savedAsp) setAspirations(savedAsp);

        const savedFeatures = readJson<Record<number, boolean>>(STORAGE_KEYS.featureStates);
        if (savedFeatures) setFeatureStates((prev) => ({ ...prev, ...savedFeatures }));
      } catch {
        // ignore storage errors
      }
    });

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const bc = new BroadcastChannel('smpn18_kelas8b_live_sync');
      bc.onmessage = (ev) => {
        if (ev.data?.type === 'GROUP_MSG') {
          setGroupMessages((prev) => {
            if (prev.some((m) => m.id === ev.data.payload.id)) return prev;
            return [...prev, ev.data.payload];
          });
        } else if (ev.data?.type === 'DM_MSG') {
          setDirectMessages((prev) => {
            if (prev.some((m) => m.id === ev.data.payload.id)) return prev;
            return [ev.data.payload, ...prev];
          });
        } else if (ev.data?.type === 'KUDOS_ADD') {
          setKudosList((prev) => {
            if (prev.some((k) => k.id === ev.data.payload.id)) return prev;
            return [ev.data.payload, ...prev];
          });
        } else if (ev.data?.type === 'ASPIRATION_ADD') {
          setAspirations((prev) => {
            if (prev.some((a) => a.id === ev.data.payload.id)) return prev;
            return [ev.data.payload, ...prev];
          });
        }
      };
      channelRef.current = bc;
      return () => bc.close();
    }
  }, []);

  // Firebase Auth & Firestore real-time listeners when authenticated with Firebase
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && session) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [session, activeTab]);

  useEffect(() => {
    if (!firebaseUser) return;
    const reviewsPath = 'reviews';
    const qReviews = query(collection(db, reviewsPath), orderBy('createdAt', 'desc'), limit(20));
    const unsubReviews = onSnapshot(
      qReviews,
      (snap) => {
        if (!snap.empty) {
          const remoteReviews: VisitorReviewItem[] = snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              visitorName: String(data.visitorName || 'Pengunjung'),
              relation: String(data.relation || 'Tamu'),
              message: String(data.message || ''),
              rating: Number(data.rating || 5),
              createdAtLabel: 'Tersinkronisasi Cloud',
            };
          });
          setReviews((prev) => {
            const combined = [...remoteReviews, ...prev];
            const seen = new Set<string>();
            return combined.filter((item) => {
              if (seen.has(item.id)) return false;
              seen.add(item.id);
              return true;
            });
          });
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, reviewsPath);
      }
    );

    const groupPath = 'groupMessages';
    const qGroup = query(collection(db, groupPath), orderBy('createdAt', 'asc'), limit(50));
    const unsubGroup = onSnapshot(
      qGroup,
      (snap) => {
        if (!snap.empty) {
          const remoteMsgs: GroupChatMessage[] = snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              senderUsername: String(data.senderName || 'siswa').toLowerCase(),
              senderName: String(data.senderName || 'Siswa 8B'),
              senderRole: (data.senderRole as ClassRole) || 'siswa',
              senderBanner: String(data.senderBanner || 'banner_default'),
              senderTitle: String(data.senderTitle || 'title_default'),
              text: String(data.text || ''),
              timeLabel: 'Live Cloud',
            };
          });
          setGroupMessages((prev) => {
            const combined = [...prev, ...remoteMsgs];
            const seen = new Set<string>();
            return combined.filter((item) => {
              if (seen.has(item.id)) return false;
              seen.add(item.id);
              return true;
            });
          });
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, groupPath);
      }
    );

    return () => {
      unsubReviews();
      unsubGroup();
    };
  }, [firebaseUser]);

  const persistSession = (next: ClassSession | null) => {
    setSession(next);
    try {
      localStorage.removeItem(STORAGE_KEYS.legacySession);
      if (next) {
        localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(next));
      } else {
        localStorage.removeItem(STORAGE_KEYS.session);
      }
    } catch {
      // ignore
    }
  };

  const navigateVisitorSection = (sec: VisitorSection) => {
    setVisitorSection(sec);
    if (typeof document !== 'undefined') {
      if (sec === 'beranda') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(sec);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSuccessLogin = (loginData: {
    username: string;
    displayName: string;
    role: ClassRole;
    verifiedBy: string;
  }) => {
    const isPowerRole = loginData.role === 'owner' || loginData.role === 'teacher';
    const newSession: ClassSession = {
      username: loginData.username,
      displayName: loginData.displayName,
      role: loginData.role,
      verifiedBy: loginData.verifiedBy,
      coins: isPowerRole ? 650 : 220,
      equippedBanner: isPowerRole ? 'banner_royal_archon' : 'banner_default',
      equippedTitle: isPowerRole ? 'title_kehormatan' : 'title_default',
      unlockedItems: isPowerRole
        ? CLASS_STORE_ITEMS.map((i) => i.id)
        : ['banner_default', 'title_default'],
    };
    persistSession(newSession);
    setIsLoginModalOpen(false);
    setActiveTab('dashboard');
  };

  const handleGoogleSignIn = async (): Promise<{ ok: boolean; message?: string }> => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const user = cred.user;
      const isOwnerEmail = user.email === 'blackjacknet034@gmail.com';
      const roleAssigned: ClassRole = isOwnerEmail ? 'owner' : 'siswa';
      const userDocPath = 'users';
      try {
        await setDoc(doc(db, userDocPath, user.uid), {
          uid: user.uid,
          username: (user.email?.split('@')[0] || 'siswa8b').slice(0, 50),
          displayName: (user.displayName || 'Warga Kelas 8B').slice(0, 80),
          role: roleAssigned,
          coins: isOwnerEmail ? 800 : 250,
          equippedBanner: isOwnerEmail ? 'banner_royal_archon' : 'banner_default',
          equippedTitle: isOwnerEmail ? 'title_kehormatan' : 'title_default',
          verifiedBy: 'Google Cloud & Bu Aida',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, userDocPath);
      }

      handleSuccessLogin({
        username: user.email?.split('@')[0] || 'siswa8b',
        displayName: user.displayName || 'Warga Kelas 8B',
        role: roleAssigned,
        verifiedBy: 'Google Cloud & Bu Aida',
      });
      return { ok: true };
    } catch (err: unknown) {
      const code =
        typeof err === 'object' && err !== null && 'code' in err
          ? String((err as { code?: unknown }).code)
          : '';
      if (
        code === 'auth/popup-closed-by-user' ||
        code === 'auth/cancelled-popup-request'
      ) {
        return {
          ok: false,
          message:
            'Jendela login Google ditutup. Silakan gunakan Username, Kata Sandi, dan Kode Verifikasi Kelas 8B di atas.',
        };
      }
      return {
        ok: false,
        message:
          'Sinkronisasi Google belum selesai. Silakan masuk menggunakan Username dan Kode Verifikasi Kelas 8B.',
      };
    }
  };

  const handleAddVisitorReview = async (rev: {
    visitorName: string;
    relation: string;
    message: string;
    rating: number;
  }) => {
    const newItem: VisitorReviewItem = {
      id: `rev-${Date.now()}`,
      visitorName: rev.visitorName,
      relation: rev.relation,
      message: rev.message,
      rating: rev.rating,
      createdAtLabel: 'Baru Saja',
    };
    const next = [newItem, ...reviews];
    setReviews(next);
    safePersist(STORAGE_KEYS.reviews, next);

    if (firebaseUser) {
      const path = 'reviews';
      try {
        await addDoc(collection(db, path), {
          authorId: firebaseUser.uid,
          visitorName: rev.visitorName.slice(0, 60),
          relation: rev.relation.slice(0, 40),
          message: rev.message.slice(0, 500),
          rating: rev.rating,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
    }
  };

  const handleSendGroupMessage = async (text: string) => {
    if (!session) return;
    const now = new Date();
    const timeLabel = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')} WIB`;
    const newMsg: GroupChatMessage = {
      id: `gmsg-${Date.now()}`,
      senderUsername: session.username,
      senderName: session.displayName,
      senderRole: session.role,
      senderBanner: session.equippedBanner,
      senderTitle: session.equippedTitle,
      text: text.slice(0, 1000),
      timeLabel,
    };
    const updated = [...groupMessages, newMsg];
    setGroupMessages(updated);
    channelRef.current?.postMessage({ type: 'GROUP_MSG', payload: newMsg });
    safePersist(STORAGE_KEYS.groupMessages, updated);

    if (firebaseUser) {
      const path = 'groupMessages';
      try {
        await addDoc(collection(db, path), {
          senderId: firebaseUser.uid,
          senderName: session.displayName.slice(0, 80),
          senderRole: session.role,
          senderBanner: session.equippedBanner,
          senderTitle: session.equippedTitle,
          text: text.slice(0, 1000),
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
    }
  };

  const handleDeleteGroupMessage = (id: string) => {
    const updated = groupMessages.filter((m) => m.id !== id);
    setGroupMessages(updated);
    safePersist(STORAGE_KEYS.groupMessages, updated);
  };

  const handleSendDirectMessage = (
    recipientUsername: string,
    recipientName: string,
    text: string
  ) => {
    if (!session) return;
    const now = new Date();
    const timeLabel = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')} WIB`;
    const newDm: DirectMessageItem = {
      id: `dm-${Date.now()}`,
      senderUsername: session.username,
      senderName: session.displayName,
      recipientUsername,
      recipientName,
      text: text.slice(0, 1000),
      timeLabel,
    };
    setDirectMessages((prev) => {
      const updated = [newDm, ...prev];
      safePersist(STORAGE_KEYS.directMessages, updated);
      return updated;
    });
    channelRef.current?.postMessage({ type: 'DM_MSG', payload: newDm });
  };

  const handleEarnCoins = (amount: number) => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = { ...prev, coins: prev.coins + amount };
      safePersist(STORAGE_KEYS.session, next);
      return next;
    });
  };

  const handlePurchaseStoreItem = (itemId: string): { success: boolean; error?: string } => {
    if (!session) return { success: false, error: 'Silakan login terlebih dahulu.' };
    const item = CLASS_STORE_ITEMS.find((i) => i.id === itemId);
    if (!item) return { success: false, error: 'Item tidak ditemukan.' };

    const discountActive = Boolean(featureStates[39]);
    const effectiveCost = discountActive ? Math.floor(item.price * 0.5) : item.price;

    if (discountActive) {
      if (session.unlockedItems.includes(itemId)) {
        return { success: false, error: 'Item sudah dimiliki.' };
      }
      if (session.coins < effectiveCost) {
        return {
          success: false,
          error: `Koin belum cukup. Butuh ${effectiveCost - session.coins} Koin lagi.`,
        };
      }
      persistSession({
        ...session,
        coins: session.coins - effectiveCost,
        unlockedItems: [...session.unlockedItems, itemId],
      });
      return { success: true };
    }

    const res = purchaseStoreItem({
      currentCoins: session.coins,
      unlockedItems: session.unlockedItems,
      itemId,
    });
    if (res.success) {
      persistSession({
        ...session,
        coins: res.newCoins,
        unlockedItems: res.newUnlocked,
      });
    }
    return { success: res.success, error: res.error };
  };

  const handleToggle45Feature = (featureId: number) => {
    const feat = OWNER_TEACHER_45_FEATURES.find((f) => f.id === featureId);
    const nextVal = !featureStates[featureId];
    setFeatureStates((prev) => {
      const updated = { ...prev, [featureId]: nextVal };
      safePersist(STORAGE_KEYS.featureStates, updated);
      return updated;
    });
    if (feat) {
      setLastPanelStatus(
        `Modul #${feat.id} (${feat.title}) berhasil ${nextVal ? 'DIAKTIFKAN' : 'DINONAKTIFKAN'}.`
      );
    }
  };

  const handleExecute45Feature = (featureId: number) => {
    const feat = OWNER_TEACHER_45_FEATURES.find((f) => f.id === featureId);
    if (!feat || !session) return;

    switch (featureId) {
      case 1: {
        const prefix = session.role === 'teacher' ? 'BUAIDA' : 'OWNER';
        const newCode = generateVerificationCode(prefix);
        setCustomCodes((prev) => {
          const updated = [...prev, newCode];
          safePersist(STORAGE_KEYS.customCodes, updated);
          return updated;
        });
        setLastPanelStatus(`Kode Verifikasi baru berhasil diterbitkan: ${newCode}`);
        break;
      }
      case 7: {
        const auditSummary = `Audit Sistem Kelas 8B: ${assignments.length} tugas, ${attendance.length} catatan presensi, ${groupMessages.length} pesan chat, ${reviews.length} ulasan pengunjung.`;
        setAnnouncements((prev) => {
          const updated = [
            {
              id: `ann-${Date.now()}`,
              title: 'Catatan Audit Keamanan & Aktivitas Kelas 8B',
              content: auditSummary,
              category: 'Keamanan Sistem',
              authorName: session.displayName,
              authorRole: ROLE_METADATA[session.role].shortLabel,
              pinned: false,
              createdAtLabel: 'Baru Saja',
            },
            ...prev,
          ];
          safePersist(STORAGE_KEYS.announcements, updated);
          return updated;
        });
        setLastPanelStatus(auditSummary);
        break;
      }
      case 10: {
        const newAsg: AssignmentItem = {
          id: `asg-${Date.now()}`,
          subject: 'IPA (Sains)',
          title: 'Tugas Mandiri Kurikulum Merdeka: Tekanan Zat & Penerapannya',
          description:
            'Ringkas konsep Hukum Archimedes dan Hukum Pascal beserta contoh penerapannya dalam kehidupan sehari-hari.',
          dueDate: 'Minggu Depan',
          pointsReward: 50,
          status: 'aktif',
          authorName: session.displayName,
        };
        setAssignments((prev) => {
          const updated = [newAsg, ...prev];
          safePersist(STORAGE_KEYS.assignments, updated);
          return updated;
        });
        setLastPanelStatus('Tugas Cepat Kurikulum Merdeka Kelas 8 berhasil ditambahkan ke Dashboard.');
        break;
      }
      case 14: {
        setAssignments((prev) => {
          const updated = prev.filter((a) => a.status !== 'selesai');
          safePersist(STORAGE_KEYS.assignments, updated);
          return updated;
        });
        setLastPanelStatus('Tugas yang sudah selesai berhasil dirapikan ke arsip.');
        break;
      }
      case 16: {
        setAnnouncements((prev) => {
          const updated = [
            {
              id: `ann-${Date.now()}`,
              title: 'Rangkuman & Kisi-Kisi Materi Belajar Kelas 8B Minggu Ini',
              content:
                'Silakan pelajari Bab Persamaan Garis Lurus (Matematika), Sistem Pencernaan & Jaringan Tumbuhan (IPA), serta Mobilitas Sosial (IPS).',
              category: 'Wali Kelas (Bu Aida)',
              authorName: session.displayName,
              authorRole: ROLE_METADATA[session.role].shortLabel,
              pinned: true,
              createdAtLabel: 'Baru Saja',
            },
            ...prev,
          ];
          safePersist(STORAGE_KEYS.announcements, updated);
          return updated;
        });
        setLastPanelStatus('Kisi-kisi & materi belajar berhasil diterbitkan ke Pengumuman Kelas 8B.');
        break;
      }
      case 17: {
        const csv = buildCsvContent(
          ['ID', 'Mata Pelajaran', 'Judul Tugas', 'Tenggat', 'Poin Koin', 'Status', 'Pembuat'],
          assignments.map((a) => [
            a.id,
            a.subject,
            a.title,
            a.dueDate,
            a.pointsReward,
            a.status,
            a.authorName,
          ])
        );
        triggerFileDownload('tugas-kelas-8b.csv', csv, 'text/csv;charset=utf-8;');
        setLastPanelStatus(
          `Rekap ${assignments.length} daftar tugas Kelas 8B berhasil diekspor ke tugas-kelas-8b.csv.`
        );
        break;
      }
      case 18:
      case 38: {
        const bonus = featureId === 18 ? 50 : 100;
        persistSession({
          ...session,
          coins: session.coins + bonus,
        });
        setLastPanelStatus(`Saldo Koin berhasil ditambah +${bonus} Koin Apresiasi Kelas 8B!`);
        break;
      }
      case 20: {
        setAttendance((prev) => {
          const updated: AttendanceItem[] = [
            {
              id: `att-${Date.now()}`,
              studentName: 'Seluruh Siswa Hadir Serentak (Kelas 8B)',
              date: new Date().toISOString().slice(0, 10),
              status: 'hadir',
              note: 'Verifikasi Hadir Serentak oleh Panel Komando',
              recordedBy: session.displayName,
            },
            ...prev,
          ];
          safePersist(STORAGE_KEYS.attendance, updated);
          return updated;
        });
        setLastPanelStatus('Presensi Hadir Serentak Kelas 8B berhasil dicatat.');
        break;
      }
      case 25: {
        const totalKas = treasury.reduce(
          (acc, t) => (t.type === 'pemasukan' ? acc + t.amount : acc - t.amount),
          0
        );
        setAnnouncements((prev) => {
          const updated = [
            {
              id: `ann-${Date.now()}`,
              title: `Laporan Resmi Saldo Kas Kelas 8B: Rp ${totalKas.toLocaleString('id-ID')}`,
              content:
                'Laporan transparansi kas kelas telah diverifikasi oleh Bendahara 1, Bendahara 2, Ibu Aida, dan Owner Web.',
              category: 'Kas & Bendahara',
              authorName: session.displayName,
              authorRole: ROLE_METADATA[session.role].shortLabel,
              pinned: false,
              createdAtLabel: 'Baru Saja',
            },
            ...prev,
          ];
          safePersist(STORAGE_KEYS.announcements, updated);
          return updated;
        });
        setLastPanelStatus('Laporan Transparansi Kas Kelas berhasil dipublikasikan ke Pengumuman.');
        break;
      }
      case 26: {
        const csv = buildCsvContent(
          ['ID', 'Nama Siswa', 'Tanggal', 'Status', 'Catatan', 'Pencatat'],
          attendance.map((att) => [
            att.id,
            att.studentName,
            att.date,
            att.status,
            att.note,
            att.recordedBy,
          ])
        );
        triggerFileDownload('presensi-kelas-8b.csv', csv, 'text/csv;charset=utf-8;');
        setLastPanelStatus(
          `Rekap ${attendance.length} data presensi Kelas 8B berhasil diunduh ke presensi-kelas-8b.csv.`
        );
        break;
      }
      case 32: {
        handleSendGroupMessage(
          `[SIARAN RESMI ${ROLE_METADATA[session.role].shortLabel.toUpperCase()}]: Mohon perhatian seluruh warga Kelas 8B SMPN 18 Kota Bogor, cek papan pengumuman dan tugas terbaru hari ini.`
        );
        setLastPanelStatus('Siaran Broadcast berhasil dikirim ke Live Group Chat 24/7.');
        break;
      }
      case 34: {
        let removedCount = 0;
        const cleaned = groupMessages.filter((msg, idx, arr) => {
          if (idx > 0 && arr[idx - 1].text === msg.text && arr[idx - 1].senderUsername === msg.senderUsername) {
            removedCount += 1;
            return false;
          }
          return true;
        });
        setGroupMessages(cleaned);
        safePersist(STORAGE_KEYS.groupMessages, cleaned);
        setLastPanelStatus(
          removedCount > 0
            ? `${removedCount} pesan duplikat beruntun di Live Chat berhasil dibersihkan.`
            : 'Ruang Live Chat 24/7 sudah bersih dari pesan duplikat.'
        );
        break;
      }
      case 40: {
        persistSession({
          ...session,
          unlockedItems: CLASS_STORE_ITEMS.map((i) => i.id),
        });
        setLastPanelStatus(
          'Seluruh koleksi Banner & Gelar Kehormatan Toko 8B telah dibuka untuk akun Anda!'
        );
        break;
      }
      case 42: {
        setUpdateLogs((prev) => {
          const updated = [
            {
              id: `upd-${Date.now()}`,
              version: `v3.${prev.length}.0`,
              title: 'Pembaruan Sistem & Optimasi Fitur Kelas 8B',
              notes: `Dirilis langsung melalui Panel 45 Fitur oleh ${session.displayName}.`,
              author: session.displayName,
              dateLabel: 'Baru Saja',
            },
            ...prev,
          ];
          safePersist(STORAGE_KEYS.updateLogs, updated);
          return updated;
        });
        setLastPanelStatus('Catatan Update Website baru berhasil dipublikasikan.');
        break;
      }
      case 43: {
        safePersist(STORAGE_KEYS.assignments, assignments);
        safePersist(STORAGE_KEYS.announcements, announcements);
        safePersist(STORAGE_KEYS.attendance, attendance);
        safePersist(STORAGE_KEYS.treasury, treasury);
        safePersist(STORAGE_KEYS.kudos, kudosList);
        safePersist(STORAGE_KEYS.aspirations, aspirations);
        setLastPanelStatus('Sinkronisasi & validasi seluruh penyimpanan lokal Kelas 8B berhasil diperbarui.');
        break;
      }
      case 44: {
        const snapshot = JSON.stringify(
          {
            exportedAt: new Date().toISOString(),
            school: 'SMPN 18 Kota Bogor — Kelas 8B',
            assignments,
            announcements,
            attendance,
            treasury,
            kudosList,
            aspirations,
            reviews,
            updateLogs,
          },
          null,
          2
        );
        triggerFileDownload('backup-kelas-8b.json', snapshot, 'application/json');
        setLastPanelStatus('Cadangan data lengkap Kelas 8B berhasil diunduh ke backup-kelas-8b.json.');
        break;
      }
      default: {
        setLastPanelStatus(
          `Fitur #${feat.id} (${feat.title}) berhasil dijalankan oleh ${session.displayName}.`
        );
        break;
      }
    }
  };

  // Swipe gesture handlers for mobile/touch tab transitions
  const loggedInTabsOrder: LoggedInTab[] = [
    'dashboard',
    'aichat',
    'chat',
    'akademi',
    'ruangplus',
    'toko',
    'panel45',
  ];
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!featureStates[41]) return;
    touchStartXRef.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!featureStates[41] || touchStartXRef.current === null || !session) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(deltaX) < 75) return;
    const currentIndex = loggedInTabsOrder.indexOf(activeTab);
    if (deltaX < 0 && currentIndex < loggedInTabsOrder.length - 1) {
      setActiveTab(loggedInTabsOrder[currentIndex + 1]);
    } else if (deltaX > 0 && currentIndex > 0) {
      setActiveTab(loggedInTabsOrder[currentIndex - 1]);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="min-h-screen flex flex-col bg-[#F8FAFC]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <InteractiveClickFX />

        {/* Top Navigation Bar — Strictly 3 Zones */}
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
          <div className="mx-auto max-w-[1320px] flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-8 py-2.5 sm:py-3">
            {/* Zone 1: Single text element wordmark */}
            <motion.a
              href="#top"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.preventDefault();
                if (session) setActiveTab('dashboard');
                else navigateVisitorSection('beranda');
              }}
              className="text-sm sm:text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
            >
              Kelas 8B · SMPN 18 Bogor
            </motion.a>

            {/* Zone 2: Concise single-line text navigation links */}
            {session ? (
              <nav
                aria-label="Navigasi Utama Kelas 8B"
                className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600"
              >
                {(
                  [
                    { id: 'dashboard', label: 'Dashboard' },
                    { id: 'aichat', label: 'Tutor AI 8B' },
                    { id: 'chat', label: 'Live Chat' },
                    { id: 'akademi', label: 'Akademi Koin' },
                    { id: 'ruangplus', label: 'Ruang Plus' },
                    { id: 'toko', label: 'Toko 8B' },
                    { id: 'panel45', label: 'Panel 45' },
                  ] as const
                ).map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => setActiveTab(item.id)}
                      data-testid={`nav-tab-${item.id}`}
                      className={`relative py-1 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive ? 'text-slate-900 font-bold' : ''
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <motion.span
                          layoutId="memberNavUnderline"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-slate-900"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </nav>
            ) : (
              <nav
                aria-label="Navigasi Pengunjung Kelas 8B"
                className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
              >
                {(
                  [
                    { id: 'beranda', label: 'Beranda' },
                    { id: 'profil', label: 'Mode Akses' },
                    { id: 'struktur', label: 'Struktur 8B' },
                    { id: 'ulasan', label: 'Ulasan Pengunjung' },
                  ] as const
                ).map((item) => {
                  const isActive = visitorSection === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => navigateVisitorSection(item.id)}
                      className={`relative py-1 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive ? 'text-slate-900 font-bold' : ''
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <motion.span
                          layoutId="visitorNavUnderline"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-slate-900"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </nav>
            )}

            {/* Zone 3: 1 primary action */}
            <div className="flex items-center shrink-0">
              {session ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => persistSession(null)}
                  className="min-h-[40px] rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Keluar ({ROLE_METADATA[session.role].shortLabel})
                </motion.button>
              ) : (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    setPreselectedLoginRole('siswa');
                    setIsLoginModalOpen(true);
                  }}
                  data-testid="open-login-modal-btn"
                  className="min-h-[40px] rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Masuk Kelas 8B
                </motion.button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Viewport: Full-Bleed for Visitor Landing Hero, Centered Container for Logged-in Workspace */}
        <main
          className={
            session
              ? 'flex-1 mx-auto w-full max-w-[1320px] px-4 sm:px-8 pt-4 pb-24 md:pb-8'
              : 'flex-1 w-full'
          }
        >
          {!session ? (
            <VisitorLandingView
              activeSection={visitorSection}
              onNavigateSection={(sec) => navigateVisitorSection(sec)}
              onOpenLogin={(role) => {
                setPreselectedLoginRole(role || 'siswa');
                setIsLoginModalOpen(true);
              }}
              reviews={reviews}
              onAddReview={handleAddVisitorReview}
              officerNames={officerNames}
              announcementsCount={announcements.length}
              assignmentsCount={assignments.length}
              reviewFilterEnabled={Boolean(featureStates[6])}
            />
          ) : (
            <motion.div
              key={`member-${activeTab}`}
              initial={{ x: 10 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="pt-2"
            >
              {activeTab === 'dashboard' && (
                <ClassDashboardView
                  currentUser={session}
                  assignments={assignments}
                  onAddAssignment={(newAsg) => {
                    setAssignments((prev) => {
                      const updated: AssignmentItem[] = [
                        {
                          ...newAsg,
                          id: `asg-${Date.now()}`,
                          status: 'aktif',
                          authorName: session.displayName,
                        },
                        ...prev,
                      ];
                      safePersist(STORAGE_KEYS.assignments, updated);
                      return updated;
                    });
                  }}
                  onCompleteAssignment={(id) => {
                    const target = assignments.find((a) => a.id === id);
                    if (!target || target.status === 'selesai') return;
                    setAssignments((prev) => {
                      const updated = prev.map((a) =>
                        a.id === id ? { ...a, status: 'selesai' as const } : a
                      );
                      safePersist(STORAGE_KEYS.assignments, updated);
                      return updated;
                    });
                    handleEarnCoins(target.pointsReward);
                  }}
                  announcements={announcements}
                  onAddAnnouncement={(newAnn) => {
                    setAnnouncements((prev) => {
                      const updated: AnnouncementItem[] = [
                        {
                          ...newAnn,
                          id: `ann-${Date.now()}`,
                          authorName: session.displayName,
                          authorRole: ROLE_METADATA[session.role].shortLabel,
                          createdAtLabel: 'Baru Saja',
                        },
                        ...prev,
                      ];
                      safePersist(STORAGE_KEYS.announcements, updated);
                      return updated;
                    });
                  }}
                  attendance={attendance}
                  onAddAttendance={(newAtt) => {
                    setAttendance((prev) => {
                      const updated: AttendanceItem[] = [
                        {
                          ...newAtt,
                          id: `att-${Date.now()}`,
                          recordedBy: session.displayName,
                        },
                        ...prev,
                      ];
                      safePersist(STORAGE_KEYS.attendance, updated);
                      return updated;
                    });
                  }}
                  treasury={treasury}
                  onAddTreasury={(newKas) => {
                    setTreasury((prev) => {
                      const updated: TreasuryItem[] = [
                        {
                          ...newKas,
                          id: `kas-${Date.now()}`,
                          recordedBy: session.displayName,
                          dateLabel: 'Hari Ini',
                        },
                        ...prev,
                      ];
                      safePersist(STORAGE_KEYS.treasury, updated);
                      return updated;
                    });
                  }}
                  updateLogs={updateLogs}
                  examModeActive={Boolean(featureStates[12])}
                  piketScheduleActive={Boolean(featureStates[24])}
                  onOpenAiTutor={() => setActiveTab('aichat')}
                />
              )}

              {activeTab === 'aichat' && (
                <AiEduChatbotView
                  currentUser={session}
                  doubleCoinActive={Boolean(featureStates[37])}
                  onEarnCoins={(amt) => handleEarnCoins(amt)}
                  onShareToGroupChat={handleSendGroupMessage}
                />
              )}

              {activeTab === 'chat' && (
                <LiveChatAndDmView
                  currentUser={session}
                  groupMessages={groupMessages}
                  onSendGroupMessage={handleSendGroupMessage}
                  onDeleteGroupMessage={handleDeleteGroupMessage}
                  directMessages={directMessages}
                  onSendDirectMessage={handleSendDirectMessage}
                  quietClassHoursActive={Boolean(featureStates[33])}
                />
              )}

              {(activeTab === 'akademi' || activeTab === 'toko') && (
                <AcademyAndStoreView
                  key={activeTab}
                  initialMode={activeTab === 'toko' ? 'toko' : 'akademi'}
                  coins={session.coins}
                  unlockedItems={session.unlockedItems}
                  equippedBanner={session.equippedBanner}
                  equippedTitle={session.equippedTitle}
                  doubleCoinActive={Boolean(featureStates[37])}
                  storeDiscountActive={Boolean(featureStates[39])}
                  onEarnCoins={(amt) => handleEarnCoins(amt)}
                  onPurchaseItem={handlePurchaseStoreItem}
                  onEquipBanner={(bannerId) =>
                    persistSession({ ...session, equippedBanner: bannerId })
                  }
                  onEquipTitle={(titleId) =>
                    persistSession({ ...session, equippedTitle: titleId })
                  }
                />
              )}

              {activeTab === 'ruangplus' && (
                <RuangPlusView
                  currentUser={session}
                  doubleCoinActive={Boolean(featureStates[37])}
                  onEarnCoins={(amt) => handleEarnCoins(amt)}
                  kudosList={kudosList}
                  onSendKudos={(entry) => {
                    const nextItem: KudosEntry = {
                      ...entry,
                      id: `kudos-${Date.now()}`,
                      timeLabel: 'Baru Saja',
                    };
                    setKudosList((prev) => {
                      const updated = [nextItem, ...prev];
                      safePersist(STORAGE_KEYS.kudos, updated);
                      return updated;
                    });
                    channelRef.current?.postMessage({ type: 'KUDOS_ADD', payload: nextItem });
                  }}
                  aspirations={aspirations}
                  onAddAspiration={(item) => {
                    const nextAsp: AspirationItem = {
                      ...item,
                      id: `asp-${Date.now()}`,
                      timeLabel: 'Baru Saja',
                    };
                    setAspirations((prev) => {
                      const updated = [nextAsp, ...prev];
                      safePersist(STORAGE_KEYS.aspirations, updated);
                      return updated;
                    });
                    channelRef.current?.postMessage({
                      type: 'ASPIRATION_ADD',
                      payload: nextAsp,
                    });
                  }}
                  onSubmitSuratIzin={({ studentName, reasonType, detailReason, letterText }) => {
                    const mappedStatus = reasonType === 'Sakit' ? 'sakit' : 'izin';
                    setAttendance((prev) => {
                      const updated: AttendanceItem[] = [
                        {
                          id: `att-${Date.now()}`,
                          studentName,
                          date: new Date().toISOString().slice(0, 10),
                          status: mappedStatus,
                          note: `${reasonType}: ${detailReason}`,
                          recordedBy: session.displayName,
                        },
                        ...prev,
                      ];
                      safePersist(STORAGE_KEYS.attendance, updated);
                      return updated;
                    });
                    handleSendDirectMessage('buaida', 'Ibu Aida (Wali Kelas 8B)', letterText);
                  }}
                  onBroadcastToGroupChat={handleSendGroupMessage}
                />
              )}

              {activeTab === 'panel45' && (
                <OwnerTeacher45Panel
                  currentUserRole={session.role}
                  currentUserName={session.displayName}
                  featureStates={featureStates}
                  onToggleFeature={handleToggle45Feature}
                  onExecuteFeature={handleExecute45Feature}
                  customCodes={customCodes}
                  officerNames={officerNames}
                  onUpdateOfficerName={(roleKey, newName) => {
                    setOfficerNames((prev) => {
                      const updated = { ...prev, [roleKey]: newName };
                      safePersist(STORAGE_KEYS.officerNames, updated);
                      return updated;
                    });
                    setLastPanelStatus(
                      `Nama pejabat ${ROLE_METADATA[roleKey as ClassRole]?.label || roleKey} berhasil diperbarui menjadi ${newName}.`
                    );
                  }}
                  onPublishWebsiteUpdate={(version, title, notes) => {
                    setUpdateLogs((prev) => {
                      const updated = [
                        {
                          id: `upd-${Date.now()}`,
                          version,
                          title,
                          notes,
                          author: session.displayName,
                          dateLabel: 'Baru Saja',
                        },
                        ...prev,
                      ];
                      safePersist(STORAGE_KEYS.updateLogs, updated);
                      return updated;
                    });
                    setLastPanelStatus(`Update Website ${version} (${title}) berhasil dirilis!`);
                  }}
                  onSwitchToOwnerOrTeacherDemo={(targetRole) => {
                    setPreselectedLoginRole(targetRole);
                    setIsLoginModalOpen(true);
                  }}
                  lastActionStatus={lastPanelStatus}
                />
              )}
            </motion.div>
          )}
        </main>

        {/* Android-Friendly Thumb-Zone Bottom Navigation Bar when Logged In on Mobile */}
        {session && (
          <nav
            aria-label="Navigasi Bawah Android Kelas 8B"
            className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md pb-safe shadow-[0_-4px_20px_rgba(15,23,42,0.06)]"
          >
            <div className="grid grid-cols-7 h-[58px] px-1">
              {(
                [
                  { id: 'dashboard', label: 'Beranda', Icon: LayoutDashboard },
                  { id: 'aichat', label: 'Tutor AI', Icon: Bot },
                  { id: 'chat', label: 'Chat', Icon: MessageSquare },
                  { id: 'akademi', label: 'Akademi', Icon: BookOpen },
                  { id: 'ruangplus', label: 'Plus 8B', Icon: Sparkles },
                  { id: 'toko', label: 'Toko', Icon: ShoppingBag },
                  { id: 'panel45', label: 'Panel 45', Icon: ShieldCheck },
                ] as const
              ).map(({ id, label, Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    data-testid={`mobile-nav-tab-${id}`}
                    className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-colors cursor-pointer ${
                      isActive ? 'text-slate-950' : 'text-slate-500'
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`}
                    />
                    <span className="truncate max-w-full px-0.5">{label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        )}

        {/* Clean Quiet Footer */}
        <footer className={`border-t border-slate-200 bg-white py-6 mt-auto ${session ? 'pb-20 md:pb-6' : ''}`}>
          <div className="mx-auto max-w-[1320px] px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              Portal Resmi Kelas 8B · SMP Negeri 18 Kota Bogor · Dibimbing oleh Wali Kelas Ibu Aida
            </div>
            <div className="flex items-center gap-4">
              {session ? (
                <button
                  type="button"
                  onClick={() => {
                    setPreselectedLoginRole(session.role);
                    setIsLoginModalOpen(true);
                  }}
                  className="min-h-[40px] text-slate-700 hover:text-slate-900 font-medium cursor-pointer"
                >
                  Ganti Akun / Peran Kelas 8B
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="min-h-[40px] text-slate-700 hover:text-slate-900 font-medium cursor-pointer"
                >
                  Login Warga Kelas 8B
                </button>
              )}
            </div>
          </div>
        </footer>

        {/* Modal Login & Verifikasi Kode Bu Aida / Owner */}
        <LoginVerificationModal
          key={preselectedLoginRole}
          isOpen={isLoginModalOpen}
          initialRole={preselectedLoginRole}
          customCodes={customCodes}
          onClose={() => setIsLoginModalOpen(false)}
          onSuccessLogin={handleSuccessLogin}
          onGoogleSignIn={handleGoogleSignIn}
          onRegisterDynamicCode={(newCode) =>
            setCustomCodes((prev) => {
              const updated = prev.includes(newCode) ? prev : [...prev, newCode];
              safePersist(STORAGE_KEYS.customCodes, updated);
              return updated;
            })
          }
        />
      </div>
    </MotionConfig>
  );
}
