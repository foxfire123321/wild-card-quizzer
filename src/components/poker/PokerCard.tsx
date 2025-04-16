
import React from "react";

interface PokerCardProps {
  card?: string;
  faceUp?: boolean;
  isFolded?: boolean;
}

const PokerCard: React.FC<PokerCardProps> = ({ card, faceUp = false, isFolded = false }) => {
  return (
    <div 
      className={`w-8 h-12 sm:w-10 sm:h-14 md:w-12 md:h-16 rounded-md flex items-center justify-center transition-all duration-500 ${
        faceUp ? 'bg-white text-black' : 'bg-blue-700 border-2 border-white'
      } ${
        isFolded ? 'opacity-0 scale-75 rotate-12 translate-x-2' : 'opacity-100'
      }`}
    >
      {faceUp && card ? card : ''}
    </div>
  );
};

export default PokerCard;
