import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  label,
  error,
  children,
  className,
  required,
  ...props 
}, ref) => {
  const selectStyles = "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 bg-white";
  const errorStyles = error ? "border-error-500 focus:ring-error-500 focus:border-error-500" : "";

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={cn(selectStyles, errorStyles, className)}
        required={required}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-sm text-error-600 mt-1">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;