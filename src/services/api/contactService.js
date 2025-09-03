import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const TABLE_NAME = 'contact_c';

// Field mapping for the contact table
const CONTACT_FIELDS = [
  { field: { Name: "Name" } },
  { field: { Name: "first_name_c" } },
  { field: { Name: "last_name_c" } },
  { field: { Name: "email_c" } },
  { field: { Name: "phone_c" } },
  { field: { Name: "lifecycle_stage_c" } },
  { field: { Name: "created_at_c" } },
  { field: { Name: "updated_at_c" } },
  { field: { Name: "notes_c" } },
  { field: { Name: "company_id_c" } }
];

export const getAll = async () => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: CONTACT_FIELDS,
      orderBy: [{ fieldName: "created_at_c", sorttype: "DESC" }]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error fetching contacts:", response.message);
      toast.error(response.message);
      return [];
    }
    
    // Transform database fields to UI format
    const transformedContacts = response.data?.map(contact => ({
      Id: contact.Id,
      firstName: contact.first_name_c || '',
      lastName: contact.last_name_c || '',
      email: contact.email_c || '',
      phone: contact.phone_c || '',
      companyId: contact.company_id_c?.Id || contact.company_id_c || null,
      lifecycleStage: contact.lifecycle_stage_c || 'Lead',
      createdAt: contact.created_at_c || contact.CreatedOn,
      updatedAt: contact.updated_at_c || contact.ModifiedOn,
      notes: contact.notes_c || ''
    })) || [];
    
    return transformedContacts;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching contacts:", error.response.data.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to fetch contacts");
    }
    return [];
  }
};

export const getById = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = { fields: CONTACT_FIELDS };
    
    const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
    
    if (!response.success) {
      console.error("Error fetching contact:", response.message);
      toast.error(response.message);
      return null;
    }
    
    // Transform database fields to UI format
    const contact = response.data;
    return {
      Id: contact.Id,
      firstName: contact.first_name_c || '',
      lastName: contact.last_name_c || '',
      email: contact.email_c || '',
      phone: contact.phone_c || '',
      companyId: contact.company_id_c?.Id || contact.company_id_c || null,
      lifecycleStage: contact.lifecycle_stage_c || 'Lead',
      createdAt: contact.created_at_c || contact.CreatedOn,
      updatedAt: contact.updated_at_c || contact.ModifiedOn,
      notes: contact.notes_c || ''
    };
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching contact:", error.response.data.message);
    } else {
      console.error("Error fetching contact:", error);
    }
    return null;
  }
};

export const create = async (contactData) => {
  try {
    const apperClient = getApperClient();
    
    // Transform UI format to database fields (only Updateable fields)
    const dbContact = {
      first_name_c: contactData.firstName || '',
      last_name_c: contactData.lastName || '',
      email_c: contactData.email || '',
      phone_c: contactData.phone || '',
      lifecycle_stage_c: contactData.lifecycleStage || 'Lead',
      notes_c: contactData.notes || '',
      created_at_c: new Date().toISOString(),
      updated_at_c: new Date().toISOString()
    };
    
    // Handle lookup field for company
    if (contactData.companyId && contactData.companyId !== '') {
      dbContact.company_id_c = parseInt(contactData.companyId);
    }
    
    const params = { records: [dbContact] };
    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error creating contact:", response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create contact ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulRecords.length > 0) {
        const createdContact = successfulRecords[0].data;
        toast.success('Contact created successfully!');
        
        // Transform back to UI format
        return {
          Id: createdContact.Id,
          firstName: createdContact.first_name_c || '',
          lastName: createdContact.last_name_c || '',
          email: createdContact.email_c || '',
          phone: createdContact.phone_c || '',
          companyId: createdContact.company_id_c?.Id || createdContact.company_id_c || null,
          lifecycleStage: createdContact.lifecycle_stage_c || 'Lead',
          createdAt: createdContact.created_at_c || createdContact.CreatedOn,
          updatedAt: createdContact.updated_at_c || createdContact.ModifiedOn,
          notes: createdContact.notes_c || ''
        };
      }
    }
    
    throw new Error('No successful records created');
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating contact:", error.response.data.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error creating contact:", error);
    }
    throw error;
  }
};

export const update = async (id, contactData) => {
  try {
    const apperClient = getApperClient();
    
    // Transform UI format to database fields (only Updateable fields)
    const dbContact = {
      Id: parseInt(id),
      first_name_c: contactData.firstName || '',
      last_name_c: contactData.lastName || '',
      email_c: contactData.email || '',
      phone_c: contactData.phone || '',
      lifecycle_stage_c: contactData.lifecycleStage || 'Lead',
      notes_c: contactData.notes || '',
      updated_at_c: new Date().toISOString()
    };
    
    // Handle lookup field for company
    if (contactData.companyId && contactData.companyId !== '') {
      dbContact.company_id_c = parseInt(contactData.companyId);
    }
    
    const params = { records: [dbContact] };
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error updating contact:", response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update contact ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        
        failedUpdates.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulUpdates.length > 0) {
        const updatedContact = successfulUpdates[0].data;
        toast.success('Contact updated successfully!');
        
        // Transform back to UI format
        return {
          Id: updatedContact.Id,
          firstName: updatedContact.first_name_c || '',
          lastName: updatedContact.last_name_c || '',
          email: updatedContact.email_c || '',
          phone: updatedContact.phone_c || '',
          companyId: updatedContact.company_id_c?.Id || updatedContact.company_id_c || null,
          lifecycleStage: updatedContact.lifecycle_stage_c || 'Lead',
          createdAt: updatedContact.created_at_c || updatedContact.CreatedOn,
          updatedAt: updatedContact.updated_at_c || updatedContact.ModifiedOn,
          notes: updatedContact.notes_c || ''
        };
      }
    }
    
    throw new Error('No successful records updated');
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating contact:", error.response.data.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error updating contact:", error);
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
      console.error("Error deleting contact:", response.message);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete contact ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        
        failedDeletions.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulDeletions.length > 0) {
        toast.success('Contact deleted successfully!');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting contact:", error.response.data.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error deleting contact:", error);
    }
    return false;
  }
};

export const bulkDelete = async (contactIds) => {
  try {
    const apperClient = getApperClient();
    const params = { RecordIds: contactIds.map(id => parseInt(id)) };
    
    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error bulk deleting contacts:", response.message);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to bulk delete contacts ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        
        failedDeletions.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulDeletions.length > 0) {
        toast.success(`${successfulDeletions.length} contacts deleted successfully!`);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error bulk deleting contacts:", error.response.data.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error bulk deleting contacts:", error);
    }
    return false;
  }
};

export const bulkUpdateLifecycleStage = async (contactIds, lifecycleStage) => {
  try {
    const apperClient = getApperClient();
    
    const validStages = ['Lead', 'Prospect', 'Customer', 'Evangelist'];
    if (!validStages.includes(lifecycleStage)) {
      throw new Error('Invalid lifecycle stage');
    }
    
    // Prepare records for bulk update
    const records = contactIds.map(id => ({
      Id: parseInt(id),
      lifecycle_stage_c: lifecycleStage,
      updated_at_c: new Date().toISOString()
    }));
    
    const params = { records };
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error bulk updating lifecycle stage:", response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to bulk update lifecycle stage ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        
        failedUpdates.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulUpdates.length > 0) {
        toast.success(`${successfulUpdates.length} contacts updated successfully!`);
        
        // Transform back to UI format
        return successfulUpdates.map(result => ({
          Id: result.data.Id,
          firstName: result.data.first_name_c || '',
          lastName: result.data.last_name_c || '',
          email: result.data.email_c || '',
          phone: result.data.phone_c || '',
          companyId: result.data.company_id_c?.Id || result.data.company_id_c || null,
          lifecycleStage: result.data.lifecycle_stage_c || 'Lead',
          createdAt: result.data.created_at_c || result.data.CreatedOn,
          updatedAt: result.data.updated_at_c || result.data.ModifiedOn,
          notes: result.data.notes_c || ''
        }));
      }
    }
    
    return [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error bulk updating lifecycle stage:", error.response.data.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error bulk updating lifecycle stage:", error);
    }
    throw error;
  }
};
// Export delete_ function (delete is a reserved keyword)