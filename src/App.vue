<template>
  <div id="root">
    <header>
      <h1 align="center">Fun Card Games (Experiment)</h1>
    </header>
    <main>
      <router-view />
      <GameSelection v-if="player" />
      <div v-if="selectedGame">
        <form @submit.prevent="updatePlayerInfo">
          <label for="team">Team</label>
          <input id="team" v-model="playerTeam" type="text" />

          <label for="role">Role</label>
          <input id="role" v-model="playerRole" type="text" />

          <button type="submit">Send Player Data</button>
        </form>
      </div>
      <button class="button" @click="startGame">start game</button>
      <Codenames v-if="gameState.active" />
    </main>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import GameSelection from "@/components/GameSelection.vue";
import Codenames from "@/components/Codenames.vue";

export default Vue.extend({
  name: "App",
  components: { GameSelection, Codenames },
  data() {
    return {
      playerTeam: "",
      playerRole: "",
    };
  },
  computed: mapState(["player", "selectedGame", "gameState"]),
  methods: {
    updatePlayerInfo(): void {
      const playerInfo = { team: this.playerTeam, role: this.playerRole };

      this.$store.dispatch("updatePlayer", playerInfo);
    },
    startGame(): void {
      this.$store.dispatch("startGame");
    },
  },
});
</script>

<style>
#root {
  font-size: 18px;
  font-family: "Roboto", sans-serif;
  color: blue;
}

.button {
  min-height: 2rem;
  background: red;
  border: 2px solid #42424242;
  border-radius: 5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  color: white;
  font-size: 1rem;
  outline: none;
  padding: 0.5rem;
  text-align: center;
}

.button:hover {
  cursor: pointer;
}
</style>
