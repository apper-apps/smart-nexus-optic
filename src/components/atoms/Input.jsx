import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  label,
  error,
  className,
  type = "text",
  required,
  ...props 
}, ref) => {
  const inputStyles = "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 search-input";
  const errorStyles = error ? "border-error-500 focus:ring-error-500 focus:border-error-500" : "";

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={cn(inputStyles, errorStyles, className)}
        required={required}
        {...props}
      />
      {error && (
        <p className="text-sm text-error-600 mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;