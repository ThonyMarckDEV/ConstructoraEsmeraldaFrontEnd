// DateSeparator.jsx
import React from 'react';

const DateSeparator = ({ date }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex justify-center my-4">
      <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
        {formatDate(date)}
      </div>
    </div>
  );
};

export default DateSeparator;