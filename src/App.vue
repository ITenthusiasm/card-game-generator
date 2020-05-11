<template>
  <div id="root">{{ message }}</div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",
  data() {
    return {
      message: "Hello World",
    };
  },
});
</script>

<style>
#root {
  font-size: 18px;
  font-family: "Roboto", sans-serif;
  color: blue;
}
</style>
