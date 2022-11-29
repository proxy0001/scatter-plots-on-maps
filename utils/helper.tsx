import { RGBA } from '../@types/app'

export const rgba2hex = (rgba: RGBA): string => {
    const r = Math.round(Math.round(rgba.r * 100) / 100 * 255)
    const g = Math.round(Math.round(rgba.g * 100) / 100 * 255)
    const b = Math.round(Math.round(rgba.b * 100) / 100 * 255)
    const a = Math.round(Math.round(rgba.a * 100) / 100 * 255)
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1) + (a + 0x10000).toString(16).slice(-2).toUpperCase()
}

export const timestampFormatter = (timestamp: string | number) => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000
    return new Date(timestamp as number * 1000 - tzoffset).toISOString().slice(0, 19).replace(/-/g, '/').replace('T', ' ').replace(/:\d{2}$/, '');
}

export const unixTimestampToMinutes = (unixTimestamp: number) => {
    const datetime = new Date(unixTimestamp * 1000)
    const hours = datetime.getHours()
    const minutes = datetime.getMinutes()
    return hours * 60 + minutes
}

export const filterProducer = (() => {
    const combiningCondition = 'all'
    const filters: any[] = []
    let combiningFilters = undefined

    const genFilter: (...args: any[]) => any[] | undefined = (operator, key, ...values) => {
        if (!operator) return undefined
        let filter = []
        if (key) filter = [operator, key, ...values]
        else filter = [operator, ...values]
        return filter
    }
    const combineFilters = (): any[] => {
        let result = undefined
        if (filters.filter(x => x).length <= 1) result = filters.find(x => x !== undefined)
        else result = [
        combiningCondition,
        ].concat(filters.filter(x => x !== undefined))
        return [...result]
    }
    const addFilter = (idx: number, ...args: any[]): any[] => {
        const filter = genFilter(...args)
        filters[idx] = filter
        return combineFilters()
    }
    const deleteFilter = (idx: number): any[] => {
        delete filters[idx]
        return combineFilters()
    }
    return {
        combiningFilters,
        addFilter,
        deleteFilter,
    }
})()