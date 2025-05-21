import { z } from 'zod';

import { connectionEnv } from '@env/constants/connection-env.constant';

const schemeAndHostPortSeparator = '://';

const hostAndPortSeparator = ':';

const schemeEnum = z.enum(['http', 'https']);

const hostPortSchema = z.string().min(1);

const hostSchema = z.string().min(1);

const portSchema = z.coerce.number();

const { MSS_FQDN } = connectionEnv;

const appSchemeAndHostWithInnerPort = MSS_FQDN.split(
    schemeAndHostPortSeparator,
);

export const appScheme = schemeEnum.parse(appSchemeAndHostWithInnerPort.at(0));

const appHostWithInnerPort = hostPortSchema.parse(
    appSchemeAndHostWithInnerPort.at(1),
);

const appHostAndInnerPort = appHostWithInnerPort.split(hostAndPortSeparator);

export const appHost = hostSchema.parse(appHostAndInnerPort.at(0));

export const appInnerPort = portSchema.parse(appHostAndInnerPort.at(1));

export const appOuterPort =
    appHost === 'localhost' ? appInnerPort : appScheme === 'http' ? 80 : 443;

export const appUrl = `${appScheme}://${appHost}:${appOuterPort.toString()}`;
