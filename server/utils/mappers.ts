import type { DeckSchematic } from "../models/DeckSchematics";
import type { CardValue } from "../models/enums/types";

// helpers
function stringIsNotNumber(string: string): boolean {
  return !isNaN(Number(string));
}

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

export function enumToValues(enumeration: object): (string | number)[] {
  return Object.keys(enumeration)
    .filter(stringIsNotNumber)
    .map(k => enumeration[k]);
}
