'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/deck', label: 'Import Deck' },
    { href: '/optimize', label: 'Optimize' },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-mtg-border/50 bg-mtg-darker/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              {/* Planeswalker-inspired logo */}
              <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center shadow-glow-gold group-hover:shadow-lg transition-shadow">
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-mtg-dark"
                  fill="currentColor"
                >
                  <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5L19.5 8v7L12 18.5 4.5 15V8L12 4.5z" />
                  <circle cx="12" cy="11" r="3" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-lg font-display font-semibold text-mtg-text tracking-wide">
                MTG Optimizer
              </h1>
              <p className="text-xs text-mtg-textMuted -mt-0.5">Commander Deck Analysis</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-mtg-gold/10 text-mtg-gold'
                      : 'text-mtg-textMuted hover:text-mtg-text hover:bg-mtg-card/50'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-mtg-textMuted hover:text-mtg-text">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-mtg-gold/30 to-transparent" />
    </header>
  );
}
