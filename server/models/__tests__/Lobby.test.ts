import { Lobby, Player } from "..";
import * as Games from "../../games";
import { buildPlayer } from "../../../test-utils/mock-data/mockBuilders";

describe("Lobby", () => {
  test("All lobbies are instantiated with the available game names", () => {
    const lobby = new Lobby();
    expect(lobby.games).toStrictEqual(Object.values(Games).map(g => g.name));
  });

  test("Lobbies instantiated with players set the existing players and make player 1 the host", () => {
    const players = [...Array(3)].map(buildPlayer);
    const lobby = new Lobby(players);

    lobby.players.forEach((p, i) => expect(p).toStrictEqual(players[i]));
    expect(lobby.host).toEqual(players[0].id);
  });

  test("The lobby's available games cannot be directly manipulated", () => {
    const lobby = new Lobby();

    lobby.games.splice(0, lobby.games.length);
    expect(lobby.games).toStrictEqual(Object.values(Games).map(g => g.name));
  });

  test("selectGame sets a lobby's current game based on the name provided", () => {
    const lobby = new Lobby();

    lobby.selectGame(Games.Codenames.name);
    expect(lobby.game).toBeInstanceOf(Games.Codenames);
  });

  test("selectGame ignores invalid game names", () => {
    const lobby = new Lobby();

    lobby.selectGame("INVALID_GAME_NAME");
    expect(lobby.game).toBeUndefined();
  });

  test("selectGame does nothing when given the game that is already selected", () => {
    const lobby = new Lobby();

    lobby.selectGame(Games.Codenames.name);
    const gameReference1 = lobby.game;

    lobby.selectGame(Games.Codenames.name);
    const gameReference2 = lobby.game;

    // Verify referential equality, NOT object equality
    expect(gameReference1).toBe(gameReference2);
  });

  test("addNewPlayer adds a new player with the provided name to the lobby", () => {
    const originalPlayers = [...Array(2)].map(buildPlayer);
    const lobby = new Lobby(originalPlayers.slice());

    const testName = "TEST_NAME";
    lobby.addNewPlayer(testName);

    expect(lobby.players.length).toBe(originalPlayers.length + 1);
    expect(lobby.players.find(p => p.name === testName)).toBeDefined();
  });

  test("addNewPlayer sets the new player as the host if it's missing one", () => {
    const lobby = new Lobby();

    const testName1 = "TEST_NAME_1";
    const testName2 = "TEST_NAME_2";
    lobby.addNewPlayer(testName1);

    const player1 = lobby.players.find(p => p.name === testName1);
    expect(lobby.host).toBe(player1.id);

    // Host remains unchanged after another player is added
    lobby.addNewPlayer(testName2);
    expect(lobby.host).toBe(player1.id);
  });

  test("addPlayer adds a given player to the lobby if they have a name and id", () => {
    const originalPlayers = [...Array(3)].map(buildPlayer);
    const lobby = new Lobby(originalPlayers.slice());

    const player = new Player({ name: "TEST_NAME" });
    lobby.addPlayer(player);

    expect(lobby.players.length).toBe(originalPlayers.length + 1);
    expect(lobby.players.find(p => p.id === player.id)).toBeDefined();

    // Lobby does not add invalid players
    lobby.addPlayer({} as Player);
    expect(lobby.players.length).toBe(originalPlayers.length + 1);
  });

  test("removePlayer removes a player with the provided id from the lobby", () => {
    const originalPlayers = [...Array(3)].map(buildPlayer);
    const removedPlayer = originalPlayers[1];
    const lobby = new Lobby(originalPlayers.slice());

    lobby.removePlayer(removedPlayer.id);
    expect(lobby.players.length).toBe(originalPlayers.length - 1);
    expect(lobby.players.find(p => p.id === removedPlayer.id)).toBeUndefined();
  });

  test("removePlayer sets the host to the first player if the original host was removed", () => {
    const lobby = new Lobby([...Array(3)].map(buildPlayer));

    const removedHost = lobby.players.find(p => p.id === lobby.host);

    lobby.removePlayer(removedHost.id);
    expect(lobby.host).not.toBe(removedHost.id);
    expect(lobby.host).toBe(lobby.players[0].id);

    const newHost = lobby.players.find(p => p.id === lobby.host);
    const removedNonHost = lobby.players.find(p => p.id !== lobby.host);

    // Host remains unchanged if a non-host is removed.
    lobby.removePlayer(removedNonHost.id);
    expect(lobby.host).toBe(newHost.id);
  });
});
