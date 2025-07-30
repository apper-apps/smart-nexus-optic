import dealsData from "@/services/mockData/deals.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for demonstration
let deals = [...dealsData];

export const getAll = async () => {
  await delay(300);
  return [...deals];
};

export const getById = async (id) => {
  await delay(200);
  const deal = deals.find(d => d.Id === parseInt(id));
  if (!deal) {
    throw new Error("Deal not found");
  }
  return { ...deal };
};

export const create = async (dealData) => {
  await delay(400);
  
  const maxId = Math.max(...deals.map(d => d.Id), 0);
  const newDeal = {
    ...dealData,
    Id: maxId + 1,
    contactId: dealData.contactId ? parseInt(dealData.contactId) : null,
    companyId: dealData.companyId ? parseInt(dealData.companyId) : null,
    value: parseFloat(dealData.value) || 0,
    probability: parseInt(dealData.probability) || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  deals.push(newDeal);
  return { ...newDeal };
};

export const update = async (id, dealData) => {
  await delay(400);
  
  const index = deals.findIndex(d => d.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Deal not found");
  }
  
  const updatedDeal = {
    ...deals[index],
    ...dealData,
    contactId: dealData.contactId ? parseInt(dealData.contactId) : null,
    companyId: dealData.companyId ? parseInt(dealData.companyId) : null,
    value: dealData.value ? parseFloat(dealData.value) : deals[index].value,
    probability: dealData.probability ? parseInt(dealData.probability) : deals[index].probability,
    updatedAt: new Date().toISOString()
  };
  
  deals[index] = updatedDeal;
  return { ...updatedDeal };
};

export const delete_ = async (id) => {
  await delay(300);
  
  const index = deals.findIndex(d => d.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Deal not found");
  }
  
  deals.splice(index, 1);
  return true;
};

export const updateStage = async (id, newStage) => {
  await delay(200);
  
  const index = deals.findIndex(d => d.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Deal not found");
  }
  
  deals[index] = {
    ...deals[index],
    stage: newStage,
    updatedAt: new Date().toISOString()
  };
  
  return { ...deals[index] };
};

export const getByStage = async (stage) => {
  await delay(200);
  return deals.filter(deal => deal.stage === stage).map(deal => ({ ...deal }));
};

// Valid deal stages
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