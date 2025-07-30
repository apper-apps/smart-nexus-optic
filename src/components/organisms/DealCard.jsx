import React from "react";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const DealCard = ({ 
  deal, 
  contact, 
  company, 
  onClick, 
  isDragging = false,
  dragHandleProps,
  ...props 
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return 'text-success-600 bg-success-50';
    if (probability >= 60) return 'text-warning-600 bg-warning-50';
    if (probability >= 40) return 'text-info-600 bg-info-50';
    return 'text-error-600 bg-error-50';
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Prospect': return 'text-gray-600 bg-gray-100';
      case 'Qualified': return 'text-info-600 bg-info-100';
      case 'Proposal': return 'text-warning-600 bg-warning-100';
      case 'Negotiation': return 'text-accent-600 bg-accent-100';
      case 'Closed Won': return 'text-success-600 bg-success-100';
      case 'Closed Lost': return 'text-error-600 bg-error-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Card 
      className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-medium ${
        isDragging ? 'opacity-75 rotate-2 shadow-strong' : ''
      }`}
      onClick={onClick}
      {...props}
    >
      <div {...dragHandleProps} className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
            {deal.name}
          </h3>
          <ApperIcon 
            name="GripVertical" 
            className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" 
          />
        </div>

        <div className="space-y-2">
          {contact && (
            <div className="flex items-center text-xs text-gray-600">
              <ApperIcon name="User" className="h-3 w-3 mr-1.5" />
              <span className="truncate">{contact.firstName} {contact.lastName}</span>
            </div>
          )}
          
          {company && (
            <div className="flex items-center text-xs text-gray-600">
              <ApperIcon name="Building" className="h-3 w-3 mr-1.5" />
              <span className="truncate">{company.name}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900">
            {formatCurrency(deal.value)}
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getProbabilityColor(deal.probability)}`}>
            {deal.probability}%
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center text-gray-500">
            <ApperIcon name="Calendar" className="h-3 w-3 mr-1" />
            {format(new Date(deal.expectedCloseDate), 'MMM dd')}
          </div>
          <div className={`px-2 py-1 rounded-full font-medium ${getStageColor(deal.stage)}`}>
            {deal.stage}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DealCard;