import { UnionToIntersection } from './union-to-intersection.type';

// merge union
export type MergeUnion<U> = {
    [K in keyof UnionToIntersection<U>]: UnionToIntersection<U>[K];
};
