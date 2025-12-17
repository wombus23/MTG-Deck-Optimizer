'use client';

import { clsx } from 'clsx';
import { ManaColor } from '@/types';

export interface ManaSymbolProps {
  symbol: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const colorMap: Record<string, { bg: string; text: string; glow?: string }> = {
  W: { bg: 'bg-mana-white', text: 'text-gray-800', glow: 'shadow-glow-white' },
  U: { bg: 'bg-mana-blue', text: 'text-white', glow: 'shadow-glow-blue' },
  B: { bg: 'bg-mana-black', text: 'text-gray-300', glow: 'shadow-glow-black' },
  R: { bg: 'bg-mana-red', text: 'text-white', glow: 'shadow-glow-red' },
  G: { bg: 'bg-mana-green', text: 'text-white', glow: 'shadow-glow-green' },
  C: { bg: 'bg-mana-colorless', text: 'text-gray-800' },
  X: { bg: 'bg-gray-400', text: 'text-gray-800' },
};

const sizeMap = {
  xs: 'w-4 h-4 text-[10px]',
  sm: 'w-5 h-5 text-xs',
  md: 'w-6 h-6 text-sm',
  lg: 'w-8 h-8 text-base',
};

export function ManaSymbol({ symbol, size = 'sm', className }: ManaSymbolProps) {
  const cleanSymbol = symbol.replace(/[{}]/g, '').toUpperCase();

  // Check if it's a number
  if (/^\d+$/.test(cleanSymbol)) {
    return (
      <span
        className={clsx(
          'inline-flex items-center justify-center rounded-full font-bold',
          'bg-gray-400 text-gray-800',
          'shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)]',
          sizeMap[size],
          className
        )}
      >
        {cleanSymbol}
      </span>
    );
  }

  // Check for hybrid mana (e.g., W/U)
  if (cleanSymbol.includes('/')) {
    const [color1, color2] = cleanSymbol.split('/');
    const c1 = colorMap[color1] || colorMap.C;
    const c2 = colorMap[color2] || colorMap.C;

    return (
      <span
        className={clsx(
          'inline-flex items-center justify-center rounded-full font-bold overflow-hidden',
          'shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)]',
          sizeMap[size],
          className
        )}
        style={{
          background: `linear-gradient(135deg, var(--mana-${color1.toLowerCase()}) 50%, var(--mana-${color2.toLowerCase()}) 50%)`,
        }}
      >
        <span className="sr-only">{cleanSymbol}</span>
      </span>
    );
  }

  // Check for Phyrexian mana (e.g., P/W)
  if (cleanSymbol.startsWith('P') || cleanSymbol.includes('P')) {
    const baseColor = cleanSymbol.replace('P', '').replace('/', '');
    const colorStyle = colorMap[baseColor] || colorMap.C;

    return (
      <span
        className={clsx(
          'inline-flex items-center justify-center rounded-full font-bold',
          colorStyle.bg,
          colorStyle.text,
          'shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)]',
          sizeMap[size],
          className
        )}
      >
        <span className="relative">
          {baseColor || 'P'}
          <span className="absolute inset-0 flex items-center justify-center text-[0.6em] opacity-60">
            /
          </span>
        </span>
      </span>
    );
  }

  // Standard mana symbol
  const colorStyle = colorMap[cleanSymbol] || colorMap.C;

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center rounded-full font-bold',
        colorStyle.bg,
        colorStyle.text,
        'shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)]',
        sizeMap[size],
        className
      )}
    >
      {cleanSymbol}
    </span>
  );
}

export interface ManaCostProps {
  cost: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function ManaCost({ cost, size = 'sm', className }: ManaCostProps) {
  if (!cost) return null;

  const symbols = cost.match(/\{[^}]+\}/g) || [];

  return (
    <div className={clsx('inline-flex items-center gap-0.5', className)}>
      {symbols.map((symbol, index) => (
        <ManaSymbol key={index} symbol={symbol} size={size} />
      ))}
    </div>
  );
}

export interface ColorIdentityProps {
  colors: ManaColor[];
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function ColorIdentity({ colors, size = 'sm', className }: ColorIdentityProps) {
  if (!colors || colors.length === 0) {
    return <ManaSymbol symbol="C" size={size} className={className} />;
  }

  // Sort colors in WUBRG order
  const colorOrder: ManaColor[] = ['W', 'U', 'B', 'R', 'G', 'C'];
  const sortedColors = [...colors].sort(
    (a, b) => colorOrder.indexOf(a) - colorOrder.indexOf(b)
  );

  return (
    <div className={clsx('inline-flex items-center gap-0.5', className)}>
      {sortedColors.map((color) => (
        <ManaSymbol key={color} symbol={color} size={size} />
      ))}
    </div>
  );
}
