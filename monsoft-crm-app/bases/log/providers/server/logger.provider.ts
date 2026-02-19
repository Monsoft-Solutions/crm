import { createLogger, format, transports } from 'winston';

const { combine, timestamp, colorize, printf } = format;

const logFormat = printf((info) => {
    const ts = String(info.timestamp);
    const lvl = String(info.level);
    const msg = String(info.message);
    const label = info.label as string | undefined;

    const {
        timestamp: _ts,
        level: _lvl,
        message: _msg,
        label: _lbl,
        ...metadata
    } = info;

    const labelStr = label ? ` [${label}]` : '';
    const metaStr =
        Object.keys(metadata).length > 0 ? ` ${JSON.stringify(metadata)}` : '';

    return `[${ts}] [${lvl}]${labelStr} ${msg}${metaStr}`;
});

export const logger = createLogger({
    level: process.env.LOG_LEVEL ?? 'info',
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
    transports: [
        new transports.Console({
            format: combine(
                colorize(),
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                logFormat,
            ),
        }),
    ],
});
