import React, { useState, useRef } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

export default function WorkflowNode({
  node,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDrag,
  onConnect,
  triggerTypes,
  actionTypes
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const nodeRef = useRef(null);

  const nodeInfo = node.type === 'trigger' 
    ? triggerTypes.find(t => t.value === node.subType)
    : actionTypes.find(a => a.value === node.subType);

  const handleMouseDown = (e) => {
    if (e.target.closest('.node-action')) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - node.x,
      y: e.clientY - node.y
    });
    onSelect();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    onDrag(node.id, Math.max(0, newX), Math.max(0, newY));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const borderColor = node.type === 'trigger' ? 'border-primary-300' : 'border-secondary-300';
  const iconColor = node.type === 'trigger' ? 'text-primary-600' : 'text-secondary-600';
  const bgColor = node.type === 'trigger' ? 'bg-primary-50' : 'bg-secondary-50';

  return (
    <div
      ref={nodeRef}
      className={`absolute cursor-move select-none ${isDragging ? 'z-10' : ''}`}
      style={{ left: node.x, top: node.y }}
      onMouseDown={handleMouseDown}
    >
      <Card
        className={`w-48 p-4 border-2 transition-all duration-200 ${
          isSelected ? `${borderColor} shadow-lg` : 'border-gray-200 hover:border-gray-300'
        } ${bgColor}`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <ApperIcon
              name={nodeInfo?.icon || 'Circle'}
              size={16}
              className={`mr-2 ${iconColor}`}
            />
            <span className="text-sm font-medium text-gray-900">
              {nodeInfo?.label || node.subType}
            </span>
          </div>
          <button
            className="node-action p-1 text-gray-400 hover:text-red-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <ApperIcon name="X" size={12} />
          </button>
        </div>

        {/* Node Configuration Summary */}
        <div className="text-xs text-gray-600 space-y-1">
          {node.config?.subject && (
            <div>Subject: {node.config.subject}</div>
          )}
          {node.config?.title && (
            <div>Title: {node.config.title}</div>
          )}
          {node.config?.property && (
            <div>Property: {node.config.property}</div>
          )}
          {node.config?.assignee && (
            <div>Assignee: {node.config.assignee}</div>
          )}
        </div>

        {/* Connection Points */}
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded-full cursor-pointer hover:border-primary-500 transition-colors" />
        </div>
        
        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded-full cursor-pointer hover:border-primary-500 transition-colors" />
        </div>
      </Card>
    </div>
  );
}