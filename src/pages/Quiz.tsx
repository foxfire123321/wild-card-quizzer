
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import PokerTable from "@/components/poker/PokerTable";
import AnswerOptions from "@/components/poker/AnswerOptions";
import { useQuizData, extractUserPosition, Question, shuffleArray } from "@/utils/quizUtils";

const Quiz = () => {
  const { questions: originalQuestions, loading, error } = useQuizData();
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [userPosition, setUserPosition] = useState("BTN");
  const [visibleOpponents, setVisibleOpponents] = useState<number[]>([]);
  const navigate = useNavigate();

  // Shuffle questions when they load
  useEffect(() => {
    if (originalQuestions.length > 0) {
      setShuffledQuestions(shuffleArray([...originalQuestions]));
    }
  }, [originalQuestions]);

  // When questions load or current question changes, update the user position
  useEffect(() => {
    if (shuffledQuestions.length > 0 && currentQuestionIndex < shuffledQuestions.length) {
      const position = extractUserPosition(shuffledQuestions[currentQuestionIndex].question);
      setUserPosition(position);
      setVisibleOpponents([]); // Reset visible opponents for the new question
    }
  }, [currentQuestionIndex, shuffledQuestions]);

  // Animate opponent actions appearance
  useEffect(() => {
    if (shuffledQuestions.length > 0 && currentQuestionIndex < shuffledQuestions.length) {
      const currentQuestion = shuffledQuestions[currentQuestionIndex];
      if (!currentQuestion.opponent_actions) return;

      // Clear any existing timeouts
      const timeoutIds: number[] = [];
      
      // Show opponents one by one with delay
      currentQuestion.opponent_actions.forEach((_, index) => {
        const timeoutId = window.setTimeout(() => {
          setVisibleOpponents(prev => [...prev, index]);
        }, 200 * index); // 0.2 second delay between each
        timeoutIds.push(timeoutId);
      });

      // Cleanup function to clear timeouts if component unmounts or question changes
      return () => {
        timeoutIds.forEach(id => window.clearTimeout(id));
      };
    }
  }, [currentQuestionIndex, shuffledQuestions]);

  const handleAnswerSelect = (answer: string) => {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.answer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prevScore => prevScore + 1);
    }
    
    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestionIndex < shuffledQuestions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setVisibleOpponents([]); // Reset visible opponents for the new question
      } else {
        // Quiz completed - could navigate to a results page
        console.log("Quiz completed!");
      }
    }, 1500);
  };

  // Render the current question
  const renderCurrentQuestion = () => {
    if (loading || shuffledQuestions.length === 0 || currentQuestionIndex >= shuffledQuestions.length) {
      return null;
    }

    const currentQuestion = shuffledQuestions[currentQuestionIndex];

    return (
      <div className="w-full h-full flex flex-col items-center">
        <h1 className="text-2xl font-bold text-amber-400 mb-2">Poker Quiz</h1>
        
        {/* Poker table with cards and actions */}
        <PokerTable 
          cards={currentQuestion.cards}
          userPosition={userPosition}
          opponentActions={currentQuestion.opponent_actions || []}
          visibleOpponents={visibleOpponents}
        />
        
        {/* Question and answers */}
        <div className="w-full max-w-lg">
          <h2 className="text-lg font-medium mb-3 text-center">
            {currentQuestion.question}
          </h2>
          
          <AnswerOptions 
            options={currentQuestion.options}
            correctAnswer={currentQuestion.answer}
            selectedAnswer={selectedAnswer}
            isCorrect={isCorrect}
            onAnswerSelect={handleAnswerSelect}
          />
          
          <div className="flex justify-between items-center">
            <div className="text-lg font-bold text-amber-400">
              Score: {score}/{currentQuestionIndex + (isCorrect ? 1 : 0)}
            </div>
            <Button 
              variant="outline" 
              className="btn-nav"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen quiz-theme p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-10 w-10 border-4 border-amber-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading questions...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <Button 
              className="mt-4 bg-amber-400 hover:bg-amber-500 text-black"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        ) : (
          renderCurrentQuestion()
        )}
      </div>
    </div>
  );
};

export default Quiz;
