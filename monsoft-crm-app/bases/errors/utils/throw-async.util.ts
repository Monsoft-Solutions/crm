import { LogContext } from '@log/types';

// util to throw an error asynchronously
export const throwAsync = (name: string, error?: LogContext) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        console.log(error);
    } else {
        void new Promise(() => {
            throw new Error(name);
        });
    }
};
