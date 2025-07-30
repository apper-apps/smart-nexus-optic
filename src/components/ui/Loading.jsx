import React from "react";
import Card from "@/components/atoms/Card";

const Loading = ({ type = "table" }) => {
  if (type === "table") {
    return (
      <Card className="overflow-hidden">
        <div className="animate-pulse">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-3">
            <div className="flex space-x-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 rounded shimmer flex-1"></div>
              ))}
            </div>
          </div>
          
          {/* Table Rows */}
          <div className="divide-y divide-gray-200">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="px-6 py-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full shimmer"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded shimmer w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded shimmer w-1/6"></div>
                  </div>
                  <div className="hidden sm:block w-32">
                    <div className="h-4 bg-gray-300 rounded shimmer"></div>
                  </div>
                  <div className="hidden md:block w-40">
                    <div className="h-4 bg-gray-300 rounded shimmer"></div>
                  </div>
                  <div className="hidden lg:block w-24">
                    <div className="h-4 bg-gray-300 rounded shimmer"></div>
                  </div>
                  <div className="w-20">
                    <div className="h-6 bg-gray-300 rounded-full shimmer"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-300 rounded shimmer w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded shimmer"></div>
              <div className="h-4 bg-gray-200 rounded shimmer w-5/6"></div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Loading;