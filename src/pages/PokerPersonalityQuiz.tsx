
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import LoginPrompt from "@/components/LoginPrompt";
import LoadingSpinner from "@/components/personality/LoadingSpinner";
import {
  QuizQuestion,
  PersonalityType,
  PersonalityResult,
  quizQuestions,
  calculatePersonalityResult,
  savePersonalityResult,
  getSavedPersonalityResult
} from "@/utils/personalityQuizUtils";

const PokerPersonalityQuiz = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<PersonalityType[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingResults, setCheckingResults] = useState(false);
  const [resultCheckComplete, setResultCheckComplete] = useState(false);
  
  // Check if user already has a result and redirect if needed, with improved error handling
  useEffect(() => {
    // Only proceed when auth status is determined (either logged in or not)
    if (authLoading) return;
    
    const checkForExistingResult = async () => {
      // Don't try to check for results if we're not logged in
      if (!user) {
        setResultCheckComplete(true);
        return;
      }
      
      try {
        setCheckingResults(true);
        const savedResult = await getSavedPersonalityResult();
        
        // If the user has a result, navigate to the results page
        if (savedResult && savedResult.length > 0) {
          // Store the result for the result page to use
          localStorage.setItem('currentPersonalityResult', JSON.stringify({
            topPersonalities: savedResult,
            personalities: {} // Empty placeholder since we don't need the full breakdown
          }));
          
          navigate('/poker-personality-result');
          return;
        }
      } catch (error) {
        console.error("Error checking for saved result:", error);
        // Don't show an error to the user, just let them take the quiz
      } finally {
        setCheckingResults(false);
        setResultCheckComplete(true);
      }
    };
    
    // Only check once, and avoid rechecking
    if (!resultCheckComplete) {
      checkForExistingResult();
    }
  }, [user, authLoading, resultCheckComplete, navigate]);
  
  // Debounced answer selection to prevent double submissions
  const handleAnswerSelect = (answerId: string) => {
    // Prevent multiple submissions
    if (isSubmitting || isTransitioning) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const currentQuestion = quizQuestions[currentQuestionIndex];
      const selectedAnswerIndex = parseInt(answerId);
      const personalityType = currentQuestion.answers[selectedAnswerIndex].personality;
      
      const newSelectedAnswers = [...selectedAnswers, personalityType];
      setSelectedAnswers(newSelectedAnswers);
      
      setIsTransitioning(true);
      
      setTimeout(() => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
          setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
          try {
            const result = calculatePersonalityResult(newSelectedAnswers);
            handleQuizCompletion(result);
          } catch (error) {
            console.error('Error calculating result:', error);
            setError("Oops! Something went wrong. Please try again.");
            toast.error("Error calculating your result. Please try again.");
          }
        }
        
        setIsTransitioning(false);
        setIsSubmitting(false);
      }, 500); // Slightly longer transition for stability
    } catch (error) {
      console.error('Error in answer selection:', error);
      setError("Oops! Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
      setIsTransitioning(false);
      setIsSubmitting(false);
    }
  };
  
  const handleQuizCompletion = async (result: PersonalityResult) => {
    try {
      // Store result in localStorage for retrieval after login
      localStorage.setItem(
        'currentPersonalityResult', 
        JSON.stringify(result)
      );
      
      if (!user) {
        setShowLoginPrompt(true);
      } else {
        try {
          await savePersonalityResult(user.id, result.topPersonalities);
          navigate('/poker-personality-result');
        } catch (error) {
          console.error('Failed to save result:', error);
          toast.error('Failed to save your result. Please try again.');
          // Continue to result page even if saving fails
          navigate('/poker-personality-result');
        }
      }
    } catch (error) {
      console.error('Error in quiz completion:', error);
      setError("Oops! Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    }
  };
  
  // Show proper loading state
  if (authLoading || (checkingResults && !resultCheckComplete)) {
    return <LoadingSpinner message={checkingResults ? "Checking your saved results..." : "Loading..."} />;
  }
  
  const currentQuestion = quizQuestions[currentQuestionIndex];
  
  return (
    <>
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
          
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md text-center">
              {error}
              <Button 
                onClick={() => window.location.reload()}
                className="mt-2 bg-red-600 hover:bg-red-700 text-white"
              >
                Try Again
              </Button>
            </div>
          )}
          
          {currentQuestion && (
            <Card className={`mb-6 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
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
                      onClick={() => handleAnswerSelect(index.toString())}
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
          message="Log in to reveal your poker personality."
          returnPath="/poker-personality-result"
          onClose={() => setShowLoginPrompt(false)}
        />
      )}
    </>
  );
};

export default PokerPersonalityQuiz;

