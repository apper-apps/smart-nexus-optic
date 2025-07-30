import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

const ContactForm = ({ contact, companies = [], onSave, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyId: "",
    lifecycleStage: "Lead",
    notes: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (contact) {
      setFormData({
        firstName: contact.firstName || "",
        lastName: contact.lastName || "",
        email: contact.email || "",
        phone: contact.phone || "",
        companyId: contact.companyId || "",
        lifecycleStage: contact.lifecycleStage || "Lead",
        notes: contact.notes || ""
      });
    }
  }, [contact]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.lifecycleStage) {
      newErrors.lifecycleStage = "Lifecycle stage is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave(formData);
      toast.success(contact ? "Contact updated successfully!" : "Contact created successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to save contact. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const lifecycleOptions = [
    { value: "Lead", label: "Lead" },
    { value: "Prospect", label: "Prospect" },
    { value: "Customer", label: "Customer" }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 modal-backdrop"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="relative w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                <ApperIcon name={contact ? "Edit" : "Plus"} className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {contact ? "Edit Contact" : "Create New Contact"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            >
              <ApperIcon name="X" className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  placeholder="Enter first name"
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  placeholder="Enter last name"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="Enter email address"
                />
                <Input
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Company & Lifecycle */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Company & Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Company"
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleChange}
                  error={errors.companyId}
                >
                  <option value="">Select a company</option>
                  {companies.map((company) => (
                    <option key={company.Id} value={company.Id}>
                      {company.name}
                    </option>
                  ))}
                </Select>
                <Select
                  label="Lifecycle Stage"
                  name="lifecycleStage"
                  value={formData.lifecycleStage}
                  onChange={handleChange}
                  error={errors.lifecycleStage}
                >
                  {lifecycleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                placeholder="Add any additional notes about this contact..."
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                    {contact ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <ApperIcon name={contact ? "Save" : "Plus"} className="h-4 w-4 mr-2" />
                    {contact ? "Update Contact" : "Create Contact"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ContactForm;