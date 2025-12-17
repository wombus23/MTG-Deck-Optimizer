import { ImportedDeck } from '@/types';

// Parse common deck formats:
// "1 Card Name"
// "1x Card Name"
// "Card Name"
// "Card Name x1"

const CARD_LINE_REGEX = /^(\d+)?\s*[xX]?\s*(.+?)(?:\s*[xX]?\s*(\d+))?$/;
const SIDEBOARD_MARKERS = ['sideboard', 'sb:', 'side:', 'companion'];
const COMMANDER_MARKERS = ['commander', 'cmdr:', 'general'];
const COMMENT_MARKERS = ['//', '#', '//'];

export function parseTextDeck(text: string): ImportedDeck {
  const lines = text.split('\n').map(line => line.trim());

  const result: ImportedDeck = {
    name: 'Imported Deck',
    mainboard: [],
    sideboard: [],
  };

  let currentSection: 'mainboard' | 'sideboard' | 'commander' = 'mainboard';
  let foundCommander = false;

  for (const line of lines) {
    // Skip empty lines
    if (!line) continue;

    // Check for comments and section markers
    const lowerLine = line.toLowerCase();

    // Check for section markers in comments
    if (COMMENT_MARKERS.some(marker => line.startsWith(marker))) {
      const commentContent = line.replace(/^[/#]+\s*/, '').toLowerCase();

      if (COMMANDER_MARKERS.some(marker => commentContent.includes(marker))) {
        currentSection = 'commander';
        continue;
      }

      if (SIDEBOARD_MARKERS.some(marker => commentContent.includes(marker))) {
        currentSection = 'sideboard';
        continue;
      }

      // Skip other comments
      continue;
    }

    // Check for section markers without comment prefix
    if (SIDEBOARD_MARKERS.some(marker => lowerLine.startsWith(marker))) {
      currentSection = 'sideboard';
      continue;
    }

    if (COMMANDER_MARKERS.some(marker => lowerLine.startsWith(marker))) {
      currentSection = 'commander';
      continue;
    }

    // Parse card line
    const match = line.match(CARD_LINE_REGEX);
    if (!match) continue;

    const [, qty1, cardName, qty2] = match;
    const quantity = parseInt(qty1 || qty2 || '1', 10);
    const cleanName = cardName.trim();

    if (!cleanName) continue;

    // Handle card based on current section
    if (currentSection === 'commander') {
      if (!foundCommander) {
        result.commander = cleanName;
        foundCommander = true;
      }
      // Also add to mainboard count
      result.mainboard.push({ quantity: 1, name: cleanName });
      currentSection = 'mainboard'; // Reset to mainboard after commander
    } else if (currentSection === 'sideboard') {
      // Check if this is a companion
      if (lowerLine.includes('companion')) {
        result.companion = cleanName;
      }
      result.sideboard?.push({ quantity, name: cleanName });
    } else {
      result.mainboard.push({ quantity, name: cleanName });
    }
  }

  // Try to auto-detect commander if not explicitly marked
  if (!result.commander && result.mainboard.length > 0) {
    // First card is often the commander in many exports
    const firstCard = result.mainboard[0];
    if (firstCard.quantity === 1) {
      result.commander = firstCard.name;
    }
  }

  return result;
}

export function validateImportedDeck(deck: ImportedDeck): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (deck.mainboard.length === 0) {
    errors.push('No cards found in decklist');
  }

  const totalCards = deck.mainboard.reduce((sum, c) => sum + c.quantity, 0);

  if (totalCards < 10) {
    errors.push(`Very few cards detected (${totalCards}). Check your format.`);
  }

  if (totalCards > 100) {
    errors.push(`Too many cards for Commander (${totalCards}/100)`);
  }

  // Check for basic formatting issues
  deck.mainboard.forEach(card => {
    if (card.name.length < 2) {
      errors.push(`Invalid card name: "${card.name}"`);
    }
    if (card.quantity < 1 || card.quantity > 99) {
      errors.push(`Invalid quantity for ${card.name}: ${card.quantity}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function normalizeCardName(name: string): string {
  return name
    .trim()
    // Remove set codes like [SET]
    .replace(/\s*\[[^\]]+\]\s*/g, '')
    // Remove collector numbers
    .replace(/\s*#\d+\s*/g, '')
    // Remove foil indicators
    .replace(/\s*\*F\*\s*/gi, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}
