# TODO

- [ ] Need a nicer user interface to choose between games.
- [ ] For games like `Codenames` consider toggling between `teams` instead of toggling between `players` and set "player activity" based on that. (Be mindful of `roles` though.)
- [x] Need a clean way for people to choose their team.
- [x] Need a way to restart a `Codenames` game.
- [x] Codes cannot be given that include the name of a card.
- [ ] Make sure code is clean (relatively) on backend/frontend and fleshed out before moving onto a new game implementation.
- [x] Prevent abuse of game resets.
- [x] Consider a better system for initializing a deck. The deck/deck manifest/deck schematic/generateCardVals system feels slightly covoluted. It also complicates testing.
  - [x] If this gets done, improve the tests on the deck.
- [x] Improve/Test/Modularize the current `server/index.ts` (especially web sockets).
- [ ] Add a way to delete lobbies when all players have left the lobby.
- [ ] `Codenames.handleAction` needs to safely handle situations when it isn't given all the inputs. (Even consider invalid inputs?)
- [x] Maybe consider handling invalid message types in the WebSocket server.
- [x] Update Jest config to exclude the root application files (`src/main.ts` and `server/index.ts`).
- [ ] Consider adding more `type`s/`interface`s to clarify message types and data values in `createWebSocketServer`.
- [ ] Consider handling error cases in `createWebSocketServer`. Are you going to assume that all the data comes through in the correct way? Or are you going to validate every single message that comes through, returning any errors? Or are you simply going to use try/catch blocks to handle situations where people send invalid data? Whatever happens, you should consider an error handling option.
- [ ] If `lobby.addPlayer` ever starts getting used, it needs to avoid adding duplicate players.
  - [ ] You may want to consider removing `lobby.addPlayer` altogether. It may not be fully practical or safe.
- [ ] Investigate the webpack-dev-middleware warning that's happening right now. This is likely a Vue-related issue. (Our React app didn't have this problem.)
- [x] Consider moving `CodenamesCard.reveal` method to the `Codenames` component. That might make more sense since it's where the physical game is.
- [ ] Need to correct the `tsconfig.json` file at some point.
- [ ] Consider giving each individual game their own start/reset buttons... Is it worth it with the redundant logic?
