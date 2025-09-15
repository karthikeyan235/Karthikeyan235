import React from 'react';

const DialogBox = ({ position, content, isLoading }) => {
  return (
    <div
      className="absolute bg-white border border-gray-300 rounded-md p-4 shadow-md"
      style={{ top: position.top, left: position.left }}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Thinking...</p>
        </div>
      ) : (
        <p className="text-gray-800">{content}</p>
      )}
    </div>
  );
};

export default DialogBox;
