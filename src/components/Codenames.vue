<template>
  <div>
    <form @submit.prevent="sendCode">
      <label for="code-word">Code</label>
      <input id="code-word" v-model="word" />

      <label for="code-number">Number</label>
      <input id="code-number" v-model="number" />

      <button type="submit">SEND CODE</button>
    </form>
    <div align="center">
      <div class="card-box">
        <CodenamesCard
          v-for="card in gameState.cards"
          :key="card.value"
          :card="card"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import CodenamesCard from "@/components/CodenamesCard.vue";

export default Vue.extend({
  name: "Codenames",
  components: { CodenamesCard },
  data() {
    return {
      word: "",
      number: "",
    };
  },
  computed: mapState(["gameState"]),
  methods: {
    sendCode(): void {
      const number = Number(this.number);

      if (this.word.trim().length && Number.isInteger(number) && number >= 0) {
        const code = { word: this.word, number };
        const data = { action: "Give Code", item: code };

        this.$store.dispatch("handleAction", data);
      }

      this.word = "";
      this.number = "";
    },
  },
});
</script>

<style scoped>
.card-box {
  width: 700px;
  height: 600px;

  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(5, 1fr);
  justify-self: center;
  align-items: center;
}
</style>
