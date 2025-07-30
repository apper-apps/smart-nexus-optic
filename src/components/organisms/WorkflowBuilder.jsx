import React, { useState, useRef, useCallback } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import WorkflowNode from '@/components/organisms/WorkflowNode';

export default function WorkflowBuilder({ workflow, onSave, onClose }) {
  const [nodes, setNodes] = useState(workflow?.nodes || []);
  const [connections, setConnections] = useState(workflow?.connections || []);
  const [selectedNode, setSelectedNode] = useState(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const [workflowName, setWorkflowName] = useState(workflow?.name || '');
  const [workflowDescription, setWorkflowDescription] = useState(workflow?.description || '');
  const canvasRef = useRef(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

  const triggerTypes = [
    { value: 'contact_created', label: 'Contact Created', icon: 'UserPlus' },
    { value: 'form_submitted', label: 'Form Submitted', icon: 'FileText' },
    { value: 'email_opened', label: 'Email Opened', icon: 'Mail' },
    { value: 'email_clicked', label: 'Email Clicked', icon: 'MousePointer' },
    { value: 'deal_stage_changed', label: 'Deal Stage Changed', icon: 'TrendingUp' }
  ];

  const actionTypes = [
    { value: 'send_email', label: 'Send Email', icon: 'Send' },
    { value: 'create_task', label: 'Create Task', icon: 'CheckSquare' },
    { value: 'update_contact', label: 'Update Contact', icon: 'UserEdit' },
    { value: 'add_to_list', label: 'Add to List', icon: 'List' },
    { value: 'assign_team_member', label: 'Assign Team Member', icon: 'Users' },
    { value: 'create_deal', label: 'Create Deal', icon: 'DollarSign' }
  ];

  const addNode = useCallback((type, nodeType) => {
    const newNode = {
      id: `node_${Date.now()}`,
      type: nodeType,
      subType: type,
      x: 100 + nodes.length * 50,
      y: 100 + nodes.length * 50,
      config: {}
    };
    setNodes(prev => [...prev, newNode]);
  }, [nodes.length]);

  const updateNode = useCallback((nodeId, updates) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ));
  }, []);

  const deleteNode = useCallback((nodeId) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setConnections(prev => prev.filter(conn => 
      conn.from !== nodeId && conn.to !== nodeId
    ));
  }, []);

  const connectNodes = useCallback((fromId, toId) => {
    const existingConnection = connections.find(conn => 
      conn.from === fromId && conn.to === toId
    );
    if (!existingConnection) {
      setConnections(prev => [...prev, { from: fromId, to: toId }]);
    }
  }, [connections]);

  const handleNodeDrag = useCallback((nodeId, x, y) => {
    updateNode(nodeId, { x, y });
  }, [updateNode]);

  const handleCanvasClick = useCallback((e) => {
    if (e.target === canvasRef.current) {
      setSelectedNode(null);
    }
  }, []);

  const handleSave = () => {
    if (!workflowName.trim()) {
      alert('Please enter a workflow name');
      return;
    }

    const workflowData = {
      ...workflow,
      name: workflowName,
      description: workflowDescription,
      nodes,
      connections,
      trigger: nodes.find(n => n.type === 'trigger') || { type: 'contact_created' },
      actions: nodes.filter(n => n.type === 'action').map(n => ({
        type: n.subType,
        config: n.config
      }))
    };

    onSave(workflowData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full h-full max-w-7xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="Workflow name"
              className="text-xl font-semibold border-none p-0 focus:ring-0"
            />
            <Input
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              placeholder="Description (optional)"
              className="text-sm text-gray-600 border-none p-0 focus:ring-0 mt-1"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Workflow
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
            <div className="space-y-6">
              {/* Triggers */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Triggers</h3>
                <div className="space-y-2">
                  {triggerTypes.map((trigger) => (
                    <button
                      key={trigger.value}
                      onClick={() => addNode(trigger.value, 'trigger')}
                      className="w-full flex items-center p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-colors"
                    >
                      <ApperIcon name={trigger.icon} size={16} className="mr-3 text-primary-600" />
                      <span className="text-sm">{trigger.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Actions</h3>
                <div className="space-y-2">
                  {actionTypes.map((action) => (
                    <button
                      key={action.value}
                      onClick={() => addNode(action.value, 'action')}
                      className="w-full flex items-center p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-secondary-300 transition-colors"
                    >
                      <ApperIcon name={action.icon} size={16} className="mr-3 text-secondary-600" />
                      <span className="text-sm">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative overflow-hidden">
            <div
              ref={canvasRef}
              className="w-full h-full bg-gray-100 relative overflow-auto"
              onClick={handleCanvasClick}
              style={{
                backgroundImage: `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}
            >
              {/* Connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {connections.map((connection, index) => {
                  const fromNode = nodes.find(n => n.id === connection.from);
                  const toNode = nodes.find(n => n.id === connection.to);
                  if (!fromNode || !toNode) return null;

                  const x1 = fromNode.x + 100;
                  const y1 = fromNode.y + 40;
                  const x2 = toNode.x;
                  const y2 = toNode.y + 40;

                  return (
                    <line
                      key={index}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#4f46e5"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                  );
                })}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="#4f46e5"
                    />
                  </marker>
                </defs>
              </svg>

              {/* Nodes */}
              {nodes.map((node) => (
                <WorkflowNode
                  key={node.id}
                  node={node}
                  isSelected={selectedNode === node.id}
                  onSelect={() => setSelectedNode(node.id)}
                  onUpdate={(updates) => updateNode(node.id, updates)}
                  onDelete={() => deleteNode(node.id)}
                  onDrag={handleNodeDrag}
                  onConnect={(targetId) => connectNodes(node.id, targetId)}
                  triggerTypes={triggerTypes}
                  actionTypes={actionTypes}
                />
              ))}

              {/* Instructions */}
              {nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <ApperIcon name="GitBranch" size={48} className="mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">Start Building Your Workflow</h3>
                    <p className="text-sm">
                      Add triggers and actions from the sidebar to create your automation
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Node Configuration Panel */}
        {selectedNode && (
          <div className="border-t border-gray-200 bg-white p-6">
            <WorkflowNodeConfig
              node={nodes.find(n => n.id === selectedNode)}
              onUpdate={(config) => updateNode(selectedNode, { config })}
              triggerTypes={triggerTypes}
              actionTypes={actionTypes}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function WorkflowNodeConfig({ node, onUpdate, triggerTypes, actionTypes }) {
  if (!node) return null;

  const nodeInfo = node.type === 'trigger' 
    ? triggerTypes.find(t => t.value === node.subType)
    : actionTypes.find(a => a.value === node.subType);

  const handleConfigChange = (key, value) => {
    onUpdate({
      ...node.config,
      [key]: value
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <ApperIcon name={nodeInfo?.icon} size={20} className="mr-2" />
        Configure {nodeInfo?.label}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {node.subType === 'send_email' && (
          <>
            <Input
              label="Subject"
              value={node.config.subject || ''}
              onChange={(e) => handleConfigChange('subject', e.target.value)}
              placeholder="Email subject"
            />
            <Select
              label="Template"
              value={node.config.template || ''}
              onChange={(e) => handleConfigChange('template', e.target.value)}
            >
              <option value="">Select template</option>
              <option value="welcome">Welcome Email</option>
              <option value="follow_up">Follow-up Email</option>
              <option value="promotion">Promotional Email</option>
            </Select>
          </>
        )}

        {node.subType === 'create_task' && (
          <>
            <Input
              label="Task Title"
              value={node.config.title || ''}
              onChange={(e) => handleConfigChange('title', e.target.value)}
              placeholder="Task title"
            />
            <Select
              label="Priority"
              value={node.config.priority || 'medium'}
              onChange={(e) => handleConfigChange('priority', e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </>
        )}

        {node.subType === 'update_contact' && (
          <>
            <Select
              label="Property"
              value={node.config.property || ''}
              onChange={(e) => handleConfigChange('property', e.target.value)}
            >
              <option value="">Select property</option>
              <option value="lifecycle">Lifecycle Stage</option>
              <option value="score">Lead Score</option>
              <option value="status">Status</option>
            </Select>
            <Input
              label="Value"
              value={node.config.value || ''}
              onChange={(e) => handleConfigChange('value', e.target.value)}
              placeholder="New value"
            />
          </>
        )}

        {node.subType === 'assign_team_member' && (
          <Select
            label="Team Member"
            value={node.config.assignee || ''}
            onChange={(e) => handleConfigChange('assignee', e.target.value)}
          >
            <option value="">Select team member</option>
            <option value="john">John Smith</option>
            <option value="sarah">Sarah Johnson</option>
            <option value="mike">Mike Davis</option>
          </Select>
        )}
      </div>
    </div>
  );
}