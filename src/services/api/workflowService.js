import workflowsData from '@/services/mockData/workflows.json';

let workflows = [...workflowsData];
let nextId = Math.max(...workflows.map(w => w.Id)) + 1;

export const workflowService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...workflows];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const workflow = workflows.find(w => w.Id === parseInt(id));
    if (!workflow) {
      throw new Error('Workflow not found');
    }
    return { ...workflow };
  },

  async create(workflowData) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newWorkflow = {
      Id: nextId++,
      name: workflowData.name,
      description: workflowData.description || '',
      isActive: workflowData.isActive || true,
      trigger: workflowData.trigger || { type: 'contact_created' },
      actions: workflowData.actions || [],
      nodes: workflowData.nodes || [],
      connections: workflowData.connections || [],
      executionCount: 0,
      successRate: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      executionHistory: []
    };

    workflows.push(newWorkflow);
    return { ...newWorkflow };
  },

  async update(id, workflowData) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = workflows.findIndex(w => w.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Workflow not found');
    }

    workflows[index] = {
      ...workflows[index],
      ...workflowData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };

    return { ...workflows[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = workflows.findIndex(w => w.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Workflow not found');
    }

    workflows.splice(index, 1);
    return true;
  },

  async execute(id, context = {}) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const workflow = workflows.find(w => w.Id === parseInt(id));
    if (!workflow || !workflow.isActive) {
      throw new Error('Workflow not found or inactive');
    }

    // Simulate workflow execution
    const execution = {
      id: Date.now(),
      workflowId: workflow.Id,
      status: 'completed',
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      context,
      results: workflow.actions.map(action => ({
        action: action.type,
        status: 'success',
        message: `${action.type} executed successfully`
      }))
    };

    // Update workflow execution count
    workflow.executionCount = (workflow.executionCount || 0) + 1;
    workflow.executionHistory = workflow.executionHistory || [];
    workflow.executionHistory.unshift(execution);

    // Keep only last 100 executions
    if (workflow.executionHistory.length > 100) {
      workflow.executionHistory = workflow.executionHistory.slice(0, 100);
    }

    return execution;
  },

  async getExecutionHistory(id, limit = 50) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const workflow = workflows.find(w => w.Id === parseInt(id));
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    return workflow.executionHistory?.slice(0, limit) || [];
  },

  async getAnalytics(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const workflow = workflows.find(w => w.Id === parseInt(id));
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    const history = workflow.executionHistory || [];
    const totalExecutions = history.length;
    const successfulExecutions = history.filter(h => h.status === 'completed').length;
    const failedExecutions = totalExecutions - successfulExecutions;
    
    // Generate daily execution data for the last 30 days
    const dailyData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayExecutions = history.filter(h => {
        const execDate = new Date(h.startedAt);
        return execDate.toDateString() === date.toDateString();
      }).length;
      
      dailyData.push({
        date: date.toISOString().split('T')[0],
        executions: dayExecutions
      });
    }

    return {
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      successRate: totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 100,
      averageExecutionTime: 2.5, // Mock average execution time in seconds
      dailyExecutions: dailyData
    };
  }
};