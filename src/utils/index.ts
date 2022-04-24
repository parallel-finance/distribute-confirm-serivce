import { Moment } from 'moment'
import { getAppLogger } from '../logger';

const log = getAppLogger('Utils')

type TimeUnit = 'hours' | 'days' | 'seconds' | 'minutes'

export const sleep = async (sec: number) => {
    return new Promise((resolve) => {
        const timer = setTimeout(() => {
            resolve(' enough sleep~')
            clearTimeout(timer)
        }, sec)
    })
}

export const diffTime = (start: Moment, end: Moment, unit: TimeUnit): number => {
    return end.diff(start, unit)
}

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

export const unexpectedListener = (): void => {
    log.info('Unexpected listener start: ')
    errorTypes.map(type => {
        process.on(type, async (err) => {
            try {
                log.error(`process on ${type}: %o`, err)
                process.exit(1)
            } catch (_) {
                log.error(`process catch ${type}: %o`, err)
                process.exit(2)
            }
        })
    })

    signalTraps.map((type) => {
        process.once(type, async (err) => {
            try {
                log.error(`process on signal event: ${type}: %o`, err)
            } finally {
                process.kill(process.pid, type)
            }
        })
    })
}
