import { dedupe } from "../arrayUtils";

describe("Array Utilities", () => {
  test("dedupe removes duplicates from an array when passed to Array.filter", () => {
    const array = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4];
    const uniqueArray = [1, 2, 3, 4];

    const dedupedArray = array.filter(dedupe);
    expect(dedupedArray).toStrictEqual(uniqueArray);
  });
});
