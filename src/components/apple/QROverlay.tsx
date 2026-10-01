'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Smartphone, Copy, Check } from 'lucide-react';
import { sound } from '@/lib/sound';

interface QROverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QROverlay({ isOpen, onClose }: QROverlayProps) {
  const [copied, setCopied] = useState(false);
  const [qrUrl, setQrUrl] = useState('https://os-presentation.local');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        setQrUrl(window.location.origin);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isOpen) return null;

  const handleCopy = () => {
    sound.click();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white/85 dark:bg-[#1c1c1e]/85 backdrop-blur-2xl rounded-[2.5rem] p-8 max-w-sm w-full shadow-[0_25px_60px_rgba(0,0,0,0.2)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)] border border-black/[0.06] dark:border-white/[0.12] flex flex-col items-center gap-6 text-center relative select-none transition-colors duration-300">
        <button
          onClick={() => {
            sound.click();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full text-[#86868b] hover:text-[var(--foreground)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
          <Smartphone className="w-6 h-6" />
        </div>

        <div className="flex flex-col gap-1.5">
          <h3 className="text-xl font-semibold text-[var(--foreground)] tracking-tight">
            Continue on your phone
          </h3>
          <p className="text-xs text-[#86868b] leading-relaxed">
            Open the companion simulation on any mobile device to follow along during the lecture.
          </p>
        </div>

        <div className="p-3.5 bg-white/95 backdrop-blur-md rounded-3xl border border-black/[0.04] shadow-sm">
          <QRCodeSVG
            value={qrUrl}
            size={180}
            level="M"
            bgColor="#ffffff"
            fgColor="#1d1d1f"
            includeMargin={false}
          />
        </div>

        <div className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-[#f5f5f7] dark:bg-[#2c2c2e] text-xs font-mono text-[var(--foreground)]">
          <span className="font-medium text-[#0071e3]">Mobile Web Link</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[#86868b] hover:text-[var(--foreground)] transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#34c759]" />
                <span className="text-[#34c759]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
