/**
 * Checks if a number is between a minimum and a maximum value (inclusive).
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns A function that takes a number and returns `true` if the number is between the minimum and maximum values (inclusive), `false` otherwise.
 * @example
 * ```ts
 * const isAdult = isBetweenInclusive(18, 65);
 * isAdult(16); // false
 * isAdult(18); // true
 * isAdult(65); // true
 * isAdult(66); // false
 * ```
 */
export const isBetweenInclusive = (min: number, max: number) => (value: number) =>
  value >= min && value <= max;

/**
 * Checks if a number is between a minimum and a maximum value (exclusive).
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns A function that takes a number and returns `true` if the number is between the minimum and maximum values (exclusive), `false` otherwise.
 * @example
 * ```ts
 * const isAdult = isBetweenExclusive(18, 65);
 * isAdult(18); // false
 * isAdult(19); // true
 * isAdult(65); // false
 * isAdult(64); // true
 * ```
 */
export const isBetweenExclusive = (min: number, max: number) => (value: number) =>
  value > min && value < max;
