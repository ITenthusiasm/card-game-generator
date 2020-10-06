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
