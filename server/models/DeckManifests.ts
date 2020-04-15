/* eslint-disable @typescript-eslint/no-use-before-define */
import { CardTypes, CardValues } from "./enums";
import type { CardType, CardValue } from "./enums/types";
import { enumToArray, generateCardVals } from "../utils/arrayMappers";
import { UnoSchematic, ClassicSchematic } from "./DeckSchematics";

type DeckManifest = Map<CardType, CardValue[]>;

// export const ClassicManifest: DeckManifest = new Map([
//   [CardTypes.Classic.Hearts, enumToArray(CardValues.Classic)],
//   [CardTypes.Classic.Spades, enumToArray(CardValues.Classic)],
//   [CardTypes.Classic.Diamonds, enumToArray(CardValues.Classic)],
//   [CardTypes.Classic.Clubs, enumToArray(CardValues.Classic)],
// ]);

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

  // Randomly generate 7/8 UNIQUE blue cards from remaining cards
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

// Uses algorithm L for Reservoir Algorithm
function randomSample<T>(population: T[], size: number, modify = false): T[] {
  // Initialize sample
  const sample = population.slice(0, size);

  // Initialize array for keeping track of indices chosen for random sample (modify-only)
  const chosenIndices = [...Array(size).keys()];

  // Extract some Math library utilities
  const { exp, log, random, floor } = Math;

  // Initialize random number
  let w = exp(log(random()) / size);

  // loop for sampling
  let i = size - 1;
  let j: number;

  while (i <= population.length - 1) {
    i += floor(log(random()) / log(1 - w)) + 1;

    if (i <= population.length - 1) {
      // Replace a random item of the sample with item i
      j = floor(random() * size);
      sample[j] = population[i];

      w *= exp(log(random()) / size);

      if (modify) chosenIndices[j] = i;
    }
  }

  // Once the sampling is complete, the original population will remove the
  // items that were selected from the itself. This is really only useful if you
  // want to apply the random sample repeatedly, like when preparing a
  // Codenames deck. This is only done if the caller requests it. Note
  // that we choose to use indeces for filtering in case of duplicate items.
  // Also note that splice won't work because it modifies an array while looping.
  // We need to get the new array, then force the ORIGINAL reference (not the copy) to the new value.
  if (modify) {
    const newGroup = population.filter((_, n) => !chosenIndices.includes(n));
    population.splice(0, population.length, ...newGroup);
  }

  return sample;
}
