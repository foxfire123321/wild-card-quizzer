
import { Heart } from "lucide-react";

interface LivesDisplayProps {
  lives: number;
}

export const LivesDisplay = ({ lives }: LivesDisplayProps) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(3)].map((_, i) => (
        <Heart
          key={i}
          className={`h-6 w-6 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
        />
      ))}
    </div>
  );
};
