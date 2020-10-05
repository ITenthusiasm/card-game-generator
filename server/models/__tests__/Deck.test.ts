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

  test("Draw removes the number of specified cards from the top of the deck", () => {
    const deck = new Deck(testCards);
    const originalCards = deck.cards.slice();

    const drawnCard = deck.draw(); // defaults to 1
    expect(deck.size).toBe(originalCards.length - 1);
    expect(drawnCard).toEqual(originalCards.slice(0, 1));

    const drawnCards = deck.draw(5);
    expect(deck.size).toBe(originalCards.length - 6);
    expect(drawnCards).toEqual(originalCards.slice(1, 6));
  });

  test("Shuffle randomly reorganizes the deck", () => {
    const deck = new Deck(testCards);
    const originalCards = deck.cards.slice();

    deck.shuffle();
    const shuffledCards = deck.cards.slice();

    // May randomly fail if the cards shuffled into the original static order (rare)
    expect(originalCards).not.toEqual(shuffledCards);
  });
});
