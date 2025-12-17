'use client';

import { useMemo } from 'react';
import { CardFrame, CardHeader, CardContent } from '@/components/ui';
import { useDeckStore } from '@/store/deckStore';
import { calculateDeckStats } from '@/types/deck';
import { clsx } from 'clsx';

export function ManaCurve() {
  const { currentDeck } = useDeckStore();

  const stats = useMemo(() => {
    if (!currentDeck) return null;
    return calculateDeckStats(currentDeck);
  }, [currentDeck]);

  if (!currentDeck || !stats) {
    return null;
  }

  // Get max count for scaling
  const maxCount = Math.max(...Object.values(stats.manaCurve), 1);

  // CMC labels
  const cmcLabels = ['0', '1', '2', '3', '4', '5', '6', '7+'];

  return (
    <CardFrame className="w-full">
      <CardHeader>
        <h3 className="text-sm font-display text-mtg-text">Mana Curve</h3>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-2 h-32">
          {cmcLabels.map((label, index) => {
            const cmc = index;
            const count = stats.manaCurve[cmc] || 0;
            const height = maxCount > 0 ? (count / maxCount) * 100 : 0;

            return (
              <div key={cmc} className="flex-1 flex flex-col items-center gap-1">
                {/* Count */}
                <span className="text-xs text-mtg-textMuted">{count || ''}</span>

                {/* Bar */}
                <div className="w-full flex-1 flex items-end">
                  <div
                    className={clsx(
                      'w-full rounded-t transition-all duration-500',
                      'bg-gradient-to-t from-mtg-gold to-mtg-goldLight',
                      count > 0 && 'shadow-glow-gold/30'
                    )}
                    style={{ height: `${height}%`, minHeight: count > 0 ? '4px' : '0' }}
                  />
                </div>

                {/* CMC label */}
                <span className="text-xs text-mtg-textDark">{label}</span>
              </div>
            );
          })}
        </div>

        {/* Summary stats */}
        <div className="mt-4 pt-4 border-t border-mtg-border/30 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-display text-mtg-text">
              {stats.averageCmc.toFixed(2)}
            </p>
            <p className="text-xs text-mtg-textMuted">Avg CMC</p>
          </div>
          <div>
            <p className="text-lg font-display text-mtg-text">{stats.landCount}</p>
            <p className="text-xs text-mtg-textMuted">Lands</p>
          </div>
          <div>
            <p className="text-lg font-display text-mtg-text">{stats.nonlandCount}</p>
            <p className="text-xs text-mtg-textMuted">Non-lands</p>
          </div>
        </div>
      </CardContent>
    </CardFrame>
  );
}

export function DeckStats() {
  const { currentDeck } = useDeckStore();

  const stats = useMemo(() => {
    if (!currentDeck) return null;
    return calculateDeckStats(currentDeck);
  }, [currentDeck]);

  if (!currentDeck || !stats) {
    return null;
  }

  const categories = [
    { label: 'Ramp', count: stats.rampCount, recommended: '10-12', status: getStatus(stats.rampCount, 10, 12) },
    { label: 'Card Draw', count: stats.drawCount, recommended: '10-12', status: getStatus(stats.drawCount, 10, 12) },
    { label: 'Removal', count: stats.removalCount, recommended: '8-12', status: getStatus(stats.removalCount, 8, 12) },
    { label: 'Lands', count: stats.landCount, recommended: '33-38', status: getStatus(stats.landCount, 33, 38) },
    { label: 'Creatures', count: stats.creatureCount, recommended: '20-35', status: getStatus(stats.creatureCount, 20, 35) },
  ];

  return (
    <CardFrame className="w-full">
      <CardHeader>
        <h3 className="text-sm font-display text-mtg-text">Deck Statistics</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.label} className="flex items-center justify-between">
              <span className="text-sm text-mtg-text">{cat.label}</span>
              <div className="flex items-center gap-2">
                <span
                  className={clsx(
                    'text-sm font-medium',
                    cat.status === 'low' && 'text-red-400',
                    cat.status === 'optimal' && 'text-green-400',
                    cat.status === 'high' && 'text-yellow-400'
                  )}
                >
                  {cat.count}
                </span>
                <span className="text-xs text-mtg-textDark">({cat.recommended})</span>
              </div>
            </div>
          ))}
        </div>

        {/* Color distribution */}
        <div className="mt-4 pt-4 border-t border-mtg-border/30">
          <p className="text-xs text-mtg-textMuted mb-2">Color Distribution</p>
          <div className="flex gap-1">
            {Object.entries(stats.colorDistribution)
              .filter(([color, count]) => count > 0 && color !== 'colorless')
              .map(([color, count]) => {
                const total = Object.values(stats.colorDistribution).reduce((a, b) => a + b, 0) || 1;
                const percentage = (count / total) * 100;

                const colorMap: Record<string, string> = {
                  W: 'bg-mana-white',
                  U: 'bg-mana-blue',
                  B: 'bg-mana-black border border-gray-600',
                  R: 'bg-mana-red',
                  G: 'bg-mana-green',
                  C: 'bg-mana-colorless',
                };

                return (
                  <div
                    key={color}
                    className={clsx('h-2 rounded-full', colorMap[color])}
                    style={{ width: `${percentage}%`, minWidth: '8px' }}
                    title={`${color}: ${count} (${percentage.toFixed(0)}%)`}
                  />
                );
              })}
          </div>
        </div>
      </CardContent>
    </CardFrame>
  );
}

function getStatus(count: number, min: number, max: number): 'low' | 'optimal' | 'high' {
  if (count < min) return 'low';
  if (count > max) return 'high';
  return 'optimal';
}
