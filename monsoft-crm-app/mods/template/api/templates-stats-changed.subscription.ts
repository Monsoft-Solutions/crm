import { publicEndpoint, subscribe } from '@api/providers/server';

// subscription to notify when the templates stats changed
export const onTemplatesStatsChanged = publicEndpoint.subscription(
    subscribe('templateStatsChanged', ({ data }) => data),
);
