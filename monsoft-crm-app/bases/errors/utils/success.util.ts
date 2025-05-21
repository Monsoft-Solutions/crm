export function Success(): {
    data: undefined;
    error: null;
};
export function Success<Output>(data: Output): {
    data: Output;
    error: null;
};
export function Success<Output>(data?: Output): {
    data: Output | undefined;
    error: null;
} {
    return { data, error: null };
}
