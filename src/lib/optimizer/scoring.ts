import { Card, CardCategory, DeckCard, ManaColor, CardScore } from '@/types';
import { getStaplesForColors, isStaple } from '@/data/staples';
import { calculateSynergyScore } from '@/data/synergies';

// Score a card based on multiple factors

export function scoreCard(
  card: Card,
  commander: Card | null,
  deckCards: DeckCard[],
  colorIdentity: ManaColor[]
): CardScore {
  const metaScore = calculateMetaScore(card, colorIdentity);
  const synergyScore = calculateSynergyWithDeck(card, commander, deckCards);
  const manaEfficiency = calculateManaEfficiency(card);
  const versatility = calculateVersatility(card);

  // Weighted average
  const overall = (
    metaScore * 0.35 +
    synergyScore * 0.30 +
    manaEfficiency * 0.20 +
    versatility * 0.15
  );

  return {
    overall: Math.round(overall * 10) / 10,
    metaScore: Math.round(metaScore * 10) / 10,
    synergyScore: Math.round(synergyScore * 10) / 10,
    manaEfficiency: Math.round(manaEfficiency * 10) / 10,
    versatility: Math.round(versatility * 10) / 10,
  };
}

function calculateMetaScore(card: Card, colorIdentity: ManaColor[]): number {
  // Check if it's a known staple
  const staple = isStaple(card.name, colorIdentity);
  if (staple) {
    return staple.playRate;
  }

  // Use EDHREC rank if available
  if (card.edhrec_rank) {
    // Lower rank = more popular
    // Rank 1-100: score 90-100
    // Rank 100-1000: score 70-90
    // Rank 1000-5000: score 50-70
    // Rank 5000-10000: score 30-50
    // Rank 10000+: score 10-30
    if (card.edhrec_rank <= 100) {
      return 90 + (100 - card.edhrec_rank) / 10;
    } else if (card.edhrec_rank <= 1000) {
      return 70 + (1000 - card.edhrec_rank) / 45;
    } else if (card.edhrec_rank <= 5000) {
      return 50 + (5000 - card.edhrec_rank) / 200;
    } else if (card.edhrec_rank <= 10000) {
      return 30 + (10000 - card.edhrec_rank) / 250;
    } else {
      return Math.max(10, 30 - (card.edhrec_rank - 10000) / 1000);
    }
  }

  // Base score on rarity and type
  let baseScore = 40;

  switch (card.rarity) {
    case 'mythic':
      baseScore += 15;
      break;
    case 'rare':
      baseScore += 10;
      break;
    case 'uncommon':
      baseScore += 5;
      break;
  }

  return baseScore;
}

function calculateSynergyWithDeck(
  card: Card,
  commander: Card | null,
  deckCards: DeckCard[]
): number {
  let synergyScore = 0;
  let synergyCount = 0;

  // Check synergy with commander
  if (commander) {
    const commanderSynergy = calculateCardSynergy(card, commander);
    if (commanderSynergy > 0) {
      synergyScore += commanderSynergy * 2; // Commander synergy is weighted higher
      synergyCount++;
    }
  }

  // Check synergy with other cards in deck
  deckCards.forEach(deckCard => {
    if (deckCard.card.id === card.id) return;

    const synergy = calculateCardSynergy(card, deckCard.card);
    if (synergy > 0) {
      synergyScore += synergy;
      synergyCount++;
    }
  });

  if (synergyCount === 0) return 30; // Base synergy score

  // Normalize to 0-100
  const avgSynergy = synergyScore / synergyCount;
  return Math.min(100, 30 + avgSynergy * 7);
}

function calculateCardSynergy(card1: Card, card2: Card): number {
  // Check known synergy patterns
  const knownSynergy = calculateSynergyScore(card1.name, card2.name);
  if (knownSynergy > 0) return knownSynergy;

  // Check keyword synergies
  const keywords1 = card1.keywords || [];
  const keywords2 = card2.keywords || [];

  let synergy = 0;

  // Tribal synergies
  const creatureTypes1 = extractCreatureTypes(card1.type_line);
  const creatureTypes2 = extractCreatureTypes(card2.type_line);

  if (creatureTypes1.length > 0 && creatureTypes2.length > 0) {
    const sharedTypes = creatureTypes1.filter(t => creatureTypes2.includes(t));
    synergy += sharedTypes.length * 2;
  }

  // Keyword synergies
  const synergyKeywords = [
    ['sacrifice', 'dies', 'graveyard'],
    ['token', 'populate', 'create'],
    ['counter', '+1/+1', 'proliferate'],
    ['draw', 'discard', 'wheel'],
    ['landfall', 'land', 'enters'],
    ['artifact', 'metalcraft', 'affinity'],
    ['enchantment', 'constellation', 'aura'],
  ];

  const text1 = (card1.oracle_text || '').toLowerCase();
  const text2 = (card2.oracle_text || '').toLowerCase();

  synergyKeywords.forEach(group => {
    const card1HasKeyword = group.some(k => text1.includes(k) || keywords1.some(kw => kw.toLowerCase().includes(k)));
    const card2HasKeyword = group.some(k => text2.includes(k) || keywords2.some(kw => kw.toLowerCase().includes(k)));

    if (card1HasKeyword && card2HasKeyword) {
      synergy += 3;
    }
  });

  return Math.min(10, synergy);
}

function extractCreatureTypes(typeLine: string): string[] {
  if (!typeLine || !typeLine.includes('Creature')) return [];

  const parts = typeLine.split('—');
  if (parts.length < 2) return [];

  return parts[1].trim().split(' ').map(t => t.toLowerCase());
}

function calculateManaEfficiency(card: Card): number {
  const cmc = card.cmc;

  // Very efficient (0-2 CMC)
  if (cmc <= 2) return 85 + (2 - cmc) * 5;

  // Efficient (3-4 CMC)
  if (cmc <= 4) return 70 + (4 - cmc) * 5;

  // Average (5-6 CMC)
  if (cmc <= 6) return 50 + (6 - cmc) * 10;

  // Expensive (7+ CMC) - still can be good if powerful
  return Math.max(20, 50 - (cmc - 6) * 5);
}

function calculateVersatility(card: Card): number {
  let score = 50;
  const text = (card.oracle_text || '').toLowerCase();
  const typeLine = card.type_line || '';

  // Modal cards are more versatile
  if (text.includes('choose one') || text.includes('choose two')) {
    score += 20;
  }

  // Cards with multiple abilities
  const abilities = text.split('\n').filter(line => line.trim().length > 0);
  score += Math.min(20, abilities.length * 5);

  // Instant speed is more versatile
  if (typeLine.includes('Instant') || text.includes('flash')) {
    score += 15;
  }

  // Can target multiple permanent types
  const targetTypes = ['creature', 'artifact', 'enchantment', 'planeswalker', 'land'];
  const targetsCount = targetTypes.filter(t => text.includes(t)).length;
  score += targetsCount * 5;

  return Math.min(100, score);
}

export function compareCards(
  current: Card,
  suggested: Card,
  commander: Card | null,
  deckCards: DeckCard[],
  colorIdentity: ManaColor[]
): {
  currentScore: CardScore;
  suggestedScore: CardScore;
  improvement: number;
} {
  const currentScore = scoreCard(current, commander, deckCards, colorIdentity);
  const suggestedScore = scoreCard(suggested, commander, deckCards, colorIdentity);
  const improvement = suggestedScore.overall - currentScore.overall;

  return {
    currentScore,
    suggestedScore,
    improvement,
  };
}

export function findWeakestCards(
  deckCards: DeckCard[],
  commander: Card | null,
  colorIdentity: ManaColor[],
  count: number = 10
): Array<{ card: DeckCard; score: CardScore }> {
  const scoredCards = deckCards
    .filter(dc => !dc.isCommander && dc.category !== 'land')
    .map(dc => ({
      card: dc,
      score: scoreCard(dc.card, commander, deckCards, colorIdentity),
    }))
    .sort((a, b) => a.score.overall - b.score.overall);

  return scoredCards.slice(0, count);
}
