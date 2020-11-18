import { render, fireEvent } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import Codenames from "../Codenames.vue";

describe("Codenames", () => {
  // Useful constants for testing
  const defaultCards = [
    { type: "Red", value: "shark" },
    { type: "Red", value: "cotton" },
    { type: "Blue", value: "wind" },
    { type: "Black", value: "mass" },
    { type: "Brown", value: "tag" },
  ];

  const inactiveGameStore = {
    state: {
      player: { role: "Agent" },
      gameState: { status: "Inactive" },
    },
    actions: { updatePlayer: jest.fn() },
  };

  const activeGameStore = {
    state: {
      player: { role: "Agent" },
      gameState: { cards: defaultCards, status: "Active" },
    },
    actions: { handleAction: jest.fn() },
  };

  // Useful utilities
  function renderComponent({ store = {} } = {}) {
    return render(Codenames, {
      store,
    });
  }

  beforeEach(() => {
    inactiveGameStore.actions.updatePlayer.mockClear();
    activeGameStore.actions.handleAction.mockClear();
  });

  /* Game Settings */
  it("Displays the game settings when the game is inactive", () => {
    const { getByLabelText } = renderComponent({ store: inactiveGameStore });

    expect(getByLabelText("game-settings")).toBeInTheDocument();
  });

  it("Does not display the game settings when the game is not inactive", () => {
    const { queryByLabelText } = renderComponent({ store: activeGameStore });

    expect(queryByLabelText("game-settings")).not.toBeInTheDocument();
  });

  // Warning: Typically events with Vue seem to require awaiting fireEvent...
  // not sure why regular synchronicity works here.
  it("Sends the provided player info when the submission button is clicked", () => {
    const playerInfo = { team: "Red", role: "Codemaster" };

    const { getByLabelText, getByText } = renderComponent({
      store: inactiveGameStore,
    });

    const teamSelect = getByLabelText("Team");
    const roleSelect = getByLabelText("Role");

    userEvent.selectOptions(teamSelect, playerInfo.team);
    userEvent.selectOptions(roleSelect, playerInfo.role);
    fireEvent.click(getByText("Send Player Data"));

    expect(inactiveGameStore.actions.updatePlayer).toHaveBeenCalledWith(
      expect.anything(),
      playerInfo
    );
  });

  /* Game */
  it("Displays the game when the game is not inactive", () => {
    const { getByLabelText } = renderComponent({ store: activeGameStore });

    expect(getByLabelText("game")).toBeInTheDocument();
  });

  it("Does not display the game when the game is inactive", () => {
    const { queryByLabelText } = renderComponent({ store: inactiveGameStore });

    expect(queryByLabelText("game")).not.toBeInTheDocument();
  });

  /* Game: Board */
  it("Renders the game's cards into a box of Codenames Cards", () => {
    const { getByText } = renderComponent({ store: activeGameStore });

    activeGameStore.state.gameState.cards.forEach(c => {
      expect(getByText(c.value as string)).toBeInTheDocument();
    });
  });

  /* Game: Code Inputs */
  it("Formats, sends, and clears the provided code info when the submission button is clicked", async () => {
    const word = "FAKE_CODE\t";
    const number = "\t3";
    const expectedData = {
      action: "Give Code",
      item: { word: word.trim(), number: Number(number) },
    };

    const { getByLabelText, getByText } = renderComponent({
      store: activeGameStore,
    });

    const wordInput = getByLabelText("Code");
    const numberInput = getByLabelText("Number");

    // update is needed for v-model (instead of userEvent.type)
    await fireEvent.update(wordInput, word);
    await fireEvent.update(numberInput, number);
    await fireEvent.click(getByText("Send Code"));

    expect(activeGameStore.actions.handleAction).toHaveBeenCalledWith(
      expect.anything(),
      expectedData
    );

    expect(wordInput).toHaveValue("");
    expect(numberInput).toHaveValue("");
  });

  it("Does not submit invalid code info when the submission button is clicked", async () => {
    const gameWords = activeGameStore.state.gameState.cards.map(c => c.value);

    // Create invalid codes
    const noWordCode = { word: "\n \t", number: "3" };
    const inGameWordCode = { word: gameWords[0] as string, number: "3" };
    const noNumberCode = { word: "FAKE_CODE", number: "NOT_A_NUMBER" };
    const noIntegerCode = { word: "FAKE_CODE", number: "3.7" };
    const negativeCode = { word: "FAKE_CODE", number: "-3" };

    const { getByLabelText, getByText } = renderComponent({
      store: activeGameStore,
    });

    const wordInput = getByLabelText("Code");
    const numberInput = getByLabelText("Number");

    /** Create and send a Codenames code */
    async function sendCode(code: { word: string; number: string }) {
      await fireEvent.update(wordInput, code.word);
      await fireEvent.update(numberInput, code.number);
      await fireEvent.click(getByText("Send Code"));
    }

    // Verify failures
    await sendCode(noWordCode);
    expect(activeGameStore.actions.handleAction).not.toHaveBeenCalled();

    await sendCode(inGameWordCode);
    expect(activeGameStore.actions.handleAction).not.toHaveBeenCalled();

    await sendCode(noNumberCode);
    expect(activeGameStore.actions.handleAction).not.toHaveBeenCalled();

    await sendCode(noIntegerCode);
    expect(activeGameStore.actions.handleAction).not.toHaveBeenCalled();

    await sendCode(negativeCode);
    expect(activeGameStore.actions.handleAction).not.toHaveBeenCalled();

    // Verify that the inputs were never emptied
    expect(wordInput).not.toHaveValue("");
    expect(numberInput).not.toHaveValue("");
  });

  /* Game: Card Interactions */
  it("Attempts to reveal a card when one is clicked", async () => {
    const card = { type: "Red", value: "TEST_VALUE" };
    const store = {
      state: {
        player: { role: "Codemaster" },
        gameState: { cards: [card], status: "Active" },
      },
      actions: {
        handleAction: jest.fn(),
      },
    };
    const expectedAction = { action: "Reveal", item: card };

    const { getByText } = renderComponent({ store });
    await fireEvent.click(getByText(card.value));

    expect(store.actions.handleAction).toHaveBeenCalledWith(
      expect.anything(),
      expectedAction
    );
  });

  it("Does not attempt to reveal a card that is already revealed", async () => {
    const card = { type: "Red", value: "TEST_VALUE", revealed: true };
    const store = {
      state: {
        player: { role: "Codemaster" },
        gameState: { cards: [card], status: "Active" },
      },
      actions: {
        handleAction: jest.fn(),
      },
    };

    const { getByText } = renderComponent({ store });
    await fireEvent.click(getByText(card.value));

    expect(store.actions.handleAction).not.toHaveBeenCalled();
  });

  it("Does not attempt to reveal a card when the game is Completed", async () => {
    const card = { type: "Red", value: "TEST_VALUE" };
    const store = {
      state: {
        player: { role: "Codemaster" },
        gameState: { cards: [card], status: "Completed" },
      },
      actions: {
        handleAction: jest.fn(),
      },
    };

    const { getByText } = renderComponent({ store });
    await fireEvent.click(getByText(card.value));

    expect(store.actions.handleAction).not.toHaveBeenCalled();
  });
});
