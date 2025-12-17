'use client';

import { useState } from 'react';
import { CardFrame, CardHeader, CardContent, Button } from '@/components/ui';
import { SuggestionCard } from './SuggestionCard';
import { useDeckStore } from '@/store/deckStore';
import { optimizeDeck } from '@/lib/optimizer';
import { getCardByName } from '@/lib/scryfall';
import { clsx } from 'clsx';

export function OptimizationPanel() {
  const {
    currentDeck,
    optimizationResult,
    isOptimizing,
    setOptimizationResult,
    setOptimizing,
    applyReplacement,
    setError,
  } = useDeckStore();

  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(
    new Set()
  );
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const handleOptimize = async () => {
    if (!currentDeck) {
      setError('No deck loaded');
      return;
    }

    if (currentDeck.cards.length === 0) {
      setError('Deck has no cards to analyze');
      return;
    }

    setOptimizing(true);
    setError(null);

    try {
      console.log('Starting optimization for deck:', currentDeck.name);
      console.log('Cards in deck:', currentDeck.cards.length);
      console.log('Color identity:', currentDeck.colorIdentity);

      const result = await optimizeDeck(currentDeck);

      console.log('Optimization result:', result);
      console.log('Suggestions:', result.suggestions.length);

      setOptimizationResult(result);
      setDismissedSuggestions(new Set());
    } catch (error) {
      console.error('Optimization error:', error);
      setError(error instanceof Error ? error.message : 'Optimization failed');
    } finally {
      setOptimizing(false);
    }
  };

  const handleApplySuggestion = async (suggestionId: string) => {
    if (!optimizationResult) return;

    const suggestion = optimizationResult.suggestions.find(
      (s) => s.id === suggestionId
    );
    if (!suggestion) return;

    // Fetch the full card data for the suggested card
    const fullCard = await getCardByName(suggestion.suggestedCard.name);
    if (fullCard) {
      applyReplacement(suggestion.currentCard.id, fullCard);
      setDismissedSuggestions((prev) => new Set([...prev, suggestionId]));
    }
  };

  const handleDismissSuggestion = (suggestionId: string) => {
    setDismissedSuggestions((prev) => new Set([...prev, suggestionId]));
  };

  const filteredSuggestions = optimizationResult?.suggestions.filter(
    (s) =>
      !dismissedSuggestions.has(s.id) &&
      (filter === 'all' || s.priority === filter)
  );

  if (!currentDeck) {
    return (
      <CardFrame className="w-full">
        <CardContent className="py-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-mtg-card flex items-center justify-center">
            <svg
              className="w-8 h-8 text-mtg-textMuted"
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
          <p className="text-mtg-textMuted">No deck loaded</p>
          <p className="text-sm text-mtg-textDark mt-2">
            Import a deck first to get optimization suggestions
          </p>
        </CardContent>
      </CardFrame>
    );
  }

  return (
    <div className="space-y-6">
      {/* Optimize button and stats */}
      <CardFrame>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-display text-mtg-text">
                Deck Optimization
              </h2>
              <p className="text-sm text-mtg-textMuted mt-1">
                Analyze your deck and get suggestions for improvements
              </p>
            </div>
            <Button
              onClick={handleOptimize}
              isLoading={isOptimizing}
              size="lg"
              className="w-full sm:w-auto"
            >
              {isOptimizing ? 'Analyzing...' : 'Optimize Deck'}
            </Button>
          </div>

          {/* Overall score */}
          {optimizationResult && (
            <div className="mt-6 pt-6 border-t border-mtg-border/30">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-mtg-textMuted">Overall Deck Score</span>
                <span className="text-2xl font-display text-mtg-gold">
                  {optimizationResult.overallScore}
                  <span className="text-sm text-mtg-textMuted">/100</span>
                </span>
              </div>
              <div className="h-2 bg-mtg-darker rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-gold transition-all duration-500"
                  style={{ width: `${optimizationResult.overallScore}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </CardFrame>

      {/* Analysis results */}
      {optimizationResult && (
        <>
          {/* Strengths and weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <CardFrame>
              <CardHeader>
                <h3 className="text-sm font-display text-green-400 flex items-center gap-2">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Deck Strengths
                </h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {optimizationResult.deckStrengths.map((strength, i) => (
                    <li
                      key={i}
                      className="text-sm text-mtg-textMuted flex items-start gap-2"
                    >
                      <span className="text-green-400 mt-0.5">+</span>
                      {strength}
                    </li>
                  ))}
                  {optimizationResult.deckStrengths.length === 0 && (
                    <li className="text-sm text-mtg-textDark italic">
                      No major strengths identified
                    </li>
                  )}
                </ul>
              </CardContent>
            </CardFrame>

            {/* Weaknesses */}
            <CardFrame>
              <CardHeader>
                <h3 className="text-sm font-display text-red-400 flex items-center gap-2">
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
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  Areas for Improvement
                </h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {optimizationResult.deckWeaknesses.map((weakness, i) => (
                    <li
                      key={i}
                      className="text-sm text-mtg-textMuted flex items-start gap-2"
                    >
                      <span className="text-red-400 mt-0.5">!</span>
                      {weakness}
                    </li>
                  ))}
                  {optimizationResult.deckWeaknesses.length === 0 && (
                    <li className="text-sm text-mtg-textDark italic">
                      No major issues found
                    </li>
                  )}
                </ul>
              </CardContent>
            </CardFrame>
          </div>

          {/* Suggestions */}
          <CardFrame>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-display text-mtg-text">
                  Card Suggestions ({filteredSuggestions?.length || 0})
                </h3>
                <div className="flex gap-1">
                  {(['all', 'high', 'medium', 'low'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={clsx(
                        'px-2 py-1 text-xs rounded transition-colors',
                        filter === f
                          ? 'bg-mtg-gold/20 text-mtg-gold'
                          : 'text-mtg-textMuted hover:text-mtg-text'
                      )}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredSuggestions && filteredSuggestions.length > 0 ? (
                <div className="divide-y divide-mtg-border/30">
                  {filteredSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="p-4">
                      <SuggestionCard
                        suggestion={suggestion}
                        onApply={() => handleApplySuggestion(suggestion.id)}
                        onDismiss={() => handleDismissSuggestion(suggestion.id)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-mtg-textMuted">No suggestions available</p>
                  {dismissedSuggestions.size > 0 && (
                    <button
                      onClick={() => setDismissedSuggestions(new Set())}
                      className="mt-2 text-sm text-mtg-gold hover:underline"
                    >
                      Show dismissed suggestions
                    </button>
                  )}
                </div>
              )}
            </CardContent>
          </CardFrame>
        </>
      )}
    </div>
  );
}
