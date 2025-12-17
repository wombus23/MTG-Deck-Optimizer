import { Card, DeckCard, ManaColor, SynergyCluster } from '@/types';
import { detectArchetypes, getSuggestedCardsForArchetype } from '@/data/archetypes';
import { detectSynergyPatterns, getMissingSynergyPieces } from '@/data/synergies';

export interface DeckSynergyAnalysis {
  archetypes: Array<{ name: string; confidence: number; keyCards: string[] }>;
  synergyPatterns: Array<{ name: string; cards: string[]; strength: number }>;
  missingSynergyPieces: Array<{ card: string; reason: string }>;
  overallSynergyScore: number;
  clusters: SynergyCluster[];
}

export function analyzeDeckSynergies(
  deckCards: DeckCard[],
  commander: Card | null
): DeckSynergyAnalysis {
  const cardNames = deckCards.map(dc => dc.card.name);
  const oracleTexts = deckCards.map(dc => dc.card.oracle_text || '');

  // Detect archetypes
  const archetypeMatches = detectArchetypes(cardNames, oracleTexts);
  const archetypes = archetypeMatches.slice(0, 3).map(match => ({
    name: match.archetype.name,
    confidence: Math.round(match.confidence),
    keyCards: match.archetype.keyCards.filter(kc =>
      cardNames.some(cn => cn.toLowerCase().includes(kc.toLowerCase()))
    ),
  }));

  // Detect synergy patterns
  const patterns = detectSynergyPatterns(cardNames);
  const synergyPatterns = patterns.map(p => ({
    name: p.name,
    cards: p.cards.filter(c =>
      cardNames.some(cn => cn.toLowerCase().includes(c.toLowerCase()))
    ),
    strength: p.strength,
  }));

  // Find missing synergy pieces
  const missingPieces = getMissingSynergyPieces(cardNames);
  const missingSynergyPieces = missingPieces.slice(0, 5).map(piece => ({
    card: piece.card,
    reason: `Completes ${piece.pattern.name} with ${piece.existingCards.join(', ')}`,
  }));

  // Calculate overall synergy score
  let synergyScore = 40; // Base score

  // Bonus for detected archetypes
  if (archetypes.length > 0) {
    synergyScore += archetypes[0].confidence * 0.3;
  }

  // Bonus for synergy patterns
  synergyPatterns.forEach(pattern => {
    synergyScore += pattern.strength * 2;
  });

  // Commander synergy bonus
  if (commander) {
    const commanderSynergyBonus = calculateCommanderSynergyBonus(commander, deckCards);
    synergyScore += commanderSynergyBonus;
  }

  const overallSynergyScore = Math.min(100, Math.round(synergyScore));

  // Identify synergy clusters
  const clusters = identifySynergyClusters(deckCards, commander);

  return {
    archetypes,
    synergyPatterns,
    missingSynergyPieces,
    overallSynergyScore,
    clusters,
  };
}

function calculateCommanderSynergyBonus(commander: Card, deckCards: DeckCard[]): number {
  let bonus = 0;
  const commanderText = (commander.oracle_text || '').toLowerCase();
  const commanderKeywords = commander.keywords || [];
  const commanderTypes = extractTypes(commander.type_line);

  deckCards.forEach(dc => {
    if (dc.isCommander) return;

    const cardText = (dc.card.oracle_text || '').toLowerCase();
    const cardKeywords = dc.card.keywords || [];
    const cardTypes = extractTypes(dc.card.type_line);

    // Check for tribal synergy
    const sharedTypes = commanderTypes.filter(t => cardTypes.includes(t));
    if (sharedTypes.length > 0) {
      bonus += 0.5;
    }

    // Check for keyword synergy
    const synergyKeywordPairs = [
      ['sacrifice', 'dies'],
      ['token', 'create'],
      ['counter', '+1/+1'],
      ['draw', 'whenever'],
      ['land', 'landfall'],
      ['spell', 'cast'],
      ['graveyard', 'return'],
      ['artifact', 'enters'],
      ['enchantment', 'aura'],
    ];

    synergyKeywordPairs.forEach(([k1, k2]) => {
      const commanderHas = commanderText.includes(k1) || commanderText.includes(k2);
      const cardHas = cardText.includes(k1) || cardText.includes(k2);

      if (commanderHas && cardHas) {
        bonus += 0.3;
      }
    });
  });

  return Math.min(20, bonus);
}

function extractTypes(typeLine: string): string[] {
  if (!typeLine) return [];

  const parts = typeLine.split('—');
  const types: string[] = [];

  // Get supertypes and card types
  types.push(...parts[0].toLowerCase().split(' ').filter(t => t.trim()));

  // Get subtypes if they exist
  if (parts.length > 1) {
    types.push(...parts[1].toLowerCase().split(' ').filter(t => t.trim()));
  }

  return types;
}

function identifySynergyClusters(deckCards: DeckCard[], commander: Card | null): SynergyCluster[] {
  const clusters: SynergyCluster[] = [];
  const cardsByTheme = new Map<string, Card[]>();

  // Group cards by themes
  const themes = [
    { name: 'Sacrifice', keywords: ['sacrifice', 'dies', 'death trigger'] },
    { name: 'Tokens', keywords: ['token', 'create', 'populate'] },
    { name: 'Counters', keywords: ['+1/+1 counter', 'counter', 'proliferate'] },
    { name: 'Card Advantage', keywords: ['draw', 'cards', 'hand'] },
    { name: 'Reanimation', keywords: ['graveyard', 'return', 'reanimate'] },
    { name: 'Artifacts', keywords: ['artifact', 'equipment', 'treasure'] },
    { name: 'Enchantments', keywords: ['enchantment', 'aura', 'constellation'] },
    { name: 'Spellslinger', keywords: ['instant', 'sorcery', 'spell', 'cast'] },
    { name: 'Lands Matter', keywords: ['land', 'landfall', 'enters'] },
    { name: 'Tribal', keywords: ['creature type', 'each', 'all'] },
  ];

  themes.forEach(theme => {
    const themeCards: Card[] = [];

    deckCards.forEach(dc => {
      const text = (dc.card.oracle_text || '').toLowerCase();
      const typeLine = (dc.card.type_line || '').toLowerCase();

      if (theme.keywords.some(k => text.includes(k) || typeLine.includes(k))) {
        themeCards.push(dc.card);
      }
    });

    if (themeCards.length >= 3) {
      cardsByTheme.set(theme.name, themeCards);
    }
  });

  // Convert to clusters
  cardsByTheme.forEach((cards, themeName) => {
    const strength = Math.min(10, Math.round((cards.length / deckCards.length) * 30));

    clusters.push({
      name: themeName,
      cards,
      strength,
      description: `${cards.length} cards support ${themeName.toLowerCase()} strategy`,
    });
  });

  return clusters.sort((a, b) => b.strength - a.strength).slice(0, 5);
}

export function getSynergyRecommendations(
  deckCards: DeckCard[],
  commander: Card | null,
  colorIdentity: ManaColor[]
): string[] {
  const analysis = analyzeDeckSynergies(deckCards, commander);
  const recommendations: string[] = [];

  // Recommend based on detected archetypes
  if (analysis.archetypes.length > 0) {
    const primaryArchetype = analysis.archetypes[0];
    const cardNames = deckCards.map(dc => dc.card.name);

    // Get archetype suggestions
    const archetypeCards = getSuggestedCardsForArchetype(
      primaryArchetype.name.toLowerCase().replace(/ /g, '-'),
      cardNames
    );

    recommendations.push(...archetypeCards.slice(0, 3));
  }

  // Add missing synergy pieces
  analysis.missingSynergyPieces.forEach(piece => {
    if (!recommendations.includes(piece.card)) {
      recommendations.push(piece.card);
    }
  });

  return recommendations.slice(0, 10);
}
