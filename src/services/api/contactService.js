import contactsData from "@/services/mockData/contacts.json";
// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for demonstration
let contacts = [...contactsData];

export const getAll = async () => {
  await delay(300);
  return [...contacts];
};

export const getById = async (id) => {
  await delay(200);
  const contact = contacts.find(c => c.Id === parseInt(id));
  if (!contact) {
    throw new Error("Contact not found");
  }
  return { ...contact };
};

export const create = async (contactData) => {
await delay(400);
  
  const maxId = Math.max(...contacts.map(c => c.Id), 0);
  const newContact = {
    ...contactData,
    Id: maxId + 1,
    companyId: contactData.companyId ? parseInt(contactData.companyId) : null,
    customProperties: contactData.customProperties || {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  contacts.push(newContact);
  return { ...newContact };
};

export const update = async (id, contactData) => {
await delay(400);
  
  const index = contacts.findIndex(c => c.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Contact not found");
  }
  
  const updatedContact = {
    ...contacts[index],
    ...contactData,
    companyId: contactData.companyId ? parseInt(contactData.companyId) : null,
    customProperties: {
      ...contacts[index].customProperties,
      ...contactData.customProperties
    },
    updatedAt: new Date().toISOString()
  };
  
  contacts[index] = updatedContact;
  return { ...updatedContact };
};

export const delete_ = async (id) => {
  await delay(300);
  
  const index = contacts.findIndex(c => c.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Contact not found");
  }
  
  contacts.splice(index, 1);
return true;
};

// Bulk delete multiple contacts
export const bulkDelete = async (contactIds) => {
  await delay(500); // Simulate API delay
  
  // Validate all contact IDs exist
  for (const id of contactIds) {
    const contact = contacts.find(c => c.Id === id);
    if (!contact) {
      throw new Error(`Contact with ID ${id} not found`);
    }
  }
  
  // Remove all contacts from the array
  contactIds.forEach(id => {
    const index = contacts.findIndex(c => c.Id === id);
    if (index !== -1) {
      contacts.splice(index, 1);
    }
  });
  
  return true;
};

// Bulk update lifecycle stage for multiple contacts
export const bulkUpdateLifecycleStage = async (contactIds, lifecycleStage) => {
  await delay(500); // Simulate API delay
  
  const validStages = ['lead', 'prospect', 'customer', 'evangelist'];
  if (!validStages.includes(lifecycleStage)) {
    throw new Error('Invalid lifecycle stage');
  }
  
  const updatedContacts = [];
  
  for (const id of contactIds) {
    const contactIndex = contacts.findIndex(c => c.Id === id);
    if (contactIndex === -1) {
      throw new Error(`Contact with ID ${id} not found`);
    }
    
    contacts[contactIndex] = {
      ...contacts[contactIndex],
      lifecycleStage,
      updatedAt: new Date().toISOString()
    };
    
    updatedContacts.push(contacts[contactIndex]);
  }
  
  return updatedContacts;
};
// Export delete_ function (delete is a reserved keyword)