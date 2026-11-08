import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getScoreBadgeStyle,
  groupCardsByCmc,
  getScryfallImageUrl,
  calculateDraftStats,
  INITIAL_DRAFTS,
} from './draft';
import { DeckCard } from '../types';

test('getScoreBadgeStyle assigns green to 7-x trophies', () => {
  const result72 = getScoreBadgeStyle('7-2');
  assert.ok(result72.bg.includes('emerald'));

  const result70 = getScoreBadgeStyle('7-0');
  assert.ok(result70.bg.includes('emerald'));
});

test('getScoreBadgeStyle assigns red to 0-3 elimination', () => {
  const result03 = getScoreBadgeStyle('0-3');
  assert.ok(result03.bg.includes('rose'));
});

test('getScoreBadgeStyle assigns neutral gray to intermediate scores', () => {
  const result43 = getScoreBadgeStyle('4-3');
  assert.ok(result43.bg.includes('neutral'));

  const result13 = getScoreBadgeStyle('1-3');
  assert.ok(result13.bg.includes('neutral'));
});

test('groupCardsByCmc correctly aggregates cards by mana value', () => {
  const cards: DeckCard[] = [
    { name: 'Faerie Seer', cmc: 1, type: 'creature' },
    { name: 'Skyclave Apparition', cmc: 2, type: 'creature' },
    { name: 'Watcher of the Spheres', cmc: 2, type: 'creature' },
    { name: 'Reflector Mage', cmc: 3, type: 'creature' },
    { name: 'Supreme Phantom', cmc: 3, type: 'creature' },
    { name: 'Empyrean Eagle', cmc: 4, type: 'creature' },
  ];

  const grouped = groupCardsByCmc(cards);
  assert.equal(grouped[1]?.length, 1);
  assert.equal(grouped[2]?.length, 2);
  assert.equal(grouped[3]?.length, 2);
  assert.equal(grouped[4]?.length, 1);
  assert.equal(grouped[2][0].name, 'Skyclave Apparition');
  assert.equal(grouped[2][1].name, 'Watcher of the Spheres');
});

test('getScryfallImageUrl builds valid encoded image endpoints', () => {
  const url = getScryfallImageUrl('Watcher of the Spheres');
  assert.equal(
    url,
    'https://api.scryfall.com/cards/named?exact=Watcher%20of%20the%20Spheres&format=image&version=normal'
  );
});

test('calculateDraftStats aggregates wins and winrate accurately', () => {
  const stats = calculateDraftStats(INITIAL_DRAFTS);
  assert.equal(stats.draftCount, 5);
  // 7+0+4+7+1 = 19 wins, 2+3+3+0+3 = 11 losses, total = 30 games
  assert.equal(stats.totalWins, 19);
  assert.equal(stats.totalLosses, 11);
  assert.equal(stats.winRate, 63); // 19 / 30 = 63.33%
});

test('calculateDraftStats accurately calculates stats for a specific set', () => {
  const fdnDrafts = INITIAL_DRAFTS.filter((d) => d.set === 'FDN');
  assert.equal(fdnDrafts.length, 2);
  const fdnStats = calculateDraftStats(fdnDrafts);
  // 7-2 + 4-3 = 11 wins, 5 losses, total = 16 games. 11/16 = 68.75% -> 69%
  assert.equal(fdnStats.totalWins, 11);
  assert.equal(fdnStats.totalLosses, 5);
  assert.equal(fdnStats.winRate, 69);
  assert.equal(fdnStats.draftCount, 2);

  const dskDrafts = INITIAL_DRAFTS.filter((d) => d.set === 'DSK');
  assert.equal(dskDrafts.length, 2);
  const dskStats = calculateDraftStats(dskDrafts);
  // 0-3 + 1-3 = 1 win, 6 losses, total = 7 games. 1/7 = 14.28% -> 14%
  assert.equal(dskStats.totalWins, 1);
  assert.equal(dskStats.totalLosses, 6);
  assert.equal(dskStats.winRate, 14);
});

test('draft 1 contains mock sideboard cards: Disenchant, Negate, Aether Spellbomb and more', () => {
  const draft1 = INITIAL_DRAFTS.find((d) => d.id === 1);
  assert.ok(draft1);
  assert.ok(draft1.sideboard);
  assert.equal(draft1.sideboard.length, 7);
  const names = draft1.sideboard.map((c) => c.name);
  assert.ok(names.includes('Disenchant'));
  assert.ok(names.includes('Negate'));
  assert.ok(names.includes('Aether Spellbomb'));
});

