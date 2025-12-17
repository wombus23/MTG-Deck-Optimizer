import { Card, CardCategory, ManaColor } from './card';

export interface CardScore {
  overall: number;
  metaScore: number;
  synergyScore: number;
  manaEfficiency: number;
  versatility: number;
}

export interface ReplacementSuggestion {
  id: string;
  currentCard: Card;
  suggestedCard: Card;
  category: CardCategory;
  score: CardScore;
  reasoning: ReplacementReasoning;
  priority: 'high' | 'medium' | 'low';
  priceChange?: number;
}

export interface ReplacementReasoning {
  summary: string;
  whyRemove: string[];
  whyAdd: string[];
  metaPlayRate?: number;
  synergyCards?: string[];
}

export interface OptimizationResult {
  deckId: string;
  timestamp: Date;
  suggestions: ReplacementSuggestion[];
  overallScore: number;
  categoryAnalysis: CategoryAnalysis[];
  deckStrengths: string[];
  deckWeaknesses: string[];
  manabaseAnalysis: ManabaseAnalysis;
  fillInSuggestions?: FillInSuggestion[];
  cardsNeeded?: number;
}

export interface CategoryAnalysis {
  category: CardCategory;
  currentCount: number;
  recommendedCount: { min: number; max: number };
  status: 'optimal' | 'low' | 'high';
  message: string;
}

export interface ManabaseAnalysis {
  landCount: number;
  recommendedLandCount: number;
  colorSources: Record<ManaColor, number>;
  recommendedColorSources: Record<ManaColor, number>;
  issues: string[];
  suggestions: string[];
}

export interface ArchetypeMatch {
  archetype: string;
  confidence: number;
  keyCards: string[];
  suggestedAdditions: string[];
}

export interface FillInSuggestion {
  card: Card;
  category: CardCategory;
  reason: string;
  playRate: number;
  priority: 'high' | 'medium' | 'low';
}

export interface SynergyCluster {
  name: string;
  cards: Card[];
  strength: number;
  description: string;
}

export const RECOMMENDED_COUNTS: Record<string, { min: number; max: number; ideal: number }> = {
  land: { min: 33, max: 38, ideal: 36 },
  ramp: { min: 10, max: 15, ideal: 12 },
  draw: { min: 10, max: 15, ideal: 12 },
  removal: { min: 8, max: 12, ideal: 10 },
  boardWipe: { min: 2, max: 5, ideal: 3 },
  creature: { min: 20, max: 35, ideal: 28 },
};

export const PRIORITY_WEIGHTS = {
  high: 3,
  medium: 2,
  low: 1,
};
