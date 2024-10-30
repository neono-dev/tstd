type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

const ErrorBase: new <A extends Record<string, any> = {}>(
  args: Equals<A, {}> extends true ? void : { readonly [P in keyof A]: A[P] },
) => Readonly<A> = (() =>
  class Base extends globalThis.Error {
    constructor(args: any) {
      super();
      if (args) {
        Object.assign(this, args);
      }
    }
  } as any)();

/**
 * This is useful for creating tagged errors.
 * These errors bear a distinct property named `_tag`, which acts as their unique identifier,
 * allowing you to differentiate them from one another.
 * @param tag Unique error tag
 * @constructor
 * @example
 * class FooError extends TaggedError("Foo")<{ message: string }> {}
 *
 * const program = (): Result.Result<string, FooError> => {
 *   const value = Math.random();
 *   if (value > 0.5) return Result.ok("Yay!");
 *   return Result.err(new FooError({ message: "Oh no!" }));
 * }
 */
export const TaggedError = <Tag extends string>(
  tag: Tag,
): (new <A extends Record<string, any> = {}>(
  args: Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P] },
) => { readonly _tag: Tag } & Readonly<A>) => {
  class Base extends ErrorBase {
    readonly _tag = tag;
  }
  (Base.prototype as any).name = tag;
  return Base as any;
};
