import {
  Card,
  Deck,
  DeckCard,
  ManaColor,
  OptimizationResult,
  ReplacementSuggestion,
  ReplacementReasoning,
  CategoryAnalysis,
  ManabaseAnalysis,
  CardScore,
  FillInSuggestion,
  CardCategory,
  RECOMMENDED_COUNTS,
} from '@/types';
import { getStaplesForColors, StapleCard } from '@/data/staples';
import { getLandRecommendationsForColors, getRecommendedLandCount, getColorSourceRecommendations } from '@/data/manabase';
import { categorizeCard, getCategoryStats, analyzeCategoryBalance } from './categories';
import { scoreCard, findWeakestCards, compareCards } from './scoring';
import { analyzeDeckSynergies, getSynergyRecommendations } from './synergy';

export async function optimizeDeck(deck: Deck): Promise<OptimizationResult> {
  const commander = deck.commander || null;
  const cards = deck.cards;

  // Calculate color identity from deck if not set
  let colorIdentity = deck.colorIdentity || [];
  if (colorIdentity.length === 0) {
    const allColors = new Set<ManaColor>();
    cards.forEach((dc) => {
      if (dc.card.color_identity) {
        dc.card.color_identity.forEach((c) => allColors.add(c as ManaColor));
      }
    });
    colorIdentity = Array.from(allColors);
  }

  console.log('Optimizing deck with color identity:', colorIdentity);

  // Get category statistics
  const categoryStats = getCategoryStats(cards);

  // Analyze deck synergies
  const synergyAnalysis = analyzeDeckSynergies(cards, commander);

  // Find weakest cards
  const weakestCards = findWeakestCards(cards, commander, colorIdentity, 15);

  // Get staples for this color identity
  const staples = getStaplesForColors(colorIdentity);

  // Generate replacement suggestions
  const suggestions = generateSuggestions(
    weakestCards,
    staples,
    cards,
    commander,
    colorIdentity,
    categoryStats
  );

  // Analyze categories
  const categoryAnalysis = analyzeCategoryBalance(categoryStats).map(rec => ({
    category: rec.category,
    currentCount: rec.count,
    recommendedCount: RECOMMENDED_COUNTS[rec.category] || { min: 0, max: 99 },
    status: rec.status,
    message: rec.recommendation,
  }));

  // Analyze manabase
  const manabaseAnalysis = analyzeManabase(cards, colorIdentity);

  // Calculate overall score
  const overallScore = calculateOverallScore(cards, commander, colorIdentity, synergyAnalysis.overallSynergyScore);

  // Identify strengths and weaknesses
  const { strengths, weaknesses } = identifyStrengthsAndWeaknesses(
    categoryStats,
    synergyAnalysis,
    manabaseAnalysis
  );

  // Check if deck needs fill-in cards (Commander decks should have 100 cards)
  const totalCards = cards.reduce((sum, c) => sum + c.quantity, 0);
  const isCommanderDeck = deck.format === 'commander' || commander !== null;
  const cardsNeeded = isCommanderDeck && totalCards < 100 ? 100 - totalCards : 0;

  let fillInSuggestions: FillInSuggestion[] | undefined;

  if (cardsNeeded > 0) {
    fillInSuggestions = generateFillInSuggestions(
      cardsNeeded,
      staples,
      cards,
      categoryStats,
      colorIdentity
    );

    // Add weakness note about incomplete deck
    weaknesses.unshift(`Deck has only ${totalCards} cards - needs ${cardsNeeded} more to reach 100`);
  }

  return {
    deckId: deck.id,
    timestamp: new Date(),
    suggestions: suggestions.slice(0, 15),
    overallScore,
    categoryAnalysis,
    deckStrengths: strengths,
    deckWeaknesses: weaknesses,
    manabaseAnalysis,
    ...(cardsNeeded > 0 && { fillInSuggestions, cardsNeeded }),
  };
}

function generateSuggestions(
  weakestCards: Array<{ card: DeckCard; score: CardScore }>,
  staples: StapleCard[],
  deckCards: DeckCard[],
  commander: Card | null,
  colorIdentity: ManaColor[],
  categoryStats: Record<string, number>
): ReplacementSuggestion[] {
  const suggestions: ReplacementSuggestion[] = [];
  const existingCardNames = deckCards.map(dc => dc.card.name.toLowerCase());

  // Find missing staples
  const missingStaples = staples.filter(
    staple => !existingCardNames.includes(staple.name.toLowerCase())
  );

  weakestCards.forEach(({ card: weakCard, score: currentScore }) => {
    // Find a suitable replacement
    const category = weakCard.category || categorizeCard(weakCard.card);

    // First, try to find a missing staple in the same category
    let replacement = missingStaples.find(
      staple =>
        staple.category === category &&
        !suggestions.some(s => s.suggestedCard.name === staple.name)
    );

    // If no same-category staple, check if we need cards in a deficient category
    if (!replacement) {
      const deficientCategories = ['ramp', 'draw', 'removal'];
      for (const defCat of deficientCategories) {
        if ((categoryStats[defCat] || 0) < 10) {
          replacement = missingStaples.find(
            staple =>
              staple.category === defCat &&
              !suggestions.some(s => s.suggestedCard.name === staple.name)
          );
          if (replacement) break;
        }
      }
    }

    // If still no replacement, just get the highest play rate missing staple
    if (!replacement) {
      replacement = missingStaples.find(
        staple => !suggestions.some(s => s.suggestedCard.name === staple.name)
      );
    }

    if (replacement) {
      // Create a mock card for the suggestion
      const suggestedCard: Card = {
        id: `suggestion-${replacement.name}`,
        name: replacement.name,
        mana_cost: '',
        cmc: 0,
        type_line: '',
        color_identity: [],
        rarity: 'rare',
        set: '',
        set_name: '',
        prices: {},
        legalities: { commander: 'legal' },
      };

      const reasoning = generateReasoning(
        weakCard.card,
        suggestedCard,
        replacement,
        currentScore,
        commander
      );

      const priority = determinePriority(currentScore.overall, replacement.playRate);

      suggestions.push({
        id: `${weakCard.card.id}-${replacement.name}`,
        currentCard: weakCard.card,
        suggestedCard,
        category: category,
        score: currentScore,
        reasoning,
        priority,
      });
    }
  });

  // Sort by priority and improvement potential
  return suggestions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

function generateReasoning(
  currentCard: Card,
  suggestedCard: Card,
  staple: StapleCard,
  currentScore: CardScore,
  commander: Card | null
): ReplacementReasoning {
  const whyRemove: string[] = [];
  const whyAdd: string[] = [];

  // Why remove current card
  if (currentScore.metaScore < 40) {
    whyRemove.push('Low meta play rate indicates it underperforms in Commander');
  }
  if (currentScore.synergyScore < 40) {
    whyRemove.push('Limited synergy with your deck strategy');
  }
  if (currentScore.manaEfficiency < 40) {
    whyRemove.push('Mana cost is high relative to its impact');
  }
  if (currentScore.overall < 35) {
    whyRemove.push('One of the weakest cards in your deck by overall score');
  }

  // If no specific reasons, add a generic one
  if (whyRemove.length === 0) {
    whyRemove.push('Could be upgraded to a more impactful card');
  }

  // Why add suggested card
  whyAdd.push(`Played in ${staple.playRate}% of ${staple.category} slots in Commander`);

  if (staple.playRate > 50) {
    whyAdd.push('Format staple with proven performance');
  }

  const categoryDescriptions: Record<string, string> = {
    ramp: 'Accelerates your mana development',
    draw: 'Provides consistent card advantage',
    removal: 'Efficient answer to threats',
    boardWipe: 'Powerful board control option',
    tutor: 'Increases deck consistency',
    protection: 'Protects your key pieces',
  };

  if (categoryDescriptions[staple.category]) {
    whyAdd.push(categoryDescriptions[staple.category]);
  }

  // Generate summary
  const summary = `Replace ${currentCard.name} with ${suggestedCard.name} for better ${staple.category} support and higher meta performance.`;

  return {
    summary,
    whyRemove,
    whyAdd,
    metaPlayRate: staple.playRate,
  };
}

function determinePriority(currentScore: number, replacementPlayRate: number): 'high' | 'medium' | 'low' {
  const scoreDiff = replacementPlayRate - currentScore;

  if (currentScore < 30 || scoreDiff > 40) return 'high';
  if (currentScore < 45 || scoreDiff > 25) return 'medium';
  return 'low';
}

function analyzeManabase(cards: DeckCard[], colorIdentity: ManaColor[]): ManabaseAnalysis {
  const lands = cards.filter(c => c.card.type_line.includes('Land'));
  const landCount = lands.reduce((sum, c) => sum + c.quantity, 0);

  // Count color sources
  const colorSources: Record<ManaColor, number> = { W: 0, U: 0, B: 0, R: 0, G: 0, C: 0 };

  lands.forEach(land => {
    const text = (land.card.oracle_text || '').toLowerCase();
    const name = land.card.name.toLowerCase();

    // Check what colors this land can produce
    if (text.includes('{w}') || text.includes('white') || name.includes('plains')) {
      colorSources.W += land.quantity;
    }
    if (text.includes('{u}') || text.includes('blue') || name.includes('island')) {
      colorSources.U += land.quantity;
    }
    if (text.includes('{b}') || text.includes('black') || name.includes('swamp')) {
      colorSources.B += land.quantity;
    }
    if (text.includes('{r}') || text.includes('red') || name.includes('mountain')) {
      colorSources.R += land.quantity;
    }
    if (text.includes('{g}') || text.includes('green') || name.includes('forest')) {
      colorSources.G += land.quantity;
    }
    if (text.includes('any color') || name.includes('command tower')) {
      colorIdentity.forEach(color => {
        colorSources[color] += land.quantity;
      });
    }
  });

  // Calculate recommended counts
  const avgCmc = calculateAverageCmc(cards);
  const recommendedLands = getRecommendedLandCount(avgCmc);
  const colorPips = calculateColorPips(cards);
  const recommendedColorSources = getColorSourceRecommendations(colorIdentity, colorPips);

  // Generate issues and suggestions
  const issues: string[] = [];
  const suggestions: string[] = [];

  if (landCount < recommendedLands.min) {
    issues.push(`Low land count (${landCount}). Recommended: ${recommendedLands.min}-${recommendedLands.max}`);
    suggestions.push(`Add ${recommendedLands.ideal - landCount} more lands`);
  } else if (landCount > recommendedLands.max) {
    issues.push(`High land count (${landCount}). Consider cutting some lands.`);
  }

  colorIdentity.forEach(color => {
    if (color === 'C') return;
    const sources = colorSources[color];
    const recommended = recommendedColorSources[color];

    if (sources < recommended - 3) {
      issues.push(`Low ${color} sources (${sources}). Recommended: ${recommended}+`);
    }
  });

  // Suggest lands if needed
  if (issues.length > 0) {
    const landRecs = getLandRecommendationsForColors(colorIdentity);
    const existingLandNames = lands.map(l => l.card.name.toLowerCase());

    const missingLands = landRecs
      .filter(l => !existingLandNames.includes(l.name.toLowerCase()))
      .slice(0, 3);

    missingLands.forEach(land => {
      suggestions.push(`Consider adding ${land.name}`);
    });
  }

  return {
    landCount,
    recommendedLandCount: recommendedLands.ideal,
    colorSources,
    recommendedColorSources,
    issues,
    suggestions,
  };
}

function calculateAverageCmc(cards: DeckCard[]): number {
  const nonLands = cards.filter(c => !c.card.type_line.includes('Land'));
  const totalCmc = nonLands.reduce((sum, c) => sum + c.card.cmc * c.quantity, 0);
  const totalCards = nonLands.reduce((sum, c) => sum + c.quantity, 0);

  return totalCards > 0 ? totalCmc / totalCards : 3;
}

function calculateColorPips(cards: DeckCard[]): Record<ManaColor, number> {
  const pips: Record<ManaColor, number> = { W: 0, U: 0, B: 0, R: 0, G: 0, C: 0 };

  cards.forEach(card => {
    const manaCost = card.card.mana_cost || '';
    const matches = manaCost.match(/\{([WUBRGC])\}/g) || [];

    matches.forEach(match => {
      const color = match.replace(/[{}]/g, '') as ManaColor;
      pips[color] += card.quantity;
    });
  });

  return pips;
}

function calculateOverallScore(
  cards: DeckCard[],
  commander: Card | null,
  colorIdentity: ManaColor[],
  synergyScore: number
): number {
  let score = 0;

  // Category balance (25%)
  const categoryStats = getCategoryStats(cards);
  const balanceIssues = analyzeCategoryBalance(categoryStats);
  const balanceScore = Math.max(0, 100 - balanceIssues.length * 15);
  score += balanceScore * 0.25;

  // Synergy score (30%)
  score += synergyScore * 0.30;

  // Card quality (30%)
  const nonLandCards = cards.filter(c => c.category !== 'land' && !c.isCommander);
  const cardScores = nonLandCards.map(c =>
    scoreCard(c.card, commander, cards, colorIdentity).overall
  );
  const avgCardScore = cardScores.length > 0
    ? cardScores.reduce((a, b) => a + b, 0) / cardScores.length
    : 50;
  score += avgCardScore * 0.30;

  // Manabase (15%)
  const manabaseAnalysis = analyzeManabase(cards, colorIdentity);
  const manabaseScore = Math.max(0, 100 - manabaseAnalysis.issues.length * 20);
  score += manabaseScore * 0.15;

  return Math.round(score);
}

function generateFillInSuggestions(
  cardsNeeded: number,
  staples: StapleCard[],
  deckCards: DeckCard[],
  categoryStats: Record<string, number>,
  colorIdentity: ManaColor[]
): FillInSuggestion[] {
  const suggestions: FillInSuggestion[] = [];
  const existingCardNames = deckCards.map(dc => dc.card.name.toLowerCase());

  // Find missing staples (cards not already in deck)
  const missingStaples = staples.filter(
    staple => !existingCardNames.includes(staple.name.toLowerCase())
  );

  // Calculate what categories need the most help
  const categoryDeficits: Array<{ category: string; deficit: number }> = [];

  Object.entries(RECOMMENDED_COUNTS).forEach(([category, counts]) => {
    const current = categoryStats[category] || 0;
    if (current < counts.ideal) {
      categoryDeficits.push({
        category,
        deficit: counts.ideal - current,
      });
    }
  });

  // Sort by largest deficit first
  categoryDeficits.sort((a, b) => b.deficit - a.deficit);

  let cardsAdded = 0;

  // First pass: Fill deficient categories
  for (const { category, deficit } of categoryDeficits) {
    if (cardsAdded >= cardsNeeded) break;

    const categoryStaples = missingStaples.filter(
      s => s.category === category && !suggestions.some(sug => sug.card.name === s.name)
    );

    const toAdd = Math.min(deficit, cardsNeeded - cardsAdded, categoryStaples.length);

    for (let i = 0; i < toAdd; i++) {
      const staple = categoryStaples[i];
      const mockCard: Card = {
        id: `fill-in-${staple.name}`,
        name: staple.name,
        mana_cost: '',
        cmc: 0,
        type_line: '',
        color_identity: [],
        rarity: 'rare',
        set: '',
        set_name: '',
        prices: {},
        legalities: { commander: 'legal' },
      };

      const categoryDescriptions: Record<string, string> = {
        ramp: 'Your deck needs more mana acceleration',
        draw: 'Your deck needs more card advantage',
        removal: 'Your deck needs more removal spells',
        boardWipe: 'Your deck needs board wipe effects',
        land: 'Your manabase needs more lands',
        creature: 'Your deck could use more creatures',
        tutor: 'Adds consistency to find key cards',
        protection: 'Protects your important pieces',
      };

      suggestions.push({
        card: mockCard,
        category: category as CardCategory,
        reason: categoryDescriptions[category] || `Fills ${category} slot`,
        playRate: staple.playRate,
        priority: staple.playRate > 50 ? 'high' : staple.playRate > 30 ? 'medium' : 'low',
      });

      cardsAdded++;
    }
  }

  // Second pass: Fill remaining slots with highest play rate staples
  if (cardsAdded < cardsNeeded) {
    const remainingStaples = missingStaples.filter(
      s => !suggestions.some(sug => sug.card.name === s.name)
    );

    for (const staple of remainingStaples) {
      if (cardsAdded >= cardsNeeded) break;

      const mockCard: Card = {
        id: `fill-in-${staple.name}`,
        name: staple.name,
        mana_cost: '',
        cmc: 0,
        type_line: '',
        color_identity: [],
        rarity: 'rare',
        set: '',
        set_name: '',
        prices: {},
        legalities: { commander: 'legal' },
      };

      suggestions.push({
        card: mockCard,
        category: staple.category as CardCategory,
        reason: `High-value staple played in ${staple.playRate}% of decks`,
        playRate: staple.playRate,
        priority: staple.playRate > 50 ? 'high' : staple.playRate > 30 ? 'medium' : 'low',
      });

      cardsAdded++;
    }
  }

  // Sort by priority and play rate
  return suggestions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.playRate - a.playRate;
  });
}

function identifyStrengthsAndWeaknesses(
  categoryStats: Record<string, number>,
  synergyAnalysis: ReturnType<typeof analyzeDeckSynergies>,
  manabaseAnalysis: ManabaseAnalysis
): { strengths: string[]; weaknesses: string[] } {
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  // Check category balance
  if (categoryStats.ramp >= 10) {
    strengths.push('Strong ramp package for consistent mana development');
  } else if (categoryStats.ramp < 8) {
    weaknesses.push('Light on ramp - may struggle to develop mana');
  }

  if (categoryStats.draw >= 10) {
    strengths.push('Solid card draw to maintain hand size');
  } else if (categoryStats.draw < 8) {
    weaknesses.push('Limited card draw may cause you to run out of gas');
  }

  if (categoryStats.removal + categoryStats.boardWipe >= 10) {
    strengths.push('Good interaction to handle threats');
  } else if (categoryStats.removal + categoryStats.boardWipe < 6) {
    weaknesses.push('Low removal count makes it hard to deal with opponents');
  }

  // Check synergy
  if (synergyAnalysis.overallSynergyScore >= 70) {
    strengths.push('High synergy between cards creates powerful interactions');
  } else if (synergyAnalysis.overallSynergyScore < 40) {
    weaknesses.push('Cards lack synergy - consider a more focused strategy');
  }

  if (synergyAnalysis.archetypes.length > 0 && synergyAnalysis.archetypes[0].confidence > 50) {
    strengths.push(`Clear ${synergyAnalysis.archetypes[0].name} theme is well-supported`);
  }

  // Check manabase
  if (manabaseAnalysis.issues.length === 0) {
    strengths.push('Well-constructed manabase');
  } else {
    manabaseAnalysis.issues.forEach(issue => {
      weaknesses.push(issue);
    });
  }

  return { strengths, weaknesses };
}
