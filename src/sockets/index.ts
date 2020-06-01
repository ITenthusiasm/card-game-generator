const webSocket = new WebSocket("ws://localhost:3000");

webSocket.addEventListener("open", function () {
  console.warn("Connected to game server!");
});

export default webSocket;
