import Vue from "vue";
import Vuex from "vuex";
import createWebSocketClient from "../sockets";
import router from "../router";
import { Player } from "../../server/models";

Vue.use(Vuex);

const webSocket = createWebSocketClient();

const store = new Vuex.Store({
  state: {
    lobbyId: "",
    player: null as Player | null,
    players: [] as Player[],
    games: [] as string[],
    selectedGame: "",
    gameState: {},
  },
  mutations: {
    SET_LOBBY(state, lobbyId: string) {
      if (!lobbyId) {
        console.error("Could not find lobby");
        return;
      }

      state.lobbyId = lobbyId;
      router.push({ name: "lobby", params: { lobbyId } });
      localStorage.setItem("lobbyId", JSON.stringify(lobbyId));
    },
    SET_PLAYER(state, player): void {
      state.player = player;
      localStorage.setItem("player", JSON.stringify(player));
    },
    UPDATE_PLAYERS(state, players: any[]): void {
      state.players = players;

      state.player = players.find(p => p.id === state.player!.id);
      localStorage.setItem("player", JSON.stringify(state.player));
    },
    SET_GAMES(state, games: string[]): void {
      state.games = games;
    },
    SET_GAME(state, selectedGame: string): void {
      state.selectedGame = selectedGame;
    },
    SET_GAME_STATE(state, gameState): void {
      state.gameState = gameState;
    },
  },
  actions: {
    openLobby(_, playerName: string): void {
      webSocket.send(`OPEN_LOBBY|${JSON.stringify(playerName)}`);
    },
    joinLobby(_, playerInfo): void {
      webSocket.send(`JOIN_LOBBY|${JSON.stringify(playerInfo)}`);
    },
    updatePlayer(context, playerInfo): void {
      const player = Object.assign(context.state.player, playerInfo);
      webSocket.send(`UPDATE_PLAYER|${JSON.stringify(player)}`);
    },
    selectGame(context, gameName: string): void {
      if (!context.state.games.includes(gameName)) return;

      webSocket.send(`SELECT_GAME|${JSON.stringify(gameName)}`);
    },
    startGame(): void {
      webSocket.send("START_GAME");
    },
    handleAction(context, data: any): void {
      const actionInfo = {
        player: context.state.player,
        action: data.action,
        item: data.item,
      };

      webSocket.send(`HANDLE_ACTION|${JSON.stringify(actionInfo)}`);
    },
    resetGame(): void {
      webSocket.send("RESET_GAME");
    },
  },
  getters: {},
});

webSocket.registerStore(store);

export default store;
