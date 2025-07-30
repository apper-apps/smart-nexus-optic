import React from "react";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const MarketingPage = ({ onMobileMenuToggle }) => {
  return (
    <div className="flex-1 flex flex-col">
      <Header 
        title="Marketing" 
        onMobileMenuToggle={onMobileMenuToggle}
        showSearch={false}
      />

      <div className="flex-1 p-6">
        <Card className="p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-accent-100 to-accent-200 rounded-full flex items-center justify-center">
            <ApperIcon name="Mail" className="h-10 w-10 text-accent-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon - Email Campaigns</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            Create and manage email marketing campaigns, track engagement, and nurture your leads. 
            This feature is currently in development and will be available soon.
          </p>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Planned Features:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Email campaign builder</li>
                <li>• Automated drip campaigns</li>
                <li>• Engagement tracking</li>
                <li>• A/B testing capabilities</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MarketingPage;