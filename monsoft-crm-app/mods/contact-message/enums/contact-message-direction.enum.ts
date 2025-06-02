import { z } from 'zod';

export const contactMessageDirectionEnum = z.enum(['inbound', 'outbound']);

export type ContactMessageDirection = z.infer<
    typeof contactMessageDirectionEnum
>;
