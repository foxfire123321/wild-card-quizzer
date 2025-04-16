
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface AnswerOptionsProps {
  options: string[];
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  onAnswerSelect: (answer: string) => void;
}

const AnswerOptions: React.FC<AnswerOptionsProps> = ({ 
  options, 
  selectedAnswer, 
  isCorrect, 
  onAnswerSelect 
}) => {
  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      {options.map((option, index) => (
        <Button
          key={index}
          onClick={() => onAnswerSelect(option)}
          disabled={selectedAnswer !== null}
          className={`h-14 text-lg transition-colors ${
            selectedAnswer === option 
              ? isCorrect 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
              : 'bg-poker-gold hover:bg-amber-600'
          }`}
        >
          {option}
          {selectedAnswer === option && (
            <span className="ml-2">
              {isCorrect ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </span>
          )}
        </Button>
      ))}
    </div>
  );
};

export default AnswerOptions;
