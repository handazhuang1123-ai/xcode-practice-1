import React, { useState, useMemo, useRef, useEffect } from 'react';
import { DraftLogItem } from '../types';
import { ColorDots } from './ColorDots';
import { getScoreBadgeStyle, calculateDraftStats } from '../utils/draft';
import { ChevronDown, Trophy, Sun, Moon } from 'lucide-react';

interface HomeViewProps {
  drafts: DraftLogItem[];
  onSelectDraft: (draft: DraftLogItem) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  drafts,
  onSelectDraft,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  // 1. Linked set filter state (defaults to 'All sets')
  const [selectedSet, setSelectedSet] = useState<string>('All sets');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Available sets from data
  const availableSets = useMemo(() => {
    const rawSets = Array.from(new Set(drafts.map((d) => d.set)));
    return ['All sets', ...rawSets];
  }, [drafts]);

  // Filter drafts based on selected set
  const filteredDrafts = useMemo(() => {
    if (selectedSet === 'All sets') return drafts;
    return drafts.filter((d) => d.set === selectedSet);
  }, [drafts, selectedSet]);

  // Recalculate summary card stats for 'All sets' vs specific sets
  const summaryStats = useMemo(() => {
    if (selectedSet === 'All sets') {
      return {
        title: 'OVERALL WIN RATE',
        rateString: '64%',
        recordString: '34W–19L · 8 drafts',
        tier: 'Tier: Mythic',
        badgeClass: isDarkMode
          ? 'bg-emerald-950/70 text-emerald-400 border-emerald-850'
          : 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
      };
    }

    const calculated = calculateDraftStats(filteredDrafts);
    const tier = calculated.winRate >= 60 ? 'Tier: Mythic' : calculated.winRate >= 50 ? 'Tier: Diamond' : 'Tier: Gold';
    const badgeClass =
      calculated.winRate >= 60
        ? isDarkMode
          ? 'bg-emerald-950/70 text-emerald-400 border-emerald-850'
          : 'bg-emerald-50 text-emerald-600 border-emerald-200/60'
        : calculated.winRate >= 45
        ? isDarkMode
          ? 'bg-amber-950/70 text-amber-400 border-amber-850'
          : 'bg-amber-50 text-amber-700 border-amber-200/60'
        : isDarkMode
        ? 'bg-rose-950/70 text-rose-400 border-rose-850'
        : 'bg-rose-50 text-rose-700 border-rose-200/60';

    return {
      title: `${selectedSet} WIN RATE`,
      rateString: `${calculated.winRate}%`,
      recordString: `${calculated.totalWins}W–${calculated.totalLosses}L · ${calculated.draftCount} draft${
        calculated.draftCount === 1 ? '' : 's'
      }`,
      tier,
      badgeClass,
    };
  }, [selectedSet, filteredDrafts, isDarkMode]);

  return (
    <div className="flex-1 w-full overflow-y-auto px-4 py-3 space-y-4">
      {/* 1. Header: "Draft Log" title + Theme Toggle (left), "All sets v" dropdown (right) */}
      <div className="flex items-center justify-between relative pt-1">
        <div className="flex items-center gap-2.5">
          <h1
            className={`text-2xl font-extrabold tracking-tight transition-colors ${
              isDarkMode ? 'text-white' : 'text-neutral-900'
            }`}
          >
            Draft Log
          </h1>

          {/* Global Light/Dark Theme Toggle Button */}
          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                isDarkMode
                  ? 'bg-neutral-800 border-neutral-700 text-amber-300 hover:bg-neutral-700 active:scale-95'
                  : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 shadow-2xs active:scale-95'
              }`}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 stroke-[2.2]" />
              ) : (
                <Moon className="w-4 h-4 stroke-[2.2]" />
              )}
            </button>
          )}
        </div>

        {/* Set Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-2xs transition cursor-pointer active:scale-95 ${
              isDarkMode
                ? 'bg-[#1E1E1E] border border-neutral-700 text-neutral-200 hover:bg-neutral-800'
                : 'bg-white border border-neutral-200/90 text-neutral-700 hover:bg-neutral-50'
            }`}
            aria-expanded={isDropdownOpen}
            aria-label="Filter by MTG set"
          >
            <span>{selectedSet}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 stroke-[2.5] ${
                isDarkMode ? 'text-neutral-400' : 'text-neutral-400'
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div
              className={`absolute right-0 mt-1.5 w-32 rounded-xl shadow-xl py-1.5 z-30 animate-in fade-in slide-in-from-top-1 border ${
                isDarkMode
                  ? 'bg-[#1E1E1E] border-neutral-700 text-neutral-200'
                  : 'bg-white border-neutral-200 text-neutral-700 shadow-lg'
              }`}
            >
              {availableSets.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSelectedSet(s);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                    selectedSet === s
                      ? isDarkMode
                        ? 'bg-teal-950/80 text-teal-300 font-bold'
                        : 'bg-teal-50 text-teal-800 font-bold'
                      : isDarkMode
                      ? 'text-neutral-300 hover:bg-neutral-800'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <span>{s}</span>
                  {selectedSet === s && (
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Summary Card: Dynamically linked to selectedSet */}
      <div
        className={`rounded-2xl p-6 shadow-sm border relative overflow-hidden transition-all ${
          isDarkMode
            ? 'bg-[#1E1E1E] border-neutral-800 text-white shadow-md'
            : 'bg-white border-neutral-200/60 text-neutral-900'
        }`}
      >
        {/* Subtle accent icon in corner */}
        <div
          className={`absolute -right-2 -bottom-2 pointer-events-none ${
            isDarkMode ? 'text-neutral-800 opacity-30' : 'text-neutral-100 opacity-40'
          }`}
        >
          <Trophy className="w-24 h-24" />
        </div>

        <div className="relative z-10">
          <p className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
            {summaryStats.title}
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span
              className={`text-4xl font-extrabold tracking-tight ${
                isDarkMode ? 'text-white' : 'text-neutral-900'
              }`}
            >
              {summaryStats.rateString}
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full border ${summaryStats.badgeClass}`}
            >
              {summaryStats.tier}
            </span>
          </div>
          <p
            className={`text-xs font-medium mt-1.5 ${
              isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
            }`}
          >
            {summaryStats.recordString}
          </p>
        </div>
      </div>

      {/* 3. Recent drafts List: Dynamically filtered */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            RECENT DRAFTS ({filteredDrafts.length})
          </h2>
          {selectedSet !== 'All sets' && (
            <button
              onClick={() => setSelectedSet('All sets')}
              className={`text-[11px] font-semibold hover:underline cursor-pointer ${
                isDarkMode ? 'text-teal-400' : 'text-teal-700'
              }`}
            >
              Reset filter
            </button>
          )}
        </div>

        <div className="space-y-2.5 pb-6">
          {filteredDrafts.map((draft) => {
            const scoreStyle = getScoreBadgeStyle(draft.score);

            return (
              <div
                key={draft.id}
                onClick={() => onSelectDraft(draft)}
                className={`rounded-xl p-4 flex items-center justify-between shadow-xs border transition-all duration-150 active:scale-[0.98] cursor-pointer ${
                  isDarkMode
                    ? 'bg-[#1E1E1E] border-neutral-800/90 hover:border-neutral-700 hover:bg-[#252525]'
                    : 'bg-white border-neutral-200/70 hover:shadow-md hover:border-neutral-300'
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectDraft(draft);
                  }
                }}
                aria-label={`Draft ${draft.id}: ${draft.colors.join('')} ${draft.score} in ${draft.set}`}
              >
                {/* Left: Two color dots + text */}
                <div className="w-[90px] shrink-0">
                  <ColorDots colors={draft.colors} isDarkMode={isDarkMode} />
                </div>

                {/* Middle: Score pill (Green: 7-x, Red: 0-3, Gray: others) */}
                <div className="flex items-center justify-center">
                  <span
                    className={`inline-flex items-center justify-center min-w-[54px] px-2.5 py-1 rounded-full text-xs font-bold shadow-2xs ${scoreStyle.bg}`}
                  >
                    {draft.score}
                  </span>
                </div>

                {/* Right: Date + Set badge (e.g., "FDN" small badge) */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-medium text-neutral-400">
                    {draft.date}
                  </span>
                  <span
                    className={`font-bold text-[10px] px-2 py-0.5 rounded-md min-w-[36px] text-center border ${
                      isDarkMode
                        ? 'bg-neutral-800 border-neutral-700 text-neutral-300'
                        : 'bg-neutral-100 border-neutral-200 text-neutral-600'
                    }`}
                  >
                    {draft.set}
                  </span>
                </div>
              </div>
            );
          })}

          {filteredDrafts.length === 0 && (
            <div
              className={`p-8 text-center rounded-xl border ${
                isDarkMode
                  ? 'bg-[#1E1E1E] border-neutral-800 text-neutral-400'
                  : 'bg-white border-neutral-200 text-neutral-400'
              }`}
            >
              <p className="text-xs">
                No draft logs found for set {selectedSet}.
              </p>
              <button
                onClick={() => setSelectedSet('All sets')}
                className={`mt-2 text-xs font-semibold hover:underline cursor-pointer ${
                  isDarkMode ? 'text-teal-400' : 'text-teal-700'
                }`}
              >
                View all drafts
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
