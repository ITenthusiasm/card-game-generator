import { Store } from "vuex";
import WebSocket from "ws";
import createWebSocketClient from "..";
import waitFor from "../../../test-utils/helpers/waitFor";

// Important contants
const port = Number(process.env.JEST_WORKER_ID) + 8000;

const knownMessageTypes = [
  "SET_LOBBY",
  "SET_PLAYER",
  "UPDATE_PLAYERS",
  "SET_GAMES",
  "SET_GAME",
  "SET_GAME_STATE",
];

// Jest configuration
jest.mock("vuex");
jest.spyOn(console, "warn").mockImplementation();
jest.spyOn(console, "info").mockImplementation();

describe("Client Web Socket", () => {
  // Initialize Test variables
  let webSocketServer: WebSocket.Server;
  let serverWebSocket: WebSocket;
  let clientWebSocket: ReturnType<typeof createWebSocketClient>;
  let mockStore: Store<unknown>;

  const mockData = { a: "a", b: "b", c: "c" };
  const clientMessages: MessageEvent[] = [];

  beforeAll(async () => {
    // Initialize Test WebSocket server
    webSocketServer = new WebSocket.Server({ port });

    // Initialize client WebSocket
    process.env.CLIENT_SOCKET_URL = `ws://localhost:${port}`;
    mockStore = new Store({});
    clientWebSocket = createWebSocketClient();
    clientWebSocket.registerStore(mockStore);

    clientWebSocket.addEventListener("message", m => clientMessages.push(m));

    // Get the WebSocket that the client talks to
    await waitFor(() => clientWebSocket.readyState === clientWebSocket.OPEN);
    [serverWebSocket] = webSocketServer.clients;
  });

  beforeEach(() => jest.clearAllMocks());

  afterEach(() => clientMessages.splice(0, clientMessages.length));

  afterAll(() => {
    clientWebSocket.close();
    webSocketServer.close();
  });

  it.each(knownMessageTypes)(
    "Updates its registered store with the received data when it gets a %s message",
    async messageType => {
      serverWebSocket.send(`${messageType}|${JSON.stringify(mockData)}`);
      await waitFor(() => clientMessages.length === 1);

      expect(mockStore.commit).toHaveBeenCalledWith(messageType, mockData);
    }
  );

  it("Does nothing with unknown message types", async () => {
    const invalidMessageType = "BAD_MESSAGE";

    serverWebSocket.send(invalidMessageType);
    await waitFor(() => clientMessages.length === 1);

    expect(mockStore.commit).not.toHaveBeenCalled();
  });

  it("Only registers a Vuex store once", async () => {
    // Store was originally registered in `beforeAll`. Attempt to register a new one.
    const newMockStore = new Store({});
    clientWebSocket.registerStore(newMockStore);

    // Prove that the original store is still the one that gets updated
    serverWebSocket.send(`${knownMessageTypes[0]}|${JSON.stringify(mockData)}`);
    await waitFor(() => clientMessages.length === 1);

    expect(mockStore.commit).toHaveBeenCalled();
    expect(newMockStore.commit).not.toHaveBeenCalled();
  });
});
