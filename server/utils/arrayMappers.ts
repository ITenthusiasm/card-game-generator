// helpers
const keyIsNotNumber = (key: string): boolean => isNaN(Number(key));

// main
export function enumToArray<T>(enumeration: object): T[] {
  // Typescript enums duplicate data that represents numbers;
  // they create stringified number properties. Remove those.
  return Object.keys(enumeration)
    .filter(keyIsNotNumber)
    .map<T>(k => enumeration[k]);
}
