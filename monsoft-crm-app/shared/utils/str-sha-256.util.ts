import crypto from 'crypto';

export const strSha256 = (message: string) => {
    return crypto.createHash('sha256').update(message).digest('hex');
};
