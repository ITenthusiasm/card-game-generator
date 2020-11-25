import { Store } from "vuex";

/** A client WebSocket that can communicate with a registered Vuex store. */
interface StoreWebSocket extends WebSocket {
  /**
   * Registers the store for the WebSocket to use. Only sets the store once.
   * @param store
   */
  registerStore: (store: Store<unknown>) => void;
}

/** Creates a client WebSocket that can communicate with a registered Vuex store. */
function createWebSocketClient(): StoreWebSocket {
  const url = process.env.CLIENT_SOCKET_URL as string;
  let localStore: Store<unknown>;

  const webSocket: StoreWebSocket = new WebSocket(url) as any;
  webSocket.registerStore = function (store: Store<unknown>) {
    if (!localStore) localStore = store;
  };

  webSocket.addEventListener("open", function () {
    console.warn("Connected to game server!");
  });

  // Prepare store interactions
  webSocket.addEventListener("message", function (message) {
    const [messageType, dataString] = message.data.split("|");
    const data = dataString ? JSON.parse(dataString) : dataString;

    switch (messageType) {
      case "SET_LOBBY": {
        localStore.commit("SET_LOBBY", data);
        break;
      }
      case "SET_PLAYER": {
        localStore.commit("SET_PLAYER", data);
        break;
      }
      case "UPDATE_PLAYERS": {
        localStore.commit("UPDATE_PLAYERS", data);
        break;
      }
      case "SET_GAMES": {
        localStore.commit("SET_GAMES", data);
        break;
      }
      case "SET_GAME": {
        localStore.commit("SET_GAME", data);
        break;
      }
      case "SET_GAME_STATE": {
        localStore.commit("SET_GAME_STATE", data);
        break;
      }
      default: {
        break;
      }
    }
  });

  return webSocket;
}

export default createWebSocketClient;
