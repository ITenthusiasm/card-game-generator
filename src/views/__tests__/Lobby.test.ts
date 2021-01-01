import { render, fireEvent } from "@testing-library/vue";
import "@testing-library/jest-dom/extend-expect";
import Lobby from "../Lobby.vue";
import router from "../../router";

interface MockStore {
  state: Partial<{
    player: { id: string; name: string };
    games: string[];
    selectedGame: string;
    gameState: Record<string, unknown>;
  }>;
  actions?: Partial<{
    startGame: ReturnType<typeof jest.fn>;
    resetGame: ReturnType<typeof jest.fn>;
  }>;
}

describe("Lobby", () => {
  function renderComponent({ store }: Record<string, any>) {
    return render(Lobby, { store, router });
  }

  /* Display Rules */
  it("Displays an error message with a link to the home page if no player is present", () => {
    const store: MockStore = { state: { games: ["Codenames", "Uno"] } };
    const { container, getByText } = renderComponent({ store });

    // Validate the error message. Try to remove unnecessary spaces from markup.
    const errorMessage = container.textContent!.replace(/\s{2,}/g, " ").trim();
    expect(errorMessage).toMatchInlineSnapshot(
      `"Oh my! How did you get here without a known name or lobby? Please join a lobby"`
    );

    // Test link
    const link = getByText(/join a lobby/i);
    fireEvent.click(link);
    expect(window.location.href).toBe("http://localhost/");
  });

  it("Displays at least the game choices if a player is present", () => {
    const store: MockStore = {
      state: {
        player: { id: "TEST_ID", name: "TEST_NAME" },
        games: ["Codenames", "Uno"],
      },
    };

    const { getByText } = renderComponent({ store });

    store.state.games?.forEach(g => expect(getByText(g)).toBeInTheDocument());
  });

  it("Does not display the game screen if no game is selected", () => {
    const store: MockStore = {
      state: { player: { id: "TEST_ID", name: "TEST_NAME" } },
    };

    const { queryByLabelText } = renderComponent({ store });

    expect(queryByLabelText("game-screen")).not.toBeInTheDocument();
  });

  it("Displays the game screen if a game is selected", () => {
    const store: MockStore = {
      state: {
        player: { id: "TEST_ID", name: "TEST_NAME" },
        selectedGame: "Codenames",
        gameState: {},
      },
    };

    const { getByLabelText } = renderComponent({ store });

    expect(getByLabelText("game-screen")).toBeInTheDocument();
  });

  /* Action Dispatches */
  it("Starts the game when 'Start Game' is clicked", () => {
    const store: MockStore = {
      state: {
        player: { id: "TEST_ID", name: "TEST_NAME" },
        selectedGame: "Codenames",
        gameState: {},
      },
      actions: {
        startGame: jest.fn(),
      },
    };

    const { getByText } = renderComponent({ store });

    fireEvent.click(getByText(/Start Game/i));
    expect(store.actions?.startGame).toHaveBeenCalled();
  });

  it("Resets the game when 'New Game' is clicked", () => {
    const store: MockStore = {
      state: {
        player: { id: "TEST_ID", name: "TEST_NAME" },
        selectedGame: "Codenames",
        gameState: {},
      },
      actions: {
        resetGame: jest.fn(),
      },
    };

    const { getByText } = renderComponent({ store });

    fireEvent.click(getByText(/New Game/i));
    expect(store.actions?.resetGame).toHaveBeenCalled();
  });
});
