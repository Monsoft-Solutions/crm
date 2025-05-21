// utility to wait for a given amount of time
// input: milliseconds to wait
// output: promise that resolves after the given time
export function wait(milliseconds: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}
