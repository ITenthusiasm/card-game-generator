<template>
  <div class="games-list">
    <div
      v-for="game in games"
      :key="game"
      class="game-card"
      @click="selectGame(game)"
    >
      {{ game }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapActions } from "vuex";

export default Vue.extend({
  name: "GameSelection",
  computed: mapState(["games"]),
  methods: mapActions(["selectGame"]),
});
</script>

<style scoped>
.games-list {
  display: flex;
  justify-content: space-around;
}

.game-card {
  cursor: pointer;
}
</style>
