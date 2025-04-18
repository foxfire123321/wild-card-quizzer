
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PokerTable from "@/components/poker/PokerTable";
import AnswerOptions from "@/components/poker/AnswerOptions";
import { useQuizData, extractUserPosition } from "@/utils/quizUtils";
import { saveQuizProgress, getQuizProgress } from "@/utils/progressUtils";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import LoginPrompt from "@/components/LoginPrompt";
import OnboardingOverlay, { TooltipInfo } from "@/components/onboarding/OnboardingOverlay";

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
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();

  // Define onboarding tooltips for Quiz Two
  const quizTwoTooltips: TooltipInfo[] = [
    {
      id: "poker-table-2",
      title: "Poker Table",
      content: "Visual breakdown of your current hand and opponents.",
      position: { top: "30%", left: "50%", transform: "translate(-50%, -50%)" },
      arrowPosition: { top: "0", left: "-40px", transform: "rotate(-45deg)" }
    },
    {
      id: "question-answers-2",
      title: "Question & Answers",
      content: "This is your decision point. Choose wisely — you're building real progress.",
      position: { top: "65%", left: "50%", transform: "translate(-50%, -50%)" },
      arrowPosition: { top: "-30px", right: "20px", transform: "rotate(-90deg)" }
    },
    {
      id: "login-reminder",
      title: "Login Reminder",
      content: "Want to save your streak? Log in to resume next time.",
      position: { bottom: "15%", right: "20%", transform: "translate(0, 0)" },
      arrowPosition: { top: "-30px", left: "20px", transform: "rotate(-90deg)" }
    }
  ];

  // Load saved progress when component mounts
  useEffect(() => {
    const loadProgress = async () => {
      if (user) {
        const savedProgress = await getQuizProgress("quiz-two");
        if (savedProgress && savedProgress.lastQuestionIndex >= 0) {
          setCurrentQuestionIndex(savedProgress.lastQuestionIndex);
          setScore(savedProgress.score); // Load the actual saved score
          
          toast.info(`Welcome back! Continuing from question ${savedProgress.lastQuestionIndex + 1} with score ${savedProgress.score}`);
        }
        setIsProgressLoaded(true);
      } else {
        // If not logged in, start from beginning but still allow play
        setIsProgressLoaded(true);
      }
    };

    if (!isLoading) {
      loadProgress();
    }
  }, [user, isLoading]);

  // When questions load or current question changes, update the user position
  useEffect(() => {
    if (originalQuestions.length > 0 && currentQuestionIndex < originalQuestions.length) {
      const position = extractUserPosition(originalQuestions[currentQuestionIndex].question);
      setUserPosition(position);
      setVisibleOpponents([]); // Reset visible opponents for the new question
    }
  }, [currentQuestionIndex, originalQuestions]);

  // Animate opponent actions appearance
  useEffect(() => {
    if (originalQuestions.length > 0 && currentQuestionIndex < originalQuestions.length) {
      const currentQuestion = originalQuestions[currentQuestionIndex];
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
  }, [currentQuestionIndex, originalQuestions]);

  const handleAnswerSelect = async (answer: string) => {
    const currentQuestion = originalQuestions[currentQuestionIndex];
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.answer;
    setIsCorrect(correct);
    
    // Update score only if correct
    const newScore = correct ? score + 1 : score;
    if (correct) {
      setScore(newScore);
    }
    
    // Move to next question after delay
    setTimeout(async () => {
      if (currentQuestionIndex < originalQuestions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setVisibleOpponents([]); // Reset visible opponents for the new question
        
        if (user) {
          // Save progress after moving to next question, including accurate score
          await saveQuizProgress("quiz-two", nextIndex, newScore);
        }
      } else {
        // Quiz completed
        toast.success("Quiz completed!");
        if (user) {
          // Save completion with final score
          await saveQuizProgress("quiz-two", currentQuestionIndex, newScore);
        } else {
          // Prompt user to login to save progress
          setShowLoginPrompt(true);
        }
      }
    }, 1500);
  };

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    // Nothing specific needed here for Quiz Two
  };

  // Render the current question
  const renderCurrentQuestion = () => {
    if (loading || originalQuestions.length === 0 || currentQuestionIndex >= originalQuestions.length) {
      return null;
    }

    const currentQuestion = originalQuestions[currentQuestionIndex];

    return (
      <div className="w-full h-full flex flex-col items-center">
        <h1 className="text-2xl font-bold text-amber-400 mb-2">Poker Quiz Two</h1>
        
        {/* Onboarding overlay */}
        <OnboardingOverlay 
          tooltips={quizTwoTooltips}
          onComplete={handleOnboardingComplete}
        />
        
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
            shuffleOptions={false} // Don't shuffle for Quiz Two
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

  // Show loading when either auth is loading or progress is being loaded
  if (isLoading || !isProgressLoaded) {
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
          message="Your progress won't be saved unless you log in."
          returnPath="/quiz-two"
          onClose={() => setShowLoginPrompt(false)}
        />
      )}
    </>
  );
};

export default QuizTwo;
