'use client';

import { useCallback, useMemo } from 'react';
import { useDeckStore } from '@/store/deckStore';
import { calculateDeckStats, validateCommanderDeck } from '@/types/deck';

export function useDeck() {
  const {
    currentDeck,
    savedDecks,
    isLoading,
    error,
    setCurrentDeck,
    createNewDeck,
    updateDeckName,
    setCommander,
    addCard,
    removeCard,
    updateCardQuantity,
    setCards,
    saveDeck,
    loadDeck,
    deleteDeck,
    clearCurrentDeck,
    setError,
  } = useDeckStore();

  const stats = useMemo(() => {
    if (!currentDeck) return null;
    return calculateDeckStats(currentDeck);
  }, [currentDeck]);

  const validation = useMemo(() => {
    if (!currentDeck) return null;
    return validateCommanderDeck(currentDeck);
  }, [currentDeck]);

  const cardCount = useMemo(() => {
    if (!currentDeck) return 0;
    return currentDeck.cards.reduce((sum, c) => sum + c.quantity, 0);
  }, [currentDeck]);

  const isComplete = useMemo(() => {
    return cardCount === 100 && validation?.isValid;
  }, [cardCount, validation]);

  const commander = useMemo(() => {
    return currentDeck?.commander || null;
  }, [currentDeck]);

  const exportDeckList = useCallback(() => {
    if (!currentDeck) return '';

    const lines: string[] = [];

    // Commander first
    const commanderCard = currentDeck.cards.find((c) => c.isCommander);
    if (commanderCard) {
      lines.push('// Commander');
      lines.push(`1 ${commanderCard.card.name}`);
      lines.push('');
    }

    // Rest of deck
    lines.push('// Main Deck');
    currentDeck.cards
      .filter((c) => !c.isCommander)
      .sort((a, b) => a.card.name.localeCompare(b.card.name))
      .forEach((c) => {
        lines.push(`${c.quantity} ${c.card.name}`);
      });

    return lines.join('\n');
  }, [currentDeck]);

  return {
    // State
    currentDeck,
    savedDecks,
    isLoading,
    error,
    stats,
    validation,
    cardCount,
    isComplete,
    commander,

    // Actions
    setCurrentDeck,
    createNewDeck,
    updateDeckName,
    setCommander,
    addCard,
    removeCard,
    updateCardQuantity,
    setCards,
    saveDeck,
    loadDeck,
    deleteDeck,
    clearCurrentDeck,
    setError,
    exportDeckList,
  };
}
