import { describe, expect, it } from "@jest/globals";
import { pipe } from "../pipe";
import { compare, createComparable, equals } from "./Comparable";

describe("Comparable", () => {
  it("should create a Comparable object with a hash code", () => {
    // Arrange
    const value = 5;

    // Act
    const comparable = createComparable(value);

    // Assert
    expect(comparable).toStrictEqual({
      _hashCode: 5,
    });
  });

  it("should check equality between two Comparable objects", () => {
    // Arrange
    const comparable1 = createComparable(5);
    const comparable2 = createComparable(5);

    // Act
    const areEqual = pipe(comparable1, equals(comparable2));

    // Assert
    expect(areEqual).toBe(true);
  });

  it("should check equality between two complex Comparable objects", () => {
    // Arrange
    const comparable1 = createComparable({ a: 5, b: "test" });
    const comparable2 = createComparable({ a: 5, b: "test" });

    // Act
    const areEqual = pipe(comparable1, equals(comparable2));

    // Assert
    expect(areEqual).toBe(true);
  });

  it("should check inequality between two Comparable objects", () => {
    // Arrange
    const comparable1 = createComparable(5);
    const comparable2 = createComparable(10);

    // Act
    const areEqual = pipe(comparable1, equals(comparable2));

    // Assert
    expect(areEqual).toBe(false);
  });

  it("should compare two Comparable objects", () => {
    // Arrange
    const comparable1 = createComparable(5);
    const comparable2 = createComparable(10);

    // Act
    const comparison = pipe(comparable1, compare(comparable2));

    // Assert
    expect(comparison).toBe(-1);
  });

  it("should compare two complex Comparable objects", () => {
    // Arrange
    const comparable1 = createComparable({ a: 10, b: "test" });
    const comparable2 = createComparable({ a: 5, b: "test" });

    // Act
    const comparison = pipe(comparable1, compare(comparable2));

    // Assert
    expect(comparison).toBe(1);
  });

  it("should compare two complex Comparable objects", () => {
    // Arrange
    const comparable1 = createComparable({ a: 5, b: "test" });
    const comparable2 = createComparable({ a: 5, b: "test" });

    // Act
    const comparison = pipe(comparable1, compare(comparable2));

    // Assert
    expect(comparison).toBe(0);
  });
});
