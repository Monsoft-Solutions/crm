import { dropDb } from '@db/providers/dist';

void dropDb().then(() => {
    process.exit(0);
});
