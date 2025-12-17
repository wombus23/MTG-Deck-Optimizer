export type ManaColor = 'W' | 'U' | 'B' | 'R' | 'G' | 'C';

export interface ManaCost {
  raw: string;
  colors: ManaColor[];
  cmc: number;
  colorless: number;
}

export interface CardPrices {
  usd?: string;
  usd_foil?: string;
  eur?: string;
}

export interface CardImage {
  small: string;
  normal: string;
  large: string;
  art_crop: string;
  border_crop: string;
}

export interface Card {
  id: string;
  name: string;
  mana_cost: string;
  cmc: number;
  type_line: string;
  oracle_text?: string;
  colors?: ManaColor[];
  color_identity: ManaColor[];
  keywords?: string[];
  power?: string;
  toughness?: string;
  loyalty?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'mythic';
  set: string;
  set_name: string;
  image_uris?: CardImage;
  card_faces?: Array<{
    name: string;
    mana_cost: string;
    type_line: string;
    oracle_text?: string;
    image_uris?: CardImage;
  }>;
  prices: CardPrices;
  legalities: {
    commander: 'legal' | 'not_legal' | 'banned' | 'restricted';
    [key: string]: string;
  };
  edhrec_rank?: number;
}

export interface DeckCard {
  card: Card;
  quantity: number;
  isCommander?: boolean;
  isCompanion?: boolean;
  category?: CardCategory;
}

export type CardCategory =
  | 'commander'
  | 'creature'
  | 'instant'
  | 'sorcery'
  | 'artifact'
  | 'enchantment'
  | 'planeswalker'
  | 'land'
  | 'ramp'
  | 'draw'
  | 'removal'
  | 'boardWipe'
  | 'protection'
  | 'tutor'
  | 'graveyard'
  | 'other';

export const CATEGORY_LABELS: Record<CardCategory, string> = {
  commander: 'Commander',
  creature: 'Creatures',
  instant: 'Instants',
  sorcery: 'Sorceries',
  artifact: 'Artifacts',
  enchantment: 'Enchantments',
  planeswalker: 'Planeswalkers',
  land: 'Lands',
  ramp: 'Ramp',
  draw: 'Card Draw',
  removal: 'Removal',
  boardWipe: 'Board Wipes',
  protection: 'Protection',
  tutor: 'Tutors',
  graveyard: 'Graveyard',
  other: 'Other',
};

export const MANA_COLORS: Record<ManaColor, { name: string; hex: string }> = {
  W: { name: 'White', hex: '#F8F6D8' },
  U: { name: 'Blue', hex: '#0E68AB' },
  B: { name: 'Black', hex: '#150B00' },
  R: { name: 'Red', hex: '#D3202A' },
  G: { name: 'Green', hex: '#00733E' },
  C: { name: 'Colorless', hex: '#CAC5C0' },
};
