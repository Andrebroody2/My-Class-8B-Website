---
name: Portal Akademik & Kolaborasi Digital Kelas 8B — SMPN 18 Kota Bogor
version: 3.0.0
brand:
  institution: SMP Negeri 18 Kota Bogor
  cohort: Kelas 8B (Tahun Ajaran 2026/2027)
  homeroomTeacher: Ibu Aida, S.Pd.
colors:
  background: "#F8FAFC"
  surface: "#FFFFFF"
  surface-elevated: "#0F172A"
  obsidian-stage: "#020617"
  primary: "#0F172A"
  accent-gold: "#F59E0B"
  accent-royal: "#4F46E5"
  accent-emerald: "#059669"
  on-surface: "#0F172A"
  on-surface-muted: "#475569"
  on-dark: "#F8FAFC"
typography:
  headline:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "3.25rem"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Public Sans"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.65
  mono:
    fontFamily: "JetBrains Mono"
    fontVariantNumeric: "tabular-nums"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
motion:
  springStiffness: 380
  springDamping: 28
  hoverLiftPx: -4
  tapScale: 0.95
  parallaxLayers: 4
---

## Overview
A high-craft academic portal and real-time collaboration platform engineered specifically for **Kelas 8B — SMP Negeri 18 Kota Bogor**, guided by homeroom teacher **Ibu Aida, S.Pd.** and the **Class Web Owner**. Combines an atmospheric GSAP + Lenis multi-layer parallax entry stage with crisp daylight editorial bento grids, real-time 24/7 group communication, a Grade 8 Indonesian Curriculum (*Kurikulum Merdeka*) gamified coin economy, and a 45-feature command center with 100% power parity between Owner and Teacher.

## Colors
- **Background (`#F8FAFC`)**: Cool Alabaster Stone daylight canvas for effortless long-session reading of assignments, schedules, and treasury ledgers.
- **Obsidian Stage (`#020617` to `#1E1B4B`)**: Deep architectural slate-indigo used on the multi-layer Parallax Hero Stage, Pinned Wali Kelas Announcements, and the 45-Feature Command Header.
- **Accent Gold (`#F59E0B`)**: Honors the crest of SMPN 18 Kota Bogor, verification gatekeeper keys (`BUAIDA-8B-2026` · `OWNER-8B-BOGOR`), and educational Coin rewards.
- **Accent Emerald (`#059669`)**: Inspired by Bogor Botanical Gardens (*Kebun Raya Bogor*); denotes verified status, live 24/7 synchronization, and positive class treasury balances.

## Typography
- **Display & Headlines (`Plus Jakarta Sans`)**: Authoritative geometric sans-serif with tight tracking for monumental parallax titles and section headers.
- **UI & Body (`Public Sans`)**: Clean, high-legibility body copy optimized for Indonesian academic content.
- **Numeric & Codes (`JetBrains Mono` + `tabular-nums`)**: Enforced on all coin balances, Rupiah treasury figures, OTP verification codes, and class schedule timestamps.

## Motion & Micro-Interactions
- **4-Layer GSAP ScrollTrigger + Pointer Parallax**: Background Bogor mountain horizon (`yPercent: 70`), SMPN 18 campus architecture (`yPercent: 55`), monumental typography & interactive launchpad (`yPercent: 40`), and foreground glass telemetry badges (`yPercent: 10`), augmented with interactive 3D pointer parallax and atmosphere mode switching.
- **Tactile Click Micro-Animations**: Every interactive click triggers both a spring scale response (`scale: 0.95` -> `1.0`) and a GPU-accelerated radial spark burst at the cursor coordinates.
- **Shared Layout Transitions (`layoutId`)**: Sliding active indicators across the top navigation bar, Monday–Friday schedule tabs, and Academy/Store mode switchers.

## Do's and Don'ts
- **Do** maintain the 3-zone Top Navigation Bar contract (`[Brand Wordmark] — [Navigation Links] — [1 Primary CTA]`).
- **Do** ensure all 9 class roles can authenticate seamlessly via official or dynamically generated OTP verification codes.
- **Don't** use unstyled static boxes without hover/tap feedback or tabular numeric alignment.
