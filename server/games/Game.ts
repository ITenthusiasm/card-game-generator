import { Deck, Player } from "../models";
import { DeckTypes, GameStatus } from "../models/enums";
import { Action } from "../models/enums/types";

/** Class representing a card game. */
abstract class Game {
  /** The deck of cards that the game holds. */
  protected _deck: Deck;

  /** The players in the game. */
  protected _players: Player[];

  /** The current state of the game. */
  protected _state: { status: GameStatus };

  /**
   * Create a card game.
   * @param deckType - The type of deck for the game.
   * @param players - The players in the game.
   */
  constructor(deckType: DeckTypes, players: Player[]) {
    this._players = players;
    this._deck = new Deck(deckType);
  }

  /**
   * Starts the game.
   * @return {object} The initial state of the game.
   */
  abstract start(): object;

  /**
   * Handles an action from the player to determine how the game should progress.
   * @param player - The player committing the action.
   * @param action - The action the player committed.
   * @param item - The item the player used to commit the action (a card, a code, etc.).
   * @return {object} The new state resulting from the action the player committed.
   */
  abstract handleAction(player: Player, action: Action, item: object): object;

  /** Ends the game. */
  abstract end(): object;

  /** Resets the game, creating a new deck and clearing any relevant data. */
  abstract reset(): object;
}

export default Game;
