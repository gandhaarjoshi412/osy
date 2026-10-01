'use client';

import React from 'react';
import { Smartphone, ArrowRight, Sun, Moon } from 'lucide-react';
import { sound } from '@/lib/sound';
import { useTheme } from '@/context/ThemeContext';

interface StartupExperienceProps {
  onStart: () => void;
  onOpenMobile: () => void;
}

export function StartupExperience({
  onStart,
  onOpenMobile,
}: StartupExperienceProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-[100dvh] w-full flex flex-col justify-between p-6 sm:p-12 md:p-16 bg-[var(--background)] text-[var(--foreground)] relative overflow-hidden select-none transition-colors duration-300">
      {/* Discreet Top Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0071e3]" />
          <span className="font-semibold text-xs tracking-wider uppercase text-[var(--foreground)]">
            Operating Systems
          </span>
          <span className="text-[#86868b] text-xs">/</span>
          <span className="text-[#86868b] text-xs font-normal">Classroom Experience</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => {
              sound.click();
              toggleTheme();
            }}
            className="p-2 rounded-full text-[#86868b] hover:text-[var(--foreground)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#ffd60a]" />
            ) : (
              <Moon className="w-4 h-4 text-[#1d1d1f]" />
            )}
          </button>

          <button
            onClick={() => {
              sound.click();
              onOpenMobile();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-[#86868b] hover:text-[var(--foreground)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#0071e3]" />
            <span>Mobile Companion</span>
          </button>
        </div>
      </header>

      {/* Main Center Stage */}
      <div className="my-auto max-w-4xl mx-auto w-full flex flex-col gap-6 text-left py-8">
        {/* Apple Editorial Title & Action */}
        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold tracking-widest uppercase text-[#0071e3]">
            Virtual Memory
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[var(--foreground)] leading-[1.05]">
            Page Replacement <br />
            <span className="text-[#86868b] font-normal">Algorithms.</span>
          </h1>
          <p className="text-2xl font-light text-[var(--foreground)] tracking-tight mt-1">
            FIFO <span className="text-[#86868b] font-normal">×</span> LRU
          </p>
        </div>

        <p className="text-base sm:text-lg text-[#86868b] font-normal leading-relaxed max-w-2xl">
          When physical memory is limited, which page should the operating system remove?
          An interactive visual exploration designed for classroom smartboards and mobile devices.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
          <button
            onClick={() => {
              sound.click();
              onStart();
            }}
            className="group flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#1d1d1f] dark:bg-white text-white dark:text-black font-medium text-base hover:bg-black dark:hover:bg-[#f5f5f7] active:scale-[0.98] transition-all shadow-lg hover:shadow-xl cursor-pointer"
          >
            <span>Begin Experience</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <span className="text-xs text-[#86868b] text-center sm:text-left">
            Touch, swipe, or scroll to navigate naturally.
          </span>
        </div>
      </div>

      {/* Discreet Footer Note */}
      <footer className="flex flex-wrap items-center justify-between text-xs text-[#86868b] pt-6 border-t border-black/[0.06] dark:border-white/[0.08]">
        <span>Designed for classroom touchscreen smartboards &amp; 16:9 displays</span>
        <span>Keyboard: Arrow keys / Space to advance • F for Fullscreen</span>
      </footer>
    </div>
  );
}
