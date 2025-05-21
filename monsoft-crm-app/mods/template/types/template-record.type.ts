import { templateTable } from '../db';

// template record type
export type TemplateRecord = typeof templateTable.$inferSelect;
