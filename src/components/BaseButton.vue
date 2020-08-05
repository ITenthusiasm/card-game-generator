<template>
  <button
    :id="id"
    class="button"
    :style="styles"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "BaseButton",
  props: {
    id: { type: String, default: "" },
    styles: { type: Object, default: (): any => null },
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
