import React from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

const CustomPropertyFields = ({ 
  properties = [], 
  values = {}, 
  onChange, 
  errors = {} 
}) => {
  const handleChange = (propertyName, value) => {
    if (onChange) {
      onChange(propertyName, value);
    }
  };

  const handleMultiSelectChange = (propertyName, selectedValue) => {
    const currentValues = values[propertyName] || [];
    let newValues;
    
    if (currentValues.includes(selectedValue)) {
      newValues = currentValues.filter(v => v !== selectedValue);
    } else {
      newValues = [...currentValues, selectedValue];
    }
    
    handleChange(propertyName, newValues);
  };

  const renderField = (property) => {
    const value = values[property.name] || "";
    const error = errors[property.name];

    switch (property.type) {
      case "text":
        return (
          <Input
            key={property.Id}
            label={property.label}
            name={property.name}
            value={value}
            onChange={(e) => handleChange(property.name, e.target.value)}
            error={error}
            required={property.required}
          />
        );

      case "number":
        return (
          <Input
            key={property.Id}
            type="number"
            label={property.label}
            name={property.name}
            value={value}
            onChange={(e) => handleChange(property.name, e.target.value)}
            error={error}
            required={property.required}
          />
        );

      case "date":
        return (
          <Input
            key={property.Id}
            type="date"
            label={property.label}
            name={property.name}
            value={value}
            onChange={(e) => handleChange(property.name, e.target.value)}
            error={error}
            required={property.required}
          />
        );

      case "dropdown":
        return (
          <Select
            key={property.Id}
            label={property.label}
            name={property.name}
            value={value}
            onChange={(e) => handleChange(property.name, e.target.value)}
            error={error}
            required={property.required}
          >
            <option value="">Select {property.label}</option>
            {(property.options || []).map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        );

      case "multi-select":
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div key={property.Id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {property.label}
              {property.required && <span className="text-error-500 ml-1">*</span>}
            </label>
            <div className="border border-gray-300 rounded-lg p-3 space-y-2 max-h-32 overflow-y-auto">
              {(property.options || []).map(option => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option)}
                    onChange={() => handleMultiSelectChange(property.name, option)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
            {error && (
              <p className="text-sm text-error-600 mt-1">{error}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!properties || properties.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Custom Properties</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {properties.map(renderField)}
        </div>
      </div>
    </div>
  );
};

export default CustomPropertyFields;