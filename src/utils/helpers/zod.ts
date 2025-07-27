/**
 * `extractValuesAsTuple` extracts the values from a given enum-like object and returns them
 * in a tuple format.
 *
 * This helper is useful when working with libraries or utilities that expect a non-empty tuple
 * of string values, particularly when those utilities cannot accept a simple string array.
 *
 * @template T - The type of the enum-like object. It should be a record of string keys to string values.
 *
 * @param {T} obj - The enum-like object from which values should be extracted.
 *
 * @param keysOrValues "keys" | "values" - The type of the values to extract, the object's keys or values.
 *
 * @returns {[T[keyof T], ...T[keyof T][]]} - A tuple containing all the values from the given object.
 * The tuple is guaranteed to have at least one value.
 *
 * @example
 * const Colors = { RED: 'Red', GREEN: 'Green', BLUE: 'Blue' } as const;
 * const colorKeys = extractValuesAsTuple(Colors, "keys"); // ['RED', 'GREEN', 'BLUE']
 * const colorValues = extractValuesAsTuple(Colors, "values"); // ['Red', 'Green', 'Blue']
 *
 * @throws {Error} - Throws an error if the provided object is empty.
 */
export function extractAsTuple<T extends Record<string, unknown>>(
    obj: T,
    keysOrValues: "keys" | "values",
): [string, ...string[]] {
    let items: T[keyof T][] | (keyof T)[] = [];
    let tuple = [];

    if (keysOrValues === "keys") {
        items = Object.keys(obj) as (keyof T)[];
        tuple = items as [keyof T, ...(keyof T)[]];
    } else {
        items = Object.values(obj) as T[keyof T][];
        tuple = items as [T[keyof T], ...T[keyof T][]];
    }
    if (items.length === 0) throw new Error("Object must have at least one key/value.");

    // Explicitly extract the first value
    const result = [tuple[0], ...tuple.slice(1)] as [string, ...string[]];

    return result;
}
