import { Success } from '@errors/utils';

// utility to delete duplicates from an array
// if a callback is provided, equality is checked using return values
// otherwise, use the array values themselves
export function deleteDuplicates<T>(
    arr: T[],
    callback: (item: T) => unknown = (item) => item,
): ReturnType<typeof Success<T[]>> {
    // create an empty set to store seen values
    const seen = new Set();

    // filter the array, keeping only unique values
    const deduped = arr.filter((item) => {
        // get the key for the item
        const key = callback(item);

        // if the value has already been seen, discard it
        if (seen.has(key)) return false;

        // otherwise, add it to the set
        seen.add(key);

        // and keep it
        return true;
    });

    return Success(deduped);
}
