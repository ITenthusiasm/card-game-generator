class MockWebSocket extends WebSocket {
  static instances: MockWebSocket[] = [];

  constructor(...args: ConstructorParameters<typeof WebSocket>) {
    super(...args);
    MockWebSocket.instances.push(this);
  }
}

MockWebSocket.prototype.send = jest.fn(MockWebSocket.prototype.send);

window.WebSocket = MockWebSocket;
