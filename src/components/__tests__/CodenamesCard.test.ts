import { render, fireEvent } from "@testing-library/vue";
import "@testing-library/jest-dom/extend-expect";
import CodenamesCard from "../CodenamesCard.vue";

describe("Codenames Card", () => {
  const defaultCard = { type: "Red", value: "TEST_TEXT" };

  const defaultStore = {
    state: { player: { role: "Agent" }, gameState: { status: "Active" } },
  };

  function renderComponent({ card = defaultCard, store = defaultStore } = {}) {
    return render(CodenamesCard, {
      props: { card },
      store,
    });
  }

  /* Text Display */
  it("Renders the card's value as text", () => {
    const { getByText } = renderComponent();
    expect(getByText(defaultCard.value)).toBeInTheDocument();
  });

  it("Displays black text for non-Codemasters when the game is incomplete", () => {
    const { getByText } = renderComponent();
    expect(getByText(defaultCard.value)).toHaveStyle({ color: "black" });
  });

  it("Displays colored text based on the card type for Codemasters when the game is incomplete", () => {
    const store = {
      state: {
        player: { role: "Codemaster" },
        gameState: { status: "Active" },
      },
    };

    const { getByText } = renderComponent({ store });
    expect(getByText(defaultCard.value)).toHaveStyle({ color: "#ff4242" });
  });

  it("Displays colored text based on the card type when the game is complete", () => {
    const store = {
      state: { player: { role: "Agent" }, gameState: { status: "Completed" } },
    };

    const { getByText } = renderComponent({ store });
    expect(getByText(defaultCard.value)).toHaveStyle({ color: "#ff4242" });
  });

  it("Displays white text when a card is revealed", () => {
    const card = { ...defaultCard, revealed: true };

    const { getByText } = renderComponent({ card });
    expect(getByText(card.value)).toHaveStyle({ color: "white" });
  });

  /* Background display */
  it("Displays a white background when the card is not revealed", () => {
    const expectedStyle = { backgroundColor: "white" };

    const { getByText } = renderComponent();
    expect(getByText(defaultCard.value)).toHaveStyle(expectedStyle);
  });

  it("Displays a colored background based on the card type when the card is revealed", () => {
    const card = { ...defaultCard, revealed: true };
    const expectedStyle = { backgroundColor: "#ff4242" };

    const { getByText } = renderComponent({ card });
    expect(getByText(card.value)).toHaveStyle(expectedStyle);
  });

  /* Other Tests */
  it("Selects the correct color based on the card type: ", async () => {
    const card = { type: "Red", value: "TEST_TEXT" };
    const store = {
      state: {
        player: { role: "Agent" },
        gameState: { status: "Completed" },
      },
    };

    // Red color
    const { getByText, updateProps } = renderComponent({ card, store });
    expect(getByText(card.value)).toHaveStyle({ color: "#ff4242" });

    // Blue color
    card.type = "Blue";
    await updateProps({ card: { ...card } });
    expect(getByText(card.value)).toHaveStyle({ color: "#2d72dd" });

    // Brown Color
    card.type = "Brown";
    await updateProps({ card: { ...card } });
    expect(getByText(card.value)).toHaveStyle({ color: "#e2bd97" });

    // Black
    card.type = "Black";
    await updateProps({ card: { ...card } });
    expect(getByText(card.value)).toHaveStyle({ color: "Black" });
  });

  it("Dispatches 'handleAction' when the card is clicked", async () => {
    const card = { ...defaultCard };
    const store = {
      state: {
        player: { role: "Agent" },
        gameState: { status: "Active" },
      },
      actions: {
        handleAction: jest.fn(),
      },
    };
    const expectedAction = { action: "Reveal", item: card };

    const { getByText } = renderComponent({ card, store });
    await fireEvent.click(getByText(card.value));

    expect(store.actions.handleAction).toHaveBeenCalledWith(
      expect.anything(),
      expectedAction
    );
  });

  it("Does not dispatch 'handleAction' when a revealed card is clicked", async () => {
    const card = { ...defaultCard, revealed: true };
    const store = {
      state: {
        player: { role: "Agent" },
        gameState: { status: "Active" },
      },
      actions: {
        handleAction: jest.fn(),
      },
    };

    const { getByText } = renderComponent({ card, store });
    await fireEvent.click(getByText(card.value));

    expect(store.actions.handleAction).not.toHaveBeenCalled();
  });

  it("Does not dispatch 'handleAction' when the game is Completed", async () => {
    const card = { ...defaultCard, revealed: false };
    const store = {
      state: {
        player: { role: "Agent" },
        gameState: { status: "Completed" },
      },
      actions: {
        handleAction: jest.fn(),
      },
    };

    const { getByText } = renderComponent({ card, store });
    await fireEvent.click(getByText(card.value));

    expect(store.actions.handleAction).not.toHaveBeenCalled();
  });
});
