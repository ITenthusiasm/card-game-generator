# TODO

- [ ] Need a nicer interface to choose between games.
- [ ] For games like `Codenames` consider toggling between `teams` instead of toggling between `players` and set "player activity" based on that. (Be mindful of - `roles` though.)
- [x] Need a clean way for people to choose their team.
- [x] Need a way to restart a `Codenames` game.
- [x] Codes cannot be given that include the name of a card.
- [ ] Make sure code is clean (relatively) on backend/frontend and fleshed out before moving onto a new game implementation.
- [x] Prevent abuse of game resets.
- [x] Consider a better system for initializing a deck. The deck/deck manifest/deck schematic/generateCardVals system feels slightly covoluted. It also complicates testing.
  - [x] If this gets done, improve the tests on the deck.
- [ ] Improve/Test/Modularize the current server/index.ts (especially web sockets).
- [ ] Add a way to delete lobbies when all players have left the lobby.
