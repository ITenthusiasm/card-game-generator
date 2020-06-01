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
      if (this.word.trim().length && !isNaN(Number(this.number))) {
        const code = { word: this.word, number: Number(this.number) };
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

.card {
  width: 7rem;
  height: 5rem;

  display: flex;
  justify-content: center;
  align-items: center;

  background: white;
  border: 2px solid #42424242;
  border-radius: 5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  position: relative;
  transition: all 0.3s linear;
  text-align: left;
  overflow-wrap: break-word;
}

.card:hover {
  transform: scale(1.25, 1.25);
}

.card::after {
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: -1;

  border-radius: 5px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  opacity: 0;
  position: absolute;
  transition: all 0.3s linear;
}

.card:hover::after {
  opacity: 1;
}
</style>
