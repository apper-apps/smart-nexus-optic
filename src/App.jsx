import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import ContactsPage from "@/components/pages/ContactsPage";
import DealsPage from "@/components/pages/DealsPage";
import MarketingPage from "@/components/pages/MarketingPage";
import ReportsPage from "@/components/pages/ReportsPage";
import SettingsPage from "@/components/pages/SettingsPage";
import WorkflowsPage from "@/components/pages/WorkflowsPage";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <div className="flex h-screen">
          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* Main Content */}
          <Routes>
            <Route path="/" element={<Navigate to="/contacts" replace />} />
            <Route 
              path="/contacts" 
              element={<ContactsPage onMobileMenuToggle={handleMobileMenuToggle} />} 
            />
            <Route 
              path="/deals" 
              element={<DealsPage onMobileMenuToggle={handleMobileMenuToggle} />} 
            />
            <Route 
              path="/marketing" 
              element={<MarketingPage onMobileMenuToggle={handleMobileMenuToggle} />} 
            />
            <Route 
              path="/reports" 
              element={<ReportsPage onMobileMenuToggle={handleMobileMenuToggle} />} 
            />
<Route 
              path="/settings" 
              element={<SettingsPage onMobileMenuToggle={handleMobileMenuToggle} />} 
            />
            <Route 
              path="/workflows" 
              element={<WorkflowsPage onMobileMenuToggle={handleMobileMenuToggle} />} 
            />
          </Routes>
        </div>

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;