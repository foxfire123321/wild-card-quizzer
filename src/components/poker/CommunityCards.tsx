
import React from "react";
import PokerCard from "./PokerCard";

interface Cards {
  player: string[];
  flop: string[];
  turn: string | null;
  river: string | null;
}

interface CommunityCardsProps {
  cards?: Cards;
}

const CommunityCards: React.FC<CommunityCardsProps> = ({ cards }) => {
  if (!cards) return null;
  
  return (
    <div className="flex flex-col items-center gap-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      {cards.flop.length > 0 && (
        <div className="flex gap-1">
          {cards.flop.map((card, index) => (
            <PokerCard key={`flop-${index}`} card={card} faceUp={true} />
          ))}
          {cards.turn && (
            <PokerCard card={cards.turn} faceUp={true} />
          )}
          {cards.river && (
            <PokerCard card={cards.river} faceUp={true} />
          )}
        </div>
      )}
    </div>
  );
};

export default CommunityCards;
