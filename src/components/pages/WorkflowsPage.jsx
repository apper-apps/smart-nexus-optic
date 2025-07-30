import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import WorkflowBuilder from '@/components/organisms/WorkflowBuilder';
import WorkflowForm from '@/components/organisms/WorkflowForm';
import WorkflowExecutionHistory from '@/components/organisms/WorkflowExecutionHistory';
import { workflowService } from '@/services/api/workflowService';

export default function WorkflowsPage({ onMobileMenuToggle }) {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedWorkflows, setSelectedWorkflows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState(null);
  const [builderWorkflow, setBuilderWorkflow] = useState(null);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workflowService.getAll();
      setWorkflows(data);
    } catch (err) {
      setError('Failed to load workflows');
      toast.error('Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingWorkflow(null);
    setShowForm(true);
  };

  const handleEdit = (workflow) => {
    setEditingWorkflow(workflow);
    setShowForm(true);
  };

  const handleEditBuilder = (workflow) => {
    setBuilderWorkflow(workflow);
    setShowBuilder(true);
  };

  const handleViewHistory = (workflow) => {
    setBuilderWorkflow(workflow);
    setShowHistory(true);
  };

  const handleSave = async (workflowData) => {
    try {
      if (editingWorkflow) {
        await workflowService.update(editingWorkflow.Id, workflowData);
        toast.success('Workflow updated successfully');
      } else {
        await workflowService.create(workflowData);
        toast.success('Workflow created successfully');
      }
      setShowForm(false);
      setEditingWorkflow(null);
      loadWorkflows();
    } catch (err) {
      toast.error('Failed to save workflow');
    }
  };

  const handleSaveBuilder = async (workflowData) => {
    try {
      await workflowService.update(builderWorkflow.Id, workflowData);
      toast.success('Workflow updated successfully');
      setShowBuilder(false);
      setBuilderWorkflow(null);
      loadWorkflows();
    } catch (err) {
      toast.error('Failed to save workflow');
    }
  };

  const handleDelete = async (workflow) => {
    if (!confirm(`Delete workflow "${workflow.name}"?`)) return;
    
    try {
      await workflowService.delete(workflow.Id);
      toast.success('Workflow deleted successfully');
      loadWorkflows();
    } catch (err) {
      toast.error('Failed to delete workflow');
    }
  };

  const handleToggleStatus = async (workflow) => {
    try {
      await workflowService.update(workflow.Id, {
        ...workflow,
        isActive: !workflow.isActive
      });
      toast.success(`Workflow ${workflow.isActive ? 'deactivated' : 'activated'}`);
      loadWorkflows();
    } catch (err) {
      toast.error('Failed to update workflow status');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedWorkflows.length === 0) {
      toast.warning('Please select workflows first');
      return;
    }

    try {
      if (action === 'activate') {
        for (const id of selectedWorkflows) {
          const workflow = workflows.find(w => w.Id === id);
          if (workflow && !workflow.isActive) {
            await workflowService.update(id, { ...workflow, isActive: true });
          }
        }
        toast.success(`${selectedWorkflows.length} workflows activated`);
      } else if (action === 'deactivate') {
        for (const id of selectedWorkflows) {
          const workflow = workflows.find(w => w.Id === id);
          if (workflow && workflow.isActive) {
            await workflowService.update(id, { ...workflow, isActive: false });
          }
        }
        toast.success(`${selectedWorkflows.length} workflows deactivated`);
      } else if (action === 'delete') {
        if (!confirm(`Delete ${selectedWorkflows.length} workflows?`)) return;
        for (const id of selectedWorkflows) {
          await workflowService.delete(id);
        }
        toast.success(`${selectedWorkflows.length} workflows deleted`);
      }
      setSelectedWorkflows([]);
      loadWorkflows();
    } catch (err) {
      toast.error('Failed to perform bulk action');
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && workflow.isActive) ||
                         (statusFilter === 'inactive' && !workflow.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = () => {
    if (selectedWorkflows.length === filteredWorkflows.length) {
      setSelectedWorkflows([]);
    } else {
      setSelectedWorkflows(filteredWorkflows.map(w => w.Id));
    }
  };

  const handleSelectWorkflow = (workflowId) => {
    setSelectedWorkflows(prev => 
      prev.includes(workflowId) 
        ? prev.filter(id => id !== workflowId)
        : [...prev, workflowId]
    );
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="Menu" size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Workflows</h1>
              <p className="text-sm text-gray-600 mt-1">
                Automate your business processes with visual workflows
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowHistory(true)}
              className="hidden sm:flex"
            >
              <ApperIcon name="History" size={16} className="mr-2" />
              Execution History
            </Button>
            <Button onClick={handleCreate}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Create Workflow
            </Button>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex-1 max-w-sm">
              <Input
                type="text"
                placeholder="Search workflows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon="Search"
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-48"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </div>
          
          {selectedWorkflows.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {selectedWorkflows.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('activate')}
              >
                Activate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('deactivate')}
              >
                Deactivate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('delete')}
                className="text-red-600 hover:text-red-700"
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {filteredWorkflows.length === 0 ? (
          <Empty
            title="No workflows found"
            description="Create your first workflow to automate your business processes"
            action={
              <Button onClick={handleCreate}>
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Create Workflow
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {/* Select All */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedWorkflows.length === filteredWorkflows.length}
                onChange={handleSelectAll}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Select all ({filteredWorkflows.length})
              </label>
            </div>

            {/* Workflow List */}
            <div className="grid gap-4">
              {filteredWorkflows.map((workflow) => (
                <Card key={workflow.Id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedWorkflows.includes(workflow.Id)}
                        onChange={() => handleSelectWorkflow(workflow.Id)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {workflow.name}
                          </h3>
                          <Badge
                            variant={workflow.isActive ? "success" : "secondary"}
                          >
                            {workflow.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        {workflow.description && (
                          <p className="text-gray-600 mb-3">{workflow.description}</p>
                        )}
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center">
                            <ApperIcon name="Zap" size={14} className="mr-1" />
                            {workflow.trigger.type}
                          </div>
                          <div className="flex items-center">
                            <ApperIcon name="PlayCircle" size={14} className="mr-1" />
                            {workflow.actions.length} actions
                          </div>
                          <div className="flex items-center">
                            <ApperIcon name="BarChart3" size={14} className="mr-1" />
                            {workflow.executionCount || 0} executions
                          </div>
                          <div className="flex items-center">
                            <ApperIcon name="Calendar" size={14} className="mr-1" />
                            {new Date(workflow.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewHistory(workflow)}
                      >
                        <ApperIcon name="History" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditBuilder(workflow)}
                      >
                        <ApperIcon name="GitBranch" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(workflow)}
                      >
                        <ApperIcon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(workflow)}
                      >
                        <ApperIcon 
                          name={workflow.isActive ? "Pause" : "Play"} 
                          size={16} 
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(workflow)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <WorkflowForm
          workflow={editingWorkflow}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingWorkflow(null);
          }}
        />
      )}

      {showBuilder && builderWorkflow && (
        <WorkflowBuilder
          workflow={builderWorkflow}
          onSave={handleSaveBuilder}
          onClose={() => {
            setShowBuilder(false);
            setBuilderWorkflow(null);
          }}
        />
      )}

      {showHistory && (
        <WorkflowExecutionHistory
          workflow={builderWorkflow}
          onClose={() => {
            setShowHistory(false);
            setBuilderWorkflow(null);
          }}
        />
      )}
    </div>
  );
}