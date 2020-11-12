import { Deck, Player } from "../models";
import { GameStatus } from "../models/enums";
import { Action } from "../models/enums/types";

type GameState = { status: GameStatus };

/** Class representing a card game. */
abstract class Game {
  /** The deck of cards that the game holds. */
  protected _deck: Deck;

  /** The players in the game. */
  protected _players: Player[];

  /** The current state of the game. */
  protected _state: GameState;

  /**
   * Create a card game.
   * @param players - The players in the game.
   */
  constructor(players: Player[]) {
    this._players = players;
  }

  /**
   * Starts the game.
   * @returns The initial state of the game.
   */
  abstract start(): GameState;

  /**
   * Handles an action from the player to determine how the game should progress.
   * @param player - The player committing the action.
   * @param action - The action the player committed.
   * @param item - The item the player used to commit the action (a card, a code, etc.).
   * @returns The new game state resulting from the action the player committed.
   */
  abstract handleAction(player: Player, action: Action, item: unknown): GameState;

  /** Ends the game. */
  abstract end(): GameState;

  /** Resets the game, creating a new deck and clearing any relevant data. */
  abstract reset(): GameState;
}

export default Game;
