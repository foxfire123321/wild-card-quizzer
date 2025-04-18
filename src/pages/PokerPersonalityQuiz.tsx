
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import LoginPrompt from "@/components/LoginPrompt";
import LoadingSpinner from "@/components/personality/LoadingSpinner";
import ErrorBoundary from "@/components/personality/ErrorBoundary";
import {
  QuizQuestion,
  PersonalityType,
  quizQuestions,
  calculatePersonalityResult,
  savePersonalityResult,
  getSavedPersonalityResult
} from "@/utils/personalityQuizUtils";

const PokerPersonalityQuiz = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<PersonalityType[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingResult, setIsCheckingResult] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  // Check if the restart parameter is present
  const restartQuiz = searchParams.has('restart');
  
  // Function to check for saved results and handle redirection
  const checkForSavedResult = useCallback(async () => {
    if (authLoading) return;
    
    // If restart parameter is present, skip checking for saved results
    if (restartQuiz) {
      setIsCheckingResult(false);
      return;
    }
    
    try {
      if (user) {
        const savedResult = await getSavedPersonalityResult();
        
        if (savedResult && savedResult.length > 0) {
          // Store the result in localStorage and redirect to results page
          localStorage.setItem('currentPersonalityResult', JSON.stringify({
            topPersonalities: savedResult,
            personalities: {}
          }));
          
          navigate('/poker-personality-result');
          return;
        }
      }
    } catch (error) {
      console.error("Error checking for saved result:", error);
    } finally {
      setIsCheckingResult(false);
    }
  }, [user, authLoading, navigate, restartQuiz]);
  
  useEffect(() => {
    checkForSavedResult();
  }, [checkForSavedResult]);
  
  const handleAnswerSelect = async (personality: PersonalityType) => {
    if (isSubmitting || isTransitioning) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Add the selected personality to the answers
      const newSelectedAnswers = [...selectedAnswers, personality];
      setSelectedAnswers(newSelectedAnswers);
      
      setIsTransitioning(true);
      
      // Delay to allow for transition
      setTimeout(() => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
          // Move to the next question
          setCurrentQuestionIndex(prevIndex => prevIndex + 1);
          setIsTransitioning(false);
          setIsSubmitting(false);
        } else {
          // Quiz complete, calculate result
          handleQuizCompletion(newSelectedAnswers);
        }
      }, 300);
    } catch (error) {
      console.error('Error in answer selection:', error);
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
      setIsTransitioning(false);
      setIsSubmitting(false);
    }
  };
  
  const handleQuizCompletion = async (answers: PersonalityType[]) => {
    try {
      // Calculate the final result
      const result = calculatePersonalityResult(answers);
      
      // Save to localStorage for the result page to access
      localStorage.setItem('currentPersonalityResult', JSON.stringify(result));
      
      if (!user) {
        setShowLoginPrompt(true);
        return;
      }
      // If logged in, save result and show the result page
      await savePersonalityResult(user.id, result.topPersonalities);
      navigate('/poker-personality-result');
    } catch (error) {
      console.error('Error in quiz completion:', error);
      setError("Something went wrong calculating your result. Please try again.");
      toast.error("Error calculating your result. Please try again.");
      setIsTransitioning(false);
      setIsSubmitting(false);
    }
  };
  
  // Handle retry after error
  const handleRetry = () => {
    window.location.reload();
  };
  
  if (authLoading || isCheckingResult) {
    return (
      <LoadingSpinner 
        message={isCheckingResult ? "Checking your saved results..." : "Loading..."} 
      />
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-amber-50 to-amber-100">
        <div className="text-center mb-8">
          <h1 className="text-red-500 text-2xl font-bold mb-4">
            Oops! Something went wrong.
          </h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <Button onClick={handleRetry} className="bg-poker-gold hover:bg-amber-600">
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  const currentQuestion = quizQuestions[currentQuestionIndex];
  
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-b from-amber-50 to-amber-100">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-poker-gold text-3xl md:text-4xl font-bold mb-2">
              Poker Personality Quiz
            </h1>
            
            <div className="w-full bg-amber-100 rounded-full h-2.5 mb-4 mt-6">
              <div 
                className="bg-poker-gold h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
              ></div>
            </div>
            
            <p className="text-gray-600">
              Question {currentQuestionIndex + 1} of {quizQuestions.length}
            </p>
          </div>
          
          {currentQuestion && (
            <Card className={`mb-6 transition-all duration-300 ${isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-6 text-gray-800">
                  {currentQuestion.question}
                </h2>
                
                <div className="space-y-3">
                  {currentQuestion.answers.map((answer, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left py-4 px-4 h-auto whitespace-normal border-gray-200 text-gray-700 hover:bg-amber-50"
                      onClick={() => handleAnswerSelect(answer.personality)}
                      disabled={isSubmitting || isTransitioning}
                    >
                      {answer.text}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="flex justify-between">
            <Button 
              onClick={() => navigate('/')}
              variant="outline" 
              className="border-amber-400 text-amber-400"
              disabled={isSubmitting || isTransitioning}
            >
              Back to Menu
            </Button>
          </div>
        </div>
      </div>
      
      {showLoginPrompt && (
        <LoginPrompt
          title="Discover Your Poker Personality"
          message="Log in to reveal your result."
          returnPath="/poker-personality-result"
          onClose={() => setShowLoginPrompt(false)}
          showBackToMenu={true}
        />
      )}
    </ErrorBoundary>
  );
};

export default PokerPersonalityQuiz;
