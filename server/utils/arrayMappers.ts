import type { DeckSchematic } from "../models/DeckSchematics";
import type { CardValue } from "../models/enums/types";

// helpers
const keyIsNotNumber = (key: string): boolean => isNaN(Number(key));

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

/* Deprecated */
export function enumToArray<T>(enumeration: object): T[] {
  // Typescript enums duplicate data that represents numbers;
  // they create stringified number properties. Remove those.
  return Object.keys(enumeration)
    .filter(keyIsNotNumber)
    .map<T>(k => enumeration[k]);
}
