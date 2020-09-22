import WebSocket from "ws";
import createServer from "./createServer";
import { Lobby } from "./models";

(async (): Promise<void> => {
  const server = await createServer();
  const port = Number(process.env.PORT);

  // Create Lobby for game
  const lobby = new Lobby();

  /* Web Socket Functionality */
  const wss = new WebSocket.Server({ server });

  wss.on("connection", function (webSocket) {
    console.log("Connection created on Web Socket.");
    webSocket.send(`SET_GAMES|${JSON.stringify(lobby.games)}`);
    if (lobby.game) {
      webSocket.send(`SET_GAME|${JSON.stringify(lobby.game.constructor.name)}`);
    }

    webSocket.on("message", function (message: string) {
      const [messageType, dataString] = message.split("|");
      const data = dataString ? JSON.parse(dataString) : dataString;

      switch (messageType) {
        case "ADD_NEW_PLAYER": {
          const player = lobby.addNewPlayer(data);

          webSocket.send(`SET_PLAYER|${JSON.stringify(player)}`);

          wss.clients.forEach(ws =>
            ws.send(`UPDATE_PLAYERS|${JSON.stringify(lobby.players)}`)
          );
          break;
        }
        case "UPDATE_PLAYER": {
          const player = lobby.players.find(p => p.id === data.id);
          player.role = data.role;
          player.team = data.team;

          wss.clients.forEach(ws =>
            ws.send(`UPDATE_PLAYERS|${JSON.stringify(lobby.players)}`)
          );
          break;
        }
        case "SELECT_GAME": {
          lobby.selectGame(data);

          wss.clients.forEach(ws =>
            ws.send(`SET_GAME|${JSON.stringify(data)}`)
          );
          break;
        }
        case "START_GAME": {
          const gameState = lobby.game.start();

          wss.clients.forEach(ws => {
            ws.send(`SET_GAME_STATE|${JSON.stringify(gameState)}`);
            ws.send(`UPDATE_PLAYERS|${JSON.stringify(lobby.players)}`);
          });
          break;
        }
        case "HANDLE_ACTION": {
          const { player, action, item } = data;
          const newState = lobby.game.handleAction(player, action, item);

          wss.clients.forEach(ws => {
            ws.send(`SET_GAME_STATE|${JSON.stringify(newState)}`);
            ws.send(`UPDATE_PLAYERS|${JSON.stringify(lobby.players)}`);
          });
          break;
        }
        case "RESET_GAME": {
          const gameState = lobby.game.reset();

          wss.clients.forEach(ws => {
            ws.send(`SET_GAME_STATE|${JSON.stringify(gameState)}`);
            ws.send(`UPDATE_PLAYERS|${JSON.stringify(lobby.players)}`);
          });
          break;
        }
        default: {
          break;
        }
      }
    });
  });

  server.listen(port, async () => {
    console.log(`App listening on port ${port}`);

    if (process.env.NODE_ENV === "development") {
      const open = await import("open");
      open.default(`http://localhost:${port}`);
    }
  });
})();
