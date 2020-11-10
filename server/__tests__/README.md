# Guidelines for Testing the WebSocket Server

Similar to a typical Express server, it is more practical to write integration tests for a WebSocket server than it is to write unit tests. And similar to any of our `Game` classes, it is more practical to write "flow-like" tests than it is to write isolated tests. This is due to the complex, event-dependent nature of a WebSocket server. The complexity of WebSocket-server tests and the desire to maintain readable code have led us to establish some guidelines and provide some explanations in this document.

- [Guidelines](#guidelines)
  1. [The Tests Should "Follow an Overall Flow"](#the-tests-should-"follow-an-overall-flow")
  2. [Integration Tests Should Be Used](#integration-tests-should-be-used)
  3. [Naming and Ordering of Variables](#naming-and-ordering-of-variables)
  4. [Synchronizing Server Info with the Shared Test Variables](#synchronizing-server-info-with-the-shared-test-variables)
  5. [Miscellaneous](#miscellaneous)
- [Explanations](#explanations)
  1. [Writing an Integration Test](#writing-an-integration-test)
  2. [Cleaning up WebSocket Messages](#cleaning-up-websocket-messages)
  3. [Observing Class Methods without Mocking out Their Implementation](#observing-class-methods-without-mocking-out-their-implementation)
  4. [Miscellaneous](#miscellaneous-1)

## Guidelines

### The Tests Should "Follow an Overall Flow"

Because the WebSocket server represents a place where people can join lobbies and play games, the server is heavily event-dependent. For instance, a person cannot start a game before joining a lobby. Attempting to perform "isolated tests" would require longer and longer setup code as you test actions that presume upon more and more previous events. Thus, we've decided to test our WebSocket server by performing an "overall flow" to reduce code duplication and improve code readability.

In an "overall flow", the order of your tests matters. So, for instance, you would test a client opening a lobby first. You would keep or update any data (such as the lobby id) needed to perform later tests. Next, you would test joining the lobby you created earlier. Again, you would keep or update any data needed to perform later tests. After that, you would test selecting the game for the same lobby...and so on.

Order your tests in such a way that you can test all of your use cases in a "single flow". If this is isn't possible, then you should wait until your first "flow" is finished before starting a second one. It is possible for our `Game` classes to encounter this issue, but this is less problematic with WebSockets since different WebSocket clients can perform different actions in different lobbies.

### Integration Tests Should Be Used

Ultimately, we're building an application that would allow people to join lobbies and play games on the web. It's best to make sure everything in the WebSocket server is behaving correctly by using integration tests. This gives us further confidence in our logic for lobbies, games, and other important objects. **No classes should have their implementation details mocked out here**.

If you need to verify that a proper method was called, provide a way to spy on the method, but do not overwrite it. The current mock `Codenames` class in `createWebSocketServer.test.ts` is a good example of this.

You are free to mock out noisy distractions such as `console.log` or `console.error`.

### Naming and Ordering of Variables

The complex nature of testing the WebSocket server requires various WebSocket clients to be kept open for the duration of the tests. Since there are multiple tests that will be using these clients (and other information), it's important to make the variable names as clear as possible. Doing so allows developers to know how they're impacting variables that already exist, and which variables they need to use to perform certain tests.

**All client variables should specify which client they represent and which lobby the client belongs to**. For instance, consider the variables `client1Lobby1`, `client3`, and `client4Lobby2`. `client1Lobby1` implies that it was the first client made, and that it belongs to a lobby. `client3` implies that it was the third client made, and that it belongs to _no_ lobby. `client4Lobby2` implies that it was the fourth created client, and that it should open a new lobby that is _separate from the other existing lobbies_. **Whenever multiple clients are expected to join the same lobby, the client that was made earliest should open the lobby.** For instance, if a `client2Lobby1` is created, then it should _join_ the lobby that was opened by the _first_ client in this example.

**All variables associated with a client should be properly numbered**. In these tests, we'll be tracking the messages that a given client receives. We'll also be tracking the player information that a given client would hold. Continuing from the previous example, `messages1` would represent the messages belonging to `client1Lobby1`. `player4` would represent the player associated with `client4Lobby2`. Similarly, when extracting information about a message, such as the type of message (often denoted by `actions`), `actions2` would represent all the action-related information that `client2Lobby1` received. Note that in this example, there would be no `player3` because `client3` does not belong to any lobby.

**Global "non-client variables" should still be properly numbered**. For instance, `lobby1` and `lobby2` can be used to represent 2 distinct lobby ids.

_If it makes more sense for a variable not to have any numbers associated with it, you may use a variable name that doesn't have a number_. _Use proper judgment_ when doing this, and prefer numbered names whenever multiple variables are used to represent similar entities.

**Place all variables that are shared between tests at the top, and order them properly**. Variables should be grouped by whether they're constant or "virtually constant" (set after declaration but never changed), and they should be grouped by their purpose.

### Synchronizing Server Info with the Shared Test Variables

Whenever the server updates an important value that multiple tests are sharing/using/tracking, **always update the appropriate variable**. For instance, if the tests are tracking a variable called `player1`, and the server updates the player and returns the new information, then you should update the `player1` variable accordingly.

**Variable synchronizations always belong at the _end_ of a test**.

### Miscellaneous

- For simplicity and consistency, the WebSocket server tests should only use `Codenames` for the games being selected/played.
- The responsibility of the WebSocket server **_is not_** to test the logic of a game. All games have their own sophisticated testing. _The server is merely responsible for trying to perform actions with a given game and returning any updated data_; therefore, it should only be concerned about _that_ when it comes to testing.
- Declarations of variables using `const` and configurations of `jest`/mocks belong **outside** the `describe` block, at the top of the file.
- All utility functions should be defined at the _end of the test file_.
- JSDocs are required for _all_ utility functions.

## Explanations

### Writing an Integration Test

Here, writing an integration test for the WebSocket server is fairly straightforward. You start off by declaring the data you plan to send to the server and any actions you expect the clients to receive. Next, you use the appropriate WebSocket client(s) to send messages to the server. You can use the `waitFor` utility to wait until the expected number of messages is received. Finally, you perform assertions on the information you got back from the server. Note that the `waitFor` utility is necessary for making sure everything happens at the right time.

Remember that the responsibility of the WebSocket server is to perform whatever actions it's told and to return all the correct data. Data is returned through WebSocket messages, so you should primarily be concerned with validating the message information that was received. Where important, you may verify that a given method was called. For instance, you may verify that `Codenames.start` was called when you sent a message to the server to start the game. But remember not to mock out the implementation of any method.

Note that sometimes, the information received from the server implies that an action occurred. For instance, if you get back a lobby ID from the server, and another client is able to successfully join the lobby and get the lobby's messages, it is implied that the lobby was properly created and that the client was properly connected to the lobby. Thus, one could argue that checking function calls would be superfluous here, and he/she could avoid testing additional implementation details. If you make these presumptions, use proper judgment. Some things are less safely implied than others.

### Cleaning up WebSocket Messages

After each test, all of the WebSocket clients have their message list cleared. This makes it easier to separate the tests from one another, and to keep track of how many messages one should expect within a given test.

### Observing Class Methods without Mocking out Their Implementation

If you need to observe the methods that a given class instance calls without mocking out the implementation details, you can use `jest.spyOn` to spy on the method via the class's `prototype`. Note that this only works if you have access to an instance of the class within the test you're writing.

If you do not have access to the instance of the class in the test you're writing, then you can create a custom mock with `jest.mock`. In this custom mock, use the class's prototype to replace the relevant methods with `jest.fn`s that use the same implementation as the original method. Additionally, add a static property that gives you access to all instances of the class. Note that this a rather unorthodox solution; it should only be used when necessary. When using this appraoch, you should try to add a helpful TypeScript `type` or `interface` for others and yourself to use.

### Miscellaneous

- `beforeAll` can be used to assert/enforce that certain conditions are met before any of the other tests run. This is useful when you want to verify something at the start that doesn't belong in any test related to the WebSocket server itself.

---

Having read and understood these rules, you'll be most helped by reading through `createWebSocketServer.test.ts` to solidify your understanding further. Reading the test code will also help you learn and understand the few things not discussed here. Please do this before adding or editing any tests. (And please add tests before committing any new code.)

If any superior rule system is discovered, it can be used to update or replace the existing rule system -- as long as the tests are updated to adhere to the rules in the same commit. Remember: The ultimate goal is code brevity and code clarity.
