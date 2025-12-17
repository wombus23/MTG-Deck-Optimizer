'use client';

import { clsx } from 'clsx';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <svg
      className={clsx('animate-spin text-mtg-gold', sizes[size], className)}
      xmlns="http://www.w3.org/2000/svg"
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
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-mtg-dark/80 backdrop-blur-sm">
      <div className="text-center">
        <div className="relative">
          {/* Mana symbol animation */}
          <div className="w-20 h-20 rounded-full bg-gradient-gold flex items-center justify-center shadow-glow-gold animate-pulse">
            <svg
              viewBox="0 0 24 24"
              className="w-10 h-10 text-mtg-dark animate-spin"
              fill="currentColor"
            >
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5L19.5 8v7L12 18.5 4.5 15V8L12 4.5z" />
            </svg>
          </div>
        </div>
        <p className="mt-4 text-mtg-text font-display">{message}</p>
      </div>
    </div>
  );
}

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'circle';
}

export function Skeleton({ className, variant = 'text' }: SkeletonProps) {
  const variants = {
    text: 'h-4 w-full rounded',
    card: 'h-32 w-full rounded-lg',
    circle: 'h-10 w-10 rounded-full',
  };

  return (
    <div
      className={clsx(
        'bg-mtg-card animate-pulse shimmer',
        variants[variant],
        className
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-4 rounded-lg border border-mtg-border bg-mtg-card/50">
      <div className="flex items-start gap-3">
        <Skeleton variant="circle" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-3/4" />
          <Skeleton className="w-1/2" />
        </div>
      </div>
    </div>
  );
}
