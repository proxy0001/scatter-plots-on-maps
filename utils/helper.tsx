import { RGBA } from '../@types/app'
/**
 * 
 * @param rgba 
 * @returns 
 * https://stackoverflow.com/questions/49974145/how-to-convert-rgba-to-hex-color-code-using-javascript
 */
export const rgba2hex = (rgba: RGBA): string => {
    const r = Math.round(Math.round(rgba.r * 100) / 100 * 255)
    const g = Math.round(Math.round(rgba.g * 100) / 100 * 255)
    const b = Math.round(Math.round(rgba.b * 100) / 100 * 255)
    const a = Math.round(Math.round(rgba.a * 100) / 100 * 255)
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1) + (a + 0x10000).toString(16).slice(-2).toUpperCase()
}
/**
 * 
 * @param timestamp 
 * @returns 
 * https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
 */
export const timestampFormatter = (timestamp: string | number) => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000
    return new Date(timestamp as number * 1000 - tzoffset).toISOString().slice(0, 19).replace(/-/g, '/').replace('T', ' ').replace(/:\d{2}$/, '');
}

export type TimeUnit = 'hour' | 'minute'

/**
 * 
 * @param unixTimestamp 
 * @param unit: 'hour' | 'minute'
 * @returns 
 */
export const unixTimestampToTimeOfDate = (unixTimestamp: number, unit:TimeUnit = 'minute') => {
    const datetime = new Date(unixTimestamp * 1000)
    const hours = datetime.getHours()
    const minutes = datetime.getMinutes()
    if (unit === 'hour') return hours
    return hours * 60 + minutes
}

export const filterProducer = (() => {
    const combiningCondition = 'all'
    const filters: any[] = []

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
    /**
     * 
     * @param idx 條件要放在第幾位，如果對同樣位子增加條件的話，會覆寫該位子的條件。
     * @param args 後面要照 expression 的順序放入，有兩種不同的狀況，如果沒有 key，就放入 undefined。
     *  1. operator, property key, value1, value2 ,...
     *  2. operator, value1, value2, ...
     * @returns 
     */
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
        addFilter,
        deleteFilter,
    }
})()