import { Function } from '@errors/types';
import { Success } from '@errors/utils';

import { VerificationEmail } from '../../email';

import { sendEmail } from '../../../email/utils';

export const sendVerificationEmail = (async ({
    email,
    firstName,
    language = 'en',
    url,
}) => {
    // Email subject varies based on language
    const subject =
        language === 'es'
            ? `${firstName}, por favor verifica tu correo electrónico`
            : `${firstName}, please verify your email`;

    // Email text varies based on language
    const text =
        language === 'es'
            ? `Por favor verifica tu correo electrónico haciendo clic en ${url}`
            : `Please verify your email by clicking ${url}`;

    await sendEmail({
        from: 'Monsoft CRM <verify@monsoftcrm.com>',
        to: email,
        subject,
        html: `<p>${text}</p>`,
        text,
        react: VerificationEmail({ url, language }),
    });

    return Success();
}) satisfies Function<{
    email: string;
    firstName: string;
    lastName?: string;
    language?: string;
    url: string;
}>;
