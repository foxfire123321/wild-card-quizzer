
import React from "react";
import PokerCard from "./PokerCard";

interface OpponentActionProps {
  action: string;
  position: { x: number; y: number };
  isVisible: boolean;
}

const OpponentAction: React.FC<OpponentActionProps> = ({ action, position, isVisible }) => {
  return (
    <div 
      className="absolute flex flex-col items-center"
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%`, 
        transform: 'translate(-50%, -50%)' 
      }}
    >
      {isVisible && (
        <div className="bg-amber-300 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md text-xs mb-1 min-w-16 sm:min-w-20 text-center animate-fade-in">
          {action}
        </div>
      )}
      <div className="flex flex-col items-center">
        <div className="flex gap-1">
          <PokerCard />
          <PokerCard />
        </div>
      </div>
    </div>
  );
};

export default OpponentAction;
