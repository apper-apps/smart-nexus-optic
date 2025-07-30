import React, { useState, useRef, useEffect } from 'react';

const TextBlock = ({ data, onChange, isSelected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(data.content);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(data.content);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editValue.trim() !== data.content) {
      onChange({ content: editValue.trim() || 'Click to edit text...' });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditValue(data.content);
      setIsEditing(false);
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    if (isEditing) {
      adjustTextareaHeight();
    }
  }, [editValue, isEditing]);

  return (
    <div 
      className={`relative transition-all duration-200 ${
        isSelected ? 'ring-2 ring-primary-500 ring-opacity-50' : ''
      } ${isEditing ? '' : 'hover:bg-gray-50 hover:bg-opacity-50'}`}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => {
            setEditValue(e.target.value);
            adjustTextareaHeight();
          }}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full resize-none border-0 outline-none bg-transparent overflow-hidden"
          style={{
            fontSize: `${data.fontSize}px`,
            color: data.color,
            textAlign: data.textAlign,
            fontWeight: data.fontWeight,
            lineHeight: '1.5',
            minHeight: `${data.fontSize * 1.5}px`
          }}
        />
      ) : (
        <div
          className="cursor-pointer min-h-6 p-1 rounded transition-colors"
          style={{
            fontSize: `${data.fontSize}px`,
            color: data.color,
            textAlign: data.textAlign,
            fontWeight: data.fontWeight,
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap'
          }}
        >
          {data.content}
        </div>
      )}
      
      {!isEditing && (
        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-gray-300 rounded px-2 py-1 text-xs text-gray-600 pointer-events-none">
          Double-click to edit
        </div>
      )}
    </div>
  );
};

export default TextBlock;