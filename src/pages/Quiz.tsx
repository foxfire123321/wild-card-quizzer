
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart, HeartCrack, Clock } from "lucide-react";
import PokerTable from "@/components/poker/PokerTable";
import AnswerOptions from "@/components/poker/AnswerOptions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
  
  // Competitive mode states
  const [timeRemaining, setTimeRemaining] = useState(20);
  const [timerPercent, setTimerPercent] = useState(100);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);
  
  // Animation states
  const [showDamageFlash, setShowDamageFlash] = useState(false);
  const [lostLifeIndex, setLostLifeIndex] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number | null>(null);

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
      resetTimer(); // Reset timer for new question
    }
  }, [currentQuestionIndex, shuffledQuestions]);

  // Smooth timer animation using requestAnimationFrame
  const resetTimer = () => {
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
    }
    setTimeRemaining(20);
    setTimerPercent(100);
    startTimeRef.current = Date.now();
    lastUpdateTimeRef.current = null;
    
    // Start the timer animation
    if (!isGameOver && !selectedAnswer) {
      animateTimer();
    }
  };

  const animateTimer = () => {
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }
    
    const now = Date.now();
    const elapsed = now - startTimeRef.current;
    const totalDuration = 20000; // 20 seconds in milliseconds
    
    // Calculate new percentage and time remaining
    const newPercent = Math.max(0, 100 - (elapsed / totalDuration) * 100);
    const newTimeRemaining = Math.max(0, Math.ceil((totalDuration - elapsed) / 1000));
    
    setTimerPercent(newPercent);
    
    // Only update the displayed time when it changes (once per second)
    if (newTimeRemaining !== timeRemaining) {
      setTimeRemaining(newTimeRemaining);
    }
    
    // Check if timer has reached zero
    if (newPercent <= 0) {
      handleTimeUp();
      return;
    }
    
    // Continue animation
    if (!isGameOver && !selectedAnswer) {
      timerRef.current = requestAnimationFrame(animateTimer);
    }
  };

  // Clean up timer animation on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
    };
  }, []);

  // Start or stop timer based on game state
  useEffect(() => {
    if (loading || isGameOver || selectedAnswer) {
      // Stop the timer
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
        timerRef.current = null;
      }
    } else if (!timerRef.current && !isGameOver && !selectedAnswer) {
      // Start the timer
      resetTimer();
    }
  }, [currentQuestionIndex, loading, isGameOver, selectedAnswer]);

  // Handle time running out
  const handleTimeUp = () => {
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
    
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    setSelectedAnswer(currentQuestion.answer); // Show correct answer
    setIsCorrect(false);
    
    // Trigger life loss animation
    triggerLifeLossAnimation();
    
    setTimeout(() => {
      if (lives <= 1) {
        setIsGameOver(true);
        setShowGameOverDialog(true);
      } else {
        moveToNextQuestion();
      }
    }, 1500);
  };
  
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

  // Trigger life loss animation
  const triggerLifeLossAnimation = () => {
    setLostLifeIndex(lives - 1); // Index of the heart being lost
    setShowDamageFlash(true);
    setLives(prev => prev - 1);
    
    // Reset damage flash after animation completes
    setTimeout(() => {
      setShowDamageFlash(false);
      setLostLifeIndex(null);
    }, 500);
  };

  const handleAnswerSelect = (answer: string) => {
    if (isGameOver) return;
    
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.answer;
    setIsCorrect(correct);
    
    // Stop the timer
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
    
    if (correct) {
      setScore(prevScore => prevScore + 1);
    } else {
      // Trigger life loss animation for wrong answer
      triggerLifeLossAnimation();
    }
    
    // Move to next question after delay
    setTimeout(() => {
      if (!correct && lives <= 1) {
        setIsGameOver(true);
        setShowGameOverDialog(true);
      } else if (currentQuestionIndex < shuffledQuestions.length - 1) {
        moveToNextQuestion();
      } else {
        // Quiz completed
        setIsGameOver(true);
        setShowGameOverDialog(true);
      }
    }, 1500);
  };
  
  const moveToNextQuestion = () => {
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setVisibleOpponents([]); 
    resetTimer(); // Reset timer for next question
  };
  
  const restartQuiz = () => {
    // Reshuffle questions
    setShuffledQuestions(shuffleArray([...originalQuestions]));
    // Reset state
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setLives(3);
    setVisibleOpponents([]);
    setShowDamageFlash(false);
    setLostLifeIndex(null);
    setIsGameOver(false);
    setShowGameOverDialog(false);
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
        
        {/* Competitive mode UI - timer and lives */}
        <div className="w-full max-w-lg mb-4 flex justify-between items-center">
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => {
              // Determine if this heart is the one being lost
              const isCurrentlyLost = lostLifeIndex === i;
              // Determine if this heart should be displayed (still has lives)
              const isActive = i < lives || isCurrentlyLost;
              
              return (
                <div 
                  key={i} 
                  className={`relative ${isCurrentlyLost ? 'animate-none' : ''}`}
                >
                  {isCurrentlyLost ? (
                    // Animated broken heart that falls and fades
                    <>
                      <div className="absolute">
                        <HeartCrack 
                          className="h-6 w-6 text-red-500 transform -rotate-15 animate-[fold-cards_0.5s_ease-in-out_forwards] opacity-0"
                          style={{
                            transformOrigin: 'center'
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    // Regular heart
                    <Heart 
                      className={`h-6 w-6 ${isActive ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-400" />
            <div className="w-32">
              <Progress 
                value={timerPercent} 
                className="h-2"
              >
                <span className="absolute text-xs text-white right-1">{timeRemaining}s</span>
              </Progress>
            </div>
          </div>
        </div>
        
        {/* Damage flash overlay */}
        {showDamageFlash && (
          <div 
            className="fixed inset-0 bg-red-500 bg-opacity-30 pointer-events-none z-50 animate-fade-in"
            style={{
              animation: 'fade-in 0.1s ease-in, fade-out 0.4s ease-out 0.1s forwards'
            }}
          ></div>
        )}
        
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
      
      {/* Game Over Dialog */}
      <Dialog open={showGameOverDialog} onOpenChange={setShowGameOverDialog}>
        <DialogContent className="bg-stone-800 border-amber-500">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl text-amber-400">
              {isGameOver && currentQuestionIndex >= shuffledQuestions.length - 1 
                ? "Quiz Complete!" 
                : "Game Over!"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 text-center">
            <p className="text-xl mb-2">Final Score: {score}</p>
            <p className="text-gray-300 mb-4">
              {lives > 0 
                ? "Congratulations! You completed the quiz." 
                : "You've run out of lives!"}
            </p>
            <Button 
              className="bg-amber-400 hover:bg-amber-500 text-black w-full"
              onClick={restartQuiz}
            >
              Play Again
            </Button>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Quiz;
