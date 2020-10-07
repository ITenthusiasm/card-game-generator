import { randomSample, randomString } from "../algorithms";
import { dedupe } from "../arrayUtils";

// Arrays must be UNIQUE for all tests here
describe("Algorithms", () => {
  test("randomSample randomly pulls a sample of specified size from an array", () => {
    const array = [...Array(25)].map((_, i) => i);
    const sampleSizeN = 5;

    const sample = randomSample(array, sampleSizeN);
    expect(sample.length).toBe(sampleSizeN);
    sample.forEach(item => expect(array).toContain(item));

    // May randomly fail if the initial N items remain unchanged after the random sample (rare)
    expect(sample).not.toEqual(array.slice(0, sampleSizeN));
  });

  test("randomSample removes the sampled items from the original array when 'modify' is true", () => {
    const array = [...Array(25)].map((_, i) => i);

    const sample = randomSample(array, 5, true);
    sample.forEach(item => expect(array).not.toContain(item));
  });

  test("randomString creates a random 9-character string", () => {
    const array = [...Array(1000)].map(randomString);
    const uniqueArray = array.filter(dedupe);

    // All strings are of the correct format
    array.forEach(s => expect(s).toMatch(/[0-9a-z]{9}/));

    // All strings "should be unique" since they were randomly generated
    expect(uniqueArray.length).toBe(array.length);
  });
});
