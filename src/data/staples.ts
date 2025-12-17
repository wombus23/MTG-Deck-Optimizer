import { ManaColor } from '@/types';

// Commander staples by color identity
// Meta play rates are simulated EDHREC-style percentages

export interface StapleCard {
  name: string;
  category: string;
  playRate: number; // 0-100 percentage
  avgPrice?: number;
}

export const COLORLESS_STAPLES: StapleCard[] = [
  // Ramp
  { name: 'Sol Ring', category: 'ramp', playRate: 95 },
  { name: 'Arcane Signet', category: 'ramp', playRate: 85 },
  { name: 'Commander\'s Sphere', category: 'ramp', playRate: 45 },
  { name: 'Mind Stone', category: 'ramp', playRate: 42 },
  { name: 'Thought Vessel', category: 'ramp', playRate: 38 },
  { name: 'Fellwar Stone', category: 'ramp', playRate: 35 },
  { name: 'Wayfarer\'s Bauble', category: 'ramp', playRate: 28 },
  { name: 'Everflowing Chalice', category: 'ramp', playRate: 22 },

  // Draw
  { name: 'Skullclamp', category: 'draw', playRate: 45 },

  // Removal
  { name: 'Lightning Greaves', category: 'protection', playRate: 55 },
  { name: 'Swiftfoot Boots', category: 'protection', playRate: 48 },

  // Lands
  { name: 'Command Tower', category: 'land', playRate: 92 },
  { name: 'Exotic Orchard', category: 'land', playRate: 45 },
  { name: 'Reliquary Tower', category: 'land', playRate: 35 },
];

export const WHITE_STAPLES: StapleCard[] = [
  // Removal
  { name: 'Swords to Plowshares', category: 'removal', playRate: 75 },
  { name: 'Path to Exile', category: 'removal', playRate: 58 },
  { name: 'Generous Gift', category: 'removal', playRate: 45 },
  { name: 'Darksteel Mutation', category: 'removal', playRate: 28 },

  // Board Wipes
  { name: 'Wrath of God', category: 'boardWipe', playRate: 35 },
  { name: 'Farewell', category: 'boardWipe', playRate: 42 },
  { name: 'Austere Command', category: 'boardWipe', playRate: 32 },
  { name: 'Vanquish the Horde', category: 'boardWipe', playRate: 28 },
  { name: 'Day of Judgment', category: 'boardWipe', playRate: 22 },

  // Draw
  { name: 'Esper Sentinel', category: 'draw', playRate: 55 },
  { name: 'Land Tax', category: 'draw', playRate: 32 },
  { name: 'Mentor of the Meek', category: 'draw', playRate: 25 },

  // Ramp
  { name: 'Smothering Tithe', category: 'ramp', playRate: 52 },
  { name: 'Knight of the White Orchid', category: 'ramp', playRate: 28 },

  // Protection
  { name: 'Teferi\'s Protection', category: 'protection', playRate: 38 },
  { name: 'Flawless Maneuver', category: 'protection', playRate: 22 },
];

export const BLUE_STAPLES: StapleCard[] = [
  // Counterspells
  { name: 'Counterspell', category: 'removal', playRate: 62 },
  { name: 'Swan Song', category: 'removal', playRate: 45 },
  { name: 'Arcane Denial', category: 'removal', playRate: 42 },
  { name: 'Negate', category: 'removal', playRate: 35 },
  { name: 'Fierce Guardianship', category: 'removal', playRate: 38 },
  { name: 'Force of Negation', category: 'removal', playRate: 28 },
  { name: 'Mana Drain', category: 'removal', playRate: 22 },

  // Draw
  { name: 'Rhystic Study', category: 'draw', playRate: 65 },
  { name: 'Mystic Remora', category: 'draw', playRate: 35 },
  { name: 'Brainstorm', category: 'draw', playRate: 42 },
  { name: 'Ponder', category: 'draw', playRate: 38 },
  { name: 'Preordain', category: 'draw', playRate: 32 },
  { name: 'Windfall', category: 'draw', playRate: 28 },

  // Bounce/Removal
  { name: 'Cyclonic Rift', category: 'boardWipe', playRate: 55 },
  { name: 'Reality Shift', category: 'removal', playRate: 42 },
  { name: 'Rapid Hybridization', category: 'removal', playRate: 38 },
  { name: 'Pongify', category: 'removal', playRate: 35 },

  // Tutors
  { name: 'Mystical Tutor', category: 'tutor', playRate: 32 },
];

export const BLACK_STAPLES: StapleCard[] = [
  // Removal
  { name: 'Deadly Rollick', category: 'removal', playRate: 42 },
  { name: 'Infernal Grasp', category: 'removal', playRate: 38 },
  { name: 'Feed the Swarm', category: 'removal', playRate: 45 },
  { name: 'Go for the Throat', category: 'removal', playRate: 35 },
  { name: 'Malicious Affliction', category: 'removal', playRate: 22 },

  // Board Wipes
  { name: 'Toxic Deluge', category: 'boardWipe', playRate: 42 },
  { name: 'Damnation', category: 'boardWipe', playRate: 28 },
  { name: 'Black Sun\'s Zenith', category: 'boardWipe', playRate: 22 },

  // Draw
  { name: 'Necropotence', category: 'draw', playRate: 28 },
  { name: 'Sign in Blood', category: 'draw', playRate: 32 },
  { name: 'Read the Bones', category: 'draw', playRate: 35 },
  { name: 'Night\'s Whisper', category: 'draw', playRate: 38 },
  { name: 'Phyrexian Arena', category: 'draw', playRate: 35 },
  { name: 'Black Market Connections', category: 'draw', playRate: 42 },

  // Tutors
  { name: 'Demonic Tutor', category: 'tutor', playRate: 52 },
  { name: 'Vampiric Tutor', category: 'tutor', playRate: 38 },
  { name: 'Diabolic Intent', category: 'tutor', playRate: 28 },

  // Ramp
  { name: 'Dark Ritual', category: 'ramp', playRate: 22 },
  { name: 'Cabal Coffers', category: 'land', playRate: 35 },

  // Graveyard
  { name: 'Reanimate', category: 'graveyard', playRate: 32 },
  { name: 'Animate Dead', category: 'graveyard', playRate: 28 },
];

export const RED_STAPLES: StapleCard[] = [
  // Removal
  { name: 'Chaos Warp', category: 'removal', playRate: 52 },
  { name: 'Blasphemous Act', category: 'boardWipe', playRate: 55 },
  { name: 'Lightning Bolt', category: 'removal', playRate: 28 },
  { name: 'Abrade', category: 'removal', playRate: 32 },
  { name: 'Wild Magic Surge', category: 'removal', playRate: 25 },

  // Draw/Impulse
  { name: 'Jeska\'s Will', category: 'draw', playRate: 45 },
  { name: 'Faithless Looting', category: 'draw', playRate: 32 },
  { name: 'Wheel of Fortune', category: 'draw', playRate: 22 },
  { name: 'Wheel of Misfortune', category: 'draw', playRate: 28 },
  { name: 'Reforge the Soul', category: 'draw', playRate: 22 },

  // Ramp
  { name: 'Dockside Extortionist', category: 'ramp', playRate: 38 },
  { name: 'Treasure Nabber', category: 'ramp', playRate: 18 },

  // Haste
  { name: 'Goblin Bombardment', category: 'other', playRate: 25 },
];

export const GREEN_STAPLES: StapleCard[] = [
  // Ramp
  { name: 'Cultivate', category: 'ramp', playRate: 55 },
  { name: 'Kodama\'s Reach', category: 'ramp', playRate: 52 },
  { name: 'Nature\'s Lore', category: 'ramp', playRate: 45 },
  { name: 'Three Visits', category: 'ramp', playRate: 42 },
  { name: 'Rampant Growth', category: 'ramp', playRate: 38 },
  { name: 'Farseek', category: 'ramp', playRate: 42 },
  { name: 'Birds of Paradise', category: 'ramp', playRate: 35 },
  { name: 'Llanowar Elves', category: 'ramp', playRate: 32 },
  { name: 'Elvish Mystic', category: 'ramp', playRate: 28 },
  { name: 'Fyndhorn Elves', category: 'ramp', playRate: 25 },

  // Draw
  { name: 'Beast Whisperer', category: 'draw', playRate: 35 },
  { name: 'Guardian Project', category: 'draw', playRate: 32 },
  { name: 'The Great Henge', category: 'draw', playRate: 28 },
  { name: 'Sylvan Library', category: 'draw', playRate: 35 },

  // Removal
  { name: 'Beast Within', category: 'removal', playRate: 55 },
  { name: 'Nature\'s Claim', category: 'removal', playRate: 45 },
  { name: 'Krosan Grip', category: 'removal', playRate: 32 },
  { name: 'Return to Nature', category: 'removal', playRate: 28 },

  // Tutors
  { name: 'Worldly Tutor', category: 'tutor', playRate: 28 },
  { name: 'Green Sun\'s Zenith', category: 'tutor', playRate: 25 },
  { name: 'Finale of Devastation', category: 'tutor', playRate: 22 },
];

export const MULTICOLOR_STAPLES: Record<string, StapleCard[]> = {
  WU: [
    { name: 'Teferi\'s Ageless Insight', category: 'draw', playRate: 25 },
  ],
  WB: [
    { name: 'Anguished Unmaking', category: 'removal', playRate: 42 },
    { name: 'Vindicate', category: 'removal', playRate: 32 },
  ],
  UB: [
    { name: 'Notion Thief', category: 'draw', playRate: 28 },
  ],
  UR: [
    { name: 'Expressive Iteration', category: 'draw', playRate: 35 },
  ],
  BR: [
    { name: 'Terminate', category: 'removal', playRate: 28 },
  ],
  BG: [
    { name: 'Assassin\'s Trophy', category: 'removal', playRate: 42 },
    { name: 'Abrupt Decay', category: 'removal', playRate: 32 },
  ],
  RG: [
    { name: 'Decimate', category: 'removal', playRate: 28 },
  ],
  WG: [
    { name: 'Swords to Plowshares', category: 'removal', playRate: 75 },
  ],
};

export function getStaplesForColors(colors: ManaColor[]): StapleCard[] {
  const staples: StapleCard[] = [...COLORLESS_STAPLES];

  if (colors.includes('W')) staples.push(...WHITE_STAPLES);
  if (colors.includes('U')) staples.push(...BLUE_STAPLES);
  if (colors.includes('B')) staples.push(...BLACK_STAPLES);
  if (colors.includes('R')) staples.push(...RED_STAPLES);
  if (colors.includes('G')) staples.push(...GREEN_STAPLES);

  // Add multicolor staples
  const colorKey = colors.sort().join('');
  Object.entries(MULTICOLOR_STAPLES).forEach(([key, cards]) => {
    const keyColors = key.split('');
    if (keyColors.every(c => colors.includes(c as ManaColor))) {
      staples.push(...cards);
    }
  });

  // Sort by play rate descending
  return staples.sort((a, b) => b.playRate - a.playRate);
}

export function isStaple(cardName: string, colors: ManaColor[]): StapleCard | null {
  const staples = getStaplesForColors(colors);
  return staples.find(s => s.name.toLowerCase() === cardName.toLowerCase()) || null;
}
