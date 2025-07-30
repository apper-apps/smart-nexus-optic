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
// Export delete_ function (delete is a reserved keyword)
export { delete_ };