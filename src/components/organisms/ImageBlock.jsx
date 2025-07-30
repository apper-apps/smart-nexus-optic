import React, { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const ImageBlock = ({ data, onChange, isSelected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(data.src);

  const handleImageClick = () => {
    if (!data.src) {
      setIsEditing(true);
      setTempUrl('');
    }
  };

  const handleUrlSave = () => {
    onChange({ src: tempUrl.trim() });
    setIsEditing(false);
  };

  const handleUrlCancel = () => {
    setTempUrl(data.src);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleUrlSave();
    } else if (e.key === 'Escape') {
      handleUrlCancel();
    }
  };

  const getAlignmentStyle = () => {
    switch (data.alignment) {
      case 'left':
        return { justifyContent: 'flex-start' };
      case 'right':
        return { justifyContent: 'flex-end' };
      case 'center':
      default:
        return { justifyContent: 'center' };
    }
  };

  return (
    <div 
      className={`relative transition-all duration-200 ${
        isSelected ? 'ring-2 ring-primary-500 ring-opacity-50' : ''
      }`}
    >
      <div 
        className="flex"
        style={getAlignmentStyle()}
      >
        {data.src && !isEditing ? (
          <div className="relative group">
            <img
              src={data.src}
              alt={data.alt}
              style={{
                width: data.width,
                height: 'auto',
                maxWidth: '100%',
                display: 'block',
                borderRadius: '4px'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div
              className="hidden bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center text-gray-500"
              style={{
                width: data.width,
                height: '200px'
              }}
            >
              <div className="text-center">
                <ApperIcon name="ImageOff" size={32} className="mx-auto mb-2" />
                <p className="text-sm">Failed to load image</p>
              </div>
            </div>
            
            {/* Edit overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center rounded-lg">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => {
                    setTempUrl(data.src);
                    setIsEditing(true);
                  }}
                  className="bg-white text-gray-800 hover:bg-gray-100"
                >
                  <ApperIcon name="Edit" size={14} className="mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onChange({ src: '' })}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  <ApperIcon name="Trash2" size={14} className="mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 ${
              !isEditing ? 'cursor-pointer hover:bg-gray-50 hover:border-gray-400' : ''
            }`}
            style={{
              width: data.width,
              minHeight: isEditing ? 'auto' : '200px',
              padding: isEditing ? '16px' : '20px'
            }}
            onClick={handleImageClick}
          >
            {isEditing ? (
              <div className="w-full space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <Input
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="https://example.com/image.jpg"
                    className="w-full"
                    autoFocus
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={handleUrlSave}
                    disabled={!tempUrl.trim()}
                    className="bg-primary-600 text-white hover:bg-primary-700"
                  >
                    <ApperIcon name="Check" size={14} className="mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleUrlCancel}
                  >
                    <ApperIcon name="X" size={14} className="mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <ApperIcon name="Image" size={32} className="mx-auto mb-3" />
                <p className="text-sm font-medium mb-1">Click to add image</p>
                <p className="text-xs text-gray-400">Enter an image URL</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageBlock;