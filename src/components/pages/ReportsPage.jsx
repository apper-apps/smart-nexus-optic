import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import { getAnalytics, getContactLifecycleStats } from "@/services/api/analyticsService";
import { toast } from "react-toastify";
const MetricCard = ({ title, value, subtitle, icon, trend, color = "info" }) => {
  const colorClasses = {
    info: "from-info-100 to-info-200 text-info-600",
    success: "from-success-100 to-success-200 text-success-600",
    primary: "from-primary-100 to-primary-200 text-primary-600",
    accent: "from-accent-100 to-accent-200 text-accent-600",
    warning: "from-warning-100 to-warning-200 text-warning-600"
  };

  return (
    <Card className="p-6 card-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <ApperIcon name={icon} className="h-6 w-6" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <ApperIcon 
            name={trend.direction === 'up' ? 'TrendingUp' : 'TrendingDown'} 
            className={`h-4 w-4 mr-1 ${trend.direction === 'up' ? 'text-success-600' : 'text-error-600'}`} 
          />
          <span className={`text-sm font-medium ${trend.direction === 'up' ? 'text-success-600' : 'text-error-600'}`}>
            {trend.value}
          </span>
          <span className="text-sm text-gray-500 ml-1">vs last month</span>
        </div>
      )}
    </Card>
  );
};

const ChartCard = ({ title, children }) => (
  <Card className="p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    {children}
  </Card>
);

const StageProgressBar = ({ stage, count, percentage, color }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium text-gray-700">{stage}</span>
      <span className="text-sm text-gray-500">{count} deals</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`bg-gradient-to-r ${color} h-2 rounded-full transition-all duration-300`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  </div>
);

const ReportsPage = ({ onMobileMenuToggle }) => {
  const [analytics, setAnalytics] = useState(null);
  const [lifecycleStats, setLifecycleStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const [analyticsData, lifecycleData] = await Promise.all([
          getAnalytics(),
          getContactLifecycleStats()
        ]);
        setAnalytics(analyticsData);
        setLifecycleStats(lifecycleData);
        setError(null);
      } catch (err) {
        console.error('Failed to load analytics:', err);
        setError('Failed to load analytics data');
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col">
        <Header 
          title="Reports" 
          onMobileMenuToggle={onMobileMenuToggle}
          showSearch={false}
        />
        <div className="flex-1 p-6">
          <Loading type="page" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col">
        <Header 
          title="Reports" 
          onMobileMenuToggle={onMobileMenuToggle}
          showSearch={false}
        />
        <div className="flex-1 p-6">
          <Card className="p-8 text-center">
            <ApperIcon name="AlertCircle" className="h-12 w-12 text-error-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Analytics</h3>
            <p className="text-gray-600">{error}</p>
          </Card>
        </div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const stageColors = {
    'Prospect': 'from-gray-400 to-gray-500',
    'Qualified': 'from-info-400 to-info-500',
    'Proposal': 'from-warning-400 to-warning-500',
    'Negotiation': 'from-accent-400 to-accent-500',
    'Closed Won': 'from-success-400 to-success-500',
    'Closed Lost': 'from-error-400 to-error-500'
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header 
        title="Reports" 
        onMobileMenuToggle={onMobileMenuToggle}
        showSearch={false}
      />

      <div className="flex-1 p-6 space-y-6">
        {/* KPI Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <MetricCard
            title="Total Contacts"
            value={analytics.totalContacts.toLocaleString()}
            icon="Users"
            color="info"
          />
          
          <MetricCard
            title="Active Deals"
            value={analytics.activeDeals.toLocaleString()}
            icon="Target"
            color="primary"
          />
          
          <MetricCard
            title="Pipeline Value"
            value={formatCurrency(analytics.pipelineValue)}
            icon="DollarSign"
            color="success"
          />
          
          <MetricCard
            title="Closed This Month"
            value={analytics.closedDealsThisMonth.toLocaleString()}
            subtitle={formatCurrency(analytics.closedDealsThisMonthValue)}
            icon="TrendingUp"
            color="accent"
          />
          
          <MetricCard
            title="Conversion Rate"
            value={formatPercentage(analytics.conversionRate)}
            icon="Percent"
            color="warning"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Deal Stage Distribution */}
          <ChartCard title="Deal Pipeline by Stage">
            <div className="space-y-4">
              {analytics.stageDistribution.map((stage, index) => {
                const totalDeals = analytics.stageDistribution.reduce((sum, s) => sum + s.count, 0);
                const percentage = totalDeals > 0 ? (stage.count / totalDeals) * 100 : 0;
                
                return (
                  <StageProgressBar
                    key={stage.stage}
                    stage={stage.stage}
                    count={stage.count}
                    percentage={percentage}
                    color={stageColors[stage.stage] || 'from-gray-400 to-gray-500'}
                  />
                );
              })}
            </div>
          </ChartCard>

          {/* Monthly Trend */}
          <ChartCard title="6-Month Deal Trend">
            <div className="space-y-4">
              {analytics.monthlyTrend.map((month, index) => (
                <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{month.month}</p>
                    <p className="text-sm text-gray-600">{month.deals} deals created</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(month.revenue)}</p>
                    <p className="text-sm text-success-600">{month.closedDeals} closed</p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Contact Lifecycle Distribution */}
        {lifecycleStats && (
          <ChartCard title="Contact Lifecycle Distribution">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {lifecycleStats.map((stat, index) => (
                <div key={stat.stage} className="text-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{stat.count}</div>
                  <div className="text-sm font-medium text-gray-600">{stat.stage}</div>
                  <div className="text-xs text-gray-500">{stat.percentage}%</div>
                </div>
              ))}
            </div>
          </ChartCard>
        )}

        {/* Quick Insights */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-r from-success-50 to-success-100 rounded-lg">
              <ApperIcon name="Trophy" className="h-8 w-8 text-success-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Top Performance</p>
              <p className="text-xs text-gray-600">
                {formatPercentage(analytics.conversionRate)} deal success rate
              </p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-r from-info-50 to-info-100 rounded-lg">
              <ApperIcon name="Activity" className="h-8 w-8 text-info-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Active Pipeline</p>
              <p className="text-xs text-gray-600">
                {analytics.activeDeals} deals worth {formatCurrency(analytics.pipelineValue)}
              </p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-r from-accent-50 to-accent-100 rounded-lg">
              <ApperIcon name="Calendar" className="h-8 w-8 text-accent-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">This Month</p>
              <p className="text-xs text-gray-600">
                {analytics.closedDealsThisMonth} deals closed for {formatCurrency(analytics.closedDealsThisMonthValue)}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;