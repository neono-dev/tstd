import { type Branded, brand } from "../brand";
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
import { isBetweenInclusive } from "./utils";

//#region i8
export type I8 = Branded<number, "i8">;
const toI8 = brand<number, "i8">;

export const i8 = (value: number | bigint): I8 => {
  if (typeof value === "bigint") {
    return toI8(Number((value & 0x7fn) - (value & 0x80n)));
  }
  return toI8((value & 0x7f) - (value & 0x80));
};

/**
 * Checks if a number is a signed 8-bit (1 byte) integer.
 * @param value - The number to check.
 * @returns `true` if the number is a signed 8-bit (1 byte) integer, `false` otherwise.
 * @example
 * ```ts
 * isI8(127); // true
 * isI8(128); // false
 * ```
 */
export const isI8 = isBetweenInclusive(I8_MIN, I8_MAX);
//#endregion

//#region i16
export type I16 = Branded<number, "i16">;
const toI16 = brand<number, "i16">;

export const i16 = (value: number | bigint): I16 => {
  if (typeof value === "bigint") {
    return toI16(Number((value & 0x7fffn) - (value & 0x8000n)));
  }
  return toI16((value & 0x7fff) - (value & 0x8000));
};

/**
 * Checks if a number is a signed 16-bit (2 bytes) integer.
 * @param value - The number to check.
 * @returns `true` if the number is a signed 16-bit (2 bytes) integer, `false` otherwise.
 * @example
 * ```ts
 * isI16(32_767); // true
 * isI16(32_768); // false
 * ```
 */
export const isI16 = isBetweenInclusive(I16_MIN, I16_MAX);
//#endregion

//#region i32
export type I32 = Branded<number, "i32">;
const toI32 = brand<number, "i32">;

export const i32 = (value: number | bigint): I32 => {
  if (typeof value === "bigint") {
    return toI32(Number((value & 0x7fffffffn) - (value & 0x80000000n)));
  }
  return toI32((value & 0x7fffffff) - (value & 0x80000000));
};

/**
 * Checks if a number is a signed 32-bit (4 bytes) integer.
 * @param value - The number to check.
 * @returns `true` if the number is a signed 32-bit (4 bytes) integer, `false` otherwise.
 * @example
 * ```ts
 * isI32(2_147_483_647); // true
 * isI32(2_147_483_648); // false
 * ```
 */
export const isI32 = isBetweenInclusive(I32_MIN, I32_MAX);
//#endregion

//#region u8
export type U8 = Branded<number, "u8">;
const toU8 = brand<number, "u8">;

export const u8 = (value: number | bigint): U8 => {
  if (typeof value === "bigint") {
    return toU8(Number(value & 0xffn));
  }
  return toU8(value & 0xff);
};

/**
 * Checks if a number is an unsigned 8-bit (1 byte) integer.
 * @param value - The number to check.
 * @returns `true` if the number is an unsigned 8-bit (1 byte) integer, `false` otherwise.
 * @example
 * ```ts
 * isU8(255); // true
 * isU8(256); // false
 * ```
 */
export const isU8 = isBetweenInclusive(U8_MIN, U8_MAX);
//#endregion

//#region u16
export type U16 = Branded<number, "u16">;
const toU16 = brand<number, "u16">;

export const u16 = (value: number | bigint): U16 => {
  if (typeof value === "bigint") {
    return toU16(Number(value & 0xffffn));
  }
  return toU16(value & 0xffff);
};

/**
 * Checks if a number is an unsigned 16-bit (2 bytes) integer.
 * @param value - The number to check.
 * @returns `true` if the number is an unsigned 16-bit (2 bytes) integer, `false` otherwise.
 * @example
 * ```ts
 * isU16(65_535); // true
 * isU16(65_536); // false
 * ```
 */
export const isU16 = isBetweenInclusive(U16_MIN, U16_MAX);
//#endregion

//#region u32
export type U32 = Branded<number, "u32">;
const toU32 = brand<number, "u32">;

export const u32 = (value: number | bigint): U32 => {
  if (typeof value === "bigint") {
    return toU32(Number(value & 0xffffffffn));
  }
  return toU32(value & 0xffffffff);
};

/**
 * Checks if a number is an unsigned 32-bit (4 bytes) integer.
 * @param value - The number to check.
 * @returns `true` if the number is an unsigned 32-bit (4 bytes) integer, `false` otherwise.
 * @example
 * ```ts
 * isU32(4_294_967_295); // true
 * isU32(4_294_967_296); // false
 * ```
 */
export const isU32 = isBetweenInclusive(U32_MIN, U32_MAX);
//#endregion

//#region f32
export type F32 = Branded<number, "f32">;
const toF32 = brand<number, "f32">;

export const f32 = (value: number): F32 => toF32(value);

/**
 * Checks if a number is a 32-bit (4 bytes) floating-point number.
 * @param value - The number to check.
 * @returns `true` if the number is a 32-bit (4 bytes) floating-point number, `false` otherwise.
 * @example
 * ```ts
 * isF32(3.4e38); // true
 * isF32(3.5e38); // false
 * ```
 */
export const isF32 = isBetweenInclusive(F32_MIN, F32_MAX);
//#endregion
