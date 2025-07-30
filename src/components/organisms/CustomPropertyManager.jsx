import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import * as customPropertyService from "@/services/api/customPropertyService";

const CustomPropertyManager = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    label: "",
    type: "text",
    entityType: "contact",
    required: false,
    options: []
  });
  const [optionsText, setOptionsText] = useState("");

  const fieldTypes = [
    { value: "text", label: "Text" },
    { value: "number", label: "Number" },
    { value: "date", label: "Date" },
    { value: "dropdown", label: "Dropdown" },
    { value: "multi-select", label: "Multi-Select" }
  ];

  const entityTypes = [
    { value: "contact", label: "Contact" },
    { value: "company", label: "Company" }
  ];

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await customPropertyService.getAll();
      setProperties(data);
    } catch (error) {
      toast.error("Failed to load custom properties");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.label) {
      toast.error("Name and label are required");
      return;
    }

    // Validate name format (alphanumeric and underscores only)
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(formData.name)) {
      toast.error("Name must start with a letter and contain only letters, numbers, and underscores");
      return;
    }

    try {
      const propertyData = {
        ...formData,
        options: (formData.type === "dropdown" || formData.type === "multi-select") 
          ? optionsText.split('\n').filter(opt => opt.trim()).map(opt => opt.trim())
          : []
      };

      if (editingProperty) {
        await customPropertyService.update(editingProperty.Id, propertyData);
        toast.success("Custom property updated successfully!");
      } else {
        await customPropertyService.create(propertyData);
        toast.success("Custom property created successfully!");
      }

      resetForm();
      loadProperties();
    } catch (error) {
      toast.error(error.message || "Failed to save custom property");
    }
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setFormData({
      name: property.name,
      label: property.label,
      type: property.type,
      entityType: property.entityType,
      required: property.required || false,
      options: property.options || []
    });
    setOptionsText((property.options || []).join('\n'));
    setShowForm(true);
  };

  const handleDelete = async (property) => {
    if (!confirm(`Are you sure you want to delete the "${property.label}" property? This action cannot be undone.`)) {
      return;
    }

    try {
      await customPropertyService.delete_(property.Id);
      toast.success("Custom property deleted successfully!");
      loadProperties();
    } catch (error) {
      toast.error("Failed to delete custom property");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      label: "",
      type: "text",
      entityType: "contact",
      required: false,
      options: []
    });
    setOptionsText("");
    setEditingProperty(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading custom properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Custom Properties</h2>
          <p className="text-gray-600 mt-1">Create and manage custom fields for contacts and companies</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={16} />
          Add Property
        </Button>
      </div>

      {/* Property Form */}
      {showForm && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingProperty ? "Edit Property" : "Create New Property"}
            </h3>
            <Button
              variant="ghost"
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Property Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., department"
                required
                disabled={!!editingProperty}
              />
              <Input
                label="Display Label"
                name="label"
                value={formData.label}
                onChange={handleChange}
                placeholder="e.g., Department"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Field Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                {fieldTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
              <Select
                label="Entity Type"
                name="entityType"
                value={formData.entityType}
                onChange={handleChange}
                required
                disabled={!!editingProperty}
              >
                {entityTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="required"
                name="required"
                checked={formData.required}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="required" className="ml-2 block text-sm text-gray-900">
                Required field
              </label>
            </div>

            {(formData.type === "dropdown" || formData.type === "multi-select") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Options (one per line)
                </label>
                <textarea
                  value={optionsText}
                  onChange={(e) => setOptionsText(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                  required
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingProperty ? "Update Property" : "Create Property"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Properties List */}
      <div className="grid gap-4">
        {properties.length === 0 ? (
          <Card className="p-8 text-center">
            <ApperIcon name="Settings" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Custom Properties</h3>
            <p className="text-gray-600 mb-4">
              Create your first custom property to extend your contact and company data.
            </p>
            <Button onClick={() => setShowForm(true)}>
              Create Property
            </Button>
          </Card>
        ) : (
          properties.map(property => (
            <Card key={property.Id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-gray-900">{property.label}</h3>
                    <div className="flex gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {property.entityType}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {fieldTypes.find(t => t.value === property.type)?.label}
                      </span>
                      {property.required && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-100 text-error-800">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Name:</strong> {property.name}
                  </p>
                  {property.options && property.options.length > 0 && (
                    <p className="text-sm text-gray-600">
                      <strong>Options:</strong> {property.options.join(", ")}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(property)}
                    className="text-gray-600 hover:text-primary-600"
                  >
                    <ApperIcon name="Edit2" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(property)}
                    className="text-gray-600 hover:text-error-600"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomPropertyManager;