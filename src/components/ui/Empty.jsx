import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data found", 
  message = "There's nothing here yet. Get started by adding some data.", 
  actionLabel = "Get Started",
  onAction,
  icon = "Inbox"
}) => {
  return (
    <Card className="p-8 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
        <ApperIcon name={icon} className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
      {onAction && (
        <Button
          variant="primary"
          onClick={onAction}
          className="inline-flex items-center"
        >
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};

export default Empty;