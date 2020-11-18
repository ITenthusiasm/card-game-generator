import { render, fireEvent } from "@testing-library/vue";
import "@testing-library/jest-dom/extend-expect";
import GameSelection from "../GameSelection.vue";

describe("Game Selection", () => {
  const defaultStore = {
    state: { games: ["Codenames", "Uno"] },
    actions: { selectGame: jest.fn() },
  };

  function renderComponent({ store = defaultStore } = {}) {
    return render(GameSelection, { store });
  }

  it("Renders the available games into a list of choices", () => {
    const { getByText } = renderComponent();

    defaultStore.state.games.forEach(gameName =>
      expect(getByText(gameName)).toBeInTheDocument()
    );
  });

  it("Dispatches 'selectGame' when a choice is clicked", () => {
    const gameName = defaultStore.state.games[0];

    const { getByText } = renderComponent();
    fireEvent.click(getByText(gameName));

    expect(defaultStore.actions.selectGame).toHaveBeenCalledWith(
      expect.anything(),
      gameName
    );
  });
});
