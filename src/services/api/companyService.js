import companiesData from "@/services/mockData/companies.json";
// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for demonstration
let companies = [...companiesData];

export const getAll = async () => {
  await delay(250);
  return [...companies];
};

export const getById = async (id) => {
  await delay(200);
  const company = companies.find(c => c.Id === parseInt(id));
  if (!company) {
    throw new Error("Company not found");
  }
  return { ...company };
};

export const create = async (companyData) => {
  await delay(400);
  
  const maxId = Math.max(...companies.map(c => c.Id), 0);
  const newCompany = {
    ...companyData,
    Id: maxId + 1,
    employeeCount: parseInt(companyData.employeeCount) || 0,
    customProperties: companyData.customProperties || {}
  };
  
  companies.push(newCompany);
  return { ...newCompany };
};
export const update = async (id, companyData) => {
  await delay(400);
const index = companies.findIndex(c => c.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Company not found");
  }
  
  const updatedCompany = {
    ...companies[index],
    ...companyData,
    employeeCount: parseInt(companyData.employeeCount) || 0,
    customProperties: {
      ...companies[index].customProperties,
      ...companyData.customProperties
    }
  };
  
  companies[index] = updatedCompany;
  return { ...updatedCompany };
};

export const delete_ = async (id) => {
  await delay(300);
  
  const index = companies.findIndex(c => c.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Company not found");
  }
  
  companies.splice(index, 1);
  return true;
};