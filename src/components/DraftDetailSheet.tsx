import React, { useState } from 'react';
import { DraftLogItem } from '../types';
import { getScoreBadgeStyle } from '../utils/draft';
import { Decklist17Lands } from './Decklist17Lands';
import { X, ChevronLeft, Swords, Trophy, ShieldAlert } from 'lucide-react';
import { ColorDots } from './ColorDots';

interface DraftDetailSheetProps {
  draft: DraftLogItem;
  onClose: () => void;
  isDarkMode?: boolean;
}

export const DraftDetailSheet: React.FC<DraftDetailSheetProps> = ({
  draft,
  onClose,
  isDarkMode = false,
}) => {
  const [showMatchHistory, setShowMatchHistory] = useState(false);

  const scoreStyle = getScoreBadgeStyle(draft.score);
  const colorTitle = draft.colors.length >= 5 ? '5-Color' : draft.colors.join('');
  const draftTitle = `${colorTitle} Draft`;

  const totalCreatures = draft.creatures?.length ?? draft.creaturesCount ?? 15;
  const totalSpells = draft.spells?.length ?? draft.spellsCount ?? 8;
  const totalLands =
    draft.lands?.reduce((sum, l) => sum + l.count, 0) ?? draft.landsCount ?? 17;

  const matches = draft.matches || [
    { round: 1, opponent: 'Opponent #1', opponentColors: ['R'], result: 'W', gameScore: '2-1' },
    { round: 2, opponent: 'Opponent #2', opponentColors: ['B', 'G'], result: 'W', gameScore: '2-0' },
    { round: 3, opponent: 'Opponent #3', opponentColors: ['W', 'U'], result: 'L', gameScore: '1-2' },
  ];

  const totalMatchesCount = matches.length;

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end animate-in fade-in duration-200">
      {/* Backdrop overlay inside phone frame */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 85% Height Bottom Sheet Modal */}
      <div
        className={`relative w-full h-[85%] rounded-t-3xl shadow-2xl flex flex-col z-50 overflow-hidden transform transition-all ease-out duration-300 ${
          isDarkMode
            ? 'bg-[#1E1E1E] text-white border-t border-neutral-800'
            : 'bg-white text-neutral-900 border-t border-neutral-100'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={`${draftTitle} Details`}
      >
        {/* iOS Drag Handle */}
        <div className="w-full pt-2.5 pb-1 flex justify-center shrink-0">
          <div
            className={`w-10 h-1 rounded-full ${
              isDarkMode ? 'bg-neutral-700' : 'bg-neutral-300'
            }`}
          />
        </div>

        {/* Header */}
        <div
          className={`px-5 py-2.5 border-b flex items-center justify-between shrink-0 ${
            isDarkMode ? 'border-neutral-800' : 'border-neutral-100'
          }`}
        >
          {showMatchHistory ? (
            <button
              onClick={() => setShowMatchHistory(false)}
              className="flex items-center gap-1 text-teal-400 font-semibold text-xs py-1 pr-2 -ml-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Deck</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <h2
                className={`text-base font-bold tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-neutral-900'
                }`}
              >
                {draftTitle}
              </h2>
              <span
                className={`font-bold text-[11px] px-2 py-0.5 rounded-md border ${
                  isDarkMode
                    ? 'bg-neutral-800 border-neutral-700 text-neutral-300'
                    : 'bg-neutral-100 border-neutral-200 text-neutral-600'
                }`}
              >
                {draft.set}
              </span>
            </div>
          )}

          <button
            onClick={onClose}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isDarkMode
                ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
            }`}
            aria-label="Close draft detail"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {!showMatchHistory ? (
            <>
              {/* Hero Section: Centered large score pill + date info */}
              <div className="flex flex-col items-center justify-center py-1 text-center shrink-0">
                <div
                  className={`inline-flex items-center justify-center px-5 py-1 rounded-full font-black text-xl shadow-xs ${scoreStyle.bg}`}
                >
                  {draft.score}
                </div>
                <div
                  className={`mt-1 text-[11px] font-medium ${
                    isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
                  }`}
                >
                  {draft.date} · {totalMatchesCount} matches
                </div>

                {/* Deck Stats: One line small gray text */}
                <div
                  className={`mt-0.5 text-[11px] font-medium ${
                    isDarkMode ? 'text-neutral-400' : 'text-neutral-400'
                  }`}
                >
                  {totalCreatures} Creatures · {totalSpells} Spells · {totalLands} Lands
                </div>
              </div>

              {/* 17LANDS STYLE DECKLIST */}
              <div
                className={`pt-2 border-t ${
                  isDarkMode ? 'border-neutral-800' : 'border-neutral-100'
                }`}
              >
                <Decklist17Lands
                  creatures={draft.creatures || []}
                  spells={draft.spells || []}
                  lands={draft.lands || [{ name: 'Basic Lands', count: totalLands }]}
                  sideboard={draft.sideboard || []}
                  isDarkMode={isDarkMode}
                />
              </div>
            </>
          ) : (
            /* Match History View */
            <div className="space-y-3">
              <div
                className={`flex items-center justify-between pb-2 border-b ${
                  isDarkMode ? 'border-neutral-800' : 'border-neutral-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Swords className="w-4 h-4 text-teal-500" />
                  <h3
                    className={`font-bold text-sm ${
                      isDarkMode ? 'text-white' : 'text-neutral-900'
                    }`}
                  >
                    Match History ({matches.length} Games)
                  </h3>
                </div>
                <span
                  className={`text-xs font-semibold ${
                    isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
                  }`}
                >
                  Record: {draft.score}
                </span>
              </div>

              <div className="space-y-2">
                {matches.map((m) => {
                  const isWin = m.result === 'W';
                  return (
                    <div
                      key={`match-${m.round}`}
                      className={`rounded-xl p-3 flex items-center justify-between shadow-2xs border transition-colors ${
                        isDarkMode
                          ? 'bg-[#181818] border-neutral-800'
                          : 'bg-neutral-50 border-neutral-200/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                            isWin
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {isWin ? <Trophy className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div
                            className={`text-xs font-semibold flex items-center gap-2 ${
                              isDarkMode ? 'text-neutral-200' : 'text-neutral-800'
                            }`}
                          >
                            <span>Round {m.round}</span>
                            <span className="text-neutral-500">vs</span>
                            <span
                              className={isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}
                            >
                              {m.opponent}
                            </span>
                          </div>
                          <div className="mt-0.5">
                            <ColorDots
                              colors={m.opponentColors}
                              size="sm"
                              isDarkMode={isDarkMode}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded font-bold text-xs ${
                            isWin
                              ? isDarkMode
                                ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isDarkMode
                              ? 'bg-rose-950/70 text-rose-400 border border-rose-800/60'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {m.result} ({m.gameScore})
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer: Sticky bottom button "View Match History >" (Deep teal, white text, full width) */}
        <div
          className={`p-4 border-t shrink-0 transition-colors ${
            isDarkMode
              ? 'bg-[#1E1E1E] border-neutral-800'
              : 'bg-white border-neutral-100'
          }`}
        >
          {!showMatchHistory ? (
            <button
              onClick={() => setShowMatchHistory(true)}
              className="w-full bg-[#005f56] hover:bg-[#004d46] active:bg-[#003d37] text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>View Match History</span>
              <span className="text-teal-200 font-bold">&gt;</span>
            </button>
          ) : (
            <button
              onClick={() => setShowMatchHistory(false)}
              className="w-full bg-[#005f56] hover:bg-[#004d46] active:bg-[#003d37] text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>&lt; Back to 17Lands Decklist</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
