import { z } from 'zod';

import { industryEnum, companySizeEnum } from '../enums';

export const createBrandSchema = z.object({
    name: z.string(),
    phoneNumber: z.string(),
    domain: z.string(),
    whatsappPhoneId: z.string(),
    whatsappPhoneNumber: z.string(),

    description: z.string(),
    industry: industryEnum,
    companySize: companySizeEnum,
    foundedYear: z.number(),

    coreValues: z.string().optional(),
    personalityTraits: z.string().optional(),
    communicationStyle: z.string().optional(),
    languagePreferences: z.string().optional(),
    voiceGuidelines: z.string().optional(),
    prohibitedContent: z.string().optional(),

    keyProducts: z.string().optional(),
    differentiators: z.string().optional(),
    painPoints: z.string().optional(),
    targetSegments: z.string().optional(),
});

export type CreateBrand = z.infer<typeof createBrandSchema>;
