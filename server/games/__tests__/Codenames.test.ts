import { Codenames } from "..";
import { Actions, CardTypes, GameStatus, Roles } from "../../models/enums";
import { dedupe } from "../../utils/arrayUtils";
import { buildPlayer } from "../../../test-utils/mock-data/mockBuilders";

jest.spyOn(console, "error").mockImplementation();
jest.spyOn(console, "log").mockImplementation();

describe("Codenames", () => {
  // Constant variables that are initialized before all tests
  let codenames: Codenames;

  // Dynamic variables used throughout the tests
  let gameState: ReturnType<typeof codenames.handleAction>;

  // Useful constants for the tests
  const { GIVE_CODE, REVEAL } = Actions.Codenames;
  const { AGENT, CODEMASTER } = Roles.Codenames;
  const { RED, BLUE, BLACK, BROWN } = CardTypes.Codenames;
  const generalCard = { type: RED, value: "value" };
  const generalCode = { word: "word", number: 2 };
  const players = [...Array(5)].map(buildPlayer);

  beforeAll(() => {
    codenames = new Codenames(players);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* BEFORE GAME START */
  test("The game is initiated with an inactive status", () => {
    // Action only run to grab game status
    gameState = codenames.handleAction(players[0], GIVE_CODE, generalCode);
    expect(gameState.status).toBe(GameStatus.INACTIVE);

    // Clear error state for next test
    delete gameState.error;
  });

  test("The game rejects any action when it is not active", () => {
    const newGameState1 = codenames.handleAction(players[0], GIVE_CODE, generalCode);
    expect(newGameState1).toMatchObject(gameState);
    expect(newGameState1.error).toBe("Error: Game is not active.");
    expect(console.error).toHaveBeenNthCalledWith(1, newGameState1.error);

    const newGameState2 = codenames.handleAction(players[0], REVEAL, generalCard);
    expect(newGameState2).toMatchObject(gameState);
    expect(newGameState2.error).toBe("Error: Game is not active.");
    expect(console.error).toHaveBeenNthCalledWith(2, newGameState2.error);
  });

  /* STARTING THE GAME */
  test("The game only starts when there is only one red codemaster and only one blue codemaster", () => {
    // No valid players
    const newGameState1 = codenames.start();
    expect(newGameState1).toMatchObject(gameState);
    expect(newGameState1.error).toBe("Invalid Player setup");
    expect(console.error).toHaveBeenNthCalledWith(1, newGameState1.error);

    // 1 valid player
    players[0].role = CODEMASTER;
    players[0].team = RED;

    const newGameState2 = codenames.start();
    expect(newGameState2).toMatchObject(gameState);
    expect(newGameState2.error).toBe("Invalid Player setup");
    expect(console.error).toHaveBeenNthCalledWith(2, newGameState2.error);

    // Too many codemasters
    players[1].role = CODEMASTER;
    players[1].team = BLUE;

    players[2].role = CODEMASTER;
    players[2].team = BLUE;

    const newGameState3 = codenames.start();
    expect(newGameState3).toMatchObject(gameState);
    expect(newGameState3.error).toBe("Invalid Player setup");
    expect(console.error).toHaveBeenNthCalledWith(3, newGameState3.error);

    // Correct player setup (The roles of the non-codemasters don't really matter)
    players[2].role = AGENT;

    gameState = codenames.start();
    expect(gameState.status).toBe(GameStatus.ACTIVE);
    expect(console.log).toBeCalledWith("Game started!");
    expect(gameState.error).toBeUndefined();
  });

  test("Once the game is started, the codes, players, and cards should be properly updated", () => {
    /* The game was started in the previous test */
    expect(gameState.status).toBe(GameStatus.ACTIVE);

    /* THE CODES */
    // The codes are properly initiated
    expect(gameState.codes).toEqual({ [RED]: [], [BLUE]: [] });

    /* THE PLAYERS */
    // There is only one active player
    // The active player is allowed only to give a code.
    // The active player is determined by the number of red/blue cards.
    expect(players.filter(p => p.active).length).toBe(1);

    const activePlayer = players.find(p => p.active);
    expect(activePlayer.actions).toEqual([GIVE_CODE]);
    expect(gameState.cards.filter(c => c.type === activePlayer.team).length).toBe(8);

    /* THE CARDS */
    // There are 25 cards
    // None of the cards start out revealed
    // The cards have the correct types
    // The cards have words as values
    // The cards have unique values
    // The cards have the correct type distribution
    expect(gameState.cards.length).toBe(25);
    gameState.cards.forEach(c => expect(c.revealed).toBeFalsy());

    const cardTypes = gameState.cards.map(c => c.type).filter(dedupe);
    expect(cardTypes.sort()).toEqual([BLACK, BLUE, BROWN, RED]);

    gameState.cards.forEach(c => expect(c.value).toMatch(/^[a-z]+$/));
    const cardValues = gameState.cards.map(c => c.value).filter(dedupe);
    expect(cardValues.length).toBe(gameState.cards.length);

    const majorColor = activePlayer.team;
    const minorColor = activePlayer.team === RED ? BLUE : RED;
    expect(gameState.cards.filter(c => c.type === majorColor).length).toBe(8);
    expect(gameState.cards.filter(c => c.type === minorColor).length).toBe(7);
    expect(gameState.cards.filter(c => c.type === BLACK).length).toBe(1);
    expect(gameState.cards.filter(c => c.type === BROWN).length).toBe(9);
  });

  test("The game cannot be 'started' while it is already active", () => {
    /* The game was previously started */
    expect(gameState.status).toBe(GameStatus.ACTIVE);

    const newGameState = codenames.start();
    expect(newGameState).toMatchObject(gameState);
    expect(newGameState.error).toBe("Game already in progress");
    expect(console.error).toBeCalledWith(newGameState.error);
  });

  /* HANDLING GAME ACTIONS */
  test("The game rejects the action if it wasn't the player's turn", () => {
    /* The game was previously started */
    expect(gameState.status).toBe(GameStatus.ACTIVE);

    const inactivePlayer = players.find(p => !p.active);
    const newGameState = codenames.handleAction(inactivePlayer, GIVE_CODE, generalCode);
    expect(newGameState).toMatchObject(gameState);
    expect(newGameState.error).toBe(
      `Illegal action from player ${inactivePlayer.name} (${inactivePlayer.id}) ignored.`
    );
    expect(console.error).toBeCalledWith(newGameState.error);
  });

  test("The game rejects the action if it was not in the player's legal actions", () => {
    /* The game was previously started */
    expect(gameState.status).toBe(GameStatus.ACTIVE);

    const activePlayer = players.find(p => p.active);
    expect(activePlayer.actions).not.toContain(REVEAL);

    const newGameState = codenames.handleAction(activePlayer, REVEAL, generalCard);
    expect(newGameState).toMatchObject(gameState);
    expect(newGameState.error).toBe(
      `Illegal action from player ${activePlayer.name} (${activePlayer.id}) ignored.`
    );
    expect(console.error).toBeCalledWith(newGameState.error);
  });

  test("The game rejects invalid actions", () => {
    /* The game was previously started */
    expect(gameState.status).toBe(GameStatus.ACTIVE);
    const action = "INVALID_ACTION" as any;

    const activePlayer = players.find(p => p.active);
    activePlayer.actions.push(action);

    const newGameState = codenames.handleAction(activePlayer, action, generalCode);
    expect(newGameState).toMatchObject(gameState);
    expect(newGameState.error).toBe(`Action ${action} not supported.`);
    expect(console.error).toBeCalledWith(newGameState.error);

    // Remove illegal action from active player for next test
    activePlayer.actions.pop();
    expect(activePlayer.actions).toEqual([GIVE_CODE]);
  });

  /* HANDLING GAME ACTIONS: CODES */
  test("The game rejects any code with a number that is not a positive integer", () => {
    /* The game was previously started */
    expect(gameState.status).toBe(GameStatus.ACTIVE);

    const activePlayer = players.find(p => p.active);
    const badCode1 = { word: "word", number: 1.7 };
    const badCode1String = JSON.stringify(badCode1);
    const badCode2 = { word: "word", number: -1 };
    const badCode2String = JSON.stringify(badCode2);

    const newGameState1 = codenames.handleAction(activePlayer, GIVE_CODE, badCode1);
    expect(newGameState1).toMatchObject(gameState);
    expect(newGameState1.error).toBe(
      `Invalid code: ${badCode1String}. Number must be a positive integer.`
    );
    expect(console.error).toHaveBeenNthCalledWith(1, newGameState1.error);

    const newGameState2 = codenames.handleAction(activePlayer, GIVE_CODE, badCode2);
    expect(newGameState2).toMatchObject(gameState);
    expect(newGameState2.error).toBe(
      `Invalid code: ${badCode2String}. Number must be a positive integer.`
    );
    expect(console.error).toHaveBeenNthCalledWith(2, newGameState2.error);
  });

  test("The game rejects a code that uses a card's word", () => {
    /* The game was previously started */
    expect(gameState.status).toBe(GameStatus.ACTIVE);

    const activePlayer = players.find(p => p.active);
    const badCode = { word: gameState.cards[0].value as string, number: 2 };
    const badCodeString = JSON.stringify(badCode);

    const newGameState = codenames.handleAction(activePlayer, GIVE_CODE, badCode);
    expect(newGameState).toMatchObject(gameState);
    expect(newGameState.error).toBe(
      `Invalid code: ${badCodeString}. Code cannot be an existing card.`
    );
    expect(console.error).toBeCalledWith(newGameState.error);
  });

  test("The game properly updates the active player, the guesses, and the codes when a valid code is given", () => {
    /* The game was previously started */
    expect(gameState.status).toBe(GameStatus.ACTIVE);

    const activePlayer = players.find(p => p.active);
    gameState = codenames.handleAction(activePlayer, GIVE_CODE, generalCode);

    /* THE PLAYER */
    // The originally active player remains the only active player
    // The player is permitted only to reveal cards
    expect(activePlayer.active).toBe(true);
    expect(players.filter(p => p.active).length).toBe(1);
    expect(activePlayer.actions).toEqual([REVEAL]);

    /* THE GUESSES */
    // The allowed guesses is the number in the given code plus 1
    expect(gameState.guesses).toBe(generalCode.number + 1);

    /* THE CODES */
    // The code the active player gave is added to his team's code list
    expect(gameState.codes[activePlayer.team]).toContain(generalCode);

    expect(gameState.error).toBeUndefined();
    expect(console.log).toBeCalledWith(
      `Player ${activePlayer.name} (${activePlayer.id}) gave code: `,
      generalCode
    );
  });

  /* HANDLING GAME ACTIONS: CARDS */
  test("The game will not reveal a card it does not contain", () => {
    /* The game was previously started */
    expect(gameState.status).toBe(GameStatus.ACTIVE);

    const activePlayer = players.find(p => p.active);
    const badCard = { type: RED, value: "INVALID_VALUE" };
    const badCardString = JSON.stringify(badCard);

    const newGameState = codenames.handleAction(activePlayer, REVEAL, badCard);
    expect(newGameState).toMatchObject(gameState);
    expect(newGameState.error).toBe(`Invalid card: ${badCardString}. Card not in game.`);
    expect(console.error).toBeCalledWith(newGameState.error);
  });

  test("When a player reveals a card of their color, the game properly updates the card and the guesses", () => {
    /* The game was previously started */
    expect(gameState.status).toBe(GameStatus.ACTIVE);

    const activePlayer = players.find(p => p.active);
    const chosenCard = gameState.cards.find(c => c.type === activePlayer.team && !c.revealed);
    gameState = codenames.handleAction(activePlayer, REVEAL, chosenCard);

    // Verify that only one card has been revealed so far
    expect(gameState.cards.filter(c => c.revealed).length).toBe(1);

    /* THE GUESSES */
    // The number of available guesses should have decreased by 1
    const originalGuesses = generalCode.number + 1;
    expect(gameState.guesses).toBe(originalGuesses - 1);

    /* THE CARD */
    // The chosen card becomes revealed
    expect(gameState.cards.find(c => c.revealed)).toEqual(chosenCard);

    expect(gameState.error).toBeUndefined();
    expect(console.log).toBeCalledWith(
      `Player ${activePlayer.name} (${activePlayer.id}) revealed card: `,
      chosenCard
    );
  });

  test("The game rejects a card that was already revealed", () => {
    /* The game was previously started */
    expect(gameState.status).toBe(GameStatus.ACTIVE);

    // A card should have already been revealed in a previous test.
    const activePlayer = players.find(p => p.active);
    const revealedCard = gameState.cards.find(c => c.revealed);
    const revealedCardString = JSON.stringify(revealedCard);

    const newGameState = codenames.handleAction(activePlayer, REVEAL, revealedCard);
    expect(newGameState).toMatchObject(gameState);
    expect(newGameState.error).toBe(`Card ${revealedCardString} was already revealed!`);
    expect(console.error).toBeCalledWith(newGameState.error);
  });

  test("The active player may correctly reveal his team's cards until his team is out of guesses", () => {
    /* The game was previously started */
    expect(gameState.status).toBe(GameStatus.ACTIVE);

    const originalPlayer = players.find(p => p.active);
    const remainingGuesses = gameState.guesses;

    for (let i = remainingGuesses; i > 0; i--) {
      const newTeamCard = gameState.cards.find(c => c.type === originalPlayer.team && !c.revealed);
      gameState = codenames.handleAction(originalPlayer, REVEAL, newTeamCard);

      // Verify that no errors occured during each card reveal
      expect(gameState.error).toBeUndefined();
    }

    // Verify that no more guesses remain
    expect(gameState.guesses).toBe(0);

    // Verify that the original player is no longer active.
    const newActivePlayer = players.find(p => p.active);
    expect(originalPlayer.id).not.toBe(newActivePlayer.id);
  });

  test("The active player immediately loses all guesses if he reveals a card not belonging to his team", () => {
    /* The game was previously started */
    expect(gameState.status).toBe(GameStatus.ACTIVE);

    // This test assumes the current active player has not yet given a code
    const originalPlayer = players.find(p => p.active);
    gameState = codenames.handleAction(originalPlayer, GIVE_CODE, generalCode);

    const brownCard = gameState.cards.find(c => c.type === BROWN && !c.revealed);
    gameState = codenames.handleAction(originalPlayer, REVEAL, brownCard);

    // Verify that the original player is no longer active
    const newActivePlayer = players.find(p => p.active);
    expect(originalPlayer.id).not.toBe(newActivePlayer.id);

    // Verify that there are 0 guesses.
    expect(gameState.guesses).toBe(0);

    expect(gameState.error).toBeUndefined();
  });

  test("A team wins when all the cards of their color are revealed", () => {
    /* The game was previously started */
    expect(gameState.status).toBe(GameStatus.ACTIVE);

    // This test assumes the current active player has not yet given a code
    const activePlayer = players.find(p => p.active);
    const megaCode = { word: "word", number: gameState.cards.length };
    gameState = codenames.handleAction(activePlayer, GIVE_CODE, megaCode);

    gameState.cards
      .filter(c => c.type === activePlayer.team && !c.revealed)
      .forEach(c => {
        gameState = codenames.handleAction(activePlayer, REVEAL, c);

        // Verify that no errors occured during each card reveal
        expect(gameState.error).toBeUndefined();
      });

    // Verify the game was won
    gameState.cards
      .filter(c => c.type === activePlayer.team)
      .forEach(c => expect(c.revealed).toBe(true));
    expect(gameState.winningTeam).toBe(activePlayer.team);
    expect(console.log).toBeCalledWith(`Team ${gameState.winningTeam} wins!`);
    expect(gameState.status).toBe(GameStatus.COMPLETED);
  });

  /* RESETTING THE GAME */
  test("Resetting the game properly updates the players, resets the game state, and makes the game inactive", () => {
    /* The game was completed in the previous test */
    expect(gameState.status).toBe(GameStatus.COMPLETED);

    gameState = codenames.reset();

    /* THE PLAYERS */
    // All players should have no team, no role, and no actions
    // All players should become inactive
    players.forEach(p =>
      expect([p.team, p.role, p.actions, p.active]).toEqual([null, null, null, false])
    );

    /* THE GAME STATE */
    // At the very least, the game should have no cards or errors
    // The game status should become inactive
    expect(gameState.cards).toBeUndefined();
    expect(gameState.error).toBeUndefined();
    expect(gameState.status).toBe(GameStatus.INACTIVE);

    expect(console.log).toBeCalledWith("Game was reset!");
  });

  test("The game cannot be reset if it is inactive", () => {
    /* The game was made inactive in the previous test */
    expect(gameState.status).toBe(GameStatus.INACTIVE);

    const newGameState = codenames.reset();
    expect(newGameState).toMatchObject(gameState);
    expect(newGameState.error).toBe("The game has not started yet");
    expect(console.error).toBeCalledWith(newGameState.error);
  });

  /* ENDING THE GAME */
  test("Ending the game at any point terminates the game, making it complete", () => {
    // Assumes the game is not already complete
    gameState = codenames.end();

    expect(gameState.status).toBe(GameStatus.COMPLETED);
    expect(gameState.error).toBeUndefined();

    expect(console.log).toBeCalledWith("Game ended!");
  });

  test("The game cannot be ended if it is already over", () => {
    /* The game was made complete in the previous test */
    expect(gameState.status).toBe(GameStatus.COMPLETED);

    const newGameState = codenames.end();
    expect(newGameState).toMatchObject(gameState);
    expect(newGameState.error).toBe("The game is already over.");
    expect(console.error).toBeCalledWith(newGameState.error);
  });

  /* OUT-OF-FLOW TESTS */
  test("When an active player reveals the black card, the opposite team wins", () => {
    const localPlayers = [...Array(5)].map(buildPlayer);
    const localCodenames = new Codenames(localPlayers);
    let localGameState: ReturnType<typeof localCodenames.handleAction>;

    localPlayers[0].role = CODEMASTER;
    localPlayers[0].team = RED;

    localPlayers[1].role = CODEMASTER;
    localPlayers[1].team = BLUE;

    localCodenames.start();

    const activePlayer = localPlayers.find(p => p.active);
    localGameState = localCodenames.handleAction(activePlayer, GIVE_CODE, generalCode);

    const blackCard = localGameState.cards.find(c => c.type === BLACK);
    localGameState = localCodenames.handleAction(activePlayer, REVEAL, blackCard);

    const expectedWinner = activePlayer.team === RED ? BLUE : RED;

    expect(localGameState.winningTeam).toBe(expectedWinner);
    expect(localGameState.winningTeam).not.toBe(activePlayer.team);
    expect(localGameState.status).toBe(GameStatus.COMPLETED);
    expect(localGameState.error).toBeUndefined();
  });

  test("The 'teams' static field returns the valid Codenames teams", () => {
    expect(Codenames.teams).toEqual([RED, BLUE]);
  });
});
