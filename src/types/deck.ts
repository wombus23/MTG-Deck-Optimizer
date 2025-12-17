import { Card, DeckCard, ManaColor, CardCategory } from './card';

export interface Deck {
  id: string;
  name: string;
  format: 'commander' | 'standard' | 'modern' | 'legacy' | 'vintage' | 'pauper';
  commander?: Card;
  companion?: Card;
  cards: DeckCard[];
  colorIdentity: ManaColor[];
  createdAt: Date;
  updatedAt: Date;
  source?: 'moxfield' | 'archidekt' | 'manual';
  sourceUrl?: string;
}

export interface DeckStats {
  totalCards: number;
  averageCmc: number;
  manaCurve: Record<number, number>;
  colorDistribution: Record<ManaColor | 'colorless', number>;
  categoryBreakdown: Record<CardCategory, number>;
  landCount: number;
  creatureCount: number;
  nonlandCount: number;
  rampCount: number;
  drawCount: number;
  removalCount: number;
}

export interface DeckValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ImportedDeck {
  name: string;
  commander?: string;
  companion?: string;
  mainboard: Array<{ quantity: number; name: string }>;
  sideboard?: Array<{ quantity: number; name: string }>;
}

export function createEmptyDeck(): Deck {
  return {
    id: crypto.randomUUID(),
    name: 'New Deck',
    format: 'commander',
    cards: [],
    colorIdentity: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    source: 'manual',
  };
}

export function validateCommanderDeck(deck: Deck): DeckValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  const totalCards = deck.cards.reduce((sum, c) => sum + c.quantity, 0);
  const hasCommander = deck.cards.some((c) => c.isCommander);

  if (!hasCommander) {
    errors.push('Deck must have a commander');
  }

  if (totalCards !== 100) {
    errors.push(`Deck must have exactly 100 cards (currently ${totalCards})`);
  }

  // Check singleton rule
  const nonBasicLands = deck.cards.filter((c) => {
    const isBasicLand = c.card.type_line.includes('Basic Land');
    return !isBasicLand;
  });

  const duplicates = nonBasicLands.filter((c) => c.quantity > 1 && !c.isCommander);
  if (duplicates.length > 0) {
    duplicates.forEach((c) => {
      errors.push(`${c.card.name} has ${c.quantity} copies (only 1 allowed)`);
    });
  }

  // Check color identity
  if (deck.commander) {
    const commanderColors = deck.commander.color_identity;
    deck.cards.forEach((c) => {
      const cardColors = c.card.color_identity;
      const invalidColors = cardColors.filter((color) => !commanderColors.includes(color));
      if (invalidColors.length > 0 && !c.isCommander) {
        errors.push(`${c.card.name} is outside commander's color identity`);
      }
    });
  }

  // Warnings for common issues
  const landCount = deck.cards.filter((c) => c.card.type_line.includes('Land')).reduce((sum, c) => sum + c.quantity, 0);
  if (landCount < 30) {
    warnings.push(`Low land count (${landCount}). Consider 33-38 lands.`);
  }
  if (landCount > 42) {
    warnings.push(`High land count (${landCount}). Consider 33-38 lands.`);
  }

  const rampCount = deck.cards.filter((c) => c.category === 'ramp').reduce((sum, c) => sum + c.quantity, 0);
  if (rampCount < 8) {
    warnings.push(`Low ramp count (${rampCount}). Consider 10-12 ramp sources.`);
  }

  const drawCount = deck.cards.filter((c) => c.category === 'draw').reduce((sum, c) => sum + c.quantity, 0);
  if (drawCount < 8) {
    warnings.push(`Low card draw (${drawCount}). Consider 10+ draw sources.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function calculateDeckStats(deck: Deck): DeckStats {
  const nonLandCards = deck.cards.filter((c) => !c.card.type_line.includes('Land'));
  const totalCmc = nonLandCards.reduce((sum, c) => sum + c.card.cmc * c.quantity, 0);
  const totalNonLand = nonLandCards.reduce((sum, c) => sum + c.quantity, 0);

  const manaCurve: Record<number, number> = {};
  nonLandCards.forEach((c) => {
    const cmc = Math.min(c.card.cmc, 7); // Group 7+ together
    manaCurve[cmc] = (manaCurve[cmc] || 0) + c.quantity;
  });

  const colorDistribution: Record<ManaColor | 'colorless', number> = {
    W: 0,
    U: 0,
    B: 0,
    R: 0,
    G: 0,
    C: 0,
    colorless: 0,
  };

  deck.cards.forEach((c) => {
    if (c.card.colors && c.card.colors.length > 0) {
      c.card.colors.forEach((color) => {
        colorDistribution[color] += c.quantity;
      });
    } else {
      colorDistribution.colorless += c.quantity;
    }
  });

  const categoryBreakdown: Record<CardCategory, number> = {
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

  deck.cards.forEach((c) => {
    if (c.category) {
      categoryBreakdown[c.category] += c.quantity;
    }
  });

  return {
    totalCards: deck.cards.reduce((sum, c) => sum + c.quantity, 0),
    averageCmc: totalNonLand > 0 ? totalCmc / totalNonLand : 0,
    manaCurve,
    colorDistribution,
    categoryBreakdown,
    landCount: deck.cards.filter((c) => c.card.type_line.includes('Land')).reduce((sum, c) => sum + c.quantity, 0),
    creatureCount: deck.cards.filter((c) => c.card.type_line.includes('Creature')).reduce((sum, c) => sum + c.quantity, 0),
    nonlandCount: totalNonLand,
    rampCount: categoryBreakdown.ramp,
    drawCount: categoryBreakdown.draw,
    removalCount: categoryBreakdown.removal + categoryBreakdown.boardWipe,
  };
}
