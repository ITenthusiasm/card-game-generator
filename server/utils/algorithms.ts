/** Obtains a random sample from an array. Function uses
 * algorithm L for the Resevoir Algorithm.
 * @param population - Array from which to pull the sample
 * @param number - The number of items to sample from the array
 * @param modify - Indicates whether or not the original array should be modified
 * @returns The sample obtained from the population
 */
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
  // items that were selected from itself. This is really only useful if you
  // want to apply the random sample repeatedly, like when preparing a
  // Codenames deck. This is only done if the caller requests it. Note
  // that we choose to use indeces for filtering in case of duplicate items.
  // Also note that splice alone won't work because it modifies an array while looping.
  // We need to get the new array, then force the ORIGINAL reference (not the copy) to the new value with splice.
  if (modify) {
    const newGroup = population.filter((_, n) => !chosenIndices.includes(n));
    population.splice(0, population.length, ...newGroup);
  }

  return sample;
}

/** Generates a random 8-character string (0-9, a-z only) */
function randomString(): string {
  return Math.random().toString(36).substring(2, 10);
}

export { randomSample, randomString };
