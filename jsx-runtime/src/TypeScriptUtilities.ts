/* eslint-disable @typescript-eslint/naming-convention */

/**
 * Represents a type that includes *almost* all falsy values in JavaScript.
 * Falsy values include `null`, `undefined`, `false`, `0`, `-0`, `0n`, `""`.
 * Although `NaN` is also falsy, but TypeScript does not have a type for `NaN`.
 * @see https://developer.mozilla.org/en-US/docs/Glossary/Falsy
 */
export type Falsy = null | undefined | false | 0 | -0 | 0n | "";
