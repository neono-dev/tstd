import { describe, expect, it } from "@jest/globals";
import { pipe } from "./pipe";

const addOne = (a: number) => a + 1;
const multiplyByTwo = (a: number) => a * 2;

describe("pipe", () => {
  it("should pipe a value through a series of functions", () => {
    const result = pipe(1, addOne, multiplyByTwo);

    expect(result).toBe(4);
  });
});
