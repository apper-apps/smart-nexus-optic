const customProperties = [
  {
    Id: 1,
    name: "department",
    label: "Department",
    type: "dropdown", 
    entityType: "contact",
    options: ["Sales", "Marketing", "Support", "Engineering"],
    required: false,
    createdAt: "2024-01-15T10:00:00Z"
  },
  {
    Id: 2,
    name: "experience_years",
    label: "Years of Experience", 
    type: "number",
    entityType: "contact",
    required: false,
    createdAt: "2024-01-15T10:15:00Z"
  },
  {
    Id: 3,
    name: "skills",
    label: "Skills",
    type: "multi-select",
    entityType: "contact", 
    options: ["JavaScript", "React", "Node.js", "Python", "Java", "C#"],
    required: false,
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    Id: 4,
    name: "founded_date",
    label: "Founded Date",
    type: "date",
    entityType: "company",
    required: false,
    createdAt: "2024-01-15T11:00:00Z"
  },
  {
    Id: 5,
    name: "industry_tags",
    label: "Industry Tags",
    type: "multi-select",
    entityType: "company",
    options: ["Technology", "Healthcare", "Finance", "Education", "Retail", "Manufacturing"],
    required: false,
    createdAt: "2024-01-15T11:15:00Z"
  }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getAll = async () => {
  await delay(200);
  return [...customProperties];
};

export const getById = async (id) => {
  await delay(200);
  const property = customProperties.find(p => p.Id === parseInt(id));
  if (!property) {
    throw new Error("Custom property not found");
  }
  return { ...property };
};

export const getByEntityType = async (entityType) => {
  await delay(200);
  return customProperties.filter(p => p.entityType === entityType).map(p => ({ ...p }));
};

export const create = async (propertyData) => {
  await delay(400);
  
  // Validate required fields
  if (!propertyData.name || !propertyData.label || !propertyData.type || !propertyData.entityType) {
    throw new Error("Missing required fields");
  }

  // Check for duplicate name within entity type
  const existingProperty = customProperties.find(p => 
    p.name === propertyData.name && p.entityType === propertyData.entityType
  );
  if (existingProperty) {
    throw new Error("Property name already exists for this entity type");
  }

  const maxId = Math.max(...customProperties.map(p => p.Id), 0);
  const newProperty = {
    ...propertyData,
    Id: maxId + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    options: propertyData.options || []
  };
  
  customProperties.push(newProperty);
  return { ...newProperty };
};

export const update = async (id, propertyData) => {
  await delay(400);
  
  const index = customProperties.findIndex(p => p.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Custom property not found");
  }

  // Check for duplicate name (excluding current property)
  const existingProperty = customProperties.find(p => 
    p.name === propertyData.name && 
    p.entityType === propertyData.entityType && 
    p.Id !== parseInt(id)
  );
  if (existingProperty) {
    throw new Error("Property name already exists for this entity type");
  }

  const updatedProperty = {
    ...customProperties[index],
    ...propertyData,
    updatedAt: new Date().toISOString(),
    options: propertyData.options || []
  };
  
  customProperties[index] = updatedProperty;
  return { ...updatedProperty };
};

export const delete_ = async (id) => {
  await delay(400);
  
  const index = customProperties.findIndex(p => p.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Custom property not found");
  }
  
  const deletedProperty = { ...customProperties[index] };
  customProperties.splice(index, 1);
  return deletedProperty;
};