import express from "express";
import path from "path";
const fs = require("fs").promises; // Needed to allow use of promises with fs

/** Router managing the files the client will request */
const clientRouter = express.Router();

clientRouter.get("/favicon.ico", function (_req, res) {
  res.sendFile(path.join(__dirname, "../../public/favicon.ico"));
});

clientRouter.route("/*").get(async function (req, res) {
  const htmlFile = await fs.readFile(
    path.join(__dirname, "../../public/index.html"),
    "utf-8"
  );

  res.send(htmlFile);
});

export default clientRouter;
