import { z } from 'zod';

export const usageSchema = z.enum(['current', 'next']);
