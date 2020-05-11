import express from "express";
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

app.listen(port, function (err) {
  if (err) return console.error(err);

  console.info(`App listening on port ${port}`);
  return open(`http://localhost:${port}`);
});
