import { getHashCode } from "./get-hash-code";

export interface Comparable {
  _hashCode: number;
}

export function createComparable<T>(value: T): Comparable {
  return {
    _hashCode: getHashCode(value),
  };
}

/**
 * Check if two Comparable objects are equal by comparing their hash codes.
 * @param b - The second Comparable object to compare.
 * @returns A function that takes the first Comparable object and returns true if both hash codes are equal.
 */
export const equals =
  (b: Comparable) =>
  (a: Comparable): boolean => {
    return a._hashCode === b._hashCode;
  };

/**
 * Compare two Comparable objects based on their hash codes.
 * Returns -1 if a < b, 0 if a === b, and 1 if a > b.
 * @param b - The second Comparable object to compare.
 * @returns A function that takes the first Comparable object and compares it to the second.
 */
export const compare =
  (b: Comparable) =>
  (a: Comparable): number => {
    if (a._hashCode < b._hashCode) {
      return -1;
    }
    if (a._hashCode > b._hashCode) {
      return 1;
    }
    return 0;
  };
