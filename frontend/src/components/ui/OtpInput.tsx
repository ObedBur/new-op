'use client';

import React, { useState, useRef, useEffect } from 'react';

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  error?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({ length = 6, onComplete, error }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputs.current[0]?.focus();
  }, []);

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    // Take the last char (for copy-pasting or replacing)
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    // Check if complete
    const combinedOtp = newOtp.join('');
    if (combinedOtp.length === length) {
      onComplete(combinedOtp);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').slice(0, length).split('');
    if (data.every(val => !isNaN(Number(val)))) {
      const newOtp = [...otp];
      data.forEach((val, i) => {
        if (i < length) newOtp[i] = val;
      });
      setOtp(newOtp);
      inputs.current[Math.min(data.length, length - 1)]?.focus();
      if (data.length === length) onComplete(newOtp.join(''));
    }
  };

  return (
    <div className="flex justify-between gap-3 w-full max-w-sm mx-auto">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { inputs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className={`
            w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold rounded-2xl border-2 transition-all duration-300
            focus:outline-none focus:ring-4
            ${error 
              ? 'border-red-500 focus:ring-red-500/10' 
              : 'border-slate-200 dark:border-slate-700 focus:border-emerald-600 focus:ring-emerald-600/10'}
            ${digit ? 'bg-emerald-50/30 border-emerald-500' : 'bg-white dark:bg-slate-900'}
          `}
        />
      ))}
    </div>
  );
};
