import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const EmailPreview = ({ emailContent }) => {
  const { blocks, settings } = emailContent;

  const renderBlock = (block) => {
    switch (block.type) {
      case 'text':
        return (
          <div
            key={block.id}
            style={{
              fontSize: `${block.data.fontSize}px`,
              color: block.data.color,
              textAlign: block.data.textAlign,
              fontWeight: block.data.fontWeight,
              marginBottom: '16px',
              lineHeight: '1.5'
            }}
          >
            {block.data.content}
          </div>
        );
      case 'image':
        return (
          <div
            key={block.id}
            style={{
              textAlign: block.data.alignment,
              marginBottom: '16px'
            }}
          >
            {block.data.src ? (
              <img
                src={block.data.src}
                alt={block.data.alt}
                style={{
                  width: block.data.width,
                  height: 'auto',
                  maxWidth: '100%',
                  display: 'inline-block'
                }}
              />
            ) : (
              <div 
                style={{
                  width: block.data.width,
                  height: '200px',
                  backgroundColor: '#f3f4f6',
                  border: '2px dashed #d1d5db',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6b7280',
                  fontSize: '14px'
                }}
              >
                No image selected
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
          <div className="bg-gray-800 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-sm text-gray-300">Email Preview</div>
            </div>
          </div>
          
          <div 
            className="email-preview"
            style={{ 
              width: `${settings.contentWidth}px`,
              margin: '0 auto',
              backgroundColor: settings.backgroundColor,
              padding: `${settings.padding}px`,
              minHeight: '400px'
            }}
          >
            {blocks.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <ApperIcon name="Mail" size={48} className="mx-auto mb-4" />
                  <p className="text-lg font-medium">No content to preview</p>
                  <p className="text-sm">Add some blocks to see your email design</p>
                </div>
              </div>
            ) : (
              blocks.map(renderBlock)
            )}
          </div>
        </div>

        {/* Preview Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Layout" size={16} />
              <span>{blocks.length} blocks</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Monitor" size={16} />
              <span>{settings.contentWidth}px width</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Palette" size={16} />
              <span>{settings.backgroundColor}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPreview;