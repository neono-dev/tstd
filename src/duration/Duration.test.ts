import { describe, expect, it } from "@jest/globals";
import { Err, Ok } from "../Result";
import { IntegerDivisionByZeroError } from "../math/errors/IntegerDivisionByZeroError";
import { pipe } from "../pipe";
import * as Duration from "./Duration";

describe("Duration", () => {
  describe("constructors", () => {
    it("should create a duration from any combination of time units", () => {
      const duration = Duration.from({ days: 4, hours: 3 });

      expect(duration).toStrictEqual({
        _hashCode: 356_400_000,
        milliseconds: 356_400_000,
        seconds: 356_400,
        minutes: 5940,
        hours: 99,
        days: 4.125,
      });
    });

    it("should create a duration with complex combinations of time units", () => {
      const duration = Duration.from({
        milliseconds: 500, // 500
        seconds: 30, // 30_000
        minutes: 15, // 900_000
        hours: 2, // 7_200_000
        days: 1, // 86_400_000
      });

      expect(duration).toStrictEqual({
        _hashCode: 94_530_500,
        milliseconds: 94_530_500,
        seconds: 94_530.5,
        minutes: 1_575.508_333_333_333_4,
        hours: 26.258_472_222_222_224,
        days: 1.094_103_009_259_259_2,
      });
    });

    it("should default all values to zero when creating a duration with no time units", () => {
      const duration = Duration.from({});

      expect(duration).toStrictEqual({
        _hashCode: 0,
        milliseconds: 0,
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 0,
      });
    });

    it("should create a duration from zero", () => {
      expect(Duration.zero).toStrictEqual({
        _hashCode: 0,
        milliseconds: 0,
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 0,
      });
    });

    it("should create a duration from milliseconds", () => {
      const duration = Duration.fromMilliseconds(50);

      expect(duration).toStrictEqual({
        _hashCode: 50,
        milliseconds: 50,
        seconds: 0.05,
        minutes: 0.05 / 60,
        hours: 0.05 / 3600,
        days: 0.05 / 86400,
      });
    });

    it("should create a duration from seconds", () => {
      const duration = Duration.fromSeconds(7);

      expect(duration).toStrictEqual({
        _hashCode: 7_000,
        milliseconds: 7000,
        seconds: 7,
        minutes: 7 / 60,
        hours: 7 / 3600,
        days: 7 / 86400,
      });
    });

    it("should create a duration from minutes", () => {
      const duration = Duration.fromMinutes(35);

      expect(duration).toStrictEqual({
        _hashCode: 2_100_000,
        milliseconds: 2_100_000,
        seconds: 2100,
        minutes: 35,
        hours: 35 / 60,
        days: 35 / 1440,
      });
    });

    it("should create a duration from hours", () => {
      const duration = Duration.fromHours(3);

      expect(duration).toStrictEqual({
        _hashCode: 10_800_000,
        milliseconds: 10_800_000,
        seconds: 10_800,
        minutes: 180,
        hours: 3,
        days: 1 / 8,
      });
    });

    it("should create a duration from days", () => {
      const duration = Duration.fromDays(1);

      expect(duration).toStrictEqual({
        _hashCode: 86_400_000,
        milliseconds: 86_400_000,
        seconds: 86_400,
        minutes: 1_440,
        hours: 24,
        days: 1,
      });
    });
  });

  describe("conversion", () => {
    it("should return the milliseconds from a duration", () => {
      const duration = Duration.fromMilliseconds(1000);

      const milliseconds = Duration.inMilliseconds(duration);

      expect(milliseconds).toBe(1000);
    });

    it("should return the seconds from a duration", () => {
      const duration = Duration.fromMilliseconds(1500);

      const seconds = Duration.inSeconds(duration);

      expect(seconds).toBe(1);
    });

    it("should return the minutes from a duration", () => {
      const duration = Duration.fromMilliseconds(180500);

      const minutes = Duration.inMinutes(duration);

      expect(minutes).toBe(3);
    });

    it("should return the hours from a duration", () => {
      const duration = Duration.fromMilliseconds(10800000);

      const hours = Duration.inHours(duration);

      expect(hours).toBe(3);
    });

    it("should return the days from a duration", () => {
      const duration = Duration.fromMilliseconds(86400000);

      const days = Duration.inDays(duration);

      expect(days).toBe(1);
    });
  });

  describe("math operations", () => {
    it("should add two durations", () => {
      const duration1 = Duration.fromDays(1);
      const duration2 = Duration.fromHours(3);

      const sum = pipe(duration1, Duration.add(duration2));

      expect(sum.milliseconds).toBe(97_200_000);
    });

    it("should subtract two durations", () => {
      const duration1 = Duration.fromDays(1);
      const duration2 = Duration.fromHours(3);

      const difference = pipe(duration1, Duration.subtract(duration2));

      expect(difference.milliseconds).toBe(75_600_000);
    });

    it("should multiply a duration by a scalar", () => {
      const duration = Duration.fromDays(1);

      const product = pipe(duration, Duration.multiply(3));

      expect(product.days).toBe(3);
    });

    it("should divide a duration by a scalar", () => {
      const duration = Duration.fromDays(3);

      const quotient = pipe(duration, Duration.divide(3));

      expect(quotient).toStrictEqual(Ok(Duration.fromDays(1)));
    });

    it("should return an error when dividing by zero", () => {
      const duration = Duration.fromDays(3);

      const quotient = pipe(duration, Duration.divide(0));

      expect(quotient).toStrictEqual(Err(new IntegerDivisionByZeroError()));
    });

    it("should invert a duration", () => {
      const duration = Duration.fromDays(3);

      const inverted = Duration.invert(duration);

      expect(inverted.days).toBe(-3);
    });

    it("should return the absolute value of a duration", () => {
      const duration = Duration.fromDays(-3);

      const absolute = Duration.abs(duration);

      expect(absolute.days).toBe(3);
    });
  });

  describe("comparison operations", () => {
    it("should compare two durations for equality", () => {
      const duration1 = Duration.fromDays(1);
      const duration2 = Duration.fromHours(24);

      const areEqual = pipe(duration1, Duration.equals(duration2));

      expect(areEqual).toBe(true);
    });

    it("should compare two durations for inequality", () => {
      const duration1 = Duration.fromDays(1);
      const duration2 = Duration.fromHours(25);

      const areEqual = pipe(duration1, Duration.equals(duration2));

      expect(areEqual).toBe(false);
    });

    it("should compare two durations for greater than", () => {
      const duration1 = Duration.fromDays(1);
      const duration2 = Duration.fromHours(24);

      const isGreaterThan = pipe(duration1, Duration.isGreaterThan(duration2));

      expect(isGreaterThan).toBe(false);
    });

    it("should compare two durations for greater than or equal", () => {
      const duration1 = Duration.fromDays(1);
      const duration2 = Duration.fromHours(24);

      const isGreaterThanOrEqual = pipe(duration1, Duration.isGreaterThanOrEqual(duration2));

      expect(isGreaterThanOrEqual).toBe(true);
    });

    it("should compare two durations for less than", () => {
      const duration1 = Duration.fromDays(1);
      const duration2 = Duration.fromHours(24);

      const isLessThan = pipe(duration1, Duration.isLessThan(duration2));

      expect(isLessThan).toBe(false);
    });

    it("should compare two durations for less than or equal", () => {
      const duration1 = Duration.fromDays(1);
      const duration2 = Duration.fromHours(24);

      const isLessThanOrEqual = pipe(duration1, Duration.isLessThanOrEqual(duration2));

      expect(isLessThanOrEqual).toBe(true);
    });
  });
});
