import express from "express";
import WebSocket from "ws";
import http from "http";
import path from "path";
import open from "open"; // Can be used to open page in browser
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import config from "../webpack.config.dev";
import { Lobby } from "./models";
const fs = require("fs").promises; // Needed to allow use of promises with fs

// Initialize Server
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Configurations
const port = Number(process.env.PORT) || 3000;
const compiler = webpack(config);

// Setup express with webpack dev middleware.
app.use(
  ["/login", "/"],
  webpackDevMiddleware(compiler, {
    logLevel: "silent",
  })
);

// Setup express with webpack hot middleware.
app.use(["/login", "/"], webpackHotMiddleware(compiler));

/* All Server Functionality */
app.get("/favicon.ico", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/favicon.ico"));
});

app.get(["/login", "/"], async function (req, res) {
  const htmlFile = await fs.readFile(
    path.join(__dirname, "../public/index.html"),
    "utf-8"
  );

  res.send(htmlFile);
});

// Wrap Express in HTTP server
const httpServer = http.createServer(app);

// Create Lobby for game
const lobby = new Lobby();

/* Web Socket Functionality */
const wss = new WebSocket.Server({ server: httpServer });

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

        wss.clients.forEach(ws => ws.send(`SET_GAME|${JSON.stringify(data)}`));
        break;
      }
      case "START_GAME": {
        const gameState = lobby.game.start();

        wss.clients.forEach(ws =>
          ws.send(`SET_GAME_STATE|${JSON.stringify(gameState)}`)
        );

        wss.clients.forEach(ws =>
          ws.send(`UPDATE_PLAYERS|${JSON.stringify(lobby.players)}`)
        );
        break;
      }
      case "HANDLE_ACTION": {
        const { player, action, item } = data;
        const newState = lobby.game.handleAction(player, action, item);

        wss.clients.forEach(ws =>
          ws.send(`SET_GAME_STATE|${JSON.stringify(newState)}`)
        );

        wss.clients.forEach(ws =>
          ws.send(`UPDATE_PLAYERS|${JSON.stringify(lobby.players)}`)
        );
        break;
      }
      default: {
        break;
      }
    }
  });
});

httpServer.listen(port, function () {
  console.log(`App listening on port ${port}`);
  open(`http://localhost:${port}`);
});
