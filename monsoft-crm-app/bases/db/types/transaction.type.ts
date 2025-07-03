import { db } from '@db/providers/server';

export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
