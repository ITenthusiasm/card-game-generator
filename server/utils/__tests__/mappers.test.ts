import { convertToJSON, getEnumValues } from "../mappers";

const mockConsoleError = jest.spyOn(console, "error").mockImplementation();

describe("Mappers", () => {
  class TestClass {
    a = "a";
    #b = "b";
    protected _c = "c"; // JSON-Excluded

    get b() {
      return this.#b;
    }

    // JSON-Excluded
    private get _d() {
      return this.#b;
    }

    // JSON-Excluded
    get testError() {
      throw new Error();
      return this.#b;
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
    expect(incompleteObject.b).toBeUndefined();
    expect(jsonObject.b).toBe("b");
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

  test("convertToJSON ignores properties starting with an underscore (for pseudo 'protected'/'private' properties)", () => {
    const instance = new TestClass();

    const jsonObject = JSON.parse(JSON.stringify(convertToJSON(instance)));
    expect(jsonObject._c).toBeUndefined();
    expect(jsonObject._d).toBeUndefined();
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
