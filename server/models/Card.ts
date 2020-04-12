import type { CardType } from "./enums/types";

class Card {
  type: CardType;
  value: any;

  constructor(type: CardType, value: any) {
    this.type = type;
    this.value = value;
  }
}

export default Card;
