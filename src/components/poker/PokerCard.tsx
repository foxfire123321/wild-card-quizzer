
import React from "react";

interface PokerCardProps {
  card?: string;
  faceUp?: boolean;
}

const PokerCard: React.FC<PokerCardProps> = ({ card, faceUp = false }) => {
  return (
    <div 
      className={`w-8 h-12 sm:w-10 sm:h-14 md:w-12 md:h-16 rounded-md flex items-center justify-center ${
        faceUp ? 'bg-white text-black' : 'bg-blue-700 border-2 border-white'
      }`}
    >
      {faceUp && card ? card : ''}
    </div>
  );
};

export default PokerCard;
