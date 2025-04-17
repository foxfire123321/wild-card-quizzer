
import React from 'react';

interface LivesDisplayProps {
  lives: number;
}

export const LivesDisplay: React.FC<LivesDisplayProps> = ({ lives }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(3)].map((_, index) => (
        <span 
          key={`life-${index}`}
          className={`inline-block w-5 h-5 rounded-full ${
            index < lives ? 'bg-red-500' : 'bg-gray-300'
          }`}
        />
      ))}
      <span className="text-sm font-medium ml-2">{lives} lives</span>
    </div>
  );
};
