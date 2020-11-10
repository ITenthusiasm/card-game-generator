import WebSocket from "ws";
import { Server } from "http";
import { Lobby } from "./models";
import { randomString } from "./utils/algorithms";

interface AugmentedWebSocket extends WebSocket {
  lobbyId: string;
}

const lobbies: Record<string, Lobby> = {};

function createWebSocketServer(server: Server): void {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", function (webSocket: AugmentedWebSocket) {
    console.log("Connection created on Web Socket.");

    webSocket.on("message", function (message: string) {
      const [messageType, dataString] = message.split("|");
      const data = dataString ? JSON.parse(dataString) : dataString;

      switch (messageType) {
        case "OPEN_LOBBY": {
          const lobbyId = randomString();
          const newLobby = new Lobby();

          lobbies[lobbyId] = newLobby;
          webSocket.lobbyId = lobbyId;

          const player = newLobby.addNewPlayer(data);
          webSocket.send(`SET_PLAYER|${JSON.stringify(player)}`);
          webSocket.send(`SET_GAMES|${JSON.stringify(newLobby.games)}`);
          webSocket.send(`SET_LOBBY|${JSON.stringify(lobbyId)}`);
          break;
        }
        case "JOIN_LOBBY": {
          const { lobbyId, playerName } = data;
          const lobby = lobbies[lobbyId];

          if (!lobby) {
            webSocket.send(`SET_LOBBY|${JSON.stringify(null)}`);
            break;
          }

          webSocket.lobbyId = lobbyId;
          const player = lobby.addNewPlayer(playerName);
          webSocket.send(`SET_PLAYER|${JSON.stringify(player)}`);
          webSocket.send(`SET_GAMES|${JSON.stringify(lobby.games)}`);
          webSocket.send(`SET_LOBBY|${JSON.stringify(lobbyId)}`);

          wss.clients.forEach((ws: AugmentedWebSocket) => {
            if (ws.lobbyId === webSocket.lobbyId)
              ws.send(`UPDATE_PLAYERS|${JSON.stringify(lobby.players)}`);
          });

          if (lobby.game) {
            webSocket.send(
              `SET_GAME|${JSON.stringify(lobby.game.constructor.name)}`
            );
          }
          break;
        }
        case "UPDATE_PLAYER": {
          const lobby = lobbies[webSocket.lobbyId];
          const player = lobby.players.find(p => p.id === data.id);
          player.role = data.role;
          player.team = data.team;

          wss.clients.forEach((ws: AugmentedWebSocket) => {
            if (ws.lobbyId === webSocket.lobbyId)
              ws.send(`UPDATE_PLAYERS|${JSON.stringify(lobby.players)}`);
          });
          break;
        }
        case "SELECT_GAME": {
          const lobby = lobbies[webSocket.lobbyId];
          lobby.selectGame(data);

          wss.clients.forEach((ws: AugmentedWebSocket) => {
            if (ws.lobbyId === webSocket.lobbyId)
              ws.send(`SET_GAME|${JSON.stringify(data)}`);
          });
          break;
        }
        case "START_GAME": {
          const lobby = lobbies[webSocket.lobbyId];
          const gameState = lobby.game.start();

          wss.clients.forEach((ws: AugmentedWebSocket) => {
            if (ws.lobbyId === webSocket.lobbyId) {
              ws.send(`SET_GAME_STATE|${JSON.stringify(gameState)}`);
              ws.send(`UPDATE_PLAYERS|${JSON.stringify(lobby.players)}`);
            }
          });
          break;
        }
        case "HANDLE_ACTION": {
          const { player, action, item } = data;
          const lobby = lobbies[webSocket.lobbyId];
          const newState = lobby.game.handleAction(player, action, item);

          wss.clients.forEach((ws: AugmentedWebSocket) => {
            if (ws.lobbyId === webSocket.lobbyId) {
              ws.send(`SET_GAME_STATE|${JSON.stringify(newState)}`);
              ws.send(`UPDATE_PLAYERS|${JSON.stringify(lobby.players)}`);
            }
          });
          break;
        }
        case "RESET_GAME": {
          const lobby = lobbies[webSocket.lobbyId];
          const gameState = lobby.game.reset();

          wss.clients.forEach((ws: AugmentedWebSocket) => {
            if (ws.lobbyId === webSocket.lobbyId) {
              ws.send(`SET_GAME_STATE|${JSON.stringify(gameState)}`);
              ws.send(`UPDATE_PLAYERS|${JSON.stringify(lobby.players)}`);
            }
          });
          break;
        }
        default: {
          const errorMessage = `Unrecognized message type: ${messageType}`;
          webSocket.send(`ERROR|${JSON.stringify(errorMessage)}`);
          break;
        }
      }
    });
  });
}

export default createWebSocketServer;
