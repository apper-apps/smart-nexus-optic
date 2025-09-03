// Mock service implementation for workflows (no database table available)
import workflowsData from "@/services/mockData/workflows.json";
import { toast } from 'react-toastify';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for demonstration
let workflows = [...workflowsData];
let nextId = Math.max(...workflows.map(w => w.Id), 0) + 1;

export const getAll = async () => {
  await delay(200);
  return [...workflows];
};

export const getById = async (id) => {
  await delay(150);
  const workflow = workflows.find(w => w.Id === parseInt(id));
  if (!workflow) {
    throw new Error("Workflow not found");
  }
  return { ...workflow };
};

export const create = async (workflowData) => {
  await delay(300);
  
  const newWorkflow = {
    ...workflowData,
    Id: nextId++,
    isActive: workflowData.isActive || false,
    executionCount: 0,
    successRate: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    executionHistory: []
  };
  
  workflows.push(newWorkflow);
  toast.success('Workflow created successfully!');
  return { ...newWorkflow };
};

export const update = async (id, workflowData) => {
  await delay(300);
  
  const index = workflows.findIndex(w => w.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Workflow not found");
  }
  
  const updatedWorkflow = {
    ...workflows[index],
    ...workflowData,
    updatedAt: new Date().toISOString()
  };
  
  workflows[index] = updatedWorkflow;
  toast.success('Workflow updated successfully!');
  return { ...updatedWorkflow };
};

export const delete_ = async (id) => {
  await delay(250);
  
  const index = workflows.findIndex(w => w.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Workflow not found");
  }
  
  workflows.splice(index, 1);
  toast.success('Workflow deleted successfully!');
  return true;
};

export const activate = async (id) => {
  await delay(200);
  
  const index = workflows.findIndex(w => w.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Workflow not found");
  }
  
  workflows[index] = {
    ...workflows[index],
    isActive: true,
    updatedAt: new Date().toISOString()
  };
  
  toast.success('Workflow activated successfully!');
  return { ...workflows[index] };
};

export const deactivate = async (id) => {
  await delay(200);
  
  const index = workflows.findIndex(w => w.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Workflow not found");
  }
  
  workflows[index] = {
    ...workflows[index],
    isActive: false,
    updatedAt: new Date().toISOString()
  };
  
  toast.success('Workflow deactivated successfully!');
  return { ...workflows[index] };
};