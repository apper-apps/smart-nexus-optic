import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";

const Error = ({ 
  title = "Something went wrong", 
  message = "We encountered an error while loading the data. Please try again.", 
  onRetry,
  showRetry = true 
}) => {
  return (
    <Card className="p-8 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-error-100 to-error-200 rounded-full flex items-center justify-center">
        <ApperIcon name="AlertCircle" className="h-8 w-8 text-error-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
      {showRetry && onRetry && (
        <Button
          variant="primary"
          onClick={onRetry}
          className="inline-flex items-center"
        >
          <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </Card>
  );
};

export default Error;