'use client';

import React, { useEffect, useState, useCallback } from 'react';
import QRCode from 'qrcode';
import { ArrowRight } from 'lucide-react';
import { sound } from '@/lib/sound';

const QR_URL = 'https://os.platesight.in/';
const QUIET_ZONE_MODULES = 4;

interface DarkModule {
  id: number;
  row: number;
  col: number;
  delay: number;
}

interface QRData {
  size: number;
  numCells: number;
  modules: DarkModule[];
}

function getQRData(): QRData {
  const qr = QRCode.create(QR_URL, { errorCorrectionLevel: 'M' });
  const size = qr.modules.size;
  const darkModules: { row: number; col: number }[] = [];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (qr.modules.get(r, c)) {
        darkModules.push({ row: r, col: c });
      }
    }
  }

  // Deterministic seeded shuffle to prevent hydration mismatches
  const count = darkModules.length;
  const order = Array.from({ length: count }, (_, i) => i);
  let seed = 42;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const temp = order[i];
    order[i] = order[j];
    order[j] = temp;
  }

  // Stagger reveal delays across 1.75s (from 0.05s to 1.80s)
  const modulesWithDelay: DarkModule[] = darkModules.map((m, idx) => ({
    id: idx,
    row: m.row,
    col: m.col,
    delay: Number((0.05 + (order[idx] / count) * 1.75).toFixed(3)),
  }));

  return {
    size,
    numCells: size + QUIET_ZONE_MODULES * 2,
    modules: modulesWithDelay,
  };
}

const qrData = getQRData();

export function StartupQRLoader() {
  const [isFormed, setIsFormed] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Only show on desktop devices, disable on mobile
    const checkMobile =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

    if (checkMobile) {
      const timer = setTimeout(() => {
        setIsMobile(true);
        setIsDone(true);
      }, 0);
      return () => clearTimeout(timer);
    }

    // Respect prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      const timerFormed = setTimeout(() => setIsFormed(true), 0);
      return () => clearTimeout(timerFormed);
    }

    // Progressive module animation completes around 1.95s
    const timerFormed = setTimeout(() => setIsFormed(true), 1950);
    return () => clearTimeout(timerFormed);
  }, []);

  const handleEnter = useCallback(() => {
    if (isFading || isDone) return;
    sound.click();
    setIsFading(true);
    setTimeout(() => {
      setIsDone(true);
    }, 400);
  }, [isFading, isDone]);

  // Keyboard navigation: Enter key triggers entry once formed
  useEffect(() => {
    if (!isFormed) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleEnter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFormed, handleEnter]);

  // Do not render anything on mobile or after completion
  if (isDone || isMobile) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] hidden md:flex flex-col items-center justify-center bg-[#000000] text-[#f5f5f7] transition-opacity duration-400 ease-out select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      } ${isFormed ? 'qr-loader-formed' : ''}`}
      aria-hidden={isFading}
    >
      <style>{`
        @keyframes qrModuleAppear {
          0% {
            opacity: 0;
            transform: scale(0.4);
          }
          65% {
            opacity: 0.9;
            transform: scale(1.04);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .qr-module {
          transform-box: fill-box;
          transform-origin: center;
          animation-name: qrModuleAppear;
          animation-duration: 0.22s;
          animation-timing-function: cubic-bezier(0.2, 0.9, 0.3, 1);
          animation-fill-mode: both;
        }

        .qr-loader-formed .qr-module {
          animation: none !important;
          transform: none !important;
          opacity: 1 !important;
        }

        @keyframes enterButtonIn {
          from {
            transform: translateY(6px);
          }
          to {
            transform: translateY(0);
          }
        }

        .enter-btn-animate {
          animation: enterButtonIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .qr-module {
            animation: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
          .enter-btn-animate {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Ambient background glow for frosted glass refraction */}
      <div className="absolute w-80 h-80 rounded-full bg-[#0071e3]/15 blur-[100px] pointer-events-none" />

      {/* Frosted Apple Glass Card */}
      <div className="relative flex flex-col items-center justify-center p-8 bg-[#18181b]/75 backdrop-blur-3xl rounded-[2.5rem] border border-white/[0.14] shadow-[0_30px_90px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.15)] max-w-sm w-full gap-6 text-center mx-4 transition-all duration-300">
        {/* Header Indicator */}
        <div className="flex flex-col gap-1.5 items-center">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#86868b]">
            <span
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                isFormed ? 'bg-[#30d158]' : 'bg-[#2997ff] animate-pulse'
              }`}
            />
            <span>{isFormed ? 'System Ready' : 'Booting System...'}</span>
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-[#f5f5f7]">
            Scan to Connect
          </h2>
          <p className="text-xs text-[#86868b] leading-relaxed max-w-[260px]">
            Scan with your mobile device to connect, or enter the presentation below.
          </p>
        </div>

        {/* QR Code Presentation Box with High Contrast White Quiet Zone & Subtle Glass Border */}
        <div className="p-3.5 bg-white/95 backdrop-blur-md rounded-3xl border border-white/40 shadow-[0_12px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.8)]">
          <svg
            viewBox={`0 0 ${qrData.numCells} ${qrData.numCells}`}
            className="w-[200px] h-[200px] sm:w-[220px] sm:h-[220px] aspect-square"
            shapeRendering="crispEdges"
            aria-label="QR Code encoding https://os.platesight.in/"
            role="img"
          >
            {/* Solid white quiet zone background */}
            <rect
              width={qrData.numCells}
              height={qrData.numCells}
              fill="#ffffff"
              shapeRendering="crispEdges"
            />

            {/* Genuine dark QR modules */}
            {qrData.modules.map((m) => (
              <rect
                key={m.id}
                x={m.col + QUIET_ZONE_MODULES}
                y={m.row + QUIET_ZONE_MODULES}
                width="1"
                height="1"
                fill="#000000"
                className="qr-module"
                style={isFormed ? undefined : { animationDelay: `${m.delay}s` }}
                shapeRendering="crispEdges"
              />
            ))}
          </svg>
        </div>

        {/* URL Label */}
        <div className="text-xs font-mono text-[#86868b] tracking-wide">
          https://os.platesight.in/
        </div>

        {/* Action Button: Revealed when formed, does not redirect until clicked */}
        <div className="w-full pt-1">
          {isFormed ? (
            <button
              onClick={handleEnter}
              style={{ backgroundColor: '#ffffff', color: '#000000' }}
              className="enter-btn-animate group w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-semibold text-sm hover:bg-[#f5f5f7] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
            >
              <span>Enter Website</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          ) : (
            <div className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/[0.06] text-[#86868b] font-medium text-sm select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2997ff] animate-pulse" />
              <span>Generating QR Code...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
