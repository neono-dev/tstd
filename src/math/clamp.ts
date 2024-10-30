import {
  F32_MAX,
  F32_MIN,
  I8_MAX,
  I8_MIN,
  I16_MAX,
  I16_MIN,
  I32_MAX,
  I32_MIN,
  U8_MAX,
  U8_MIN,
  U16_MAX,
  U16_MIN,
  U32_MAX,
  U32_MIN,
} from "./constants";

/**
 * Clamps a number between a minimum and a maximum value.
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns A function that takes a number and returns the clamped number.
 * @example
 * ```ts
 * const forceAgeToBeBetween18And65 = clamp(18, 65);
 * forceAgeToBeBetween18And65(16); // 18
 * ```
 */
export const clamp = (min: number, max: number) => (value: number) => Math.min(Math.max(value, min), max);

/**
 * Clamps a number between the minimum and maximum values of a signed 8-bit (1 byte) integer.
 * @param value - The number to clamp.
 * @returns The clamped number.
 * @example
 * ```ts
 * clampI8(128); // 127
 * ```
 */
export const clampI8 = clamp(I8_MIN, I8_MAX);
/**
 * Clamps a number between the minimum and maximum values of a signed 16-bit (2 bytes) integer.
 * @param value - The number to clamp.
 * @returns The clamped number.
 * @example
 * ```ts
 * clampI16(32_768); // 32_767
 * ```
 */
export const clampI16 = clamp(I16_MIN, I16_MAX);
/**
 * Clamps a number between the minimum and maximum values of a signed 32-bit (4 bytes) integer.
 * @param value - The number to clamp.
 * @returns The clamped number.
 * @example
 * ```ts
 * clampI32(2_147_483_648); // 2_147_483_647
 * ```
 */
export const clampI32 = clamp(I32_MIN, I32_MAX);

/**
 * Clamps a number between the minimum and maximum values of an unsigned 8-bit (1 byte) integer.
 * @param value - The number to clamp.
 * @returns The clamped number.
 * @example
 * ```ts
 * clampU8(256); // 255
 * ```
 */
export const clampU8 = clamp(U8_MIN, U8_MAX);
/**
 * Clamps a number between the minimum and maximum values of an unsigned 16-bit (2 bytes) integer.
 * @param value - The number to clamp.
 * @returns The clamped number.
 * @example
 * ```ts
 * clampU16(65_536); // 65_535
 * ```
 */
export const clampU16 = clamp(U16_MIN, U16_MAX);
/**
 * Clamps a number between the minimum and maximum values of an unsigned 32-bit (4 bytes) integer.
 * @param value - The number to clamp.
 * @returns The clamped number.
 * @example
 * ```ts
 * clampU32(4_294_967_296); // 4_294_967_295
 * ```
 */
export const clampU32 = clamp(U32_MIN, U32_MAX);

/**
 * Clamps a number between the minimum and maximum values of a 32-bit (4 bytes) floating-point number.
 * @param value - The number to clamp.
 * @returns The clamped number.
 * @example
 * ```ts
 * clampF32(3.5e38); // 3.4e38
 * ```
 */
export const clampF32 = clamp(F32_MIN, F32_MAX);
