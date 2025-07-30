import mockCampaigns from '@/services/mockData/campaigns.json';
import { toast } from 'react-toastify';

let campaigns = [...mockCampaigns];
let nextId = Math.max(...campaigns.map(c => c.Id)) + 1;

export const campaignService = {
  getAll: () => {
    return Promise.resolve([...campaigns]);
  },

  getById: (id) => {
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return Promise.reject(new Error('Invalid campaign ID'));
    }
    
    const campaign = campaigns.find(c => c.Id === numericId);
    if (!campaign) {
      return Promise.reject(new Error('Campaign not found'));
    }
    
    return Promise.resolve({ ...campaign });
  },

  create: (campaignData) => {
    const newCampaign = {
      ...campaignData,
      Id: nextId++,
      sent: 0,
      opened: 0,
      clicked: 0,
      unsubscribed: 0,
      bounced: 0,
      openRate: 0,
      clickRate: 0,
      conversionRate: 0,
      createdAt: new Date().toISOString(),
      lastSent: null
    };
    
    campaigns.push(newCampaign);
    toast.success('Campaign created successfully!');
    return Promise.resolve({ ...newCampaign });
  },

  update: (id, campaignData) => {
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return Promise.reject(new Error('Invalid campaign ID'));
    }

    const index = campaigns.findIndex(c => c.Id === numericId);
    if (index === -1) {
      return Promise.reject(new Error('Campaign not found'));
    }

    campaigns[index] = {
      ...campaigns[index],
      ...campaignData,
      Id: numericId // Ensure ID doesn't change
    };

    toast.success('Campaign updated successfully!');
    return Promise.resolve({ ...campaigns[index] });
  },

  delete: (id) => {
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return Promise.reject(new Error('Invalid campaign ID'));
    }

    const index = campaigns.findIndex(c => c.Id === numericId);
    if (index === -1) {
      return Promise.reject(new Error('Campaign not found'));
    }

    const deletedCampaign = campaigns[index];
    campaigns.splice(index, 1);
    toast.success('Campaign deleted successfully!');
    return Promise.resolve({ ...deletedCampaign });
  },

  launch: (id) => {
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return Promise.reject(new Error('Invalid campaign ID'));
    }

    const index = campaigns.findIndex(c => c.Id === numericId);
    if (index === -1) {
      return Promise.reject(new Error('Campaign not found'));
    }

    if (campaigns[index].status !== 'draft') {
      return Promise.reject(new Error('Only draft campaigns can be launched'));
    }

    campaigns[index] = {
      ...campaigns[index],
      status: 'active',
      lastSent: new Date().toISOString()
    };

    toast.success('Campaign launched successfully!');
    return Promise.resolve({ ...campaigns[index] });
  },

  pause: (id) => {
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return Promise.reject(new Error('Invalid campaign ID'));
    }

    const index = campaigns.findIndex(c => c.Id === numericId);
    if (index === -1) {
      return Promise.reject(new Error('Campaign not found'));
    }

    if (campaigns[index].status !== 'active') {
      return Promise.reject(new Error('Only active campaigns can be paused'));
    }

    campaigns[index] = {
      ...campaigns[index],
      status: 'draft'
    };

    toast.success('Campaign paused successfully!');
    return Promise.resolve({ ...campaigns[index] });
  },

  getMetrics: () => {
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const draftCampaigns = campaigns.filter(c => c.status === 'draft').length;
    const sentCampaigns = campaigns.filter(c => c.status === 'sent').length;
    
    const totalSent = campaigns.reduce((sum, c) => sum + c.sent, 0);
    const totalOpened = campaigns.reduce((sum, c) => sum + c.opened, 0);
    const totalClicked = campaigns.reduce((sum, c) => sum + c.clicked, 0);
    
    const avgOpenRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
    const avgClickRate = totalSent > 0 ? (totalClicked / totalSent) * 100 : 0;

    return Promise.resolve({
      totalCampaigns,
      activeCampaigns,
      draftCampaigns,
      sentCampaigns,
      totalSent,
      totalOpened,
      totalClicked,
      avgOpenRate: Math.round(avgOpenRate * 10) / 10,
      avgClickRate: Math.round(avgClickRate * 10) / 10
    });
  }
};