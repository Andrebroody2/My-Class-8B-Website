'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  Layers,
  Sparkles,
  Sun,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Compass,
  Box,
} from 'lucide-react';

export type CameraPresetId = 'panorama' | 'close_spire' | 'orbit_ring' | 'top_atlas';
export type FinishPresetId = 'gold_pakuan' | 'emerald_bogor' | 'titanium_sains' | 'royal_obsidian';
export type LightingMoodId = 'fajar_bogor' | 'senja_salak' | 'malam_observatorium';

interface CameraPresetConfig {
  id: CameraPresetId;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
}

const CAMERA_PRESETS: CameraPresetConfig[] = [
  {
    id: 'panorama',
    label: 'Panorama 8B',
    position: [0, 5.2, 13.5],
    target: [0, 2.3, 0],
  },
  {
    id: 'close_spire',
    label: 'Inti Kujang & Kristal',
    position: [4.2, 4.1, 6.2],
    target: [0, 3.1, 0],
  },
  {
    id: 'orbit_ring',
    label: 'Cincin 5 Hari Mapel',
    position: [-7.8, 3.6, 8.4],
    target: [0, 2.6, 0],
  },
  {
    id: 'top_atlas',
    label: 'Kompas Pakuan (Atas)',
    position: [0, 13.8, 2.2],
    target: [0, 1.0, 0],
  },
];

const FINISH_PRESETS: Record<
  FinishPresetId,
  {
    label: string;
    primaryHex: number;
    secondaryHex: number;
    accentHex: number;
    coreHex: number;
    metalness: number;
    roughness: number;
  }
> = {
  gold_pakuan: {
    label: 'Emas Pakuan',
    primaryHex: 0xd97706,
    secondaryHex: 0x0f172a,
    accentHex: 0xfbbf24,
    coreHex: 0x38bdf8,
    metalness: 0.88,
    roughness: 0.18,
  },
  emerald_bogor: {
    label: 'Zamrud Kebun Raya',
    primaryHex: 0x059669,
    secondaryHex: 0x064e3b,
    accentHex: 0x34d399,
    coreHex: 0xfde047,
    metalness: 0.78,
    roughness: 0.22,
  },
  titanium_sains: {
    label: 'Titanium Sains',
    primaryHex: 0x94a3b8,
    secondaryHex: 0x1e293b,
    accentHex: 0x38bdf8,
    coreHex: 0x818cf8,
    metalness: 0.92,
    roughness: 0.15,
  },
  royal_obsidian: {
    label: 'Obsidian Royal',
    primaryHex: 0x312e81,
    secondaryHex: 0x090d16,
    accentHex: 0xf59e0b,
    coreHex: 0xf43f5e,
    metalness: 0.84,
    roughness: 0.2,
  },
};

const LIGHTING_MOODS: Record<
  LightingMoodId,
  {
    label: string;
    skyHex: number;
    fogHex: number;
    keyHex: number;
    keyIntensity: number;
    hemiSkyHex: number;
    hemiGroundHex: number;
    hemiIntensity: number;
    rimHex: number;
    rimIntensity: number;
  }
> = {
  fajar_bogor: {
    label: 'Fajar Bogor',
    skyHex: 0x0c192c,
    fogHex: 0x0c192c,
    keyHex: 0xfff3d1,
    keyIntensity: 2.8,
    hemiSkyHex: 0x7dd3fc,
    hemiGroundHex: 0x064e3b,
    hemiIntensity: 1.15,
    rimHex: 0x38bdf8,
    rimIntensity: 1.9,
  },
  senja_salak: {
    label: 'Senja Salak',
    skyHex: 0x1a1025,
    fogHex: 0x1a1025,
    keyHex: 0xfdba74,
    keyIntensity: 3.1,
    hemiSkyHex: 0xf472b6,
    hemiGroundHex: 0x1e1b4b,
    hemiIntensity: 1.1,
    rimHex: 0xf59e0b,
    rimIntensity: 2.2,
  },
  malam_observatorium: {
    label: 'Malam Observatorium',
    skyHex: 0x060b16,
    fogHex: 0x060b16,
    keyHex: 0xe0f2fe,
    keyIntensity: 2.4,
    hemiSkyHex: 0x38bdf8,
    hemiGroundHex: 0x0f172a,
    hemiIntensity: 0.95,
    rimHex: 0x818cf8,
    rimIntensity: 2.4,
  },
};

const SUBJECT_ORBITS = [
  { day: 'Senin', subjects: 'PKN · MTK · IPA · Sunda', color: 0xf59e0b, radius: 4.5, speed: 0.55 },
  { day: 'Selasa', subjects: 'MTK · IPA · BK · PAI', color: 0x10b981, radius: 5.2, speed: -0.45 },
  { day: 'Rabu', subjects: 'PJOK · SBK · B. Inggris', color: 0x38bdf8, radius: 5.9, speed: 0.38 },
  { day: 'Kamis', subjects: 'B. Indo · IPS', color: 0xa855f7, radius: 6.6, speed: -0.32 },
  { day: 'Jumat', subjects: 'Informatika · B. Indo', color: 0xf43f5e, radius: 7.3, speed: 0.28 },
];

// Pre-allocated math scratch objects outside the render loop (Zero GC allocation per frame)
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _dummyMatrix = new THREE.Matrix4();
const _dummyPos = new THREE.Vector3();
const _dummyQuat = new THREE.Quaternion();
const _dummyScale = new THREE.Vector3();
const _dummyEuler = new THREE.Euler();
const _tempColor = new THREE.Color();

function createProceduralCompassTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#09111f';
    ctx.fillRect(0, 0, 1024, 1024);

    const cx = 512;
    const cy = 512;

    // Concentric technical rings
    const radii = [480, 440, 380, 310, 230, 140];
    radii.forEach((r, idx) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = idx % 2 === 0 ? 'rgba(251, 191, 36, 0.55)' : 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = idx === 0 ? 6 : 3;
      ctx.stroke();
    });

    // Degree tick marks
    for (let deg = 0; deg < 360; deg += 5) {
      const rad = (deg * Math.PI) / 180;
      const inner = deg % 30 === 0 ? 405 : deg % 15 === 0 ? 420 : 430;
      const outer = 440;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(rad) * inner, cy + Math.sin(rad) * inner);
      ctx.lineTo(cx + Math.cos(rad) * outer, cy + Math.sin(rad) * outer);
      ctx.strokeStyle = deg % 30 === 0 ? 'rgba(251, 191, 36, 0.85)' : 'rgba(148, 163, 184, 0.4)';
      ctx.lineWidth = deg % 30 === 0 ? 4 : 2;
      ctx.stroke();
    }

    // Cardinal spokes
    for (let i = 0; i < 8; i++) {
      const rad = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(rad) * 140, cy + Math.sin(rad) * 140);
      ctx.lineTo(cx + Math.cos(rad) * 440, cy + Math.sin(rad) * 440);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.28)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

function createProceduralBumpTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y += 4) {
      const shade = 118 + ((y * 7) % 24);
      ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
      ctx.fillRect(0, y, 256, 2);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export interface Bogor3DMasterpieceStageProps {
  onSelectDayFrom3D?: (day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat') => void;
}

export function Bogor3DMasterpieceStage({ onSelectDayFrom3D }: Bogor3DMasterpieceStageProps) {
  const canvasMountRef = useRef<HTMLDivElement>(null);

  // Interactive HUD state
  const [cameraPreset, setCameraPreset] = useState<CameraPresetId>('panorama');
  const [finishPreset, setFinishPreset] = useState<FinishPresetId>('gold_pakuan');
  const [lightingMood, setLightingMood] = useState<LightingMoodId>('fajar_bogor');
  const [explodedPercent, setExplodedPercent] = useState<number>(0);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);
  const [selectedOrbitIndex, setSelectedOrbitIndex] = useState<number>(0);

  // Mutable refs for the WebGL loop so React state updates never recreate the scene
  const stateRef = useRef({
    explodedTarget: 0,
    explodedCurrent: 0,
    cameraPreset: 'panorama' as CameraPresetId,
    finishPreset: 'gold_pakuan' as FinishPresetId,
    lightingMood: 'fajar_bogor' as LightingMoodId,
    cameraAnimating: false,
    orbitTime: 0,
  });

  const triggerRenderRef = useRef<(() => void) | null>(null);
  const applyVisualConfigRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    stateRef.current.explodedTarget = explodedPercent / 100;
    triggerRenderRef.current?.();
  }, [explodedPercent]);

  useEffect(() => {
    stateRef.current.cameraPreset = cameraPreset;
    stateRef.current.cameraAnimating = true;
    triggerRenderRef.current?.();
  }, [cameraPreset]);

  useEffect(() => {
    stateRef.current.finishPreset = finishPreset;
    stateRef.current.lightingMood = lightingMood;
    applyVisualConfigRef.current?.();
    triggerRenderRef.current?.();
  }, [finishPreset, lightingMood]);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    // 1. Software WebGL detection from GPU renderer string (never user-agent)
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

    const width = container.clientWidth || 1100;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    const initialMood = LIGHTING_MOODS[stateRef.current.lightingMood];
    scene.background = new THREE.Color(initialMood.skyHex);
    scene.fog = new THREE.FogExp2(initialMood.fogHex, 0.024);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 120);
    camera.position.set(0, 5.2, 13.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Mandatory Studio Environment Reflection (RoomEnvironment + PMREMGenerator)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const compassTexture = createProceduralCompassTexture(maxAniso);
    const bumpTexture = createProceduralBumpTexture(maxAniso);

    // 3. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 2.3, 0);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.minDistance = 4.2;
    controls.maxDistance = 24;

    // 4. Balanced 3-Point Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(
      initialMood.hemiSkyHex,
      initialMood.hemiGroundHex,
      initialMood.hemiIntensity
    );
    hemiLight.position.set(0, 18, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(initialMood.keyHex, initialMood.keyIntensity);
    keyLight.position.set(9, 14, 10);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 35;
    const d = 11;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(initialMood.rimHex, initialMood.rimIntensity);
    rimLight.position.set(-10, 8, -9);
    scene.add(rimLight);

    // 5. Shared PBR Materials
    const initialFinish = FINISH_PRESETS[stateRef.current.finishPreset];

    const primaryMetalMat = new THREE.MeshPhysicalMaterial({
      color: initialFinish.primaryHex,
      metalness: initialFinish.metalness,
      roughness: initialFinish.roughness,
      bumpMap: bumpTexture,
      bumpScale: 0.015,
      clearcoat: 0.65,
      clearcoatRoughness: 0.15,
    });

    const secondaryDarkMat = new THREE.MeshStandardMaterial({
      color: initialFinish.secondaryHex,
      metalness: 0.45,
      roughness: 0.55,
      bumpMap: bumpTexture,
      bumpScale: 0.02,
    });

    const accentTrimMat = new THREE.MeshStandardMaterial({
      color: initialFinish.accentHex,
      metalness: 0.92,
      roughness: 0.14,
    });

    const crystalCoreMat = new THREE.MeshPhysicalMaterial({
      color: initialFinish.coreHex,
      metalness: 0.08,
      roughness: 0.08,
      transmission: isSoftwareGl ? 0 : 0.9,
      transparent: true,
      opacity: isSoftwareGl ? 0.82 : 1.0,
      ior: 1.65,
      thickness: 1.4,
      clearcoat: 1.0,
      emissive: new THREE.Color(initialFinish.coreHex),
      emissiveIntensity: 0.25,
    });

    // 6. Ground Terrace & Compass Chapter Ring (Disjoint Y heights + Contact Shadow)
    const groundGroup = new THREE.Group();
    scene.add(groundGroup);

    const terrainGeo = new THREE.CylinderGeometry(28, 30, 0.6, 48);
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x0b1524,
      roughness: 0.85,
      metalness: 0.1,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.position.y = -0.3;
    terrainMesh.receiveShadow = true;
    groundGroup.add(terrainMesh);

    const compassDiscGeo = new THREE.CircleGeometry(8.5, 64);
    const compassDiscMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: compassTexture,
      roughness: 0.4,
      metalness: 0.3,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const compassDisc = new THREE.Mesh(compassDiscGeo, compassDiscMat);
    compassDisc.rotation.x = -Math.PI / 2;
    compassDisc.position.y = 0.02;
    compassDisc.receiveShadow = true;
    groundGroup.add(compassDisc);

    // Contact Shadow Grounding Disc
    const shadowDiscGeo = new THREE.CircleGeometry(3.8, 32);
    const shadowDiscMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });
    const shadowDisc = new THREE.Mesh(shadowDiscGeo, shadowDiscMat);
    shadowDisc.rotation.x = -Math.PI / 2;
    shadowDisc.position.y = 0.035;
    groundGroup.add(shadowDisc);

    // 7. Composite 10-Part Procedural Hero Monument: Astrolab & Tugu Kujang Kelas 8B
    const monumentGroup = new THREE.Group();
    scene.add(monumentGroup);

    // Part 1: Stepped Octagonal Base Tier
    const baseTier1 = new THREE.Mesh(
      new THREE.CylinderGeometry(2.6, 3.0, 0.55, 8),
      secondaryDarkMat
    );
    baseTier1.position.y = 0.275;
    baseTier1.castShadow = true;
    baseTier1.receiveShadow = true;
    monumentGroup.add(baseTier1);

    // Part 2: Mid Inscription Plinth
    const baseTier2 = new THREE.Mesh(
      new THREE.CylinderGeometry(1.95, 2.35, 0.65, 8),
      primaryMetalMat
    );
    baseTier2.position.y = 0.875;
    baseTier2.castShadow = true;
    baseTier2.receiveShadow = true;
    monumentGroup.add(baseTier2);

    // Part 3: Upper Beveled Collar Ring
    const baseCollar = new THREE.Mesh(
      new THREE.TorusGeometry(1.88, 0.11, 16, 48),
      accentTrimMat
    );
    baseCollar.rotation.x = Math.PI / 2;
    baseCollar.position.y = 1.22;
    monumentGroup.add(baseCollar);

    // Part 4: 8 Accent Brass Finial Pillars around Plinth
    const finialPillarsGroup = new THREE.Group();
    const pillarGeo = new THREE.CylinderGeometry(0.09, 0.12, 0.9, 12);
    const pillarCapGeo = new THREE.SphereGeometry(0.14, 12, 12);
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const px = Math.cos(angle) * 2.25;
      const pz = Math.sin(angle) * 2.25;
      const pSub = new THREE.Group();
      const shaft = new THREE.Mesh(pillarGeo, accentTrimMat);
      shaft.position.y = 0.45;
      const cap = new THREE.Mesh(pillarCapGeo, primaryMetalMat);
      cap.position.y = 0.95;
      pSub.add(shaft, cap);
      pSub.position.set(px, 0.55, pz);
      finialPillarsGroup.add(pSub);
    }
    monumentGroup.add(finialPillarsGroup);

    // Part 5: Sculpted Kujang Spire Blade (ExtrudeGeometry with bevels)
    const kujangShape = new THREE.Shape();
    kujangShape.moveTo(0, 0);
    kujangShape.bezierCurveTo(0.55, 0.5, 0.68, 1.4, 0.28, 2.2);
    kujangShape.bezierCurveTo(0.45, 2.55, 0.22, 3.05, 0, 3.35);
    kujangShape.bezierCurveTo(-0.28, 2.8, -0.52, 2.0, -0.22, 1.35);
    kujangShape.bezierCurveTo(-0.48, 0.85, -0.35, 0.3, 0, 0);

    const kujangGeo = new THREE.ExtrudeGeometry(kujangShape, {
      depth: 0.22,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.06,
      bevelThickness: 0.06,
    });
    kujangGeo.center();
    const kujangSpire = new THREE.Mesh(kujangGeo, primaryMetalMat);
    kujangSpire.position.y = 3.1;
    kujangSpire.castShadow = true;
    monumentGroup.add(kujangSpire);

    // Part 6: Crystalline Knowledge Core (Icosahedron + Inner Octahedron)
    const coreGroup = new THREE.Group();
    const outerCrystal = new THREE.Mesh(new THREE.IcosahedronGeometry(0.68, 1), crystalCoreMat);
    const innerSeed = new THREE.Mesh(new THREE.OctahedronGeometry(0.38, 0), accentTrimMat);
    coreGroup.add(outerCrystal, innerSeed);
    coreGroup.position.y = 3.15;
    monumentGroup.add(coreGroup);

    // Part 7, 8, 9: Three Concentric Astrolabe Gimbal Rings
    const outerMeridianRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.15, 0.085, 20, 64),
      primaryMetalMat
    );
    outerMeridianRing.position.y = 3.15;
    outerMeridianRing.castShadow = true;
    monumentGroup.add(outerMeridianRing);

    const middleEquatorialRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.72, 0.07, 18, 56),
      accentTrimMat
    );
    middleEquatorialRing.position.y = 3.15;
    middleEquatorialRing.rotation.x = Math.PI / 3;
    monumentGroup.add(middleEquatorialRing);

    const innerGyroRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.32, 0.055, 16, 48),
      secondaryDarkMat
    );
    innerGyroRing.position.y = 3.15;
    innerGyroRing.rotation.y = Math.PI / 4;
    monumentGroup.add(innerGyroRing);

    // Part 10: Crown Star Finial at the Apex
    const crownGroup = new THREE.Group();
    const crownOcta = new THREE.Mesh(new THREE.OctahedronGeometry(0.32, 0), accentTrimMat);
    const crownHalo = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.035, 12, 32), primaryMetalMat);
    crownGroup.add(crownOcta, crownHalo);
    crownGroup.position.y = 5.65;
    monumentGroup.add(crownGroup);

    // 8. Five Orbiting Curriculum Satellites (Senin - Jumat)
    const satellitesGroup = new THREE.Group();
    scene.add(satellitesGroup);

    const satelliteNodes: {
      group: THREE.Group;
      radius: number;
      speed: number;
      baseAngle: number;
      baseY: number;
    }[] = [];

    const satBodyGeo = new THREE.DodecahedronGeometry(0.32, 0);
    const satRingGeo = new THREE.TorusGeometry(0.48, 0.035, 12, 28);
    const satCapGeo = new THREE.ConeGeometry(0.14, 0.25, 8);

    SUBJECT_ORBITS.forEach((orb, idx) => {
      // Orbit track line on floor
      const trackRingGeo = new THREE.RingGeometry(orb.radius - 0.025, orb.radius + 0.025, 64);
      const trackRingMat = new THREE.MeshBasicMaterial({
        color: orb.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.28,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      });
      const trackMesh = new THREE.Mesh(trackRingGeo, trackRingMat);
      trackMesh.rotation.x = -Math.PI / 2;
      trackMesh.position.y = 0.04;
      groundGroup.add(trackMesh);

      // Multi-part satellite node (3 parts per satellite)
      const satGroup = new THREE.Group();
      const satMat = new THREE.MeshStandardMaterial({
        color: orb.color,
        metalness: 0.65,
        roughness: 0.22,
        emissive: new THREE.Color(orb.color),
        emissiveIntensity: 0.18,
      });
      const bodyMesh = new THREE.Mesh(satBodyGeo, satMat);
      const eqRing = new THREE.Mesh(satRingGeo, accentTrimMat);
      eqRing.rotation.x = Math.PI / 2.4;
      const topCap = new THREE.Mesh(satCapGeo, primaryMetalMat);
      topCap.position.y = 0.42;

      satGroup.add(bodyMesh, eqRing, topCap);

      const baseAngle = (idx * Math.PI * 2) / SUBJECT_ORBITS.length;
      const baseY = 1.35 + idx * 0.28;
      satGroup.position.set(
        Math.cos(baseAngle) * orb.radius,
        baseY,
        Math.sin(baseAngle) * orb.radius
      );
      satellitesGroup.add(satGroup);

      satelliteNodes.push({
        group: satGroup,
        radius: orb.radius,
        speed: orb.speed,
        baseAngle,
        baseY,
      });
    });

    // 9. Kebun Raya Bogor Botanical Perimeter (InstancedMesh > 24 instances with scale & tint variation)
    const treeCount = 28;
    const trunkGeo = new THREE.CylinderGeometry(0.14, 0.22, 1.2, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.85 });
    const canopyGeo = new THREE.ConeGeometry(0.85, 2.4, 9);
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.65 });

    const instancedTrunks = new THREE.InstancedMesh(trunkGeo, trunkMat, treeCount);
    const instancedCanopies = new THREE.InstancedMesh(canopyGeo, canopyMat, treeCount);

    for (let i = 0; i < treeCount; i++) {
      const angle = (i / treeCount) * Math.PI * 2;
      const radiusOffset = 10.8 + ((i * 7) % 5) * 1.15;
      const tx = Math.cos(angle) * radiusOffset;
      const tz = Math.sin(angle) * radiusOffset;
      const scaleVar = 0.85 + ((i * 13) % 30) / 100; // ±15% scale variation

      _dummyPos.set(tx, 0.6 * scaleVar, tz);
      _dummyEuler.set(0, angle, 0);
      _dummyQuat.setFromEuler(_dummyEuler);
      _dummyScale.set(scaleVar, scaleVar, scaleVar);
      _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
      instancedTrunks.setMatrixAt(i, _dummyMatrix);

      _dummyPos.set(tx, 2.1 * scaleVar, tz);
      _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
      instancedCanopies.setMatrixAt(i, _dummyMatrix);

      const greenHue = 0.36 + ((i % 5) - 2) * 0.015;
      _tempColor.setHSL(greenHue, 0.62, 0.26 + (i % 3) * 0.04);
      instancedCanopies.setColorAt(i, _tempColor);
    }
    instancedTrunks.instanceMatrix.needsUpdate = true;
    instancedCanopies.instanceMatrix.needsUpdate = true;
    if (instancedCanopies.instanceColor) instancedCanopies.instanceColor.needsUpdate = true;
    instancedTrunks.computeBoundingSphere();
    instancedCanopies.computeBoundingSphere();
    scene.add(instancedTrunks, instancedCanopies);

    // Update materials & lighting helper
    applyVisualConfigRef.current = () => {
      const f = FINISH_PRESETS[stateRef.current.finishPreset];
      primaryMetalMat.color.setHex(f.primaryHex);
      primaryMetalMat.metalness = f.metalness;
      primaryMetalMat.roughness = f.roughness;
      secondaryDarkMat.color.setHex(f.secondaryHex);
      accentTrimMat.color.setHex(f.accentHex);
      crystalCoreMat.color.setHex(f.coreHex);
      crystalCoreMat.emissive.setHex(f.coreHex);

      const m = LIGHTING_MOODS[stateRef.current.lightingMood];
      scene.background = new THREE.Color(m.skyHex);
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.setHex(m.fogHex);
      }
      keyLight.color.setHex(m.keyHex);
      keyLight.intensity = m.keyIntensity;
      hemiLight.color.setHex(m.hemiSkyHex);
      hemiLight.groundColor.setHex(m.hemiGroundHex);
      hemiLight.intensity = m.hemiIntensity;
      rimLight.color.setHex(m.rimHex);
      rimLight.intensity = m.rimIntensity;
    };

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 10. Frame Pacing & Render Loop (Software WebGL Guard + Smooth Exponential Damping)
    let frameId = 0;
    let isDisposed = false;
    let renderBusy = false;
    let renderDirty = false;
    let lastTimeMs = performance.now();

    function afterDraw(cb: () => void) {
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

    function stepScene(dt: number): boolean {
      let needsMoreFrames = false;

      // Smoothly damp exploded view separation
      const diffExplode = Math.abs(
        stateRef.current.explodedTarget - stateRef.current.explodedCurrent
      );
      if (diffExplode > 0.002) {
        stateRef.current.explodedCurrent = THREE.MathUtils.damp(
          stateRef.current.explodedCurrent,
          stateRef.current.explodedTarget,
          6,
          dt
        );
        needsMoreFrames = true;
      } else {
        stateRef.current.explodedCurrent = stateRef.current.explodedTarget;
      }

      const ex = stateRef.current.explodedCurrent;
      baseTier1.position.y = 0.275;
      baseTier2.position.y = 0.875 + ex * 0.45;
      baseCollar.position.y = 1.22 + ex * 0.85;
      finialPillarsGroup.position.y = ex * 0.65;
      kujangSpire.position.y = 3.1 + ex * 1.45;
      coreGroup.position.y = 3.15 + ex * 2.25;
      outerMeridianRing.position.y = 3.15 + ex * 1.8;
      middleEquatorialRing.position.y = 3.15 + ex * 2.05;
      innerGyroRing.position.y = 3.15 + ex * 2.35;
      crownGroup.position.y = 5.65 + ex * 3.4;

      // Smoothly damp camera preset transitions
      if (stateRef.current.cameraAnimating) {
        const preset =
          CAMERA_PRESETS.find((p) => p.id === stateRef.current.cameraPreset) || CAMERA_PRESETS[0];
        _targetCamPos.set(preset.position[0], preset.position[1], preset.position[2]);
        _targetLookAt.set(preset.target[0], preset.target[1], preset.target[2]);

        camera.position.lerp(_targetCamPos, 1 - Math.exp(-6 * dt));
        controls.target.lerp(_targetLookAt, 1 - Math.exp(-6 * dt));

        if (
          camera.position.distanceToSquared(_targetCamPos) < 0.01 &&
          controls.target.distanceToSquared(_targetLookAt) < 0.01
        ) {
          stateRef.current.cameraAnimating = false;
        } else {
          needsMoreFrames = true;
        }
      }

      // Advance orbital rotation
      const advanceDt = isSoftwareGl ? 0.04 : dt;
      stateRef.current.orbitTime += advanceDt;
      const t = stateRef.current.orbitTime;

      outerMeridianRing.rotation.y = t * 0.32;
      middleEquatorialRing.rotation.z = t * 0.45;
      innerGyroRing.rotation.x = t * 0.58;
      coreGroup.rotation.y = -t * 0.65;
      crownGroup.rotation.y = t * 0.8;

      satelliteNodes.forEach((sat, idx) => {
        const angle = sat.baseAngle + t * sat.speed;
        sat.group.position.x = Math.cos(angle) * sat.radius;
        sat.group.position.z = Math.sin(angle) * sat.radius;
        sat.group.position.y = sat.baseY + Math.sin(t * 1.6 + idx) * 0.16 + ex * (0.6 + idx * 0.2);
        sat.group.rotation.y = angle + t;
      });

      controls.update();
      return needsMoreFrames;
    }

    function requestRender() {
      if (isDisposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        if (isDisposed) return;
        renderDirty = false;
        const nowMs = performance.now();
        const dt = Math.min((nowMs - lastTimeMs) / 1000, 0.1) || 0.016;
        lastTimeMs = nowMs;
        const animating = stepScene(dt);
        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (renderDirty || animating || !isSoftwareGl) {
            requestRender();
          }
        };

        if (isSoftwareGl) {
          afterDraw(done);
        } else {
          done();
        }
      });
    }

    triggerRenderRef.current = requestRender;

    const handleControlStart = () => {
      stateRef.current.cameraAnimating = false;
    };
    const handleControlChange = () => {
      if (isSoftwareGl) {
        requestRender();
      }
    };
    controls.addEventListener('start', handleControlStart);
    controls.addEventListener('change', handleControlChange);

    const handleResize = () => {
      if (!container || isDisposed) return;
      const newW = container.clientWidth || 1100;
      const newH = container.clientHeight || 600;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
      requestRender();
    };
    window.addEventListener('resize', handleResize);

    // Kick off initial render
    requestRender();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      controls.removeEventListener('start', handleControlStart);
      controls.removeEventListener('change', handleControlChange);
      controls.dispose();
      compassTexture.dispose();
      bumpTexture.dispose();
      envTarget.dispose();
      renderer.dispose();
    };
  }, []);

  const currentOrbit = SUBJECT_ORBITS[selectedOrbitIndex] || SUBJECT_ORBITS[0];

  return (
    <section
      id="studio-3d-8b"
      aria-label="Observatorium 3D Interaktif Kelas 8B SMPN 18 Kota Bogor"
      className="space-y-5 border-b border-slate-200 pb-16"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-indigo-700 flex items-center gap-1.5">
            <Box className="h-3.5 w-3.5" />
            <span>Interactive 3D WebGL Spatial Showcase · Real-Time PBR Studio</span>
          </div>
          <h2
            className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900"
            style={{ textWrap: 'balance' }}
          >
            Monumen 3D Astrolab &amp; Kujang Pakuan Kelas 8B
          </h2>
        </div>

        <p className="text-xs text-slate-600 max-w-md">
          Putar 360° dengan mouse/sentuhan jari, pisahkan 10 komponen mekanis melalui slider{' '}
          <strong className="text-slate-900">Exploded View</strong>, atau pilih orbit mata pelajaran
          Senin–Jumat.
        </p>
      </div>

      {/* 3D VIEWPORT CONTAINER WITH UNOBSTRUCTED CENTER & COLLAPSIBLE BOTTOM DOCK */}
      <div className="relative w-full h-[540px] sm:h-[620px] rounded-3xl overflow-hidden border border-slate-900 bg-[#09111f] shadow-xl">
        {/* Dedicated Empty WebGL Mount Container (Outside React HUD overlays) */}
        <div
          ref={canvasMountRef}
          data-testid="bogor-3d-canvas-mount"
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        />

        {/* Minimal Top-Left Spec Badge (Solid RGBA surface, zero backdrop-filter over WebGL) */}
        <div className="pointer-events-none absolute top-4 left-4 right-4 flex flex-wrap items-start justify-between gap-3 z-10">
          <div
            style={{ backgroundColor: 'rgba(9, 17, 31, 0.88)' }}
            className="pointer-events-auto rounded-2xl border border-slate-700/80 px-4 py-2.5 text-white space-y-1 max-w-xs"
          >
            <div className="flex items-center gap-2 text-[11px] font-mono text-amber-300">
              <Compass className="h-3.5 w-3.5 shrink-0" />
              <span>ASTROLAB-8B · 10-Part Procedural PBR</span>
            </div>
            <div className="text-xs font-bold text-white truncate">
              Orbit Aktif: Hari {currentOrbit.day} ({currentOrbit.subjects})
            </div>
          </div>

          {/* Quick Day Orbit Selector Pills (Top-Right Minimal Strip) */}
          <div
            style={{ backgroundColor: 'rgba(9, 17, 31, 0.88)' }}
            className="pointer-events-auto flex items-center gap-1 rounded-xl border border-slate-700/80 p-1 overflow-x-auto max-w-full no-scrollbar"
          >
            {SUBJECT_ORBITS.map((orb, idx) => {
              const active = selectedOrbitIndex === idx;
              return (
                <button
                  key={orb.day}
                  type="button"
                  onClick={() => {
                    setSelectedOrbitIndex(idx);
                    setCameraPreset('orbit_ring');
                    onSelectDayFrom3D?.(
                      orb.day as 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat'
                    );
                  }}
                  className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  {orb.day}
                </button>
              );
            })}
          </div>
        </div>

        {/* UNIFIED COLLAPSIBLE BOTTOM CONTROL DOCK (ZERO CENTER VIEWPORT OCCLUSION) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex flex-col items-center px-3">
          {/* Collapse / Expand Cinema Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsDockCollapsed((prev) => !prev)}
            style={{ backgroundColor: 'rgba(9, 17, 31, 0.92)' }}
            className="pointer-events-auto mb-2 inline-flex items-center gap-1.5 rounded-full border border-slate-700 px-3.5 py-1.5 text-[11px] font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            {isDockCollapsed ? (
              <>
                <ChevronUp className="h-3.5 w-3.5 text-amber-400" />
                <span>Tampilkan Kontrol 3D</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5 text-amber-400" />
                <span>Mode Sinema Penuh (Sembunyikan Dock)</span>
              </>
            )}
          </button>

          <AnimatePresence initial={false}>
            {!isDockCollapsed && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                style={{ backgroundColor: 'rgba(9, 17, 31, 0.92)' }}
                className="pointer-events-auto w-full max-w-[920px] rounded-2xl border border-slate-700/90 p-3.5 sm:p-4 text-white shadow-2xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
                  {/* 1. Camera Preset Selector (4 cols) */}
                  <div className="md:col-span-4 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold">
                      <span className="inline-flex items-center gap-1">
                        <Camera className="h-3 w-3 text-amber-400" />
                        <span>Sudut Kamera 3D</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setCameraPreset('panorama');
                          setExplodedPercent(0);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] text-amber-300 hover:underline cursor-pointer"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Reset</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {CAMERA_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setCameraPreset(preset.id)}
                          className={`min-h-[34px] rounded-lg px-2.5 py-1 text-[11px] font-semibold truncate transition-colors cursor-pointer ${
                            cameraPreset === preset.id
                              ? 'bg-white text-slate-950 font-bold'
                              : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Exploded View Slider (3 cols) */}
                  <div className="md:col-span-3 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold">
                      <label htmlFor="exploded-3d-slider" className="inline-flex items-center gap-1">
                        <Layers className="h-3 w-3 text-sky-400" />
                        <span>Exploded View</span>
                      </label>
                      <span className="font-mono text-amber-300 tabular-nums">
                        {explodedPercent}%
                      </span>
                    </div>
                    <input
                      id="exploded-3d-slider"
                      type="range"
                      min={0}
                      max={100}
                      value={explodedPercent}
                      onChange={(e) => setExplodedPercent(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Utuh (0%)</span>
                      <span>Terurai (100%)</span>
                    </div>
                  </div>

                  {/* 3. Material Finish Swatches (3 cols) */}
                  <div className="md:col-span-3 space-y-1.5">
                    <div className="text-[11px] text-slate-300 font-semibold flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-emerald-400" />
                      <span>Material &amp; Lapisan PBR</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(Object.keys(FINISH_PRESETS) as FinishPresetId[]).map((fKey) => (
                        <button
                          key={fKey}
                          type="button"
                          onClick={() => setFinishPreset(fKey)}
                          className={`min-h-[34px] rounded-lg px-2 py-1 text-[11px] font-semibold truncate transition-colors cursor-pointer ${
                            finishPreset === fKey
                              ? 'bg-amber-400 text-slate-950 font-bold'
                              : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white'
                          }`}
                        >
                          {FINISH_PRESETS[fKey].label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4. Lighting Mood Selector (2 cols) */}
                  <div className="md:col-span-2 space-y-1.5">
                    <div className="text-[11px] text-slate-300 font-semibold flex items-center gap-1">
                      <Sun className="h-3 w-3 text-amber-300" />
                      <span>Cahaya</span>
                    </div>
                    <div className="flex md:flex-col gap-1">
                      {(Object.keys(LIGHTING_MOODS) as LightingMoodId[]).map((mKey) => (
                        <button
                          key={mKey}
                          type="button"
                          onClick={() => setLightingMood(mKey)}
                          className={`min-h-[28px] flex-1 rounded-lg px-2 py-0.5 text-[10px] font-semibold truncate transition-colors cursor-pointer ${
                            lightingMood === mKey
                              ? 'bg-sky-400 text-slate-950 font-bold'
                              : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {LIGHTING_MOODS[mKey].label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
