import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { workflowService } from '@/services/api/workflowService';

export default function WorkflowExecutionHistory({ workflow, onClose }) {
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('history');

  useEffect(() => {
    if (workflow) {
      loadData();
    }
  }, [workflow]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [historyData, analyticsData] = await Promise.all([
        workflowService.getExecutionHistory(workflow.Id),
        workflowService.getAnalytics(workflow.Id)
      ]);
      
      setHistory(historyData);
      setAnalytics(analyticsData);
    } catch (err) {
      setError('Failed to load execution data');
      toast.error('Failed to load execution data');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (startTime, endTime) => {
    const duration = new Date(endTime) - new Date(startTime);
    return `${(duration / 1000).toFixed(1)}s`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'failed': return 'error';
      case 'running': return 'info';
      default: return 'secondary';
    }
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <Card className="w-full max-w-4xl max-h-[90vh] p-8">
        <Loading />
      </Card>
    </div>
  );

  if (error) return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <Card className="w-full max-w-4xl max-h-[90vh] p-8">
        <Error message={error} />
      </Card>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {workflow?.name} - Execution History
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              View execution history and performance analytics
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex px-6">
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'history'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Execution History
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'analytics'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'history' && (
            <div className="space-y-4">
              {history.length === 0 ? (
                <Empty
                  title="No executions yet"
                  description="This workflow hasn't been executed yet"
                />
              ) : (
                history.map((execution) => (
                  <Card key={execution.id} className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Badge variant={getStatusColor(execution.status)}>
                          {execution.status}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {new Date(execution.startedAt).toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          Duration: {formatDuration(execution.startedAt, execution.completedAt)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {execution.id}
                      </div>
                    </div>

                    {/* Context */}
                    {execution.context && Object.keys(execution.context).length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Context:</h4>
                        <div className="bg-gray-50 rounded-lg p-3 text-sm">
                          {Object.entries(execution.context).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600">{key}:</span>
                              <span className="text-gray-900">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Results */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Actions:</h4>
                      <div className="space-y-2">
                        {execution.results?.map((result, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-3">
                              <ApperIcon
                                name={result.status === 'success' ? 'CheckCircle' : 'XCircle'}
                                size={16}
                                className={result.status === 'success' ? 'text-green-500' : 'text-red-500'}
                              />
                              <span className="text-sm font-medium">{result.action}</span>
                            </div>
                            <span className="text-sm text-gray-600">{result.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === 'analytics' && analytics && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {analytics.totalExecutions}
                  </div>
                  <div className="text-sm text-gray-600">Total Executions</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-success-600">
                    {analytics.successfulExecutions}
                  </div>
                  <div className="text-sm text-gray-600">Successful</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-error-600">
                    {analytics.failedExecutions}
                  </div>
                  <div className="text-sm text-gray-600">Failed</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-info-600">
                    {analytics.successRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </Card>
              </div>

              {/* Daily Executions Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Daily Executions (Last 30 Days)</h3>
                <div className="h-64 flex items-end space-x-1">
                  {analytics.dailyExecutions.map((day, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-primary-200 rounded-t hover:bg-primary-300 transition-colors relative group"
                      style={{
                        height: `${Math.max((day.executions / Math.max(...analytics.dailyExecutions.map(d => d.executions))) * 100, 2)}%`
                      }}
                    >
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {new Date(day.date).toLocaleDateString()}: {day.executions} executions
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>30 days ago</span>
                  <span>Today</span>
                </div>
              </Card>

              {/* Performance Metrics */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Execution Time</span>
                    <span className="font-semibold">{analytics.averageExecutionTime}s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Success Rate</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-success-500 h-2 rounded-full"
                          style={{ width: `${analytics.successRate}%` }}
                        />
                      </div>
                      <span className="font-semibold">{analytics.successRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}