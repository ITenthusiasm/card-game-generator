import { Card, Deck } from "..";
import { buildCard } from "../../../test-utils/mock-data/mockBuilders";

describe("Deck", () => {
  let testCards: Card[];

  beforeEach(() => {
    testCards = [...Array(20)].map(buildCard);
  });

  test("Constructor creates a deck with the specified cards", () => {
    const deck = new Deck(testCards);
    expect(deck.cards).toStrictEqual(testCards);
  });

  test("The deck's cards cannot be directly mutated", () => {
    const deck = new Deck(testCards);

    deck.cards.splice(0, deck.cards.length);
    expect(deck.cards).toStrictEqual(testCards);
  });

  test("Draw removes the number of specified cards from the top of the deck", () => {
    const deck = new Deck(testCards);
    const originalCards = deck.cards;

    const drawnCard = deck.draw(); // defaults to 1
    expect(deck.size).toBe(originalCards.length - 1);
    expect(drawnCard).toStrictEqual(originalCards.slice(0, 1));

    const drawnCards = deck.draw(5);
    expect(deck.size).toBe(originalCards.length - 6);
    expect(drawnCards).toStrictEqual(originalCards.slice(1, 6));
  });

  test("Shuffle randomly reorganizes the deck", () => {
    const deck = new Deck(testCards);
    const originalCards = deck.cards;

    deck.shuffle();
    const shuffledCards = deck.cards;

    // May randomly fail if the cards shuffled into the original static order (rare)
    expect(originalCards).not.toEqual(shuffledCards);
  });
});
