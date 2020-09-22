import express from "express";
import http from "http";
import { clientRouter } from "./routes";
import config from "../webpack.config.dev";

async function createServer(): Promise<http.Server> {
  // Initialize Server
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Dev-only configurations
  if (process.env.NODE_ENV === "development") {
    const webpack = await import("webpack");
    const compiler = webpack.default(config);

    // Setup express with webpack dev middleware and webpack hot middleware
    const webpackDevMiddleware = await import("webpack-dev-middleware");
    const webpackHotMiddleware = await import("webpack-hot-middleware");

    const routes = ["/lobby", "/"];
    const webpackDevOpts: any = { logLevel: "silent" };
    app.use(routes, webpackDevMiddleware.default(compiler, webpackDevOpts));
    app.use(routes, webpackHotMiddleware.default(compiler));
  }

  app.use(clientRouter);

  return http.createServer(app);
}

export default createServer;
