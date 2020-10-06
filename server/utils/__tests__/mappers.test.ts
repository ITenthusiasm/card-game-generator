import { mocked } from "ts-jest/utils";
import { convertToJSON, getEnumValues } from "../mappers";

jest.spyOn(console, "error").mockImplementation();
const mockConsoleError = mocked(console.error, true);

describe("Mappers", () => {
  class TestClass {
    a: string;
    b: string;
    #c = "c";

    constructor() {
      this.a = "a";
      this.b = "b";
    }

    get c() {
      return this.#c;
    }

    get testError() {
      throw new Error();
      return this.#c;
    }
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("covertToJSON enables an object to maintain getter info during JSON serialization", () => {
    const instance = new TestClass();

    const incompleteObject = JSON.parse(JSON.stringify(instance));
    const jsonObject = JSON.parse(JSON.stringify(convertToJSON(instance)));

    expect(jsonObject.a).toBe(incompleteObject.a);
    expect(jsonObject.b).toBe(incompleteObject.b);
    expect(incompleteObject.c).toBeUndefined();
    expect(jsonObject.c).toBe("c");
  });

  test("convertToJSON skips properties that cause errors, logging any messages", () => {
    const instance = new TestClass();

    const jsonObject = JSON.parse(JSON.stringify(convertToJSON(instance)));
    expect(jsonObject.testError).toBeUndefined();
    expect(mockConsoleError.mock.calls[0][0]).toMatchInlineSnapshot(
      `"Error calling property testError"`
    );
    expect(mockConsoleError.mock.calls[0][1]).toBeInstanceOf(Error);
  });

  test("getEnumValues returns only the values from a TypeScript enum and ignores all keys", () => {
    enum TestEnum {
      One = 1,
      Two = 2,
      Three = "Three",
    }

    const enumKeysAndValues = Object.keys(TestEnum);
    const enumValues = getEnumValues(TestEnum);

    expect(enumValues).toStrictEqual([1, 2, "Three"]);
    expect(enumValues).not.toStrictEqual(enumKeysAndValues);
  });
});
