<template>
  <div v-if="player">
    <GameSelection />

    <div v-if="selectedGame" aria-label="game-screen">
      <BaseButton @click="startGame">Start Game</BaseButton>
      <BaseButton @click="resetGame">New Game</BaseButton>
      <component :is="selectedGame" />
    </div>
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
