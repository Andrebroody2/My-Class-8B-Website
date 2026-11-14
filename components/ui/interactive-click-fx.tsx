'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ClickBurst {
  id: number;
  x: number;
  y: number;
}

const SPARK_ANGLES = [0, 60, 120, 180, 240, 300];

export function InteractiveClickFX() {
  const [bursts, setBursts] = useState<ClickBurst[]>([]);

  const handleGlobalPointerDown = useCallback((e: PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const id = Date.now() + Math.random();
    setBursts((prev) => [...prev.slice(-5), { id, x: e.clientX, y: e.clientY }]);
  }, []);

  useEffect(() => {
    window.addEventListener('pointerdown', handleGlobalPointerDown, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handleGlobalPointerDown);
    };
  }, [handleGlobalPointerDown]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
    >
      <AnimatePresence>
        {bursts.map((burst) => (
          <div
            key={burst.id}
            style={{ left: burst.x, top: burst.y }}
            className="absolute"
          >
            {/* Expanding tactile ring */}
            <motion.div
              initial={{ opacity: 0.75, scale: 0.15 }}
              animate={{ opacity: 0, scale: 1.9 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              onAnimationComplete={() => {
                setBursts((prev) => prev.filter((b) => b.id !== burst.id));
              }}
              className="-ml-5 -mt-5 h-10 w-10 rounded-full border-2 border-amber-500/75 bg-amber-300/15"
            />
            {/* Micro directional sparks */}
            {SPARK_ANGLES.map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const tx = Math.cos(rad) * 22;
              const ty = Math.sin(rad) * 22;
              return (
                <motion.span
                  key={deg}
                  initial={{ opacity: 0.9, x: 0, y: 0, scale: 1 }}
                  animate={{ opacity: 0, x: tx, y: ty, scale: 0.2 }}
                  transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute -ml-0.5 -mt-0.5 h-1.5 w-1.5 rounded-full bg-amber-400"
                />
              );
            })}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
