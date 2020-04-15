import { CardValues } from "./enums";
import type { CardValue } from "./enums/types";

export type DeckSchematic = Map<CardValue, number>;

// Number of cards for each Classic Suit
export const ClassicSchematic: DeckSchematic = new Map([
  [CardValues.Classic.A, 1],
  [CardValues.Classic.Two, 1],
  [CardValues.Classic.Three, 1],
  [CardValues.Classic.Four, 1],
  [CardValues.Classic.Five, 1],
  [CardValues.Classic.Six, 1],
  [CardValues.Classic.Seven, 1],
  [CardValues.Classic.Eight, 1],
  [CardValues.Classic.Nine, 1],
  [CardValues.Classic.Ten, 1],
  [CardValues.Classic.J, 1],
  [CardValues.Classic.Q, 1],
  [CardValues.Classic.K, 1],
]);

// Number of cards for each Uno Color
export const UnoSchematic: DeckSchematic = new Map([
  [CardValues.Uno.Zero, 1],
  [CardValues.Uno.One, 2],
  [CardValues.Uno.Two, 2],
  [CardValues.Uno.Three, 2],
  [CardValues.Uno.Four, 2],
  [CardValues.Uno.Five, 2],
  [CardValues.Uno.Six, 2],
  [CardValues.Uno.Seven, 2],
  [CardValues.Uno.Eight, 2],
  [CardValues.Uno.Nine, 2],
  [CardValues.Uno.Skip, 2],
  [CardValues.Uno.Reverse, 2],
  [CardValues.Uno.Draw2, 2],
  [CardValues.Uno.Wild, 1],
  [CardValues.Uno.WildDraw, 1],
]);
