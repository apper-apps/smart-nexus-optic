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
    contactId: activityData.contactId ? parseInt(activityData.contactId) : null,
    dealId: activityData.dealId ? parseInt(activityData.dealId) : null,
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Ensure specific fields are properly handled
    attendees: activityData.attendees || "",
    followUpActions: activityData.followUpActions || "",
    followUpDate: activityData.followUpDate || null,
    priority: activityData.priority || "medium",
    location: activityData.location || "",
    notes: activityData.notes || "",
    outcome: activityData.outcome || "",
    duration: activityData.duration ? parseInt(activityData.duration) : null
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
    contactId: activityData.contactId ? parseInt(activityData.contactId) : activities[index].contactId,
    dealId: activityData.dealId ? parseInt(activityData.dealId) : activities[index].dealId
  };
  
  activities[index] = updatedActivity;
  return { ...updatedActivity };
};

export const getByDealId = async (dealId) => {
  await delay(200);
  return activities.filter(activity => activity.dealId === parseInt(dealId))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
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