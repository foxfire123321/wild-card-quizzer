import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuizData } from "@/utils/quizUtils";
import { saveQuizProgress, getQuizProgress } from "@/utils/progressUtils";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import LoginPrompt from "@/components/LoginPrompt";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

const Quiz = () => {
  const { questions, loading, error } = useQuizData();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const { user, isLoading } = useAuth();
  const [isProgressLoaded, setIsProgressLoaded] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();
  const shareUrl = window.location.href;

  useEffect(() => {
    const loadProgress = async () => {
      if (user) {
        const savedProgress = await getQuizProgress("quiz-one");
        if (savedProgress && savedProgress.lastQuestionIndex >= 0) {
          setCurrentQuestionIndex(savedProgress.lastQuestionIndex);
          setScore(savedProgress.score);
          toast.info(`Welcome back! Continuing from question ${savedProgress.lastQuestionIndex + 1} with score ${savedProgress.score}`);
        }
        setIsProgressLoaded(true);
      } else {
        setIsProgressLoaded(true);
      }
    };

    if (!isLoading) {
      loadProgress();
    }
  }, [user, isLoading]);

  const handleAnswerSelect = async (answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestionIndex].answer;
    setIsCorrect(correct);

    const newScore = correct ? score + 1 : score;
    if (correct) {
      setScore(newScore);
    }

    setTimeout(async () => {
      if (currentQuestionIndex < questions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setSelectedAnswer(null);
        setIsCorrect(null);

        if (user) {
          await saveQuizProgress("quiz-one", nextIndex, newScore);
        }
      } else {
        toast.success("Quiz completed!");
        if (user) {
          await saveQuizProgress("quiz-one", currentQuestionIndex, newScore);
        }
      }
    }, 1500);
  };

  const shareScoreToLeaderboard = (score: number) => {
    // Placeholder function to share score to leaderboard
    toast.success(`Score ${score} shared to leaderboard!`);
  };

  const handleShareScore = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    // Share score logic here
    shareScoreToLeaderboard(score);
  };

  const renderResults = () => {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center text-amber-400">Results</h2>
        <p className="text-lg text-center">
          You scored {score} out of {questions.length}
        </p>
        <div className="flex justify-center gap-4">
          <FacebookShareButton url={shareUrl} quote={`I scored ${score} on the Poker Quiz!`}>
            <FacebookIcon size={40} round />
          </FacebookShareButton>
          <TwitterShareButton url={shareUrl} title={`I scored ${score} on the Poker Quiz!`}>
            <TwitterIcon size={40} round />
          </TwitterShareButton>
          <WhatsappShareButton url={shareUrl} title={`I scored ${score} on the Poker Quiz!`}>
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>
        </div>
        
        <Button 
          onClick={handleShareScore}
          className="bg-amber-400 hover:bg-amber-500 text-black"
        >
          Share Your Score
        </Button>
        
        {showLoginPrompt && (
          <LoginPrompt
            title="Log in to Share Your Score!"
            message="Want to show off your poker skills? Log in to post your score to the global leaderboard."
            returnPath="/leaderboard"
            onClose={() => setShowLoginPrompt(false)}
          />
        )}
      </div>
    );
  };

  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{currentQuestion.question}</h2>
        <ul className="space-y-2">
          {currentQuestion.options.map((option) => (
            <li key={option}>
              <Button
                className={`w-full ${selectedAnswer === option
                  ? isCorrect
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                  : "bg-amber-400 hover:bg-amber-500"
                  }`}
                onClick={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
              >
                {option}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (isLoading || !isProgressLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-amber-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-3xl font-bold text-center text-amber-500">Poker Quiz</h1>
        {questions.length > 0 ? (
          currentQuestionIndex < questions.length ? (
            renderQuestion()
          ) : (
            renderResults()
          )
        ) : (
          <p className="text-red-500 text-center">
            {error || "No questions available."}
          </p>
        )}
        {currentQuestionIndex < questions.length && (
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
            <span>
              Question: {currentQuestionIndex + 1} / {questions.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
