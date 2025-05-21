import { apiSource } from './api-source.provider';

// Utility to merge multiple routers into a single one
export const mergeEndpoints = apiSource.mergeRouters;
