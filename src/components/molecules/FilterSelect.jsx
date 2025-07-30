import React from "react";
import Select from "@/components/atoms/Select";

const FilterSelect = ({ 
  label,
  value, 
  onChange, 
  options = [],
  placeholder = "All",
  className = ""
}) => {
  return (
    <Select
      label={label}
      value={value}
      onChange={onChange}
      className={className}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
};

export default FilterSelect;