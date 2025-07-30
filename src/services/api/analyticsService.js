import { getAll as getAllContacts } from './contactService';
import { getAll as getAllDeals, DEAL_STAGES } from './dealService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Calculate analytics from existing data
export const getAnalytics = async () => {
  await delay(200);
  
  const [contacts, deals] = await Promise.all([
    getAllContacts(),
    getAllDeals()
  ]);

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
export const getContactLifecycleStats = async () => {
  await delay(200);
  const contacts = await getAllContacts();
  
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