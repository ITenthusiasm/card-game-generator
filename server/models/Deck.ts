import { Card } from ".";

class Deck {
  #cards: Card[];

  constructor(cards: Card[]) {
    this.#cards = cards;
  }

  get cards(): Card[] {
    return this.#cards.slice();
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
