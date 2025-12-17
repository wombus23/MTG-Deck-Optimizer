import { Deck } from '@/types';

const STORAGE_KEY = 'mtg-optimizer-decks';
const CURRENT_DECK_KEY = 'mtg-optimizer-current-deck';

export function saveDecks(decks: Deck[]): void {
  if (typeof window === 'undefined') return;

  try {
    const serialized = JSON.stringify(decks, (key, value) => {
      if (value instanceof Date) {
        return { __type: 'Date', value: value.toISOString() };
      }
      return value;
    });
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Error saving decks to localStorage:', error);
  }
}

export function loadDecks(): Deck[] {
  if (typeof window === 'undefined') return [];

  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return [];

    return JSON.parse(serialized, (key, value) => {
      if (value && typeof value === 'object' && value.__type === 'Date') {
        return new Date(value.value);
      }
      return value;
    });
  } catch (error) {
    console.error('Error loading decks from localStorage:', error);
    return [];
  }
}

export function saveDeck(deck: Deck): void {
  const decks = loadDecks();
  const existingIndex = decks.findIndex(d => d.id === deck.id);

  if (existingIndex >= 0) {
    decks[existingIndex] = { ...deck, updatedAt: new Date() };
  } else {
    decks.push(deck);
  }

  saveDecks(decks);
}

export function deleteDeck(deckId: string): void {
  const decks = loadDecks();
  const filtered = decks.filter(d => d.id !== deckId);
  saveDecks(filtered);
}

export function getDeckById(deckId: string): Deck | null {
  const decks = loadDecks();
  return decks.find(d => d.id === deckId) || null;
}

export function setCurrentDeckId(deckId: string | null): void {
  if (typeof window === 'undefined') return;

  if (deckId) {
    localStorage.setItem(CURRENT_DECK_KEY, deckId);
  } else {
    localStorage.removeItem(CURRENT_DECK_KEY);
  }
}

export function getCurrentDeckId(): string | null {
  if (typeof window === 'undefined') return null;

  return localStorage.getItem(CURRENT_DECK_KEY);
}

export function exportDeckToText(deck: Deck): string {
  const lines: string[] = [];

  // Commander first
  const commander = deck.cards.find(c => c.isCommander);
  if (commander) {
    lines.push('// Commander');
    lines.push(`1 ${commander.card.name}`);
    lines.push('');
  }

  // Group by category
  const categories = new Map<string, typeof deck.cards>();

  deck.cards
    .filter(c => !c.isCommander)
    .forEach(card => {
      const category = card.category || 'other';
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)!.push(card);
    });

  // Output each category
  const categoryOrder = ['creature', 'instant', 'sorcery', 'artifact', 'enchantment', 'planeswalker', 'land', 'other'];

  categoryOrder.forEach(cat => {
    const cards = categories.get(cat);
    if (cards && cards.length > 0) {
      lines.push(`// ${cat.charAt(0).toUpperCase() + cat.slice(1)}s`);
      cards.forEach(c => {
        lines.push(`${c.quantity} ${c.card.name}`);
      });
      lines.push('');
    }
  });

  return lines.join('\n').trim();
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(CURRENT_DECK_KEY);
}
