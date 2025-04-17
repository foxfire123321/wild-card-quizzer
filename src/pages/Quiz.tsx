
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import PokerTable from "@/components/poker/PokerTable";
import AnswerOptions from "@/components/poker/AnswerOptions";
import { useQuizData, extractUserPosition, Question, shouldPromptLogin, recordGameplayLoop } from "@/utils/quizUtils";
import { shuffleArray } from "@/utils/arrayUtils";
import { LivesDisplay } from "@/components/poker/LivesDisplay";
import { useAuth } from "@/context/AuthContext";
import LoginPrompt from "@/components/LoginPrompt";
import { toast } from "sonner";

const Quiz = () => {
  const { questions: originalQuestions, loading, error } = useQuizData();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [userPosition, setUserPosition] = useState("BTN");
  const [visibleOpponents, setVisibleOpponents] = useState<number[]>([]);
  const { user } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (originalQuestions.length > 0) {
      // Shuffle the order of questions
      const shuffledQuestions = shuffleArray([...originalQuestions]);
      setQuestions(shuffledQuestions);
    }
  }, [originalQuestions]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const position = extractUserPosition(questions[currentQuestionIndex].question);
      setUserPosition(position);
      setVisibleOpponents([]); // Reset visible opponents for the new question
    }
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
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
  }, [currentQuestionIndex, questions]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestionIndex].answer;
    setIsCorrect(correct);

    if (!correct) {
      setLives(prevLives => prevLives - 1);
    }

    setTimeout(() => {
      if (correct) {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setVisibleOpponents([]); // Reset visible opponents for the new question
        } else {
          handleGameComplete();
        }
      } else {
        if (lives <= 1) {
          setGameOver(true);
          handleGameComplete();
        } else {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setVisibleOpponents([]); // Reset visible opponents for the new question
        }
      }
    }, 1500);
  };

  const handleGameComplete = () => {
    if (!user) {
      recordGameplayLoop();
      if (shouldPromptLogin()) {
        setShowLoginPrompt(true);
      }
    }
    if (gameOver) {
      toast.error("Game Over!");
    } else {
      toast.success("Quiz completed!");
    }
  };

  const resetGame = () => {
    setLives(3);
    setGameOver(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setVisibleOpponents([]); // Reset visible opponents for the new game
    if (originalQuestions.length > 0) {
      // Shuffle the order of questions
      const shuffledQuestions = shuffleArray([...originalQuestions]);
      setQuestions(shuffledQuestions);
    }
  };

  const renderCurrentQuestion = () => {
    if (loading || questions.length === 0 || currentQuestionIndex >= questions.length) {
      return null;
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
      <div className="w-full h-full flex flex-col items-center">
        <h1 className="text-2xl font-bold text-amber-400 mb-2">Poker Quiz One</h1>

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
            shuffleOptions={true}
          />

          <div className="flex justify-between items-center">
            <LivesDisplay lives={lives} />
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
          ) : gameOver ? (
            <div className="text-center py-12">
              <p className="text-red-500">Game Over!</p>
              <Button
                className="mt-4 bg-amber-400 hover:bg-amber-500 text-black"
                onClick={resetGame}
              >
                Play Again
              </Button>
            </div>
          ) : (
            renderCurrentQuestion()
          )}
        </div>
      </div>

      {showLoginPrompt && (
        <LoginPrompt
          message="Sign in to save your progress and appear on the leaderboard!"
          returnPath="/quiz"
          onClose={() => setShowLoginPrompt(false)}
        />
      )}
    </>
  );
};

export default Quiz;
