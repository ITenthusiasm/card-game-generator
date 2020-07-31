import Vue from "vue";
import Vuex from "vuex";
import webSocket from "../sockets";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    player: null as any,
    players: {} as object[],
    games: [] as string[],
    selectedGame: "",
    gameState: {},
  },
  mutations: {
    SET_PLAYER(state, player): void {
      state.player = player;
      localStorage.setItem("player", JSON.stringify(player));
    },
    UPDATE_PLAYERS(state, players: any[]): void {
      state.players = players;

      state.player = players.find(p => p.id === state.player.id);
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
    addNewPlayer(context, playerName: string): void {
      if (context.state.player) return;

      webSocket.send(`ADD_NEW_PLAYER|${JSON.stringify(playerName)}`);
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

webSocket.addEventListener("message", function (message) {
  const [messageType, dataString] = message.data.split("|");
  const data = JSON.parse(dataString);

  switch (messageType) {
    case "SET_PLAYER": {
      store.commit("SET_PLAYER", data);
      break;
    }
    case "UPDATE_PLAYERS": {
      store.commit("UPDATE_PLAYERS", data);
      break;
    }
    case "SET_GAMES": {
      store.commit("SET_GAMES", data);
      break;
    }
    case "SET_GAME": {
      store.commit("SET_GAME", data);
      break;
    }
    case "SET_GAME_STATE": {
      store.commit("SET_GAME_STATE", data);
      break;
    }
    default: {
      break;
    }
  }
});

export default store;
