import { z } from 'zod';

export const emailDraftToneEnum = z.enum(['professional', 'friendly', 'brief']);

export type EmailDraftTone = z.infer<typeof emailDraftToneEnum>;

export const draftEmailWithAiSchema = z.object({
    contactId: z.string(),
    subject: z.string().optional(),
    tone: emailDraftToneEnum,
});

export type DraftEmailWithAi = z.infer<typeof draftEmailWithAiSchema>;
