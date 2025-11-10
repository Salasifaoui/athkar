export interface Hijri {

    hijri: {
    date: string
    format: string
    day: string
    weekday: {
    en: string
    ar: string
    }
    month: {
    number: number
    en: string
    ar: string
    days: number
    }
    year: string
    designation: {
    abbreviated: string
    expanded: string
    }
    holidays: [any]
    adjustedHolidays: [string]
    method: string
    }
    gregorian: {
    date: string
    format: string
    day: string
    weekday: {
    en: string
    }
    month: {
    number: number
    en: string
    }
    year: string
    designation: {
    abbreviated: string
    expanded: string
    }
    lunarSighting: boolean
    }
}