import { Card, CardCategory, DeckCard } from '@/types';

// Keywords and patterns for categorizing cards

const RAMP_PATTERNS = [
  /add.*mana/i,
  /search.*library.*land/i,
  /land.*onto the battlefield/i,
  /create.*treasure/i,
  /mana of any color/i,
  /adds? \{[WUBRGC]\}/i,
];

const RAMP_CARD_NAMES = [
  'sol ring', 'arcane signet', 'mana crypt', 'mana vault',
  'cultivate', 'kodama\'s reach', 'nature\'s lore', 'three visits',
  'rampant growth', 'farseek', 'birds of paradise', 'llanowar elves',
  'elvish mystic', 'dockside extortionist', 'smothering tithe',
  'dark ritual', 'cabal ritual', 'commander\'s sphere', 'mind stone',
  'thought vessel', 'fellwar stone', 'talisman of',
];

const DRAW_PATTERNS = [
  /draw.*card/i,
  /draws?.*cards/i,
  /look at the top.*put.*into your hand/i,
  /reveal.*put.*into your hand/i,
  /whenever.*draw/i,
];

const DRAW_CARD_NAMES = [
  'rhystic study', 'mystic remora', 'phyrexian arena', 'sylvan library',
  'necropotence', 'skullclamp', 'esper sentinel', 'dark confidant',
  'beast whisperer', 'guardian project', 'the great henge',
  'brainstorm', 'ponder', 'preordain', 'sign in blood', 'read the bones',
  'night\'s whisper', 'windfall', 'wheel of fortune',
];

const REMOVAL_PATTERNS = [
  /destroy target/i,
  /exile target/i,
  /target.*gets? -/i,
  /deals? \d+ damage to/i,
  /return target.*to.*owner's hand/i,
  /counter target spell/i,
];

const REMOVAL_CARD_NAMES = [
  'swords to plowshares', 'path to exile', 'beast within', 'chaos warp',
  'generous gift', 'rapid hybridization', 'pongify', 'reality shift',
  'counterspell', 'swan song', 'negate', 'dovin\'s veto',
  'assassin\'s trophy', 'abrupt decay', 'anguished unmaking',
  'vindicate', 'terminate', 'go for the throat', 'infernal grasp',
];

const BOARD_WIPE_PATTERNS = [
  /destroy all/i,
  /exile all/i,
  /all creatures get -/i,
  /each.*creature.*deals damage/i,
  /return all.*to.*owners' hands/i,
];

const BOARD_WIPE_CARD_NAMES = [
  'wrath of god', 'damnation', 'farewell', 'cyclonic rift',
  'blasphemous act', 'toxic deluge', 'vanquish the horde',
  'austere command', 'merciless eviction', 'hour of revelation',
  'supreme verdict', 'day of judgment', 'decree of pain',
];

const TUTOR_PATTERNS = [
  /search your library for/i,
];

const TUTOR_CARD_NAMES = [
  'demonic tutor', 'vampiric tutor', 'diabolic intent', 'worldly tutor',
  'mystical tutor', 'enlightened tutor', 'gamble', 'imperial seal',
  'green sun\'s zenith', 'finale of devastation', 'chord of calling',
];

const PROTECTION_PATTERNS = [
  /hexproof/i,
  /indestructible/i,
  /shroud/i,
  /protection from/i,
  /can't be the target/i,
  /can't be countered/i,
];

const PROTECTION_CARD_NAMES = [
  'lightning greaves', 'swiftfoot boots', 'whispersilk cloak',
  'teferi\'s protection', 'heroic intervention', 'flawless maneuver',
  'fierce guardianship', 'deflecting swat', 'grand abolisher',
];

const GRAVEYARD_PATTERNS = [
  /return.*from.*graveyard/i,
  /graveyard to the battlefield/i,
  /mill/i,
  /put.*into.*graveyard/i,
  /exile.*graveyard/i,
];

const GRAVEYARD_CARD_NAMES = [
  'reanimate', 'animate dead', 'necromancy', 'living death',
  'victimize', 'dread return', 'entomb', 'buried alive',
  'persist', 'unearth', 'exhume',
];

function matchesPatterns(text: string, patterns: RegExp[]): boolean {
  return patterns.some(pattern => pattern.test(text));
}

function matchesCardNames(name: string, names: string[]): boolean {
  const lowerName = name.toLowerCase();
  return names.some(n => lowerName.includes(n.toLowerCase()));
}

export function categorizeCard(card: Card): CardCategory {
  const oracleText = card.oracle_text || '';
  const typeLine = card.type_line || '';
  const name = card.name;

  // Check type line first for basic categories
  if (typeLine.includes('Land')) {
    return 'land';
  }

  // Check for specific card name matches (highest priority)
  if (matchesCardNames(name, TUTOR_CARD_NAMES)) return 'tutor';
  if (matchesCardNames(name, BOARD_WIPE_CARD_NAMES)) return 'boardWipe';
  if (matchesCardNames(name, RAMP_CARD_NAMES)) return 'ramp';
  if (matchesCardNames(name, DRAW_CARD_NAMES)) return 'draw';
  if (matchesCardNames(name, REMOVAL_CARD_NAMES)) return 'removal';
  if (matchesCardNames(name, PROTECTION_CARD_NAMES)) return 'protection';
  if (matchesCardNames(name, GRAVEYARD_CARD_NAMES)) return 'graveyard';

  // Check oracle text patterns
  if (matchesPatterns(oracleText, TUTOR_PATTERNS)) return 'tutor';
  if (matchesPatterns(oracleText, BOARD_WIPE_PATTERNS)) return 'boardWipe';
  if (matchesPatterns(oracleText, RAMP_PATTERNS)) return 'ramp';
  if (matchesPatterns(oracleText, DRAW_PATTERNS)) return 'draw';
  if (matchesPatterns(oracleText, REMOVAL_PATTERNS)) return 'removal';
  if (matchesPatterns(oracleText, PROTECTION_PATTERNS)) return 'protection';
  if (matchesPatterns(oracleText, GRAVEYARD_PATTERNS)) return 'graveyard';

  // Fall back to type-based categories
  if (typeLine.includes('Creature')) return 'creature';
  if (typeLine.includes('Instant')) return 'instant';
  if (typeLine.includes('Sorcery')) return 'sorcery';
  if (typeLine.includes('Artifact')) return 'artifact';
  if (typeLine.includes('Enchantment')) return 'enchantment';
  if (typeLine.includes('Planeswalker')) return 'planeswalker';

  return 'other';
}

export function categorizeDeck(cards: DeckCard[]): DeckCard[] {
  return cards.map(deckCard => ({
    ...deckCard,
    category: deckCard.isCommander ? 'commander' : categorizeCard(deckCard.card),
  }));
}

export function getCategoryStats(cards: DeckCard[]): Record<CardCategory, number> {
  const stats: Record<CardCategory, number> = {
    commander: 0,
    creature: 0,
    instant: 0,
    sorcery: 0,
    artifact: 0,
    enchantment: 0,
    planeswalker: 0,
    land: 0,
    ramp: 0,
    draw: 0,
    removal: 0,
    boardWipe: 0,
    protection: 0,
    tutor: 0,
    graveyard: 0,
    other: 0,
  };

  cards.forEach(card => {
    const category = card.category || categorizeCard(card.card);
    stats[category] += card.quantity;
  });

  return stats;
}

export function analyzeCategoryBalance(stats: Record<CardCategory, number>): Array<{
  category: CardCategory;
  count: number;
  status: 'low' | 'optimal' | 'high';
  recommendation: string;
}> {
  const recommendations: Array<{
    category: CardCategory;
    count: number;
    status: 'low' | 'optimal' | 'high';
    recommendation: string;
  }> = [];

  // Land analysis
  const landCount = stats.land;
  if (landCount < 33) {
    recommendations.push({
      category: 'land',
      count: landCount,
      status: 'low',
      recommendation: `Consider adding ${33 - landCount} more lands. 33-38 is recommended.`,
    });
  } else if (landCount > 40) {
    recommendations.push({
      category: 'land',
      count: landCount,
      status: 'high',
      recommendation: `Consider cutting ${landCount - 38} lands. 33-38 is typical.`,
    });
  }

  // Ramp analysis
  const rampCount = stats.ramp;
  if (rampCount < 10) {
    recommendations.push({
      category: 'ramp',
      count: rampCount,
      status: 'low',
      recommendation: `Add ${10 - rampCount} more ramp sources. 10-12 is recommended.`,
    });
  }

  // Draw analysis
  const drawCount = stats.draw;
  if (drawCount < 10) {
    recommendations.push({
      category: 'draw',
      count: drawCount,
      status: 'low',
      recommendation: `Add ${10 - drawCount} more card draw sources. 10-12 is recommended.`,
    });
  }

  // Removal analysis
  const removalCount = stats.removal + stats.boardWipe;
  if (removalCount < 8) {
    recommendations.push({
      category: 'removal',
      count: removalCount,
      status: 'low',
      recommendation: `Add ${8 - removalCount} more removal spells. 8-12 is recommended.`,
    });
  }

  return recommendations;
}
