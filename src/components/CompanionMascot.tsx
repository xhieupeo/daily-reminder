import React, { useState, useEffect } from 'react';
import { TimerMode } from '../types';

interface CompanionMascotProps {
  timerMode: TimerMode;
  isTimerRunning: boolean;
  celebrating: boolean;
}

const STUDY_QUOTES = [
  "Take a deep breath and let's get into the zone! 🍵",
  "Every task checked off is one step closer to your dreams! ✨",
  "Consistency is key, you're doing amazing! 🌸",
  "Drink some water and relax your shoulders. 🌿",
  "Stay focused, great things take time! 🌟",
  "A little progress each day adds up to big results! 🎯",
];

export const CompanionMascot: React.FC<CompanionMascotProps> = ({
  timerMode,
  isTimerRunning,
  celebrating,
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % STUDY_QUOTES.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Mascot Mood Determination
  let moodStatus = 'Idle & Ready';
  let speechText = STUDY_QUOTES[quoteIndex];

  if (celebrating) {
    moodStatus = 'Level Up! Cheering!';
    speechText = 'YAHOO!! Task Completed! Keep the streak going! 🎉';
  } else if (isTimerRunning) {
    if (timerMode === 'focus') {
      moodStatus = 'Deep Focus Studying...';
      speechText = 'Focus mode active! Writing down notes with you... ✏️';
    } else {
      moodStatus = 'Taking a cozy break...';
      speechText = 'Ah, break time! Sip some warm tea or stretch! 🍵';
    }
  } else if (timerMode !== 'focus') {
    moodStatus = 'Resting...';
    speechText = 'Rest is part of the process. Enjoy your break! ☕';
  }

  return (
    <div className="pixel-inset p-3 bg-[#131220] flex flex-col items-center justify-center text-center relative overflow-hidden mb-3">
      {/* Anime Mascot Pixel Art Frame */}
      <div className="w-20 h-20 relative flex items-center justify-center animate-sprite-bob my-1">
        {celebrating ? (
          /* Cheering Cat Sprite with Stars */
          <svg viewBox="0 0 16 16" className="w-full h-full" fill="none">
            <rect x="2" y="1" width="2" height="2" fill="#f9c846" />
            <rect x="12" y="1" width="2" height="2" fill="#f9c846" />
            <rect x="3" y="3" width="2" height="3" fill="#f49ac2" />
            <rect x="11" y="3" width="2" height="3" fill="#f49ac2" />
            <rect x="4" y="5" width="8" height="7" fill="#f6eedb" />
            {/* Happy Closed Eye Arcs */}
            <rect x="5" y="7" width="2" height="1" fill="#0d0c17" />
            <rect x="9" y="7" width="2" height="1" fill="#0d0c17" />
            <rect x="6" y="8" width="1" height="1" fill="#0d0c17" />
            <rect x="10" y="8" width="1" height="1" fill="#0d0c17" />
            {/* Cute Blush */}
            <rect x="4" y="9" width="2" height="1" fill="#ea7679" />
            <rect x="10" y="9" width="2" height="1" fill="#ea7679" />
            {/* Open Happy Mouth */}
            <rect x="7" y="9" width="2" height="2" fill="#ea7679" />
            {/* Cheering Paws Up */}
            <rect x="2" y="6" width="2" height="2" fill="#f6eedb" />
            <rect x="12" y="6" width="2" height="2" fill="#f6eedb" />
            <rect x="5" y="12" width="6" height="3" fill="#8bd5ca" />
          </svg>
        ) : isTimerRunning && timerMode === 'focus' ? (
          /* Focused Studying Cat with Laptop / Book */
          <svg viewBox="0 0 16 16" className="w-full h-full" fill="none">
            <rect x="3" y="2" width="2" height="3" fill="#f49ac2" />
            <rect x="11" y="2" width="2" height="3" fill="#f49ac2" />
            <rect x="4" y="4" width="8" height="7" fill="#f6eedb" />
            {/* Focused Eyes */}
            <rect x="5" y="6" width="2" height="2" fill="#0d0c17" />
            <rect x="9" y="6" width="2" height="2" fill="#0d0c17" />
            {/* Specs / Glasses */}
            <rect x="4" y="5" width="4" height="1" fill="#8bd5ca" />
            <rect x="8" y="5" width="4" height="1" fill="#8bd5ca" />
            {/* Cute Nose */}
            <rect x="7" y="8" width="2" height="1" fill="#ea7679" />
            {/* Mini Pixel Laptop */}
            <rect x="4" y="11" width="8" height="4" fill="#332f52" />
            <rect x="5" y="12" width="6" height="2" fill="#8bd5ca" />
            {/* Typing paws */}
            <rect x="3" y="11" width="2" height="2" fill="#f6eedb" />
            <rect x="11" y="11" width="2" height="2" fill="#f6eedb" />
          </svg>
        ) : timerMode !== 'focus' ? (
          /* Sleeping / Break Cat with floating Zzz */
          <svg viewBox="0 0 16 16" className="w-full h-full" fill="none">
            <rect x="3" y="4" width="2" height="3" fill="#f49ac2" />
            <rect x="11" y="4" width="2" height="3" fill="#f49ac2" />
            <rect x="4" y="6" width="8" height="6" fill="#f6eedb" />
            {/* Sleeping closed eyes */}
            <rect x="5" y="8" width="2" height="1" fill="#0d0c17" />
            <rect x="9" y="8" width="2" height="1" fill="#0d0c17" />
            {/* Snout */}
            <rect x="7" y="9" width="2" height="1" fill="#ea7679" />
            {/* Floating Zzz */}
            <rect x="13" y="1" width="2" height="1" fill="#f9c846" />
            <rect x="14" y="2" width="1" height="1" fill="#f9c846" />
            <rect x="13" y="3" width="2" height="1" fill="#f9c846" />
            <rect x="11" y="3" width="1" height="1" fill="#8bd5ca" />
            <rect x="5" y="12" width="6" height="3" fill="#8bd5ca" />
          </svg>
        ) : (
          /* Default Calm Idle Cat */
          <svg viewBox="0 0 16 16" className="w-full h-full" fill="none">
            <rect x="3" y="2" width="2" height="3" fill="#f49ac2" />
            <rect x="11" y="2" width="2" height="3" fill="#f49ac2" />
            <rect x="4" y="4" width="8" height="8" fill="#f6eedb" />
            <rect x="5" y="7" width="2" height="2" fill="#0d0c17" />
            <rect x="9" y="7" width="2" height="2" fill="#0d0c17" />
            <rect x="7" y="9" width="2" height="1" fill="#ea7679" />
            <rect x="2" y="8" width="2" height="1" fill="#9d96bd" />
            <rect x="12" y="8" width="2" height="1" fill="#9d96bd" />
            <rect x="5" y="12" width="6" height="3" fill="#8bd5ca" />
          </svg>
        )}
      </div>

      {/* Companion Status Badge */}
      <span className="font-pixel text-[9px] text-[var(--color-secondary-accent)] uppercase tracking-wider mb-1">
        {moodStatus}
      </span>

      {/* Pixel Speech Bubble */}
      <div className="pixel-inset bg-[#1a192b] p-2 mt-1 w-full border border-[var(--color-border-dark)] relative">
        <p className="font-retro text-xs sm:text-sm text-[var(--color-text-main)] italic">
          "{speechText}"
        </p>
      </div>
    </div>
  );
};

