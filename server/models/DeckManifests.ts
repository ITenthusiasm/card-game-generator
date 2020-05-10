import { CardTypes, CardValues } from "./enums";
import type { CardType, CardValue } from "./enums/types";
import { UnoSchematic, ClassicSchematic } from "./DeckSchematics";
import { generateCardVals } from "../utils/mappers";
import { randomSample } from "../utils/algorithms";

export type DeckManifest = Map<CardType, CardValue[]>;

export const ClassicManifest: DeckManifest = new Map([
  [CardTypes.Classic.Hearts, generateCardVals(ClassicSchematic)],
  [CardTypes.Classic.Spades, generateCardVals(ClassicSchematic)],
  [CardTypes.Classic.Diamonds, generateCardVals(ClassicSchematic)],
  [CardTypes.Classic.Clubs, generateCardVals(ClassicSchematic)],
]);

export const UnoManifest: DeckManifest = new Map([
  [CardTypes.Uno.Red, generateCardVals(UnoSchematic)],
  [CardTypes.Uno.Yellow, generateCardVals(UnoSchematic)],
  [CardTypes.Uno.Green, generateCardVals(UnoSchematic)],
  [CardTypes.Uno.Blue, generateCardVals(UnoSchematic)],
]);

export function createCodenamesManifest(): DeckManifest {
  const codenamesManifest = new Map<CardTypes.Codenames, CardValue[]>();

  // Ranodmly extract 25 UNIQUE word array (card values) from a larger collection of options
  const codenameValues = randomSample(CardValues.Codenames, 25);

  // Randomly determine whether blue or red is larger
  const moreRed = Math.random() < 0.5;
  const redAmount = moreRed ? 8 : 7;
  const blueAmount = moreRed ? 7 : 8;

  // Randomly generate 7/8 UNIQUE red cards
  codenamesManifest.set(
    CardTypes.Codenames.Red,
    randomSample(codenameValues, redAmount, true)
  );

  // Randomly generate 8/7 UNIQUE blue cards from remaining cards
  codenamesManifest.set(
    CardTypes.Codenames.Blue,
    randomSample(codenameValues, blueAmount, true)
  );

  // Randomly generate 1 black card from remaining cards
  codenamesManifest.set(
    CardTypes.Codenames.Black,
    randomSample(codenameValues, 1, true)
  );

  // Assign brown to the remaining cards
  codenamesManifest.set(CardTypes.Codenames.Brown, [...codenameValues]);

  return codenamesManifest;
}
