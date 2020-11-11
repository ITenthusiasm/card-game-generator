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
    this.#host = this.#players[0]?.id;
  }

  /** Instantiates a game for the lobby based on the game name. */
  selectGame(gameName: string): void {
    const chosenGame = this.#games.find(g => g === gameName);
    if (chosenGame && !(this.#game instanceof Games[chosenGame]))
      this.#game = new Games[chosenGame](this.#players);
  }

  /** Adds a new player to the lobby. Updates the host if necessary. */
  addNewPlayer(name: string): Player {
    const player = new Player({ name });
    this.#players.push(player);
    if (!this.#host) this.#host = player.id;

    return player;
  }

  /** Adds a player back into the lobby. */
  addPlayer(player: Player): void {
    if (!player.id || !player.name) return;

    this.#players.push(player);
  }

  /** Removes a player from the lobby. Updates the host if necessary. */
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
    return this.#games.slice();
  }

  get game(): Game {
    return this.#game;
  }
}

export default Lobby;
