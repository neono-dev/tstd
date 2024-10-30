/**
 * Generate a unique hash code for any given value.
 * @param value - The value to generate a hash for.
 * @returns A number representing the hash code for the value.
 */
export function getHashCode(value: unknown): number {
  if (value === null) {
    return 0;
  }

  switch (typeof value) {
    case "boolean":
      return value ? 1 : 0;

    case "number":
      return Number.isInteger(value) ? value | 0 : Math.floor(value * 1000000); // Adjust precision as needed

    case "string":
      return hashString(value);

    case "symbol":
      return hashString(value.toString());

    case "function":
      return hashString(value.toString());

    case "object":
      return Array.isArray(value)
        ? hashArray(value)
        : hashObject(value as Record<string, unknown>);

    default:
      return 0; // Handles undefined and any unrecognized types
  }
}

/**
 * Generate a hash code for a string.
 * @param str - The string to hash.
 * @returns A number representing the hash code.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return hash;
}

/**
 * Generate a hash code for an array by combining the hash codes of each element.
 * @param arr - The array to hash.
 * @returns A number representing the hash code of the array.
 */
function hashArray(arr: unknown[]): number {
  return arr.reduce<number>((acc, item) => {
    const itemHash = getHashCode(item);
    return (acc << 5) - acc + itemHash;
  }, 0);
}

/**
 * Generate a hash code for an object by hashing its keys and values.
 * @param obj - The object to hash.
 * @returns A number representing the hash code of the object.
 */
function hashObject(obj: Record<string, unknown>): number {
  const keys = Object.keys(obj).sort(); // Sort keys for consistent ordering
  return keys.reduce((acc, key) => {
    const keyHash = hashString(key);
    const valueHash = getHashCode(obj[key]);
    return (acc << 5) - acc + keyHash + valueHash;
  }, 0);
}
