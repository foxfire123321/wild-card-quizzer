
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import LoginPrompt from "@/components/LoginPrompt";
import {
  QuizQuestion,
  PersonalityType,
  quizQuestions,
  calculatePersonalityResult,
  savePersonalityResult
} from "@/utils/personalityQuizUtils";

const PokerPersonalityQuiz = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<PersonalityType[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // Check if user is logged in and set preview mode accordingly
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        setIsPreviewMode(true);
      }
    }
  }, [user, isLoading]);
  
  const handleAnswerSelect = (answerId: string) => {
    // Get the personality type associated with the selected answer
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const selectedAnswerIndex = parseInt(answerId);
    const personalityType = currentQuestion.answers[selectedAnswerIndex].personality;
    
    // If in preview mode and this is the first question, show login prompt
    if (isPreviewMode && currentQuestionIndex === 0) {
      // Add visual transition first
      setIsTransitioning(true);
      
      setTimeout(() => {
        setShowLoginPrompt(true);
        setIsTransitioning(false);
      }, 300);
      
      return;
    }
    
    // Add the personality type to the selected answers
    const newSelectedAnswers = [...selectedAnswers, personalityType];
    setSelectedAnswers(newSelectedAnswers);
    
    // Start transition animation
    setIsTransitioning(true);
    
    // Delay to allow for transition animation
    setTimeout(() => {
      if (currentQuestionIndex < quizQuestions.length - 1) {
        // Move to the next question
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      } else {
        // Quiz completed, calculate result
        const result = calculatePersonalityResult(newSelectedAnswers);
        
        // Save the result to Supabase
        if (user) {
          savePersonalityResult(user.id, result.topPersonalities)
            .then(() => {
              // Store the result in localStorage for the result page
              localStorage.setItem(
                'currentPersonalityResult', 
                JSON.stringify(result)
              );
              
              // Navigate to the result page
              navigate('/poker-personality-result');
            })
            .catch(error => {
              console.error('Failed to save result:', error);
              toast.error('Failed to save your result. Please try again.');
            });
        }
      }
      
      // End transition animation
      setIsTransitioning(false);
    }, 300);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-amber-50 to-amber-100">
        <div className="animate-spin h-10 w-10 border-4 border-amber-400 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
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
            
            {/* Progress bar */}
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
          
          <Card className={`mb-6 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-6 text-gray-800">
                {currentQuestion.question}
              </h2>
              
              {/* Button-style answer options that submit immediately on click */}
              <div className="space-y-3">
                {currentQuestion.answers.map((answer, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left py-4 px-4 h-auto whitespace-normal border-gray-200 text-gray-700 hover:bg-amber-50"
                    onClick={() => handleAnswerSelect(index.toString())}
                  >
                    {answer.text}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button 
              onClick={() => navigate('/')}
              variant="outline" 
              className="border-amber-400 text-amber-400"
            >
              Back to Menu
            </Button>
          </div>
        </div>
      </div>
      
      {showLoginPrompt && (
        <LoginPrompt
          message="Log in to unlock your poker personality."
          returnPath="/poker-personality-quiz"
          onClose={() => navigate('/')}
        />
      )}
    </>
  );
};

export default PokerPersonalityQuiz;
