import { describe, expect, it } from "@jest/globals";
import { getHashCode } from "./get-hash-code";

describe("getHashCode", () => {
  it("should hash a string", () => {
    const hash = getHashCode("hello");

    expect(hash).toBe(99162322);
  });

  it("should hash an integer", () => {
    const hash = getHashCode(20);

    expect(hash).toBe(20);
  });

  it("should hash a float", () => {
    const hash = getHashCode(20.13);

    expect(hash).toBe(20130000);
  });

  it("should hash a boolean as true", () => {
    const hash = getHashCode(true);

    expect(hash).toBe(1);
  });

  it("should hash a boolean as false", () => {
    const hash = getHashCode(false);

    expect(hash).toBe(0);
  });

  it("should hash a symbol", () => {
    const hash = getHashCode(Symbol("hello"));

    expect(hash).toBe(-120716537);
  });

  it("should hash a function", () => {
    const hash = getHashCode(() => 5);

    expect(hash).toBe(-1949332683);
  });

  it("should hash an array", () => {
    const hash = getHashCode([1, 2]);

    expect(hash).toBe(33);
  });

  it("should hash an object", () => {
    const hash = getHashCode({
      hello: "world",
      my: [2, 3, 4],
      world() {
        return 12;
      },
    });

    expect(hash).toBe(1858407392);
  });

  it("should hash null", () => {
    expect(getHashCode(null)).toBe(0);
  });

  it("should hash undefined", () => {
    expect(getHashCode(undefined)).toBe(0);
  });
});
