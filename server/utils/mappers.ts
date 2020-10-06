/** Converts an object to its JSON representation, including getters. */
export function convertToJSON(obj: Record<string, any>): Record<string, any> {
  const jsonObj = { ...obj };

  // Remove pseudo "protected"/"private" properties from object.
  Object.entries(jsonObj).forEach(([key]) => {
    if (key[0] === "_") delete jsonObj[key];
  });

  const proto = Object.getPrototypeOf(obj);

  // Assign any public getters to object. Ignore pseudo "protected"/"private" getters.
  Object.entries(Object.getOwnPropertyDescriptors(proto))
    .filter(([, descriptor]) => typeof descriptor.get === "function")
    .forEach(([key, descriptor]) => {
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
