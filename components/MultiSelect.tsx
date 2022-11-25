import { ChangeEvent, useState } from 'react'
import styles from '../styles/MultiSelect.module.css'

type onChange = (event: ChangeEvent<HTMLInputElement>) => void
type selected = Set<string>
type option = {value: string, text: string, defaultChecked?: boolean, disabled?: boolean}

interface MultiSelectProps {
    name?: string
    options?: Array<option>
    onChange?: (selected: selected) => void
}

const MultiSelect = ({ name = '', options = [], onChange }: MultiSelectProps) => {
    const defaultSelected = options.reduce((acc: selected, cur: option) => cur.defaultChecked ? acc.add(cur.value) : acc, new Set())
    const [selected, setSelected] = useState<selected>(defaultSelected)
    const onInputChange: (value: string) => onChange = value => {
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