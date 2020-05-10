import type { DeckSchematic } from "../models/DeckSchematics";
import type { CardValue } from "../models/enums/types";

// main
export function generateCardVals(schematic: DeckSchematic): CardValue[] {
  const cardValues: CardValue[] = [];

  schematic.forEach((quantity, cardValue) => {
    for (let i = 1; i <= quantity; i++) {
      cardValues.push(cardValue);
    }
  });

  return cardValues;
}
