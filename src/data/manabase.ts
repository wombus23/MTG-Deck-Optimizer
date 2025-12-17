import { ManaColor } from '@/types';

// Manabase recommendations for Commander decks

export interface LandRecommendation {
  name: string;
  colors: ManaColor[];
  category: 'dual' | 'fetch' | 'utility' | 'basic' | 'triome' | 'filter' | 'bounce' | 'storage' | 'rainbow';
  playRate: number;
  avgPrice?: number;
}

export const DUAL_LANDS: Record<string, LandRecommendation[]> = {
  WU: [
    { name: 'Hallowed Fountain', colors: ['W', 'U'], category: 'dual', playRate: 55 },
    { name: 'Tundra', colors: ['W', 'U'], category: 'dual', playRate: 15 },
    { name: 'Flooded Strand', colors: ['W', 'U'], category: 'fetch', playRate: 45 },
    { name: 'Adarkar Wastes', colors: ['W', 'U'], category: 'dual', playRate: 32 },
    { name: 'Glacial Fortress', colors: ['W', 'U'], category: 'dual', playRate: 42 },
    { name: 'Sea of Clouds', colors: ['W', 'U'], category: 'dual', playRate: 28 },
    { name: 'Seachrome Coast', colors: ['W', 'U'], category: 'dual', playRate: 25 },
  ],
  WB: [
    { name: 'Godless Shrine', colors: ['W', 'B'], category: 'dual', playRate: 52 },
    { name: 'Scrubland', colors: ['W', 'B'], category: 'dual', playRate: 15 },
    { name: 'Marsh Flats', colors: ['W', 'B'], category: 'fetch', playRate: 42 },
    { name: 'Caves of Koilos', colors: ['W', 'B'], category: 'dual', playRate: 28 },
    { name: 'Isolated Chapel', colors: ['W', 'B'], category: 'dual', playRate: 38 },
    { name: 'Vault of Champions', colors: ['W', 'B'], category: 'dual', playRate: 25 },
  ],
  UB: [
    { name: 'Watery Grave', colors: ['U', 'B'], category: 'dual', playRate: 55 },
    { name: 'Underground Sea', colors: ['U', 'B'], category: 'dual', playRate: 12 },
    { name: 'Polluted Delta', colors: ['U', 'B'], category: 'fetch', playRate: 48 },
    { name: 'Underground River', colors: ['U', 'B'], category: 'dual', playRate: 28 },
    { name: 'Drowned Catacomb', colors: ['U', 'B'], category: 'dual', playRate: 42 },
    { name: 'Morphic Pool', colors: ['U', 'B'], category: 'dual', playRate: 32 },
  ],
  BR: [
    { name: 'Blood Crypt', colors: ['B', 'R'], category: 'dual', playRate: 52 },
    { name: 'Badlands', colors: ['B', 'R'], category: 'dual', playRate: 12 },
    { name: 'Bloodstained Mire', colors: ['B', 'R'], category: 'fetch', playRate: 45 },
    { name: 'Sulfurous Springs', colors: ['B', 'R'], category: 'dual', playRate: 28 },
    { name: 'Dragonskull Summit', colors: ['B', 'R'], category: 'dual', playRate: 38 },
    { name: 'Luxury Suite', colors: ['B', 'R'], category: 'dual', playRate: 28 },
  ],
  RG: [
    { name: 'Stomping Ground', colors: ['R', 'G'], category: 'dual', playRate: 55 },
    { name: 'Taiga', colors: ['R', 'G'], category: 'dual', playRate: 12 },
    { name: 'Wooded Foothills', colors: ['R', 'G'], category: 'fetch', playRate: 45 },
    { name: 'Karplusan Forest', colors: ['R', 'G'], category: 'dual', playRate: 28 },
    { name: 'Rootbound Crag', colors: ['R', 'G'], category: 'dual', playRate: 42 },
    { name: 'Spire Garden', colors: ['R', 'G'], category: 'dual', playRate: 25 },
  ],
  GW: [
    { name: 'Temple Garden', colors: ['G', 'W'], category: 'dual', playRate: 55 },
    { name: 'Savannah', colors: ['G', 'W'], category: 'dual', playRate: 12 },
    { name: 'Windswept Heath', colors: ['G', 'W'], category: 'fetch', playRate: 45 },
    { name: 'Brushland', colors: ['G', 'W'], category: 'dual', playRate: 28 },
    { name: 'Sunpetal Grove', colors: ['G', 'W'], category: 'dual', playRate: 42 },
    { name: 'Bountiful Promenade', colors: ['G', 'W'], category: 'dual', playRate: 28 },
  ],
  WR: [
    { name: 'Sacred Foundry', colors: ['W', 'R'], category: 'dual', playRate: 52 },
    { name: 'Plateau', colors: ['W', 'R'], category: 'dual', playRate: 12 },
    { name: 'Arid Mesa', colors: ['W', 'R'], category: 'fetch', playRate: 42 },
    { name: 'Battlefield Forge', colors: ['W', 'R'], category: 'dual', playRate: 28 },
    { name: 'Clifftop Retreat', colors: ['W', 'R'], category: 'dual', playRate: 38 },
    { name: 'Spectator Seating', colors: ['W', 'R'], category: 'dual', playRate: 25 },
  ],
  UG: [
    { name: 'Breeding Pool', colors: ['U', 'G'], category: 'dual', playRate: 55 },
    { name: 'Tropical Island', colors: ['U', 'G'], category: 'dual', playRate: 12 },
    { name: 'Misty Rainforest', colors: ['U', 'G'], category: 'fetch', playRate: 48 },
    { name: 'Yavimaya Coast', colors: ['U', 'G'], category: 'dual', playRate: 28 },
    { name: 'Hinterland Harbor', colors: ['U', 'G'], category: 'dual', playRate: 42 },
    { name: 'Rejuvenating Springs', colors: ['U', 'G'], category: 'dual', playRate: 32 },
  ],
  UR: [
    { name: 'Steam Vents', colors: ['U', 'R'], category: 'dual', playRate: 55 },
    { name: 'Volcanic Island', colors: ['U', 'R'], category: 'dual', playRate: 12 },
    { name: 'Scalding Tarn', colors: ['U', 'R'], category: 'fetch', playRate: 48 },
    { name: 'Shivan Reef', colors: ['U', 'R'], category: 'dual', playRate: 28 },
    { name: 'Sulfur Falls', colors: ['U', 'R'], category: 'dual', playRate: 42 },
    { name: 'Training Center', colors: ['U', 'R'], category: 'dual', playRate: 28 },
  ],
  BG: [
    { name: 'Overgrown Tomb', colors: ['B', 'G'], category: 'dual', playRate: 55 },
    { name: 'Bayou', colors: ['B', 'G'], category: 'dual', playRate: 12 },
    { name: 'Verdant Catacombs', colors: ['B', 'G'], category: 'fetch', playRate: 48 },
    { name: 'Llanowar Wastes', colors: ['B', 'G'], category: 'dual', playRate: 28 },
    { name: 'Woodland Cemetery', colors: ['B', 'G'], category: 'dual', playRate: 42 },
    { name: 'Undergrowth Stadium', colors: ['B', 'G'], category: 'dual', playRate: 28 },
  ],
};

export const RAINBOW_LANDS: LandRecommendation[] = [
  { name: 'Command Tower', colors: [], category: 'rainbow', playRate: 92 },
  { name: 'Exotic Orchard', colors: [], category: 'rainbow', playRate: 45 },
  { name: 'Mana Confluence', colors: [], category: 'rainbow', playRate: 35 },
  { name: 'City of Brass', colors: [], category: 'rainbow', playRate: 32 },
  { name: 'Reflecting Pool', colors: [], category: 'rainbow', playRate: 28 },
  { name: 'Path of Ancestry', colors: [], category: 'rainbow', playRate: 25 },
  { name: 'Forbidden Orchard', colors: [], category: 'rainbow', playRate: 15 },
];

export const UTILITY_LANDS: LandRecommendation[] = [
  { name: 'Reliquary Tower', colors: [], category: 'utility', playRate: 35 },
  { name: 'Rogue\'s Passage', colors: [], category: 'utility', playRate: 22 },
  { name: 'Bojuka Bog', colors: ['B'], category: 'utility', playRate: 42 },
  { name: 'Castle Locthwain', colors: ['B'], category: 'utility', playRate: 35 },
  { name: 'Urborg, Tomb of Yawgmoth', colors: ['B'], category: 'utility', playRate: 38 },
  { name: 'Cabal Coffers', colors: ['B'], category: 'utility', playRate: 32 },
  { name: 'Nykthos, Shrine to Nyx', colors: [], category: 'utility', playRate: 28 },
  { name: 'War Room', colors: [], category: 'utility', playRate: 25 },
];

// Recommended land count based on average CMC
export function getRecommendedLandCount(averageCmc: number): { min: number; max: number; ideal: number } {
  if (averageCmc <= 2.0) {
    return { min: 31, max: 34, ideal: 32 };
  } else if (averageCmc <= 2.5) {
    return { min: 33, max: 36, ideal: 34 };
  } else if (averageCmc <= 3.0) {
    return { min: 35, max: 38, ideal: 36 };
  } else if (averageCmc <= 3.5) {
    return { min: 36, max: 39, ideal: 37 };
  } else {
    return { min: 37, max: 40, ideal: 38 };
  }
}

// Get color sources needed for mana base
export function getColorSourceRecommendations(
  colorIdentity: ManaColor[],
  colorPips: Record<ManaColor, number>
): Record<ManaColor, number> {
  const recommendations: Record<ManaColor, number> = { W: 0, U: 0, B: 0, R: 0, G: 0, C: 0 };
  const totalPips = Object.values(colorPips).reduce((a, b) => a + b, 0) || 1;

  colorIdentity.forEach(color => {
    if (color === 'C') return;
    const pipPercentage = (colorPips[color] || 0) / totalPips;
    // Recommend 14-20 sources per heavily used color
    recommendations[color] = Math.max(8, Math.round(14 + pipPercentage * 8));
  });

  return recommendations;
}

export function getLandRecommendationsForColors(colors: ManaColor[]): LandRecommendation[] {
  const recommendations: LandRecommendation[] = [];

  // Add rainbow lands for multicolor decks
  if (colors.length >= 2) {
    recommendations.push(...RAINBOW_LANDS);
  }

  // Add dual lands for each color pair
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const colorPair = [colors[i], colors[j]].sort().join('');
      const duals = DUAL_LANDS[colorPair];
      if (duals) {
        recommendations.push(...duals);
      }
    }
  }

  // Add utility lands
  recommendations.push(...UTILITY_LANDS.filter(land => {
    if (land.colors.length === 0) return true;
    return land.colors.every(c => colors.includes(c));
  }));

  return recommendations.sort((a, b) => b.playRate - a.playRate);
}
