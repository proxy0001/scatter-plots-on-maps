import { ChangeEvent, useState } from 'react'

type onChange = (event: ChangeEvent<HTMLInputElement>) => void
type selected = Set<string>
type option = {value: string, text: string, defaultChecked?: boolean}

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

    return <div className="MultiSelect flex flex-row flex-wrap gap-[4%]">
        { options.map((option, idx) => 
            <div key={idx} className="flex gap-1 items-baseline basis-[48%]">
                <input type="checkbox" id={option.value} name={name} value={option.value}
                    onChange={onInputChange(option.value)}
                    defaultChecked={option.defaultChecked}/>
                <label htmlFor={option.value}>{option.text}</label>
            </div>
        ) }
    </div>
}

export default MultiSelect