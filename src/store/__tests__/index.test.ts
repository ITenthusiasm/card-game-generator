import { Server } from "ws";
import "../../../test-utils/helpers/mockoutBrowserWebSocket";
import store from "..";
import router from "../../router";
import waitFor from "../../../test-utils/helpers/waitFor";

interface MockWebSocket extends WebSocket {
  send: jest.MockedFunction<typeof WebSocket.prototype.send>;
}

interface MockWebSocketClass {
  instances: MockWebSocket[];
}

// Important constants
const mockWebSocketClass: MockWebSocketClass = WebSocket as any;
const port = Number(process.env.JEST_WORKER_ID) + 8000;

// Jest configuration
jest.spyOn(console, "info").mockImplementation();
jest.spyOn(console, "error").mockImplementation();
jest.spyOn(router, "push");

jest.mock("../../sockets", () => {
  const testPort = Number(process.env.JEST_WORKER_ID) + 8000;
  const testUrl = `ws://localhost:${testPort}`;

  return function createWebSocketClient() {
    // jest.mock allows "global", but not "window"
    const webSocket = new global.WebSocket(testUrl);
    (webSocket as any).registerStore = () => null;

    return webSocket;
  };
});

describe("Store", () => {
  // Initialize Test variables
  let webSocketServer: Server;
  let webSocketClient: MockWebSocket;

  beforeAll(async () => {
    // Initialize Test WebSocket Server
    webSocketServer = new Server({ port });

    await waitFor(() => mockWebSocketClass.instances[0]?.readyState === 1);
    [webSocketClient] = mockWebSocketClass.instances;
  });

  beforeEach(() => jest.clearAllMocks());

  afterAll(() => {
    webSocketClient.close();
    webSocketServer.close();
  });

  /* MUTATIONS */
  it("Updates the lobbyId and the URL for a SET_LOBBY mutation", () => {
    const lobbyId = "TEST_ID";

    store.commit("SET_LOBBY", lobbyId);
    expect(store.state.lobbyId).toBe(lobbyId);
    expect(window.location.href).toBe(`http://localhost/lobby/${lobbyId}`);
  });

  it("Does not nullify the lobbyId during SET_LOBBY if an id is not provided", () => {
    // Confirm that a lobbyId is present
    const originalLobbyId = store.state.lobbyId;
    expect(originalLobbyId).toMatch(/\w+/);

    const invalidLobbyId = undefined;

    store.commit("SET_LOBBY", invalidLobbyId);
    expect(store.state.lobbyId).toBe(originalLobbyId);
  });

  it("Updates the player info for a SET_PLAYER mutation", () => {
    const playerInfo = { id: "TEST_ID", name: "TEST_PLAYER" };

    store.commit("SET_PLAYER", playerInfo);
    expect(store.state.player).toStrictEqual(playerInfo);
  });

  it("Updates the player info and the players list for an UPDATE_PLAYERS mutation", () => {
    // playerInfo must have an ID that matches the one in the SET_PLAYER mutation test
    const playerInfo = { id: "TEST_ID", name: "TEST_PLAYER", team: "RED" };
    const player2 = { name: "PLAYER_2" };
    const player3 = { name: "PLAYER_3" };
    const playersList = [playerInfo, player2, player3];

    store.commit("UPDATE_PLAYERS", playersList);

    expect(store.state.players).toStrictEqual(playersList);
    expect(store.state.player).toStrictEqual(playerInfo);
  });

  it("Updates the selectable games for a SET_GAMES mutation", () => {
    const games = ["Codenames", "Uno"];

    store.commit("SET_GAMES", games);
    expect(store.state.games).toStrictEqual(games);
  });

  it("Updates the chosen game for a SET_GAME mutation", () => {
    const game = "Codenames";

    store.commit("SET_GAME", game);
    expect(store.state.selectedGame).toBe(game);
  });

  it("Updates the current game state for a SET_GAME_STATE mutation", () => {
    const gameState = { status: "INACTIVE", cards: [] };

    store.commit("SET_GAME_STATE", gameState);
    expect(store.state.gameState).toStrictEqual(gameState);
  });

  /* ACTIONS */
  it("sends an OPEN_LOBBY message when openLobby is dispatched", () => {
    const playerName = "TEST_PLAYER";
    const expectedMessage = `OPEN_LOBBY|${JSON.stringify(playerName)}`;

    store.dispatch("openLobby", playerName);
    expect(webSocketClient.send).toHaveBeenCalledWith(expectedMessage);
  });

  it("sends a JOIN_LOBBY message when joinLobby is dispatched", () => {
    const info = { lobbyId: "TEST_LOBBY", playerName: "TEST_NAME" };
    const expectedMessage = `JOIN_LOBBY|${JSON.stringify(info)}`;

    store.dispatch("joinLobby", info);
    expect(webSocketClient.send).toHaveBeenCalledWith(expectedMessage);
  });

  it("sends an UPDATE_PLAYER message using the existing and provided player info when updatePlayer is dispatched", () => {
    const existingPlayerInfo = store.state.player;
    const newPlayerInfo = { team: "BLUE", role: "Codemaster" };
    const expectedMessage = `UPDATE_PLAYER|${JSON.stringify({
      ...existingPlayerInfo,
      ...newPlayerInfo,
    })}`;

    store.dispatch("updatePlayer", newPlayerInfo);
    expect(webSocketClient.send).toHaveBeenCalledWith(expectedMessage);
  });

  it("sends a SELECT_GAME message when selectGame is dispatched", () => {
    const game = "Codenames";
    const expectedMessage = `SELECT_GAME|${JSON.stringify(game)}`;

    store.dispatch("selectGame", game);
    expect(webSocketClient.send).toHaveBeenCalledWith(expectedMessage);
  });

  it("does not send a SELECT_GAME message for invalid games", () => {
    // Confirm that the game name is invalid
    const invalidGame = "FAKE_GAME";
    expect(store.state.games).not.toContain(invalidGame);

    store.dispatch("selectGame", invalidGame);
    expect(webSocketClient.send).not.toHaveBeenCalled();
  });

  it("sends a START_GAME message when startGame is dispatched", () => {
    const expectedMessage = "START_GAME";

    store.dispatch("startGame");
    expect(webSocketClient.send).toHaveBeenCalledWith(expectedMessage);
  });

  it("sends a HANDLE_ACTION message with the existing player and provided data when handleAction is dispatched", () => {
    const data = { action: "REVEAL", item: "FAKE_CARD" };
    const expectedMessage = `HANDLE_ACTION|${JSON.stringify({
      player: store.state.player,
      ...data,
    })}`;

    store.dispatch("handleAction", data);
    expect(webSocketClient.send).toHaveBeenCalledWith(expectedMessage);
  });

  it("sends a RESET_GAME message when resetGame is dispatched", () => {
    const expectedMessage = "RESET_GAME";

    store.dispatch("resetGame");
    expect(webSocketClient.send).toHaveBeenCalledWith(expectedMessage);
  });
});
