import { toast } from "react-toastify";

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const TABLE_NAME = 'custom_property_c';

// Field mapping for the custom property table
const CUSTOM_PROPERTY_FIELDS = [
  { field: { Name: "Name" } },
  { field: { Name: "label_c" } },
  { field: { Name: "type_c" } },
  { field: { Name: "entity_type_c" } },
  { field: { Name: "required_c" } },
  { field: { Name: "options_c" } },
  { field: { Name: "created_at_c" } },
  { field: { Name: "updated_at_c" } }
];

export const getAll = async () => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: CUSTOM_PROPERTY_FIELDS,
      orderBy: [{ fieldName: "created_at_c", sorttype: "DESC" }]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error fetching custom properties:", response.message);
      toast.error(response.message);
      return [];
    }
    
    // Transform database fields to UI format
    const transformedProperties = response.data?.map(property => ({
      Id: property.Id,
      name: property.Name || '',
      label: property.label_c || '',
      type: property.type_c || 'text',
      entityType: property.entity_type_c || 'contact',
      required: property.required_c || false,
      options: property.options_c ? property.options_c.split(',').map(o => o.trim()) : [],
      createdAt: property.created_at_c || property.CreatedOn,
      updatedAt: property.updated_at_c || property.ModifiedOn
    })) || [];
    
    return transformedProperties;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching custom properties:", error.response.data.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error fetching custom properties:", error);
      toast.error("Failed to fetch custom properties");
    }
    return [];
  }
};

export const getById = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = { fields: CUSTOM_PROPERTY_FIELDS };
    
    const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
    
    if (!response.success) {
      console.error("Error fetching custom property:", response.message);
      toast.error(response.message);
      return null;
    }
    
    // Transform database fields to UI format
    const property = response.data;
    return {
      Id: property.Id,
      name: property.Name || '',
      label: property.label_c || '',
      type: property.type_c || 'text',
      entityType: property.entity_type_c || 'contact',
      required: property.required_c || false,
      options: property.options_c ? property.options_c.split(',').map(o => o.trim()) : [],
      createdAt: property.created_at_c || property.CreatedOn,
      updatedAt: property.updated_at_c || property.ModifiedOn
    };
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching custom property:", error.response.data.message);
    } else {
      console.error("Error fetching custom property:", error);
    }
    return null;
  }
};

export const getByEntityType = async (entityType) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: CUSTOM_PROPERTY_FIELDS,
      where: [
        {
          FieldName: "entity_type_c",
          Operator: "EqualTo",
          Values: [entityType]
        }
      ]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error fetching custom properties by entity:", response.message);
      return [];
    }
    
    // Transform database fields to UI format
    const transformedProperties = response.data?.map(property => ({
      Id: property.Id,
      name: property.Name || '',
      label: property.label_c || '',
      type: property.type_c || 'text',
      entityType: property.entity_type_c || 'contact',
      required: property.required_c || false,
      options: property.options_c ? property.options_c.split(',').map(o => o.trim()) : [],
      createdAt: property.created_at_c || property.CreatedOn,
      updatedAt: property.updated_at_c || property.ModifiedOn
    })) || [];
    
    return transformedProperties;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching custom properties by entity:", error.response.data.message);
    } else {
      console.error("Error fetching custom properties by entity:", error);
    }
    return [];
  }
};

export const create = async (propertyData) => {
  try {
    // Validate required fields
    if (!propertyData.name || !propertyData.label || !propertyData.type || !propertyData.entityType) {
      throw new Error("Missing required fields");
    }

    const apperClient = getApperClient();
    
    // Transform UI format to database fields (only Updateable fields)
    const dbProperty = {
      Name: propertyData.name,
      label_c: propertyData.label,
      type_c: propertyData.type,
      entity_type_c: propertyData.entityType,
      required_c: propertyData.required || false,
      options_c: Array.isArray(propertyData.options) ? propertyData.options.join(',') : '',
      created_at_c: new Date().toISOString(),
      updated_at_c: new Date().toISOString()
    };
    
    const params = { records: [dbProperty] };
    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error creating custom property:", response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create custom property ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulRecords.length > 0) {
        const createdProperty = successfulRecords[0].data;
        toast.success('Custom property created successfully!');
        
        // Transform back to UI format
        return {
          Id: createdProperty.Id,
          name: createdProperty.Name || '',
          label: createdProperty.label_c || '',
          type: createdProperty.type_c || 'text',
          entityType: createdProperty.entity_type_c || 'contact',
          required: createdProperty.required_c || false,
          options: createdProperty.options_c ? createdProperty.options_c.split(',').map(o => o.trim()) : [],
          createdAt: createdProperty.created_at_c || createdProperty.CreatedOn,
          updatedAt: createdProperty.updated_at_c || createdProperty.ModifiedOn
        };
      }
    }
    
    throw new Error('No successful records created');
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating custom property:", error.response.data.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error creating custom property:", error);
    }
    throw error;
  }
};

export const update = async (id, propertyData) => {
  try {
    const apperClient = getApperClient();
    
    // Transform UI format to database fields (only Updateable fields)
    const dbProperty = {
      Id: parseInt(id),
      Name: propertyData.name,
      label_c: propertyData.label,
      type_c: propertyData.type,
      entity_type_c: propertyData.entityType,
      required_c: propertyData.required || false,
      options_c: Array.isArray(propertyData.options) ? propertyData.options.join(',') : '',
      updated_at_c: new Date().toISOString()
    };
    
    const params = { records: [dbProperty] };
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error("Error updating custom property:", response.message);
      toast.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update custom property ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        
        failedUpdates.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulUpdates.length > 0) {
        const updatedProperty = successfulUpdates[0].data;
        toast.success('Custom property updated successfully!');
        
        // Transform back to UI format
        return {
          Id: updatedProperty.Id,
          name: updatedProperty.Name || '',
          label: updatedProperty.label_c || '',
          type: updatedProperty.type_c || 'text',
          entityType: updatedProperty.entity_type_c || 'contact',
          required: updatedProperty.required_c || false,
          options: updatedProperty.options_c ? updatedProperty.options_c.split(',').map(o => o.trim()) : [],
          createdAt: updatedProperty.created_at_c || updatedProperty.CreatedOn,
          updatedAt: updatedProperty.updated_at_c || updatedProperty.ModifiedOn
        };
      }
    }
    
    throw new Error('No successful records updated');
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating custom property:", error.response.data.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error updating custom property:", error);
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
      console.error("Error deleting custom property:", response.message);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete custom property ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        
        failedDeletions.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulDeletions.length > 0) {
        toast.success('Custom property deleted successfully!');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting custom property:", error.response.data.message);
      toast.error(error.response.data.message);
    } else {
      console.error("Error deleting custom property:", error);
    }
    return false;
  }
};