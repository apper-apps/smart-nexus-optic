import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";

const DealModal = ({ 
  deal, 
  contact, 
  company, 
  activities = [], 
  onClose, 
  onEdit, 
  onDelete 
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return 'text-success-600';
    if (probability >= 60) return 'text-warning-600';
    if (probability >= 40) return 'text-info-600';
    return 'text-error-600';
  };

  const tabs = [
    { id: 'overview', name: 'Deal Info', icon: 'FileText' },
    { id: 'activity', name: 'Activities', icon: 'Activity' },
    { id: 'notes', name: 'Notes', icon: 'StickyNote' }
  ];

  const dealActivities = activities.filter(activity => activity.dealId === deal.Id);

  if (!deal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{deal.name}</h1>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStageColor(deal.stage)}`}>
                  {deal.stage}
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <ApperIcon name="DollarSign" className="h-4 w-4" />
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(deal.value)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="TrendingUp" className="h-4 w-4" />
                  <span className={`font-semibold ${getProbabilityColor(deal.probability)}`}>
                    {deal.probability}% probability
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Calendar" className="h-4 w-4" />
                  <span>Due {format(new Date(deal.expectedCloseDate), 'MMM dd, yyyy')}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={onEdit}>
                <ApperIcon name="Edit" className="h-4 w-4" />
                Edit
              </Button>
              <Button variant="ghost" onClick={onClose}>
                <ApperIcon name="X" className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ApperIcon name={tab.icon} className="h-4 w-4" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Deal Name</label>
                      <p className="mt-1 text-sm text-gray-900">{deal.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Value</label>
                      <p className="mt-1 text-sm text-gray-900">{formatCurrency(deal.value)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Probability</label>
                      <p className="mt-1 text-sm text-gray-900">{deal.probability}%</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Stage</label>
                      <p className="mt-1 text-sm text-gray-900">{deal.stage}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Expected Close Date</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {format(new Date(deal.expectedCloseDate), 'MMMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    {contact && (
                      <>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Primary Contact</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {contact.firstName} {contact.lastName}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Email</label>
                          <p className="mt-1 text-sm text-gray-900">{contact.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Phone</label>
                          <p className="mt-1 text-sm text-gray-900">{contact.phone}</p>
                        </div>
                      </>
                    )}
                    {company && (
                      <>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Company</label>
                          <p className="mt-1 text-sm text-gray-900">{company.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Industry</label>
                          <p className="mt-1 text-sm text-gray-900">{company.industry}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Employees</label>
                          <p className="mt-1 text-sm text-gray-900">{company.employeeCount}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {deal.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{deal.description}</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Created {format(new Date(deal.createdAt), 'MMM dd, yyyy')} • 
                  Updated {format(new Date(deal.updatedAt), 'MMM dd, yyyy')}
                </div>
                <Button
                  variant="outline"
                  className="text-error-600 border-error-300 hover:bg-error-50"
                  onClick={() => onDelete(deal.Id)}
                >
                  <ApperIcon name="Trash2" className="h-4 w-4" />
                  Delete Deal
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
              {dealActivities.length > 0 ? (
                <div className="space-y-4">
                  {dealActivities.map((activity) => (
                    <div key={activity.Id} className="border-l-4 border-primary-200 pl-4 py-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        <span className="text-sm text-gray-500">
                          {format(new Date(activity.date), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="Activity" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No activities recorded yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
              {deal.notes ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {deal.notes}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="StickyNote" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No notes added yet</p>
                  <Button variant="primary" className="mt-4" onClick={onEdit}>
                    Add Notes
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DealModal;