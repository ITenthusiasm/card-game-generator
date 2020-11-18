<template>
  <div class="codenames-card" :style="cardStyles">
    {{ card.value }}
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "CodenamesCard",
  props: {
    card: { type: Object, required: true },
  },
  computed: {
    cardStyles(): Partial<CSSStyleDeclaration> {
      return {
        color: this.color,
        backgroundColor: this.backgroundColor,
        fontWeight: "bold",
      };
    },
    color(): string {
      if (this.card.revealed) return "white";

      if (this.playerRole === "Codemaster" || this.gameStatus === "Completed")
        return this.mapColor(this.card.type);

      return "black";
    },
    backgroundColor(): string {
      return this.card.revealed ? this.mapColor(this.card.type) : "white";
    },
    playerRole(): string {
      return this.$store.state.player.role;
    },
    gameStatus(): string {
      return this.$store.state.gameState.status;
    },
  },
  methods: {
    mapColor(color: string): string {
      switch (color) {
        case "Red":
          return "#ff4242";
        case "Blue":
          return "#2d72dd";
        case "Brown":
          return "#e2bd97";
        default:
          return color;
      }
    },
  },
});
</script>

<style scoped>
.codenames-card {
  width: 7rem;
  height: 5rem;

  display: flex;
  justify-content: center;
  align-items: center;

  border: 2px solid #42424242;
  border-radius: 5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  position: relative;
  transition: all 0.3s linear;
  text-align: left;
  overflow-wrap: break-word;
}

.codenames-card:hover {
  transform: scale(1.25, 1.25);
}

.codenames-card::after {
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

.codenames-card:hover::after {
  opacity: 1;
}
</style>
