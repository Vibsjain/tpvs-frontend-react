import { memo } from "react";
import './selectComponent.css'

const SelectComponent = memo(function SelectComponent(params){
    const {label, options, onChange} = params;
    return (
        <label className="detailFormLabel">
            {label}
            <select onChange={onChange} className="detailFormSelect" >
                {options.map((option) => (
                    <option className="detailFormSelectOption" value={option}>{option}</option>
                ))}
            </select>
        </label>
    )
})

export default SelectComponent;