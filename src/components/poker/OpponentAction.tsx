
import React, { useEffect, useState } from "react";
import PokerCard from "./PokerCard";

interface OpponentActionProps {
  action: string;
  position: { x: number; y: number };
  isVisible: boolean;
}

const OpponentAction: React.FC<OpponentActionProps> = ({ action, position, isVisible }) => {
  const [isFolded, setIsFolded] = useState(false);
  const [showAction, setShowAction] = useState(true);
  
  useEffect(() => {
    // If the action includes "fold", trigger fold animation
    if (isVisible && action.toLowerCase().includes("fold")) {
      // Add a delay before folding to make sure the action is visible first
      const foldTimeout = setTimeout(() => {
        setIsFolded(true);
        setShowAction(false); // Hide action label along with cards
      }, 1000); // 1 second after the action appears
      
      return () => clearTimeout(foldTimeout);
    }
    
    // Reset fold state when changing to a new question
    if (!isVisible) {
      setIsFolded(false);
      setShowAction(true);
    }
  }, [isVisible, action]);

  return (
    <div 
      className="absolute flex flex-col items-center"
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%`, 
        transform: 'translate(-50%, -50%)' 
      }}
    >
      {isVisible && showAction && (
        <div className={`bg-amber-400 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md text-xs mb-1 min-w-14 sm:min-w-18 text-center text-black ${isFolded ? 'opacity-0' : 'animate-fade-in'}`}>
          {action}
        </div>
      )}
      <div className="flex flex-col items-center">
        <div className="flex gap-1">
          <PokerCard isFolded={isFolded} />
          <PokerCard isFolded={isFolded} />
        </div>
      </div>
    </div>
  );
};

export default OpponentAction;
