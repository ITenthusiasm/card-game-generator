import type { CardType, CardValue } from "./enums/types";

class Card {
  type: CardType;
  value: CardValue;

  constructor(type: CardType, value: CardValue) {
    this.type = type;
    this.value = value;
  }
}

export default Card;
