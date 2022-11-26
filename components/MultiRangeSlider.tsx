import { ChangeEvent, useState } from 'react'
import styles from '../styles/MultiRangeSlider.module.css'

interface MultiRangeSliderProps {
    name?: string
    min?: number
    max?: number 
    onChange?: (min: number, max: number) => void
    format?: (val: number) => string
}

type onChange = (event: ChangeEvent<HTMLInputElement>) => void

const MultiRangeSlider = ({
    min: defaultMin = 0,
    max: defaultMax = 60 * 24,
    name = '',
    onChange,
    format,
}: MultiRangeSliderProps) => {
    const [min, setMin] = useState<number>(defaultMin)
    const [max, setMax] = useState<number>(defaultMax)
    
    const computeRangePercent = (numerator: number): number => Math.abs(Math.round(numerator / (defaultMax - defaultMin) * 100))
    const needSwitchThumbIndex = ():boolean => computeRangePercent(max - min) < 10 && computeRangePercent(max) > 90
    const display = (val: number): string => typeof format === 'function' ? format(val) : `${val}`

    const onMinChange:onChange = event => {
        const newMin: number = parseInt(event.target.value)
        if (newMin >= max) return
        setMin(newMin)
        if (typeof onChange === 'function') onChange(newMin, max)
    }
    const onMaxChange:onChange = event => {
        const newMax: number = parseInt(event.target.value)
        if (newMax <= min) return
        setMax(newMax)
        if (typeof onChange === 'function') onChange(newMax, min)
    }

    return <div className="MultiRangeSlider">
        <div className="h-4 relative flex items-center">
            <div className="relative w-full h-full flex items-center mx-2">
                <div className="absolute w-full h-1.5 rounded bg-gray-100"></div>
                <div className="absolute w-full h-1.5 rounded bg-green-400" style={{width: `${computeRangePercent(max - min)}%`, marginLeft: `${computeRangePercent(min - defaultMin)}%`}}></div>
                <div className={`text-gray-700 top-5 -translate-x-1/2 left-0 text-xs absolute text-center ${needSwitchThumbIndex() ? 'z-10' : ''}`} style={{marginLeft: `${computeRangePercent(min - defaultMin)}%`}}>
                    {display(min)}
                </div>
                <div className={`text-gray-700 top-5 translate-x-1/2 right-0 text-xs absolute text-center ${needSwitchThumbIndex() ? 'z-10' : ''}`} style={{marginRight: `${computeRangePercent(defaultMax - max)}%`}}>
                    {display(max)}
                </div>
            </div>
            <input type="range" className={`${styles.thumb} absolute h-0 w-full ${needSwitchThumbIndex() ? 'z-10' : ''}`} min={defaultMin} max={defaultMax} name={name} value={min} onChange={onMinChange}></input>
            <input type="range" className={`${styles.thumb} absolute h-0 w-full`} min={defaultMin} max={defaultMax} name={name} value={max} onChange={onMaxChange}></input>
        </div>
    </div>
}

export default MultiRangeSlider