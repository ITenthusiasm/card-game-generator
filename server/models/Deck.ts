import { DeckTypes } from "./enums";
import type { CardType } from "./enums/types";
import { Card } from ".";
import { ClassicManifest } from "./DeckManifests";

class Deck {
  private _type: DeckTypes;
  private _cards: Array<Card>;
  private _manifest: Map<CardType, Array<any>>;

  constructor(type: DeckTypes) {
    this._type = type;
    this._cards = [];

    // Initialize Deck based on manifest.
    this._manifest = ClassicManifest;
    this.initializeDeck();
  }

  private initializeDeck(): void {
    this._manifest.forEach((values, cardType) => {
      values.forEach(v => this._cards.push(new Card(cardType, v)));
    });
  }

  get type(): DeckTypes {
    return this._type;
  }

  get cards(): Array<Card> {
    return this._cards;
  }

  draw(cardNumber = 0): Array<Card> {
    return this._cards.splice(0, cardNumber);
  }

  shuffle(): void {
    // Modern Fisher-Yates shuffle algorithm
    for (let i = this._cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this._cards[i], this._cards[j]] = [this._cards[j], this._cards[i]];
    }
  }
}

const classicDeck = new Deck(DeckTypes.Classic);

classicDeck.shuffle();
console.log(classicDeck.cards);

export default Deck;
