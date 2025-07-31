import React, { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { CustomPropertyProvider } from "@/contexts/CustomPropertyContext";
import "@/index.css";
import Sidebar from "@/components/organisms/Sidebar";
import ReportsPage from "@/components/pages/ReportsPage";
import DealsPage from "@/components/pages/DealsPage";
import SettingsPage from "@/components/pages/SettingsPage";
import MarketingPage from "@/components/pages/MarketingPage";
import ContactsPage from "@/components/pages/ContactsPage";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

return (
    <CustomPropertyProvider>
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
    </CustomPropertyProvider>
  );
};

export default App;