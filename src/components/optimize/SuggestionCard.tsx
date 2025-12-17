'use client';

import { useState } from 'react';
import { CardFrame, Button, ManaCost, Tooltip } from '@/components/ui';
import { ReplacementSuggestion } from '@/types';
import { getCardImageUrl } from '@/lib/scryfall';
import { clsx } from 'clsx';

interface SuggestionCardProps {
  suggestion: ReplacementSuggestion;
  onApply: () => void;
  onDismiss: () => void;
}

export function SuggestionCard({ suggestion, onApply, onDismiss }: SuggestionCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const { currentCard, suggestedCard, reasoning, priority, score } = suggestion;

  const priorityStyles = {
    high: 'border-mtg-mythic shadow-glow-mythic',
    medium: 'border-mtg-gold shadow-glow-gold/50',
    low: 'border-mtg-border',
  };

  const priorityLabels = {
    high: { text: 'High Priority', color: 'text-mtg-mythic' },
    medium: { text: 'Medium Priority', color: 'text-mtg-gold' },
    low: { text: 'Low Priority', color: 'text-mtg-textMuted' },
  };

  return (
    <CardFrame
      className={clsx('w-full transition-all duration-300', priorityStyles[priority])}
      hover
      onClick={() => setShowDetails(!showDetails)}
    >
      <div
        className="p-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className={clsx('text-xs font-medium', priorityLabels[priority].color)}>
            {priorityLabels[priority].text}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-mtg-textMuted">
              Score: {score.overall.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Card comparison */}
        <div className="flex items-center gap-4">
          {/* Current card */}
          <div className="flex-1">
            <p className="text-xs text-mtg-textMuted mb-1">Remove</p>
            <CardPreview
              name={currentCard.name}
              imageUrl={getCardImageUrl(currentCard, 'small')}
              manaCost={currentCard.mana_cost}
              typeLine={currentCard.type_line}
              isHighlighted={isHovered}
              variant="remove"
            />
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0 flex flex-col items-center gap-1">
            <svg
              className="w-6 h-6 text-mtg-gold"
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
            <span className="text-[10px] text-mtg-textMuted">swap</span>
          </div>

          {/* Suggested card */}
          <div className="flex-1">
            <p className="text-xs text-mtg-textMuted mb-1">Add</p>
            <CardPreview
              name={suggestedCard.name}
              imageUrl={
                suggestedCard.image_uris
                  ? getCardImageUrl(suggestedCard, 'small')
                  : undefined
              }
              manaCost={suggestedCard.mana_cost}
              typeLine={suggestedCard.type_line}
              isHighlighted={isHovered}
              variant="add"
            />
          </div>
        </div>

        {/* Summary */}
        <p className="mt-4 text-sm text-mtg-text">{reasoning.summary}</p>

        {/* Meta play rate */}
        {reasoning.metaPlayRate && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-mtg-darker rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-gold rounded-full"
                style={{ width: `${reasoning.metaPlayRate}%` }}
              />
            </div>
            <span className="text-xs text-mtg-gold">
              {reasoning.metaPlayRate}% play rate
            </span>
          </div>
        )}

        {/* Expandable details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-mtg-border/30 animate-slide-up">
            <div className="grid grid-cols-2 gap-4">
              {/* Why remove */}
              <div>
                <p className="text-xs font-medium text-red-400 mb-2">Why remove:</p>
                <ul className="space-y-1">
                  {reasoning.whyRemove.map((reason, i) => (
                    <li key={i} className="text-xs text-mtg-textMuted flex items-start gap-1">
                      <span className="text-red-400 mt-0.5">-</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Why add */}
              <div>
                <p className="text-xs font-medium text-green-400 mb-2">Why add:</p>
                <ul className="space-y-1">
                  {reasoning.whyAdd.map((reason, i) => (
                    <li key={i} className="text-xs text-mtg-textMuted flex items-start gap-1">
                      <span className="text-green-400 mt-0.5">+</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Score breakdown */}
            <div className="mt-4 pt-4 border-t border-mtg-border/30">
              <p className="text-xs font-medium text-mtg-textMuted mb-2">Current Card Score:</p>
              <div className="grid grid-cols-4 gap-2">
                <ScoreItem label="Meta" value={score.metaScore} />
                <ScoreItem label="Synergy" value={score.synergyScore} />
                <ScoreItem label="Efficiency" value={score.manaEfficiency} />
                <ScoreItem label="Versatility" value={score.versatility} />
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Button onClick={onApply} size="sm" className="flex-1">
            Apply Swap
          </Button>
          <Button onClick={onDismiss} variant="ghost" size="sm">
            Dismiss
          </Button>
        </div>
      </div>
    </CardFrame>
  );
}

interface CardPreviewProps {
  name: string;
  imageUrl?: string;
  manaCost?: string;
  typeLine?: string;
  isHighlighted?: boolean;
  variant: 'remove' | 'add';
}

function CardPreview({
  name,
  imageUrl,
  manaCost,
  typeLine,
  isHighlighted,
  variant,
}: CardPreviewProps) {
  return (
    <div
      className={clsx(
        'p-2 rounded-lg border transition-all duration-200',
        variant === 'remove' && 'bg-red-900/10 border-red-500/30',
        variant === 'add' && 'bg-green-900/10 border-green-500/30',
        isHighlighted && variant === 'remove' && 'border-red-500/60',
        isHighlighted && variant === 'add' && 'border-green-500/60'
      )}
    >
      <div className="flex items-start gap-2">
        {imageUrl && (
          <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0 bg-mtg-darker">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover object-top"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-mtg-text truncate">{name}</p>
          {manaCost && <ManaCost cost={manaCost} size="xs" className="mt-1" />}
          {typeLine && (
            <p className="text-[10px] text-mtg-textDark truncate mt-1">{typeLine}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ScoreItem({ label, value }: { label: string; value: number }) {
  const getScoreColor = (val: number) => {
    if (val >= 70) return 'text-green-400';
    if (val >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="text-center">
      <p className={clsx('text-sm font-medium', getScoreColor(value))}>
        {value.toFixed(0)}
      </p>
      <p className="text-[10px] text-mtg-textDark">{label}</p>
    </div>
  );
}
