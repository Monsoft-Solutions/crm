import { Function } from '@errors/types';
import { Error, Success } from '@errors/utils';
import { catchError } from '@errors/utils/catch-error.util';

import { Tx } from '@db/types';

import { sendWhatsapp as sendTwilioWhatsapp } from '@twilio-whatsapp/providers';
import { sendWhatsapp as sendMetaWhatsapp } from '@meta/channels/whatsapp/providers';

import { getTwilioClientOrg } from '@twilio/providers';

import { getCustomConf, getCoreConf } from '@conf/providers/server';

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

    let defaultWhatsappRecord = whatsappNumbers.at(0);

    if (!defaultWhatsappRecord) {
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
            defaultWhatsappRecord = fallbackBrand.whatsappNumbers.at(0);
        }
    }

    if (!defaultWhatsappRecord) {
        logger.error('[sendBrandWhatsapp] No WhatsApp number found', {
            brandId,
        });
        return Error('NO_DEFAULT_WHATSAPP_NUMBER');
    }

    const { phoneNumber: defaultWhatsappNumber, metaPhoneNumberId } =
        defaultWhatsappRecord;

    const isSandbox = defaultWhatsappNumber === '+14155238886';

    // Meta Cloud API path: production numbers with metaPhoneNumberId
    if (!isSandbox && metaPhoneNumberId) {
        logger.info('[sendBrandWhatsapp] Sending via Meta Cloud API', {
            fromPhoneId: metaPhoneNumberId,
            to,
        });

        // Try org-level whatsappToken first, fall back to core conf
        const { data: customConf } = await getCustomConf({ organizationId });
        let authToken = customConf?.whatsappToken;

        if (!authToken) {
            const { data: coreConf, error: coreConfError } =
                await getCoreConf();

            if (coreConfError) {
                logger.error(
                    '[sendBrandWhatsapp] Failed to get Meta auth token',
                    { organizationId },
                );
                return Error('META_AUTH_TOKEN_MISSING');
            }

            authToken = coreConf.whatsappToken;
        }

        const { data: message, error: messageError } = await sendMetaWhatsapp({
            authToken,
            fromPhoneId: metaPhoneNumberId,
            to,
            body,
        });

        if (messageError) {
            logger.error('[sendBrandWhatsapp] Meta send failed', {
                fromPhoneId: metaPhoneNumberId,
                to,
                error: String(messageError),
            });
            return Error('WHATSAPP_SEND_FAILED');
        }

        const { sid } = message;

        logger.info('[sendBrandWhatsapp] Message sent via Meta', { sid });

        return Success({ sid });
    }

    // Twilio path: sandbox or numbers without metaPhoneNumberId
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

    const statusCallback = isSandbox
        ? appUrl + twilioSandboxWebhookPath
        : undefined;

    logger.info('[sendBrandWhatsapp] Sending via Twilio', {
        from: defaultWhatsappNumber,
        to,
        isSandbox,
    });

    const { data: message, error: messageError } = await sendTwilioWhatsapp({
        client,
        from: defaultWhatsappNumber,
        to,
        body,
        statusCallback,
    });

    if (messageError) {
        logger.error('[sendBrandWhatsapp] Twilio send failed', {
            from: defaultWhatsappNumber,
            to,
            error: String(messageError),
        });
        return Error('WHATSAPP_SEND_FAILED');
    }

    const { sid } = message;

    logger.info('[sendBrandWhatsapp] Message sent via Twilio', { sid });

    return Success({ sid });
}) satisfies Function<
    { brandId: string; to: string; body: string; db: Tx },
    { sid: string }
>;
