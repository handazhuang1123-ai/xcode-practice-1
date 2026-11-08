import { DeckCard, DraftLogItem, MTGColor } from '../types';

export const COLOR_CONFIG: Record<MTGColor, { hex: string; name: string; border?: string }> = {
  W: { hex: '#F9FAF4', name: 'White', border: '#D1D5DB' },
  U: { hex: '#0E68AB', name: 'Blue' },
  B: { hex: '#150B00', name: 'Black' },
  R: { hex: '#D3202A', name: 'Red' },
  G: { hex: '#00733E', name: 'Green' },
};

/**
 * Returns style classes for score badge according to specifications:
 * - Green for 7-x
 * - Red for 0-3
 * - Gray for others
 */
export function getScoreBadgeStyle(score: string): { bg: string; text: string; label: string } {
  const trimmed = score.trim();
  if (trimmed.startsWith('7-')) {
    return {
      bg: 'bg-emerald-500 text-white',
      text: 'text-emerald-700',
      label: 'Trophy (7 wins)',
    };
  }
  if (trimmed === '0-3') {
    return {
      bg: 'bg-rose-500 text-white',
      text: 'text-rose-700',
      label: 'Eliminated (0-3)',
    };
  }
  return {
    bg: 'bg-neutral-200 text-neutral-800',
    text: 'text-neutral-700',
    label: `${trimmed}`,
  };
}

/**
 * Generates official Scryfall image URL for a named card
 */
export function getScryfallImageUrl(cardName: string): string {
  return `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}&format=image&version=normal`;
}

/**
 * Groups cards by their converted mana cost (CMC) in ascending order
 */
export function groupCardsByCmc(cards: DeckCard[]): Record<number, DeckCard[]> {
  const groups: Record<number, DeckCard[]> = {};
  for (const card of cards) {
    const cmc = card.cmc;
    if (!groups[cmc]) {
      groups[cmc] = [];
    }
    groups[cmc].push(card);
  }
  return groups;
}

/**
 * Extracts total wins and losses from a score string (e.g. '7-2')
 */
export function parseScore(score: string): { wins: number; losses: number } {
  const parts = score.split('-');
  const wins = parseInt(parts[0], 10) || 0;
  const losses = parseInt(parts[1], 10) || 0;
  return { wins, losses };
}

/**
 * Calculate win rate statistics from a list of drafts
 */
export function calculateDraftStats(drafts: DraftLogItem[]) {
  let totalWins = 0;
  let totalLosses = 0;
  for (const draft of drafts) {
    const { wins, losses } = parseScore(draft.score);
    totalWins += wins;
    totalLosses += losses;
  }
  const totalGames = totalWins + totalLosses;
  const winRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;
  return {
    totalWins,
    totalLosses,
    totalGames,
    winRate,
    draftCount: drafts.length,
  };
}

// Initial Mock Data according to user prompt
export const INITIAL_DRAFTS: DraftLogItem[] = [
  {
    id: 1,
    colors: ['W', 'U'],
    score: '7-2',
    set: 'FDN',
    date: 'Nov 6',
    creaturesCount: 15,
    spellsCount: 8,
    landsCount: 17,
    creatures: [
      { name: 'Faerie Seer', cmc: 1, type: 'creature' },
      { name: "Healer's Hawk", cmc: 1, type: 'creature' },
      { name: 'Skyclave Apparition', cmc: 2, type: 'creature' },
      { name: 'Watcher of the Spheres', cmc: 2, type: 'creature' },
      { name: 'Faerie Mastermind', cmc: 2, type: 'creature' },
      { name: 'Zephyr Sentinel', cmc: 2, type: 'creature' },
      { name: 'Brazen Borrower', cmc: 2, type: 'creature' },
      { name: 'Reflector Mage', cmc: 3, type: 'creature' },
      { name: 'Supreme Phantom', cmc: 3, type: 'creature' },
      { name: 'Inspiring Overseer', cmc: 3, type: 'creature' },
      { name: 'Aven Courier', cmc: 3, type: 'creature' },
      { name: 'Empyrean Eagle', cmc: 4, type: 'creature' },
      { name: 'Restoration Angel', cmc: 4, type: 'creature' },
      { name: 'Serra Angel', cmc: 5, type: 'creature' },
      { name: 'Cloudblazer', cmc: 5, type: 'creature' },
    ],
    spells: [
      { name: 'Consider', cmc: 1, type: 'spell' },
      { name: 'Spell Stutter', cmc: 2, type: 'spell' },
      { name: 'Fateful Absence', cmc: 2, type: 'spell' },
      { name: 'Into the Roil', cmc: 2, type: 'spell' },
      { name: 'Stroke of Midnight', cmc: 3, type: 'spell' },
      { name: 'Thirst for Discovery', cmc: 3, type: 'spell' },
      { name: 'Settle the Wreckage', cmc: 4, type: 'spell' },
      { name: 'Cast Out', cmc: 4, type: 'spell' },
    ],
    lands: [
      { name: 'Plains', count: 8 },
      { name: 'Island', count: 7 },
      { name: 'Tranquil Cove', count: 2 },
    ],
    sideboard: [
      { name: 'Disenchant', cmc: 2, type: 'spell' },
      { name: 'Negate', cmc: 2, type: 'spell' },
      { name: 'Aether Spellbomb', cmc: 1, type: 'spell' },
      { name: 'Essence Scatter', cmc: 2, type: 'spell' },
      { name: 'Celestial Purge', cmc: 2, type: 'spell' },
      { name: 'Unsummon', cmc: 1, type: 'spell' },
      { name: 'Revoke Existence', cmc: 2, type: 'spell' },
    ],
    matches: [
      { round: 1, opponent: 'MonoRedAggro', opponentColors: ['R'], result: 'W', gameScore: '2-1' },
      { round: 2, opponent: 'GolgariRoots', opponentColors: ['B', 'G'], result: 'W', gameScore: '2-0' },
      { round: 3, opponent: 'AzoriusFlyers', opponentColors: ['W', 'U'], result: 'L', gameScore: '1-2' },
      { round: 4, opponent: 'BorosConvoke', opponentColors: ['W', 'R'], result: 'W', gameScore: '2-0' },
      { round: 5, opponent: 'DimirControl', opponentColors: ['U', 'B'], result: 'W', gameScore: '2-1' },
      { round: 6, opponent: 'SimicRamp', opponentColors: ['U', 'G'], result: 'W', gameScore: '2-0' },
      { round: 7, opponent: 'IzzetSpells', opponentColors: ['U', 'R'], result: 'L', gameScore: '0-2' },
      { round: 8, opponent: 'OrzhovAristocrats', opponentColors: ['W', 'B'], result: 'W', gameScore: '2-1' },
      { round: 9, opponent: 'GruulDinosaurs', opponentColors: ['R', 'G'], result: 'W', gameScore: '2-1' },
    ],
  },
  {
    id: 2,
    colors: ['B', 'R'],
    score: '0-3',
    set: 'DSK',
    date: 'Nov 5',
    creaturesCount: 12,
    spellsCount: 11,
    landsCount: 17,
    creatures: [
      { name: 'Greedy Freebooter', cmc: 1, type: 'creature' },
      { name: 'Bloodthirsty Conqueror', cmc: 3, type: 'creature' },
      { name: 'Razorkin Needlehead', cmc: 2, type: 'creature' },
    ],
    spells: [
      { name: 'Pyroclasm', cmc: 2, type: 'spell' },
      { name: 'Nowhere to Run', cmc: 2, type: 'spell' },
    ],
    lands: [
      { name: 'Swamp', count: 9 },
      { name: 'Mountain', count: 8 },
    ],
    sideboard: [
      { name: 'Duress', cmc: 1, type: 'spell' },
      { name: 'Abrade', cmc: 2, type: 'spell' },
    ],
    matches: [
      { round: 1, opponent: 'DimirEerie', opponentColors: ['U', 'B'], result: 'L', gameScore: '0-2' },
      { round: 2, opponent: 'BorosRooms', opponentColors: ['R', 'W'], result: 'L', gameScore: '1-2' },
      { round: 3, opponent: 'GolgariDelerium', opponentColors: ['B', 'G'], result: 'L', gameScore: '0-2' },
    ],
  },
  {
    id: 3,
    colors: ['R', 'G'],
    score: '4-3',
    set: 'FDN',
    date: 'Nov 4',
    creaturesCount: 16,
    spellsCount: 7,
    landsCount: 17,
    creatures: [
      { name: 'Llanowar Elves', cmc: 1, type: 'creature' },
      { name: 'Gargoyle Sentinel', cmc: 2, type: 'creature' },
      { name: 'Aggressive Mammoth', cmc: 6, type: 'creature' },
    ],
    spells: [
      { name: 'Lightning Bolt', cmc: 1, type: 'spell' },
      { name: 'Overrun', cmc: 5, type: 'spell' },
    ],
    lands: [
      { name: 'Forest', count: 9 },
      { name: 'Mountain', count: 8 },
    ],
    sideboard: [
      { name: 'Giant Growth', cmc: 1, type: 'spell' },
      { name: 'Plummet', cmc: 2, type: 'spell' },
    ],
  },
  {
    id: 4,
    colors: ['U', 'B'],
    score: '7-0',
    set: 'BLB',
    date: 'Nov 2',
    creaturesCount: 15,
    spellsCount: 8,
    landsCount: 17,
    creatures: [
      { name: 'Shoreline Looter', cmc: 2, type: 'creature' },
      { name: 'Thought-Stalker Warlock', cmc: 3, type: 'creature' },
      { name: 'Daggerfang Duo', cmc: 3, type: 'creature' },
      { name: 'Mindwhisker', cmc: 4, type: 'creature' },
    ],
    spells: [
      { name: 'Fell', cmc: 2, type: 'spell' },
      { name: 'Into the Flood Maw', cmc: 1, type: 'spell' },
    ],
    lands: [
      { name: 'Island', count: 9 },
      { name: 'Swamp', count: 8 },
    ],
    sideboard: [
      { name: 'Spell Pierce', cmc: 1, type: 'spell' },
      { name: 'Feed the Swarm', cmc: 2, type: 'spell' },
    ],
  },
  {
    id: 5,
    colors: ['W', 'U', 'B', 'R', 'G'],
    score: '1-3',
    set: 'DSK',
    date: 'Oct 31',
    creaturesCount: 13,
    spellsCount: 10,
    landsCount: 17,
    creatures: [
      { name: 'Omnath, Locus of All', cmc: 5, type: 'creature' },
      { name: 'Dryad of the Ilysian Grove', cmc: 3, type: 'creature' },
    ],
    spells: [
      { name: 'Leyline Binding', cmc: 6, type: 'spell' },
      { name: 'Bring to Light', cmc: 5, type: 'spell' },
    ],
    lands: [
      { name: '5-Color Mana Base', count: 17 },
    ],
    sideboard: [
      { name: 'Cultivate', cmc: 3, type: 'spell' },
      { name: 'Counterspell', cmc: 2, type: 'spell' },
    ],
  },
];
