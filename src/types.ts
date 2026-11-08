export type MTGColor = 'W' | 'U' | 'B' | 'R' | 'G';

export interface DeckCard {
  name: string;
  cmc: number;
  type: 'creature' | 'spell' | 'land';
  count?: number;
  manaCost?: string;
}

export interface MatchRecord {
  round: number;
  opponent: string;
  opponentColors: MTGColor[];
  result: 'W' | 'L';
  gameScore: string;
}

export interface DraftLogItem {
  id: number;
  colors: MTGColor[];
  score: string;
  set: string;
  date: string;
  creaturesCount?: number;
  spellsCount?: number;
  landsCount?: number;
  creatures?: DeckCard[];
  spells?: DeckCard[];
  lands?: { name: string; count: number }[];
  sideboard?: DeckCard[];
  matches?: MatchRecord[];
}
