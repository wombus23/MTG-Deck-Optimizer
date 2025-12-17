import { ImportedDeck } from '@/types';

// Moxfield URL patterns:
// https://www.moxfield.com/decks/DECK_ID
// https://moxfield.com/decks/DECK_ID

const MOXFIELD_URL_REGEX = /moxfield\.com\/decks\/([a-zA-Z0-9_-]+)/;
const MOXFIELD_API_BASE = 'https://api2.moxfield.com/v2/decks/all';

export function extractMoxfieldDeckId(url: string): string | null {
  const match = url.match(MOXFIELD_URL_REGEX);
  return match ? match[1] : null;
}

export function isMoxfieldUrl(url: string): boolean {
  return MOXFIELD_URL_REGEX.test(url);
}

interface MoxfieldCard {
  quantity: number;
  card: {
    name: string;
    type_line?: string;
  };
}

interface MoxfieldDeckResponse {
  name: string;
  format: string;
  mainboard: Record<string, MoxfieldCard>;
  sideboard?: Record<string, MoxfieldCard>;
  commanders?: Record<string, MoxfieldCard>;
  companions?: Record<string, MoxfieldCard>;
}

export async function importFromMoxfield(urlOrId: string): Promise<ImportedDeck> {
  const deckId = extractMoxfieldDeckId(urlOrId) || urlOrId;

  if (!deckId) {
    throw new Error('Invalid Moxfield URL or deck ID');
  }

  try {
    // Note: Moxfield API might require CORS proxy in browser
    // In production, this should go through a Next.js API route
    const response = await fetch(`/api/import/moxfield?id=${encodeURIComponent(deckId)}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch deck: ${errorText}`);
    }

    const data: MoxfieldDeckResponse = await response.json();

    return parseMoxfieldResponse(data);
  } catch (error) {
    console.error('Error importing from Moxfield:', error);
    throw new Error(
      error instanceof Error
        ? `Moxfield import failed: ${error.message}`
        : 'Failed to import from Moxfield'
    );
  }
}

export function parseMoxfieldResponse(data: MoxfieldDeckResponse): ImportedDeck {
  const result: ImportedDeck = {
    name: data.name || 'Moxfield Deck',
    mainboard: [],
    sideboard: [],
  };

  // Parse commanders
  if (data.commanders) {
    const commanderEntries = Object.values(data.commanders);
    if (commanderEntries.length > 0) {
      result.commander = commanderEntries[0].card.name;
      // Add commanders to mainboard
      commanderEntries.forEach(entry => {
        result.mainboard.push({
          quantity: entry.quantity,
          name: entry.card.name,
        });
      });
    }
  }

  // Parse companions
  if (data.companions) {
    const companionEntries = Object.values(data.companions);
    if (companionEntries.length > 0) {
      result.companion = companionEntries[0].card.name;
    }
  }

  // Parse mainboard
  if (data.mainboard) {
    Object.values(data.mainboard).forEach(entry => {
      result.mainboard.push({
        quantity: entry.quantity,
        name: entry.card.name,
      });
    });
  }

  // Parse sideboard
  if (data.sideboard) {
    Object.values(data.sideboard).forEach(entry => {
      result.sideboard?.push({
        quantity: entry.quantity,
        name: entry.card.name,
      });
    });
  }

  return result;
}

// Direct API fetch for server-side use
export async function fetchMoxfieldDeckDirect(deckId: string): Promise<MoxfieldDeckResponse> {
  const response = await fetch(`${MOXFIELD_API_BASE}/${deckId}`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Deck not found. Make sure the deck is public.');
    }
    throw new Error(`Moxfield API error: ${response.status}`);
  }

  return response.json();
}
