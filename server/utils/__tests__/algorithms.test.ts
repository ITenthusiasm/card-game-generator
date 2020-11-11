import { randomSample, randomString } from "../algorithms";
import { dedupe } from "../arrayUtils";

// Arrays must be UNIQUE for all tests here
describe("Algorithms", () => {
  test("randomSample randomly pulls a sample of specified size from an array", () => {
    const population = [...Array(25).keys()];
    const sampleSizeN = 5;

    const sample = randomSample(population, sampleSizeN);
    expect(sample.length).toBe(sampleSizeN);
    sample.forEach(item => expect(population).toContain(item));

    // May randomly fail if the initial N items remain unchanged after the random sample (rare)
    expect(sample).not.toEqual(population.slice(0, sampleSizeN));
  });

  test("randomSample removes the sampled items from the original array when 'modify' is true", () => {
    const population = [...Array(25).keys()];

    const sample = randomSample(population, 5, true);
    sample.forEach(item => expect(population).not.toContain(item));

    const otherSample = randomSample(population, 5);
    otherSample.forEach(item => expect(population).toContain(item));
  });

  test("randomString creates a random 8-character string", () => {
    const array = [...Array(1000)].map(randomString);
    const uniqueArray = array.filter(dedupe);

    // All strings are of the correct format
    array.forEach(s => expect(s).toMatch(/[0-9a-z]{8}/));

    // All strings "should be unique" since they were randomly generated
    expect(uniqueArray.length).toBe(array.length);
  });
});
