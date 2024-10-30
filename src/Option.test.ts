import { describe, expect, it, jest } from "@jest/globals";
import {
  None,
  type Option,
  Some,
  and,
  andThen,
  expect as expectOption,
  filter,
  flatten,
  inspect,
  isNone,
  isNoneOr,
  isSome,
  isSomeAnd,
  map,
  mapOr,
  mapOrElse,
  okOr,
  okOrElse,
  or,
  orElse,
  transpose,
  unwrap,
  unwrapOr,
  unwrapOrElse,
  unzip,
  xor,
  zip,
  zipWith,
} from "./Option";
import { Err, Ok, type Result } from "./Result";
import { pipe } from "./pipe";

describe("Option", () => {
  it("should create a `Some` option", () => {
    expect(Some(5)).toStrictEqual({
      _tag: "Some",
      value: 5,
    });
  });

  it("should create a `None` option", () => {
    expect(None).toStrictEqual({
      _tag: "None",
    });
  });

  describe("with a `Some` option", () => {
    const option = Some(5);

    it("`isSome` should return true", () => {
      expect(isSome(option)).toBe(true);
    });

    it("`isSomeAnd` should return true if predicate returns true", () => {
      expect(
        pipe(
          option,
          isSomeAnd((v) => v > 2),
        ),
      ).toBe(true);
    });

    it("`isSomeAnd` should return false if predicate returns false", () => {
      expect(
        pipe(
          option,
          isSomeAnd((v) => v > 10),
        ),
      ).toBe(false);
    });

    it("`and` should return other `Some` option", () => {
      const other = Some(42);

      expect(pipe(option, and(other))).toBe(other);
    });

    it("`and` should return other `None` option", () => {
      expect(pipe(option, and(None))).toBe(None);
    });

    it("`andThen` should return another `Some` option", () => {
      expect(
        pipe(
          option,
          andThen((v) => (v > 0 ? Some(0) : None)),
        ),
      ).toStrictEqual(Some(0));
    });

    it("`andThen` should return a `None` option", () => {
      expect(
        pipe(
          option,
          andThen((v) => (v > 100 ? Some(0) : None)),
        ),
      ).toBe(None);
    });

    it("`expect` should return wrapped value", () => {
      expect(pipe(option, expectOption("oh no!"))).toBe(5);
    });

    it("`filter` should return the option if it matches the predicate", () => {
      expect(
        pipe(
          option,
          filter((v) => v === 5),
        ),
      ).toBe(option);
    });

    it("`filter` should return a `None` it it does not match the predicate", () => {
      expect(
        pipe(
          option,
          filter((v) => v === 0),
        ),
      ).toBe(None);
    });

    it("`flatten` should flatten with other being a `Some` option", () => {
      expect(pipe(Some(option), flatten)).toBe(option);
    });

    it("`flatten` should flatten with other being a `None` option", () => {
      expect(pipe(Some(None), flatten)).toBe(None);
    });

    it("`inspect` should call function with contained value", () => {
      const fn = jest.fn();

      pipe(option, inspect(fn));

      expect(fn).toHaveBeenNthCalledWith(1, 5);
    });

    it("`inspect` should return the option without being altered", () => {
      const result = pipe(
        option,
        inspect(() => 10),
      );

      expect(result).toBe(option);
    });

    it("`isNone` should return false", () => {
      expect(isNone(option)).toBe(false);
    });

    it("`isNoneOr` should return true if predicate matches", () => {
      expect(
        pipe(
          option,
          isNoneOr((v) => v === 5),
        ),
      ).toBe(true);
    });

    it("`isNoneOr` should return false if predicate does not match", () => {
      expect(
        pipe(
          option,
          isNoneOr((v) => v < 2),
        ),
      ).toBe(false);
    });

    it("`map` should return an option from the function result", () => {
      expect(
        pipe(
          option,
          map((v) => v * 3),
        ),
      ).toStrictEqual(Some(15));
    });

    it("`mapOr` should return an option from the function result", () => {
      expect(
        pipe(
          option,
          mapOr(42, (v) => v * 3),
        ),
      ).toStrictEqual(Some(15));
    });

    it("`mapOrElse` should return a computed value with its contained value", () => {
      const k = 21;

      expect(
        pipe(
          option,
          mapOrElse(
            () => 2 * k,
            (v) => v * 3,
          ),
        ),
      ).toStrictEqual(Some(15));
    });

    it("`okOr` should return an `Ok` result containing the value", () => {
      expect(pipe(option, okOr("oh no!"))).toStrictEqual(Ok(5));
    });

    it("`okOrElse` should return an `Ok` result containing the value", () => {
      expect(
        pipe(
          option,
          okOrElse(() => "oh no!"),
        ),
      ).toStrictEqual(Ok(5));
    });

    it("`or` should return the original option if other is a `None`", () => {
      expect(pipe(option, or(None as Option<number>))).toBe(option);
    });

    it("`or` should return the original option if other is a `Some`", () => {
      expect(pipe(option, or(Some(42)))).toBe(option);
    });

    it("`orElse` should return the original option", () => {
      const getZero = () => Some(0);

      expect(pipe(option, orElse(getZero))).toBe(option);
    });

    it("`transpose` should transpose to an `Ok` result", () => {
      const option = Some(Ok(5));

      expect(transpose(option)).toStrictEqual(Ok(Some(5)));
    });

    it("`transpose` should transpose to an `Err` result", () => {
      const option = Some(Err(5));

      expect(transpose(option)).toStrictEqual(Err(5));
    });

    it("`unwrap` should return the contained value", () => {
      expect(unwrap(option)).toBe(5);
    });

    it("`unwrapOr` should return the contained value", () => {
      expect(pipe(option, unwrapOr(0))).toBe(5);
    });

    it("`unwrapOrElse` should return the contained value", () => {
      expect(
        pipe(
          option,
          unwrapOrElse(() => 0),
        ),
      ).toBe(5);
    });

    it("`unzip` should return a tuple of two options", () => {
      const option = Some([1, "hi"] as const);

      expect(unzip(option)).toStrictEqual([Some(1), Some("hi")]);
    });

    it("`xor` should return option if other if `None`", () => {
      expect(pipe(option, xor(None as Option<number>))).toBe(option);
    });

    it("`xor` should return `None` if other is a `Some`", () => {
      expect(pipe(option, xor(Some(5)))).toBe(None);
    });

    it("`zip` should merge two options into one", () => {
      const other = Some("hi");

      expect(pipe(option, zip(other))).toStrictEqual(Some([5, "hi"]));
    });

    it("`zip` should return `None` if other is `None`", () => {
      expect(pipe(option, zip(None))).toBe(None);
    });

    it("`zipWith` should return a correct class instance", () => {
      class Point {
        x: number;
        y: number;

        constructor(x: number, y: number) {
          this.x = x;
          this.y = y;
        }

        static create(x: number, y: number) {
          return new Point(x, y);
        }
      }

      const other = Some(12);

      expect(pipe(option, zipWith(other, Point.create))).toStrictEqual(Some(new Point(5, 12)));
    });

    it("`zipWith` should return a `None` when other is `None`", () => {
      class Point {
        x: number;
        y: number;

        constructor(x: number, y: number) {
          this.x = x;
          this.y = y;
        }

        static create(x: number, y: number) {
          return new Point(x, y);
        }
      }

      const other: Option<number> = None;

      expect(pipe(option, zipWith(other, Point.create))).toBe(None);
    });
  });

  describe("with a `None` option", () => {
    const option: Option<number> = None;

    it("`isSome` should return false", () => {
      expect(isSome(option)).toBe(false);
    });

    it("`isSomeAnd` should return false", () => {
      expect(
        pipe(
          option,
          isSomeAnd(() => true),
        ),
      ).toBe(false);
    });

    it("`and` should return `None` if other is `Some`", () => {
      const other = Some(42);

      expect(pipe(option, and(other))).toBe(None);
    });

    it("`and` should return `None` if other is `None`", () => {
      expect(pipe(option, and(None))).toBe(None);
    });

    it("`andThen` should return `None`", () => {
      expect(
        pipe(
          option,
          andThen(() => Some(42)),
        ),
      ).toBe(None);
    });

    it("`expect` should throw with custom message", () => {
      expect(() => {
        pipe(option, expectOption("oh no!"));
      }).toThrow("oh no!");
    });

    it("`filter` should return a `None`", () => {
      expect(
        pipe(
          option,
          filter(() => true),
        ),
      ).toBe(None);
    });

    it("`flatten` should return a `None`", () => {
      expect(pipe(option as Option<Option<number>>, flatten)).toBe(None);
    });

    it("`inspect` should not call the function", () => {
      const fn = jest.fn();

      pipe(option, inspect(fn));

      expect(fn).not.toHaveBeenCalled();
    });

    it("`isNone` should return true", () => {
      expect(isNone(option)).toBe(true);
    });

    it("`isNoneOr` should return true even if the predicate returns false", () => {
      expect(
        pipe(
          option,
          isNoneOr(() => false),
        ),
      ).toBe(true);
    });

    it("`map` should return a `None` option", () => {
      expect(
        pipe(
          option,
          map((v) => v * 3),
        ),
      ).toBe(None);
    });

    it("`mapOr` should return an option from the default value", () => {
      expect(
        pipe(
          option,
          mapOr(42, (v) => v * 3),
        ),
      ).toStrictEqual(Some(42));
    });

    it("`mapOrElse` should return a computed default value", () => {
      const k = 21;

      expect(
        pipe(
          option,
          mapOrElse(
            () => 2 * k,
            (v) => v * 3,
          ),
        ),
      ).toStrictEqual(Some(42));
    });

    it("`okOr` should return an `Err` result containing the error", () => {
      expect(pipe(option, okOr("oh no!"))).toStrictEqual(Err("oh no!"));
    });

    it("`okOrElse` should return an `Err` result containing the error", () => {
      expect(
        pipe(
          option,
          okOrElse(() => "oh no!"),
        ),
      ).toStrictEqual(Err("oh no!"));
    });

    it("`or` should return the other option if it is a `Some`", () => {
      const other = Some(12);

      expect(pipe(option, or(other))).toBe(other);
    });

    it("`or` should return a `None` if the other option is a `None`", () => {
      expect(pipe(option, or(None as Option<number>))).toBe(None);
    });

    it("`orElse` should return a `Some` value if fn returns a `Some`", () => {
      const getZero = () => Some(0);

      expect(pipe(option, orElse(getZero))).toStrictEqual(Some(0));
    });

    it("`orElse` should return a `None` value if fn returns a `None`", () => {
      const nothing = (): Option<number> => None;

      expect(pipe(option, orElse(nothing))).toBe(None);
    });

    it("`transpose` should transpose to an `Ok` result", () => {
      expect(transpose(option as Option<Result<number, Error>>)).toStrictEqual(Ok(None));
    });

    it("`unwrap` should throw an error", () => {
      expect(() => {
        unwrap(option);
      }).toThrowError("Called `Option.unwrap()` on a `None` value");
    });

    it("`unwrapOr` should return the default value", () => {
      expect(pipe(option, unwrapOr(0))).toBe(0);
    });

    it("`unwrapOrElse` should return the contained value", () => {
      expect(
        pipe(
          option,
          unwrapOrElse(() => 0),
        ),
      ).toBe(0);
    });

    it("`unzip` should return an array of `None`", () => {
      expect(unzip(option as Option<[number, string]>)).toStrictEqual([None, None]);
    });

    it("`xor` should return other if it is `Some`", () => {
      const other = Some(5);

      expect(pipe(option, xor(other))).toBe(other);
    });

    it("`xor` should return `None` if other is `None`", () => {
      const other = None as Option<number>;

      expect(pipe(option, xor(other))).toBe(None);
    });

    it("`zip` should return `None`", () => {
      expect(pipe(option, zip(Some(5)))).toBe(None);
    });

    it("`zipWith` should return `None`", () => {
      expect(
        pipe(
          option,
          zipWith(Some(5), (a, b) => ({ a, b })),
        ),
      ).toBe(None);
    });
  });
});
