import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children, 
  variant = "default", 
  size = "md",
  className,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full transition-all duration-200 lifecycle-badge";

  const variants = {
    default: "bg-gray-100 text-gray-800",
    lead: "bg-gradient-to-r from-info-100 to-info-200 text-info-800 border border-info-300",
    prospect: "bg-gradient-to-r from-warning-100 to-warning-200 text-warning-800 border border-warning-300",
    customer: "bg-gradient-to-r from-success-100 to-success-200 text-success-800 border border-success-300",
    primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border border-primary-300",
    accent: "bg-gradient-to-r from-accent-100 to-accent-200 text-accent-800 border border-accent-300"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
    lg: "px-3 py-1 text-sm"
  };

  return (
    <span
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;