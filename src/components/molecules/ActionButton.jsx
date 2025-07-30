import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ActionButton = ({ 
  icon, 
  children, 
  variant = "secondary", 
  onClick,
  disabled = false,
  className = "",
  ...props 
}) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 ${className}`}
      {...props}
    >
      {icon && <ApperIcon name={icon} className="h-4 w-4" />}
      {children}
    </Button>
  );
};

export default ActionButton;