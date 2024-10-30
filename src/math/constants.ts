/**
 * The golden ratio.
 * φ or ϕ
 * @link https://en.wikipedia.org/wiki/Golden_ratio
 */
export const PHI = (1 + Math.sqrt(5)) / 2;

/**
 * The golden angle in degrees.
 * 360° / φ
 * @link https://en.wikipedia.org/wiki/Golden_angle
 */
export const GOLDEN_ANGLE = 360 / PHI;

/**
 * The golden angle in radians.
 * @link https://simple.wikipedia.org/wiki/Tau_(mathematical_constant)
 */
export const TAU = 2 * Math.PI;

// Minimum value of a signed 8-bit (1 byte) integer.
export const I8_MIN = -128;
// Maximum value of a signed 8-bit (1 byte) integer.
export const I8_MAX = 127;

// Minimum value of a signed 16-bit (2 bytes) integer.
export const I16_MIN = -32_768;
// Maximum value of a signed 16-bit (2 bytes) integer.
export const I16_MAX = 32_767;

// Minimum value of a signed 32-bit (4 bytes) integer.
export const I32_MIN = -2_147_483_648;
// Maximum value of a signed 32-bit (4 bytes) integer.
export const I32_MAX = 2_147_483_647;

// Minimum value of an unsigned 8-bit (1 byte) integer.
export const U8_MIN = 0;
// Maximum value of an unsigned 8-bit (1 byte) integer.
export const U8_MAX = 255;

// Minimum value of an unsigned 16-bit (2 bytes) integer.
export const U16_MIN = 0;
// Maximum value of an unsigned 16-bit (2 bytes) integer.
export const U16_MAX = 65_535;

// Minimum value of an unsigned 32-bit (4 bytes) integer.
export const U32_MIN = 0;
// Maximum value of an unsigned 32-bit (4 bytes) integer.
export const U32_MAX = 4_294_967_295;

// Minimum value of a 32-bit (4 bytes) floating-point number.
export const F32_MIN = -3.4e38;
// Maximum value of a 32-bit (4 bytes) floating-point number.
export const F32_MAX = 3.4e38;
