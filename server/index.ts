import createServer from "./createServer";
import createWebSocketServer from "./createWebSocketServer";

(async (): Promise<void> => {
  const server = await createServer();
  const port = Number(process.env.PORT);

  createWebSocketServer(server);

  server.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
})();
