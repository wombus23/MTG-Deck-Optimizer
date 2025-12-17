'use client';

import { ReactNode, useState } from 'react';
import { clsx } from 'clsx';

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrows = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-mtg-card border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-mtg-card border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-mtg-card border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-mtg-card border-y-transparent border-l-transparent',
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={clsx(
            'absolute z-50 px-3 py-2 text-sm',
            'bg-mtg-card border border-mtg-border rounded-lg',
            'text-mtg-text shadow-lg',
            'whitespace-nowrap animate-fade-in',
            positions[position]
          )}
        >
          {content}
          <div
            className={clsx(
              'absolute w-0 h-0 border-[6px]',
              arrows[position]
            )}
          />
        </div>
      )}
    </div>
  );
}

export interface InfoTooltipProps {
  content: ReactNode;
  className?: string;
}

export function InfoTooltip({ content, className }: InfoTooltipProps) {
  return (
    <Tooltip content={content}>
      <span
        className={clsx(
          'inline-flex items-center justify-center',
          'w-4 h-4 text-xs rounded-full',
          'bg-mtg-border/50 text-mtg-textMuted',
          'hover:bg-mtg-gold/20 hover:text-mtg-gold',
          'cursor-help transition-colors',
          className
        )}
      >
        ?
      </span>
    </Tooltip>
  );
}
