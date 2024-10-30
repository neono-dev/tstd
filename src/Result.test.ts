import { describe, expect, it, jest } from "@jest/globals";
import {
  Err,
  Ok,
  type Result,
  and,
  andThen,
  expectErr,
  expect as expectResult,
  flatten,
  inspect,
  inspectErr,
  isErr,
  isErrAnd,
  isOk,
  isOkAnd,
  map,
  mapErr,
  mapOr,
  mapOrElse,
  or,
  orElse,
  tryCatch,
  tryPromise,
  unwrap,
  unwrapErr,
  unwrapOr,
  unwrapOrElse,
} from "./Result";
import { UnknownException } from "./errors/UnknownException";
import { pipe } from "./pipe";

describe("Result", () => {
  describe("with a successful result", () => {
    const result = Ok(42);

    it("`and` should return the other result", () => {
      const other = Ok("other");

      expect(pipe(result, and(other))).toBe(other);
    });

    it("`andThen` should call the function with the value", () => {
      const addTen = (value: number) => Ok(value + 10);

      expect(pipe(result, andThen(addTen))).toStrictEqual(Ok(52));
    });

    it("`expect` should return the value", () => {
      expect(pipe(result, expectResult("This should not panic"))).toBe(42);
    });

    it("`expectErr` should throw the error", () => {
      expect(() => pipe(result, expectErr("This should panic"))).toThrow("This should panic");
    });

    it("`flatten` should return the value", () => {
      const nested = Ok(Ok(42));

      expect(pipe(nested, flatten)).toStrictEqual(Ok(42));
    });

    it("`inspect` should return the original result", () => {
      expect(pipe(result, inspect(jest.fn()))).toBe(result);
    });

    it("`inspect` should call the function with the value", () => {
      const fn = jest.fn();

      pipe(result, inspect(fn));

      expect(fn).toHaveBeenCalledWith(42);
    });

    it("`inspectErr` should return the original result", () => {
      expect(pipe(result, inspectErr(jest.fn()))).toBe(result);
    });

    it("`inspectErr` should not call the function", () => {
      const fn = jest.fn();

      pipe(result, inspectErr(fn));

      expect(fn).not.toHaveBeenCalled();
    });

    it("`isErr` should return false", () => {
      expect(isErr(result)).toBe(false);
    });

    it("`isErrAnd` should return false", () => {
      expect(
        pipe(
          result,
          isErrAnd(() => true),
        ),
      ).toBe(false);
    });

    it("`isOk` should return true", () => {
      expect(isOk(result)).toBe(true);
    });

    it("`isOkAnd` should return true if the predicate returns `true`", () => {
      expect(
        pipe(
          result,
          isOkAnd(() => true),
        ),
      ).toBe(true);
    });

    it("`isOkAnd` should return false if the predicate returns `false`", () => {
      expect(
        pipe(
          result,
          isOkAnd(() => false),
        ),
      ).toBe(false);
    });

    it("`map` should return the transformed value", () => {
      expect(
        pipe(
          result,
          map((value) => value + 10),
        ),
      ).toStrictEqual(Ok(52));
    });

    it("`mapErr` should return the original result", () => {
      expect(pipe(result, mapErr(jest.fn()))).toBe(result);
    });

    it("`mapOr` should return the original value", () => {
      expect(
        pipe(
          result,
          mapOr(0, (v) => v),
        ),
      ).toBe(42);
    });

    it("`mapOrElse` should return the original value", () => {
      expect(
        pipe(
          result,
          mapOrElse(
            () => 0,
            (v) => v,
          ),
        ),
      ).toBe(42);
    });

    it("`mapOrElse` should not call the function", () => {
      const fnWhenErr = jest.fn();

      pipe(result, mapOrElse(fnWhenErr, jest.fn()));

      expect(fnWhenErr).not.toHaveBeenCalled();
    });

    it("`mapOrElse` should apply success function", () => {
      const fnWhenErr = jest.fn();
      const fnWhenOk = (n: number) => n / 2;

      expect(pipe(result, mapOrElse(fnWhenErr, fnWhenOk))).toBe(21);
    });

    it("`or` should return the original result", () => {
      const other = Ok(0);

      expect(pipe(result, or(other))).toBe(result);
    });

    it("`orElse` should return the original result", () => {
      const sq = (x: number): Result<number, number> => Ok(x * x);

      expect(pipe(result, orElse(sq), orElse(sq))).toBe(result);
    });

    it("`unwrap` should return the value", () => {
      expect(unwrap(result)).toBe(42);
    });

    it("`unwrapErr` should throw an error", () => {
      expect(() => unwrapErr(result)).toThrow("Called `unwrapErr` on an `Ok` value");
    });

    it("`unwrapOr` should return the value", () => {
      expect(pipe(result, unwrapOr(2))).toBe(42);
    });

    it("`unwrapOrElse` should return the value", () => {
      expect(
        pipe(
          result,
          unwrapOrElse(() => 2),
        ),
      ).toBe(42);
    });
  });

  describe("with a failed result", () => {
    const result = Err("error") as Result<number, string>;

    it("`and` should return the error", () => {
      const other = Ok("other") as Result<string, string>;

      expect(pipe(result, and(other))).toBe(result);
    });

    it("`andThen` should return the error", () => {
      const addTen = (value: number) => Ok(value + 10) as Result<number, string>;

      expect(pipe(result, andThen(addTen))).toBe(result);
    });

    it("`expect` should throw the error", () => {
      expect(() => pipe(result, expectResult("This should panic"))).toThrow("This should panic");
    });

    it("`expectErr` should return the error", () => {
      expect(pipe(result, expectErr("This should not panic"))).toBe("error");
    });

    it("`flatten` should return the error", () => {
      const nested = result as Result<Result<number, string>, string>;

      expect(pipe(nested, flatten)).toBe(result);
    });

    it("`inspect` should return the original result", () => {
      expect(pipe(result, inspect(jest.fn()))).toBe(result);
    });

    it("`inspect` should not call the function", () => {
      const fn = jest.fn();

      pipe(result, inspect(fn));

      expect(fn).not.toHaveBeenCalled();
    });

    it("`inspectErr` should return the original result", () => {
      expect(pipe(result, inspectErr(jest.fn()))).toBe(result);
    });

    it("`inspectErr` should call the function with the error", () => {
      const fn = jest.fn();

      pipe(result, inspectErr(fn));

      expect(fn).toHaveBeenCalledWith("error");
    });

    it("`isErr` should return true", () => {
      expect(isErr(result)).toBe(true);
    });

    it("`isErrAnd` should return true if the predicate returns `true`", () => {
      expect(
        pipe(
          result,
          isErrAnd(() => true),
        ),
      ).toBe(true);
    });

    it("`isErrAnd` should return false if the predicate returns `false`", () => {
      expect(
        pipe(
          result,
          isErrAnd(() => false),
        ),
      ).toBe(false);
    });

    it("`isOk` should return false", () => {
      expect(isOk(result)).toBe(false);
    });

    it("`isOkAnd` should return false", () => {
      expect(
        pipe(
          result,
          isOkAnd(() => true),
        ),
      ).toBe(false);
    });

    it("`map` should return the error", () => {
      expect(
        pipe(
          result,
          map((value) => value + 10),
        ),
      ).toBe(result);
    });

    it("`mapErr` should return the transformed error", () => {
      expect(
        pipe(
          result,
          mapErr((error) => `${error} transformed`),
        ),
      ).toStrictEqual(Err("error transformed"));
    });

    it("`mapOr` should return the default value", () => {
      expect(pipe(result, mapOr(0, jest.fn()))).toBe(0);
    });

    it("`mapOrElse` should return the default value", () => {
      expect(
        pipe(
          result,
          mapOrElse(() => 0, jest.fn()),
        ),
      ).toBe(0);
    });

    it("`mapOrElse` should not call the function", () => {
      const fnWhenOk = jest.fn();

      pipe(result, mapOrElse(jest.fn(), fnWhenOk));

      expect(fnWhenOk).not.toHaveBeenCalled();
    });

    it("`or` should return the other result", () => {
      const other = Ok("hey") as Result<number, string>;

      expect(pipe(result, or(other))).toBe(other);
    });

    it("`orElse` should return the other result", () => {
      const result = Err(0) as Result<number, number>;
      const sq = (x: number): Result<number, number> => Ok(x * x);

      expect(pipe(result, orElse(sq), orElse(sq))).toStrictEqual(Ok(0));
    });

    it("`unwrap` should throw the error", () => {
      expect(() => unwrap(result)).toThrow("Called `unwrap` on an `Err` value");
    });

    it("`unwrapErr` should return the error", () => {
      expect(unwrapErr(result)).toBe("error");
    });

    it("`unwrapOr` should return the default value", () => {
      expect(pipe(result, unwrapOr(2))).toBe(2);
    });

    it("`unwrapOrElse` should return the default value", () => {
      expect(
        pipe(
          result,
          unwrapOrElse(() => 2),
        ),
      ).toBe(2);
    });
  });

  it("`tryCatch` should return an `Ok` result with a function", () => {
    expect(tryCatch(() => 5)).toStrictEqual(Ok(5));
  });

  it("`tryCatch` should return an `Ok` result with an object param", () => {
    expect(
      tryCatch({
        try: () => 5,
        catch: jest.fn(),
      }),
    ).toStrictEqual(Ok(5));
  });

  it("`tryCatch` should return a generic error with function", () => {
    expect(
      tryCatch(() => {
        throw new Error("oh");
      }),
    ).toStrictEqual(Err(new UnknownException({ error: new Error("oh") })));
  });

  it("`tryCatch` should return a custom error with object param", () => {
    expect(
      tryCatch({
        try: () => {
          throw new Error("oh");
        },
        catch: () => "failed",
      }),
    ).toStrictEqual(Err("failed"));
  });

  it("`tryPromise` should return an `Ok` result with a function", async () => {
    expect(await tryPromise(() => Promise.resolve(5))).toStrictEqual(Ok(5));
  });

  it("`tryPromise` should return an `Ok` result with an object param", async () => {
    expect(
      await tryPromise({
        try: () => Promise.resolve(5),
        catch: jest.fn(),
      }),
    ).toStrictEqual(Ok(5));
  });

  it("`tryPromise` should return a generic error with function", async () => {
    expect(
      await tryPromise(() => {
        return Promise.reject(new Error("oh"));
      }),
    ).toStrictEqual(Err(new UnknownException({ error: new Error("oh") })));
  });

  it("`tryPromise` should return a custom error with object param", async () => {
    expect(
      await tryPromise({
        try: () => {
          return Promise.reject(new Error("oh"));
        },
        catch: () => "failed",
      }),
    ).toStrictEqual(Err("failed"));
  });
});
