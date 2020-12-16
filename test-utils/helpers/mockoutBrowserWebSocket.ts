class MockWebSocket extends WebSocket {
  static instances: MockWebSocket[] = [];

  constructor(url: string, protocols?: string | string[]) {
    super(url, protocols);
    MockWebSocket.instances.push(this);
  }
}

MockWebSocket.prototype.send = jest.fn(MockWebSocket.prototype.send);

window.WebSocket = MockWebSocket;
