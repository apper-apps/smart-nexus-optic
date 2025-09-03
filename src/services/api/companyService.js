import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const TABLE_NAME = 'company_c';

// Field mapping for the company table
const COMPANY_FIELDS = [
  { field: { Name: "Name" } },
  { field: { Name: "industry_c" } },
  { field: { Name: "website_c" } },
  { field: { Name: "employee_count_c" } }
];

export const getAll = async () => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: COMPANY_FIELDS,
      orderBy: [{ fieldName: "Name", sorttype: "ASC" }]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error fetching companies:", response.message);
      toast.error(response.message);
      return [];
    }
    
    // Transform database fields to UI format
    const transformedCompanies = response.data?.map(company => ({
      Id: company.Id,
      name: company.Name || '',
      industry: company.industry_c || '',
      website: company.website_c || '',
      employeeCount: company.employee_count_c || 0
    })) || [];
    
    return transformedCompanies;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching companies:", error.response.data.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error fetching companies:", error);
      toast.error("Failed to fetch companies");
    }
    return [];
  }
};

export const getById = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = { fields: COMPANY_FIELDS };
    
    const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
    
    if (!response.success) {
      console.error("Error fetching company:", response.message);
      toast.error(response.message);
      return null;
    }
    
    // Transform database fields to UI format
    const company = response.data;
    return {
      Id: company.Id,
      name: company.Name || '',
      industry: company.industry_c || '',
      website: company.website_c || '',
      employeeCount: company.employee_count_c || 0
    };
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching company:", error.response.data.message);
    } else {
      console.error("Error fetching company:", error);
    }
    return null;
  }
};

export const create = async (companyData) => {
  try {
    const apperClient = getApperClient();
    
    // Transform UI format to database fields (only Updateable fields)
    const dbCompany = {
      Name: companyData.name || '',
      industry_c: companyData.industry || '',
      website_c: companyData.website || '',
      employee_count_c: parseInt(companyData.employeeCount) || 0
    };
    
    const params = { records: [dbCompany] };
    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error creating company:", response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create company ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulRecords.length > 0) {
        const createdCompany = successfulRecords[0].data;
        toast.success('Company created successfully!');
        
        // Transform back to UI format
        return {
          Id: createdCompany.Id,
          name: createdCompany.Name || '',
          industry: createdCompany.industry_c || '',
          website: createdCompany.website_c || '',
          employeeCount: createdCompany.employee_count_c || 0
        };
      }
    }
    
    throw new Error('No successful records created');
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating company:", error.response.data.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error creating company:", error);
    }
    throw error;
  }
};

export const update = async (id, companyData) => {
  try {
    const apperClient = getApperClient();
    
    // Transform UI format to database fields (only Updateable fields)
    const dbCompany = {
      Id: parseInt(id),
      Name: companyData.name || '',
      industry_c: companyData.industry || '',
      website_c: companyData.website || '',
      employee_count_c: parseInt(companyData.employeeCount) || 0
    };
    
    const params = { records: [dbCompany] };
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error updating company:", response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update company ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        
        failedUpdates.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulUpdates.length > 0) {
        const updatedCompany = successfulUpdates[0].data;
        toast.success('Company updated successfully!');
        
        // Transform back to UI format
        return {
          Id: updatedCompany.Id,
          name: updatedCompany.Name || '',
          industry: updatedCompany.industry_c || '',
          website: updatedCompany.website_c || '',
          employeeCount: updatedCompany.employee_count_c || 0
        };
      }
    }
    
    throw new Error('No successful records updated');
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating company:", error.response.data.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error updating company:", error);
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
      console.error("Error deleting company:", response.message);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete company ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        
        failedDeletions.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulDeletions.length > 0) {
        toast.success('Company deleted successfully!');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting company:", error.response.data.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error deleting company:", error);
    }
    return false;
  }
};