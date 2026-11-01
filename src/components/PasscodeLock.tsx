import React, { useState, useEffect } from 'react';
import { sound } from '../services/soundService';
import { Lock, Unlock, ShieldAlert, CheckCircle2, Delete } from 'lucide-react';

interface PasscodeLockProps {
  onUnlock: () => void;
}

// Master Passcode configured for Xuan Hieu (110907)
const CORRECT_PASSCODE = ((import.meta as unknown as { env?: Record<string, string> }).env?.VITE_APP_PASSCODE) || '110907';

export const PasscodeLock: React.FC<PasscodeLockProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>('ENTER 6-DIGIT PASSCODE');

  const handleDigit = (digit: string) => {
    sound.playClick();
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(false);

      if (nextPin.length === 6) {
        verifyPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    sound.playClick();
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    sound.playClick();
    setPin('');
    setError(false);
    setStatusMsg('ENTER 6-DIGIT PASSCODE');
  };

  const verifyPin = (candidate: string) => {
    if (candidate === CORRECT_PASSCODE) {
      setSuccess(true);
      setError(false);
      setStatusMsg('ACCESS GRANTED! WELCOME XUAN HIEU');
      sound.playLevelUp();

      // Save auth session in localStorage
      localStorage.setItem('xuan_hieu_auth_token_v1', 'unlocked_110907');

      setTimeout(() => {
        onUnlock();
      }, 700);
    } else {
      setError(true);
      sound.playError();
      setStatusMsg('INCORRECT PASSCODE! ACCESS DENIED');

      setTimeout(() => {
        setPin('');
        setError(false);
        setStatusMsg('TRY AGAIN');
      }, 1000);
    }
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        handleClear();
      } else if (e.key === 'Enter') {
        if (pin.length === 6) {
          verifyPin(pin);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d0c17]/85 backdrop-blur-sm select-none">
      <div
        className={`pixel-panel w-full max-w-sm bg-[#222036] p-6 space-y-4 text-center transition-all ${
          error ? 'border-[var(--color-danger)] animate-bounce' : success ? 'border-[var(--color-secondary-accent)]' : ''
        }`}
      >
        {/* Anime Mascot Gatekeeper Icon */}
        <div className="w-16 h-16 mx-auto pixel-inset p-1 bg-[#141324] flex items-center justify-center animate-sprite-bob">
          {success ? (
            <Unlock className="w-8 h-8 text-[var(--color-secondary-accent)]" />
          ) : error ? (
            <ShieldAlert className="w-8 h-8 text-[var(--color-danger)]" />
          ) : (
            <Lock className="w-8 h-8 text-[var(--color-primary-accent)]" />
          )}
        </div>

        {/* Title & Warning */}
        <div>
          <span className="font-pixel text-[9px] text-[var(--color-secondary-accent)] tracking-wider uppercase block">
            Security Gatekeeper
          </span>
          <h2 className="font-pixel text-xs sm:text-sm text-[var(--color-text-main)] mt-1 tracking-wide">
            XUAN HIEU'S SANCTUARY
          </h2>
          <p
            className={`font-retro text-xs mt-1 transition-colors ${
              error
                ? 'text-[var(--color-danger)] font-bold'
                : success
                ? 'text-[var(--color-secondary-accent)] font-bold'
                : 'text-[var(--color-text-muted)]'
            }`}
          >
            {statusMsg}
          </p>
        </div>

        {/* 6 Digit Display Slots */}
        <div className="flex justify-center gap-2 my-2">
          {Array.from({ length: 6 }).map((_, idx) => {
            const hasDigit = idx < pin.length;
            return (
              <div
                key={idx}
                className={`w-10 h-11 pixel-inset flex items-center justify-center font-retro text-xl transition-all ${
                  hasDigit
                    ? success
                      ? 'bg-[#1b382b] text-[var(--color-secondary-accent)] border-[#8bd5ca]'
                      : 'bg-[#2b2742] text-[var(--color-primary-accent)]'
                    : 'bg-[#141324] text-[var(--color-text-muted)] opacity-60'
                }`}
              >
                {hasDigit ? (success ? '✓' : '★') : '·'}
              </div>
            );
          })}
        </div>

        {/* Numeric Keypad Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigit(digit)}
              className="pixel-button py-3 text-lg font-retro text-[var(--color-text-main)] hover:bg-[#332f52]"
            >
              {digit}
            </button>
          ))}

          {/* Clear Button */}
          <button
            type="button"
            onClick={handleClear}
            className="pixel-button py-3 text-xs font-pixel text-[var(--color-danger)]"
          >
            C
          </button>

          {/* Digit 0 */}
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="pixel-button py-3 text-lg font-retro text-[var(--color-text-main)]"
          >
            0
          </button>

          {/* Backspace Button */}
          <button
            type="button"
            onClick={handleBackspace}
            title="Backspace"
            className="pixel-button py-3 text-xs font-pixel text-[var(--color-warning-break)] flex items-center justify-center"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>

        {/* Footnote */}
        <div className="text-[11px] font-retro text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border-dark)] flex items-center justify-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-secondary-accent)]" />
          <span>Only Xuan Hieu can enter and use this workspace.</span>
        </div>
      </div>
    </div>
  );
};
