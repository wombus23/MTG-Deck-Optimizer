import { NextRequest, NextResponse } from 'next/server';
import { fetchArchidektDeckDirect } from '@/lib/importers/archidekt';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const deckId = searchParams.get('id');

  if (!deckId) {
    return NextResponse.json(
      { error: 'Missing deck ID parameter' },
      { status: 400 }
    );
  }

  try {
    const deckData = await fetchArchidektDeckDirect(deckId);
    return NextResponse.json(deckData);
  } catch (error) {
    console.error('Archidekt API error:', error);

    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Deck not found. Make sure the deck is public.' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch deck from Archidekt' },
      { status: 500 }
    );
  }
}
