// Commander archetypes and their key cards

export interface Archetype {
  id: string;
  name: string;
  description: string;
  keyCards: string[];
  supportCards: string[];
  colors: string[];
  keywords: string[];
}

export const ARCHETYPES: Archetype[] = [
  {
    id: 'aristocrats',
    name: 'Aristocrats',
    description: 'Sacrifice creatures for value and drain opponents',
    keyCards: [
      'Blood Artist',
      'Zulaport Cutthroat',
      'Viscera Seer',
      'Grave Pact',
      'Dictate of Erebos',
      'Butcher of Malakir',
      'Ashnod\'s Altar',
      'Phyrexian Altar',
    ],
    supportCards: [
      'Reassembling Skeleton',
      'Bloodghast',
      'Bitterblossom',
      'Ophiomancer',
      'Pitiless Plunderer',
      'Midnight Reaper',
      'Grim Haruspex',
      'Skullclamp',
      'Carrion Feeder',
      'Yahenni, Undying Partisan',
    ],
    colors: ['B'],
    keywords: ['sacrifice', 'die', 'dies', 'whenever', 'graveyard'],
  },
  {
    id: 'tokens',
    name: 'Tokens',
    description: 'Create and buff token creatures',
    keyCards: [
      'Doubling Season',
      'Anointed Procession',
      'Parallel Lives',
      'Craterhoof Behemoth',
      'Triumph of the Hordes',
      'Coat of Arms',
    ],
    supportCards: [
      'Beastmaster Ascension',
      'Growing Rites of Itlimoc',
      'Elesh Norn, Grand Cenobite',
      'Champion of Lambholt',
      'Tendershoot Dryad',
      'Avenger of Zendikar',
      'Secure the Wastes',
      'White Sun\'s Zenith',
    ],
    colors: ['W', 'G'],
    keywords: ['token', 'create', 'creature token', 'populate'],
  },
  {
    id: 'spellslinger',
    name: 'Spellslinger',
    description: 'Cast lots of instants and sorceries for value',
    keyCards: [
      'Guttersnipe',
      'Talrand, Sky Summoner',
      'Young Pyromancer',
      'Storm-Kiln Artist',
      'Archmage Emeritus',
      'Thousand-Year Storm',
    ],
    supportCards: [
      'Baral, Chief of Compliance',
      'Goblin Electromancer',
      'Primal Amulet',
      'Shark Typhoon',
      'Metallurgic Summonings',
      'Past in Flames',
      'Mizzix\'s Mastery',
      'Epic Experiment',
    ],
    colors: ['U', 'R'],
    keywords: ['instant', 'sorcery', 'cast', 'spell', 'copy', 'magecraft'],
  },
  {
    id: 'reanimator',
    name: 'Reanimator',
    description: 'Cheat big creatures from the graveyard',
    keyCards: [
      'Reanimate',
      'Animate Dead',
      'Necromancy',
      'Dance of the Dead',
      'Entomb',
      'Buried Alive',
    ],
    supportCards: [
      'Jin-Gitaxias, Core Augur',
      'Sheoldred, Whispering One',
      'Razaketh, the Foulblooded',
      'Vilis, Broker of Blood',
      'Sire of Insanity',
      'Living Death',
      'Victimize',
      'Dread Return',
      'Persist',
    ],
    colors: ['B'],
    keywords: ['graveyard', 'reanimate', 'return', 'dies', 'mill'],
  },
  {
    id: 'voltron',
    name: 'Voltron',
    description: 'Suit up one creature and attack for lethal',
    keyCards: [
      'Sword of Feast and Famine',
      'Sword of Fire and Ice',
      'Sword of Truth and Justice',
      'Umezawa\'s Jitte',
      'Shadowspear',
      'Embercleave',
    ],
    supportCards: [
      'Lightning Greaves',
      'Swiftfoot Boots',
      'Whispersilk Cloak',
      'Robe of Stars',
      'Hammer of Nazahn',
      'Puresteel Paladin',
      'Sigarda\'s Aid',
      'Open the Armory',
      'Steelshaper\'s Gift',
    ],
    colors: ['W'],
    keywords: ['equipment', 'equip', 'attach', 'aura', 'enchant'],
  },
  {
    id: 'landfall',
    name: 'Landfall',
    description: 'Trigger abilities when lands enter',
    keyCards: [
      'Avenger of Zendikar',
      'Omnath, Locus of Creation',
      'Tatyova, Benthic Druid',
      'Lotus Cobra',
      'Scute Swarm',
      'Ancient Greenwarden',
    ],
    supportCards: [
      'Azusa, Lost but Seeking',
      'Oracle of Mul Daya',
      'Dryad of the Ilysian Grove',
      'Ramunap Excavator',
      'Crucible of Worlds',
      'Exploration',
      'Burgeoning',
      'Kodama of the East Tree',
      'Tireless Provisioner',
    ],
    colors: ['G'],
    keywords: ['landfall', 'land', 'enters', 'play a land'],
  },
  {
    id: 'tribal',
    name: 'Tribal',
    description: 'Build around a creature type',
    keyCards: [
      'Coat of Arms',
      'Kindred Discovery',
      'Herald\'s Horn',
      'Vanquisher\'s Banner',
      'Icon of Ancestry',
      'Door of Destinies',
    ],
    supportCards: [
      'Kindred Charge',
      'Kindred Summons',
      'Patriarch\'s Bidding',
      'Reflections of Littjara',
      'Urza\'s Incubator',
      'Cover of Darkness',
    ],
    colors: [],
    keywords: ['elf', 'goblin', 'zombie', 'vampire', 'dragon', 'wizard', 'merfolk', 'sliver'],
  },
  {
    id: 'stax',
    name: 'Stax',
    description: 'Slow down opponents with taxing effects',
    keyCards: [
      'Smokestack',
      'Winter Orb',
      'Static Orb',
      'Tangle Wire',
      'Sphere of Resistance',
      'Thalia, Guardian of Thraben',
    ],
    supportCards: [
      'Grand Arbiter Augustin IV',
      'Drannith Magistrate',
      'Aven Mindcensor',
      'Opposition Agent',
      'Collector Ouphe',
      'Null Rod',
      'Rule of Law',
      'Deafening Silence',
    ],
    colors: ['W'],
    keywords: ['tax', 'more to cast', 'can\'t', 'unless', 'each player'],
  },
  {
    id: 'wheels',
    name: 'Wheels',
    description: 'Force everyone to draw and discard cards',
    keyCards: [
      'Wheel of Fortune',
      'Windfall',
      'Whispering Madness',
      'Notion Thief',
      'Narset, Parter of Veils',
      'Teferi\'s Puzzle Box',
    ],
    supportCards: [
      'Smothering Tithe',
      'Waste Not',
      'Library of Leng',
      'Alms Collector',
      'Hullbreacher',
      'Echo of Eons',
      'Timetwister',
      'Memory Jar',
    ],
    colors: ['U', 'R'],
    keywords: ['draw', 'discard', 'wheel', 'each player draws'],
  },
  {
    id: 'storm',
    name: 'Storm',
    description: 'Cast many spells in one turn to win',
    keyCards: [
      'Aetherflux Reservoir',
      'Tendrils of Agony',
      'Brain Freeze',
      'Grapeshot',
      'Mind\'s Desire',
    ],
    supportCards: [
      'Birgi, God of Storytelling',
      'Bolas\'s Citadel',
      'Sensei\'s Divining Top',
      'Peer into the Abyss',
      'Ad Nauseam',
      'Dark Ritual',
      'Cabal Ritual',
      'Mana Geyser',
    ],
    colors: ['U', 'B', 'R'],
    keywords: ['storm', 'cast', 'mana', 'draw', 'gain life'],
  },
  {
    id: 'blink',
    name: 'Blink/Flicker',
    description: 'Exile and return creatures for ETB triggers',
    keyCards: [
      'Panharmonicon',
      'Conjurer\'s Closet',
      'Thassa, Deep-Dwelling',
      'Yorion, Sky Nomad',
      'Restoration Angel',
      'Felidar Guardian',
    ],
    supportCards: [
      'Soulherder',
      'Brago, King Eternal',
      'Ephemerate',
      'Ghostway',
      'Eerie Interlude',
      'Eldrazi Displacer',
      'Mulldrifter',
      'Cloudblazer',
      'Solemn Simulacrum',
    ],
    colors: ['W', 'U'],
    keywords: ['exile', 'return', 'enters the battlefield', 'blink', 'flicker'],
  },
  {
    id: 'counters',
    name: '+1/+1 Counters',
    description: 'Grow creatures with +1/+1 counters',
    keyCards: [
      'Hardened Scales',
      'Doubling Season',
      'Branching Evolution',
      'Vorinclex, Monstrous Raider',
      'The Ozolith',
      'Cathars\' Crusade',
    ],
    supportCards: [
      'Winding Constrictor',
      'Rishkar, Peema Renegade',
      'Animation Module',
      'Champion of Lambholt',
      'Kalonian Hydra',
      'Armorcraft Judge',
      'Inspiring Call',
      'Forgotten Ancient',
    ],
    colors: ['G', 'W'],
    keywords: ['+1/+1 counter', 'counter', 'proliferate', 'double'],
  },
];

export function detectArchetypes(cardNames: string[], oracleTexts: string[]): Array<{ archetype: Archetype; confidence: number }> {
  const results: Array<{ archetype: Archetype; confidence: number }> = [];

  const allText = oracleTexts.join(' ').toLowerCase();
  const allNames = cardNames.map(n => n.toLowerCase());

  ARCHETYPES.forEach(archetype => {
    let score = 0;
    const maxScore = archetype.keyCards.length * 3 + archetype.supportCards.length * 2 + archetype.keywords.length;

    // Check for key cards (high weight)
    archetype.keyCards.forEach(card => {
      if (allNames.some(n => n.includes(card.toLowerCase()))) {
        score += 3;
      }
    });

    // Check for support cards (medium weight)
    archetype.supportCards.forEach(card => {
      if (allNames.some(n => n.includes(card.toLowerCase()))) {
        score += 2;
      }
    });

    // Check for keywords in oracle text (low weight)
    archetype.keywords.forEach(keyword => {
      const escapedKeyword = keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedKeyword, 'g');
      const matches = allText.match(regex);
      if (matches) {
        score += Math.min(matches.length * 0.5, 2);
      }
    });

    const confidence = Math.min((score / maxScore) * 100, 100);

    if (confidence > 15) {
      results.push({ archetype, confidence });
    }
  });

  return results.sort((a, b) => b.confidence - a.confidence);
}

export function getArchetypeById(id: string): Archetype | undefined {
  return ARCHETYPES.find(a => a.id === id);
}

export function getSuggestedCardsForArchetype(archetypeId: string, existingCards: string[]): string[] {
  const archetype = getArchetypeById(archetypeId);
  if (!archetype) return [];

  const existingLower = existingCards.map(c => c.toLowerCase());

  const suggestions = [
    ...archetype.keyCards.filter(c => !existingLower.includes(c.toLowerCase())),
    ...archetype.supportCards.filter(c => !existingLower.includes(c.toLowerCase())),
  ];

  return suggestions;
}
