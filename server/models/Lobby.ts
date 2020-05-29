import Player from "./Player";
import Game from "../games/Game";
import * as Games from "../games";

class Lobby {
  /** Players in the lobby */
  #players: Player[];

  /** Host of the lobby, denoted by a player ID */
  #host: string;

  /** The names of the games available for selection */
  #games: string[];

  /** The current game selected for the lobby */
  #game: Game;

  constructor(players?: Player[]) {
    this.#games = Object.values(Games).map(g => g.name);
    this.#players = players || [];
  }

  selectGame(game: string): void {
    const chosenGame = this.#games.find(g => g === game);
    if (chosenGame) this.#game = new Games[chosenGame](this.#players);
  }

  /** Add a new player to the lobby */
  addPlayer(player: Player): void {
    this.#players.push(Object.assign(player));
    if (!this.#host) this.#host = player.id;
  }

  /** Remove a player from the lobby. Updates the host of necessary. */
  removePlayer(playerId: string): void {
    const playerIndex = this.#players.findIndex(p => p.id === playerId);
    this.#players.splice(playerIndex, 1);

    if (this.#host === playerId) this.#host = this.#players[0].id;
  }

  get players(): Player[] {
    return this.#players;
  }

  get host(): string {
    return this.#host;
  }

  get games(): string[] {
    return this.#games;
  }

  get game(): Game {
    return this.#game;
  }
}

export default Lobby;
