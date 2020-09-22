import { DeckTypes } from "./enums";
import { Card } from ".";
import type { DeckManifest } from "./DeckManifests";
import {
  ClassicManifest,
  UnoManifest,
  createCodenamesManifest,
} from "./DeckManifests";

class Deck {
  #type: DeckTypes;
  #cards: Card[];
  #manifest: DeckManifest;

  constructor(type: DeckTypes) {
    this.#type = type;
    this.#cards = [];

    // Initialize Deck based on manifest.
    switch (this.#type) {
      case DeckTypes.CLASSIC:
        this.#manifest = ClassicManifest;
        break;
      case DeckTypes.UNO:
        this.#manifest = UnoManifest;
        break;
      case DeckTypes.CODENAMES:
        this.#manifest = createCodenamesManifest();
        break;
      default:
        throw new Error(`Unsupported Deck Type: ${type}`);
    }

    this.initializeDeck();
  }

  private initializeDeck(): void {
    this.#manifest.forEach((values, cardType) => {
      values.forEach(v => this.#cards.push(new Card(cardType, v)));
    });
  }

  get cards(): Card[] {
    return this.#cards;
  }

  get size(): number {
    return this.#cards.length;
  }

  draw(cardNumber = 1): Card[] {
    return this.#cards.splice(0, cardNumber);
  }

  shuffle(): void {
    // Modern Fisher-Yates shuffle algorithm
    for (let i = this.#cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.#cards[i], this.#cards[j]] = [this.#cards[j], this.#cards[i]];
    }
  }
}

export default Deck;
