import { TaggedError } from "../TaggedError";

export class UnknownException extends TaggedError("UnknownException")<{ error: Error }> {}
