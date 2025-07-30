import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import TextBlock from '@/components/organisms/TextBlock';
import ImageBlock from '@/components/organisms/ImageBlock';
import EmailPreview from '@/components/organisms/EmailPreview';
import { toast } from 'react-toastify';

const EmailBuilder = ({ emailContent, onSave, onClose }) => {
  const [content, setContent] = useState(emailContent);
  const [activeTab, setActiveTab] = useState('design');
  const [selectedBlockId, setSelectedBlockId] = useState(null);

  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // Adding new block from toolbar
    if (source.droppableId === 'toolbar' && destination.droppableId === 'canvas') {
      const blockType = draggableId.replace('toolbar-', '');
      const newBlock = {
        id: `block-${Date.now()}`,
        type: blockType,
        data: blockType === 'text' 
          ? { content: 'Click to edit text...', fontSize: 16, color: '#333333', textAlign: 'left', fontWeight: 'normal' }
          : { src: '', alt: 'Image', width: '100%', alignment: 'center' }
      };

      const newBlocks = [...content.blocks];
      newBlocks.splice(destination.index, 0, newBlock);
      
      setContent({ ...content, blocks: newBlocks });
      setSelectedBlockId(newBlock.id);
      return;
    }

    // Reordering existing blocks
    if (source.droppableId === 'canvas' && destination.droppableId === 'canvas') {
      const newBlocks = Array.from(content.blocks);
      const [reorderedItem] = newBlocks.splice(source.index, 1);
      newBlocks.splice(destination.index, 0, reorderedItem);
      
      setContent({ ...content, blocks: newBlocks });
    }
  }, [content]);

  const updateBlock = useCallback((blockId, newData) => {
    const newBlocks = content.blocks.map(block => 
      block.id === blockId ? { ...block, data: { ...block.data, ...newData } } : block
    );
    setContent({ ...content, blocks: newBlocks });
  }, [content]);

  const deleteBlock = useCallback((blockId) => {
    const newBlocks = content.blocks.filter(block => block.id !== blockId);
    setContent({ ...content, blocks: newBlocks });
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  }, [content, selectedBlockId]);

  const updateSettings = useCallback((newSettings) => {
    setContent({ ...content, settings: { ...content.settings, ...newSettings } });
  }, [content]);

  const handleSave = () => {
    if (content.blocks.length === 0) {
      toast.error('Please add at least one block to your email');
      return;
    }
    onSave(content);
  };

  const selectedBlock = content.blocks.find(block => block.id === selectedBlockId);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onClose}>
              <ApperIcon name="ArrowLeft" size={20} />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Email Builder</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={activeTab === 'design' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('design')}
            >
              <ApperIcon name="Layout" size={16} className="mr-2" />
              Design
            </Button>
            <Button
              variant={activeTab === 'preview' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('preview')}
            >
              <ApperIcon name="Eye" size={16} className="mr-2" />
              Preview
            </Button>
            <div className="w-px h-6 bg-gray-300 mx-2" />
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white"
            >
              <ApperIcon name="Save" size={16} className="mr-2" />
              Save Design
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'design' ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            {/* Left Sidebar - Toolbar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
              <div className="space-y-6">
                {/* Block Types */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Content Blocks</h3>
                  <Droppable droppableId="toolbar" isDropDisabled={true}>
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        <Draggable draggableId="toolbar-text" index={0}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 bg-white border border-gray-200 rounded-lg cursor-grab hover:shadow-md transition-shadow ${
                                snapshot.isDragging ? 'shadow-lg' : ''
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <ApperIcon name="Type" size={20} className="text-gray-600" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">Text Block</div>
                                  <div className="text-xs text-gray-500">Add text content</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                        
                        <Draggable draggableId="toolbar-image" index={1}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 bg-white border border-gray-200 rounded-lg cursor-grab hover:shadow-md transition-shadow ${
                                snapshot.isDragging ? 'shadow-lg' : ''
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <ApperIcon name="Image" size={20} className="text-gray-600" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">Image Block</div>
                                  <div className="text-xs text-gray-500">Add images</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>

                {/* Email Settings */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Email Settings</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Background Color
                      </label>
                      <input
                        type="color"
                        value={content.settings.backgroundColor}
                        onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                        className="w-full h-8 rounded border border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Content Width (px)
                      </label>
                      <Input
                        type="number"
                        value={content.settings.contentWidth}
                        onChange={(e) => updateSettings({ contentWidth: parseInt(e.target.value) || 600 })}
                        className="text-sm"
                        min="400"
                        max="800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Padding (px)
                      </label>
                      <Input
                        type="number"
                        value={content.settings.padding}
                        onChange={(e) => updateSettings({ padding: parseInt(e.target.value) || 20 })}
                        className="text-sm"
                        min="0"
                        max="50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Center - Canvas */}
            <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                <div 
                  className="bg-white shadow-lg rounded-lg overflow-hidden"
                  style={{ 
                    width: `${content.settings.contentWidth}px`,
                    margin: '0 auto',
                    backgroundColor: content.settings.backgroundColor 
                  }}
                >
                  <Droppable droppableId="canvas">
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`min-h-96 transition-colors ${
                          snapshot.isDraggingOver ? 'bg-blue-50' : ''
                        }`}
                        style={{ padding: `${content.settings.padding}px` }}
                      >
                        {content.blocks.length === 0 && (
                          <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                            <div className="text-center">
                              <ApperIcon name="Mail" size={48} className="mx-auto mb-4" />
                              <p className="text-lg font-medium">Drag blocks here to start building</p>
                              <p className="text-sm">Add text and image blocks from the left sidebar</p>
                            </div>
                          </div>
                        )}
                        
                        {content.blocks.map((block, index) => (
                          <Draggable key={block.id} draggableId={block.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`relative group mb-4 ${
                                  selectedBlockId === block.id ? 'ring-2 ring-primary-500' : ''
                                } ${snapshot.isDragging ? 'opacity-75' : ''}`}
                                onClick={() => setSelectedBlockId(block.id)}
                              >
                                {/* Block Controls */}
                                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex space-x-1">
                                  <button
                                    {...provided.dragHandleProps}
                                    className="w-6 h-6 bg-white border border-gray-300 rounded shadow-sm flex items-center justify-center hover:bg-gray-50"
                                  >
                                    <ApperIcon name="GripVertical" size={12} className="text-gray-500" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteBlock(block.id);
                                    }}
                                    className="w-6 h-6 bg-white border border-gray-300 rounded shadow-sm flex items-center justify-center hover:bg-red-50 hover:text-red-600"
                                  >
                                    <ApperIcon name="Trash2" size={12} />
                                  </button>
                                </div>

                                {/* Block Content */}
                                {block.type === 'text' ? (
                                  <TextBlock
                                    data={block.data}
                                    onChange={(newData) => updateBlock(block.id, newData)}
                                    isSelected={selectedBlockId === block.id}
                                  />
                                ) : (
                                  <ImageBlock
                                    data={block.data}
                                    onChange={(newData) => updateBlock(block.id, newData)}
                                    isSelected={selectedBlockId === block.id}
                                  />
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Properties */}
            {selectedBlock && (
              <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Block Properties</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedBlockId(null)}
                    >
                      <ApperIcon name="X" size={16} />
                    </Button>
                  </div>

                  {selectedBlock.type === 'text' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Font Size (px)
                        </label>
                        <Input
                          type="number"
                          value={selectedBlock.data.fontSize}
                          onChange={(e) => updateBlock(selectedBlock.id, { fontSize: parseInt(e.target.value) || 16 })}
                          className="text-sm"
                          min="8"
                          max="72"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Text Color
                        </label>
                        <input
                          type="color"
                          value={selectedBlock.data.color}
                          onChange={(e) => updateBlock(selectedBlock.id, { color: e.target.value })}
                          className="w-full h-8 rounded border border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Text Alignment
                        </label>
                        <Select
                          value={selectedBlock.data.textAlign}
                          onChange={(e) => updateBlock(selectedBlock.id, { textAlign: e.target.value })}
                          className="text-sm"
                        >
                          <option value="left">Left</option>
                          <option value="center">Center</option>
                          <option value="right">Right</option>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Font Weight
                        </label>
                        <Select
                          value={selectedBlock.data.fontWeight}
                          onChange={(e) => updateBlock(selectedBlock.id, { fontWeight: e.target.value })}
                          className="text-sm"
                        >
                          <option value="normal">Normal</option>
                          <option value="bold">Bold</option>
                        </Select>
                      </div>
                    </div>
                  )}

                  {selectedBlock.type === 'image' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Image URL
                        </label>
                        <Input
                          value={selectedBlock.data.src}
                          onChange={(e) => updateBlock(selectedBlock.id, { src: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Alt Text
                        </label>
                        <Input
                          value={selectedBlock.data.alt}
                          onChange={(e) => updateBlock(selectedBlock.id, { alt: e.target.value })}
                          placeholder="Image description"
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Width
                        </label>
                        <Select
                          value={selectedBlock.data.width}
                          onChange={(e) => updateBlock(selectedBlock.id, { width: e.target.value })}
                          className="text-sm"
                        >
                          <option value="25%">25%</option>
                          <option value="50%">50%</option>
                          <option value="75%">75%</option>
                          <option value="100%">100%</option>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Alignment
                        </label>
                        <Select
                          value={selectedBlock.data.alignment}
                          onChange={(e) => updateBlock(selectedBlock.id, { alignment: e.target.value })}
                          className="text-sm"
                        >
                          <option value="left">Left</option>
                          <option value="center">Center</option>
                          <option value="right">Right</option>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DragDropContext>
        ) : (
          <EmailPreview emailContent={content} />
        )}
      </div>
    </div>
  );
};

export default EmailBuilder;