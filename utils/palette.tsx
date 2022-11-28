import defaultColors from 'tailwindcss/colors'
/**
 * use these colors easily
 * https://tailwindcss.com/docs/customizing-colors
 */

export type Shade = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
export type Names = string[]
export interface Codes {
    data: string[],
    get: (idx: number) => string,
    jumpget: (idx: number, span?: number, offset?: number) => string,
}

const specials: Names = ['inherit', 'current', 'transparent', 'black', 'white']
const achromatics: Names = ['slate', 'gray', 'zinc', 'neutral', 'stone']
const colors: Names = Object.keys(defaultColors)
    .filter((k: string) => !achromatics.includes(k as keyof typeof defaultColors) && !specials.includes(k as keyof typeof defaultColors))

export const palette = (() => {
    const generator = (names: Names) => {
        return (shade: Shade = 700): Codes => {
            const codes = names.map((name: string) => defaultColors[name as keyof typeof defaultColors][shade])
                .sort((a, b) => a > b ? -1 : 1)
            const proxy = new Proxy(codes, {
                get: (target, name) => Reflect.get(target, parseInt(name as string) % target.length),
            })
            return {
                data: proxy,
                get: (i: number) => proxy[i],
                jumpget: (idx: number, span: number = 1, offset: number = 0) => proxy[offset + idx * span]
            }
        }
    }
    const all = generator(achromatics.concat(colors))
    const colours = generator(colors)
    return Object.assign({
        all,
        colours,
    }, defaultColors)
})()

export default palette

