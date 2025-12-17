'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { DeckImporter, DeckList, ManaCurve, DeckStats, CardEntry } from '@/components/deck';
import { CardFrame, CardHeader, CardContent, Button } from '@/components/ui';
import { useDeckStore } from '@/store/deckStore';
import Link from 'next/link';

export default function DeckPage() {
  const searchParams = useSearchParams();
  const deckId = searchParams.get('id');

  const {
    currentDeck,
    savedDecks,
    loadDeck,
    saveDeck,
    createNewDeck,
    deleteDeck,
    clearCurrentDeck,
    error,
  } = useDeckStore();

  // Load deck from URL param if present
  useEffect(() => {
    if (deckId) {
      loadDeck(deckId);
    }
  }, [deckId, loadDeck]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display text-mtg-text">Deck Builder</h1>
          <p className="text-sm text-mtg-textMuted mt-1">
            Import a deck or build one from scratch
          </p>
        </div>
        <div className="flex gap-2">
          {currentDeck && (
            <>
              <Button onClick={saveDeck} variant="secondary" size="sm">
                Save Deck
              </Button>
              <Link href="/optimize">
                <Button size="sm">Optimize</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-900/20 border border-red-500/30 text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Import/Entry */}
        <div className="lg:col-span-1 space-y-6">
          {/* Import section */}
          {!currentDeck && <DeckImporter />}

          {/* Card entry */}
          {currentDeck && (
            <CardFrame>
              <CardHeader>
                <h3 className="text-sm font-display text-mtg-text">Add Cards</h3>
              </CardHeader>
              <CardContent>
                <CardEntry />
              </CardContent>
            </CardFrame>
          )}

          {/* Mana curve */}
          {currentDeck && <ManaCurve />}

          {/* Deck stats */}
          {currentDeck && <DeckStats />}

          {/* Saved decks */}
          {savedDecks.length > 0 && (
            <CardFrame>
              <CardHeader>
                <h3 className="text-sm font-display text-mtg-text">
                  Saved Decks ({savedDecks.length})
                </h3>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-mtg-border/30">
                  {savedDecks.map((deck) => (
                    <div
                      key={deck.id}
                      className="flex items-center justify-between p-3 hover:bg-mtg-card/50 transition-colors"
                    >
                      <button
                        onClick={() => loadDeck(deck.id)}
                        className="flex-1 text-left"
                      >
                        <p className="text-sm text-mtg-text truncate">
                          {deck.name}
                        </p>
                        <p className="text-xs text-mtg-textDark">
                          {deck.cards.length} cards
                        </p>
                      </button>
                      <button
                        onClick={() => deleteDeck(deck.id)}
                        className="p-1 text-mtg-textMuted hover:text-red-400 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </CardFrame>
          )}

          {/* Actions */}
          {currentDeck && (
            <div className="flex gap-2">
              <Button
                onClick={createNewDeck}
                variant="secondary"
                size="sm"
                className="flex-1"
              >
                New Deck
              </Button>
              <Button
                onClick={clearCurrentDeck}
                variant="ghost"
                size="sm"
                className="flex-1"
              >
                Clear
              </Button>
            </div>
          )}
        </div>

        {/* Right column - Deck list */}
        <div className="lg:col-span-2">
          <DeckList />

          {/* Empty state */}
          {!currentDeck && (
            <CardFrame className="mt-6">
              <CardContent className="py-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-mtg-card flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-mtg-textMuted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-display text-mtg-text mb-2">
                  No Deck Loaded
                </h3>
                <p className="text-sm text-mtg-textMuted mb-6 max-w-md mx-auto">
                  Import a deck from Moxfield or Archidekt, or start building
                  one from scratch by adding cards manually.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button onClick={createNewDeck} variant="secondary">
                    Create New Deck
                  </Button>
                </div>
              </CardContent>
            </CardFrame>
          )}
        </div>
      </div>
    </div>
  );
}
