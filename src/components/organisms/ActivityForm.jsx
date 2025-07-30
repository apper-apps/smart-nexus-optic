import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

const ACTIVITY_TYPES = [
  { value: "call", label: "Call" },
  { value: "email", label: "Email" },
  { value: "meeting", label: "Meeting" },
  { value: "note", label: "Note" }
];

const OUTCOMES = [
  { value: "successful", label: "Successful" },
  { value: "follow_up_required", label: "Follow-up Required" },
  { value: "not_interested", label: "Not Interested" },
  { value: "no_answer", label: "No Answer" },
  { value: "rescheduled", label: "Rescheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" }
];

const FOLLOW_UP_ACTIONS = [
  { value: "call", label: "Schedule Call" },
  { value: "email", label: "Send Email" },
  { value: "meeting", label: "Schedule Meeting" },
  { value: "proposal", label: "Send Proposal" },
  { value: "quote", label: "Provide Quote" },
  { value: "demo", label: "Schedule Demo" },
  { value: "other", label: "Other" }
];

export default function ActivityForm({
  activity,
  contacts = [],
  deals = [],
  onSave,
  onCancel,
  loading = false,
  preselectedContactId = null,
  preselectedDealId = null
}) {
  const [formData, setFormData] = useState({
    type: "call",
    subject: "",
    description: "",
    scheduledDate: "",
    scheduledTime: "",
    duration: 30,
    outcome: "",
    contactId: preselectedContactId || "",
    dealId: preselectedDealId || "",
    attendees: "",
    followUpActions: "",
    followUpDate: "",
    priority: "medium",
    location: "",
    notes: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (activity) {
      const activityDate = activity.scheduledDate ? new Date(activity.scheduledDate) : new Date();
      setFormData({
        type: activity.type || "call",
        subject: activity.subject || "",
        description: activity.description || "",
        scheduledDate: activityDate.toISOString().split('T')[0],
        scheduledTime: activityDate.toTimeString().slice(0, 5),
        duration: activity.duration || 30,
        outcome: activity.outcome || "",
        contactId: activity.contactId || preselectedContactId || "",
        dealId: activity.dealId || preselectedDealId || "",
        attendees: activity.attendees || "",
        followUpActions: activity.followUpActions || "",
        followUpDate: activity.followUpDate ? new Date(activity.followUpDate).toISOString().split('T')[0] : "",
        priority: activity.priority || "medium",
        location: activity.location || "",
        notes: activity.notes || ""
      });
    } else if (preselectedContactId || preselectedDealId) {
      setFormData(prev => ({
        ...prev,
        contactId: preselectedContactId || "",
        dealId: preselectedDealId || ""
      }));
    }
  }, [activity, preselectedContactId, preselectedDealId]);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") {
        onCancel();
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  function validateForm() {
    const newErrors = {};

    if (!formData.type) {
      newErrors.type = "Activity type is required";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.scheduledDate) {
      newErrors.scheduledDate = "Date is required";
    }

    if (!formData.scheduledTime && ["call", "meeting"].includes(formData.type)) {
      newErrors.scheduledTime = "Time is required for calls and meetings";
    }

    if (formData.duration && (isNaN(formData.duration) || formData.duration < 1)) {
      newErrors.duration = "Duration must be a positive number";
    }

    if (formData.followUpDate && formData.followUpDate < formData.scheduledDate) {
      newErrors.followUpDate = "Follow-up date cannot be before activity date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submitData = {
        ...formData,
        scheduledDate: formData.scheduledDate && formData.scheduledTime 
          ? new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toISOString()
          : formData.scheduledDate ? new Date(formData.scheduledDate).toISOString() : null,
        followUpDate: formData.followUpDate ? new Date(formData.followUpDate).toISOString() : null,
        contactId: formData.contactId ? parseInt(formData.contactId) : null,
        dealId: formData.dealId ? parseInt(formData.dealId) : null,
        duration: formData.duration ? parseInt(formData.duration) : null
      };

      await onSave(submitData);
      toast.success(`Activity ${activity ? 'updated' : 'created'} successfully`);
    } catch (error) {
      console.error("Error saving activity:", error);
      toast.error(`Failed to ${activity ? 'update' : 'create'} activity`);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  }

  const requiresTimeAndDuration = ["call", "meeting"].includes(formData.type);
  const requiresAttendees = ["call", "meeting"].includes(formData.type);

  const contactOptions = [
    { value: "", label: "Select a contact..." },
    ...contacts.map(contact => ({
      value: contact.Id.toString(),
      label: `${contact.firstName} ${contact.lastName}`
    }))
  ];

  const dealOptions = [
    { value: "", label: "Select a deal..." },
    ...deals.map(deal => ({
      value: deal.Id.toString(),
      label: deal.title
    }))
  ];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {activity ? "Edit Activity" : "Create Activity"}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isSubmitting}
            >
              <ApperIcon name="X" size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Activity Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activity Type *
            </label>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              error={errors.type}
              disabled={isSubmitting}
            >
              {ACTIVITY_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <Input
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter activity subject"
              error={errors.subject}
              disabled={isSubmitting}
            />
          </div>

          {/* Contact and Deal Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact
              </label>
              <Select
                name="contactId"
                value={formData.contactId}
                onChange={handleChange}
                error={errors.contactId}
                disabled={isSubmitting}
              >
                {contactOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deal
              </label>
              <Select
                name="dealId"
                value={formData.dealId}
                onChange={handleChange}
                error={errors.dealId}
                disabled={isSubmitting}
              >
                {dealOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Date, Time, and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <Input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                error={errors.scheduledDate}
                disabled={isSubmitting}
              />
            </div>
            {requiresTimeAndDuration && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <Input
                    type="time"
                    name="scheduledTime"
                    value={formData.scheduledTime}
                    onChange={handleChange}
                    error={errors.scheduledTime}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <Input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="30"
                    min="1"
                    error={errors.duration}
                    disabled={isSubmitting}
                  />
                </div>
              </>
            )}
          </div>

          {/* Location for meetings */}
          {formData.type === "meeting" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Meeting location or video link"
                disabled={isSubmitting}
              />
            </div>
          )}

          {/* Attendees for calls and meetings */}
          {requiresAttendees && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attendees
              </label>
              <Input
                name="attendees"
                value={formData.attendees}
                onChange={handleChange}
                placeholder="List attendees (comma separated)"
                disabled={isSubmitting}
              />
            </div>
          )}

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>

          {/* Outcome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Outcome
            </label>
            <Select
              name="outcome"
              value={formData.outcome}
              onChange={handleChange}
              error={errors.outcome}
              disabled={isSubmitting}
            >
              <option value="">Select outcome...</option>
              {OUTCOMES.map(outcome => (
                <option key={outcome.value} value={outcome.value}>
                  {outcome.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Follow-up Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Follow-up Action
              </label>
              <Select
                name="followUpActions"
                value={formData.followUpActions}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="">No follow-up required</option>
                {FOLLOW_UP_ACTIONS.map(action => (
                  <option key={action.value} value={action.value}>
                    {action.label}
                  </option>
                ))}
              </Select>
            </div>
            {formData.followUpActions && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Follow-up Date
                </label>
                <Input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleChange}
                  error={errors.followUpDate}
                  disabled={isSubmitting}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              placeholder="Brief description of the activity"
              disabled={isSubmitting}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              placeholder="Detailed notes about the activity"
              disabled={isSubmitting}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || loading}
              className="min-w-[100px]"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                activity ? 'Update Activity' : 'Create Activity'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}