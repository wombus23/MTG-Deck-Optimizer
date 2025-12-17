'use client';

import { ReactNode } from 'react';
import { clsx } from 'clsx';

export interface CardFrameProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'gold' | 'mythic' | 'rare' | 'uncommon';
  hover?: boolean;
  onClick?: () => void;
}

export function CardFrame({
  children,
  className,
  variant = 'default',
  hover = false,
  onClick,
}: CardFrameProps) {
  const variants = {
    default: 'border-mtg-border',
    gold: 'border-mtg-gold shadow-glow-gold',
    mythic: 'border-mtg-mythic shadow-glow-mythic',
    rare: 'border-mtg-rare',
    uncommon: 'border-mtg-uncommon',
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'relative rounded-lg overflow-hidden',
        'bg-gradient-card border-2',
        'shadow-card',
        variants[variant],
        hover && 'cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* Inner highlight */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 via-transparent to-black/10" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div
      className={clsx(
        'px-4 py-3 border-b border-mtg-border/50',
        'bg-gradient-to-r from-mtg-cardLight/50 via-mtg-card to-mtg-cardLight/50',
        className
      )}
    >
      {children}
    </div>
  );
}

export interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={clsx('p-4', className)}>{children}</div>;
}

export interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div
      className={clsx(
        'px-4 py-3 border-t border-mtg-border/50',
        'bg-mtg-darker/50',
        className
      )}
    >
      {children}
    </div>
  );
}

// MTG Card Display Component
export interface MtgCardProps {
  name: string;
  imageUrl?: string;
  manaCost?: string;
  typeLine?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'mythic';
  showHover?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function MtgCard({
  name,
  imageUrl,
  manaCost,
  typeLine,
  rarity = 'common',
  showHover = true,
  size = 'md',
  onClick,
}: MtgCardProps) {
  const sizes = {
    sm: 'w-32',
    md: 'w-48',
    lg: 'w-64',
  };

  const rarityColors = {
    common: 'ring-mtg-common',
    uncommon: 'ring-mtg-uncommon',
    rare: 'ring-mtg-rare',
    mythic: 'ring-mtg-mythic',
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        sizes[size],
        'relative rounded-lg overflow-hidden',
        'ring-2',
        rarityColors[rarity],
        showHover && 'card-hover-lift cursor-pointer',
        onClick && 'cursor-pointer'
      )}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-auto"
          loading="lazy"
        />
      ) : (
        <div className="aspect-[5/7] bg-mtg-card flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-mtg-text font-display text-sm">{name}</p>
            {typeLine && (
              <p className="text-mtg-textMuted text-xs mt-1">{typeLine}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
