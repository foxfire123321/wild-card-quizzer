
import React from "react";
import { Button } from "@/components/ui/button";

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
  // Function to determine button styling based on selection state
  const getButtonClass = (option: string) => {
    if (!selectedAnswer) return "btn-answer";
    
    if (option === selectedAnswer) {
      return isCorrect 
        ? "bg-green-500 text-white hover:bg-green-600" 
        : "bg-red-500 text-white hover:bg-red-600";
    }
    
    return "btn-answer opacity-70";
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
      {options.map((option, index) => (
        <Button
          key={`option-${index}`}
          className={getButtonClass(option)}
          onClick={() => !selectedAnswer && onAnswerSelect(option)}
          disabled={!!selectedAnswer}
        >
          {option}
        </Button>
      ))}
    </div>
  );
};

export default AnswerOptions;
