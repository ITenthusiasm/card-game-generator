<template>
  <div id="root">
    <header>
      <h1 align="center">Fun Card Games (Experiment)</h1>
      <h3 v-if="player" align="center">
        Player: {{ `${player.name} | ${player.id}` }}
      </h3>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";

export default Vue.extend({
  name: "App",
  computed: mapState(["player"]),
});
</script>

<style>
#root {
  font-size: 18px;
  font-family: "Roboto", sans-serif;
  color: blue;
}

.link {
  color: blue;
}
</style>
