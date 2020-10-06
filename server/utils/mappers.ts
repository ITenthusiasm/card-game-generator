/** Converts an object to its JSON representation, including getters. */
export function convertToJSON(obj: Record<string, any>): Record<string, any> {
  const jsonObj = { ...obj };
  const proto = Object.getPrototypeOf(obj);

  Object.entries(Object.getOwnPropertyDescriptors(proto))
    .filter(([, descriptor]) => typeof descriptor.get === "function")
    .forEach(([key, descriptor]) => {
      // private properties (start with #) are automatically skipped
      if (descriptor && key[0] !== "_") {
        try {
          jsonObj[key] = obj[key];
        } catch (error) {
          console.error(`Error calling property ${key}`, error);
        }
      }
    });

  return jsonObj;
}

type enumValue = number | string;

/** Gets the values of a TypeScript Enum */
export function getEnumValues(en: Record<string, enumValue>): enumValue[] {
  return Object.keys(en)
    .filter(key => isNaN(Number(key)))
    .map(k => en[k]);
}
