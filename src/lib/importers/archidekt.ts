import { ImportedDeck } from '@/types';

// Archidekt URL patterns:
// https://archidekt.com/decks/DECK_ID
// https://www.archidekt.com/decks/DECK_ID/DECK_NAME

const ARCHIDEKT_URL_REGEX = /archidekt\.com\/decks\/(\d+)/;
const ARCHIDEKT_API_BASE = 'https://archidekt.com/api/decks';

export function extractArchidektDeckId(url: string): string | null {
  const match = url.match(ARCHIDEKT_URL_REGEX);
  return match ? match[1] : null;
}

export function isArchidektUrl(url: string): boolean {
  return ARCHIDEKT_URL_REGEX.test(url);
}

interface ArchidektCard {
  quantity: number;
  card: {
    oracleCard: {
      name: string;
      type?: string;
    };
  };
  categories: string[];
}

interface ArchidektDeckResponse {
  id: number;
  name: string;
  format: number;
  cards: ArchidektCard[];
}

// Archidekt format IDs
const ARCHIDEKT_FORMATS: Record<number, string> = {
  1: 'standard',
  2: 'modern',
  3: 'commander',
  4: 'legacy',
  5: 'vintage',
  6: 'pauper',
  7: 'frontier',
  8: 'future',
  9: 'penny',
  10: 'oathbreaker',
  11: 'pioneer',
  12: 'historic',
};

export async function importFromArchidekt(urlOrId: string): Promise<ImportedDeck> {
  const deckId = extractArchidektDeckId(urlOrId) || urlOrId;

  if (!deckId || !/^\d+$/.test(deckId)) {
    throw new Error('Invalid Archidekt URL or deck ID');
  }

  try {
    // Use our API route to avoid CORS issues
    const response = await fetch(`/api/import/archidekt?id=${encodeURIComponent(deckId)}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch deck: ${errorText}`);
    }

    const data: ArchidektDeckResponse = await response.json();

    return parseArchidektResponse(data);
  } catch (error) {
    console.error('Error importing from Archidekt:', error);
    throw new Error(
      error instanceof Error
        ? `Archidekt import failed: ${error.message}`
        : 'Failed to import from Archidekt'
    );
  }
}

export function parseArchidektResponse(data: ArchidektDeckResponse): ImportedDeck {
  const result: ImportedDeck = {
    name: data.name || 'Archidekt Deck',
    mainboard: [],
    sideboard: [],
  };

  data.cards.forEach(entry => {
    const cardName = entry.card.oracleCard.name;
    const categories = entry.categories.map(c => c.toLowerCase());

    // Check if commander
    if (categories.includes('commander')) {
      if (!result.commander) {
        result.commander = cardName;
      }
      result.mainboard.push({
        quantity: entry.quantity,
        name: cardName,
      });
      return;
    }

    // Check if companion
    if (categories.includes('companion')) {
      result.companion = cardName;
      return;
    }

    // Check if sideboard
    if (categories.includes('sideboard') || categories.includes('maybeboard')) {
      result.sideboard?.push({
        quantity: entry.quantity,
        name: cardName,
      });
      return;
    }

    // Regular mainboard card
    result.mainboard.push({
      quantity: entry.quantity,
      name: cardName,
    });
  });

  return result;
}

// Direct API fetch for server-side use
export async function fetchArchidektDeckDirect(deckId: string): Promise<ArchidektDeckResponse> {
  const response = await fetch(`${ARCHIDEKT_API_BASE}/${deckId}/`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Deck not found. Make sure the deck is public.');
    }
    throw new Error(`Archidekt API error: ${response.status}`);
  }

  return response.json();
}

export function getFormatName(formatId: number): string {
  return ARCHIDEKT_FORMATS[formatId] || 'unknown';
}
