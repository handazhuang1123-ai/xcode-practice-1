import React, { useState, useMemo } from 'react';
import { DeckCard } from '../types';
import { getScryfallImageUrl, groupCardsByCmc } from '../utils/draft';
import { X, Layers, SlidersHorizontal, Eye } from 'lucide-react';

interface Decklist17LandsProps {
  creatures: DeckCard[];
  spells: DeckCard[];
  lands: { name: string; count: number }[];
  sideboard?: DeckCard[];
  isDarkMode?: boolean;
}

export const Decklist17Lands: React.FC<Decklist17LandsProps> = ({
  creatures,
  spells,
  lands,
  sideboard = [],
  isDarkMode = false,
}) => {
  // 17Lands visual controls
  const [activeTab, setActiveTab] = useState<'main' | 'sideboard'>('main');
  const [splitView, setSplitView] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<DeckCard | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  // Combine non-land maindeck cards
  const allMaindeckCards = useMemo(() => {
    return [...creatures, ...spells];
  }, [creatures, spells]);

  const totalMaindeckCount =
    allMaindeckCards.length + lands.reduce((sum, l) => sum + l.count, 0);

  // Group all main deck cards by CMC (0, 1, 2, 3, 4, 5+)
  const maindeckCmcGroups = useMemo(() => {
    const groups: Record<number, DeckCard[]> = {};
    for (const card of allMaindeckCards) {
      const cmc = Math.min(card.cmc, 5); // 5+ grouped together like 17lands
      if (!groups[cmc]) groups[cmc] = [];
      groups[cmc].push(card);
    }
    return groups;
  }, [allMaindeckCards]);

  const cmcKeys = useMemo(() => {
    return Object.keys(maindeckCmcGroups)
      .map(Number)
      .sort((a, b) => a - b);
  }, [maindeckCmcGroups]);

  // Group sideboard cards by CMC
  const sideboardCmcGroups = useMemo(() => {
    const groups: Record<number, DeckCard[]> = {};
    for (const card of sideboard) {
      const cmc = Math.min(card.cmc, 5);
      if (!groups[cmc]) groups[cmc] = [];
      groups[cmc].push(card);
    }
    return groups;
  }, [sideboard]);

  const sbCmcKeys = useMemo(() => {
    return Object.keys(sideboardCmcGroups)
      .map(Number)
      .sort((a, b) => a - b);
  }, [sideboardCmcGroups]);

  // Creatures and Spells grouped by CMC for Split View
  const creatureGroups = useMemo(() => groupCardsByCmc(creatures), [creatures]);
  const spellGroups = useMemo(() => groupCardsByCmc(spells), [spells]);

  const handleImgError = (cardName: string) => {
    setImgErrors((prev) => ({ ...prev, [cardName]: true }));
  };

  /**
   * 17Lands Card Column:
   * - Uses React inline styles for exact stacking:
   *   * First card: style={{ marginTop: '0px' }}
   *   * Subsequent cards: style={{ marginTop: '-108px' }}
   *   * Dynamic stacking order: style={{ zIndex: 10 + idx }}
   * - Card image: className="w-24 border-[1.5px] border-black rounded-none object-cover z-10"
   *   with style={{ position: 'relative' }}
   */
  const renderCardColumn = (cards: DeckCard[], keyPrefix: string) => {
    return (
      <div key={keyPrefix} className="flex flex-col items-center shrink-0 w-24">
        {/* Vertical Stack: strictly flex-col without gap, negative margin handles stacking */}
        <div className="w-24 flex flex-col">
          {cards.map((card, idx) => {
            const isError = imgErrors[card.name];
            const imageUrl = getScryfallImageUrl(card.name);

            return (
              <div
                key={`${card.name}-${idx}`}
                onClick={() => setSelectedCard(card)}
                style={{
                  marginTop: idx === 0 ? '0px' : '-108px',
                  zIndex: 10 + idx,
                  position: 'relative',
                }}
                className="w-24 shrink-0 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                title={`${card.name} (CMC ${card.cmc}) - Tap to inspect`}
              >
                {!isError ? (
                  <img
                    src={imageUrl}
                    alt={card.name}
                    loading="lazy"
                    onError={() => handleImgError(card.name)}
                    className="w-24 border-[1.5px] border-black rounded-none object-cover z-10 block"
                    style={{ position: 'relative' }}
                  />
                ) : (
                  <div
                    className="w-24 h-[134px] border-[1.5px] border-black rounded-none p-1.5 flex flex-col justify-between bg-neutral-900 text-white text-[10px] z-10"
                    style={{ position: 'relative' }}
                  >
                    <div className="font-bold truncate leading-tight">{card.name}</div>
                    <div className="text-right text-amber-400 font-bold">
                      {card.cmc}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /**
   * Lands Column:
   * Displays basic/dual lands stacked with exact inline styles (marginTop: -108px, zIndex: 10 + idx)
   * and multiplier badges in the top-right corner.
   */
  const renderLandsColumn = () => {
    return (
      <div className="flex flex-col items-center shrink-0 w-24">
        {/* Stack of Lands with Multipliers */}
        <div className="w-24 flex flex-col">
          {lands.map((land, idx) => {
            const isError = imgErrors[land.name];
            const imageUrl = getScryfallImageUrl(land.name);

            return (
              <div
                key={`land-${land.name}-${idx}`}
                onClick={() =>
                  setSelectedCard({
                    name: land.name,
                    cmc: 0,
                    type: 'land',
                    count: land.count,
                  })
                }
                style={{
                  marginTop: idx === 0 ? '0px' : '-108px',
                  zIndex: 10 + idx,
                  position: 'relative',
                }}
                className="w-24 shrink-0 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                title={`${land.count}x ${land.name} - Tap to inspect`}
              >
                {!isError ? (
                  <img
                    src={imageUrl}
                    alt={land.name}
                    loading="lazy"
                    onError={() => handleImgError(land.name)}
                    className="w-24 border-[1.5px] border-black rounded-none object-cover z-10 block"
                    style={{ position: 'relative' }}
                  />
                ) : (
                  <div
                    className="w-24 h-[134px] border-[1.5px] border-black rounded-none p-1.5 flex flex-col justify-between bg-neutral-900 text-white text-[10px] z-10"
                    style={{ position: 'relative' }}
                  >
                    <div className="font-bold truncate leading-tight">{land.name}</div>
                    <div className="text-xs text-neutral-400">Land</div>
                  </div>
                )}

                {/* Multiplier pill badge in top right */}
                <div
                  className="absolute top-1 right-1 bg-black/90 text-white font-extrabold text-[10px] px-1.5 py-0.5 rounded-none border border-white/40 shadow-sm"
                  style={{ zIndex: 20 }}
                >
                  ×{land.count}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-3 select-none">
      {/* 17Lands-Style Navigation & View Controls Bar */}
      <div
        className={`rounded-xl p-2 flex flex-col gap-2 transition-colors ${
          isDarkMode
            ? 'bg-neutral-900/90 border border-neutral-800'
            : 'bg-neutral-100/90 border border-neutral-200'
        }`}
      >
        {/* Top Row: Maindeck vs Sideboard Tab Switcher */}
        <div className="flex items-center justify-between">
          <div
            className={`flex p-0.5 rounded-lg border transition-colors ${
              isDarkMode
                ? 'bg-neutral-800/80 border-neutral-700/60'
                : 'bg-neutral-200/80 border-neutral-300/60'
            }`}
          >
            <button
              onClick={() => setActiveTab('main')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'main'
                  ? isDarkMode
                    ? 'bg-neutral-700 text-white shadow-xs'
                    : 'bg-white text-neutral-900 shadow-xs'
                  : isDarkMode
                  ? 'text-neutral-400 hover:text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Maindeck ({totalMaindeckCount})
            </button>
            <button
              onClick={() => setActiveTab('sideboard')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'sideboard'
                  ? isDarkMode
                    ? 'bg-neutral-700 text-white shadow-xs'
                    : 'bg-white text-neutral-900 shadow-xs'
                  : isDarkMode
                  ? 'text-neutral-400 hover:text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Sideboard ({sideboard.length})
            </button>
          </div>

          {/* Split View Toggle (17Lands feature) */}
          <button
            onClick={() => setSplitView(!splitView)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
              splitView
                ? 'bg-teal-700 text-white border-teal-800 shadow-xs'
                : isDarkMode
                ? 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-750'
                : 'bg-white text-neutral-700 border-neutral-300/80 hover:bg-neutral-50'
            }`}
            title="Split by Creatures vs Spells"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Split View</span>
          </button>
        </div>

        {/* Sub-bar: Quick Mana Curve Stats & Guidance */}
        <div
          className={`flex items-center justify-between text-[11px] px-1 font-medium ${
            isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>
              {creatures.length} Creatures · {spells.length} Spells ·{' '}
              {lands.reduce((s, l) => s + l.count, 0)} Lands
            </span>
          </div>
          <span className={`text-[10px] ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Swipe horizontally →
          </span>
        </div>
      </div>

      {/* VIEW CONTENT */}
      {activeTab === 'main' ? (
        !splitView ? (
          /* 17Lands Unified Mana Curve View (Cards sorted by CMC columns + Lands column, no CMC headers) */
          <div className="overflow-x-auto flex gap-2 pb-4 pt-1 no-scrollbar scroll-smooth px-0.5 items-start">
            {cmcKeys.map((cmc) => {
              const cardsInCmc = maindeckCmcGroups[cmc];
              return renderCardColumn(cardsInCmc, `main-cmc-${cmc}`);
            })}

            {/* Lands Column at the end of the curve */}
            {renderLandsColumn()}
          </div>
        ) : (
          /* 17Lands Split View Mode: Creatures, Spells, and Lands */
          <div className="space-y-4">
            {/* Creatures Section */}
            <div>
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isDarkMode ? 'text-neutral-300' : 'text-neutral-600'
                  }`}
                >
                  Creatures ({creatures.length})
                </span>
              </div>
              <div className="overflow-x-auto flex gap-2 pb-3 no-scrollbar scroll-smooth px-0.5 items-start">
                {Object.keys(creatureGroups)
                  .map(Number)
                  .sort((a, b) => a - b)
                  .map((cmc) => renderCardColumn(creatureGroups[cmc], `creature-cmc-${cmc}`))}
              </div>
            </div>

            {/* Non-Creatures Section */}
            <div>
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isDarkMode ? 'text-neutral-300' : 'text-neutral-600'
                  }`}
                >
                  Non-Creatures ({spells.length})
                </span>
              </div>
              <div className="overflow-x-auto flex gap-2 pb-3 no-scrollbar scroll-smooth px-0.5 items-start">
                {Object.keys(spellGroups)
                  .map(Number)
                  .sort((a, b) => a - b)
                  .map((cmc) => renderCardColumn(spellGroups[cmc], `spell-cmc-${cmc}`))}
              </div>
            </div>

            {/* Lands Section */}
            <div>
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isDarkMode ? 'text-neutral-300' : 'text-neutral-600'
                  }`}
                >
                  Lands ({lands.reduce((sum, l) => sum + l.count, 0)})
                </span>
              </div>
              <div className="overflow-x-auto flex gap-2 pb-3 no-scrollbar scroll-smooth px-0.5 items-start">
                {renderLandsColumn()}
              </div>
            </div>
          </div>
        )
      ) : (
        /* Sideboard Tab View: Square MTG cards stacked by mana value */
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isDarkMode ? 'text-neutral-300' : 'text-neutral-600'
              }`}
            >
              Sideboard ({sideboard.length} Cards)
            </span>
            <span className={`text-[10px] ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
              Sorted by Mana Value
            </span>
          </div>

          <div className="overflow-x-auto flex gap-2 pb-4 pt-1 no-scrollbar scroll-smooth px-0.5 items-start">
            {sbCmcKeys.length === 0 ? (
              <div className="text-xs text-neutral-400 py-6 italic text-center w-full">
                No sideboard cards
              </div>
            ) : (
              sbCmcKeys.map((cmc) => {
                const cardsInCmc = sideboardCmcGroups[cmc];
                return renderCardColumn(cardsInCmc, `sb-cmc-${cmc}`);
              })
            )}
          </div>
        </div>
      )}

      {/* 17Lands High-Resolution Card Inspector Modal */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs transition-opacity"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="relative max-w-[280px] w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute -top-10 right-0 p-1.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              aria-label="Close card preview"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full rounded-none overflow-hidden shadow-2xl border-2 border-black bg-neutral-900">
              <img
                src={getScryfallImageUrl(selectedCard.name)}
                alt={selectedCard.name}
                className="w-full h-auto object-contain rounded-none"
              />
            </div>
            <div className="mt-3 text-center text-white">
              <h4 className="font-bold text-sm tracking-wide">
                {selectedCard.name}
              </h4>
              <p className="text-xs text-neutral-300">
                {selectedCard.type === 'land'
                  ? `Basic / Land (Quantity: ${selectedCard.count ?? 1})`
                  : `Mana Value: ${selectedCard.cmc} · ${selectedCard.type.toUpperCase()}`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
