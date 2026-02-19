import { z } from 'zod';

export const searchAvailableNumbersSchema = z.object({
    countryCode: z.string(),
    areaCode: z.string().optional(),
});

export type SearchAvailableNumbers = z.infer<
    typeof searchAvailableNumbersSchema
>;
