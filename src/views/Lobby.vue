<template>
  <div v-if="player">
    <GameSelection />

    <template v-if="selectedGame">
      <button class="button" @click="startGame">start game</button>
      <button class="button" @click="resetGame">new game</button>
      <component :is="selectedGame" />
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import GameSelection from "@/components/GameSelection.vue";
import Codenames from "@/components/Codenames.vue";

export default Vue.extend({
  name: "Lobby",
  components: { GameSelection, Codenames },
  computed: mapState(["player", "selectedGame"]),
  methods: {
    startGame(): void {
      this.$store.dispatch("startGame");
    },
    resetGame(): void {
      this.$store.dispatch("resetGame");
    },
  },
});
</script>

<style scoped>
.button {
  min-height: 2rem;
  background-color: red;
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
