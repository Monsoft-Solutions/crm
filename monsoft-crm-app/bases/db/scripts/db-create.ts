import { createDb } from '@db/providers/dist';

void createDb().then(() => {
    process.exit(0);
});
