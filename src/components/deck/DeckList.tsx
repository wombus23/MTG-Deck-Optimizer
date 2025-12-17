'use client';

import { useMemo } from 'react';
import { CardFrame, CardHeader, CardContent, ManaCost, ColorIdentity } from '@/components/ui';
import { useDeckStore } from '@/store/deckStore';
import { DeckCard, CardCategory, CATEGORY_LABELS } from '@/types';
import { calculateDeckStats } from '@/types/deck';
import { getCardImageUrl } from '@/lib/scryfall';
import { clsx } from 'clsx';

export function DeckList() {
  const { currentDeck, removeCard, updateCardQuantity } = useDeckStore();

  const groupedCards = useMemo(() => {
    if (!currentDeck) return new Map<CardCategory, DeckCard[]>();

    const groups = new Map<CardCategory, DeckCard[]>();

    currentDeck.cards.forEach((card) => {
      const category = card.category || 'other';
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)!.push(card);
    });

    // Sort cards within each group by name
    groups.forEach((cards) => {
      cards.sort((a, b) => a.card.name.localeCompare(b.card.name));
    });

    return groups;
  }, [currentDeck]);

  const stats = useMemo(() => {
    if (!currentDeck) return null;
    return calculateDeckStats(currentDeck);
  }, [currentDeck]);

  if (!currentDeck) {
    return (
      <CardFrame className="w-full">
        <CardContent className="py-12 text-center">
          <p className="text-mtg-textMuted">No deck loaded</p>
          <p className="text-sm text-mtg-textDark mt-2">
            Import a deck to see the card list
          </p>
        </CardContent>
      </CardFrame>
    );
  }

  const categoryOrder: CardCategory[] = [
    'commander',
    'creature',
    'instant',
    'sorcery',
    'artifact',
    'enchantment',
    'planeswalker',
    'land',
    'ramp',
    'draw',
    'removal',
    'boardWipe',
    'protection',
    'tutor',
    'graveyard',
    'other',
  ];

  return (
    <CardFrame className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-display text-mtg-text">
              {currentDeck.name}
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <ColorIdentity colors={currentDeck.colorIdentity} size="xs" />
              <span className="text-xs text-mtg-textMuted">
                {stats?.totalCards || 0} cards
              </span>
              {stats && (
                <span className="text-xs text-mtg-textMuted">
                  Avg CMC: {stats.averageCmc.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 max-h-[600px] overflow-y-auto mtg-scrollbar">
        {categoryOrder.map((category) => {
          const cards = groupedCards.get(category);
          if (!cards || cards.length === 0) return null;

          const count = cards.reduce((sum, c) => sum + c.quantity, 0);

          return (
            <div key={category} className="border-b border-mtg-border/30 last:border-b-0">
              {/* Category header */}
              <div className="px-4 py-2 bg-mtg-darker/50 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-mtg-textMuted">
                    {CATEGORY_LABELS[category]}
                  </span>
                  <span className="text-xs text-mtg-textDark">{count}</span>
                </div>
              </div>

              {/* Cards */}
              <div className="divide-y divide-mtg-border/20">
                {cards.map((deckCard) => (
                  <DeckListItem
                    key={deckCard.card.id}
                    deckCard={deckCard}
                    onRemove={() => removeCard(deckCard.card.id)}
                    onUpdateQuantity={(qty) =>
                      updateCardQuantity(deckCard.card.id, qty)
                    }
                  />
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </CardFrame>
  );
}

interface DeckListItemProps {
  deckCard: DeckCard;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

function DeckListItem({ deckCard, onRemove, onUpdateQuantity }: DeckListItemProps) {
  const { card, quantity, isCommander } = deckCard;
  const imageUrl = getCardImageUrl(card, 'small');

  return (
    <div
      className={clsx(
        'group flex items-center gap-3 px-4 py-2',
        'hover:bg-mtg-card/50 transition-colors',
        isCommander && 'bg-mtg-gold/5'
      )}
    >
      {/* Card image preview (shown on hover) */}
      <div className="relative">
        <div className="w-8 h-8 rounded bg-mtg-darker overflow-hidden">
          <img
            src={imageUrl}
            alt={card.name}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
        </div>
      </div>

      {/* Card info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              'text-sm truncate',
              isCommander ? 'text-mtg-gold font-medium' : 'text-mtg-text'
            )}
          >
            {card.name}
          </span>
          {isCommander && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-mtg-gold/20 text-mtg-gold">
              CMDR
            </span>
          )}
        </div>
        <div className="text-xs text-mtg-textDark truncate">{card.type_line}</div>
      </div>

      {/* Mana cost */}
      <ManaCost cost={card.mana_cost} size="xs" />

      {/* Quantity controls */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isCommander && (
          <>
            <button
              onClick={() => onUpdateQuantity(quantity - 1)}
              className="w-6 h-6 flex items-center justify-center rounded bg-mtg-darker hover:bg-mtg-border text-mtg-textMuted hover:text-mtg-text transition-colors"
            >
              -
            </button>
            <span className="w-6 text-center text-sm text-mtg-text">
              {quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(quantity + 1)}
              className="w-6 h-6 flex items-center justify-center rounded bg-mtg-darker hover:bg-mtg-border text-mtg-textMuted hover:text-mtg-text transition-colors"
            >
              +
            </button>
          </>
        )}
        <button
          onClick={onRemove}
          className="ml-2 w-6 h-6 flex items-center justify-center rounded bg-red-900/30 hover:bg-red-900/50 text-red-400 hover:text-red-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
