import { toast } from 'react-toastify';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const TABLE_NAME = 'campaign_c';

// Field mapping for the campaign table
const CAMPAIGN_FIELDS = [
  { field: { Name: "Name" } },
  { field: { Name: "subject_c" } },
  { field: { Name: "status_c" } },
  { field: { Name: "type_c" } },
  { field: { Name: "sent_c" } },
  { field: { Name: "opened_c" } },
  { field: { Name: "clicked_c" } },
  { field: { Name: "unsubscribed_c" } },
  { field: { Name: "bounced_c" } },
  { field: { Name: "created_at_c" } },
  { field: { Name: "last_sent_c" } },
  { field: { Name: "open_rate_c" } },
  { field: { Name: "click_rate_c" } },
  { field: { Name: "conversion_rate_c" } }
];

export const campaignService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: CAMPAIGN_FIELDS,
        orderBy: [{ fieldName: "created_at_c", sorttype: "DESC" }]
      };
      
      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error("Error fetching campaigns:", response.message);
        toast.error(response.message);
        return [];
      }
      
      // Transform database fields to UI format
      const transformedCampaigns = response.data?.map(campaign => ({
        Id: campaign.Id,
        name: campaign.Name || '',
        subject: campaign.subject_c || '',
        status: campaign.status_c || 'draft',
        type: campaign.type_c || 'broadcast',
        sent: campaign.sent_c || 0,
        opened: campaign.opened_c || 0,
        clicked: campaign.clicked_c || 0,
        unsubscribed: campaign.unsubscribed_c || 0,
        bounced: campaign.bounced_c || 0,
        createdAt: campaign.created_at_c || campaign.CreatedOn,
        lastSent: campaign.last_sent_c || null,
        openRate: campaign.open_rate_c || 0,
        clickRate: campaign.click_rate_c || 0,
        conversionRate: campaign.conversion_rate_c || 0,
        emailContent: {
          blocks: [],
          settings: {
            backgroundColor: '#ffffff',
            contentWidth: 600,
            padding: 20
          }
        }
      })) || [];
      
      return transformedCampaigns;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching campaigns:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching campaigns:", error);
        toast.error("Failed to fetch campaigns");
      }
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      const params = { fields: CAMPAIGN_FIELDS };
      
      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
      
      if (!response.success) {
        console.error("Error fetching campaign:", response.message);
        toast.error(response.message);
        return null;
      }
      
      // Transform database fields to UI format
      const campaign = response.data;
      return {
        Id: campaign.Id,
        name: campaign.Name || '',
        subject: campaign.subject_c || '',
        status: campaign.status_c || 'draft',
        type: campaign.type_c || 'broadcast',
        sent: campaign.sent_c || 0,
        opened: campaign.opened_c || 0,
        clicked: campaign.clicked_c || 0,
        unsubscribed: campaign.unsubscribed_c || 0,
        bounced: campaign.bounced_c || 0,
        createdAt: campaign.created_at_c || campaign.CreatedOn,
        lastSent: campaign.last_sent_c || null,
        openRate: campaign.open_rate_c || 0,
        clickRate: campaign.click_rate_c || 0,
        conversionRate: campaign.conversion_rate_c || 0,
        emailContent: {
          blocks: [],
          settings: {
            backgroundColor: '#ffffff',
            contentWidth: 600,
            padding: 20
          }
        }
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching campaign:", error.response.data.message);
      } else {
        console.error("Error fetching campaign:", error);
      }
      return null;
    }
  },

  create: async (campaignData) => {
    try {
      const apperClient = getApperClient();
      
      // Transform UI format to database fields (only Updateable fields)
      const dbCampaign = {
        Name: campaignData.name || '',
        subject_c: campaignData.subject || '',
        status_c: campaignData.status || 'draft',
        type_c: campaignData.type || 'broadcast',
        sent_c: 0,
        opened_c: 0,
        clicked_c: 0,
        unsubscribed_c: 0,
        bounced_c: 0,
        created_at_c: new Date().toISOString(),
        open_rate_c: 0,
        click_rate_c: 0,
        conversion_rate_c: 0
      };
      
      const params = { records: [dbCampaign] };
      const response = await apperClient.createRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error("Error creating campaign:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create campaign ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const createdCampaign = successfulRecords[0].data;
          toast.success('Campaign created successfully!');
          
          // Transform back to UI format
          return {
            Id: createdCampaign.Id,
            name: createdCampaign.Name || '',
            subject: createdCampaign.subject_c || '',
            status: createdCampaign.status_c || 'draft',
            type: createdCampaign.type_c || 'broadcast',
            sent: createdCampaign.sent_c || 0,
            opened: createdCampaign.opened_c || 0,
            clicked: createdCampaign.clicked_c || 0,
            unsubscribed: createdCampaign.unsubscribed_c || 0,
            bounced: createdCampaign.bounced_c || 0,
            createdAt: createdCampaign.created_at_c || createdCampaign.CreatedOn,
            lastSent: createdCampaign.last_sent_c || null,
            openRate: createdCampaign.open_rate_c || 0,
            clickRate: createdCampaign.click_rate_c || 0,
            conversionRate: createdCampaign.conversion_rate_c || 0,
            emailContent: campaignData.emailContent || {
              blocks: [],
              settings: {
                backgroundColor: '#ffffff',
                contentWidth: 600,
                padding: 20
              }
            }
          };
        }
      }
      
      throw new Error('No successful records created');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating campaign:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error creating campaign:", error);
      }
      throw error;
    }
  },

  update: async (id, campaignData) => {
    try {
      const apperClient = getApperClient();
      
      // Transform UI format to database fields (only Updateable fields)
      const dbCampaign = {
        Id: parseInt(id),
        Name: campaignData.name || '',
        subject_c: campaignData.subject || '',
        status_c: campaignData.status || 'draft',
        type_c: campaignData.type || 'broadcast'
      };
      
      const params = { records: [dbCampaign] };
      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error("Error updating campaign:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update campaign ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedCampaign = successfulUpdates[0].data;
          toast.success('Campaign updated successfully!');
          
          // Transform back to UI format
          return {
            Id: updatedCampaign.Id,
            name: updatedCampaign.Name || '',
            subject: updatedCampaign.subject_c || '',
            status: updatedCampaign.status_c || 'draft',
            type: updatedCampaign.type_c || 'broadcast',
            sent: updatedCampaign.sent_c || 0,
            opened: updatedCampaign.opened_c || 0,
            clicked: updatedCampaign.clicked_c || 0,
            unsubscribed: updatedCampaign.unsubscribed_c || 0,
            bounced: updatedCampaign.bounced_c || 0,
            createdAt: updatedCampaign.created_at_c || updatedCampaign.CreatedOn,
            lastSent: updatedCampaign.last_sent_c || null,
            openRate: updatedCampaign.open_rate_c || 0,
            clickRate: updatedCampaign.click_rate_c || 0,
            conversionRate: updatedCampaign.conversion_rate_c || 0,
            emailContent: campaignData.emailContent || {
              blocks: [],
              settings: {
                backgroundColor: '#ffffff',
                contentWidth: 600,
                padding: 20
              }
            }
          };
        }
      }
      
      throw new Error('No successful records updated');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating campaign:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error updating campaign:", error);
      }
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const apperClient = getApperClient();
      const params = { RecordIds: [parseInt(id)] };
      
      const response = await apperClient.deleteRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error("Error deleting campaign:", response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete campaign ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Campaign deleted successfully!');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting campaign:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error deleting campaign:", error);
      }
      return false;
    }
  },

  launch: async (id) => {
    try {
      const apperClient = getApperClient();
      
      const dbCampaign = {
        Id: parseInt(id),
        status_c: 'active',
        last_sent_c: new Date().toISOString()
      };
      
      const params = { records: [dbCampaign] };
      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error("Error launching campaign:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to launch campaign ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const launchedCampaign = successfulUpdates[0].data;
          toast.success('Campaign launched successfully!');
          
          // Transform back to UI format
          return {
            Id: launchedCampaign.Id,
            name: launchedCampaign.Name || '',
            subject: launchedCampaign.subject_c || '',
            status: launchedCampaign.status_c || 'draft',
            type: launchedCampaign.type_c || 'broadcast',
            sent: launchedCampaign.sent_c || 0,
            opened: launchedCampaign.opened_c || 0,
            clicked: launchedCampaign.clicked_c || 0,
            unsubscribed: launchedCampaign.unsubscribed_c || 0,
            bounced: launchedCampaign.bounced_c || 0,
            createdAt: launchedCampaign.created_at_c || launchedCampaign.CreatedOn,
            lastSent: launchedCampaign.last_sent_c || null,
            openRate: launchedCampaign.open_rate_c || 0,
            clickRate: launchedCampaign.click_rate_c || 0,
            conversionRate: launchedCampaign.conversion_rate_c || 0
          };
        }
      }
      
      throw new Error('No successful records updated');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error launching campaign:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error launching campaign:", error);
      }
      throw error;
    }
  },

  pause: async (id) => {
    try {
      const apperClient = getApperClient();
      
      const dbCampaign = {
        Id: parseInt(id),
        status_c: 'draft'
      };
      
      const params = { records: [dbCampaign] };
      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error("Error pausing campaign:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to pause campaign ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const pausedCampaign = successfulUpdates[0].data;
          toast.success('Campaign paused successfully!');
          
          // Transform back to UI format
          return {
            Id: pausedCampaign.Id,
            name: pausedCampaign.Name || '',
            subject: pausedCampaign.subject_c || '',
            status: pausedCampaign.status_c || 'draft',
            type: pausedCampaign.type_c || 'broadcast',
            sent: pausedCampaign.sent_c || 0,
            opened: pausedCampaign.opened_c || 0,
            clicked: pausedCampaign.clicked_c || 0,
            unsubscribed: pausedCampaign.unsubscribed_c || 0,
            bounced: pausedCampaign.bounced_c || 0,
            createdAt: pausedCampaign.created_at_c || pausedCampaign.CreatedOn,
            lastSent: pausedCampaign.last_sent_c || null,
            openRate: pausedCampaign.open_rate_c || 0,
            clickRate: pausedCampaign.click_rate_c || 0,
            conversionRate: pausedCampaign.conversion_rate_c || 0
          };
        }
      }
      
      throw new Error('No successful records updated');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error pausing campaign:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error("Error pausing campaign:", error);
      }
      throw error;
    }
  },

  getMetrics: async () => {
    try {
      const campaigns = await campaignService.getAll();
      
      const totalCampaigns = campaigns.length;
      const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
      const draftCampaigns = campaigns.filter(c => c.status === 'draft').length;
      const sentCampaigns = campaigns.filter(c => c.status === 'sent').length;
      
      const totalSent = campaigns.reduce((sum, c) => sum + (c.sent || 0), 0);
      const totalOpened = campaigns.reduce((sum, c) => sum + (c.opened || 0), 0);
      const totalClicked = campaigns.reduce((sum, c) => sum + (c.clicked || 0), 0);
      
      const avgOpenRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
      const avgClickRate = totalSent > 0 ? (totalClicked / totalSent) * 100 : 0;

      return {
        totalCampaigns,
        activeCampaigns,
        draftCampaigns,
        sentCampaigns,
        totalSent,
        totalOpened,
        totalClicked,
        avgOpenRate: Math.round(avgOpenRate * 10) / 10,
        avgClickRate: Math.round(avgClickRate * 10) / 10
      };
    } catch (error) {
      console.error("Error getting campaign metrics:", error);
      return {
        totalCampaigns: 0,
        activeCampaigns: 0,
        draftCampaigns: 0,
        sentCampaigns: 0,
        totalSent: 0,
        totalOpened: 0,
        totalClicked: 0,
        avgOpenRate: 0,
        avgClickRate: 0
      };
    }
  }
};