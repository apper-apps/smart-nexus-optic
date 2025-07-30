import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { DEAL_STAGES } from "@/services/api/dealService";

const DealForm = ({ 
  deal, 
  contacts = [], 
  companies = [], 
  onSave, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    contactId: '',
    companyId: '',
    value: '',
    probability: '',
    stage: 'Prospect',
    expectedCloseDate: '',
    description: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (deal) {
      setFormData({
        name: deal.name || '',
        contactId: deal.contactId || '',
        companyId: deal.companyId || '',
        value: deal.value || '',
        probability: deal.probability || '',
        stage: deal.stage || 'Prospect',
        expectedCloseDate: deal.expectedCloseDate ? deal.expectedCloseDate.split('T')[0] : '',
        description: deal.description || '',
        notes: deal.notes || ''
      });
    }
  }, [deal]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Deal name is required';
    }

    if (!formData.value || isNaN(parseFloat(formData.value)) || parseFloat(formData.value) <= 0) {
      newErrors.value = 'Valid deal value is required';
    }

    if (!formData.probability || isNaN(parseInt(formData.probability)) || 
        parseInt(formData.probability) < 0 || parseInt(formData.probability) > 100) {
      newErrors.probability = 'Probability must be between 0 and 100';
    }

    if (!formData.expectedCloseDate) {
      newErrors.expectedCloseDate = 'Expected close date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving deal:', error);
      toast.error('Failed to save deal');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const stageOptions = Object.values(DEAL_STAGES).map(stage => ({
    value: stage,
    label: stage
  }));

  const contactOptions = [
    { value: '', label: 'Select a contact...' },
    ...contacts.map(contact => ({
      value: contact.Id,
      label: `${contact.firstName} ${contact.lastName}`
    }))
  ];

  const companyOptions = [
    { value: '', label: 'Select a company...' },
    ...companies.map(company => ({
      value: company.Id,
      label: company.name
    }))
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {deal ? 'Edit Deal' : 'Create New Deal'}
            </h2>
            <Button
              variant="ghost"
              onClick={onCancel}
              className="p-2"
            >
              <ApperIcon name="X" className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deal Name *
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter deal name"
                  className={errors.name ? 'border-error-500' : ''}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-error-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact
                </label>
                <Select
                  name="contactId"
                  value={formData.contactId}
                  onChange={handleChange}
                  options={contactOptions}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <Select
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleChange}
                  options={companyOptions}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deal Value * ($)
                </label>
                <Input
                  name="value"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.value}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={errors.value ? 'border-error-500' : ''}
                />
                {errors.value && (
                  <p className="mt-1 text-sm text-error-600">{errors.value}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Probability * (%)
                </label>
                <Input
                  name="probability"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={handleChange}
                  placeholder="0"
                  className={errors.probability ? 'border-error-500' : ''}
                />
                {errors.probability && (
                  <p className="mt-1 text-sm text-error-600">{errors.probability}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stage
                </label>
                <Select
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  options={stageOptions}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Close Date *
                </label>
                <Input
                  name="expectedCloseDate"
                  type="date"
                  value={formData.expectedCloseDate}
                  onChange={handleChange}
                  className={errors.expectedCloseDate ? 'border-error-500' : ''}
                />
                {errors.expectedCloseDate && (
                  <p className="mt-1 text-sm text-error-600">{errors.expectedCloseDate}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Enter deal description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Enter additional notes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : (deal ? 'Update Deal' : 'Create Deal')}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default DealForm;