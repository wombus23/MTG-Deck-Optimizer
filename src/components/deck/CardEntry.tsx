'use client';

import { useState, useEffect, useRef } from 'react';
import { Input, ManaCost } from '@/components/ui';
import { searchCards, getCardImageUrl } from '@/lib/scryfall';
import { useDeckStore } from '@/store/deckStore';
import { Card } from '@/types';
import { clsx } from 'clsx';

export function CardEntry() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Card[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const { addCard, setCommander, currentDeck } = useDeckStore();

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const cards = await searchCards(query, 8);
        setResults(cards);
        setShowResults(true);
        setSelectedIndex(0);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelectCard = (card: Card, asCommander = false) => {
    if (asCommander) {
      setCommander(card);
    } else {
      addCard(card, 1);
    }
    setQuery('');
    setResults([]);
    setShowResults(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelectCard(results[selectedIndex], e.shiftKey);
        }
        break;
      case 'Escape':
        setShowResults(false);
        break;
    }
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasCommander = currentDeck?.commander != null;

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setShowResults(true)}
        placeholder="Search for a card to add..."
        className="pr-8"
      />

      {/* Loading indicator */}
      {isSearching && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <svg
            className="animate-spin w-4 h-4 text-mtg-textMuted"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
      )}

      {/* Results dropdown */}
      {showResults && results.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute z-50 w-full mt-1 bg-mtg-card border border-mtg-border rounded-lg shadow-xl overflow-hidden"
        >
          {results.map((card, index) => (
            <CardSearchResult
              key={card.id}
              card={card}
              isSelected={index === selectedIndex}
              showCommanderOption={!hasCommander && card.legalities.commander === 'legal'}
              onSelect={() => handleSelectCard(card)}
              onSelectAsCommander={() => handleSelectCard(card, true)}
            />
          ))}
          <div className="px-3 py-2 bg-mtg-darker/50 text-xs text-mtg-textDark">
            Press Enter to add • Shift+Enter to set as commander
          </div>
        </div>
      )}
    </div>
  );
}

interface CardSearchResultProps {
  card: Card;
  isSelected: boolean;
  showCommanderOption: boolean;
  onSelect: () => void;
  onSelectAsCommander: () => void;
}

function CardSearchResult({
  card,
  isSelected,
  showCommanderOption,
  onSelect,
  onSelectAsCommander,
}: CardSearchResultProps) {
  const imageUrl = getCardImageUrl(card, 'small');

  return (
    <div
      className={clsx(
        'flex items-center gap-3 px-3 py-2 cursor-pointer',
        'transition-colors',
        isSelected ? 'bg-mtg-cardLight' : 'hover:bg-mtg-card'
      )}
      onClick={onSelect}
    >
      {/* Card image */}
      <div className="w-10 h-14 rounded overflow-hidden flex-shrink-0 bg-mtg-darker">
        <img
          src={imageUrl}
          alt={card.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Card info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-mtg-text truncate">{card.name}</span>
          <ManaCost cost={card.mana_cost} size="xs" />
        </div>
        <p className="text-xs text-mtg-textDark truncate">{card.type_line}</p>
      </div>

      {/* Commander button */}
      {showCommanderOption && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectAsCommander();
          }}
          className="px-2 py-1 text-xs rounded bg-mtg-gold/20 text-mtg-gold hover:bg-mtg-gold/30 transition-colors"
        >
          CMDR
        </button>
      )}
    </div>
  );
}
