import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import { getAnalytics, getContactLifecycleStats, getLeadSourceStats, getSalesRepPerformance, getCampaignPerformance } from "@/services/api/analyticsService";
import { toast } from "react-toastify";
import Chart from "react-apexcharts";
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
  const [leadSourceStats, setLeadSourceStats] = useState(null);
  const [salesRepPerformance, setSalesRepPerformance] = useState(null);
  const [campaignPerformance, setCampaignPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const [analyticsData, lifecycleData, leadSourceData, salesRepData, campaignData] = await Promise.all([
          getAnalytics(),
          getContactLifecycleStats(),
          getLeadSourceStats(),
          getSalesRepPerformance(),
          getCampaignPerformance()
        ]);
        setAnalytics(analyticsData);
        setLifecycleStats(lifecycleData);
        setLeadSourceStats(leadSourceData);
        setSalesRepPerformance(salesRepData);
        setCampaignPerformance(campaignData);
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

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pipeline by Stage - Horizontal Bar Chart */}
          <ChartCard title="Pipeline by Stage">
            <Chart
              options={{
                chart: {
                  type: 'bar',
                  toolbar: { show: false },
                  fontFamily: 'Inter, system-ui, sans-serif'
                },
                plotOptions: {
                  bar: {
                    horizontal: true,
                    borderRadius: 4,
                    dataLabels: { position: 'top' }
                  }
                },
                dataLabels: {
                  enabled: true,
                  formatter: (val) => `${val} deals`,
                  offsetX: 10,
                  style: { fontSize: '12px', fontWeight: 600 }
                },
                colors: ['#4f46e5', '#059669', '#f59e0b', '#ec4899', '#10b981', '#ef4444'],
                xaxis: {
                  categories: analytics.stageDistribution.map(s => s.stage),
                  labels: { style: { fontSize: '12px' } }
                },
                yaxis: {
                  labels: { style: { fontSize: '12px' } }
                },
                grid: { show: false },
                tooltip: {
                  y: {
                    formatter: (val) => `${val} deals`
                  }
                }
              }}
              series={[{
                name: 'Deals',
                data: analytics.stageDistribution.map(s => s.count)
              }]}
              type="bar"
              height={300}
            />
          </ChartCard>

          {/* Deals Closed Over Time - Line Chart */}
          <ChartCard title="Deals Closed Over Time">
            <Chart
              options={{
                chart: {
                  type: 'line',
                  toolbar: { show: false },
                  fontFamily: 'Inter, system-ui, sans-serif'
                },
                stroke: {
                  curve: 'smooth',
                  width: 3
                },
                colors: ['#10b981'],
                xaxis: {
                  categories: analytics.monthlyTrend.map(m => m.month),
                  labels: { style: { fontSize: '12px' } }
                },
                yaxis: {
                  labels: { style: { fontSize: '12px' } }
                },
                grid: {
                  borderColor: '#f1f5f9',
                  strokeDashArray: 3
                },
                tooltip: {
                  y: {
                    formatter: (val) => `${val} deals closed`
                  }
                },
                markers: {
                  size: 6,
                  colors: ['#10b981'],
                  strokeWidth: 2,
                  hover: { size: 8 }
                }
              }}
              series={[{
                name: 'Closed Deals',
                data: analytics.monthlyTrend.map(m => m.closedDeals)
              }]}
              type="line"
              height={300}
            />
          </ChartCard>
        </div>

        {/* Secondary Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lead Sources - Pie Chart */}
          {leadSourceStats && (
            <ChartCard title="Lead Sources Distribution">
              <Chart
                options={{
                  chart: {
                    type: 'pie',
                    fontFamily: 'Inter, system-ui, sans-serif'
                  },
                  labels: leadSourceStats.map(s => s.source),
                  colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6'],
                  legend: {
                    position: 'bottom',
                    fontSize: '12px'
                  },
                  tooltip: {
                    y: {
                      formatter: (val) => `${val} contacts`
                    }
                  },
                  dataLabels: {
                    enabled: true,
                    formatter: (val) => `${val.toFixed(1)}%`,
                    style: { fontSize: '12px', fontWeight: 600 }
                  }
                }}
                series={leadSourceStats.map(s => s.count)}
                type="pie"
                height={300}
              />
            </ChartCard>
          )}

          {/* Sales Performance by Rep - Column Chart */}
          {salesRepPerformance && (
            <ChartCard title="Sales Performance by Rep">
              <Chart
                options={{
                  chart: {
                    type: 'column',
                    toolbar: { show: false },
                    fontFamily: 'Inter, system-ui, sans-serif'
                  },
                  plotOptions: {
                    bar: {
                      borderRadius: 4,
                      columnWidth: '60%'
                    }
                  },
                  colors: ['#4f46e5', '#10b981'],
                  xaxis: {
                    categories: salesRepPerformance.map(r => r.name),
                    labels: { 
                      style: { fontSize: '12px' },
                      rotate: -45
                    }
                  },
                  yaxis: [
                    {
                      title: { text: 'Deals Closed', style: { fontSize: '12px' } },
                      labels: { style: { fontSize: '12px' } }
                    },
                    {
                      opposite: true,
                      title: { text: 'Revenue ($)', style: { fontSize: '12px' } },
                      labels: { 
                        style: { fontSize: '12px' },
                        formatter: (val) => `$${(val/1000).toFixed(0)}K`
                      }
                    }
                  ],
                  legend: {
                    position: 'top',
                    fontSize: '12px'
                  },
                  grid: {
                    borderColor: '#f1f5f9',
                    strokeDashArray: 3
                  }
                }}
                series={[
                  {
                    name: 'Deals Closed',
                    data: salesRepPerformance.map(r => r.closedDeals)
                  },
                  {
                    name: 'Revenue',
                    data: salesRepPerformance.map(r => r.revenue),
                    yAxisIndex: 1
                  }
                ]}
                type="bar"
                height={300}
              />
            </ChartCard>
          )}
        </div>

        {/* Contact Lifecycle Distribution */}
        {lifecycleStats && (
          <ChartCard title="Contact Lifecycle Distribution">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {lifecycleStats.map((stat, index) => (
                <div key={stat.stage} className="text-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-shadow">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.count}</div>
                  <div className="text-sm font-medium text-gray-700 mb-1">{stat.stage}</div>
                  <div className="text-xs text-gray-500">{stat.percentage}%</div>
                </div>
              ))}
            </div>
          </ChartCard>
        )}

        {/* Email Campaign Performance Summary */}
        {campaignPerformance && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Campaign Performance Overview">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
                  <div className="text-2xl font-bold text-primary-700">{campaignPerformance.totalCampaigns}</div>
                  <div className="text-sm font-medium text-gray-600">Total Campaigns</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-success-50 to-success-100 rounded-lg">
                  <div className="text-2xl font-bold text-success-700">{campaignPerformance.activeCampaigns}</div>
                  <div className="text-sm font-medium text-gray-600">Active Campaigns</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-info-50 to-info-100 rounded-lg">
                  <div className="text-2xl font-bold text-info-700">{campaignPerformance.totalSent.toLocaleString()}</div>
                  <div className="text-sm font-medium text-gray-600">Emails Sent</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-accent-50 to-accent-100 rounded-lg">
                  <div className="text-2xl font-bold text-accent-700">{campaignPerformance.avgOpenRate}%</div>
                  <div className="text-sm font-medium text-gray-600">Avg Open Rate</div>
                </div>
              </div>
            </ChartCard>

            <ChartCard title="Campaign Engagement Metrics">
              <Chart
                options={{
                  chart: {
                    type: 'donut',
                    fontFamily: 'Inter, system-ui, sans-serif'
                  },
                  labels: ['Opened', 'Clicked', 'Unopened'],
                  colors: ['#10b981', '#4f46e5', '#e5e7eb'],
                  legend: {
                    position: 'bottom',
                    fontSize: '12px'
                  },
                  tooltip: {
                    y: {
                      formatter: (val) => `${val.toLocaleString()} emails`
                    }
                  },
                  dataLabels: {
                    enabled: true,
                    formatter: (val) => `${val.toFixed(1)}%`,
                    style: { fontSize: '12px', fontWeight: 600 }
                  },
                  plotOptions: {
                    pie: {
                      donut: {
                        size: '70%',
                        labels: {
                          show: true,
                          total: {
                            show: true,
                            label: 'Total Sent',
                            formatter: () => campaignPerformance.totalSent.toLocaleString()
                          }
                        }
                      }
                    }
                  }
                }}
                series={[
                  campaignPerformance.totalOpened,
                  campaignPerformance.totalClicked,
                  campaignPerformance.totalSent - campaignPerformance.totalOpened
                ]}
                type="donut"
                height={300}
              />
            </ChartCard>
          </div>
        )}

        {/* Quick Insights */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-r from-success-50 to-success-100 rounded-lg hover:shadow-md transition-shadow">
              <ApperIcon name="Trophy" className="h-8 w-8 text-success-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Deal Success Rate</p>
              <p className="text-xs text-gray-600">
                {formatPercentage(analytics.conversionRate)} conversion rate
              </p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-r from-info-50 to-info-100 rounded-lg hover:shadow-md transition-shadow">
              <ApperIcon name="Activity" className="h-8 w-8 text-info-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Active Pipeline</p>
              <p className="text-xs text-gray-600">
                {analytics.activeDeals} deals worth {formatCurrency(analytics.pipelineValue)}
              </p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-r from-accent-50 to-accent-100 rounded-lg hover:shadow-md transition-shadow">
              <ApperIcon name="Mail" className="h-8 w-8 text-accent-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Email Performance</p>
              <p className="text-xs text-gray-600">
                {campaignPerformance?.avgOpenRate || 0}% open rate, {campaignPerformance?.avgClickRate || 0}% click rate
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;