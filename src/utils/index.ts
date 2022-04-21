import { Moment } from 'moment'
export * from './unexpect'

type TimeUnit = "hours" | "days" | "seconds" | "minutes"

export async function sleep(sec: number) {
    return new Promise((resolve, _reject) => {
        const timer = setTimeout(() => {
            resolve(' enough sleep~')
            clearTimeout(timer)
        }, sec)
    })
}

export function diffTime(start: Moment, end: Moment, unit: TimeUnit): number {
    return end.diff(start, unit)
}