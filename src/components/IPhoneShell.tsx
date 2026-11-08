import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface IPhoneShellProps {
  children: React.ReactNode;
  isDarkMode?: boolean;
}

export const IPhoneShell: React.FC<IPhoneShellProps> = ({ children, isDarkMode = false }) => {
  const [timeString, setTimeString] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      // Format as 12-hour or 24-hour style
      if (hours === 0) hours = 12;
      else if (hours > 12) hours = hours - 12;
      setTimeString(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const statusTextColor = isDarkMode ? 'text-neutral-100' : 'text-neutral-900';
  const batteryBorderColor = isDarkMode ? 'border-neutral-100' : 'border-neutral-900';
  const batteryFillColor = isDarkMode ? 'bg-neutral-100' : 'bg-neutral-900';
  const screenBgColor = isDarkMode ? 'bg-[#121212]' : 'bg-[#F5F5F7]';
  const homeBarColor = isDarkMode ? 'bg-white/30' : 'bg-neutral-900/40';

  return (
    <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center p-4 sm:p-8 select-none transition-colors">
      {/* Background ambient lighting and title header */}
      <div className="mb-4 text-center">
        <h1 className="text-neutral-400 font-semibold text-xs tracking-widest uppercase mb-1">
          Device Simulator · iPhone 13 Pro Max (390 × 844 px)
        </h1>
        <p className="text-neutral-500 text-xs">
          Interactive MTG Draft Log & 17Lands Decklist Prototype
        </p>
      </div>

      {/* Outer Phone Shell */}
      <div className="relative">
        {/* Physical hardware side buttons */}
        {/* Mute switch left */}
        <div className="absolute -left-[14px] top-[115px] w-[3px] h-[28px] bg-neutral-700 rounded-l-sm" />
        {/* Volume up button left */}
        <div className="absolute -left-[14px] top-[160px] w-[3px] h-[52px] bg-neutral-700 rounded-l-sm" />
        {/* Volume down button left */}
        <div className="absolute -left-[14px] top-[225px] w-[3px] h-[52px] bg-neutral-700 rounded-l-sm" />
        {/* Power button right */}
        <div className="absolute -right-[14px] top-[175px] w-[3px] h-[75px] bg-neutral-700 rounded-r-sm" />

        {/* Chassis Bezel */}
        <div className="p-[12px] bg-[#1a1a1c] rounded-[54px] shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.12),0_0_0_4px_#27272a] ring-1 ring-black">
          {/* Inner Screen Container: EXACTLY 390x844px */}
          <div
            className={`relative w-[390px] h-[844px] ${screenBgColor} rounded-[42px] overflow-hidden flex flex-col shadow-inner transition-colors duration-200`}
            style={{ width: '390px', height: '844px' }}
          >
            {/* Top Status Bar & Dynamic Island */}
            <header className={`relative w-full h-[48px] px-7 flex items-center justify-between ${statusTextColor} z-50 shrink-0 pointer-events-none transition-colors`}>
              {/* Status Bar Left: Clock */}
              <span className={`text-[14px] font-semibold tracking-tight ${statusTextColor} pl-1`}>
                {timeString}
              </span>

              {/* Dynamic Island pill */}
              <div className="absolute left-1/2 -translate-x-1/2 top-[8px] w-[124px] h-[34px] bg-black rounded-full flex items-center justify-between px-3 pointer-events-auto transition-all shadow-md">
                {/* Camera lens highlight */}
                <div className="w-3 h-3 rounded-full bg-[#0a0a0f] border border-neutral-800 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#172033]" />
                </div>
                {/* FaceID sensor dot */}
                <div className="w-2.5 h-2.5 rounded-full bg-[#08080c]" />
              </div>

              {/* Status Bar Right: Signal, Wi-Fi, Battery */}
              <div className="flex items-center gap-1.5 pr-1">
                <Signal className={`w-3.5 h-3.5 ${statusTextColor} stroke-[2.2]`} />
                <Wifi className={`w-3.5 h-3.5 ${statusTextColor} stroke-[2.2]`} />
                <div className="flex items-center gap-0.5">
                  <div className={`w-5 h-2.5 rounded-[3px] border ${batteryBorderColor} p-[1px] flex items-center`}>
                    <div className={`h-full w-[80%] ${batteryFillColor} rounded-[1px]`} />
                  </div>
                  <div className={`w-0.5 h-1 ${batteryFillColor} rounded-r-xs`} />
                </div>
              </div>
            </header>

            {/* App Screen Content */}
            <main className="relative flex-1 w-full overflow-hidden flex flex-col">
              {children}
            </main>

            {/* Bottom iOS Home Indicator */}
            <footer className="w-full h-[22px] flex items-center justify-center shrink-0 pointer-events-none z-50">
              <div className={`w-[134px] h-[4px] ${homeBarColor} rounded-full transition-colors`} />
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};
