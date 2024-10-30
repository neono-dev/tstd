import { P, match } from "ts-pattern";
import { Err, Ok, type Result, isErr, isOk } from "./Result";

/**
 * Some value of type `T`.
 */
export type Some<T> = Readonly<{ _tag: "Some"; value: T }>;
/**
 * No value.
 */
export type None = Readonly<{ _tag: "None" }>;

/**
 * ## Optional values.
 *
 * Type `Option` represents an optional value: every `Option` is either {@link Some} and contains a value,
 * or {@link None}, and does not.
 * `Option` types are very common, as they have a number of uses:
 *
 * - Initial values
 * - Return values for functions that are not defined over their entire input range (partial functions)
 * - Return value for otherwise reporting simple errors, where `None` is returned on error
 * - Optional struct fields
 * - Optional function arguments
 * - Swapping things out of challenging situations
 */
export type Option<T> = Some<T> | None;

export const Some = <T>(value: T): Option<T> => ({ _tag: "Some", value });
export const None: Option<never> = { _tag: "None" };

/**
 * Returns {@link None} if the option is {@link None}, otherwise returns `other`.
 * Arguments passed to `and` are eagerly evaluated; if you are passing the
 * result of a function call, it is recommended to use {@link andThen}, which is
 * lazily evaluated.
 *
 * @example
 * ```ts
 * const x = Some(2);
 * const y: Option<string> = None;
 * expect(pipe(x, and(y))).toBe(None);
 *
 * const x: Option<u32> = None;
 * const y = Some("foo");
 * expect(pipe(x, and(y))).toBe(None);
 *
 * const x = Some(2);
 * const y = Some("foo");
 * expect(pipe(x, and(y))).toStrictEqual(Some("foo"));
 *
 * const x: Option<u32> = None;
 * const y: Option<string> = None;
 * expect(pipe(x, and(y))).toBe(None);
 * ```
 */
export const and =
  <T, U>(other: Option<U>) =>
  (self: Option<T>): Option<U> =>
    match(self)
      .with({ _tag: "Some" }, () => other)
      .otherwise(() => None as Option<U>);

/**
 * Returns {@link None} if the option is {@link None}, otherwise calls `fn` with the
 * wrapped value and returns the result.
 *
 * Some languages call this operation flatmap.
 *
 * Often used to chain fallible operations that may return {@link None}.
 */
export const andThen =
  <T, U>(fn: (value: T) => Option<U>) =>
  (self: Option<T>) =>
    match(self)
      .with({ _tag: "Some" }, ({ value }) => fn(value))
      .otherwise(() => None);

/**
 * Returns the contained {@link Some} value.
 *
 * @throws - Throws if the value is a {@link None} with a custom panic message provided by `msg`.
 *
 * @example
 * ```ts
 * const x = Some("value");
 * pipe(x, expect("oh no")); // "value"
 * ```
 *
 * @example should panic
 * ```ts
 * const x: Option<string> = None;
 * pipe(x, expect("oh no")); // throws with "oh no"
 * ```
 *
 * We recommend that `expect` messages are used to describe the reason you
 * _expect_ the `Option` should be `Some`.
 */
export const expect =
  <T>(msg: string) =>
  (self: Option<T>): T =>
    match(self)
      .with({ _tag: "Some" }, ({ value }) => value)
      .otherwise(() => {
        throw new Error(msg);
      });

/**
 * Returns {@link None} if the option is {@link None}, otherwise calls `predicate`
 * with the wrapped value and returns:
 *
 * - {@linkcode Some `Some(t)`} if `predicate` returns `true` (where `t` is the
 * wrapped value), and
 * - {@linkcode None} if `predicate` returns `false`.
 *
 * You can imagine the `Option<T>` being an iterator over one or zero elements.
 * `filter()` lets you decide which elements to keep.
 *
 * @example
 * ```ts
 * const isEven = (n: number) => n % 2 === 0;
 *
 * expect(pipe(None, Option.filter(isEven))).toBe(None);
 * expect(pipe(Some(3), Option.filter(isEven))).toBe(None);
 * expect(pipe(Some(4), Option.filter(isEven))).toStrictEqual(Some(4));
 * ```
 */
export const filter =
  <T>(predicate: (value: T) => boolean) =>
  (self: Option<T>): Option<T> =>
    match(self)
      .with({ _tag: "Some", value: P.when((value) => predicate(value as T)) }, () => self)
      .otherwise(() => None);

/**
 * Converts from `Option<Option<T>>` to `Option<T>`.
 *
 * @example basic usage:
 * ```ts
 * const x: Option<Option<number>> = Some(Some(5));
 * expect(flatten(x)).toStrictEqual(Some(5));
 *
 * const x: Option<Option<number>> = Some(None);
 * expect(flatten(x)).toBe(None);
 *
 * const x: Option<Option<number>> = None;
 * expect(flatten(x)).toBe(None);
 * ```
 *
 * Flattening only removes one level of nesting at a time:
 * @example with multiple levels of nesting
 * ```ts
 * const x: Option<Option<Option<number>>> = Some(Some(Some(5)));
 * expect(flatten(x)).toStrictEqual(Some(Some(5)));
 * expect(flatten(flatten(x))).toStrictEqual(Some(5));
 * ```
 */
export const flatten = <T>(self: Option<Option<T>>): Option<T> =>
  match(self)
    .with({ _tag: "Some" }, ({ value }) => value)
    .otherwise(() => None);

/**
 * Calls a function with a reference to the contained value if {@link Some}.
 *
 * Returns the original option.
 *
 * @example
 * ```ts
 * const option = Some(5);
 *
 * pipe(
 *   option,
 *   inspect((v) => console.log(v))
 * ); // prints `5`
 *
 * pipe(
 *   None,
 *   inspect((v) => console.log(v))
 * ); // prints nothing
 * ```
 */
export const inspect =
  <T>(fn: (value: T) => unknown) =>
  (self: Option<T>): Option<T> =>
    match(self)
      .with({ _tag: "Some" }, ({ value }) => {
        fn(value);
        return self;
      })
      .otherwise(() => self);

/**
 * Returns `true` if the option is a {@link None} value.
 *
 * @example
 * ```
 * const x: Option<number> = Some(2);
 * expect(isNone(x)).toBe(false);
 *
 * const x: Option<number> = None;
 * expect(isNone(x)).toBe(true);
 * ```
 */
export const isNone = <T>(self: Option<T>): self is None =>
  match(self)
    .with({ _tag: "None" }, () => true)
    .otherwise(() => false);

/**
 * Returns `true` if the option is a {@link None} or the value inside it
 * matches a predicate.
 *
 * @example
 * ```ts
 * const x: Option<number> = Some(2);
 * expect(pipe(x, isNoneOr(v => v > 1)).toBe(true);
 *
 * const x: Option<number> = Some(0);
 * expect(pipe(x, isNoneOr(v => v > 1)).toBe(false);
 *
 * const x: Option<number> = None;
 * expect(pipe(x, isNoneOr(v => v > 1)).toBe(true);
 * ```
 */
export const isNoneOr =
  <T>(fn: (value: T) => boolean) =>
  (self: Option<T>): self is None =>
    match(self)
      .with({ _tag: "None" }, () => true)
      .with({ _tag: "Some", value: P.when((value) => fn(value as T)) }, () => true)
      .otherwise(() => false);

/**
 * Returns `true` if the option is a {@link Some} value.
 *
 * @example
 * ```ts
 * const x: Option<number> = Option.Some(2);
 * expect(Option.isSome(x)).toBe(true);
 *
 * const x: Option<number> = Option.None;
 * expect(Option.isSome(x)).toBe(false);
 * ```
 * @param option
 * @see If you intended to assert that this has a value, consider {@link unwrap} instead.
 */
export const isSome = <T>(option: Option<T>): option is Some<T> => option._tag === "Some";

/**
 * Returns `true` if the option is a {@link Some} and the value inside it matches a predicate.
 * @param predicate
 */
export const isSomeAnd =
  <T>(predicate: (value: T) => boolean) =>
  (self: Option<T>) => {
    return match(self)
      .with({ _tag: "Some" }, (option) => predicate(option.value))
      .otherwise(() => false);
  };

/**
 * Maps an {@linkcode Option `Option<T>`} to {@linkcode Option `Option<U>`} by applying a function to a contained
 * value (if `Some`) or returns {@link None} (if `None`).
 *
 * @example
 * Calculates the length of an `Option<string>` as an `Option<number>`:
 * ```ts
 * const maybeSomeString = Some("Hello, World!");
 * const maybeSomeLength = pipe(
 *   maybeSomeString,
 *   map((str) => str.length)
 * );
 *
 * expect(maybeSomeLength).toStrictEqual(Some(13));
 *
 * const x: Option<string> = None;
 * expect(pipe(x, map((str) => str.length))).toBe(None);
 * ```
 */
export const map =
  <T, U>(fn: (value: T) => U) =>
  (self: Option<T>): Option<U> =>
    match(self)
      .with({ _tag: "Some" }, ({ value }) => Some(fn(value)))
      .otherwise(() => None);

/**
 * Returns the provided default value (if `None`), or applies a function to the contained value (if `Some`).
 *
 * Arguments passed to `mapOr` are eagerly evaluated; if you are passing the result of a function call, it is
 * recommended to use {@link mapOrElse}, which is lazily evaluated.
 *
 * @example
 * ```ts
 * const x = Some("foo");
 * expect(pipe(x, mapOr(42, v => v.length))).toStrictEqual(Some(3));
 *
 * const x: Option<string> = None;
 * expect(pipe(x, mapOr(42, v => v.length))).toStrictEqual(Some(42));
 * ```
 */
export const mapOr =
  <T, U>(defaultValue: U, fn: (value: T) => U) =>
  (self: Option<T>): Option<U> =>
    match(self)
      .with({ _tag: "Some" }, ({ value }) => Some(fn(value)))
      .otherwise(() => Some(defaultValue));

/**
 * Computes a default function result (if `None`), or
 * applies a different function to the contained value (if `Some`).
 *
 * @example
 * const k = 21;
 *
 * const x = Some("foo");
 * expect(pipe(x, mapOrElse(() => 2 * k, (v) => v.length))).toStrictEqual(Some(3));
 *
 * const x: Option<string> = None;
 * expect(pipe(x, mapOrElse(() => 2 * k, (v) => v.length))).toStrictEqual(Some(42));
 */
export const mapOrElse =
  <T, U>(defaultFn: () => U, fn: (value: T) => U) =>
  (self: Option<T>): Option<U> =>
    match(self)
      .with({ _tag: "Some" }, ({ value }) => Some(fn(value)))
      .otherwise(() => Some(defaultFn()));

/**
 * Transforms the {@linkcode Option `Option<T>`} into a {@linkcode Result `Result<T, E>`},
 * mapping {@linkcode Some `Some(v)`} to {@linkcode Ok `Ok(v)`} and {@link None} to {@linkcode Err `Err(err)`}.
 *
 * Arguments passed to `okOr` are eagerly evaluated; if you are passing the result of a function call,
 * it is recommended to use {@link okOrElse}, which is lazily evaluated.
 *
 * @example
 * const x = Some("foo");
 * expect(pipe(x, okOr(0))).toStrictEqual(Ok("foo"));
 *
 * const x: Option<string> = None;
 * expect(pipe(x, okOr(0))).toStrictEqual(Err(0));
 */
export const okOr =
  <T, E>(err: E) =>
  (self: Option<T>): Result<T, E> =>
    match(self)
      .with({ _tag: "Some" }, ({ value }) => Ok(value))
      .otherwise(() => Err(err));

/**
 * Transforms the {@linkcode Option `Option<T>`} into a {@linkcode Result `Result<T, E>`},
 * mapping {@linkcode Some `Some(v)`} to {@linkcode Ok `Ok(v)`} and {@link None} to {@linkcode Err `Err(err())`}.
 *
 * @example
 * const x = Some("foo");
 * expect(pipe(x, okOrElse(() => 0))).toStrictEqual(Ok("foo"));
 *
 * const x: Option<string> = None;
 * expect(pipe(x, okOrElse(() => 0))).toStrictEqual(Err(0));
 */
export const okOrElse =
  <T, E>(errFn: () => E) =>
  (self: Option<T>): Result<T, E> =>
    match(self)
      .with({ _tag: "Some" }, ({ value }) => Ok(value))
      .otherwise(() => Err(errFn()));

/**
 * Returns the option if it contains a value, otherwise returns `other`.
 *
 * Arguments passed to `or` are eagerly evaluated; if you are passing the result of a function call,
 * it is recommended to use {@link orElse}, which is lazily evaluated.
 *
 * @example
 * const x = Some(2);
 * const y = None;
 * expect(pipe(x, or(y))).toBe(x);
 *
 * const x = None;
 * const y = Some(100);
 * expect(pipe(x, or(y))).toBe(y);
 *
 * const x = Some(2);
 * const y = Some(100);
 * expect(pipe(x, or(y))).toBe(x);
 *
 * const x = None;
 * const y = None;
 * expect(pipe(x, or(y))).toBe(None);
 */
export const or =
  <T>(other: Option<T>) =>
  (self: Option<T>): Option<T> =>
    match(self)
      .with({ _tag: "Some" }, () => self)
      .otherwise(() => other);

/**
 * Returns the option if it contains a value, otherwise calls `fn` and returns the result.
 *
 * @example
 * const nobody = (): Option<string> => None;
 * const vikings = () => Some("vikings");
 *
 * expect(pipe(Some("barbarians"), orElse(vikings))).toStrictEqual(Some("barbarians"));
 * expect(pipe(None, orElse(vikings))).toStrictEqual(Some("vikings"));
 * expect(pipe(None, orElse(nobody))).toBe(None);
 */
export const orElse =
  <T>(fn: () => Option<T>) =>
  (self: Option<T>): Option<T> =>
    match(self)
      .with({ _tag: "Some" }, () => self)
      .otherwise(fn);

/**
 * Transposes an `Option` of a {@link Result} into a {@link Result} of an `Option`.
 *
 * {@link None} will be mapped to {@linkcode Ok `Ok(None)`}.
 * {@linkcode Some `Some(Ok(_))`} and {@linkcode Some `Some(Err(_))`} will be mapped to
 * {@linkcode Ok `Ok(Some(_))`} and {@linkcode Err `Err(_)`}.
 *
 * @example
 * ```ts
 * const x: Result<Option<number>, Error> = Ok(Some(5));
 * const y: Option<Result<number, Error>> = Some(Ok(5));
 *
 * expect(x).toStrictEqual(transpose(y));
 * ```
 */
export const transpose = <T, E>(self: Option<Result<T, E>>): Result<Option<T>, E> =>
  match(self)
    .with({ _tag: "Some", value: P.when((value) => isOk(value)) }, ({ value }) =>
      Ok(Some(value.value)),
    )
    .with({ _tag: "Some", value: P.when((value) => isErr(value)) }, ({ value }) =>
      Err(value.error),
    )
    .otherwise(() => Ok(None));

/**
 * Returns the contained {@link Some} value.
 *
 * Because this function may throw, its use is generally discouraged.
 * Instead, prefer to use pattern matching and handle the {@link None}
 * case explicitly, or call {@link unwrapOr} or {@link unwrapOrElse}.
 *
 * @throws - Throw if the `self` value equals {@link None}.
 *
 * @example
 * const x = Some("air");
 * expect(unwrap(x)).toBe("air");
 *
 * @example should panic
 * ```ts
 * const x: Option<string> = None;
 * expect(() => { unwrap(x) }).toThrowError();
 * ```
 */
export const unwrap = <T>(self: Option<T>): T =>
  match(self)
    .with({ _tag: "Some" }, ({ value }) => value)
    .otherwise(() => {
      throw new Error("Called `Option.unwrap()` on a `None` value");
    });

/**
 * Returns the contained {@link Some} value or a provided default.
 *
 * Arguments passed to `unwrapOr` are eagerly evaluated; if you are passing the result of a function call,
 * it is recommended to use {@link unwrapOrElse}, which is lazily evaluated.
 *
 * @example
 * expect(pipe(Some("car"), unwrapOr("bike))).toBe("car");
 * expect(pipe(None, unwrapOr("bike))).toBe("bike");
 */
export const unwrapOr =
  <T>(defaultValue: T) =>
  (self: Option<T>): T =>
    match(self)
      .with({ _tag: "Some" }, ({ value }) => value)
      .otherwise(() => defaultValue);

/**
 * Returns the contained {@link Some} value or computes it from a closure.
 *
 * @example
 * const k = 10;
 *
 * expect(pipe(Some(4), unwrapOrElse(() => 2 * k))).toBe(4);
 * expect(pipe(None, unwrapOrElse(() => 2 * k))).toBe(20);
 */
export const unwrapOrElse =
  <T>(fn: () => T) =>
  (self: Option<T>): T =>
    match(self)
      .with({ _tag: "Some" }, ({ value }) => value)
      .otherwise(fn);

/**
 * Unzip an option containing a tuple of two options.
 *
 * If `self` is {@linkcode Some `Some([a, b])`} this method returns `[Some(a), Some(b)]`.
 * Otherwise, `[None, None]` is returned.
 *
 * @example
 * const x = Some([1, "hi"]);
 * const y = None as Option<[number, number]>;
 *
 * expect(unzip(x)).toStrictEqual([Some(1), Some("hi")]);
 * expect(unzip(y)).toStrictEqual([None, None])
 */
export const unzip = <T, U>(
  self: Option<[T, U]> | Option<readonly [T, U]>,
): [Option<T>, Option<U>] =>
  match(self)
    .with(
      { _tag: "Some" },
      ({ value: [a, b] }) => [Some(a), Some(b)] as [Option<T>, Option<U>],
    )
    .otherwise(() => [None, None]);

/**
 * Returns {@link Some} if exactly one of `self` or `other` is {@link Some}, otherwise return {@link None}.
 *
 * @example
 * const x = Some(2);
 * const y: Option<number> = None;
 * expect(pipe(x, xor(y))).toStrictEqual(Some(2));
 *
 * const x: Option<number> = None;
 * const y = Some(2);
 * expect(pipe(x, xor(y))).toStrictEqual(Some(2));
 *
 * const x = Some(2);
 * const y = Some(2);
 * expect(pipe(x, xor(y))).toBe(None);
 *
 * const x: Option<number> = None;
 * const y: Option<number> = None;
 * expect(pipe(x, xor(y))).toBe(None);
 */
export const xor =
  <T>(other: Option<T>) =>
  (self: Option<T>): Option<T> =>
    match(self)
      .with({ _tag: "Some" }, () => {
        if (isSome(other)) {
          return None;
        }
        return self;
      })
      .otherwise(() => {
        if (isNone(other)) {
          return None;
        }
        return other;
      });

/**
 * Zips `self` with another `Option`.
 *
 * If `self` is {@linkcode Some `Some(s)`} and `other` is {@linkcode Some `Some(o)`}, this method return
 * {@linkcode Some `Some([s, o])`}.
 * Otherwise, {@link None} is returned.
 *
 * @example
 * const x = Some(1);
 * const y = Some("hi");
 * const z = None as Option<number>;
 *
 * expect(pipe(x, zip(y))).toStrictEqual(Some([1, "hi"]))
 * expect(pipe(x, zip(z))).toBe(None);
 */
export const zip =
  <T, U>(other: Option<U>) =>
  (self: Option<T>): Option<[T, U]> => {
    if (isSome(self) && isSome(other)) {
      return Some([self.value, other.value]);
    }

    return None;
  };

/**
 * Zips `self` and another `Option` with function `fn`.
 *
 * If `self` is {@linkcode Some `Some(s)`} and `other` is {@linkcode Some `Some(o)`}, this method returns {@linkcode Some `Some(fn(s, o))`}.
 * Otherwise, {@link None} is returned.
 *
 * @example
 * ```ts
 * class Point {
 *   x: number;
 *   y: number;
 *
 *   constructor(x: number, y: number) {
 *     this.x = x;
 *     this.y = y;
 *   }
 * }
 *
 * const x = Some(17.5);
 * const y = Some(42.7);
 * ```
 */
export const zipWith =
  <T, U, R>(other: Option<U>, fn: (valueSelf: T, valueOther: U) => R) =>
  (self: Option<T>): Option<R> => {
    if (isSome(self) && isSome(other)) {
      return Some(fn(self.value, other.value));
    }

    return None;
  };
