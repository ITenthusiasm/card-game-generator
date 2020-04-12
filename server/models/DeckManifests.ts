import { CardTypes, CardValues } from "./enums";
import { enumToArray } from "../utils/arrayMappers";

export const ClassicManifest: Map<
  CardTypes.Classic,
  CardValues.Classic[]
> = new Map([
  [CardTypes.Classic.Hearts, enumToArray(CardValues.Classic)],
  [CardTypes.Classic.Spades, enumToArray(CardValues.Classic)],
  [CardTypes.Classic.Diamonds, enumToArray(CardValues.Classic)],
  [CardTypes.Classic.Clubs, enumToArray(CardValues.Classic)],
]);

export const UnoManifest = new Map();
