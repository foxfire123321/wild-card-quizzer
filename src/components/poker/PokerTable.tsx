
import React from "react";
import PokerCard from "./PokerCard";
import OpponentAction from "./OpponentAction";
import CommunityCards from "./CommunityCards";

interface OpponentAction {
  position: string;
  action: string;
}

interface Cards {
  player: string[];
  flop: string[];
  turn: string | null;
  river: string | null;
}

interface PokerTableProps {
  cards?: Cards;
  userPosition: string;
  opponentActions: OpponentAction[];
  visibleOpponents: number[];
}

// Define table positions around the oval - adjusted to match screenshot
const tablePositions = [
  { x: 50, y: 85 },  // Bottom (user)
  { x: 95, y: 75 },  // Bottom right - moved 10% right
  { x: 75, y: 25 },  // Top right
  { x: 50, y: 15 },  // Top
  { x: 15, y: 25 },  // Top left - moved 10% left
  { x: 15, y: 65 }   // Bottom left - moved 10% left
];

// Map positions to indices on the table (clockwise, starting from bottom)
const positionToIndex: Record<string, number> = {
  'BTN': 0, // Bottom (user)
  'SB': 1,  // Bottom right
  'BB': 2,  // Top right
  'UTG': 3, // Top
  'HJ': 4,  // Top left
  'CO': 5,  // Bottom left
};

const PokerTable: React.FC<PokerTableProps> = ({ 
  cards, 
  userPosition, 
  opponentActions, 
  visibleOpponents 
}) => {
  // Arrange opponent actions in the correct order based on user position
  const getOrderedOpponentActions = (actions: OpponentAction[] | undefined, userPos: string) => {
    if (!actions) return [];
    
    const userIndex = positionToIndex[userPos];
    const orderedActions: (OpponentAction | null)[] = Array(6).fill(null);
    
    // Place actions based on position
    actions.forEach(action => {
      const posIndex = positionToIndex[action.position];
      if (posIndex !== undefined) {
        orderedActions[posIndex] = action;
      }
    });
    
    // Filter out null entries and the user's position
    return orderedActions.filter((action, index) => action !== null && index !== userIndex);
  };

  const orderedOpponentActions = getOrderedOpponentActions(opponentActions, userPosition);

  return (
    <div className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80 mb-4">
      {/* Oval table - updated with more pronounced oval shape */}
      <div className="absolute inset-5 rounded-full poker-table"></div>
      
      {/* User's position and cards at the bottom */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        {cards?.player && (
          <div className="flex gap-1">
            {cards.player.map((card, index) => (
              <PokerCard key={`player-${index}`} card={card} faceUp={true} />
            ))}
          </div>
        )}
      </div>
      
      {/* Community cards in the middle */}
      <CommunityCards cards={cards} />
      
      {/* Opponents around the table */}
      {tablePositions.map((pos, index) => {
        // Skip the user's position
        if (index === positionToIndex[userPosition]) return null;
        
        // Find the opponent action for this position
        const opponentActionIndex = orderedOpponentActions.findIndex(
          action => action?.position === Object.keys(positionToIndex).find(
            key => positionToIndex[key] === index
          )
        );
        
        if (opponentActionIndex < 0) return null;
        
        const opponentAction = orderedOpponentActions[opponentActionIndex];
        const isVisible = visibleOpponents.includes(opponentActionIndex);
        
        if (!opponentAction) return null;
        
        return (
          <OpponentAction
            key={`opponent-${index}`}
            action={opponentAction.action}
            position={pos}
            isVisible={isVisible}
          />
        );
      })}
    </div>
  );
};

export default PokerTable;
