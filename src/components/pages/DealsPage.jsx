import React from "react";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const DealsPage = ({ onMobileMenuToggle }) => {
  return (
    <div className="flex-1 flex flex-col">
      <Header 
        title="Deals" 
        onMobileMenuToggle={onMobileMenuToggle}
        showSearch={false}
      />

      <div className="flex-1 p-6">
        <Card className="p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
            <ApperIcon name="TrendingUp" className="h-10 w-10 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon - Pipeline Management</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            Track your sales pipeline, manage deals, and monitor revenue opportunities. 
            This feature is currently in development and will be available soon.
          </p>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Planned Features:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Visual pipeline management</li>
                <li>• Deal tracking and forecasting</li>
                <li>• Revenue analytics</li>
                <li>• Sales stage automation</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DealsPage;