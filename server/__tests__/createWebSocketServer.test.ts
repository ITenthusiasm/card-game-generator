/* eslint no-use-before-define: ["error", { "functions": false }] */
/* eslint-disable one-var */
import WebSocket from "ws";
import http from "http";
import createWebSocketServer from "../createWebSocketServer";
import * as Games from "../games";
import { Player } from "../models";
import waitFor from "../../test-utils/helpers/waitFor";

interface MockCodenames {
  instances: {
    start: jest.MockedFunction<typeof Games.Codenames.prototype.start>;
    handleAction: jest.MockedFunction<typeof Games.Codenames.prototype.handleAction>;
    end: jest.MockedFunction<typeof Games.Codenames.prototype.end>;
    reset: jest.MockedFunction<typeof Games.Codenames.prototype.reset>;
  }[];
}

const mockCodenames: MockCodenames = Games.Codenames as any;
const port = 8000 + Number(process.env.JEST_WORKER_ID);

jest.spyOn(console, "log").mockImplementation();
jest.spyOn(console, "error").mockImplementation();

jest.mock("../games/Codenames", () => {
  const OriginalCodenames = jest.requireActual("../games/Codenames").default;

  class Codenames extends OriginalCodenames {
    static instances: Codenames[] = [];

    constructor(players: Player[]) {
      super(players);
      Codenames.instances.push(this);
    }
  }

  Codenames.prototype.start = jest.fn(Codenames.prototype.start);
  Codenames.prototype.handleAction = jest.fn(Codenames.prototype.handleAction);
  Codenames.prototype.end = jest.fn(Codenames.prototype.end);
  Codenames.prototype.reset = jest.fn(Codenames.prototype.reset);

  return Codenames;
});

describe("Create WebSocket Server", () => {
  // Constant variables that are initialized before all tests
  let server: http.Server;
  let client1Lobby1: WebSocket, messages1: string[];
  let client2Lobby1: WebSocket, messages2: string[];
  let client3: WebSocket, messages3: string[];
  let client4Lobby2: WebSocket, messages4: string[];
  let client5Lobby2: WebSocket, messages5: string[];

  // Constant variables that are initialized in a relevant test
  let lobby1: string;
  let lobby2: string;

  // Dynamic variables that are updated by the server throughout the tests
  let player1: Partial<Player> = { name: "PLAYER_1" };
  let player2: Partial<Player> = { name: "PLAYER_2" };

  let player4: Partial<Player> = { name: "PLAYER_4" };
  let player5: Partial<Player> = { name: "PLAYER_5" };

  beforeAll(async () => {
    // Require the player ids to start off empty.
    expect(player1.id).toBeUndefined();
    expect(player2.id).toBeUndefined();
    expect(player4.id).toBeUndefined();
    expect(player5.id).toBeUndefined();

    // Initialize the server, and initialize the clients along with their corresponding messages
    server = await startServer(port);

    [client1Lobby1, messages1] = await createSocketClient();
    [client2Lobby1, messages2] = await createSocketClient();
    [client3, messages3] = await createSocketClient();
    [client4Lobby2, messages4] = await createSocketClient();
    [client5Lobby2, messages5] = await createSocketClient();
  });

  beforeEach(() => {
    mockCodenames.instances.forEach(mockGame => {
      mockGame.start.mockClear();
      mockGame.handleAction.mockClear();
      mockGame.end.mockClear();
      mockGame.reset.mockClear();
    });
  });

  afterEach(() => {
    // Clear the messages so that the next test can properly observe the new data
    messages1.splice(0, messages1.length);
    messages2.splice(0, messages2.length);
    messages3.splice(0, messages3.length);
    messages4.splice(0, messages4.length);
    messages5.splice(0, messages5.length);
  });

  afterAll(() => {
    server.close();

    client1Lobby1.close();
    client2Lobby1.close();
    client3.close();
    client4Lobby2.close();
    client5Lobby2.close();
  });

  test("OPEN_LOBBY creates a new lobby with a player with the given name, returning the uniquely created player info, the available games, and the unique lobby id", async () => {
    const expectedActions = ["SET_PLAYER", "SET_GAMES", "SET_LOBBY"];

    client1Lobby1.send(`OPEN_LOBBY|${JSON.stringify(player1.name)}`);
    client4Lobby2.send(`OPEN_LOBBY|${JSON.stringify(player4.name)}`);
    await waitFor(() => messages1.length === 3 && messages4.length === 3);

    const [actions1, [playerInfo1, games1, lobbyId1]] = extractMessageData(messages1);
    const [actions4, [playerInfo4, games4, lobbyId4]] = extractMessageData(messages4);

    // Received Actions
    expect(actions1).toStrictEqual(expectedActions);
    expect(actions4).toStrictEqual(expectedActions);

    // Received player info
    expect(playerInfo1.name).toBe(player1.name);
    expect(playerInfo4.name).toBe(player4.name);

    // The server-assigned player ids should be unique
    expect(playerInfo1.id).toEqual(expect.any(String));
    expect(playerInfo4.id).toEqual(expect.any(String));
    expect(playerInfo1.id).not.toBe(playerInfo4.id);

    // Expected Game info
    expect(games1).toStrictEqual(Object.values(Games).map(g => g.name));
    expect(games4).toStrictEqual(Object.values(Games).map(g => g.name));

    // Expected Lobby info
    expect(lobbyId1).toEqual(expect.any(String));
    expect(lobbyId4).toEqual(expect.any(String));
    expect(lobbyId1).not.toBe(lobbyId4);

    // Assign lobbies and update player info for following tests
    lobby1 = lobbyId1;
    lobby2 = lobbyId4;
    player1 = playerInfo1;
    player4 = playerInfo4;
  });

  test("JOIN_LOBBY ignores invalid lobby IDs, returning null instead of a lobbyId", async () => {
    const data = { playerName: "FAKE_NAME", lobbyId: "INVALID_LOBBY_ID" };
    const expectedActions = ["SET_LOBBY"];

    client3.send(`JOIN_LOBBY|${JSON.stringify(data)}`);
    await waitFor(() => messages3.length === 1);

    const [actions, [joinedLobby]] = extractMessageData(messages3);

    expect(actions).toStrictEqual(expectedActions);
    expect(joinedLobby).toBeNull();
  });

  test("JOIN_LOBBY adds a player with the given name to the lobby with the given id, returning the uniquely created player info, the available games, and the lobby id. Then it informs the lobby members of all the players currently in the lobby.", async () => {
    const data = { playerName: player2.name, lobbyId: lobby1 };
    const expectedActions1 = ["UPDATE_PLAYERS"];
    const expectedActions2 = ["SET_PLAYER", "SET_GAMES", "SET_LOBBY", "UPDATE_PLAYERS"];

    client2Lobby1.send(`JOIN_LOBBY|${JSON.stringify(data)}`);
    await waitFor(() => messages2.length === 4 && messages1.length === 1);

    const [actions1, [players1]] = extractMessageData(messages1);
    const [actions2, [playerInfo2, games2, joinedLobby, players2]] = extractMessageData(messages2);

    // Verify the received message types
    expect(actions1).toStrictEqual(expectedActions1);
    expect(actions2).toStrictEqual(expectedActions2);

    // Verify the data that player 2 received
    expect(playerInfo2.name).toBe(data.playerName);
    expect(games2).toStrictEqual(Object.values(Games).map(g => g.name));
    expect(joinedLobby).toBe(data.lobbyId);

    // The server-assigned player id should be unique
    expect(playerInfo2.id).toEqual(expect.any(String));
    expect(playerInfo2.id).not.toBe(player1.id);
    expect(playerInfo2.id).not.toBe(player4.id);

    // Verify the data sent to both players
    expect(players1).toStrictEqual(players2);
    expect(players1.length).toBe(2);
    expect(players1.map(p => p.name)).toStrictEqual([player1.name, player2.name]);

    // Verify that no one outside the lobby got a message to update the players.
    expect(messages3.length).toBe(0);
    expect(messages4.length).toBe(0);
    expect(messages5.length).toBe(0);

    // Update player info for following tests
    player2 = playerInfo2;
  });

  test("SELECT_GAME chooses the current game for the lobby, informing the lobby members of the newly selected game", async () => {
    const expectedActions = ["SET_GAME"];
    const gameName = Games.Codenames.name;

    client1Lobby1.send(`SELECT_GAME|${JSON.stringify(gameName)}`);
    await waitFor(() => messages1.length === 1 && messages2.length === 1);

    const [actions1, [chosenGame1]] = extractMessageData(messages1);
    const [actions2, [chosenGame2]] = extractMessageData(messages2);

    // Verify the data received by both players
    expect(actions1).toStrictEqual(expectedActions);
    expect(actions2).toStrictEqual(expectedActions);
    expect(chosenGame1).toBe(gameName);
    expect(chosenGame2).toBe(gameName);

    // Verify that no one outside the lobby got the message
    expect(messages3.length).toBe(0);
    expect(messages4.length).toBe(0);
    expect(messages5.length).toBe(0);
  });

  test("JOIN_LOBBY sets the game for new players if one is already selected for the lobby", async () => {
    const data = { playerName: player5.name, lobbyId: lobby2 };
    const gameName = Games.Codenames.name;
    const expectedActions = ["SET_GAME"];

    client4Lobby2.send(`SELECT_GAME|${JSON.stringify(gameName)}`);
    await waitFor(() => messages4.length === 1);

    client5Lobby2.send(`JOIN_LOBBY|${JSON.stringify(data)}`);
    await waitFor(() => messages4.length === 2 && messages5.length === 5);

    const [actions, [playerInfo5, , , , chosenGame]] = extractMessageData(messages5);

    expect(actions).toEqual(expect.arrayContaining(expectedActions));
    expect(chosenGame).toBe(gameName);

    // Update player info for following tests
    player5 = playerInfo5;
  });

  test("UPDATE_PLAYER updates a player using the provided player info, informing everyone in their lobby of the change", async () => {
    const newPlayer1Data = { role: "FAKE_ROLE", team: "FAKE_TEAM" };
    const expectedActions = ["UPDATE_PLAYERS"];

    client1Lobby1.send(`UPDATE_PLAYER|${JSON.stringify({ ...player1, ...newPlayer1Data })}`);
    await waitFor(() => messages1.length === 1 && messages2.length === 1);

    const [actions1, [players1]] = extractMessageData(messages1);
    const [actions2, [players2]] = extractMessageData(messages2);

    // Received Actions
    expect(actions1).toStrictEqual(expectedActions);
    expect(actions2).toStrictEqual(expectedActions);

    // Verify the data sent to both players
    expect(players1).toStrictEqual(players2);
    expect(players1.length).toBe(2);
    expect(players1.map(p => p.name)).toStrictEqual([player1.name, player2.name]);

    const playerInfo1 = players1.find(p => p.id === player1.id);
    expect(playerInfo1).toMatchObject(player1);
    expect(playerInfo1).toMatchObject(newPlayer1Data);

    // Verify that no one outside the lobby got the message
    expect(messages3.length).toBe(0);
    expect(messages4.length).toBe(0);
    expect(messages5.length).toBe(0);

    // Update player info for following tests
    player1 = playerInfo1;
  });

  test("START_GAME attempts to start the game in the lobby, informing the lobby members of the new game state and player info", async () => {
    const expectedActions = ["SET_GAME_STATE", "UPDATE_PLAYERS"];

    client1Lobby1.send(`START_GAME`);
    await waitFor(() => messages1.length === 2 && messages2.length === 2);

    const [actions1, [gameState1, players1]] = extractMessageData(messages1);
    const [actions2, [gameState2, players2]] = extractMessageData(messages2);

    // Received Actions
    expect(actions1).toStrictEqual(expectedActions);
    expect(actions2).toStrictEqual(expectedActions);

    // Verify the game state sent to both players
    expect(gameState1).toStrictEqual(gameState2);
    expect(gameState1).toEqual(expect.any(Object));
    expect(gameState2).toEqual(expect.any(Object));

    // Verify the player info sent to both players
    expect(players1).toStrictEqual(players2);
    expect(players1.length).toBe(2);
    expect(players1.map(p => p.name)).toStrictEqual([player1.name, player2.name]);

    // Verify that no one outside the lobby got the message
    expect(messages3.length).toBe(0);
    expect(messages4.length).toBe(0);
    expect(messages5.length).toBe(0);

    // Verify method calls
    const mockGame1Lobby1 = mockCodenames.instances[0];
    expect(mockGame1Lobby1.start).toBeCalled();

    // Update player info for the following tests
    player1 = players1.find(p => p.id === player1.id);
    player2 = players1.find(p => p.id === player2.id);
  });

  test("HANDLE_ACTION attempts to handle an in-game action for a lobby, informing the lobby members of the new game state and player info", async () => {
    const expectedActions = ["SET_GAME_STATE", "UPDATE_PLAYERS"];
    const data = { player: player1, action: "FAKE_ACTION", item: "FAKE_ITEM" };

    client1Lobby1.send(`HANDLE_ACTION|${JSON.stringify(data)}`);
    await waitFor(() => messages1.length === 2 && messages2.length === 2);

    const [actions1, [gameState1, players1]] = extractMessageData(messages1);
    const [actions2, [gameState2, players2]] = extractMessageData(messages2);

    // Received Actions
    expect(actions1).toStrictEqual(expectedActions);
    expect(actions2).toStrictEqual(expectedActions);

    // Verify the game state sent to both players
    expect(gameState1).toStrictEqual(gameState2);
    expect(gameState1).toEqual(expect.any(Object));
    expect(gameState2).toEqual(expect.any(Object));

    // Verify the player info sent to both players
    expect(players1).toStrictEqual(players2);
    expect(players1.length).toBe(2);
    expect(players1.map(p => p.name)).toStrictEqual([player1.name, player2.name]);

    // Verify that no one outside the lobby got the message
    expect(messages3.length).toBe(0);
    expect(messages4.length).toBe(0);
    expect(messages5.length).toBe(0);

    // Verify method calls
    const mockGame1Lobby1 = mockCodenames.instances[0];
    expect(mockGame1Lobby1.handleAction).toBeCalled();

    // Update player info for the following tests
    player1 = players1.find(p => p.id === player1.id);
    player2 = players1.find(p => p.id === player2.id);
  });

  test("RESET_GAME attempts to reset the game in the lobby, informing the lobby members of the new game state and player info", async () => {
    const expectedActions = ["SET_GAME_STATE", "UPDATE_PLAYERS"];

    client1Lobby1.send(`RESET_GAME`);
    await waitFor(() => messages1.length === 2 && messages2.length === 2);

    const [actions1, [gameState1, players1]] = extractMessageData(messages1);
    const [actions2, [gameState2, players2]] = extractMessageData(messages2);

    // Received Actions
    expect(actions1).toStrictEqual(expectedActions);
    expect(actions2).toStrictEqual(expectedActions);

    // Verify the game state sent to both players
    expect(gameState1).toStrictEqual(gameState2);
    expect(gameState1).toEqual(expect.any(Object));
    expect(gameState2).toEqual(expect.any(Object));

    // Verify the player info sent to both players
    expect(players1).toStrictEqual(players2);
    expect(players1.length).toBe(2);
    expect(players1.map(p => p.name)).toStrictEqual([player1.name, player2.name]);

    // Verify that no one outside the lobby got the message
    expect(messages3.length).toBe(0);
    expect(messages4.length).toBe(0);
    expect(messages5.length).toBe(0);

    // Verify method calls
    const mockGame1Lobby1 = mockCodenames.instances[0];
    expect(mockGame1Lobby1.reset).toBeCalled();

    // Update player info for the following tests
    player1 = players1.find(p => p.id === player1.id);
    player2 = players1.find(p => p.id === player2.id);
  });

  test("Unrecognized message types result in an error from the server", async () => {
    const badMessageType = "FAKE_MESSAGE_TYPE";
    const expectedActions = ["ERROR"];

    client3.send(badMessageType);
    await waitFor(() => messages3.length === 1);

    const [actions3, [errorMessage]] = extractMessageData(messages3);

    // Verify received message types
    expect(actions3).toStrictEqual(expectedActions);

    // Verify the error message
    expect(errorMessage).toBe(`Unrecognized message type: ${badMessageType}`);
  });
});

/* ------------------------------ UTILITY FUNCTIONS ------------------------------ */

/**
 * Creates and starts a WebSocket server from a simple http server for testing purposes.
 * @param p Port for the server to listen on
 * @returns The created server
 */
function startServer(p: number): Promise<http.Server> {
  const server = http.createServer();
  createWebSocketServer(server);

  return new Promise(resolve => {
    server.listen(p, () => resolve(server));
  });
}

/**
 * Creates a socket client.
 * @returns Tuple containing the created client and any messages it receives
 */
async function createSocketClient(): Promise<[WebSocket, string[]]> {
  const client = new WebSocket(`ws://localhost:${port}`);
  await waitFor(() => client.readyState === client.OPEN);

  const messages = [];
  client.on("message", data => messages.push(data));

  return [client, messages];
}

/**
 * Extracts the data from a single WebSocket message.
 * @param message
 * @returns The message type and its corresponding data
 */
function extractMessageData(message: string): [string, any];
/**
 * Extracts the data from an array of WebSocket messages.
 * @param messages
 * @returns An array of message types and an array of corresponding data values
 */
function extractMessageData(messages: string[]): [string[], any[]];
function extractMessageData(messages: string | string[]): [any, any] {
  if (typeof messages === "string") {
    const messageData = messages.split("|");
    return [messageData[0], JSON.parse(messageData[1])];
  }

  const messageData = messages.map(m => m.split("|"));

  const messageTypes = messageData.map(md => md[0]);
  const messageValues = messageData.map(md => JSON.parse(md[1]));

  return [messageTypes, messageValues];
}
