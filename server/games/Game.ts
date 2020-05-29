import { Deck, Player } from "../models";
import { DeckTypes } from "../models/enums";

abstract class Game {
  protected _deck: Deck;
  protected _players: Player[];

  /** The current state of the game */
  protected _state: { active: boolean };

  constructor(deckType: DeckTypes, players: Player[]) {
    this._players = players;
    this._deck = new Deck(deckType);
  }

  abstract start(): void;
  abstract end(): void;
}

export default Game;
