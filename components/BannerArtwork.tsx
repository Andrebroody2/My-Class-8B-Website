'use client';

import React, { useState } from 'react';
import { CLASS_STORE_ITEMS } from '@/lib/class8b-logic';

interface BannerPreviewProps {
  bannerId: string;
  className?: string;
  compact?: boolean;
  children?: React.ReactNode;
}

export function BannerArtwork({
  bannerId,
  className = 'h-32 w-full rounded-xl',
  compact = false,
  children,
}: BannerPreviewProps) {
  const [imgError, setImgError] = useState(false);
  const item = CLASS_STORE_ITEMS.find((i) => i.id === bannerId) || CLASS_STORE_ITEMS[0];
  const key = item.artworkKey;

  return (
    <div className={`relative overflow-hidden select-none ${className}`}>
      {key === 'royal_archon' && (
        <>
          {!imgError ? (
            <img
              src="/images/banner_royal_archon.jpg"
              alt="Mahkota Royal Bogor"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-blue-950 to-amber-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/50" />
          <svg
            className="absolute right-0 top-0 h-full w-64 opacity-40 pointer-events-none"
            viewBox="0 0 240 120"
            fill="none"
          >
            <circle cx="190" cy="60" r="46" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="4 3" />
            <circle cx="190" cy="60" r="34" stroke="#FBBF24" strokeWidth="0.8" />
            <path d="M144 60H236M190 14V106" stroke="#F59E0B" strokeWidth="0.7" strokeOpacity="0.6" />
            <polygon
              points="190,22 199,48 226,48 204,64 212,90 190,74 168,90 176,64 154,48 181,48"
              stroke="#FDE68A"
              strokeWidth="1.1"
              fill="rgba(245,158,11,0.12)"
            />
          </svg>
        </>
      )}

      {key === 'bogor_emerald' && (
        <>
          {!imgError ? (
            <img
              src="/images/banner_bogor_emerald.jpg"
              alt="Kanopi Zamrud Kebun Raya"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-teal-900 to-amber-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/60 to-slate-950/50" />
          <svg
            className="absolute right-2 top-0 h-full w-60 opacity-45 pointer-events-none"
            viewBox="0 0 240 120"
            fill="none"
          >
            <path
              d="M120 120 C140 60, 180 40, 235 15 M150 120 C165 75, 195 55, 240 35"
              stroke="#34D399"
              strokeWidth="1.4"
            />
            <rect x="172" y="24" width="48" height="48" transform="rotate(15 172 24)" stroke="#FBBF24" strokeWidth="1" />
            <circle cx="195" cy="52" r="22" stroke="#A7F3D0" strokeWidth="0.9" />
          </svg>
        </>
      )}

      {key === 'celestial_astrolabe' && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-sky-950 to-indigo-950">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 160" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="astroGlow" cx="78%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
                <stop offset="60%" stopColor="#818CF8" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="600" height="160" fill="url(#astroGlow)" />
            <g stroke="#38BDF8" strokeOpacity="0.45" fill="none">
              <circle cx="470" cy="80" r="64" strokeWidth="1.2" />
              <circle cx="470" cy="80" r="48" strokeWidth="0.9" strokeDasharray="6 4" />
              <circle cx="470" cy="80" r="30" strokeWidth="1.2" stroke="#FBBF24" strokeOpacity="0.65" />
              <ellipse cx="470" cy="80" rx="88" ry="28" transform="rotate(-18 470 80)" strokeWidth="1" />
              <ellipse cx="470" cy="80" rx="88" ry="28" transform="rotate(24 470 80)" stroke="#FBBF24" strokeOpacity="0.4" strokeWidth="0.9" />
              <line x1="360" y1="80" x2="580" y2="80" strokeWidth="0.7" />
              <line x1="470" y1="5" x2="470" y2="155" strokeWidth="0.7" />
            </g>
            <g fill="#FDE68A">
              <circle cx="470" cy="80" r="3.5" />
              <circle cx="422" cy="62" r="2" />
              <circle cx="515" cy="96" r="2.2" />
              <circle cx="385" cy="44" r="1.8" />
              <circle cx="540" cy="48" r="2" />
            </g>
          </svg>
        </div>
      )}

      {key === 'sunda_pakuan' && (
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-amber-950 to-orange-950">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 160" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="salakSun" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.38" />
                <stop offset="100%" stopColor="#EA580C" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <circle cx="465" cy="88" r="56" fill="url(#salakSun)" stroke="#FBBF24" strokeOpacity="0.45" strokeWidth="1" />
            <path
              d="M280 160 L385 52 L455 118 L515 38 L600 160 Z"
              fill="rgba(24, 24, 27, 0.72)"
              stroke="#F59E0B"
              strokeWidth="1.2"
            />
            <path
              d="M340 160 L435 76 L515 160 Z"
              fill="rgba(245, 158, 11, 0.14)"
              stroke="#FDE68A"
              strokeWidth="0.9"
            />
            <g stroke="#FBBF24" strokeOpacity="0.3" strokeWidth="0.8">
              <line x1="0" y1="138" x2="600" y2="138" />
              <line x1="0" y1="146" x2="600" y2="146" />
            </g>
          </svg>
        </div>
      )}

      {key === 'cyber_equator' && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-950">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 160" preserveAspectRatio="xMidYMid slice">
            <g stroke="#38BDF8" strokeOpacity="0.24" strokeWidth="0.8" fill="none">
              <path d="M300 0 L600 160 M360 0 L600 128 M420 0 L600 96 M480 0 L600 64" />
              <path d="M600 0 L300 160 M540 0 L300 128 M480 0 L300 96" />
              <polygon points="465,24 535,62 465,100 395,62" stroke="#22D3EE" strokeOpacity="0.7" strokeWidth="1.3" fill="rgba(6,182,212,0.1)" />
              <polygon points="465,44 515,72 465,100 415,72" stroke="#FACC15" strokeOpacity="0.55" strokeWidth="1" />
            </g>
          </svg>
        </div>
      )}

      {key === 'academic_slate' && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
          <svg className="absolute inset-0 h-full w-full opacity-35" viewBox="0 0 600 160" preserveAspectRatio="xMidYMid slice">
            <g stroke="#94A3B8" strokeWidth="0.75" fill="none">
              <circle cx="510" cy="80" r="52" />
              <circle cx="510" cy="80" r="36" />
              <path d="M440 80H580 M510 10V150" />
            </g>
          </svg>
        </div>
      )}

      <div className={`relative z-10 flex h-full flex-col justify-between ${compact ? 'p-3' : 'p-5'}`}>
        {children}
      </div>
    </div>
  );
}

interface TitleEmblemProps {
  titleId: string;
  size?: 'sm' | 'md';
}

export function TitleInsignia({ titleId, size = 'sm' }: TitleEmblemProps) {
  const item = CLASS_STORE_ITEMS.find((i) => i.id === titleId && i.type === 'title') || {
    id: 'title_default',
    name: 'Warga Resmi Kelas 8B',
    rarity: 'Klasik',
    accentColor: '#475569',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium tracking-tight ${
        size === 'sm' ? 'text-xs' : 'text-xs'
      } text-amber-300`}
    >
      <svg
        className={size === 'sm' ? 'h-3.5 w-3.5 shrink-0' : 'h-4 w-4 shrink-0'}
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <polygon
          points="10,1.5 12.6,6.8 18.5,7.6 14.2,11.7 15.3,17.6 10,14.8 4.7,17.6 5.8,11.7 1.5,7.6 7.4,6.8"
          stroke="#FBBF24"
          strokeWidth="1.4"
          fill="rgba(245, 158, 11, 0.25)"
        />
      </svg>
      <span className="whitespace-nowrap">{item.name}</span>
    </span>
  );
}
