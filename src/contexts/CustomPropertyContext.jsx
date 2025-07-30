import React, { createContext, useContext, useState, useEffect } from "react";
import * as customPropertyService from "@/services/api/customPropertyService";

const CustomPropertyContext = createContext();

export const useCustomProperties = () => {
  const context = useContext(CustomPropertyContext);
  if (!context) {
    throw new Error("useCustomProperties must be used within CustomPropertyProvider");
  }
  return context;
};

export const CustomPropertyProvider = ({ children }) => {
  const [contactProperties, setContactProperties] = useState([]);
  const [companyProperties, setCompanyProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const [contacts, companies] = await Promise.all([
        customPropertyService.getByEntityType("contact"),
        customPropertyService.getByEntityType("company")
      ]);
      setContactProperties(contacts);
      setCompanyProperties(companies);
    } catch (error) {
      console.error("Failed to load custom properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshProperties = () => {
    loadProperties();
  };

  const value = {
    contactProperties,
    companyProperties,
    loading,
    refreshProperties
  };

  return (
    <CustomPropertyContext.Provider value={value}>
      {children}
    </CustomPropertyContext.Provider>
  );
};