import { render, fireEvent } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import Home from "../Home.vue";

interface MockStore {
  actions: {
    openLobby: ReturnType<typeof jest.fn>;
    joinLobby: ReturnType<typeof jest.fn>;
  };
}

describe("Home", () => {
  let defaultStore: MockStore;
  const initialUrl = "http://localhost/#/";

  function renderComponent({ store = defaultStore } = {}) {
    return render(Home, { store, routes: [{ path: "/lobby" }] });
  }

  beforeEach(() => {
    // Create new store
    defaultStore = { actions: { openLobby: jest.fn(), joinLobby: jest.fn() } };

    // Reset the URL to initial value (avoids errors from Vue Router)
    window.location.href = initialUrl;
  });

  it("Creates a new lobby with the provided information (trimmed) when 'Create Lobby' is clicked", () => {
    const playerName = "TEST_NAME\t";
    const expectedData = playerName.trim();

    const { getByLabelText, getByText } = renderComponent();

    userEvent.type(getByLabelText("Player Name"), playerName);
    fireEvent.click(getByText("Create Lobby"));

    expect(defaultStore.actions.openLobby).toHaveBeenCalledWith(
      expect.anything(),
      expectedData
    );

    expect(window.location.href).toMatchInlineSnapshot(
      `"http://localhost/#/lobby"`
    );
  });

  it("Does not attempt to create a lobby when the player name is missing", () => {
    const playerName = "\n \t";

    const { getByLabelText, getByText } = renderComponent();

    userEvent.type(getByLabelText("Player Name"), playerName);
    fireEvent.click(getByText("Create Lobby"));

    expect(defaultStore.actions.openLobby).not.toHaveBeenCalled();
    expect(window.location.href).toBe(initialUrl);
  });

  it("Attempts to join a lobby using the provided information (trimmed) when 'Join Lobby' is clicked", () => {
    const playerName = "TEST_NAME\t";
    const lobbyId = "\tTEST_LOBBY_ID";
    const expectedData = {
      playerName: playerName.trim(),
      lobbyId: lobbyId.trim(),
    };

    const { getByLabelText, getByText } = renderComponent();

    userEvent.type(getByLabelText("Player Name"), playerName);
    userEvent.type(getByLabelText("Lobby Passcode"), lobbyId);
    fireEvent.click(getByText("Join Lobby"));

    expect(defaultStore.actions.joinLobby).toHaveBeenCalledWith(
      expect.anything(),
      expectedData
    );

    expect(window.location.href).toMatchInlineSnapshot(
      `"http://localhost/#/lobby"`
    );
  });

  it("Does not attempt to join a lobby when the player name or lobby id is missing", async () => {
    let playerName: string;
    let lobbyId: string;

    const { getByLabelText, getByText } = renderComponent();

    const playerNameInput = getByLabelText("Player Name");
    const lobbyIdInput = getByLabelText("Lobby Passcode");

    /** Create and send a Codenames code */
    function sendInfo(info: { playerName: string; lobbyId: string }) {
      userEvent.clear(playerNameInput);
      userEvent.clear(lobbyIdInput);

      userEvent.type(playerNameInput, info.playerName);
      userEvent.type(lobbyIdInput, info.lobbyId);
      fireEvent.click(getByText("Join Lobby"));
    }

    // No player name or lobby id
    playerName = "\n \t";
    lobbyId = "\n \t";
    sendInfo({ playerName, lobbyId });
    expect(defaultStore.actions.joinLobby).not.toHaveBeenCalled();

    // No player name
    playerName = "\n \t";
    lobbyId = "TEST_LOBBY_ID";
    sendInfo({ playerName, lobbyId });
    expect(defaultStore.actions.joinLobby).not.toHaveBeenCalled();

    // No lobby id
    playerName = "TEST_NAME";
    lobbyId = "\n \t";
    sendInfo({ playerName, lobbyId });
    expect(defaultStore.actions.joinLobby).not.toHaveBeenCalled();

    expect(window.location.href).toBe(initialUrl);
  });
});
