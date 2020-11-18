<template>
  <div>
    <form
      v-if="gameInactive"
      aria-label="game-settings"
      @submit.prevent="updatePlayer"
    >
      <label for="team">Team</label>
      <BaseSelect id="team" v-model="playerTeam">
        <option value="" disabled>Select a team</option>
        <option value="Red">Red</option>
        <option value="Blue">Blue</option>
      </BaseSelect>

      <label for="role">Role</label>
      <BaseSelect id="role" v-model="playerRole">
        <option value="" disabled>Choose a role</option>
        <option value="Codemaster">Codemaster</option>
        <option value="Agent">Agent</option>
      </BaseSelect>

      <BaseButton type="submit">Send Player Data</BaseButton>
    </form>

    <div v-else aria-label="game">
      <div class="game-board">
        <div class="cards-box">
          <CodenamesCard
            v-for="card in gameState.cards"
            :key="card.value"
            :card="card"
            @click.native="reveal(card)"
          />
        </div>
      </div>

      <form @submit.prevent="sendCode">
        <label for="code-word">Code</label>
        <BaseInput id="code-word" v-model="word" />

        <label for="code-number">Number</label>
        <BaseInput id="code-number" v-model="number" />

        <BaseButton type="submit">Send Code</BaseButton>
      </form>
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
      playerTeam: "",
      playerRole: "",
      word: "",
      number: "",
    };
  },
  computed: {
    ...mapState(["gameState"]),
    gameInactive(): boolean {
      return !this.gameState.status || this.gameState.status === "Inactive";
    },
  },
  methods: {
    updatePlayer(): void {
      const playerInfo = { team: this.playerTeam, role: this.playerRole };

      this.$store.dispatch("updatePlayer", playerInfo);
    },
    sendCode(): void {
      const gameWords = this.gameState.cards.map((c: any) => c.value);
      const code = { word: this.word.trim(), number: Number(this.number) };

      // Code must use a physical word that is not on the board
      if (!code.word.length || gameWords.includes(code.word)) return;

      // Code must use a number that is a positive integer
      if (!Number.isInteger(code.number) || code.number < 0) return;

      this.$store.dispatch("handleAction", { action: "Give Code", item: code });
      this.word = "";
      this.number = "";
    },
    reveal(card: any): void {
      if (card.revealed || this.gameState.status === "Completed") return;

      this.$store.dispatch("handleAction", { action: "Reveal", item: card });
    },
  },
});
</script>

<style scoped>
.game-board {
  display: flex;
  justify-content: center;
}

.cards-box {
  width: 700px;
  height: 600px;

  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(5, 1fr);
  justify-items: center;
  align-items: center;
}

form {
  text-align: center;
}
</style>
