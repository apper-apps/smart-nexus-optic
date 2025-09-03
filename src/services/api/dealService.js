import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const TABLE_NAME = 'deal_c';

// Field mapping for the deal table
const DEAL_FIELDS = [
  { field: { Name: "Name" } },
  { field: { Name: "value_c" } },
  { field: { Name: "probability_c" } },
  { field: { Name: "stage_c" } },
  { field: { Name: "expected_close_date_c" } },
  { field: { Name: "created_at_c" } },
  { field: { Name: "updated_at_c" } },
  { field: { Name: "description_c" } },
  { field: { Name: "notes_c" } },
  { field: { Name: "contact_id_c" } },
  { field: { Name: "company_id_c" } }
];

export const DEAL_STAGES = {
  PROSPECT: 'Prospect',
  QUALIFIED: 'Qualified', 
  PROPOSAL: 'Proposal',
  NEGOTIATION: 'Negotiation',
  CLOSED_WON: 'Closed Won',
  CLOSED_LOST: 'Closed Lost'
};

export const STAGE_ORDER = [
  DEAL_STAGES.PROSPECT,
  DEAL_STAGES.QUALIFIED,
  DEAL_STAGES.PROPOSAL,
  DEAL_STAGES.NEGOTIATION,
  DEAL_STAGES.CLOSED_WON,
  DEAL_STAGES.CLOSED_LOST
];

export const getAll = async () => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: DEAL_FIELDS,
      orderBy: [{ fieldName: "created_at_c", sorttype: "DESC" }]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error fetching deals:", response.message);
      toast.error(response.message);
      return [];
    }
    
    // Transform database fields to UI format
    const transformedDeals = response.data?.map(deal => ({
      Id: deal.Id,
      name: deal.Name || '',
      contactId: deal.contact_id_c?.Id || deal.contact_id_c || null,
      companyId: deal.company_id_c?.Id || deal.company_id_c || null,
      value: deal.value_c || 0,
      probability: deal.probability_c || 0,
      stage: deal.stage_c || DEAL_STAGES.PROSPECT,
      expectedCloseDate: deal.expected_close_date_c || '',
      createdAt: deal.created_at_c || deal.CreatedOn,
      updatedAt: deal.updated_at_c || deal.ModifiedOn,
      description: deal.description_c || '',
      notes: deal.notes_c || ''
    })) || [];
    
    return transformedDeals;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching deals:", error.response.data.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error fetching deals:", error);
      toast.error("Failed to fetch deals");
    }
    return [];
  }
};

export const getById = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = { fields: DEAL_FIELDS };
    
    const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
    
    if (!response.success) {
      console.error("Error fetching deal:", response.message);
      toast.error(response.message);
      return null;
    }
    
    // Transform database fields to UI format
    const deal = response.data;
    return {
      Id: deal.Id,
      name: deal.Name || '',
      contactId: deal.contact_id_c?.Id || deal.contact_id_c || null,
      companyId: deal.company_id_c?.Id || deal.company_id_c || null,
      value: deal.value_c || 0,
      probability: deal.probability_c || 0,
      stage: deal.stage_c || DEAL_STAGES.PROSPECT,
      expectedCloseDate: deal.expected_close_date_c || '',
      createdAt: deal.created_at_c || deal.CreatedOn,
      updatedAt: deal.updated_at_c || deal.ModifiedOn,
      description: deal.description_c || '',
      notes: deal.notes_c || ''
    };
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching deal:", error.response.data.message);
    } else {
      console.error("Error fetching deal:", error);
    }
    return null;
  }
};

export const create = async (dealData) => {
  try {
    const apperClient = getApperClient();
    
    // Transform UI format to database fields (only Updateable fields)
    const dbDeal = {
      Name: dealData.name || '',
      value_c: parseFloat(dealData.value) || 0,
      probability_c: parseInt(dealData.probability) || 0,
      stage_c: dealData.stage || DEAL_STAGES.PROSPECT,
      expected_close_date_c: dealData.expectedCloseDate || '',
      description_c: dealData.description || '',
      notes_c: dealData.notes || '',
      created_at_c: new Date().toISOString(),
      updated_at_c: new Date().toISOString()
    };
    
    // Handle lookup fields
    if (dealData.contactId && dealData.contactId !== '') {
      dbDeal.contact_id_c = parseInt(dealData.contactId);
    }
    if (dealData.companyId && dealData.companyId !== '') {
      dbDeal.company_id_c = parseInt(dealData.companyId);
    }
    
    const params = { records: [dbDeal] };
    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error creating deal:", response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create deal ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulRecords.length > 0) {
        const createdDeal = successfulRecords[0].data;
        toast.success('Deal created successfully!');
        
        // Transform back to UI format
        return {
          Id: createdDeal.Id,
          name: createdDeal.Name || '',
          contactId: createdDeal.contact_id_c?.Id || createdDeal.contact_id_c || null,
          companyId: createdDeal.company_id_c?.Id || createdDeal.company_id_c || null,
          value: createdDeal.value_c || 0,
          probability: createdDeal.probability_c || 0,
          stage: createdDeal.stage_c || DEAL_STAGES.PROSPECT,
          expectedCloseDate: createdDeal.expected_close_date_c || '',
          createdAt: createdDeal.created_at_c || createdDeal.CreatedOn,
          updatedAt: createdDeal.updated_at_c || createdDeal.ModifiedOn,
          description: createdDeal.description_c || '',
          notes: createdDeal.notes_c || ''
        };
      }
    }
    
    throw new Error('No successful records created');
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating deal:", error.response.data.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error creating deal:", error);
    }
    throw error;
  }
};

export const update = async (id, dealData) => {
  try {
    const apperClient = getApperClient();
    
    // Transform UI format to database fields (only Updateable fields)
    const dbDeal = {
      Id: parseInt(id),
      Name: dealData.name || '',
      value_c: parseFloat(dealData.value) || 0,
      probability_c: parseInt(dealData.probability) || 0,
      stage_c: dealData.stage || DEAL_STAGES.PROSPECT,
      expected_close_date_c: dealData.expectedCloseDate || '',
      description_c: dealData.description || '',
      notes_c: dealData.notes || '',
      updated_at_c: new Date().toISOString()
    };
    
    // Handle lookup fields
    if (dealData.contactId && dealData.contactId !== '') {
      dbDeal.contact_id_c = parseInt(dealData.contactId);
    }
    if (dealData.companyId && dealData.companyId !== '') {
      dbDeal.company_id_c = parseInt(dealData.companyId);
    }
    
    const params = { records: [dbDeal] };
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error updating deal:", response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update deal ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        
        failedUpdates.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulUpdates.length > 0) {
        const updatedDeal = successfulUpdates[0].data;
        toast.success('Deal updated successfully!');
        
        // Transform back to UI format
        return {
          Id: updatedDeal.Id,
          name: updatedDeal.Name || '',
          contactId: updatedDeal.contact_id_c?.Id || updatedDeal.contact_id_c || null,
          companyId: updatedDeal.company_id_c?.Id || updatedDeal.company_id_c || null,
          value: updatedDeal.value_c || 0,
          probability: updatedDeal.probability_c || 0,
          stage: updatedDeal.stage_c || DEAL_STAGES.PROSPECT,
          expectedCloseDate: updatedDeal.expected_close_date_c || '',
          createdAt: updatedDeal.created_at_c || updatedDeal.CreatedOn,
          updatedAt: updatedDeal.updated_at_c || updatedDeal.ModifiedOn,
          description: updatedDeal.description_c || '',
          notes: updatedDeal.notes_c || ''
        };
      }
    }
    
    throw new Error('No successful records updated');
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating deal:", error.response.data.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error updating deal:", error);
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
      console.error("Error deleting deal:", response.message);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete deal ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        
        failedDeletions.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulDeletions.length > 0) {
        toast.success('Deal deleted successfully!');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting deal:", error.response.data.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error deleting deal:", error);
    }
    return false;
  }
};

export const updateStage = async (id, newStage) => {
  try {
    const apperClient = getApperClient();
    
    const dbDeal = {
      Id: parseInt(id),
      stage_c: newStage,
      updated_at_c: new Date().toISOString()
    };
    
    const params = { records: [dbDeal] };
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error updating deal stage:", response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update deal stage ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        
        failedUpdates.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulUpdates.length > 0) {
        const updatedDeal = successfulUpdates[0].data;
        
        // Transform back to UI format
        return {
          Id: updatedDeal.Id,
          name: updatedDeal.Name || '',
          contactId: updatedDeal.contact_id_c?.Id || updatedDeal.contact_id_c || null,
          companyId: updatedDeal.company_id_c?.Id || updatedDeal.company_id_c || null,
          value: updatedDeal.value_c || 0,
          probability: updatedDeal.probability_c || 0,
          stage: updatedDeal.stage_c || DEAL_STAGES.PROSPECT,
          expectedCloseDate: updatedDeal.expected_close_date_c || '',
          createdAt: updatedDeal.created_at_c || updatedDeal.CreatedOn,
          updatedAt: updatedDeal.updated_at_c || updatedDeal.ModifiedOn,
          description: updatedDeal.description_c || '',
          notes: updatedDeal.notes_c || ''
        };
      }
    }
    
    throw new Error('No successful records updated');
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating deal stage:", error.response.data.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error updating deal stage:", error);
    }
    throw error;
  }
};

export const getByStage = async (stage) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: DEAL_FIELDS,
      where: [
        {
          FieldName: "stage_c",
          Operator: "EqualTo",
          Values: [stage]
        }
      ]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error fetching deals by stage:", response.message);
      return [];
    }
    
    // Transform database fields to UI format
    const transformedDeals = response.data?.map(deal => ({
      Id: deal.Id,
      name: deal.Name || '',
      contactId: deal.contact_id_c?.Id || deal.contact_id_c || null,
      companyId: deal.company_id_c?.Id || deal.company_id_c || null,
      value: deal.value_c || 0,
      probability: deal.probability_c || 0,
      stage: deal.stage_c || DEAL_STAGES.PROSPECT,
      expectedCloseDate: deal.expected_close_date_c || '',
      createdAt: deal.created_at_c || deal.CreatedOn,
      updatedAt: deal.updated_at_c || deal.ModifiedOn,
      description: deal.description_c || '',
      notes: deal.notes_c || ''
    })) || [];
    
    return transformedDeals;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching deals by stage:", error.response.data.message);
    } else {
      console.error("Error fetching deals by stage:", error);
    }
    return [];
  }
};
