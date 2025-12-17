import { Card } from '@/types';

const SCRYFALL_API = 'https://api.scryfall.com';
const RATE_LIMIT_DELAY = 100; // Scryfall asks for 50-100ms between requests

let lastRequestTime = 0;

async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest));
  }

  lastRequestTime = Date.now();
  return fetch(url);
}

// Simple in-memory cache
const cardCache = new Map<string, Card>();
const searchCache = new Map<string, Card[]>();

export async function searchCards(query: string, limit: number = 10): Promise<Card[]> {
  if (!query || query.length < 2) return [];

  const cacheKey = `${query}-${limit}`;
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey)!;
  }

  try {
    const response = await rateLimitedFetch(
      `${SCRYFALL_API}/cards/autocomplete?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) return [];

    const data = await response.json();
    const cardNames: string[] = data.data?.slice(0, limit) || [];

    // Fetch card details for each name
    const cards = await Promise.all(
      cardNames.map(name => getCardByName(name))
    );

    const validCards = cards.filter((c): c is Card => c !== null);
    searchCache.set(cacheKey, validCards);

    return validCards;
  } catch (error) {
    console.error('Error searching cards:', error);
    return [];
  }
}

export async function getCardByName(name: string): Promise<Card | null> {
  const normalizedName = name.toLowerCase().trim();

  if (cardCache.has(normalizedName)) {
    return cardCache.get(normalizedName)!;
  }

  try {
    const response = await rateLimitedFetch(
      `${SCRYFALL_API}/cards/named?exact=${encodeURIComponent(name)}`
    );

    if (!response.ok) {
      // Try fuzzy search if exact match fails
      const fuzzyResponse = await rateLimitedFetch(
        `${SCRYFALL_API}/cards/named?fuzzy=${encodeURIComponent(name)}`
      );

      if (!fuzzyResponse.ok) return null;

      const card = await fuzzyResponse.json();
      cardCache.set(normalizedName, card);
      return card;
    }

    const card = await response.json();
    cardCache.set(normalizedName, card);
    return card;
  } catch (error) {
    console.error('Error fetching card:', error);
    return null;
  }
}

export async function getCardById(id: string): Promise<Card | null> {
  try {
    const response = await rateLimitedFetch(`${SCRYFALL_API}/cards/${id}`);

    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    console.error('Error fetching card by ID:', error);
    return null;
  }
}

export async function getCardsByNames(names: string[]): Promise<Map<string, Card>> {
  const results = new Map<string, Card>();

  // Check cache first
  const uncachedNames: string[] = [];
  names.forEach(name => {
    const normalizedName = name.toLowerCase().trim();
    if (cardCache.has(normalizedName)) {
      results.set(name, cardCache.get(normalizedName)!);
    } else {
      uncachedNames.push(name);
    }
  });

  if (uncachedNames.length === 0) return results;

  // Use Scryfall's collection endpoint for bulk fetching
  try {
    const identifiers = uncachedNames.map(name => ({ name }));

    // Scryfall limits to 75 cards per request
    const chunks = [];
    for (let i = 0; i < identifiers.length; i += 75) {
      chunks.push(identifiers.slice(i, i + 75));
    }

    for (const chunk of chunks) {
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));

      const response = await fetch(`${SCRYFALL_API}/cards/collection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifiers: chunk }),
      });

      if (response.ok) {
        const data = await response.json();
        data.data?.forEach((card: Card) => {
          cardCache.set(card.name.toLowerCase().trim(), card);
          results.set(card.name, card);
        });
      }
    }
  } catch (error) {
    console.error('Error bulk fetching cards:', error);

    // Fallback to individual fetches
    for (const name of uncachedNames) {
      const card = await getCardByName(name);
      if (card) {
        results.set(name, card);
      }
    }
  }

  return results;
}

export async function getRandomCommander(): Promise<Card | null> {
  try {
    const response = await rateLimitedFetch(
      `${SCRYFALL_API}/cards/random?q=is%3Acommander+legal%3Acommander`
    );

    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    console.error('Error fetching random commander:', error);
    return null;
  }
}

export function getCardImageUrl(card: Card, size: 'small' | 'normal' | 'large' | 'art_crop' = 'normal'): string {
  if (card.image_uris) {
    return card.image_uris[size] || card.image_uris.normal;
  }

  // Handle double-faced cards
  if (card.card_faces && card.card_faces[0]?.image_uris) {
    return card.card_faces[0].image_uris[size] || card.card_faces[0].image_uris.normal;
  }

  return '/images/card-back.png';
}

export function parseManaCost(manaCost: string): { symbols: string[]; cmc: number } {
  if (!manaCost) return { symbols: [], cmc: 0 };

  const symbols: string[] = [];
  let cmc = 0;

  const matches = manaCost.match(/\{([^}]+)\}/g) || [];

  matches.forEach(match => {
    const symbol = match.replace(/[{}]/g, '');
    symbols.push(symbol);

    // Calculate CMC
    if (/^\d+$/.test(symbol)) {
      cmc += parseInt(symbol, 10);
    } else if (symbol !== 'X') {
      cmc += 1;
    }
  });

  return { symbols, cmc };
}

export function clearCache(): void {
  cardCache.clear();
  searchCache.clear();
}
