import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0F172A',
};

export const metadata: Metadata = {
  title: 'Portal Digital Kelas 8B — SMPN 18 Kota Bogor',
  description:
    'Platform resmi Kelas 8B SMP Negeri 18 Kota Bogor: Manajemen Tugas, Presensi, Live Group Chat 24/7, Pesan Pribadi, Kuis Kurikulum Kelas 8, Toko Koin Eksklusif, dan 45 Fitur Panel Kontrol Owner & Wali Kelas (Bu Aida).',
  openGraph: {
    title: 'Portal Digital Kelas 8B — SMPN 18 Kota Bogor',
    description:
      'Platform resmi Kelas 8B SMP Negeri 18 Kota Bogor: Manajemen Tugas, Presensi, Live Group Chat 24/7, Pesan Pribadi, Kuis Kurikulum Kelas 8, Toko Koin Eksklusif, dan 45 Fitur Panel Kontrol Owner & Wali Kelas (Bu Aida).',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portal Digital Kelas 8B — SMPN 18 Kota Bogor',
    description:
      'Platform resmi Kelas 8B SMP Negeri 18 Kota Bogor: Manajemen Tugas, Presensi, Live Group Chat 24/7, Pesan Pribadi, Kuis Kurikulum Kelas 8, Toko Koin Eksklusif, dan 45 Fitur Panel Kontrol Owner & Wali Kelas (Bu Aida).',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&family=Onest:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Public+Sans:wght@400;500;600;700&display=swap"
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased font-sans selection:bg-slate-900 selection:text-white"
      >
        {children}
      </body>
    </html>
  );
}
