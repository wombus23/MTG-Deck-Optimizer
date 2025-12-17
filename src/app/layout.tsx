import type { Metadata } from 'next';
import { Header, Footer } from '@/components/layout';
import './globals.css';

export const metadata: Metadata = {
  title: 'MTG Deck Optimizer | Commander Deck Analysis',
  description:
    'Optimize your Magic: The Gathering Commander decks with AI-powered analysis and suggestions based on meta performance, synergy, and mana efficiency.',
  keywords: [
    'MTG',
    'Magic The Gathering',
    'Commander',
    'EDH',
    'Deck Optimizer',
    'Deck Builder',
    'EDHREC',
  ],
  openGraph: {
    title: 'MTG Deck Optimizer',
    description: 'Optimize your Commander decks with intelligent suggestions',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
