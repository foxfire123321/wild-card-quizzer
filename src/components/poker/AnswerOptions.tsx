
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { shuffleArray } from "@/utils/quizUtils";

interface AnswerOptionsProps {
  options: string[];
  correctAnswer: string; // Original correct answer
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  onAnswerSelect: (answer: string) => void;
  shuffleOptions?: boolean; // New prop to control shuffling
}

const AnswerOptions: React.FC<AnswerOptionsProps> = ({ 
  options, 
  correctAnswer,
  selectedAnswer, 
  isCorrect, 
  onAnswerSelect,
  shuffleOptions = true // Default to shuffling
}) => {
  // State to store options that may be shuffled
  const [displayOptions, setDisplayOptions] = useState<string[]>([]);
  
  // Set options, shuffling if needed
  useEffect(() => {
    if (shuffleOptions) {
      setDisplayOptions(shuffleArray([...options]));
    } else {
      setDisplayOptions([...options]);
    }
  }, [options, shuffleOptions]);
  
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
      {displayOptions.map((option, index) => (
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
