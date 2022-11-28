import { ChangeEvent, useState } from 'react'
import styles from '../styles/MultiSelect.module.css'
import { OnChange } from '../@types/app'

export type Selected = Set<string>
export type Option = {value: string, text: string, defaultChecked?: boolean, disabled?: boolean}

export interface MultiSelectProps {
    name?: string
    options?: Option[]
    onChange?: (selected: Selected) => void
}

export const MultiSelect = ({ name = '', options = [], onChange }: MultiSelectProps) => {
    const defaultSelected = options.reduce((acc: Selected, cur: Option) => cur.defaultChecked ? acc.add(cur.value) : acc, new Set())
    const [selected, setSelected] = useState<Selected>(defaultSelected)
    const onInputChange: (value: string) => OnChange = value => {
        return event => {
            const newSelected = new Set(selected)
            event.target.checked ? newSelected.add(value) : newSelected.delete(value)
            setSelected(newSelected)
            onChange && onChange(newSelected)
        }
    }

    return <fieldset className="MultiSelect flex flex-row flex-wrap gap-[4%]">
        { options.map((option, idx) => 
            <div key={idx} className="flex gap-1 items-baseline basis-[48%]">
                <input type="checkbox" className={styles.input} id={option.value} name={name} value={option.value}
                    onChange={onInputChange(option.value)}
                    defaultChecked={option.defaultChecked}
                    disabled={option.disabled}/>
                <label htmlFor={option.value} className="text-gray-700 text-base">{option.text}</label>
            </div>
        ) }
    </fieldset>
}

export default MultiSelect