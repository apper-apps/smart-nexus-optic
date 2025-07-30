import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ActionButton = ({ 
  icon, 
  children, 
  variant = "secondary", 
  size = "md",
  onClick,
  disabled = false,
  className = "",
  ...props
}) => {
const iconSize = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4";
  
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 ${className}`}
      {...props}
    >
      {icon && <ApperIcon name={icon} className={iconSize} />}
      {children}
    </Button>
  );
};

export default ActionButton;