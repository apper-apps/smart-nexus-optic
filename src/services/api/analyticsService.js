import { getAll as getAllContacts } from './contactService';
import { getAll as getAllDeals, DEAL_STAGES } from './dealService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Calculate analytics from existing data
export const getAnalytics = async (filters = {}) => {
  await delay(200);
  
  const [allContacts, allDeals] = await Promise.all([
    getAllContacts(),
    getAllDeals()
  ]);

  // Apply filters
  let contacts = [...allContacts];
  let deals = [...allDeals];

  // Filter by date range
  if (filters.dateFrom || filters.dateTo) {
    const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const toDate = filters.dateTo ? new Date(filters.dateTo) : null;
    
    contacts = contacts.filter(contact => {
      const contactDate = new Date(contact.createdAt);
      if (fromDate && contactDate < fromDate) return false;
      if (toDate && contactDate > toDate) return false;
      return true;
    });
    
    deals = deals.filter(deal => {
      const dealDate = new Date(deal.createdAt);
      if (fromDate && dealDate < fromDate) return false;
      if (toDate && dealDate > toDate) return false;
      return true;
    });
  }

  // Filter by team member (assignedTo for deals)
  if (filters.teamMember) {
    deals = deals.filter(deal => deal.assignedTo === filters.teamMember);
  }

  // Filter by lifecycle stage
  if (filters.lifecycleStage) {
    contacts = contacts.filter(contact => contact.lifecycleStage === filters.lifecycleStage);
  }

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  // Total contacts
  const totalContacts = contacts.length;
  
  // Active deals (not closed)
  const activeDeals = deals.filter(deal => 
    deal.stage !== DEAL_STAGES.CLOSED_WON && 
    deal.stage !== DEAL_STAGES.CLOSED_LOST
  );
  
  // Pipeline value (sum of active deals)
  const pipelineValue = activeDeals.reduce((sum, deal) => sum + deal.value, 0);
  
  // Closed deals this month
  const closedDealsThisMonth = deals.filter(deal => {
    if (deal.stage !== DEAL_STAGES.CLOSED_WON) return false;
    const dealDate = new Date(deal.updatedAt || deal.createdAt);
    return dealDate.getMonth() === currentMonth && dealDate.getFullYear() === currentYear;
  });
  
  const closedDealsThisMonthValue = closedDealsThisMonth.reduce((sum, deal) => sum + deal.value, 0);
  
  // Conversion rate (closed won / total deals)
  const closedWonDeals = deals.filter(deal => deal.stage === DEAL_STAGES.CLOSED_WON);
  const conversionRate = deals.length > 0 ? (closedWonDeals.length / deals.length) * 100 : 0;
  
  // Deal stage distribution
  const stageDistribution = Object.values(DEAL_STAGES).map(stage => ({
    stage,
    count: deals.filter(deal => deal.stage === stage).length,
    value: deals.filter(deal => deal.stage === stage).reduce((sum, deal) => sum + deal.value, 0)
  }));
  
  // Monthly trend (last 6 months)
  const monthlyTrend = [];
  for (let i = 5; i >= 0; i--) {
    const targetDate = new Date();
    targetDate.setMonth(currentMonth - i);
    const month = targetDate.getMonth();
    const year = targetDate.getFullYear();
    
    const monthDeals = deals.filter(deal => {
      const dealDate = new Date(deal.createdAt);
      return dealDate.getMonth() === month && dealDate.getFullYear() === year;
    });
    
    const monthClosedWon = monthDeals.filter(deal => deal.stage === DEAL_STAGES.CLOSED_WON);
    
    monthlyTrend.push({
      month: targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      deals: monthDeals.length,
      revenue: monthClosedWon.reduce((sum, deal) => sum + deal.value, 0),
      closedDeals: monthClosedWon.length
    });
  }
  
  return {
    totalContacts,
    activeDeals: activeDeals.length,
    pipelineValue,
    closedDealsThisMonth: closedDealsThisMonth.length,
    closedDealsThisMonthValue,
    conversionRate,
    stageDistribution,
    monthlyTrend
  };
};

// Get contact lifecycle distribution
export const getContactLifecycleStats = async (filters = {}) => {
  await delay(200);
  let contacts = await getAllContacts();

  // Apply filters
  if (filters.dateFrom || filters.dateTo) {
    const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const toDate = filters.dateTo ? new Date(filters.dateTo) : null;
    
    contacts = contacts.filter(contact => {
      const contactDate = new Date(contact.createdAt);
      if (fromDate && contactDate < fromDate) return false;
      if (toDate && contactDate > toDate) return false;
      return true;
    });
  }

  if (filters.lifecycleStage) {
    contacts = contacts.filter(contact => contact.lifecycleStage === filters.lifecycleStage);
  }
  
  const lifecycleStats = contacts.reduce((acc, contact) => {
    const stage = contact.lifecycleStage || 'Unknown';
    acc[stage] = (acc[stage] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(lifecycleStats).map(([stage, count]) => ({
    stage,
    count,
    percentage: ((count / contacts.length) * 100).toFixed(1)
  }));
};

// Get lead source statistics
export const getLeadSourceStats = async (filters = {}) => {
  await delay(200);
  let contacts = await getAllContacts();

  // Apply filters
  if (filters.dateFrom || filters.dateTo) {
    const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const toDate = filters.dateTo ? new Date(filters.dateTo) : null;
    
    contacts = contacts.filter(contact => {
      const contactDate = new Date(contact.createdAt);
      if (fromDate && contactDate < fromDate) return false;
      if (toDate && contactDate > toDate) return false;
      return true;
    });
  }

  if (filters.lifecycleStage) {
    contacts = contacts.filter(contact => contact.lifecycleStage === filters.lifecycleStage);
  }
  
  const leadSources = contacts.reduce((acc, contact) => {
    const source = contact.source || 'Unknown';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(leadSources).map(([source, count]) => ({
    source,
    count,
    percentage: ((count / contacts.length) * 100).toFixed(1)
  }));
};

// Get sales rep performance
export const getSalesRepPerformance = async (filters = {}) => {
  await delay(200);
  let deals = await getAllDeals();

  // Apply filters
  if (filters.dateFrom || filters.dateTo) {
    const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const toDate = filters.dateTo ? new Date(filters.dateTo) : null;
    
    deals = deals.filter(deal => {
      const dealDate = new Date(deal.createdAt);
      if (fromDate && dealDate < fromDate) return false;
      if (toDate && dealDate > toDate) return false;
      return true;
    });
  }

  if (filters.teamMember) {
    deals = deals.filter(deal => deal.assignedTo === filters.teamMember);
  }
  
  const repPerformance = deals.reduce((acc, deal) => {
    const rep = deal.assignedTo || 'Unassigned';
    if (!acc[rep]) {
      acc[rep] = {
        name: rep,
        totalDeals: 0,
        closedDeals: 0,
        revenue: 0,
        pipelineValue: 0
      };
    }
    
    acc[rep].totalDeals++;
    if (deal.stage === DEAL_STAGES.CLOSED_WON) {
      acc[rep].closedDeals++;
      acc[rep].revenue += deal.value;
    } else if (deal.stage !== DEAL_STAGES.CLOSED_LOST) {
      acc[rep].pipelineValue += deal.value;
    }
    
    return acc;
  }, {});
  
  return Object.values(repPerformance)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8); // Top 8 performers
};

// Get campaign performance from campaign service
export const getCampaignPerformance = async (filters = {}) => {
  await delay(200);
  
  try {
    // Import campaign service dynamically to avoid circular imports
const { campaignService } = await import('./campaignService');
    let campaigns = await campaignService.getAll();
    
    // Apply date filters to campaigns
    if (filters.dateFrom || filters.dateTo) {
      const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
      const toDate = filters.dateTo ? new Date(filters.dateTo) : null;
      
      campaigns = campaigns.filter(campaign => {
        const campaignDate = new Date(campaign.createdAt || campaign.scheduledDate);
        if (fromDate && campaignDate < fromDate) return false;
        if (toDate && campaignDate > toDate) return false;
        return true;
      });
    }
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const draftCampaigns = campaigns.filter(c => c.status === 'draft').length;
    const sentCampaigns = campaigns.filter(c => c.status === 'sent').length;
    
    const totalSent = campaigns.reduce((sum, c) => sum + c.sent, 0);
    const totalOpened = campaigns.reduce((sum, c) => sum + c.opened, 0);
    const totalClicked = campaigns.reduce((sum, c) => sum + c.clicked, 0);
    
    const avgOpenRate = totalSent > 0 ? Math.round(((totalOpened / totalSent) * 100) * 10) / 10 : 0;
    const avgClickRate = totalSent > 0 ? Math.round(((totalClicked / totalSent) * 100) * 10) / 10 : 0;
    
    return {
      totalCampaigns,
      activeCampaigns,
      draftCampaigns,
      sentCampaigns,
      totalSent,
      totalOpened,
      totalClicked,
      avgOpenRate,
      avgClickRate
    };
  } catch (error) {
    console.error('Failed to load campaign performance:', error);
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
};