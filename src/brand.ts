declare const __brand: unique symbol;
export type Brand<B> = { [__brand]: B };
export type Branded<T, B> = T & Brand<B>;
export type BrandOf<T> = T extends Branded<unknown, infer B> ? B : never;
export type Unbranded<T> = T extends Branded<infer U, unknown> ? U : never;

export const brand = <T, B>(value: T): Branded<T, B> => value as Branded<T, B>;
export const unbrand = <T, B>(value: Branded<T, B>): T => value as T;
