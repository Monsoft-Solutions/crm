import { organizationSeed } from './oraganization.seed';
import { userSeed } from './user.seed';

export const authSeed = async () => {
    await userSeed();
    await organizationSeed();
};
