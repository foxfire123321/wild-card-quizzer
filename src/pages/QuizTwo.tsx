import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import PokerTable from "@/components/poker/PokerTable";
import AnswerOptions from "@/components/poker/AnswerOptions";
import { useQuizData, extractUserPosition, Question } from "@/utils/quizUtils";
import { saveQuizProgress, getQuizProgress } from "@/utils/progressUtils";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import LoginPrompt from "@/components/LoginPrompt";

const QuizTwo = () => {
  const { questions: originalQuestions, loading, error } = useQuizData();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [userPosition, setUserPosition] = useState("BTN");
  const [visibleOpponents, setVisibleOpponents] = useState<number[]>([]);
  const { user, isLoading } = useAuth();
  const [isProgressLoaded, setIsProgressLoaded] = useState(false);
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const loadProgress = async () => {
      if (user) {
        const savedProgress = await getQuizProgress("quiz-two");
        if (savedProgress && savedProgress.lastQuestionIndex >= 0) {
          setCurrentQuestionIndex(savedProgress.lastQuestionIndex);
          setScore(savedProgress.score);
          toast.info(`Welcome back! Continuing from question ${savedProgress.lastQuestionIndex + 1} with score ${savedProgress.score}`);
        }
        setIsProgressLoaded(true);
      } else if (!isLoading) {
        toast.error("Please sign in to access Quiz Two");
        navigate("/auth");
      }
    };

    if (!isLoading) {
      loadProgress();
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (originalQuestions.length > 0 && currentQuestionIndex < originalQuestions.length) {
      const position = extractUserPosition(originalQuestions[currentQuestionIndex].question);
      setUserPosition(position);
      setVisibleOpponents([]);
    }
  }, [currentQuestionIndex, originalQuestions]);

  useEffect(() => {
    if (originalQuestions.length > 0 && currentQuestionIndex < originalQuestions.length) {
      const currentQuestion = originalQuestions[currentQuestionIndex];
      if (!currentQuestion.opponent_actions) return;

      const timeoutIds: number[] = [];
      
      currentQuestion.opponent_actions.forEach((_, index) => {
        const timeoutId = window.setTimeout(() => {
          setVisibleOpponents(prev => [...prev, index]);
        }, 200 * index);
        timeoutIds.push(timeoutId);
      });

      return () => {
        timeoutIds.forEach(id => window.clearTimeout(id));
      };
    }
  }, [currentQuestionIndex, originalQuestions]);

  const handleAnswerSelect = async (answer: string) => {
    const currentQuestion = originalQuestions[currentQuestionIndex];
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.answer;
    setIsCorrect(correct);
    
    const newScore = correct ? score + 1 : score;
    if (correct) {
      setScore(newScore);
    }
    
    setTimeout(async () => {
      if (currentQuestionIndex < originalQuestions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setVisibleOpponents([]);
        
        if (user) {
          await saveQuizProgress("quiz-two", nextIndex, newScore);
        }
      } else {
        toast.success("Quiz completed!");
        if (user) {
          await saveQuizProgress("quiz-two", currentQuestionIndex, newScore);
        } else {
          handleQuizComplete();
        }
      }
    }, 1500);
  };

  const handleQuizComplete = () => {
    if (!user) {
      setShowLoginPrompt(true);
    }
  };

  const renderCurrentQuestion = () => {
    if (loading || originalQuestions.length === 0 || currentQuestionIndex >= originalQuestions.length) {
      return null;
    }

    const currentQuestion = originalQuestions[currentQuestionIndex];

    return (
      <div className="w-full h-full flex flex-col items-center">
        <h1 className="text-2xl font-bold text-amber-400 mb-2">Poker Quiz Two</h1>
        
        <PokerTable 
          cards={currentQuestion.cards}
          userPosition={userPosition}
          opponentActions={currentQuestion.opponent_actions || []}
          visibleOpponents={visibleOpponents}
        />
        
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
            shuffleOptions={false}
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

  if (isLoading || (user && !isProgressLoaded)) {
    return (
      <div className="min-h-screen quiz-theme p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-amber-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
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

      {showLoginPrompt && (
        <LoginPrompt
          message="Your progress won't be saved unless you log in. Would you like to sign in now?"
          returnPath="/quiz-two"
          onClose={() => setShowLoginPrompt(false)}
        />
      )}
    </>
  );
};

export default QuizTwo;
