import config from '../config';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import TransportStream from 'winston-transport';

const { combine, colorize, timestamp, label, printf, json, splat } = format;

const { NODE_ENV } = config();

console.info('node env in log library: ', NODE_ENV);

const printFormat = printf(msg => `${msg.timestamp} ${msg.label} ${msg.level}: ${msg.message}`)
const logFormat = (labelStr?: string, isJson = false) => {
    const common = combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        timestamp(),
        label({ label: labelStr ?? '' }),
        splat()
    );
    return combine(common, isJson ? json() : printFormat);
}

const newRotateFile = (filename: string, level = 'info', isJson = true) => {
    return new DailyRotateFile({
        level,
        filename: `logs/${filename}-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        handleExceptions: true,
        json: isJson,
        createSymlink: true,
        symlinkName: `${filename}.log`,
        maxSize: '1m',
        maxFiles: 20,
    }) as TransportStream;
}

const consoleLog = (label: string, consoleLevel: string) => {
    return new transports.Console({
        level: consoleLevel,
        format: combine(colorize(), logFormat(label, false))
    }) as TransportStream;
}

export const getAppLogger = (label = '', opt?: { isJson: boolean, consoleLevel: string }) => {
    const isJson = opt?.isJson ?? true
    const consoleLevel = opt?.consoleLevel ?? 'debug'
    const format = logFormat(label, isJson)
    const trans: TransportStream[] = [newRotateFile('error', 'error'), newRotateFile('app')]
    if (NODE_ENV === 'dev') {
      trans.push(consoleLog(label, consoleLevel))
    }

    return createLogger({
        format,
        transports: trans,
        exceptionHandlers: [
            newRotateFile('exception', 'error', false)
        ],
        exitOnError: false
    });
}

export const accessLogger = () => {
    const trans: TransportStream[] = [newRotateFile('access', 'http')]
    if (NODE_ENV === 'dev') {
      trans.push(consoleLog('access', 'debug'))
    }
    return createLogger({
        format: logFormat('access', false),
        transports: trans,
        exceptionHandlers: [
            newRotateFile('access-exception', 'error')
        ],
        exitOnError: false
    });
}

export const logger = createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.json(),
    format.printf(
      (info) =>
        `${info.timestamp} | ${info.level}: ${JSON.stringify(info.message)}`
    )
  ),
  defaultMeta: { service: 'stake-client' },
  transports: [
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new transports.File({ filename: 'logs/combined.log' }),
    new transports.Console({ level: 'debug' }),
  ],
});
