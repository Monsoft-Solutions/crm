import { z } from 'zod';

export const contactSmsMessageDirectionEnum = z.enum(['inbound', 'outbound']);

export type ContactSmsMessageDirection = z.infer<
    typeof contactSmsMessageDirectionEnum
>;
