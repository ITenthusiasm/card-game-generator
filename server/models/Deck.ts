import { DeckTypes } from "./enums";
import type { CardType, CardValue } from "./enums/types";
import { Card } from ".";
import {
  ClassicManifest,
  UnoManifest,
  createCodenamesManifest,
} from "./DeckManifests";

class Deck {
  private _type: DeckTypes;
  private _cards: Card[];
  private _manifest: Map<CardType, CardValue[]>;

  constructor(type: DeckTypes) {
    this._type = type;
    this._cards = [];

    // Initialize Deck based on manifest.
    switch (this._type) {
      case DeckTypes.Classic:
        this._manifest = ClassicManifest;
        break;
      case DeckTypes.Uno:
        this._manifest = UnoManifest;
        break;
      case DeckTypes.Codenames:
        this._manifest = createCodenamesManifest();
        break;
      default:
        throw new Error(`Unsupported Deck Type: ${type}`);
    }

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

  get cards(): Card[] {
    return this._cards;
  }

  get size(): number {
    return this._cards.length;
  }

  draw(cardNumber = 0): Card[] {
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
const showClassic = false;

const unoDeck = new Deck(DeckTypes.Uno);
const showUno = false;

const codenamesDeck = new Deck(DeckTypes.Codenames);
const showCodenames = true;

classicDeck.shuffle();
unoDeck.shuffle();
codenamesDeck.shuffle();

if (showClassic) {
  console.log(classicDeck.cards);
  console.log(classicDeck.size);
}

if (showUno) {
  console.log(unoDeck.cards);
  console.log(unoDeck.size);
}

if (showCodenames) {
  console.log(codenamesDeck.cards);
  console.log(codenamesDeck.size);
}

export default Deck;
