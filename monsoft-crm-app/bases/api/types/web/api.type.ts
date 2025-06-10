import {
    UseTRPCMutationResult,
    UseTRPCQueryResult,
} from '@trpc/react-query/shared';

import { TRPCClientErrorLike } from '@trpc/client';

import { trpcReactInternalMethods } from '@api/constants';

import { trpcReact } from '../../providers/web/trpc-react.provider';

type TrpcReact = typeof trpcReact;

export type Api = Omit<
    {
        [G in keyof TrpcReact]: {
            [R in keyof TrpcReact[G]]: TrpcReact[G][R] extends {
                useQuery: (
                    ...args: infer A
                ) => UseTRPCQueryResult<unknown, TRPCClientErrorLike<infer T>>;
            }
                ? {
                      useQuery: (...args: A) => T extends {
                          output: infer O;
                      }
                          ? O extends {
                                data: infer D;
                                error: infer E;
                            }
                              ?
                                    | {
                                          data: D;
                                          error: E;
                                          isLoading: false;
                                          refetch: () => Promise<void>;
                                          isRefetching: boolean;
                                      }
                                    | {
                                          data: undefined;
                                          error: undefined;
                                          isLoading: true;
                                          refetch: () => Promise<void>;
                                          isRefetching: boolean;
                                      }
                              : O extends {
                                      error: infer E;
                                  }
                                ?
                                      | {
                                            data: undefined;
                                            error: E;
                                            isLoading: false;
                                            refetch: () => Promise<void>;
                                            isRefetching: boolean;
                                        }
                                      | {
                                            data: undefined;
                                            error: undefined;
                                            isLoading: true;
                                            refetch: () => Promise<void>;
                                            isRefetching: boolean;
                                        }
                                : never
                          : never;
                  }
                : TrpcReact[G][R] extends {
                        useMutation: (
                            ...args: infer A
                        ) => UseTRPCMutationResult<
                            infer O,
                            unknown,
                            infer I,
                            unknown
                        >;
                    }
                  ? {
                        mutate: (...args: [I]) => Promise<
                            O extends {
                                data: unknown;
                                error: unknown;
                            }
                                ? O
                                : O extends {
                                        error: infer E;
                                    }
                                  ? {
                                        data: undefined;
                                        error: E;
                                    }
                                  : never
                        >;
                    }
                  : TrpcReact[G][R];
        };
    },
    (typeof trpcReactInternalMethods)[number]
>;
