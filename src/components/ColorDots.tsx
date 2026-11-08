import React from 'react';
import { MTGColor } from '../types';
import { COLOR_CONFIG } from '../utils/draft';

interface ColorDotsProps {
  colors: MTGColor[];
  size?: 'sm' | 'md';
  isDarkMode?: boolean;
}

export const ColorDots: React.FC<ColorDotsProps> = ({
  colors,
  size = 'md',
  isDarkMode = false,
}) => {
  const is5C = colors.length >= 5;
  const dotSizeClass = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';
  const labelColor = isDarkMode ? 'text-neutral-200' : 'text-neutral-800';

  if (is5C) {
    return (
      <div className="flex items-center gap-1.5">
        <div
          className={`${dotSizeClass} rounded-full shadow-xs border border-neutral-300 ring-1 ring-white/60`}
          style={{
            background:
              'conic-gradient(#F9FAF4 0deg 72deg, #0E68AB 72deg 144deg, #150B00 144deg 216deg, #D3202A 216deg 288deg, #00733E 288deg 360deg)',
          }}
          title="5-Color (WUBRG)"
        />
        <span className={`font-semibold text-xs tracking-wide ${labelColor}`}>
          5C
        </span>
      </div>
    );
  }

  const label = colors.join('');

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center -space-x-1">
        {colors.map((color, index) => {
          const config = COLOR_CONFIG[color] || { hex: '#737373' };
          return (
            <div
              key={`${color}-${index}`}
              className={`${dotSizeClass} rounded-full shadow-xs ring-1 ring-white`}
              style={{
                backgroundColor: config.hex,
                border: config.border ? `1px solid ${config.border}` : 'none',
              }}
              title={config.name || color}
            />
          );
        })}
      </div>
      <span className={`font-semibold text-xs tracking-wider ${labelColor}`}>
        {label}
      </span>
    </div>
  );
};
