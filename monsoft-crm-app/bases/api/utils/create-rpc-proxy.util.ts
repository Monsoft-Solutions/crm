export function createRpcProxy(
    callHandler: (path: string[], args: unknown[]) => unknown,
    path: string[] = [],
) {
    return new Proxy(() => undefined, {
        get(_, prop) {
            if (prop === 'then') return undefined; // Avoid Promise traps
            return createRpcProxy(callHandler, [...path, prop.toString()]);
        },

        apply(_, __, args) {
            return callHandler(path, args);
        },
    });
}
