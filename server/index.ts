import express from "express";
import WebSocket from "ws";
import http from "http";
import path from "path";
import open from "open"; // Can be used to open page in browser
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import config from "../webpack.config.dev";
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
  "/",
  webpackDevMiddleware(compiler, {
    logLevel: "silent",
  })
);

// Setup express with webpack hot middleware.
app.use("/", webpackHotMiddleware(compiler));

/* All Server Functionality */
app.get("/", async function (req, res) {
  const htmlFile = await fs.readFile(
    path.join(__dirname),
    "../public/index.html"
  );

  res.send(htmlFile);
});

app.get("/favicon.ico", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/favicon.ico"));
});

// Wrap Express in HTTP server
const httpServer = http.createServer(app);

/* Web Socket Functionality */
const wss = new WebSocket.Server({ server: httpServer });

wss.on("connection", function (webSocket) {
  console.log("Connection created on Web Socket.");

  webSocket.on("message", function (msg) {
    console.log("Incoming message: ", msg);
    webSocket.send(`You said: ${msg}`);
  });
});

httpServer.listen(port, function () {
  console.log(`App listening on port ${port}`);
  open(`http://localhost:${port}`);
});
