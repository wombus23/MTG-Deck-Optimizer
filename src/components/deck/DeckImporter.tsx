'use client';

import { useState } from 'react';
import { Button, Textarea, CardFrame, CardHeader, CardContent } from '@/components/ui';
import { importDeck, detectImportSource, ImportSource } from '@/lib/importers';
import { getCardsByNames } from '@/lib/scryfall';
import { useDeckStore } from '@/store/deckStore';
import { DeckCard, createEmptyDeck } from '@/types';
import { clsx } from 'clsx';

export function DeckImporter() {
  const [input, setInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedSource, setDetectedSource] = useState<ImportSource>('text');

  const { setCurrentDeck, setCards, setLoading } = useDeckStore();

  const handleInputChange = (value: string) => {
    setInput(value);
    setError(null);

    // Detect source type
    const source = detectImportSource(value);
    setDetectedSource(source);
  };

  const handleImport = async () => {
    if (!input.trim()) {
      setError('Please enter a deck URL or card list');
      return;
    }

    setIsImporting(true);
    setLoading(true);
    setError(null);

    try {
      // Import the deck
      const { deck: importedDeck, source } = await importDeck(input);

      // Create a new deck
      const newDeck = createEmptyDeck();
      newDeck.name = importedDeck.name;
      newDeck.source = source;

      if (source === 'moxfield' || source === 'archidekt') {
        newDeck.sourceUrl = input.trim();
      }

      // Fetch card data from Scryfall
      const cardNames = importedDeck.mainboard.map((c) => c.name);
      const cardDataMap = await getCardsByNames(cardNames);

      // Convert to DeckCard format
      const deckCards: DeckCard[] = [];

      importedDeck.mainboard.forEach((entry) => {
        const cardData = cardDataMap.get(entry.name);
        if (cardData) {
          const isCommander =
            importedDeck.commander?.toLowerCase() === entry.name.toLowerCase();

          deckCards.push({
            card: cardData,
            quantity: entry.quantity,
            isCommander,
          });
        }
      });

      // Set the deck
      setCurrentDeck(newDeck);
      setCards(deckCards);

      // Clear input on success
      setInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import deck');
    } finally {
      setIsImporting(false);
      setLoading(false);
    }
  };

  const sourceLabels: Record<ImportSource, { label: string; color: string }> = {
    text: { label: 'Text List', color: 'text-mtg-textMuted' },
    moxfield: { label: 'Moxfield', color: 'text-blue-400' },
    archidekt: { label: 'Archidekt', color: 'text-purple-400' },
    auto: { label: 'Auto', color: 'text-mtg-textMuted' },
  };

  return (
    <CardFrame className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display text-mtg-text">Import Deck</h2>
          <span
            className={clsx(
              'text-xs font-medium px-2 py-1 rounded-full bg-mtg-darker/50',
              sourceLabels[detectedSource].color
            )}
          >
            {sourceLabels[detectedSource].label}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Instructions */}
          <div className="text-sm text-mtg-textMuted">
            <p className="mb-2">Paste one of the following:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>A Moxfield deck URL (e.g., moxfield.com/decks/...)</li>
              <li>An Archidekt deck URL (e.g., archidekt.com/decks/...)</li>
              <li>A card list in &quot;1 Card Name&quot; format</li>
            </ul>
          </div>

          {/* Input */}
          <Textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Paste deck URL or card list here...

Example:
https://www.moxfield.com/decks/abc123

Or:

1 Sol Ring
1 Arcane Signet
1 Command Tower
..."
            rows={10}
            className="font-mono text-sm"
          />

          {/* Error */}
          {error && (
            <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Import Button */}
          <Button
            onClick={handleImport}
            isLoading={isImporting}
            disabled={!input.trim()}
            className="w-full"
          >
            {isImporting ? 'Importing...' : 'Import Deck'}
          </Button>

          {/* Source info */}
          <div className="text-xs text-mtg-textDark text-center">
            Card data powered by Scryfall
          </div>
        </div>
      </CardContent>
    </CardFrame>
  );
}
