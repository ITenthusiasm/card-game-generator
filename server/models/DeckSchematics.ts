import { CardValues } from "./enums";
import type { CardValue } from "./enums/types";

export type DeckSchematic = Map<CardValue, number>;

// Number of cards for each Classic Suit
export const ClassicSchematic: DeckSchematic = new Map([
  [CardValues.Classic.A, 1],
  [CardValues.Classic.TWO, 1],
  [CardValues.Classic.THREE, 1],
  [CardValues.Classic.FOUR, 1],
  [CardValues.Classic.FIVE, 1],
  [CardValues.Classic.SIX, 1],
  [CardValues.Classic.SEVEN, 1],
  [CardValues.Classic.EIGHT, 1],
  [CardValues.Classic.NINE, 1],
  [CardValues.Classic.TEN, 1],
  [CardValues.Classic.J, 1],
  [CardValues.Classic.Q, 1],
  [CardValues.Classic.K, 1],
]);

// Number of cards for each Uno Color
export const UnoSchematic: DeckSchematic = new Map([
  [CardValues.Uno.ZERO, 1],
  [CardValues.Uno.ONE, 2],
  [CardValues.Uno.TWO, 2],
  [CardValues.Uno.THREE, 2],
  [CardValues.Uno.FOUR, 2],
  [CardValues.Uno.FIVE, 2],
  [CardValues.Uno.SIX, 2],
  [CardValues.Uno.SEVEN, 2],
  [CardValues.Uno.EIGHT, 2],
  [CardValues.Uno.NINE, 2],
  [CardValues.Uno.SKIP, 2],
  [CardValues.Uno.REVERSE, 2],
  [CardValues.Uno.DRAW_2, 2],
  [CardValues.Uno.WILD, 1],
  [CardValues.Uno.WILD_DRAW, 1],
]);
