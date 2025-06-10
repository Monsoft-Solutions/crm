export function getApiRequestTypeFromMethod(method: string) {
    switch (method) {
        case 'useQuery':
            return 'query';

        case 'mutate':
            return 'mutation';

        case 'useSubscription':
            return 'subscription';

        default:
            return 'unknown';
    }
}
