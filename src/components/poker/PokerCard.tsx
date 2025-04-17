
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
        faceUp 
          ? 'bg-white text-black border border-gray-300' 
          : 'bg-red-600 bg-opacity-90 border-2 border-white bg-[url("/lovable-uploads/1fcdc667-e288-446c-8967-7bdc58f5d993.png")] bg-center bg-cover'
      } ${
        isFolded ? 'opacity-0 scale-75 rotate-12 translate-x-2' : 'opacity-100'
      }`}
    >
      {faceUp && card ? card : ''}
    </div>
  );
};

export default PokerCard;
