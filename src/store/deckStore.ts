import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Deck,
  DeckCard,
  Card,
  ManaColor,
  OptimizationResult,
  createEmptyDeck,
} from '@/types';
import { categorizeDeck } from '@/lib/optimizer/categories';

interface DeckState {
  // Current deck being edited
  currentDeck: Deck | null;

  // All saved decks
  savedDecks: Deck[];

  // Optimization results
  optimizationResult: OptimizationResult | null;

  // Loading states
  isLoading: boolean;
  isOptimizing: boolean;

  // Error state
  error: string | null;

  // Actions
  setCurrentDeck: (deck: Deck | null) => void;
  createNewDeck: () => void;
  updateDeckName: (name: string) => void;
  setCommander: (card: Card) => void;
  addCard: (card: Card, quantity?: number) => void;
  removeCard: (cardId: string) => void;
  updateCardQuantity: (cardId: string, quantity: number) => void;
  setCards: (cards: DeckCard[]) => void;
  saveDeck: () => void;
  loadDeck: (deckId: string) => void;
  deleteDeck: (deckId: string) => void;
  setOptimizationResult: (result: OptimizationResult | null) => void;
  applyReplacement: (currentCardId: string, newCard: Card) => void;
  setLoading: (loading: boolean) => void;
  setOptimizing: (optimizing: boolean) => void;
  setError: (error: string | null) => void;
  clearCurrentDeck: () => void;
}

export const useDeckStore = create<DeckState>()(
  persist(
    (set, get) => ({
      currentDeck: null,
      savedDecks: [],
      optimizationResult: null,
      isLoading: false,
      isOptimizing: false,
      error: null,

      setCurrentDeck: (deck) => set({ currentDeck: deck, optimizationResult: null }),

      createNewDeck: () => {
        const newDeck = createEmptyDeck();
        set({ currentDeck: newDeck, optimizationResult: null, error: null });
      },

      updateDeckName: (name) => {
        const { currentDeck } = get();
        if (!currentDeck) return;

        set({
          currentDeck: { ...currentDeck, name, updatedAt: new Date() },
        });
      },

      setCommander: (card) => {
        const { currentDeck } = get();
        if (!currentDeck) return;

        // Remove existing commander if any
        const cardsWithoutCommander = currentDeck.cards.filter(
          (c) => !c.isCommander
        );

        // Add new commander
        const commanderCard: DeckCard = {
          card,
          quantity: 1,
          isCommander: true,
          category: 'commander',
        };

        // Update color identity
        const colorIdentity = card.color_identity as ManaColor[];

        set({
          currentDeck: {
            ...currentDeck,
            commander: card,
            colorIdentity,
            cards: [commanderCard, ...cardsWithoutCommander],
            updatedAt: new Date(),
          },
        });
      },

      addCard: (card, quantity = 1) => {
        const { currentDeck } = get();
        if (!currentDeck) return;

        // Check if card already exists
        const existingIndex = currentDeck.cards.findIndex(
          (c) => c.card.name.toLowerCase() === card.name.toLowerCase()
        );

        let newCards: DeckCard[];

        if (existingIndex >= 0) {
          // Update quantity of existing card
          newCards = [...currentDeck.cards];
          newCards[existingIndex] = {
            ...newCards[existingIndex],
            quantity: newCards[existingIndex].quantity + quantity,
          };
        } else {
          // Add new card
          const newCard: DeckCard = {
            card,
            quantity,
          };
          newCards = [...currentDeck.cards, newCard];
        }

        // Categorize cards
        const categorizedCards = categorizeDeck(newCards);

        set({
          currentDeck: {
            ...currentDeck,
            cards: categorizedCards,
            updatedAt: new Date(),
          },
        });
      },

      removeCard: (cardId) => {
        const { currentDeck } = get();
        if (!currentDeck) return;

        const newCards = currentDeck.cards.filter((c) => c.card.id !== cardId);

        // Update commander if it was removed
        const removedCard = currentDeck.cards.find((c) => c.card.id === cardId);
        const newCommander =
          removedCard?.isCommander ? undefined : currentDeck.commander;

        set({
          currentDeck: {
            ...currentDeck,
            cards: newCards,
            commander: newCommander,
            updatedAt: new Date(),
          },
        });
      },

      updateCardQuantity: (cardId, quantity) => {
        const { currentDeck } = get();
        if (!currentDeck) return;

        if (quantity <= 0) {
          get().removeCard(cardId);
          return;
        }

        const newCards = currentDeck.cards.map((c) =>
          c.card.id === cardId ? { ...c, quantity } : c
        );

        set({
          currentDeck: {
            ...currentDeck,
            cards: newCards,
            updatedAt: new Date(),
          },
        });
      },

      setCards: (cards) => {
        const { currentDeck } = get();
        if (!currentDeck) return;

        // Categorize cards
        const categorizedCards = categorizeDeck(cards);

        // Find commander
        const commander = categorizedCards.find((c) => c.isCommander)?.card;

        // Calculate color identity - from commander if available, otherwise from all cards
        let colorIdentity: ManaColor[] = [];

        if (commander && commander.color_identity) {
          colorIdentity = commander.color_identity as ManaColor[];
        } else {
          // Calculate from all cards in the deck
          const allColors = new Set<ManaColor>();
          categorizedCards.forEach((dc) => {
            if (dc.card.color_identity) {
              dc.card.color_identity.forEach((c) => allColors.add(c as ManaColor));
            }
          });
          colorIdentity = Array.from(allColors);
        }

        set({
          currentDeck: {
            ...currentDeck,
            cards: categorizedCards,
            commander,
            colorIdentity,
            updatedAt: new Date(),
          },
        });
      },

      saveDeck: () => {
        const { currentDeck, savedDecks } = get();
        if (!currentDeck) return;

        const existingIndex = savedDecks.findIndex(
          (d) => d.id === currentDeck.id
        );

        const updatedDeck = { ...currentDeck, updatedAt: new Date() };

        if (existingIndex >= 0) {
          const newDecks = [...savedDecks];
          newDecks[existingIndex] = updatedDeck;
          set({ savedDecks: newDecks, currentDeck: updatedDeck });
        } else {
          set({
            savedDecks: [...savedDecks, updatedDeck],
            currentDeck: updatedDeck,
          });
        }
      },

      loadDeck: (deckId) => {
        const { savedDecks } = get();
        const deck = savedDecks.find((d) => d.id === deckId);

        if (deck) {
          set({ currentDeck: deck, optimizationResult: null, error: null });
        }
      },

      deleteDeck: (deckId) => {
        const { savedDecks, currentDeck } = get();
        const newDecks = savedDecks.filter((d) => d.id !== deckId);

        set({
          savedDecks: newDecks,
          currentDeck: currentDeck?.id === deckId ? null : currentDeck,
        });
      },

      setOptimizationResult: (result) => set({ optimizationResult: result }),

      applyReplacement: (currentCardId, newCard) => {
        const { currentDeck } = get();
        if (!currentDeck) return;

        const newCards = currentDeck.cards.map((c) =>
          c.card.id === currentCardId
            ? { ...c, card: newCard }
            : c
        );

        const categorizedCards = categorizeDeck(newCards);

        set({
          currentDeck: {
            ...currentDeck,
            cards: categorizedCards,
            updatedAt: new Date(),
          },
        });
      },

      setLoading: (isLoading) => set({ isLoading }),

      setOptimizing: (isOptimizing) => set({ isOptimizing }),

      setError: (error) => set({ error }),

      clearCurrentDeck: () =>
        set({ currentDeck: null, optimizationResult: null, error: null }),
    }),
    {
      name: 'mtg-optimizer-storage',
      partialize: (state) => ({
        savedDecks: state.savedDecks,
      }),
    }
  )
);
