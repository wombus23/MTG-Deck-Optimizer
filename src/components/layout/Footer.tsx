'use client';

export function Footer() {
  return (
    <footer className="border-t border-mtg-border/30 bg-mtg-darker/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Disclaimer */}
          <div className="text-center md:text-left">
            <p className="text-sm text-mtg-textMuted">
              MTG Optimizer is unofficial fan content.
            </p>
            <p className="text-xs text-mtg-textDark mt-1">
              Card data provided by{' '}
              <a
                href="https://scryfall.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-mtg-gold/70 hover:text-mtg-gold transition-colors"
              >
                Scryfall
              </a>
              . Magic: The Gathering is a trademark of Wizards of the Coast.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-mtg-textMuted">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-mtg-text transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://scryfall.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-mtg-text transition-colors"
            >
              Scryfall
            </a>
            <a
              href="https://edhrec.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-mtg-text transition-colors"
            >
              EDHREC
            </a>
          </div>
        </div>

        {/* Bottom text */}
        <div className="mt-6 pt-6 border-t border-mtg-border/20 text-center">
          <p className="text-xs text-mtg-textDark">
            Built with Next.js. Not affiliated with Wizards of the Coast.
          </p>
        </div>
      </div>
    </footer>
  );
}
