'use client';

import Link from 'next/link';
import { Button, CardFrame, CardContent, ColorIdentity } from '@/components/ui';
import { useDeckStore } from '@/store/deckStore';
import { ManaColor } from '@/types';

export default function HomePage() {
  const { savedDecks } = useDeckStore();

  return (
    <div className="relative">
      {/* Hero section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-mtg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-mana-blue/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mtg-card border border-mtg-border mb-6">
              <span className="w-2 h-2 rounded-full bg-mtg-gold animate-pulse" />
              <span className="text-xs text-mtg-textMuted">
                Commander / EDH Format
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-mtg-text mb-6">
              Optimize Your{' '}
              <span className="gradient-text-gold">Commander</span> Deck
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-mtg-textMuted mb-8 max-w-2xl mx-auto">
              Import your deck from Moxfield or Archidekt, and get intelligent
              suggestions to improve card choices based on meta performance,
              synergy, and mana efficiency.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/deck">
                <Button size="lg">
                  Import Deck
                  <svg
                    className="w-5 h-5 ml-2"
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
                </Button>
              </Link>
              <Link href="/optimize">
                <Button variant="secondary" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Mana symbols decoration */}
          <div className="flex justify-center gap-4 mt-12">
            {(['W', 'U', 'B', 'R', 'G'] as ManaColor[]).map((color, i) => (
              <div
                key={color}
                className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-lg animate-float"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  backgroundColor: `var(--mana-${color.toLowerCase() === 'w' ? 'white' : color.toLowerCase() === 'u' ? 'blue' : color.toLowerCase() === 'b' ? 'black' : color.toLowerCase() === 'r' ? 'red' : 'green'})`,
                  color: color === 'W' || color === 'B' ? '#333' : '#fff',
                }}
              >
                {color}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20 border-t border-mtg-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-display text-center text-mtg-text mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Import */}
            <FeatureCard
              icon={
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              }
              title="1. Import Your Deck"
              description="Paste a Moxfield or Archidekt URL, or enter your deck list manually. We'll fetch all the card data automatically."
            />

            {/* Analyze */}
            <FeatureCard
              icon={
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              }
              title="2. Analyze & Score"
              description="Our engine categorizes your cards, detects synergies, and scores each card based on meta performance and deck fit."
            />

            {/* Optimize */}
            <FeatureCard
              icon={
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              }
              title="3. Get Suggestions"
              description="Receive prioritized card swap suggestions with detailed reasoning about why each change improves your deck."
            />
          </div>
        </div>
      </section>

      {/* Saved decks section */}
      {savedDecks.length > 0 && (
        <section className="py-20 border-t border-mtg-border/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display text-mtg-text">
                Your Saved Decks
              </h2>
              <Link
                href="/deck"
                className="text-sm text-mtg-gold hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedDecks.slice(0, 3).map((deck) => (
                <Link key={deck.id} href={`/deck?id=${deck.id}`}>
                  <CardFrame hover className="h-full">
                    <CardContent>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-display text-mtg-text">
                            {deck.name}
                          </h3>
                          <p className="text-sm text-mtg-textMuted mt-1">
                            {deck.cards.length} cards
                          </p>
                        </div>
                        <ColorIdentity
                          colors={deck.colorIdentity}
                          size="sm"
                        />
                      </div>
                      {deck.commander && (
                        <p className="text-xs text-mtg-textDark mt-2 truncate">
                          Commander: {deck.commander.name}
                        </p>
                      )}
                    </CardContent>
                  </CardFrame>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats section */}
      <section className="py-20 border-t border-mtg-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatItem value="20,000+" label="Cards in Database" />
            <StatItem value="100+" label="Format Staples" />
            <StatItem value="12" label="Archetypes Detected" />
            <StatItem value="Free" label="Always" />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <CardFrame className="h-full">
      <CardContent className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-mtg-gold/10 flex items-center justify-center text-mtg-gold">
          {icon}
        </div>
        <h3 className="text-lg font-display text-mtg-text mb-2">{title}</h3>
        <p className="text-sm text-mtg-textMuted">{description}</p>
      </CardContent>
    </CardFrame>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-3xl font-display text-mtg-gold">{value}</p>
      <p className="text-sm text-mtg-textMuted mt-1">{label}</p>
    </div>
  );
}
