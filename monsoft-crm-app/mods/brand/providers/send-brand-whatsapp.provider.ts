import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { Tx } from '@db/types';

import { sendWhatsapp } from '@twilio-whatsapp/providers';

import { getTwilioClientOrg } from '@twilio/providers';

import { logger } from '@log/providers';

import { appUrl } from '@dist/constants';

import { twilioSandboxWebhookPath } from '@twilio/constants';

export const sendBrandWhatsapp = (async ({ brandId, to, body, db }) => {
    logger.info('[sendBrandWhatsapp] Starting', { brandId, to });

    const { data: brand, error: brandError } = await catchError(
        db.query.brand.findFirst({
            where: (record, { eq }) => eq(record.id, brandId),
            with: {
                whatsappNumbers: {
                    where: (record, { eq }) => eq(record.isDefault, 'true'),
                    limit: 1,
                },
            },
        }),
    );

    if (brandError) {
        logger.error('[sendBrandWhatsapp] Brand query failed', {
            brandId,
            error: String(brandError),
        });
        return Error();
    }

    if (!brand) {
        logger.error('[sendBrandWhatsapp] Brand not found', { brandId });
        return Error();
    }

    const { organizationId, whatsappNumbers } = brand;

    let defaultWhatsappNumber = whatsappNumbers.at(0)?.phoneNumber;

    if (!defaultWhatsappNumber) {
        const { data: fallbackBrand, error: fallbackError } = await catchError(
            db.query.brand.findFirst({
                where: (record, { eq }) => eq(record.id, brandId),
                with: {
                    whatsappNumbers: {
                        limit: 1,
                    },
                },
            }),
        );

        if (!fallbackError && fallbackBrand) {
            defaultWhatsappNumber =
                fallbackBrand.whatsappNumbers.at(0)?.phoneNumber;
        }
    }

    if (!defaultWhatsappNumber) {
        logger.error('[sendBrandWhatsapp] No WhatsApp number found', {
            brandId,
        });
        return Error('NO_DEFAULT_WHATSAPP_NUMBER');
    }

    const { data: client, error: clientError } = await getTwilioClientOrg({
        organizationId,
    });

    if (clientError) {
        logger.error('[sendBrandWhatsapp] Twilio client error', {
            organizationId,
            error: String(clientError),
        });
        return Error();
    }

    const isSandbox = defaultWhatsappNumber === '+14155238886';
    const statusCallback = isSandbox
        ? appUrl + twilioSandboxWebhookPath
        : undefined;

    logger.info('[sendBrandWhatsapp] Sending via WhatsApp', {
        from: defaultWhatsappNumber,
        to,
        isSandbox,
    });

    const { data: message, error: messageError } = await sendWhatsapp({
        client,
        from: defaultWhatsappNumber,
        to,
        body,
        statusCallback,
    });

    if (messageError) {
        logger.error('[sendBrandWhatsapp] Send failed', {
            from: defaultWhatsappNumber,
            to,
            error: String(messageError),
        });
        return Error('WHATSAPP_SEND_FAILED');
    }

    const { sid } = message;

    logger.info('[sendBrandWhatsapp] Message sent', { sid });

    const result = {
        sid,
    };

    return Success(result);
}) satisfies Function<
    { brandId: string; to: string; body: string; db: Tx },
    { sid: string }
>;
