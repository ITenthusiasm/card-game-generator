const webSocket = new WebSocket(process.env.CLIENT_SOCKET_URL as string);

webSocket.addEventListener("open", function () {
  console.warn("Connected to game server!");
});

export default webSocket;
