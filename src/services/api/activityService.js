import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const TABLE_NAME = 'activity_c';

// Field mapping for the activity table
const ACTIVITY_FIELDS = [
  { field: { Name: "Name" } },
  { field: { Name: "type_c" } },
  { field: { Name: "description_c" } },
  { field: { Name: "timestamp_c" } },
  { field: { Name: "attendees_c" } },
  { field: { Name: "follow_up_actions_c" } },
  { field: { Name: "follow_up_date_c" } },
  { field: { Name: "priority_c" } },
  { field: { Name: "location_c" } },
  { field: { Name: "notes_c" } },
  { field: { Name: "outcome_c" } },
  { field: { Name: "duration_c" } },
  { field: { Name: "contact_id_c" } },
  { field: { Name: "deal_id_c" } }
];

export const getAll = async () => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: ACTIVITY_FIELDS,
      orderBy: [{ fieldName: "timestamp_c", sorttype: "DESC" }]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error fetching activities:", response.message);
      toast.error(response.message);
      return [];
    }
    
    // Transform database fields to UI format
    const transformedActivities = response.data?.map(activity => ({
      Id: activity.Id,
      type: activity.type_c || '',
      description: activity.description_c || '',
      timestamp: activity.timestamp_c || activity.CreatedOn,
      attendees: activity.attendees_c || '',
      followUpActions: activity.follow_up_actions_c || '',
      followUpDate: activity.follow_up_date_c || null,
      priority: activity.priority_c || 'medium',
      location: activity.location_c || '',
      notes: activity.notes_c || '',
      outcome: activity.outcome_c || '',
      duration: activity.duration_c || null,
      contactId: activity.contact_id_c?.Id || activity.contact_id_c || null,
      dealId: activity.deal_id_c?.Id || activity.deal_id_c || null
    })) || [];
    
    return transformedActivities;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching activities:", error.response.data.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error fetching activities:", error);
      toast.error("Failed to fetch activities");
    }
    return [];
  }
};

export const getById = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = { fields: ACTIVITY_FIELDS };
    
    const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
    
    if (!response.success) {
      console.error("Error fetching activity:", response.message);
      toast.error(response.message);
      return null;
    }
    
    // Transform database fields to UI format
    const activity = response.data;
    return {
      Id: activity.Id,
      type: activity.type_c || '',
      description: activity.description_c || '',
      timestamp: activity.timestamp_c || activity.CreatedOn,
      attendees: activity.attendees_c || '',
      followUpActions: activity.follow_up_actions_c || '',
      followUpDate: activity.follow_up_date_c || null,
      priority: activity.priority_c || 'medium',
      location: activity.location_c || '',
      notes: activity.notes_c || '',
      outcome: activity.outcome_c || '',
      duration: activity.duration_c || null,
      contactId: activity.contact_id_c?.Id || activity.contact_id_c || null,
      dealId: activity.deal_id_c?.Id || activity.deal_id_c || null
    };
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching activity:", error.response.data.message);
    } else {
      console.error("Error fetching activity:", error);
    }
    return null;
  }
};

export const getByContactId = async (contactId) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: ACTIVITY_FIELDS,
      where: [
        {
          FieldName: "contact_id_c",
          Operator: "EqualTo",
          Values: [parseInt(contactId)]
        }
      ],
      orderBy: [{ fieldName: "timestamp_c", sorttype: "DESC" }]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error fetching activities by contact:", response.message);
      return [];
    }
    
    // Transform database fields to UI format
    const transformedActivities = response.data?.map(activity => ({
      Id: activity.Id,
      type: activity.type_c || '',
      description: activity.description_c || '',
      timestamp: activity.timestamp_c || activity.CreatedOn,
      attendees: activity.attendees_c || '',
      followUpActions: activity.follow_up_actions_c || '',
      followUpDate: activity.follow_up_date_c || null,
      priority: activity.priority_c || 'medium',
      location: activity.location_c || '',
      notes: activity.notes_c || '',
      outcome: activity.outcome_c || '',
      duration: activity.duration_c || null,
      contactId: activity.contact_id_c?.Id || activity.contact_id_c || null,
      dealId: activity.deal_id_c?.Id || activity.deal_id_c || null
    })) || [];
    
    return transformedActivities;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching activities by contact:", error.response.data.message);
    } else {
      console.error("Error fetching activities by contact:", error);
    }
    return [];
  }
};

export const getByDealId = async (dealId) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: ACTIVITY_FIELDS,
      where: [
        {
          FieldName: "deal_id_c",
          Operator: "EqualTo",
          Values: [parseInt(dealId)]
        }
      ],
      orderBy: [{ fieldName: "timestamp_c", sorttype: "DESC" }]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error fetching activities by deal:", response.message);
      return [];
    }
    
    // Transform database fields to UI format
    const transformedActivities = response.data?.map(activity => ({
      Id: activity.Id,
      type: activity.type_c || '',
      description: activity.description_c || '',
      timestamp: activity.timestamp_c || activity.CreatedOn,
      attendees: activity.attendees_c || '',
      followUpActions: activity.follow_up_actions_c || '',
      followUpDate: activity.follow_up_date_c || null,
      priority: activity.priority_c || 'medium',
      location: activity.location_c || '',
      notes: activity.notes_c || '',
      outcome: activity.outcome_c || '',
      duration: activity.duration_c || null,
      contactId: activity.contact_id_c?.Id || activity.contact_id_c || null,
      dealId: activity.deal_id_c?.Id || activity.deal_id_c || null
    })) || [];
    
    return transformedActivities;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching activities by deal:", error.response.data.message);
    } else {
      console.error("Error fetching activities by deal:", error);
    }
    return [];
  }
};

export const create = async (activityData) => {
  try {
    const apperClient = getApperClient();
    
    // Transform UI format to database fields (only Updateable fields)
    const dbActivity = {
      Name: activityData.subject || activityData.description || 'Activity',
      type_c: activityData.type || '',
      description_c: activityData.description || '',
      timestamp_c: activityData.scheduledDate || new Date().toISOString(),
      attendees_c: activityData.attendees || '',
      follow_up_actions_c: activityData.followUpActions || '',
      follow_up_date_c: activityData.followUpDate || null,
      priority_c: activityData.priority || 'medium',
      location_c: activityData.location || '',
      notes_c: activityData.notes || '',
      outcome_c: activityData.outcome || '',
      duration_c: activityData.duration ? parseInt(activityData.duration) : null
    };
    
    // Handle lookup fields
    if (activityData.contactId && activityData.contactId !== '') {
      dbActivity.contact_id_c = parseInt(activityData.contactId);
    }
    if (activityData.dealId && activityData.dealId !== '') {
      dbActivity.deal_id_c = parseInt(activityData.dealId);
    }
    
    const params = { records: [dbActivity] };
    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error creating activity:", response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create activity ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulRecords.length > 0) {
        const createdActivity = successfulRecords[0].data;
        toast.success('Activity created successfully!');
        
        // Transform back to UI format
        return {
          Id: createdActivity.Id,
          type: createdActivity.type_c || '',
          description: createdActivity.description_c || '',
          timestamp: createdActivity.timestamp_c || createdActivity.CreatedOn,
          attendees: createdActivity.attendees_c || '',
          followUpActions: createdActivity.follow_up_actions_c || '',
          followUpDate: createdActivity.follow_up_date_c || null,
          priority: createdActivity.priority_c || 'medium',
          location: createdActivity.location_c || '',
          notes: createdActivity.notes_c || '',
          outcome: createdActivity.outcome_c || '',
          duration: createdActivity.duration_c || null,
          contactId: createdActivity.contact_id_c?.Id || createdActivity.contact_id_c || null,
          dealId: createdActivity.deal_id_c?.Id || createdActivity.deal_id_c || null
        };
      }
    }
    
    throw new Error('No successful records created');
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating activity:", error.response.data.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error creating activity:", error);
    }
    throw error;
  }
};

export const update = async (id, activityData) => {
  try {
    const apperClient = getApperClient();
    
    // Transform UI format to database fields (only Updateable fields)
    const dbActivity = {
      Id: parseInt(id),
      Name: activityData.subject || activityData.description || 'Activity',
      type_c: activityData.type || '',
      description_c: activityData.description || '',
      timestamp_c: activityData.scheduledDate || new Date().toISOString(),
      attendees_c: activityData.attendees || '',
      follow_up_actions_c: activityData.followUpActions || '',
      follow_up_date_c: activityData.followUpDate || null,
      priority_c: activityData.priority || 'medium',
      location_c: activityData.location || '',
      notes_c: activityData.notes || '',
      outcome_c: activityData.outcome || '',
      duration_c: activityData.duration ? parseInt(activityData.duration) : null
    };
    
    // Handle lookup fields
    if (activityData.contactId && activityData.contactId !== '') {
      dbActivity.contact_id_c = parseInt(activityData.contactId);
    }
    if (activityData.dealId && activityData.dealId !== '') {
      dbActivity.deal_id_c = parseInt(activityData.dealId);
    }
    
    const params = { records: [dbActivity] };
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error updating activity:", response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update activity ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        
        failedUpdates.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulUpdates.length > 0) {
        const updatedActivity = successfulUpdates[0].data;
        toast.success('Activity updated successfully!');
        
        // Transform back to UI format
        return {
          Id: updatedActivity.Id,
          type: updatedActivity.type_c || '',
          description: updatedActivity.description_c || '',
          timestamp: updatedActivity.timestamp_c || updatedActivity.CreatedOn,
          attendees: updatedActivity.attendees_c || '',
          followUpActions: updatedActivity.follow_up_actions_c || '',
          followUpDate: updatedActivity.follow_up_date_c || null,
          priority: updatedActivity.priority_c || 'medium',
          location: updatedActivity.location_c || '',
          notes: updatedActivity.notes_c || '',
          outcome: updatedActivity.outcome_c || '',
          duration: updatedActivity.duration_c || null,
          contactId: updatedActivity.contact_id_c?.Id || updatedActivity.contact_id_c || null,
          dealId: updatedActivity.deal_id_c?.Id || updatedActivity.deal_id_c || null
        };
      }
    }
    
    throw new Error('No successful records updated');
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating activity:", error.response.data.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error updating activity:", error);
    }
    throw error;
  }
};

export const delete_ = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = { RecordIds: [parseInt(id)] };
    
    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error deleting activity:", response.message);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete activity ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        
        failedDeletions.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulDeletions.length > 0) {
        toast.success('Activity deleted successfully!');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting activity:", error.response.data.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error deleting activity:", error);
    }
    return false;
  }
};