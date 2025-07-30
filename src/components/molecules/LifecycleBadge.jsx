import React from "react";
import Badge from "@/components/atoms/Badge";

const LifecycleBadge = ({ stage, className = "" }) => {
  const getVariant = (stage) => {
    switch (stage?.toLowerCase()) {
      case "lead":
        return "lead";
      case "prospect":
        return "prospect";
      case "customer":
        return "customer";
      default:
        return "default";
    }
  };

  const getDisplayText = (stage) => {
    if (!stage) return "Unknown";
    return stage.charAt(0).toUpperCase() + stage.slice(1).toLowerCase();
  };

  return (
    <Badge 
      variant={getVariant(stage)} 
      size="sm"
      className={className}
    >
      {getDisplayText(stage)}
    </Badge>
  );
};

export default LifecycleBadge;