'use client';

import { useCallback, useMemo } from 'react';
import { useDeckStore } from '@/store/deckStore';
import { optimizeDeck } from '@/lib/optimizer';
import { getCardByName } from '@/lib/scryfall';

export function useOptimizer() {
  const {
    currentDeck,
    optimizationResult,
    isOptimizing,
    setOptimizationResult,
    setOptimizing,
    applyReplacement,
    setError,
  } = useDeckStore();

  const runOptimization = useCallback(async () => {
    if (!currentDeck) {
      setError('No deck loaded');
      return;
    }

    setOptimizing(true);
    setError(null);

    try {
      const result = await optimizeDeck(currentDeck);
      setOptimizationResult(result);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Optimization failed'
      );
    } finally {
      setOptimizing(false);
    }
  }, [currentDeck, setOptimizationResult, setOptimizing, setError]);

  const applySuggestion = useCallback(
    async (suggestionId: string) => {
      if (!optimizationResult) return false;

      const suggestion = optimizationResult.suggestions.find(
        (s) => s.id === suggestionId
      );
      if (!suggestion) return false;

      try {
        const fullCard = await getCardByName(suggestion.suggestedCard.name);
        if (fullCard) {
          applyReplacement(suggestion.currentCard.id, fullCard);
          return true;
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to apply suggestion'
        );
      }

      return false;
    },
    [optimizationResult, applyReplacement, setError]
  );

  const clearOptimization = useCallback(() => {
    setOptimizationResult(null);
  }, [setOptimizationResult]);

  const highPrioritySuggestions = useMemo(() => {
    return (
      optimizationResult?.suggestions.filter((s) => s.priority === 'high') || []
    );
  }, [optimizationResult]);

  const suggestionsByCategory = useMemo(() => {
    if (!optimizationResult) return new Map();

    const grouped = new Map<string, typeof optimizationResult.suggestions>();

    optimizationResult.suggestions.forEach((suggestion) => {
      const category = suggestion.category;
      if (!grouped.has(category)) {
        grouped.set(category, []);
      }
      grouped.get(category)!.push(suggestion);
    });

    return grouped;
  }, [optimizationResult]);

  return {
    // State
    optimizationResult,
    isOptimizing,
    highPrioritySuggestions,
    suggestionsByCategory,

    // Actions
    runOptimization,
    applySuggestion,
    clearOptimization,
  };
}
