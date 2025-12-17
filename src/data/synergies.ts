// Card synergy patterns and combinations

export interface SynergyPattern {
  id: string;
  name: string;
  cards: string[];
  description: string;
  strength: number; // 1-10
}

export interface CardSynergy {
  cardName: string;
  synergyCards: string[];
  synergyType: string;
  strength: number;
}

// Known powerful card combinations
export const SYNERGY_PATTERNS: SynergyPattern[] = [
  {
    id: 'devotion-gary',
    name: 'Devotion Drain',
    cards: ['Gray Merchant of Asphodel', 'Panharmonicon', 'Conjurer\'s Closet'],
    description: 'Repeatedly trigger Gary\'s ETB for massive life drain',
    strength: 9,
  },
  {
    id: 'dramatic-scepter',
    name: 'Dramatic Scepter',
    cards: ['Isochron Scepter', 'Dramatic Reversal'],
    description: 'Infinite mana with 3+ mana from nonland sources',
    strength: 10,
  },
  {
    id: 'felidar-saheeli',
    name: 'Copycat Combo',
    cards: ['Felidar Guardian', 'Saheeli Rai'],
    description: 'Infinite ETB triggers and hasty tokens',
    strength: 10,
  },
  {
    id: 'blood-pod',
    name: 'Aristocrat Engine',
    cards: ['Blood Artist', 'Viscera Seer', 'Reassembling Skeleton', 'Pitiless Plunderer'],
    description: 'Infinite death triggers with sacrifice outlet and Skeleton',
    strength: 9,
  },
  {
    id: 'top-citadel',
    name: 'Top Citadel',
    cards: ['Sensei\'s Divining Top', 'Bolas\'s Citadel', 'Aetherflux Reservoir'],
    description: 'Draw entire deck and gain infinite life',
    strength: 10,
  },
  {
    id: 'land-creature',
    name: 'Landfall Swarm',
    cards: ['Scute Swarm', 'Ancient Greenwarden', 'Lotus Cobra'],
    description: 'Exponential token generation with landfall',
    strength: 8,
  },
  {
    id: 'deadeye-drake',
    name: 'Deadeye Drake',
    cards: ['Deadeye Navigator', 'Peregrine Drake'],
    description: 'Infinite mana through blinking',
    strength: 10,
  },
  {
    id: 'grave-altar',
    name: 'Grave Pact Lock',
    cards: ['Grave Pact', 'Dictate of Erebos', 'Butcher of Malakir'],
    description: 'Force opponents to sacrifice creatures when you do',
    strength: 8,
  },
  {
    id: 'smothering-wheels',
    name: 'Smothering Wheels',
    cards: ['Smothering Tithe', 'Wheel of Fortune', 'Windfall'],
    description: 'Generate massive treasure when opponents draw',
    strength: 9,
  },
  {
    id: 'dockside-loop',
    name: 'Dockside Loop',
    cards: ['Dockside Extortionist', 'Temur Sabertooth', 'Cloudstone Curio'],
    description: 'Repeatedly bounce Dockside for infinite treasures',
    strength: 10,
  },
  {
    id: 'notion-narset',
    name: 'Draw Lock',
    cards: ['Notion Thief', 'Narset, Parter of Veils', 'Windfall'],
    description: 'Draw many cards while opponents draw nothing',
    strength: 9,
  },
  {
    id: 'basalt-rings',
    name: 'Basalt Monolith',
    cards: ['Basalt Monolith', 'Rings of Brighthearth', 'Power Artifact'],
    description: 'Infinite colorless mana',
    strength: 9,
  },
  {
    id: 'foodchain',
    name: 'Food Chain',
    cards: ['Food Chain', 'Squee, the Immortal', 'Misthollow Griffin'],
    description: 'Infinite creature mana',
    strength: 10,
  },
  {
    id: 'mikaeus-triskelion',
    name: 'Mike and Trike',
    cards: ['Mikaeus, the Unhallowed', 'Triskelion', 'Walking Ballista'],
    description: 'Infinite damage combo',
    strength: 10,
  },
  {
    id: 'thornbite-kiki',
    name: 'Kiki Combo',
    cards: ['Kiki-Jiki, Mirror Breaker', 'Zealous Conscripts', 'Combat Celebrant'],
    description: 'Infinite combat steps and tokens',
    strength: 10,
  },
];

// Cards and their common synergy partners
export const CARD_SYNERGIES: CardSynergy[] = [
  {
    cardName: 'Rhystic Study',
    synergyCards: ['Smothering Tithe', 'Mystic Remora', 'Windfall'],
    synergyType: 'draw',
    strength: 8,
  },
  {
    cardName: 'Sol Ring',
    synergyCards: ['Voltaic Key', 'Manifold Key', 'Unwinding Clock'],
    synergyType: 'mana',
    strength: 7,
  },
  {
    cardName: 'Avenger of Zendikar',
    synergyCards: ['Craterhoof Behemoth', 'Triumph of the Hordes', 'Doubling Season'],
    synergyType: 'tokens',
    strength: 9,
  },
  {
    cardName: 'Panharmonicon',
    synergyCards: ['Mulldrifter', 'Eternal Witness', 'Solemn Simulacrum', 'Gray Merchant of Asphodel'],
    synergyType: 'etb',
    strength: 9,
  },
  {
    cardName: 'Cyclonic Rift',
    synergyCards: ['Narset, Parter of Veils', 'Windfall', 'Evacuation'],
    synergyType: 'bounce',
    strength: 8,
  },
  {
    cardName: 'Skullclamp',
    synergyCards: ['Bitterblossom', 'Ophiomancer', 'Reassembling Skeleton', 'Young Pyromancer'],
    synergyType: 'tokens',
    strength: 9,
  },
  {
    cardName: 'Doubling Season',
    synergyCards: ['Planeswalkers', 'Vorinclex, Monstrous Raider', 'The Ozolith'],
    synergyType: 'counters',
    strength: 10,
  },
  {
    cardName: 'Vampiric Tutor',
    synergyCards: ['Demonic Tutor', 'Imperial Seal', 'Mystical Tutor'],
    synergyType: 'tutor',
    strength: 7,
  },
];

export function findSynergiesForCard(cardName: string): CardSynergy | undefined {
  return CARD_SYNERGIES.find(s => s.cardName.toLowerCase() === cardName.toLowerCase());
}

export function detectSynergyPatterns(cardNames: string[]): SynergyPattern[] {
  const cardNamesLower = cardNames.map(c => c.toLowerCase());
  const matchedPatterns: SynergyPattern[] = [];

  SYNERGY_PATTERNS.forEach(pattern => {
    const patternCardsLower = pattern.cards.map(c => c.toLowerCase());
    const matchedCards = patternCardsLower.filter(pc =>
      cardNamesLower.some(cn => cn.includes(pc) || pc.includes(cn))
    );

    // If we have at least 2 cards from the pattern, it's a potential synergy
    if (matchedCards.length >= 2) {
      matchedPatterns.push({
        ...pattern,
        strength: Math.round((matchedCards.length / pattern.cards.length) * pattern.strength),
      });
    }
  });

  return matchedPatterns.sort((a, b) => b.strength - a.strength);
}

export function calculateSynergyScore(card1: string, card2: string): number {
  // Check if cards are part of a known synergy pattern
  const card1Lower = card1.toLowerCase();
  const card2Lower = card2.toLowerCase();

  for (const pattern of SYNERGY_PATTERNS) {
    const patternCardsLower = pattern.cards.map(c => c.toLowerCase());
    if (patternCardsLower.some(c => c.includes(card1Lower)) &&
        patternCardsLower.some(c => c.includes(card2Lower))) {
      return pattern.strength;
    }
  }

  // Check direct synergies
  const synergy = findSynergiesForCard(card1);
  if (synergy && synergy.synergyCards.some(c => c.toLowerCase().includes(card2Lower))) {
    return synergy.strength;
  }

  return 0;
}

export function getMissingSynergyPieces(cardNames: string[]): Array<{ card: string; pattern: SynergyPattern; existingCards: string[] }> {
  const cardNamesLower = cardNames.map(c => c.toLowerCase());
  const suggestions: Array<{ card: string; pattern: SynergyPattern; existingCards: string[] }> = [];

  SYNERGY_PATTERNS.forEach(pattern => {
    const patternCardsLower = pattern.cards.map(c => c.toLowerCase());
    const existingCards = pattern.cards.filter(pc =>
      cardNamesLower.some(cn => cn.toLowerCase().includes(pc.toLowerCase()))
    );

    // If we have some but not all cards in a pattern, suggest the missing ones
    if (existingCards.length >= 1 && existingCards.length < pattern.cards.length) {
      const missingCards = pattern.cards.filter(pc =>
        !cardNamesLower.some(cn => cn.toLowerCase().includes(pc.toLowerCase()))
      );

      missingCards.forEach(card => {
        suggestions.push({
          card,
          pattern,
          existingCards,
        });
      });
    }
  });

  return suggestions;
}
