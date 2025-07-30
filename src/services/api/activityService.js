import activitiesData from "@/services/mockData/activities.json";
// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for demonstration
let activities = [...activitiesData];

export const getAll = async () => {
  await delay(200);
  return [...activities];
};

export const getById = async (id) => {
  await delay(150);
  const activity = activities.find(a => a.Id === parseInt(id));
  if (!activity) {
    throw new Error("Activity not found");
  }
  return { ...activity };
};

export const getByContactId = async (contactId) => {
  await delay(200);
  return activities.filter(a => a.contactId === parseInt(contactId));
};

export const create = async (activityData) => {
  await delay(300);
  
  const maxId = Math.max(...activities.map(a => a.Id), 0);
  const newActivity = {
    ...activityData,
    Id: maxId + 1,
    contactId: parseInt(activityData.contactId),
    timestamp: new Date().toISOString()
  };
  
  activities.push(newActivity);
  return { ...newActivity };
};

export const update = async (id, activityData) => {
  await delay(300);
  
  const index = activities.findIndex(a => a.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Activity not found");
  }
  
  const updatedActivity = {
    ...activities[index],
    ...activityData,
    contactId: parseInt(activityData.contactId)
  };
  
  activities[index] = updatedActivity;
  return { ...updatedActivity };
};

export const delete_ = async (id) => {
  await delay(250);
  
  const index = activities.findIndex(a => a.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Activity not found");
  }
  
  activities.splice(index, 1);
  return true;
};