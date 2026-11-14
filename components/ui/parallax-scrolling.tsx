'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  CheckCircle2,
  Coins,
  Timer,
  FileText,
  ArrowRight,
  Send,
  BookOpen,
  ShieldCheck,
  Sparkles,
  Compass,
  Layers,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  ClassRole,
  DaySchedule,
  KAGE_8B_PATHWAYS,
  KAGE_8B_FOREGROUND_LAYERS,
  KAGE_8B_TYPOGRAPHY,
  KagePathwayId,
  computeKageLayerParallaxOffset,
} from '@/lib/class8b-logic';

export interface ParallaxScrollingProps {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  onOpenLogin?: (role?: ClassRole) => void;
  onNavigateReviews?: () => void;
  onExploreSchedule?: () => void;
  onSelectDayFromPathway?: (day: DaySchedule['day']) => void;
  assignmentsCount?: number;
  reviewsCount?: number;
}

type ShowcaseSlideId = 'chat' | 'tugas' | 'akademi' | 'pomodoro' | 'surat';

const SHOWCASE_SLIDES: {
  id: ShowcaseSlideId;
  tabLabel: string;
  title: string;
  caption: string;
}[] = [
  {
    id: 'chat',
    tabLabel: 'Live Chat 24/7',
    title: 'Ruang Diskusi Kelas 8B Real-Time & DM Privat',
    caption:
      'Komunikasi cepat antarteman sekelas & Wali Kelas Ibu Aida lengkap dengan Banner profil.',
  },
  {
    id: 'tugas',
    tabLabel: 'Tugas & Kas 8B',
    title: 'Daftar PR Sekolah, Presensi & Buku Kas Transparan',
    caption:
      'Dikelola oleh Sekretaris 1–2, Bendahara 1–2, Ketua/Wakil Kelas, Ibu Aida, dan Owner.',
  },
  {
    id: 'akademi',
    tabLabel: 'Akademi Koin',
    title: 'Kuis & Flashcard Kurikulum Merdeka Kelas 8',
    caption:
      'Kumpulkan koin dari latihan Matematika, IPA, IPS, & Bahasa lalu tukarkan Banner di Toko 8B.',
  },
  {
    id: 'pomodoro',
    tabLabel: 'Fokus Pomodoro',
    title: 'Timer Belajar Terstruktur + Hadiah Koin Otomatis',
    caption:
      'Jaga konsentrasi belajar 25 menit dalam keheningan ala Kage 8B dengan target mata pelajaran.',
  },
  {
    id: 'surat',
    tabLabel: 'Surat Izin & Kudos',
    title: 'Surat Izin Digital ke Bu Aida & Apresiasi Teman',
    caption:
      'Buat surat izin resmi dalam hitungan detik & kirim lencana semangat untuk teman piket.',
  },
];

// Reusable module-scope math objects for zero-GC Three.js render loop
const _camTargetPos = new THREE.Vector3();
const _camLookTarget = new THREE.Vector3();
const _dummyMatrix = new THREE.Matrix4();
const _dummyPos = new THREE.Vector3();
const _dummyRot = new THREE.Euler();
const _dummyQuat = new THREE.Quaternion();
const _dummyScale = new THREE.Vector3();
const _scratchColor = new THREE.Color();

export function ParallaxComponent({
  onOpenLogin,
  onExploreSchedule,
  onSelectDayFromPathway,
  assignmentsCount = 3,
}: ParallaxScrollingProps) {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);

  const [activePathwayId, setActivePathwayId] = useState<KagePathwayId>('sanmon');
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const [scrollProg, setScrollProg] = useState(0);
  const [previewMsgDone, setPreviewMsgDone] = useState(false);
  const [showLayerInspector, setShowLayerInspector] = useState(false);
  const [cinemaPureMode, setCinemaPureMode] = useState(false);

  // Refs for reading inside WebGL loop without tearing down canvas
  const activePathwayRef = useRef<KagePathwayId>('sanmon');
  const pointerRef = useRef({ x: 0, y: 0 });
  const scrollProgRef = useRef(0);

  const currentRealm =
    KAGE_8B_PATHWAYS.find((r) => r.id === activePathwayId) || KAGE_8B_PATHWAYS[0];
  const currentSlide = SHOWCASE_SLIDES[activeSlideIdx];

  const handleSelectPathway = (pathwayId: KagePathwayId) => {
    setActivePathwayId(pathwayId);
    activePathwayRef.current = pathwayId;
    const found = KAGE_8B_PATHWAYS.find((p) => p.id === pathwayId);
    if (found && onSelectDayFromPathway) {
      onSelectDayFromPathway(found.linkedDay);
    }
  };

  // 1. GSAP ScrollTrigger + Lenis Smooth Scroll Multi-Layer Parallax
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = parallaxRef.current?.querySelector('[data-parallax-layers]');

    if (triggerElement) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: '0% 0%',
          end: '100% 0%',
          scrub: 0,
          onUpdate: (self) => {
            scrollProgRef.current = self.progress;
            setScrollProg(Number(self.progress.toFixed(2)));
          },
        },
      });

      const layers = [
        { layer: '1', yPercent: 32 },
        { layer: '2', yPercent: 20 },
        { layer: '3', yPercent: 12 },
        { layer: '4', yPercent: 5 },
      ];

      layers.forEach((layerObj, idx) => {
        const targets = triggerElement.querySelectorAll(
          `[data-parallax-layer="${layerObj.layer}"]`
        );
        if (targets.length > 0) {
          tl.to(
            targets,
            {
              yPercent: layerObj.yPercent,
              ease: 'none',
            },
            idx === 0 ? undefined : '<'
          );
        }
      });
    }

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      if (triggerElement) {
        gsap.killTweensOf(triggerElement);
      }
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  // 2. Real-Time Three.js WebGL Kage 8B Secret Pathways 3D Sanctuary Stage
  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 480);

    const scene = new THREE.Scene();
    const fog = new THREE.FogExp2(0x0b0f17, 0.042);
    scene.fog = fog;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 120);
    camera.position.set(0, 3.1, 13.2);
    const currentLookAt = new THREE.Vector3(0, 2.3, -2.5);
    camera.lookAt(currentLookAt);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio PBR Environment reflection map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    // Warm/Cool Sanctuary Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x1c1917, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 1.85);
    keyLight.position.set(7, 12, 8);
    scene.add(keyLight);

    const vermilionRimLight = new THREE.DirectionalLight(0xe0231c, 1.35);
    vermilionRimLight.position.set(-8, 6, -6);
    scene.add(vermilionRimLight);

    const lanternPointLight = new THREE.PointLight(0xff7b29, 4.2, 22, 1.4);
    lanternPointLight.position.set(0, 2.4, 3.5);
    scene.add(lanternPointLight);

    // Shared PBR Materials
    const vermilionLacquerMat = new THREE.MeshPhysicalMaterial({
      color: 0xe0231c,
      roughness: 0.24,
      metalness: 0.18,
      clearcoat: 0.85,
      clearcoatRoughness: 0.18,
    });

    const darkPagodaRoofMat = new THREE.MeshStandardMaterial({
      color: 0x181c24,
      roughness: 0.55,
      metalness: 0.35,
    });

    const carvedBasaltMat = new THREE.MeshStandardMaterial({
      color: 0x333842,
      roughness: 0.82,
      metalness: 0.12,
    });

    const goldPlaqueMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.22,
      metalness: 0.88,
    });

    const lanternGlowMat = new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      emissive: 0xff6b1a,
      emissiveIntensity: 2.6,
      roughness: 0.2,
    });

    // A. Composite 10-Part 3D Sanmon Gate of Kelas 8B (`THREE.Group`) framed in the sanctuary vista
    const sanmonGroup = new THREE.Group();
    sanmonGroup.position.set(1.35, -1.05, -5.2);
    sanmonGroup.rotation.y = -0.18;

    // 1. Stepped Basalt Foundation Plinth
    const plinthGeo = new THREE.BoxGeometry(8.2, 0.55, 3.2);
    const plinthMesh = new THREE.Mesh(plinthGeo, carvedBasaltMat);
    plinthMesh.position.y = 0.275;
    sanmonGroup.add(plinthMesh);

    // 2. Six Vermilion Lacquer Pillars
    const pillarGeo = new THREE.CylinderGeometry(0.22, 0.25, 4.4, 16);
    const pillarOffsets = [
      [-2.8, 2.45, 0.7],
      [-1.15, 2.45, 0.7],
      [1.15, 2.45, 0.7],
      [2.8, 2.45, 0.7],
      [-2.8, 2.45, -0.7],
      [2.8, 2.45, -0.7],
    ];
    pillarOffsets.forEach(([px, py, pz]) => {
      const p = new THREE.Mesh(pillarGeo, vermilionLacquerMat);
      p.position.set(px, py, pz);
      sanmonGroup.add(p);
    });

    // 3. Lower & Upper Vermilion Crossbeams (Kasagi & Nuki) + Gold Trim
    const lowerBeamGeo = new THREE.BoxGeometry(6.8, 0.32, 1.7);
    const lowerBeam = new THREE.Mesh(lowerBeamGeo, vermilionLacquerMat);
    lowerBeam.position.set(0, 3.65, 0);
    sanmonGroup.add(lowerBeam);

    const upperBeamGeo = new THREE.BoxGeometry(7.6, 0.42, 2.0);
    const upperBeam = new THREE.Mesh(upperBeamGeo, vermilionLacquerMat);
    upperBeam.position.set(0, 4.55, 0);
    sanmonGroup.add(upperBeam);

    const goldEaveTrim = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.09, 2.08), goldPlaqueMat);
    goldEaveTrim.position.set(0, 4.78, 0);
    sanmonGroup.add(goldEaveTrim);

    // 4. Lower & Upper Pagoda Roof Tiers + Golden Ridge Finial
    const lowerRoofGeo = new THREE.ConeGeometry(5.4, 1.05, 4);
    const lowerRoof = new THREE.Mesh(lowerRoofGeo, darkPagodaRoofMat);
    lowerRoof.rotation.y = Math.PI / 4;
    lowerRoof.scale.set(1.22, 1, 0.55);
    lowerRoof.position.set(0, 5.15, 0);
    sanmonGroup.add(lowerRoof);

    const upperRoofGeo = new THREE.ConeGeometry(4.4, 1.25, 4);
    const upperRoof = new THREE.Mesh(upperRoofGeo, darkPagodaRoofMat);
    upperRoof.rotation.y = Math.PI / 4;
    upperRoof.scale.set(1.25, 1, 0.54);
    upperRoof.position.set(0, 6.15, 0);
    sanmonGroup.add(upperRoof);

    const ridgeCrown = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.14, 0.22), goldPlaqueMat);
    ridgeCrown.position.set(0, 6.76, 0);
    sanmonGroup.add(ridgeCrown);

    // 5. Golden Kelas 8B Pakuan Tablet Frame & Two Hanging Eave Lanterns
    const plaqueGeo = new THREE.BoxGeometry(1.45, 0.68, 0.18);
    const plaqueMesh = new THREE.Mesh(plaqueGeo, goldPlaqueMat);
    plaqueMesh.position.set(0, 4.12, 0.88);
    sanmonGroup.add(plaqueMesh);

    [-1.95, 1.95].forEach((lx) => {
      const hangLantern = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 0.34, 8),
        lanternGlowMat
      );
      hangLantern.position.set(lx, 3.22, 0.82);
      sanmonGroup.add(hangLantern);
    });

    // 6. Contact Shadow Disc under Sanmon Gate
    const gateShadowGeo = new THREE.CircleGeometry(5.2, 32);
    const gateShadowMat = new THREE.MeshBasicMaterial({
      color: 0x020617,
      transparent: true,
      opacity: 0.46,
      depthWrite: false,
    });
    const gateShadow = new THREE.Mesh(gateShadowGeo, gateShadowMat);
    gateShadow.rotation.x = -Math.PI / 2;
    gateShadow.position.y = 0.02;
    sanmonGroup.add(gateShadow);

    scene.add(sanmonGroup);

    // B. 6 Composite 5-Part Stone Lanterns (Tōrō) along the Secret Pathway
    const buildStoneLantern = (x: number, z: number, scale = 1): THREE.Group => {
      const g = new THREE.Group();
      g.position.set(x, -0.35, z);
      g.scale.setScalar(scale);

      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.46, 0.25, 6), carvedBasaltMat);
      base.position.y = 0.125;
      g.add(base);

      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.95, 6), carvedBasaltMat);
      post.position.y = 0.72;
      g.add(post);

      const platform = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.3, 0.16, 6), carvedBasaltMat);
      platform.position.y = 1.26;
      g.add(platform);

      const firebox = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.36, 6), lanternGlowMat);
      firebox.position.y = 1.52;
      g.add(firebox);

      const roof = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.36, 6), darkPagodaRoofMat);
      roof.position.y = 1.86;
      g.add(roof);

      const finial = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), goldPlaqueMat);
      finial.position.y = 2.08;
      g.add(finial);

      return g;
    };

    const lanternCoords: [number, number, number][] = [
      [-2.35, 5.2, 1.0],
      [2.35, 4.6, 0.96],
      [-2.15, 2.0, 0.92],
      [2.1, 1.3, 0.9],
      [-1.85, -0.9, 0.86],
      [1.85, -1.4, 0.85],
    ];
    const lanterns: THREE.Group[] = [];
    lanternCoords.forEach(([lx, lz, ls]) => {
      const l = buildStoneLantern(lx, lz, ls);
      lanterns.push(l);
      scene.add(l);
    });

    // C. Winding Basalt Stepping-Stone Pathway (`THREE.InstancedMesh` of 22 stones)
    const stepStoneCount = 22;
    const stepStoneGeo = new THREE.CylinderGeometry(0.56, 0.64, 0.12, 7);
    const stepStoneInstanced = new THREE.InstancedMesh(
      stepStoneGeo,
      carvedBasaltMat,
      stepStoneCount
    );
    for (let i = 0; i < stepStoneCount; i++) {
      const t = i / (stepStoneCount - 1);
      const zPos = 8.4 - t * 11.2;
      const xPos = Math.sin(t * Math.PI * 2.1) * 0.75 + (i % 2 === 0 ? -0.18 : 0.18);
      _dummyPos.set(xPos, -0.32, zPos);
      _dummyRot.set(0, i * 0.65, 0);
      _dummyQuat.setFromEuler(_dummyRot);
      const s = 0.85 + (i % 3) * 0.14;
      _dummyScale.set(s * 1.15, 1, s * 0.92);
      _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
      stepStoneInstanced.setMatrixAt(i, _dummyMatrix);
      _scratchColor.setHSL(0.6, 0.08, 0.22 + (i % 4) * 0.03);
      stepStoneInstanced.setColorAt(i, _scratchColor);
    }
    stepStoneInstanced.instanceMatrix.needsUpdate = true;
    if (stepStoneInstanced.instanceColor) stepStoneInstanced.instanceColor.needsUpdate = true;
    stepStoneInstanced.computeBoundingSphere();
    scene.add(stepStoneInstanced);

    // D. Moonwater Reflective Sanctuary Ring (Offset by +0.02 Y to avoid Z-fighting)
    const waterGeo = new THREE.RingGeometry(1.2, 4.4, 48);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.12,
      metalness: 0.78,
      transparent: true,
      opacity: 0.62,
      depthWrite: false,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.set(0, -0.33, 1.8);
    scene.add(waterMesh);

    // E. Drifting Crimson Maple Leaves & Sanctuary Embers (`THREE.InstancedMesh` of 42 particles)
    const petalCount = 42;
    const petalGeo = new THREE.OctahedronGeometry(0.075, 0);
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xe0231c,
      emissive: 0xe0231c,
      emissiveIntensity: 0.85,
      roughness: 0.35,
    });
    const petalInstanced = new THREE.InstancedMesh(petalGeo, petalMat, petalCount);
    const petalSeeds = Array.from({ length: petalCount }, (_, idx) => ({
      baseX: ((idx * 37) % 14) - 7,
      baseY: 0.4 + ((idx * 19) % 60) / 10,
      baseZ: ((idx * 29) % 14) - 5,
      speed: 0.35 + (idx % 5) * 0.12,
      phase: idx * 0.48,
      scale: 0.75 + (idx % 4) * 0.18,
    }));

    petalSeeds.forEach((p, idx) => {
      _dummyPos.set(p.baseX, p.baseY, p.baseZ);
      _dummyRot.set(p.phase, p.phase * 0.7, 0);
      _dummyQuat.setFromEuler(_dummyRot);
      _dummyScale.set(p.scale, p.scale * 0.45, p.scale);
      _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
      petalInstanced.setMatrixAt(idx, _dummyMatrix);
      _scratchColor.setHex(idx % 3 === 0 ? 0xf59e0b : 0xe0231c);
      petalInstanced.setColorAt(idx, _scratchColor);
    });
    petalInstanced.instanceMatrix.needsUpdate = true;
    if (petalInstanced.instanceColor) petalInstanced.instanceColor.needsUpdate = true;
    petalInstanced.frustumCulled = false;
    scene.add(petalInstanced);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let frameId = 0;
    let isDisposed = false;
    let lastTimeMs = performance.now();
    let elapsedTotal = 0;

    function afterDraw(cb: () => void) {
      if (isDisposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (isDisposed) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    function tick() {
      if (isDisposed) return;
      const nowMs = performance.now();
      const delta = Math.min((nowMs - lastTimeMs) / 1000, 0.1);
      lastTimeMs = nowMs;
      elapsedTotal += delta;

      const activeRealm =
        KAGE_8B_PATHWAYS.find((r) => r.id === activePathwayRef.current) || KAGE_8B_PATHWAYS[0];

      // Smoothly damp camera position & lookAt target along the Kage 8B pathway
      const px = pointerRef.current.x;
      const py = pointerRef.current.y;
      const sp = scrollProgRef.current;

      _camTargetPos.set(
        activeRealm.cameraPos[0] + px * 0.85,
        activeRealm.cameraPos[1] - py * 0.45 + sp * 0.8,
        activeRealm.cameraPos[2] - sp * 2.2
      );
      _camLookTarget.set(
        activeRealm.cameraLookAt[0] + px * 0.35,
        activeRealm.cameraLookAt[1] - py * 0.25,
        activeRealm.cameraLookAt[2]
      );

      const dampFactor = 1 - Math.exp(-4.2 * delta);
      camera.position.lerp(_camTargetPos, dampFactor);
      currentLookAt.lerp(_camLookTarget, dampFactor);
      camera.lookAt(currentLookAt);

      // Smoothly transition fog color
      _scratchColor.set(activeRealm.fogHex);
      fog.color.lerp(_scratchColor, dampFactor);

      // Gentle lantern flicker
      lanternGlowMat.emissiveIntensity = 2.3 + Math.sin(elapsedTotal * 3.8) * 0.35;
      lanternPointLight.intensity = 3.8 + Math.cos(elapsedTotal * 3.1) * 0.55;

      // Update drifting crimson maple petals & golden embers
      for (let i = 0; i < petalCount; i++) {
        const p = petalSeeds[i];
        const y = ((p.baseY - elapsedTotal * p.speed * 0.45 + 6) % 6) - 0.1;
        const x = p.baseX + Math.sin(elapsedTotal * 0.8 + p.phase) * 0.55;
        const z = p.baseZ + Math.cos(elapsedTotal * 0.6 + p.phase) * 0.35;
        _dummyPos.set(x, y, z);
        _dummyRot.set(
          elapsedTotal * p.speed + p.phase,
          elapsedTotal * 0.9 + p.phase,
          Math.sin(elapsedTotal + p.phase) * 0.5
        );
        _dummyQuat.setFromEuler(_dummyRot);
        _dummyScale.set(p.scale, p.scale * 0.45, p.scale);
        _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
        petalInstanced.setMatrixAt(i, _dummyMatrix);
      }
      petalInstanced.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    const handleResize = () => {
      if (!container || isDisposed) return;
      const w = Math.max(container.clientWidth, 320);
      const h = Math.max(container.clientHeight, 480);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isDisposed = true;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      envTarget.dispose();
      vermilionLacquerMat.dispose();
      darkPagodaRoofMat.dispose();
      carvedBasaltMat.dispose();
      goldPlaqueMat.dispose();
      lanternGlowMat.dispose();
      waterGeo.dispose();
      waterMat.dispose();
      stepStoneGeo.dispose();
      petalGeo.dispose();
      petalMat.dispose();
      renderer.dispose();
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    pointerRef.current = { x: normX, y: normY };
    setPointerOffset({ x: normX, y: normY });
  };

  const handleMouseLeave = () => {
    pointerRef.current = { x: 0, y: 0 };
    setPointerOffset({ x: 0, y: 0 });
  };

  const handlePrevSlide = () => {
    setActiveSlideIdx((prev) => (prev === 0 ? SHOWCASE_SLIDES.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlideIdx((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
  };

  // Compute multi-layer parallax offsets for foreground silhouettes
  const farHillOffset = computeKageLayerParallaxOffset({
    pointerX: pointerOffset.x,
    pointerY: pointerOffset.y,
    scrollProgress: scrollProg,
    depthFactor: 0.2,
  });
  const midSanctuaryOffset = computeKageLayerParallaxOffset({
    pointerX: pointerOffset.x,
    pointerY: pointerOffset.y,
    scrollProgress: scrollProg,
    depthFactor: 0.5,
  });
  const nearCanopyOffset = computeKageLayerParallaxOffset({
    pointerX: pointerOffset.x,
    pointerY: pointerOffset.y,
    scrollProgress: scrollProg,
    depthFactor: 0.88,
  });

  return (
    <section
      ref={parallaxRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-kage-realm={currentRealm.id}
      className="relative w-full overflow-hidden bg-[#090c14] text-white font-kage"
    >
      {/* KAGE — SECRET PATHWAYS 8B MULTI-PLANE STAGE (THREE.JS + 10 FOREGROUND LAYERS + DOM HUD) */}
      <div
        data-parallax-layers
        className="relative w-full min-h-[920px] sm:min-h-[1020px] flex flex-col justify-between overflow-hidden"
      >
        {/* LAYER 1: PAINTED KAGE 8B SANCTUARY REALM BACKDROP (CROSSFADES SMOOTHLY PER REALM) */}
        <AnimatePresence mode="sync">
          <motion.img
            key={currentRealm.bgAsset}
            src={currentRealm.bgAsset}
            loading="eager"
            referrerPolicy="no-referrer"
            data-parallax-layer="1"
            alt={`${currentRealm.shortLabel} — Kelas 8B SMP Negeri 18 Kota Bogor`}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.78, scale: 1.04 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transform: `translate3d(${farHillOffset.x}px, ${farHillOffset.y * 0.35}px, 0) scale(${farHillOffset.scale})`,
            }}
            className="absolute inset-0 h-[114%] w-full object-cover object-center select-none pointer-events-none"
          />
        </AnimatePresence>

        {/* LAYER 2: REAL-TIME THREE.JS WEBGL KAGE 8B 3D SANCTUARY & LANTERN PATHWAY */}
        <div
          ref={canvasMountRef}
          data-testid="kage-8b-webgl-stage"
          aria-label="Kanvas 3D WebGL Kage 8B Secret Pathways"
          className="pointer-events-none absolute inset-0 z-10 h-full w-full"
        />

        {/* LAYER 3: 10 KAGE FOREGROUND BOTANICAL & ARCHITECTURAL SILHOUETTE PLANES (SVG DEPTH RIG) */}
        <div
          aria-hidden="true"
          data-parallax-layer="2"
          className="pointer-events-none absolute inset-0 z-15 overflow-hidden select-none"
        >
          {/* 1 & 2. Distant Hill (Gunung Salak) & Shrine Ruins Silhouette */}
          <svg
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            style={{
              transform: `translate3d(${farHillOffset.x}px, ${farHillOffset.y * 0.25}px, 0)`,
              transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="absolute inset-x-0 bottom-0 h-56 w-full text-[#080b12]/70"
          >
            <path
              fill="currentColor"
              d="M0,224L80,208C160,192,320,160,480,165.3C640,171,800,213,960,218.7C1120,224,1280,192,1360,176L1440,160L1440,320L0,320Z"
            />
          </svg>

          {/* 3 & 4. Top-Left Pine Tree & Temple Wall Framing Silhouette */}
          <svg
            viewBox="0 0 420 520"
            style={{
              transform: `translate3d(${nearCanopyOffset.x * 0.7}px, ${nearCanopyOffset.y * 0.2}px, 0)`,
            }}
            className="animate-kage-breeze absolute -left-8 -top-6 h-72 w-72 sm:h-96 sm:w-96 text-[#06080e]/85"
          >
            <path
              fill="currentColor"
              d="M0,0 L280,0 C245,42 190,68 135,82 C195,95 235,120 260,152 C185,156 130,172 88,198 C142,212 178,236 196,268 C132,270 78,288 38,325 L0,360 Z"
            />
            {/* Crimson Maple Leaves Cluster (#e0231c) */}
            <g fill="#e0231c" opacity="0.78">
              <circle cx="175" cy="64" r="7" />
              <circle cx="195" cy="76" r="5.5" />
              <circle cx="152" cy="84" r="6" />
              <circle cx="218" cy="138" r="6.5" />
              <circle cx="136" cy="176" r="5" />
              <circle cx="164" cy="242" r="6" />
            </g>
          </svg>

          {/* 5 & 6. Top-Right Sakura Branch & Crimson Maple Foliage (#e0231c) */}
          <svg
            viewBox="0 0 460 440"
            style={{
              transform: `translate3d(${nearCanopyOffset.x * -0.8}px, ${nearCanopyOffset.y * 0.22}px, 0)`,
            }}
            className="animate-kage-breeze absolute -right-8 -top-6 h-72 w-80 sm:h-96 sm:w-[420px] text-[#070910]/85"
          >
            <path
              fill="currentColor"
              d="M460,0 L140,0 C185,38 242,64 310,78 C248,96 202,126 172,164 C246,166 312,184 358,214 C298,232 258,258 238,292 C312,292 378,312 426,348 L460,380 Z"
            />
            <g fill="#e0231c" opacity="0.82">
              <circle cx="240" cy="58" r="7.5" />
              <circle cx="212" cy="74" r="5.5" />
              <circle cx="274" cy="88" r="6" />
              <circle cx="204" cy="146" r="7" />
              <circle cx="236" cy="158" r="5" />
              <circle cx="278" cy="264" r="6.5" />
            </g>
            <g fill="#fda4af" opacity="0.65">
              <circle cx="256" cy="68" r="4.5" />
              <circle cx="192" cy="152" r="4" />
              <circle cx="295" cy="202" r="4.5" />
            </g>
          </svg>

          {/* 7, 8, 9 & 10. Foreground Tall Grass, Garden Bush, Stone Lantern & Basalt Stones */}
          <svg
            viewBox="0 0 1440 220"
            preserveAspectRatio="none"
            style={{
              transform: `translate3d(${midSanctuaryOffset.x * 0.6}px, 0, 0)`,
            }}
            className="animate-kage-grass absolute inset-x-0 bottom-0 h-32 sm:h-40 w-full text-[#06080f]/95"
          >
            <path
              fill="currentColor"
              d="M0,220 L0,145 Q35,90 52,55 Q48,115 68,155 Q95,95 118,48 Q106,120 132,165 Q168,118 195,88 Q182,145 215,178 L1220,178 Q1258,132 1285,76 Q1275,138 1304,168 Q1342,102 1372,46 Q1358,122 1388,162 Q1415,112 1440,68 L1440,220 Z"
            />
          </svg>
        </div>

        {/* MEASURED ATMOSPHERIC CONTRAST SCRIMS (NO CSS BACKDROP-BLUR OVER ACTIVE WEBGL CANVAS) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-15 h-[56%] bg-gradient-to-b from-[#070a12]/90 via-[#070a12]/55 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-15 h-[68%] bg-gradient-to-t from-[#070a12]/95 via-[#070a12]/65 to-transparent"
        />

        {/* UPPER SECTION: KAGE 8B HEADER, VERMILION HANKO SEAL (#e0231c), ONEST HEADLINE & REALM SWITCHER */}
        <div
          data-parallax-layer="3"
          className="relative z-20 mx-auto w-full max-w-[1260px] px-5 sm:px-10 pt-8 sm:pt-12 pb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            {/* Left Column: Kage Vermilion Seal + Onest 46px Weight-400 Headline + Weight-300 Body */}
            <div className="max-w-2xl space-y-5">
              {/* Top Kicker Row with Authentic Kage Vermilion Hanko Stamp (#e0231c) */}
              <div className="flex flex-wrap items-center gap-3">
                <div
                  style={{ backgroundColor: KAGE_8B_TYPOGRAPHY.primaryColor }}
                  className="inline-flex items-center gap-2 rounded-sm px-2.5 py-1 text-[11px] font-mono font-bold tracking-widest text-white shadow-md"
                >
                  <span>{currentRealm.kanjiSeal}</span>
                  <span>·</span>
                  <span>KAGE 8B</span>
                </div>
                <span className="text-xs font-normal tracking-wide text-stone-300">
                  Bab {currentRealm.chapterCode} · {currentRealm.japaneseSub}
                </span>
                <span className="hidden sm:inline text-stone-500">·</span>
                <span className="hidden sm:inline text-xs font-mono text-amber-300">
                  {currentRealm.ambientNote}
                </span>
              </div>

              {/* KageLandingPage Configured Headline: Onest, weight 400, size ~46px, letter-spacing -0.012em */}
              <motion.h1
                key={`kage-headline-${currentRealm.id}`}
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontWeight: Number(KAGE_8B_TYPOGRAPHY.headingWeight),
                  letterSpacing: `${KAGE_8B_TYPOGRAPHY.headingLetterSpacing}em`,
                  textWrap: 'balance',
                }}
                className="font-kage text-3xl sm:text-5xl lg:text-[48px] text-white leading-[1.08]"
              >
                {currentRealm.headline}
              </motion.h1>

              {/* Subtle Vermilion + Stone Hairline Divider */}
              <div className="flex items-center gap-2">
                <div
                  style={{ backgroundColor: KAGE_8B_TYPOGRAPHY.primaryColor }}
                  className="h-0.5 w-14"
                />
                <div className="h-px w-52 sm:w-72 bg-white/30" />
              </div>

              {/* KageLandingPage Configured Body Copy: Onest, weight 300, size 17px */}
              <motion.p
                key={`kage-desc-${currentRealm.id}`}
                initial={{ y: 10, opacity: 0.25 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.35 }}
                style={{
                  fontWeight: Number(KAGE_8B_TYPOGRAPHY.bodyWeight),
                  fontSize: `${KAGE_8B_TYPOGRAPHY.bodySize}px`,
                  textWrap: 'balance',
                }}
                className="max-w-xl text-stone-200 leading-relaxed"
              >
                {currentRealm.description}
              </motion.p>

              {/* Primary CTAs styled with Kage Vermilion (#e0231c) & Sanctuary Obsidian */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <motion.button
                  type="button"
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onOpenLogin?.('siswa')}
                  style={{ backgroundColor: KAGE_8B_TYPOGRAPHY.primaryColor }}
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-xs font-semibold text-white shadow-lg hover:brightness-110 transition-all whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Masuk Kelas 8B</span>
                  <ArrowRight className="h-3.5 w-3.5 text-white" />
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onExploreSchedule?.()}
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-md border border-white/40 bg-[#0d111a]/85 px-4 py-2.5 text-xs font-medium text-stone-100 hover:border-white/80 hover:bg-[#131926] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Compass className="h-3.5 w-3.5 text-[#e0231c]" />
                  <span>Lihat Jadwal Hari {currentRealm.linkedDay}</span>
                </motion.button>

                <button
                  type="button"
                  onClick={() => setShowLayerInspector((prev) => !prev)}
                  className="min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-md border border-white/25 bg-[#0d111a]/80 px-3.5 py-2 text-xs font-medium text-stone-300 hover:text-white hover:border-white/50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Layers className="h-3.5 w-3.5 text-amber-400" />
                  <span>{showLayerInspector ? 'Tutup 10 Layer Kage' : '10 Layer Kage 8B'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCinemaPureMode((prev) => !prev)}
                  className="min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-md border border-white/25 bg-[#0d111a]/80 px-3.5 py-2 text-xs font-medium text-stone-300 hover:text-white hover:border-white/50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {cinemaPureMode ? (
                    <>
                      <Eye className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Tampilkan Panel</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3.5 w-3.5 text-stone-400" />
                      <span>Mode Hening 3D</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Kage 4 Secret Pathway Chapters Selector */}
            <div className="w-full lg:w-[390px] rounded-xl border border-white/20 bg-[#0c1018]/90 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-stone-400 px-1">
                <span className="font-mono uppercase tracking-wider text-stone-300">
                  4 Jalur Rahasia Kage 8B
                </span>
                <span className="font-mono text-[#e0231c] font-semibold">Three.js + Parallax</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {KAGE_8B_PATHWAYS.map((pathway) => {
                  const isSelected = pathway.id === currentRealm.id;
                  return (
                    <button
                      key={pathway.id}
                      type="button"
                      onClick={() => handleSelectPathway(pathway.id)}
                      className={`min-h-[64px] rounded-lg border p-2.5 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#e0231c] bg-[#1a1116] text-white shadow-sm'
                          : 'border-white/10 bg-[#111622]/85 text-stone-300 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span
                          className={
                            isSelected ? 'text-[#e0231c] font-bold' : 'text-stone-400'
                          }
                        >
                          {pathway.chapterCode} · {pathway.kanjiSeal}
                        </span>
                        <span className="text-[10px] text-amber-300/90">{pathway.linkedDay}</span>
                      </div>
                      <div className="mt-1 text-xs font-semibold truncate">
                        {pathway.shortLabel}
                      </div>
                      <div className="mt-0.5 text-[10px] text-stone-400 truncate">
                        {pathway.highlightMetric}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* OPTIONAL 10 FOREGROUND LAYER DEPTH INSPECTOR (SHOWS ALL 10 KAGE SECRET PATHWAYS ASSETS) */}
          <AnimatePresence>
            {showLayerInspector && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="mt-5 rounded-xl border border-white/20 bg-[#0b0f18]/92 p-4 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-white">
                    Arsitektur 10 Layer Kedalaman Kage Secret Pathways (Versi Kelas 8B Bogor)
                  </span>
                  <span className="font-mono text-stone-400 tabular-nums">
                    Parallax X: {pointerOffset.x.toFixed(2)} · Scroll: {(scrollProg * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {KAGE_8B_FOREGROUND_LAYERS.map((layer) => (
                    <div
                      key={layer.id}
                      className="rounded-lg border border-white/10 bg-[#121826] p-2.5 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-stone-400">
                        <span className="text-[#e0231c] font-bold">{layer.id}</span>
                        <span>d={layer.depthFactor.toFixed(2)}</span>
                      </div>
                      <div className="text-xs font-medium text-stone-100 truncate">
                        {layer.label}
                      </div>
                      <div className="text-[10px] font-mono text-stone-400">
                        yPercent: {layer.parallaxYPercent}%
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* LOWER SECTION: INTERACTIVE SANCTUARY PORTAL SHOWCASE WINDOW */}
        {!cinemaPureMode && (
          <div
            data-parallax-layer="4"
            className="relative z-20 mx-auto w-full max-w-[1160px] px-4 sm:px-8 pt-10 sm:pt-14 pb-10 space-y-5"
          >
            <div className="text-center space-y-3">
              <h2
                style={{
                  fontWeight: Number(KAGE_8B_TYPOGRAPHY.headingWeight),
                  letterSpacing: `${KAGE_8B_TYPOGRAPHY.headingLetterSpacing}em`,
                  textWrap: 'balance',
                }}
                className="mx-auto max-w-2xl font-kage text-2xl sm:text-4xl text-white leading-tight"
              >
                Satu pelataran digital terpadu untuk belajar dan kolaborasi Kelas 8B
              </h2>

              {/* Clean Unboxed Horizontal Feature Tabs */}
              <div
                role="tablist"
                aria-label="Pratinjau Fitur Portal Kelas 8B"
                className="flex items-center justify-start sm:justify-center gap-5 overflow-x-auto pb-1 px-2 no-scrollbar"
              >
                {SHOWCASE_SLIDES.map((slide, idx) => {
                  const isActive = activeSlideIdx === idx;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveSlideIdx(idx)}
                      className={`relative min-h-[40px] py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        isActive ? 'text-white' : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      <span>{slide.tabLabel}</span>
                      {isActive && (
                        <motion.span
                          layoutId="heroShowcaseUnderline"
                          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                          style={{ backgroundColor: KAGE_8B_TYPOGRAPHY.primaryColor }}
                          className="absolute inset-x-0 bottom-0 h-0.5 rounded-full"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FLOATING INTERACTIVE SHOWCASE WINDOW */}
            <div className="relative flex items-center justify-center gap-2 sm:gap-5">
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handlePrevSlide}
                aria-label="Pratinjau fitur sebelumnya"
                className="hidden sm:flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-[#0d121d]/90 text-white hover:bg-[#171f30] transition-colors shrink-0 cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>

              <motion.div
                style={{
                  transform: `translate3d(${pointerOffset.x * 4}px, ${pointerOffset.y * 2.5}px, 0)`,
                  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="w-full max-w-4xl rounded-2xl border border-white/35 bg-white text-slate-900 shadow-2xl overflow-hidden"
              >
                {/* Crisp Browser/App Top Chrome */}
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 truncate">
                    <ShieldCheck className="h-4 w-4 text-[#e0231c] shrink-0" />
                    <span className="truncate">{currentSlide.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={handlePrevSlide}
                      aria-label="Geser kiri"
                      className="sm:hidden h-8 w-8 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextSlide}
                      aria-label="Geser kanan"
                      className="sm:hidden h-8 w-8 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenLogin?.('siswa')}
                      style={{ backgroundColor: KAGE_8B_TYPOGRAPHY.primaryColor }}
                      className="rounded-lg px-3 py-1.5 text-[11px] font-bold text-white hover:brightness-110 transition-all whitespace-nowrap cursor-pointer"
                    >
                      Buka Asli →
                    </button>
                  </div>
                </div>

                {/* Animated Interactive Preview Body */}
                <div className="p-4 sm:p-6 min-h-[265px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide.id}
                      initial={{ opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -14 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {currentSlide.id === 'chat' && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                          <div className="md:col-span-4 border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                            <div className="text-[11px] font-bold text-slate-500">
                              Saluran Kelas 8B
                            </div>
                            {[
                              {
                                name: 'Grup Utama Kelas 8B',
                                snippet: 'Live 24/7 tanpa delay',
                                active: true,
                              },
                              {
                                name: 'Ibu Aida (Wali Kelas)',
                                snippet: 'Arahan persiapan PAS',
                                active: false,
                              },
                              {
                                name: 'Sekretaris 1 & 2',
                                snippet: 'Rekap presensi & PR',
                                active: false,
                              },
                            ].map((ch) => (
                              <div
                                key={ch.name}
                                className={`rounded-lg p-2.5 text-xs border ${
                                  ch.active
                                    ? 'bg-white border-slate-300 shadow-2xs'
                                    : 'bg-transparent border-transparent text-slate-600'
                                }`}
                              >
                                <div className="font-bold text-slate-900 truncate">{ch.name}</div>
                                <div className="text-[11px] text-slate-500 truncate">
                                  {ch.snippet}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="md:col-span-8 border border-slate-200 rounded-xl p-4 bg-white flex flex-col justify-between space-y-3">
                            <div className="space-y-2.5">
                              <div className="rounded-xl bg-slate-900 text-white p-3 space-y-1">
                                <div className="flex items-center justify-between text-[11px] text-amber-300 font-semibold">
                                  <span>Ibu Aida, S.Pd. · Wali Kelas 8B</span>
                                  <span className="font-mono text-slate-300">07:15 WIB</span>
                                </div>
                                <p className="text-xs text-slate-100 leading-relaxed">
                                  Anak-anak 8B, silakan cek latihan Matematika halaman 148 dan
                                  kumpulkan Koin Kuis Kurikulum Merdeka hari ini ya.
                                </p>
                              </div>

                              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-1">
                                <div className="flex items-center justify-between text-[11px] text-[#e0231c] font-semibold">
                                  <span>Ketua Kelas 8B · Pelataran Kage 8B</span>
                                  <span className="font-mono text-slate-400">07:17 WIB</span>
                                </div>
                                <p className="text-xs text-slate-700">
                                  Siap Bu! Teman-teman regu piket juga sudah merapikan kelas pagi
                                  ini.
                                </p>
                              </div>

                              {previewMsgDone && (
                                <motion.div
                                  initial={{ scale: 0.96, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-900 font-medium"
                                >
                                  Simulasi pesan terkirim! Masuk dengan akun Kelas 8B untuk ikut
                                  mengobrol secara real-time 24/7.
                                </motion.div>
                              )}
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                              <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                                <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                                <span>Tersinkronisasi otomatis untuk seluruh teman 8B</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => setPreviewMsgDone(true)}
                                className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-slate-800 cursor-pointer shrink-0"
                              >
                                <Send className="h-3 w-3" />
                                <span>Uji Kirim</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {currentSlide.id === 'tugas' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                          <div className="rounded-xl border border-slate-200 p-4 space-y-2 bg-slate-50">
                            <div className="text-xs font-bold text-[#e0231c]">
                              {assignmentsCount} Tugas Aktif 8B
                            </div>
                            <div className="text-sm font-bold text-slate-900">
                              Matematika · Pythagoras &amp; Gradien
                            </div>
                            <p className="text-xs text-slate-600">
                              Dilengkapi batas pengumpulan &amp; hadiah +40 Koin setiap selesai.
                            </p>
                          </div>
                          <div className="rounded-xl border border-slate-200 p-4 space-y-2 bg-slate-50">
                            <div className="text-xs font-bold text-emerald-700">
                              Buku Kas Bendahara 1 &amp; 2
                            </div>
                            <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
                              Rp 525.000
                            </div>
                            <p className="text-xs text-slate-600">
                              Transparansi iuran mingguan dan pengeluaran perlengkapan kelas.
                            </p>
                          </div>
                          <div className="rounded-xl border border-slate-200 p-4 space-y-2 bg-slate-50">
                            <div className="text-xs font-bold text-amber-700">
                              Panel Setara 45 Fitur
                            </div>
                            <div className="text-sm font-bold text-slate-900">
                              Owner Web &amp; Ibu Aida
                            </div>
                            <p className="text-xs text-slate-600">
                              Kelola presensi harian, ekspor CSV, dan pengumuman resmi kelas.
                            </p>
                          </div>
                        </div>
                      )}

                      {currentSlide.id === 'akademi' && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          <div className="md:col-span-7 space-y-2">
                            <div className="text-xs font-bold text-[#e0231c] flex items-center gap-1.5">
                              <BookOpen className="h-3.5 w-3.5" />
                              <span>Bank Soal Kelas 8 SMP · Kurikulum Merdeka</span>
                            </div>
                            <h3 className="text-base font-bold text-slate-900">
                              Latihan Matematika, IPA, IPS, Bahasa Indonesia, PPKn &amp; Inggris
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              Setiap jawaban benar dan hafalan kartu Flashcard menambah Koin yang
                              bisa ditukar Banner bertema Kebun Raya Bogor, Kage Sanctuary, dan
                              Senja Pakuan di Toko Eksklusif 8B.
                            </p>
                          </div>
                          <div className="md:col-span-5 rounded-xl bg-slate-900 text-white p-4 space-y-2">
                            <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                              <span className="inline-flex items-center gap-1.5">
                                <Coins className="h-4 w-4" />
                                Hadiah Koleksi
                              </span>
                              <span className="font-mono">6 Banner · 5 Gelar</span>
                            </div>
                            <div className="text-sm font-bold">Mahkota Royal Bogor</div>
                            <div className="text-[11px] text-slate-300">
                              Otomatis tampil pada setiap pesanmu di Live Group Chat 24/7.
                            </div>
                          </div>
                        </div>
                      )}

                      {currentSlide.id === 'pomodoro' && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          <div className="md:col-span-4 rounded-xl bg-slate-900 text-white p-5 text-center space-y-1">
                            <Timer className="h-6 w-6 text-[#e0231c] mx-auto" />
                            <div className="text-3xl font-mono font-bold tabular-nums">25:00</div>
                            <div className="text-[11px] text-emerald-300 font-semibold">
                              +25 Koin / Sesi Fokus
                            </div>
                          </div>
                          <div className="md:col-span-8 space-y-2">
                            <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                              <Sparkles className="h-3.5 w-3.5" />
                              <span>Ruang Belajar Hening · Kage Focus Mode</span>
                            </div>
                            <h3 className="text-base font-bold text-slate-900">
                              Timer Fokus Belajar Pomodoro Kelas 8B
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              Pilih mata pelajaran PR hari ini, nyalakan timer fokus 15 atau 25
                              menit bebas gangguan di HP Android maupun laptop, dan klaim bonus
                              Koin setelah sesi tuntas.
                            </p>
                          </div>
                        </div>
                      )}

                      {currentSlide.id === 'surat' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="rounded-xl border border-slate-200 p-4 space-y-1.5 bg-slate-50">
                            <div className="text-xs font-bold text-[#e0231c] flex items-center gap-1.5">
                              <FileText className="h-3.5 w-3.5" />
                              <span>Surat Izin Digital</span>
                            </div>
                            <div className="text-sm font-bold text-slate-900">
                              Format Resmi ke Wali Kelas Ibu Aida
                            </div>
                            <p className="text-xs text-slate-600">
                              Isi alasan sakit/izin, salin surat otomatis, atau kirim langsung ke
                              rekap presensi &amp; pesan pribadi Bu Aida dalam 1 ketukan.
                            </p>
                          </div>
                          <div className="rounded-xl border border-slate-200 p-4 space-y-1.5 bg-slate-50">
                            <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Papan Kudos &amp; Aspirasi</span>
                            </div>
                            <div className="text-sm font-bold text-slate-900">
                              Apresiasi Teman Piket &amp; Kotak Ide 8B
                            </div>
                            <p className="text-xs text-slate-600">
                              Kirim lencana penghargaan kepada teman yang membantu PR atau petugas
                              piket terbaik, serta sampaikan saran kemajuan kelas.
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleNextSlide}
                aria-label="Pratinjau fitur berikutnya"
                className="hidden sm:flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-[#0d121d]/90 text-white hover:bg-[#171f30] transition-colors shrink-0 cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </div>

            <p className="text-center text-xs text-stone-300 font-normal">
              {currentSlide.caption}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export function KageLandingPage(props: ParallaxScrollingProps) {
  return <ParallaxComponent {...props} />;
}
