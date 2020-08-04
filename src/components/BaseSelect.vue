<template>
  <select
    :id="id"
    class="select-box"
    :style="styles"
    :value="value"
    @input="$emit('input', $event.target.value)"
  >
    <slot></slot>
  </select>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "BaseSelect",
  props: {
    id: { type: String, default: "" },
    value: { type: String, required: true },
    styles: { type: Object, default: (): any => null },
  },
});
</script>

<style scoped>
.select-box {
  padding: 0.5rem;
  border: 2px solid #42424242;
  border-radius: 5px;
  margin: 0.75rem 0rem;
  font-size: 1rem;
  background: white;
  display: inline-block;
  outline: none;
  box-shadow: inset 0 1px 2px rgba(27, 31, 35, 0.075);
}

.select-box:focus {
  border-color: #2188ff;
  box-shadow: 0 0 0 3px rgba(3, 102, 214, 0.3);
}
</style>
