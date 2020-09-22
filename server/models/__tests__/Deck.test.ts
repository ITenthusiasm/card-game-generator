import { Deck } from "..";
import { DeckTypes, CardTypes } from "../enums";

describe("Deck", () => {
  test("Constructor rejects invalid deck types", () => {
    expect(
      () => new Deck("InvalidType" as any)
    ).toThrowErrorMatchingInlineSnapshot(
      `"Unsupported Deck Type: InvalidType"`
    );
  });

  test("Constructor creates a deck with the specified card type", () => {
    const classicCards = new Deck(DeckTypes.CLASSIC).cards;
    const classicCardTypes = Object.values(CardTypes.Classic);
    classicCards.forEach(c => expect(classicCardTypes).toContain(c.type));

    const unoCards = new Deck(DeckTypes.UNO).cards;
    const unoCardTypes = Object.values(CardTypes.Uno);
    unoCards.forEach(c => expect(unoCardTypes).toContain(c.type));

    const codenamesCards = new Deck(DeckTypes.CODENAMES).cards;
    const codenamesCardtypes = Object.values(CardTypes.Codenames);
    codenamesCards.forEach(c => expect(codenamesCardtypes).toContain(c.type));
  });

  test("Draw removes the number of specified cards from the top of the deck", () => {
    const deck = new Deck(DeckTypes.CLASSIC);
    const originalCards = deck.cards.slice();

    const drawnCard = deck.draw(); // defaults to 1
    expect(deck.size).toBe(originalCards.length - 1);
    expect(drawnCard).toEqual(originalCards.slice(0, 1));

    const drawnCards = deck.draw(5);
    expect(deck.size).toBe(originalCards.length - 6);
    expect(drawnCards).toEqual(originalCards.slice(1, 6));
  });

  test("Shuffle randomly reorganizes the deck", () => {
    const deck = new Deck(DeckTypes.CLASSIC);
    const originalCards = deck.cards.slice();

    deck.shuffle();
    const shuffledCards = deck.cards.slice();

    // May randomly fail if the cards shuffled into the original static order (rare)
    expect(originalCards).not.toEqual(shuffledCards);
  });
});
