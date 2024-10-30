import { match } from "ts-pattern";
import { UnknownException } from "./errors/UnknownException";

export type Ok<T> = { _tag: "Ok"; value: T };
export type Err<E> = { _tag: "Err"; error: E };
export type Result<T, E> = Ok<T> | Err<E>;

export const Ok = <T>(value: T): Result<T, never> => ({ _tag: "Ok", value });
export const Err = <E>(error: E): Result<never, E> => ({ _tag: "Err", error });

/**
 * Returns `true` if the result is an [`Ok`].
 *
 * @example
 * ```ts
 * const x: Result<number, string> = Ok(2);
 * console.log(isOk(x)); // true
 *
 * const x: Result<number, string> = Err("emergency failure");
 * console.log(isOk(x)); // false
 * ```
 *
 * @param self - The result to check.
 *
 * @see {@link isErr} if you want to check for an [`Err`] instead.
 * @see {@link unwrap} if you intended to assert that the result is an [`Ok`].
 */
export const isOk = <T, E>(self: Result<T, E>): self is Ok<T> => self._tag === "Ok";

/**
 * Returns `true` if the result is an [`Ok`] and the value satisfies the given predicate.
 *
 * @example
 * ```ts
 * const x: Result<number, string> = Ok(2);
 * console.log(isOkAnd((value) => value === 2)(x)); // true
 *
 * const x: Result<number, string> = Ok(3);
 * console.log(isOkAnd((value) => value === 2)(x)); // false
 *
 * const x: Result<number, string> = Err("emergency failure");
 * console.log(isOkAnd((value) => true)(x)); // false
 * ```
 *
 * @param predicate - The predicate to satisfy.
 */
export const isOkAnd =
  <T, E>(predicate: (value: T) => boolean) =>
  (self: Result<T, E>): boolean =>
    match(self)
      .with({ _tag: "Ok" }, ({ value }) => predicate(value))
      .otherwise(() => false);

/**
 * Returns `true` if the result is an [`Err`].
 *
 * @example
 * ```ts
 * const x: Result<number, string> = Ok(2);
 * console.log(isErr(x)); // false
 *
 * const x: Result<number, string> = Err("emergency failure");
 * console.log(isErr(x)); // true
 * ```
 * @param self - The result to check.
 */
export const isErr = <T, E>(self: Result<T, E>): self is Err<E> => self._tag === "Err";

/**
 * Returns `true` if the result is an [`Err`] and the value satisfies the given predicate.
 *
 * @example
 * ```ts
 * const x: Result<number, string> = Ok(2);
 * console.log(isErrAnd((error) => error === "emergency failure")(x)); // false
 *
 * const x: Result<number, string> = Err("emergency failure");
 * console.log(isErrAnd((error) => error === "emergency failure")(x)); // true
 *
 * const x: Result<number, string> = Err("not a 2");
 * console.log(isErrAnd((error) => error === "emergency failure")(x)); // false
 * ```
 *
 * @param predicate - The predicate to satisfy.
 */
export const isErrAnd =
  <T, E>(predicate: (error: E) => boolean) =>
  (self: Result<T, E>): boolean =>
    match(self)
      .with({ _tag: "Err" }, ({ error }) => predicate(error))
      .otherwise(() => false);

/**
 * Returns `res` if the result is [`Ok`], otherwise returns the [`Err`] value of `self`.
 *
 * Arguments passed to `and` are eagerly evaluated; if you are passing the
 * result of a function call, it is recommended to use [`and_then`], which is
 * lazily evaluated.
 *
 * [`and_then`]: Result.and_then
 *
 * @example
 * ```ts
 * const x: Result<number, string> = Ok(2);
 * const y: Result<string, string> = Err("late error");
 * console.log(and(y)(x)); // Err("late error")
 *
 * const x: Result<number, string> = Err("early error");
 * const y: Result<string, string> = Ok("foo");
 * console.log(and(y)(x)); // Err("early error")
 *
 * const x: Result<number, string> = Err("not a 2");
 * const y: Result<string, string> = Err("late error");
 * console.log(and(y)(x)); // Err("not a 2")
 *
 * const x: Result<number, string> = Ok(2);
 * const y: Result<string, string> = Ok("different result type");
 * console.log(and(y)(x)); // Ok("different result type")
 * ```
 * @param other
 */
export const and =
  <T, U, E>(other: Result<U, E>) =>
  (self: Result<T, E>): Result<U, E> =>
    match(self)
      .with({ _tag: "Ok" }, () => other)
      .otherwise((errorSelf) => errorSelf);

/**
 * Calls `op` if the result is [`Ok`], otherwise returns the [`Err`] value of `self`.
 *
 * This function can be used for control flow based on `Result` values.
 *
 * Often used to chain fallible operations that may return [`Err`].
 */
export const andThen =
  <T, U, E>(fn: (value: T) => Result<U, E>) =>
  (self: Result<T, E>): Result<U, E> =>
    match(self)
      .with({ _tag: "Ok" }, ({ value }) => fn(value))
      .otherwise((error) => error);

/**
 * Returns the contained [`Ok`] value.
 *
 * Because this function may throw, its use is generally discouraged.
 * Instead, prefer to use pattern matching and handle the [`Err`] case explicitly,
 * or call [`unwrapOr`] or [`unwrapOrElse`].
 *
 * - [`unwrapOr`] provides a default value if the result is an [`Err`].
 * - [`unwrapOrElse`] allows for a custom error value, or a function that generates such.
 *
 * @throws - If the value is an [`Err`], throws the error.
 *
 * @example should throw
 * ```ts
 * const x: Result<number, string> = Err("emergency failure");
 * console.log(unwrap(x)); // throws "emergency failure"
 * ```
 *
 * @example should return the value
 * ```ts
 * const x: Result<number, string> = Ok(2);
 * console.log(unwrap(x)); // 2
 * ```
 */
export const expect =
  <T, E>(message: string) =>
  (self: Result<T, E>): T => {
    return match(self)
      .with({ _tag: "Ok" }, ({ value }) => value)
      .otherwise(() => {
        throw new Error(message);
      });
  };

/**
 * Returns the contained [`Err`] value.
 *
 * @throws - Throw if the value is an [`Ok`], with a panic message including the passed message.
 * @param message - The panic message to use if this is an [`Ok`].
 * @example should throw
 * ```ts
 * const x: Result<number, string> = Ok(2);
 * console.log(expectErr("emergency failure")(x)); // throws "emergency failure"
 * ```
 *
 * @example should return the error
 * ```ts
 * const x: Result<number, string> = Err("emergency failure");
 * console.log(expectErr("This should not panic")(x)); // "emergency failure"
 * ```
 */
export const expectErr =
  <T, E>(message: string) =>
  (self: Result<T, E>): E => {
    return match(self)
      .with({ _tag: "Err" }, ({ error }) => error)
      .otherwise(() => {
        throw new Error(message);
      });
  };

/**
 * Converts from `Result<Result<T, E>, E>` to `Result<T, E>`.
 *
 * @example
 * ```ts
 * const x: Result<Result<number, string>, string> = Ok(Ok(2));
 * console.log(flatten(x)); // Ok(2)
 *
 * const x: Result<Result<number, string>, string> = Ok(Err("error"));
 * console.log(flatten(x)); // Err("error")
 *
 * const x: Result<Result<number, string>, string> = Err("error");
 * console.log(flatten(x)); // Err("error")
 * ```
 *
 * Flattening only removes one level of nesting at a time.
 *
 * @param self - The "outer" result.
 */
export const flatten = <T, E>(self: Result<Result<T, E>, E>): Result<T, E> =>
  match(self)
    .with({ _tag: "Ok" }, ({ value }) => value)
    .otherwise((error) => error);

/**
 * Calls a function with a reference to the contained value if [`Ok`].
 *
 * Returns the original `Result` regardless of the result of the function.
 *
 * @example
 * ```ts
 * const x: Result<number, string> = Ok(2);
 * const y = inspect((value) => console.log(value * 2))(x);
 * ```
 * @param fn - The function to call with the value.
 */
export const inspect =
  <T, E>(fn: (value: T) => void) =>
  (self: Result<T, E>): Result<T, E> =>
    match(self)
      .with({ _tag: "Ok" }, ({ value }) => {
        fn(value);
        return self;
      })
      .otherwise(() => self);

/**
 * Calls a function with a reference to the contained error if [`Err`].
 *
 * Returns the original `Result` regardless of the result of the function.
 *
 * @example
 * ```ts
 * const x: Result<number, string> = Err("emergency failure");
 * const y = inspectErr((error) => console.error(error))(x);
 * ```
 * @param fn - The function to call with the error.
 */
export const inspectErr =
  <T, E>(fn: (error: E) => void) =>
  (self: Result<T, E>): Result<T, E> =>
    match(self)
      .with({ _tag: "Err" }, ({ error }) => {
        fn(error);
        return self;
      })
      .otherwise(() => self);

/**
 * Maps a `Result<T, E>` to `Result<U, E>` by applying a function to a contained [`Ok`] value,
 * leaving an [`Err`] value untouched.
 *
 * This function can be used to compose the results of two functions.
 *
 * @example
 * ```ts
 * const x: Result<number, string> = Ok(2);
 * const y = map((value) => value * 2)(x);
 * console.log(y); // Ok(4)
 *
 * const x: Result<number, string> = Err("emergency failure");
 * const y = map((value) => value * 2)(x);
 * console.log(y); // Err("emergency failure")
 * ```
 *
 * @param fn - The function to apply to the value.
 */
export const map =
  <T, U, E>(fn: (value: T) => U) =>
  (self: Result<T, E>): Result<U, E> =>
    match(self)
      .with({ _tag: "Ok" }, ({ value }) => Ok(fn(value)))
      .otherwise((error) => error);

/**
 * Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a contained [`Err`] value,
 * leaving an [`Ok`] value untouched.
 *
 * This function can be used to pass through a successful result while handling an error.
 *
 * @example
 * ```ts
 * const stringify = (n: number) => `error code: ${n}`;
 *
 * const x: Result<number, number> = Err(2);
 * const y = mapErr(stringify)(x);
 * console.log(y); // Err("error code: 2")
 *
 * const x: Result<number, number> = Ok(2);
 * const y = mapErr(stringify)(x);
 * console.log(y); // Ok(2)
 * ```
 *
 * @param fn - The function to apply to the error.
 */
export const mapErr =
  <T, E, F>(fn: (error: E) => F) =>
  (self: Result<T, E>): Result<T, F> =>
    match(self)
      .with({ _tag: "Err" }, ({ error }) => Err(fn(error)))
      .otherwise((value) => value);

/**
 * Returns the provided default (if `self` is an [`Err`]), or applies a function to the contained value (if `self` is [`Ok`]).
 *
 * Arguments passed to `unwrapOr` are eagerly evaluated;
 * if you are passing the result of a function call, it is recommended to use [`mapOrElse`], which is lazily evaluated.
 *
 * @example
 * ```ts
 * const defaultValue = 2;
 * const x: Result<number, string> = Ok(9);
 * console.log(unwrapOr(defaultValue)(x)); // 9
 *
 * const defaultValue = 2;
 * const x: Result<number, string> = Err("error");
 * console.log(unwrapOr(defaultValue)(x)); // 2
 * ```
 *
 * @param defaultValue - The default value to return if the result is an [`Err`].
 * @param fn - The function to apply to the value if the result is an [`Ok`].
 *
 * @see {@link mapOrElse} if you want to defer the computation of the default value.
 */
export const mapOr =
  <T, U, E>(defaultValue: U, fn: (value: T) => U) =>
  (self: Result<T, E>): U =>
    match(self)
      .with({ _tag: "Ok" }, ({ value }) => fn(value))
      .otherwise(() => defaultValue);

/**
 * Maps a `Result<T, E>` to `U` by applying fallback function `default` to a contained [`Err`] value,
 * or the provided function `fn` to a contained [`Ok`] value.
 *
 * This function can be used to unpack a successful result while handling an error.
 *
 * @example
 * ```ts
 * const k = 21;
 * const x: Result<string, string> = Ok("foo");
 * const y = mapOrElse(() => k * 2, (value) => value.length)(x);
 * console.log(y); // 3
 *
 * const k = 21;
 * const x: Result<string, string> = Err("bar");
 * const y = mapOrElse(() => k * 2, (value) => value.length)(x);
 * console.log(y); // 42
 * ```
 *
 * @param fnWhenErr - The function to apply to the error.
 * @param fn - The function to apply to the value.
 */
export const mapOrElse =
  <T, U, E>(fnWhenErr: (error: E) => U, fn: (value: T) => U) =>
  (self: Result<T, E>): U =>
    match(self)
      .with({ _tag: "Ok" }, ({ value }) => fn(value))
      .otherwise(({ error }) => fnWhenErr(error));

/**
 * Returns `res` if the result is [`Err`], otherwise returns the [`Ok`] value of `self`.
 *
 * Arguments passed to `or` are eagerly evaluated; if you are passing the
 * result of a function call, it is recommended to use [`orElse`], which is
 * lazily evaluated.
 *
 * @example
 * ```ts
 * const x: Result<number, string> = Ok(2);
 * const y: Result<number, string> = Err("late error");
 * console.log(or(y)(x)); // Ok(2)
 *
 * const x: Result<number, string> = Err("early error");
 * const y: Result<number, string> = Ok(2);
 * console.log(or(y)(x)); // Ok(2)
 *
 * const x: Result<number, string> = Err("not a 2");
 * const y: Result<number, string> = Err("late error");
 * console.log(or(y)(x)); // Err("late error")
 *
 * const x: Result<number, string> = Ok(2);
 * const y: Result<number, string> = Ok(100);
 * console.log(or(y)(x)); // Ok(2)
 * ```
 *
 * @see {@link orElse} if you want to defer the computation of the default value.
 */
export const or =
  <T, E>(other: Result<T, E>) =>
  (self: Result<T, E>): Result<T, E> =>
    match(self)
      .with({ _tag: "Ok" }, () => self)
      .otherwise(() => other);

/**
 * Calls `op` if the result is [`Err`], otherwise returns the [`Ok`] value of `self`.
 *
 * This function can be used for control flow based on `Result` values.
 *
 * Often used to chain fallible operations that may return [`Err`].
 *
 * @example
 * ```ts
 * const sq = (x: number): Result<number, number> => Ok(x * x);
 * const err = (x: number): Result<number, number> => Err(x);
 *
 * expect(pipe(Ok(2), orElse(sq), orElse(sq))).toEqual(Ok(2));
 * expect(pipe(Ok(2), orElse(err), orElse(sq))).toEqual(Ok(2));
 * expect(pipe(Err(3), orElse(sq), orElse(err))).toEqual(Ok(9));
 * expect(pipe(Err(3), orElse(err), orElse(err))).toEqual(Err(3));
 * ```
 *
 * @param op - The function to call if the result is [`Err`].
 */
export const orElse =
  <T, E>(op: (error: E) => Result<T, E>) =>
  (self: Result<T, E>): Result<T, E> =>
    match(self)
      .with({ _tag: "Ok" }, () => self)
      .otherwise(({ error }) => op(error));

/**
 * Returns the contained [`Ok`] value.
 *
 * Because this function may throw, its use is generally discouraged.
 * Instead, prefer to use pattern matching and handle the [`Err`] case explicitly,
 * or call {@link `unwrapOr`} or {@link `unwrapOrElse`}.
 *
 * @throws - If the value is an [`Err`], throws the error.
 *
 * @example should throw
 * ```ts
 * const x: Result<number, string> = Err("emergency failure");
 * console.log(unwrap(x)); // throws "emergency failure"
 * ```
 *
 * @example should return the value
 * ```ts
 * const x: Result<number, string> = Ok(2);
 * console.log(unwrap(x)); // 2
 * ```
 *
 * @param self - The result to check.
 */
export const unwrap = <T, E>(self: Result<T, E>): T =>
  match(self)
    .with({ _tag: "Ok" }, ({ value }) => value)
    .otherwise(() => {
      throw new Error("Called `unwrap` on an `Err` value");
    });

/**
 * Returns the contained [`Err`] value.
 *
 * @throws - Throw if the value is an [`Ok`], with a panic message including the passed message.
 *
 * @example should throw
 * ```ts
 * const x: Result<number, string> = Ok(2);
 * console.log(unwrapErr(x)); // throws "Called `unwrapErr` on an `Ok` value"
 * ```
 *
 * @example should return the error
 * ```ts
 * const x: Result<number, string> = Err("emergency failure");
 * console.log(unwrapErr(x)); // "emergency failure"
 * ```
 *
 * @param self - The result to check.
 */
export const unwrapErr = <T, E>(self: Result<T, E>): E =>
  match(self)
    .with({ _tag: "Err" }, ({ error }) => error)
    .otherwise(() => {
      throw new Error("Called `unwrapErr` on an `Ok` value");
    });

/**
 * Returns the contained [`Ok`] value or a provided default.
 *
 * Arguments passed to `unwrapOr` are eagerly evaluated; if you are passing the
 * result of a function call, it is recommended to use [`unwrapOrElse`], which is
 * lazily evaluated.
 *
 * @example
 * ```ts
 * const x: Result<number, string> = Ok(9);
 * console.log(unwrapOr(2)(x)); // 9
 *
 * const x: Result<number, string> = Err("error");
 * console.log(unwrapOr(2)(x)); // 2
 * ```
 *
 * @param defaultValue - The default value to return if the result is an [`Err`].
 */
export const unwrapOr =
  <T, E>(defaultValue: T) =>
  (self: Result<T, E>): T =>
    match(self)
      .with({ _tag: "Ok" }, ({ value }) => value)
      .otherwise(() => defaultValue);

/**
 * Returns the contained [`Ok`] value or computes it from a closure.
 *
 * @example
 * ```ts
 * const x: Result<number, string> = Ok(9);
 * console.log(unwrapOrElse(() => 2)(x)); // 9
 *
 * const x: Result<number, string> = Err("error");
 * console.log(unwrapOrElse(() => 2)(x)); // 2
 * ```
 *
 * @param fn - The function to call if the result is an [`Err`].
 */
export const unwrapOrElse =
  <T, E>(fn: (error: E) => T) =>
  (self: Result<T, E>): T =>
    match(self)
      .with({ _tag: "Ok" }, ({ value }) => value)
      .otherwise(({ error }) => fn(error));

export function tryCatch<T>(fn: () => T): Result<T, UnknownException>;
export function tryCatch<T, E>(obj: { try: () => T; catch: (error: unknown) => E }): Result<T, E>;
export function tryCatch<T, E>(fnOrObj: (() => T) | { try: () => T; catch: (error: unknown) => E }) {
  if (typeof fnOrObj === "function") {
    try {
      return Ok(fnOrObj());
    } catch (error) {
      return Err(new UnknownException({ error: error as Error }));
    }
  }

  try {
    return Ok(fnOrObj.try());
  } catch (error) {
    return Err(fnOrObj.catch(error));
  }
}

export function tryPromise<T>(fn: () => Promise<T>): Promise<Result<T, UnknownException>>;
export function tryPromise<T, E>(obj: { try: () => Promise<T>; catch: (error: unknown) => E }): Promise<Result<T, E>>;
export function tryPromise<T, E>(
  fnOrObj: (() => Promise<T>) | { try: () => Promise<T>; catch: (error: unknown) => E },
) {
  if (typeof fnOrObj === "function") {
    return fnOrObj()
      .then(Ok)
      .catch((error) => Err(new UnknownException({ error })));
  }

  return fnOrObj
    .try()
    .then(Ok)
    .catch((error) => Err(fnOrObj.catch(error)));
}
