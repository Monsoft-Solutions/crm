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
});

export type CreateBrand = z.infer<typeof createBrandSchema>;
