/** Predicate function to be passed to `Array.filter`.
 * Removes duplicates from an array.
 */
export function dedupe<T>(value: T, index: number, array: T[]): boolean {
  return array.indexOf(value) === index;
}
