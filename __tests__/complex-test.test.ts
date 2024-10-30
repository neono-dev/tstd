import { describe, expect, it } from "@jest/globals";
import { pipe } from "../src";
import * as Option from "../src/Option";
import * as Result from "../src/Result";

const obfuscateFirstAndLastName = (
  firstName: string,
  lastName: string,
): Result.Result<string, Error> => {
  if (firstName.trim().length === 0) {
    return Result.Err(new Error("First name is empty"));
  }
  if (lastName.trim().length === 0) {
    return Result.Err(new Error("Last name is empty"));
  }
  return Result.Ok([firstName.trim().charAt(0), lastName.trim().charAt(0)].join(""));
};

const upper = (str: string) => str.toUpperCase();

describe("complex test", () => {
  it("should return an obfuscated first and last name", () => {
    const maybeFirstName = Option.Some("john");
    const maybeLastName = Option.Some("doe");

    expect(
      pipe(
        maybeFirstName,
        Option.zipWith(maybeLastName, obfuscateFirstAndLastName),
        Option.map(Result.map(upper)),
        Option.map(Result.ok),
        Option.flatten,
      ),
    ).toStrictEqual(Option.Some("JD"));
  });

  it("should return a `None` with at least one value to `None`", () => {
    const maybeFirstName = Option.Some("john");
    const maybeLastName = Option.None;

    expect(
      pipe(
        maybeFirstName,
        Option.zipWith(maybeLastName, obfuscateFirstAndLastName),
        Option.map(Result.map(upper)),
        Option.map(Result.ok),
        Option.flatten,
      ),
    ).toBe(Option.None);
  });
});
