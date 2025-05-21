import { apiSource } from './api-source.provider';

// Utility to create a tRPC router
export const endpoints = apiSource.router;
