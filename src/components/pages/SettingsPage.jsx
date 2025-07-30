import React, { useState } from "react";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import CustomPropertyManager from "@/components/organisms/CustomPropertyManager";

const SettingsPage = ({ onMobileMenuToggle }) => {
  const [activeTab, setActiveTab] = useState("custom-properties");

  const tabs = [
    {
      id: "custom-properties",
      label: "Custom Properties",
      icon: "Settings"
    },
    {
      id: "user-preferences", 
      label: "User Preferences",
      icon: "User"
    },
    {
      id: "integrations",
      label: "Integrations", 
      icon: "Zap"
    },
    {
      id: "data-management",
      label: "Data Management",
      icon: "Database"
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "custom-properties":
        return <CustomPropertyManager />;
      
      case "user-preferences":
        return (
          <Card className="p-8 text-center">
            <ApperIcon name="User" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">User Preferences</h3>
            <p className="text-gray-600 mb-4">
              Manage your profile, notification settings, and personal preferences.
            </p>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Coming Soon:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Profile management</li>
                <li>• Email notifications</li>
                <li>• Display preferences</li>
                <li>• Time zone settings</li>
              </ul>
            </div>
          </Card>
        );

      case "integrations":
        return (
          <Card className="p-8 text-center">
            <ApperIcon name="Zap" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Integrations</h3>
            <p className="text-gray-600 mb-4">
              Connect your CRM with external services and applications.
            </p>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Planned Integrations:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Email marketing platforms</li>
                <li>• Calendar applications</li>
                <li>• Social media tools</li>
                <li>• Analytics services</li>
              </ul>
            </div>
          </Card>
        );

      case "data-management":
        return (
          <Card className="p-8 text-center">
            <ApperIcon name="Database" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Data Management</h3>
            <p className="text-gray-600 mb-4">
              Import, export, and manage your CRM data with powerful tools.
            </p>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Available Tools:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• CSV import/export</li>
                <li>• Data validation</li>
                <li>• Bulk operations</li>
                <li>• Data backup</li>
              </ul>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header 
        title="Settings" 
        onMobileMenuToggle={onMobileMenuToggle}
        showSearch={false}
      />

      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <ApperIcon name={tab.icon} size={16} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="min-h-96">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;