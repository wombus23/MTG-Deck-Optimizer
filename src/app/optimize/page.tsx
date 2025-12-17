'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OptimizationPanel } from '@/components/optimize';
import { DeckList, ManaCurve, DeckStats } from '@/components/deck';
import { Button, CardFrame, CardContent } from '@/components/ui';
import { useDeckStore } from '@/store/deckStore';
import Link from 'next/link';

export default function OptimizePage() {
  const router = useRouter();
  const { currentDeck, saveDeck, error } = useDeckStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Error display */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-900/20 border border-red-500/30 text-red-400">
          {error}
        </div>
      )}
      {/* Page header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display text-mtg-text">Optimize Deck</h1>
          <p className="text-sm text-mtg-textMuted mt-1">
            {currentDeck
              ? `Analyzing: ${currentDeck.name}`
              : 'Import a deck to get started'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/deck">
            <Button variant="secondary" size="sm">
              Edit Deck
            </Button>
          </Link>
          {currentDeck && (
            <Button onClick={saveDeck} size="sm">
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {currentDeck ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Deck overview */}
          <div className="lg:col-span-1 space-y-6">
            <ManaCurve />
            <DeckStats />
            <DeckList />
          </div>

          {/* Right column - Optimization */}
          <div className="lg:col-span-2">
            <OptimizationPanel />
          </div>
        </div>
      ) : (
        <CardFrame>
          <CardContent className="py-16 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-mtg-card flex items-center justify-center">
              <svg
                className="w-12 h-12 text-mtg-gold"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-display text-mtg-text mb-3">
              No Deck to Optimize
            </h2>
            <p className="text-mtg-textMuted mb-8 max-w-md mx-auto">
              Import your Commander deck first, then come back here to get
              intelligent suggestions for improving your card choices.
            </p>
            <Link href="/deck">
              <Button size="lg">
                Import Deck
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Button>
            </Link>

            {/* Feature highlights */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <FeatureItem
                icon={
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    />
                  </svg>
                }
                title="Meta Analysis"
                description="Compare your cards against format staples and high-performing decklists"
              />
              <FeatureItem
                icon={
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                }
                title="Synergy Detection"
                description="Identify card synergies and combos to strengthen your deck's strategy"
              />
              <FeatureItem
                icon={
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
                title="Smart Suggestions"
                description="Get prioritized card swap suggestions with detailed reasoning"
              />
            </div>
          </CardContent>
        </CardFrame>
      )}
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-mtg-gold/10 flex items-center justify-center text-mtg-gold flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-display text-mtg-text">{title}</h3>
        <p className="text-xs text-mtg-textMuted mt-1">{description}</p>
      </div>
    </div>
  );
}
