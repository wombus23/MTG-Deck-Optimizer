export * from './text';
export * from './moxfield';
export * from './archidekt';

import { ImportedDeck } from '@/types';
import { parseTextDeck } from './text';
import { importFromMoxfield, isMoxfieldUrl } from './moxfield';
import { importFromArchidekt, isArchidektUrl } from './archidekt';

export type ImportSource = 'text' | 'moxfield' | 'archidekt' | 'auto';

export async function importDeck(
  input: string,
  source: ImportSource = 'auto'
): Promise<{ deck: ImportedDeck; source: ImportSource }> {
  // Auto-detect source
  if (source === 'auto') {
    const trimmedInput = input.trim();

    if (isMoxfieldUrl(trimmedInput)) {
      source = 'moxfield';
    } else if (isArchidektUrl(trimmedInput)) {
      source = 'archidekt';
    } else if (trimmedInput.startsWith('http')) {
      // Unknown URL
      throw new Error(
        'Unrecognized URL format. Please use a Moxfield or Archidekt deck URL, or paste your decklist directly.'
      );
    } else {
      source = 'text';
    }
  }

  // Import based on source
  switch (source) {
    case 'moxfield':
      return {
        deck: await importFromMoxfield(input),
        source: 'moxfield',
      };

    case 'archidekt':
      return {
        deck: await importFromArchidekt(input),
        source: 'archidekt',
      };

    case 'text':
    default:
      return {
        deck: parseTextDeck(input),
        source: 'text',
      };
  }
}

export function detectImportSource(input: string): ImportSource {
  const trimmedInput = input.trim();

  if (isMoxfieldUrl(trimmedInput)) {
    return 'moxfield';
  }

  if (isArchidektUrl(trimmedInput)) {
    return 'archidekt';
  }

  return 'text';
}
