import * as Result from "../Result";
import { type Comparable, createComparable } from "../comparable/Comparable";
import { IntegerDivisionByZeroError } from "../math/errors/IntegerDivisionByZeroError";
import {
  MILLISECONDS_PER_DAY,
  MILLISECONDS_PER_HOUR,
  MILLISECONDS_PER_MINUTE,
  MILLISECONDS_PER_SECOND,
} from "./constants";

export interface Duration extends Comparable {
  milliseconds: number;
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
}

/**
 * Convert a given amount of time to a duration object.
 * @param value - The amount of time in the smallest unit (milliseconds, seconds, etc.).
 * @param unitToMilliseconds - Conversion factor from the provided unit to milliseconds.
 * @returns A Duration object with precise values.
 */
const toDuration = (value: number, unitToMilliseconds: number): Duration => {
  const milliseconds = value * unitToMilliseconds;

  return {
    milliseconds,
    seconds: milliseconds / MILLISECONDS_PER_SECOND,
    minutes: milliseconds / MILLISECONDS_PER_MINUTE,
    hours: milliseconds / MILLISECONDS_PER_HOUR,
    days: milliseconds / MILLISECONDS_PER_DAY,
    ...createComparable(milliseconds),
  };
};

//#region Factory functions

/**
 * Create a Duration object from a given amount of time.
 * All values will be added to the duration.
 *
 * @param milliseconds
 * @param seconds
 * @param minutes
 * @param hours
 * @param days
 *
 * @example
 * const duration = Duration.from({
 *   milliseconds: 500,
 *   seconds: 30,
 *   minutes: 15,
 *   hours: 2,
 *   days: 1,
 * });
 *
 * expect(duration).toStrictEqual({
 *   milliseconds: 937800500,
 *   seconds: 937800.5,
 *   minutes: 15630.008333333333,
 *   hours: 260.5001388888889,
 *   days: 10.854172453703704,
 * });
 */
export const from = ({
  milliseconds = 0,
  seconds = 0,
  minutes = 0,
  hours = 0,
  days = 0,
}: {
  milliseconds?: number;
  seconds?: number;
  minutes?: number;
  hours?: number;
  days?: number;
}): Duration => {
  return fromMilliseconds(
    milliseconds +
      seconds * MILLISECONDS_PER_SECOND +
      minutes * MILLISECONDS_PER_MINUTE +
      hours * MILLISECONDS_PER_HOUR +
      days * MILLISECONDS_PER_DAY,
  );
};

/**
 * Convert a duration in milliseconds to a Duration object.
 * @param milliseconds - The duration in milliseconds.
 * @returns A Duration object.
 */
export const fromMilliseconds = (milliseconds: number): Duration => {
  return toDuration(milliseconds, 1);
};

/**
 * Convert a duration in seconds to a Duration object.
 * @param seconds - The duration in seconds.
 * @returns A Duration object.
 */
export const fromSeconds = (seconds: number): Duration => {
  return toDuration(seconds, MILLISECONDS_PER_SECOND);
};

/**
 * Convert a duration in minutes to a Duration object.
 * @param minutes - The duration in minutes.
 * @returns A Duration object.
 */
export const fromMinutes = (minutes: number): Duration => {
  return toDuration(minutes, MILLISECONDS_PER_MINUTE);
};

/**
 * Convert a duration in hours to a Duration object.
 * @param hours - The duration in hours.
 * @returns A Duration object.
 */
export const fromHours = (hours: number): Duration => {
  return toDuration(hours, MILLISECONDS_PER_HOUR);
};

/**
 * Convert a duration in days to a Duration object.
 * @param days - The duration in days.
 * @returns A Duration object.
 */
export const fromDays = (days: number): Duration => {
  return toDuration(days, MILLISECONDS_PER_DAY);
};

/**
 * Create a Duration object with a value of zero.
 * @returns A Duration object with all values set to zero.
 * @example
 * const duration = Duration.zero;
 * expect(duration).toStrictEqual({
 *   milliseconds: 0,
 *   seconds: 0,
 *   minutes: 0,
 *   hours: 0,
 *   days: 0,
 * });
 */
export const zero = fromMilliseconds(0);

//#endregion

//#region Conversion functions

/**
 * Extract the millisecond value from a Duration object.
 * @param duration - The duration object.
 * @returns The time in milliseconds.
 */
export const inMilliseconds = (duration: Duration): number => {
  return duration.milliseconds;
};

/**
 * Extract the second value from a Duration object.
 * Applies Math.floor to return an integer value.
 * @param duration - The duration object.
 * @returns The time in seconds as an integer.
 */
export const inSeconds = (duration: Duration): number => {
  return Math.floor(duration.seconds);
};

/**
 * Extract the minute value from a Duration object.
 * Applies Math.floor to return an integer value.
 * @param duration - The duration object.
 * @returns The time in minutes as an integer.
 */
export const inMinutes = (duration: Duration): number => {
  return Math.floor(duration.minutes);
};

/**
 * Extract the hour value from a Duration object.
 * Applies Math.floor to return an integer value.
 * @param duration - The duration object.
 * @returns The time in hours as an integer.
 */
export const inHours = (duration: Duration): number => {
  return Math.floor(duration.hours);
};

/**
 * Extract the day value from a Duration object.
 * Applies Math.floor to return an integer value.
 * @param duration - The duration object.
 * @returns The time in days as an integer.
 * @example
 */
export const inDays = (duration: Duration): number => {
  return Math.floor(duration.days);
};

//#endregion

//#region Comparison functions

export const isLessThan =
  (duration2: Duration) =>
  (duration1: Duration): boolean => {
    return duration1.milliseconds < duration2.milliseconds;
  };

export const isLessThanOrEqual =
  (duration2: Duration) =>
  (duration1: Duration): boolean => {
    return duration1.milliseconds <= duration2.milliseconds;
  };

/**
 * Check if two durations are equal.
 * @param duration2 - The second duration to compare.
 * @returns A function that takes the first duration and returns true if both durations are equal.
 */
export const equals =
  (duration2: Duration) =>
  (duration1: Duration): boolean => {
    return duration1.milliseconds === duration2.milliseconds;
  };

/**
 * Check if one duration is greater than another.
 * @param duration2 - The duration to compare.
 * @returns A function that takes the first duration and returns true if it is greater than the second duration.
 */
export const isGreaterThan =
  (duration2: Duration) =>
  (duration1: Duration): boolean => {
    return duration1.milliseconds > duration2.milliseconds;
  };

/**
 * Check if one duration is greater than or equal to another.
 * @param duration2 - The duration to compare.
 * @returns A function that takes the first duration and returns true if it is greater than or equal to the second duration.
 */
export const isGreaterThanOrEqual =
  (duration2: Duration) =>
  (duration1: Duration): boolean => {
    return duration1.milliseconds >= duration2.milliseconds;
  };

//#endregion

//#region Operators

/**
 * Add two durations together.
 * @param duration2 - The second duration to add.
 * @returns A function that takes the first duration and returns the sum of both durations.
 */
export const add =
  (duration2: Duration) =>
  (duration1: Duration): Duration => {
    return fromMilliseconds(duration1.milliseconds + duration2.milliseconds);
  };

/**
 * Subtract one duration from another.
 * @param duration2 - The duration to subtract.
 * @returns A function that takes the first duration and returns the result of the subtraction.
 */
export const subtract =
  (duration2: Duration) =>
  (duration1: Duration): Duration => {
    return fromMilliseconds(duration1.milliseconds - duration2.milliseconds);
  };

export const divide =
  (quotient: number) =>
  (duration: Duration): Result.Result<Duration, IntegerDivisionByZeroError> => {
    if (quotient === 0) {
      return Result.Err(new IntegerDivisionByZeroError());
    }

    return Result.Ok(fromMilliseconds(duration.milliseconds / quotient));
  };

/**
 * Multiplies this {@link Duration} by the given `factor` and returns the result as a new {@link Duration} object.
 * @param factor - The factor to multiply this {@link Duration} by.
 * @returns A new {@link Duration} object with the result of the multiplication.
 */
export const multiply =
  (factor: number) =>
  (duration: Duration): Duration => {
    return fromMilliseconds(duration.milliseconds * factor);
  };

/**
 * Creates a new {@link Duration} with the opposite direction of this one.
 *
 * The returned {@link Duration} will have the same magnitude as the original, but with the opposite sign.
 * @param duration - The duration to invert.
 * @returns A new {@link Duration} with the opposite direction.
 */
export const invert = (duration: Duration): Duration => {
  return fromMilliseconds(-duration.milliseconds);
};

/**
 * Returns the absolute value of the given {@link Duration}.
 * @param duration - The duration to get the absolute value of.
 * @returns A new {@link Duration} with the absolute value of the original.
 */
export const abs = (duration: Duration): Duration => {
  return fromMilliseconds(Math.abs(duration.milliseconds));
};

//#endregion
