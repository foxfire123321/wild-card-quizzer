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
import { LivesDisplay } from "@/components/poker/LivesDisplay";
import { useAuth } from "@/context/AuthContext";
import { recordGameplayLoop, shouldPromptLogin } from "@/utils/gameplayUtils";
import LoginPrompt from "@/components/LoginPrompt";
import { submitScoreToLeaderboard } from "@/utils/leaderboardUtils";
import { toast } from "sonner";
import OnboardingOverlay, { TooltipInfo } from "@/components/onboarding/OnboardingOverlay";
import GameLoginPrompt from "@/components/auth/GameLoginPrompt";
import { useLoginPrompt } from "@/hooks/useLoginPrompt";

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
  
  const [timeRemaining, setTimeRemaining] = useState(20);
  const [timerPercent, setTimerPercent] = useState(100);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  const [showDamageFlash, setShowDamageFlash] = useState(false);
  const [lostLifeIndex, setLostLifeIndex] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number | null>(null);
  
  const { user } = useAuth();

  const quizOneTooltips: TooltipInfo[] = [
    {
      id: "poker-table",
      title: "Poker Table",
      content: "This is where the hand is visualized. Watch how opponents act before you choose.",
      position: { top: "30%", left: "50%", transform: "translate(-50%, -50%)" },
      arrowPosition: { top: "0", left: "-40px", transform: "rotate(-45deg)" }
    },
    {
      id: "question-answers",
      title: "Question & Answer Box",
      content: "Read the situation carefully, then pick the best response.",
      position: { top: "65%", left: "50%", transform: "translate(-50%, -50%)" },
      arrowPosition: { top: "-30px", right: "20px", transform: "rotate(-90deg)" }
    },
    {
      id: "timer",
      title: "Timer Bar",
      content: "You've got 20 seconds. Don't stall.",
      position: { top: "15%", right: "20%", transform: "translate(0, 0)" },
      arrowPosition: { top: "-30px", left: "20px", transform: "rotate(90deg)" }
    },
    {
      id: "lives",
      title: "Lives",
      content: "Three lives. Wrong answer or time-out = 1 life gone.",
      position: { top: "15%", left: "20%", transform: "translate(0, 0)" },
      arrowPosition: { top: "-30px", right: "20px", transform: "rotate(90deg)" }
    }
  ];

  const { showLoginPrompt, checkAndShowPrompt, closePrompt, handleAuthAction } = 
    useLoginPrompt('quiz-one-leaderboard', '/quiz');

  useEffect(() => {
    if (originalQuestions.length > 0) {
      setShuffledQuestions(shuffleArray([...originalQuestions]));
    }
  }, [originalQuestions]);

  useEffect(() => {
    if (shuffledQuestions.length > 0 && currentQuestionIndex < shuffledQuestions.length) {
      const position = extractUserPosition(shuffledQuestions[currentQuestionIndex].question);
      setUserPosition(position);
      setVisibleOpponents([]);
      resetTimer();
    }
  }, [currentQuestionIndex, shuffledQuestions]);

  const resetTimer = () => {
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
    }
    setTimeRemaining(20);
    setTimerPercent(100);
    startTimeRef.current = Date.now();
    lastUpdateTimeRef.current = null;
    
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
    const totalDuration = 20000;
    
    const newPercent = Math.max(0, 100 - (elapsed / totalDuration) * 100);
    const newTimeRemaining = Math.max(0, Math.ceil((totalDuration - elapsed) / 1000));
    
    setTimerPercent(newPercent);
    
    if (newTimeRemaining !== timeRemaining) {
      setTimeRemaining(newTimeRemaining);
    }
    
    if (newPercent <= 0) {
      handleTimeUp();
      return;
    }
    
    if (!isGameOver && !selectedAnswer) {
      timerRef.current = requestAnimationFrame(animateTimer);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (loading || isGameOver || selectedAnswer) {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
        timerRef.current = null;
      }
    } else if (!timerRef.current && !isGameOver && !selectedAnswer) {
      resetTimer();
    }
  }, [currentQuestionIndex, loading, isGameOver, selectedAnswer]);

  const handleTimeUp = () => {
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
    
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    setSelectedAnswer(currentQuestion.answer);
    setIsCorrect(false);
    
    triggerLifeLossAnimation();
    
    setTimeout(() => {
      if (lives <= 1) {
        setIsGameOver(true);
        setShowGameOverDialog(true);
        handleGameCompletion();
      } else {
        moveToNextQuestion();
      }
    }, 1500);
  };

  useEffect(() => {
    if (shuffledQuestions.length > 0 && currentQuestionIndex < shuffledQuestions.length) {
      const currentQuestion = shuffledQuestions[currentQuestionIndex];
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
  }, [currentQuestionIndex, shuffledQuestions]);

  const triggerLifeLossAnimation = () => {
    setLostLifeIndex(lives - 1);
    setShowDamageFlash(true);
    setLives(prev => prev - 1);
    
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
    
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
    
    if (correct) {
      setScore(prevScore => prevScore + 1);
    } else {
      triggerLifeLossAnimation();
    }
    
    setTimeout(() => {
      if (!correct && lives <= 1) {
        setIsGameOver(true);
        setShowGameOverDialog(true);
        handleGameCompletion();
      } else if (currentQuestionIndex < shuffledQuestions.length - 1) {
        moveToNextQuestion();
      } else {
        setIsGameOver(true);
        setShowGameOverDialog(true);
        handleGameCompletion();
      }
    }, 1500);
  };

  const moveToNextQuestion = () => {
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setVisibleOpponents([]);
    resetTimer();
  };

  const handleGameCompletion = () => {
    const loopCount = recordGameplayLoop();
    
    if (user) {
      submitScoreToLeaderboard(user.id, 'quiz-one', score)
        .then(wasHighScore => {
          if (wasHighScore) {
            toast.success("New high score submitted to leaderboard!");
          } else {
            toast.success("Score shared to leaderboard!");
          }
        });
    } else if (shouldPromptLogin()) {
      setShowLoginPrompt(true);
    }
  };

  const restartQuiz = () => {
    setShuffledQuestions(shuffleArray([...originalQuestions]));
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

  const handleOnboardingComplete = () => {
    if (!isGameOver && !selectedAnswer) {
      resetTimer();
    }
  };

  const renderCurrentQuestion = () => {
    if (loading || shuffledQuestions.length === 0 || currentQuestionIndex >= shuffledQuestions.length) {
      return null;
    }

    const currentQuestion = shuffledQuestions[currentQuestionIndex];

    return (
      <div className="w-full h-full flex flex-col items-center">
        <h1 className="text-2xl font-bold text-amber-400 mb-2">Poker Quiz</h1>
        
        <OnboardingOverlay 
          tooltips={quizOneTooltips}
          onComplete={handleOnboardingComplete}
        />
        
        <div className="w-full max-w-lg mb-4 flex justify-between items-center">
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => {
              const isCurrentlyLost = lostLifeIndex === i;
              const isActive = i < lives || isCurrentlyLost;
              
              return (
                <div 
                  key={i} 
                  className={`relative ${isCurrentlyLost ? 'animate-none' : ''}`}
                >
                  {isCurrentlyLost ? (
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
        
        {showDamageFlash && (
          <div 
            className="fixed inset-0 bg-red-500 bg-opacity-30 pointer-events-none z-50 animate-fade-in"
            style={{
              animation: 'fade-in 0.1s ease-in, fade-out 0.4s ease-out 0.1s forwards'
            }}
          ></div>
        )}
        
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

  const renderGameOverDialog = () => (
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
          <div className="space-y-2">
            <Button 
              className="bg-amber-400 hover:bg-amber-500 text-black w-full"
              onClick={handleShareScore}
            >
              Share Your Score
            </Button>
            <Button 
              className="bg-amber-400 hover:bg-amber-500 text-black w-full"
              onClick={restartQuiz}
            >
              Play Again
            </Button>
          </div>
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
  );

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
          ) : isGameOver ? (
            <div className="text-center py-12">
              <p className="text-amber-500 text-2xl font-bold mb-4">
                {lives > 0 ? "Quiz Complete!" : "Game Over!"}
              </p>
              <p className="text-xl mb-6">Final Score: {score}</p>
              <Button 
                className="bg-amber-400 hover:bg-amber-500 text-black mr-4"
                onClick={restartQuiz}
              >
                Play Again
              </Button>
              <Button 
                variant="outline" 
                className="border-amber-400 text-amber-400"
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </div>
          ) : renderCurrentQuestion()}
        </div>
        
        {renderGameOverDialog()}
      </div>

      <GameLoginPrompt
        type="quiz-one-leaderboard"
        open={showLoginPrompt}
        onClose={closePrompt}
        onLogin={handleAuthAction}
        returnPath="/quiz"
      />
    </>
  );
};

export default Quiz;
