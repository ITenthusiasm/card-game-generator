import createServer from "./createServer";
import createWebSocketServer from "./createWebSocketServer";

(async (): Promise<void> => {
  const server = await createServer();
  const port = Number(process.env.PORT);

  createWebSocketServer(server);

  server.listen(port, async () => {
    console.log(`App listening on port ${port}`);

    if (process.env.NODE_ENV === "development") {
      const open = await import("open");
      open.default(`http://localhost:${port}`);
    }
  });
})();
