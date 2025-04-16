
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";

interface OpponentAction {
  position: string;
  action: string;
}

interface Cards {
  player: string[];
  flop: string[];
  turn: string | null;
  river: string | null;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  opponent_actions?: OpponentAction[];
  cards?: Cards;
}

// Map positions to indices on the table (clockwise, starting from bottom)
const positionToIndex: Record<string, number> = {
  'BTN': 0, // Bottom (user)
  'SB': 1,  // Bottom right
  'BB': 2,  // Top right
  'UTG': 3, // Top
  'HJ': 4,  // Top left
  'CO': 5,  // Bottom left
};

// Define table positions around the oval
const tablePositions = [
  { x: 50, y: 80 },  // Bottom
  { x: 75, y: 65 },  // Bottom right
  { x: 75, y: 35 },  // Top right
  { x: 50, y: 20 },  // Top
  { x: 25, y: 35 },  // Top left
  { x: 25, y: 65 }   // Bottom left
];

const Quiz = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [userPosition, setUserPosition] = useState("BTN");
  const [visibleOpponents, setVisibleOpponents] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/questions.json');
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setQuestions(data);
        setLoading(false);
        // Extract user position from the first question
        if (data.length > 0) {
          extractUserPosition(data[0].question);
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again later.');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Extract position from question text (e.g., "You have A♠ K♠ in BTN—best move?")
  const extractUserPosition = (questionText: string) => {
    const match = questionText.match(/in\s+(\w+)/i);
    if (match && match[1]) {
      const position = match[1].toUpperCase();
      if (positionToIndex.hasOwnProperty(position)) {
        setUserPosition(position);
      }
    }
  };

  // When current question changes, update the user position and reset visible opponents
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      extractUserPosition(questions[currentQuestionIndex].question);
      setVisibleOpponents([]); // Reset visible opponents for the new question
    }
  }, [currentQuestionIndex, questions]);

  // Animate opponent actions appearance
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
      if (!currentQuestion.opponent_actions) return;

      const orderedActions = getOrderedOpponentActions(
        currentQuestion.opponent_actions,
        userPosition
      );

      // Clear any existing timeouts
      const timeoutIds: number[] = [];
      
      // Show opponents one by one with delay
      orderedActions.forEach((_, index) => {
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
  }, [currentQuestionIndex, questions, userPosition]);

  const handleAnswerSelect = (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.answer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prevScore => prevScore + 1);
    }
    
    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
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

  // Arrange opponent actions in the correct order based on user position
  const getOrderedOpponentActions = (actions: OpponentAction[] | undefined, userPos: string) => {
    if (!actions) return [];
    
    const userIndex = positionToIndex[userPos];
    const orderedActions: (OpponentAction | null)[] = Array(6).fill(null);
    
    // Place actions based on position
    actions.forEach(action => {
      const posIndex = positionToIndex[action.position];
      if (posIndex !== undefined) {
        orderedActions[posIndex] = action;
      }
    });
    
    // Filter out null entries and the user's position
    return orderedActions.filter((action, index) => action !== null && index !== userIndex);
  };

  // Render cards or face-down cards
  const renderCards = (cards: string[] | undefined, faceUp: boolean = false) => {
    if (!cards || cards.length === 0) return null;
    
    return (
      <div className="flex gap-1">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className={`w-8 h-12 sm:w-10 sm:h-14 md:w-12 md:h-16 rounded-md flex items-center justify-center ${
              faceUp ? 'bg-white text-black' : 'bg-blue-700 border-2 border-white'
            }`}
          >
            {faceUp ? card : ''}
          </div>
        ))}
      </div>
    );
  };

  // Render community cards
  const renderCommunityCards = (cards?: Cards) => {
    if (!cards) return null;
    
    return (
      <div className="flex flex-col items-center gap-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {cards.flop.length > 0 && (
          <div className="flex gap-1">
            {cards.flop.map((card, index) => (
              <div key={`flop-${index}`} className="w-8 h-12 sm:w-10 sm:h-14 md:w-12 md:h-16 rounded-md bg-white flex items-center justify-center">
                {card}
              </div>
            ))}
            {cards.turn && (
              <div className="w-8 h-12 sm:w-10 sm:h-14 md:w-12 md:h-16 rounded-md bg-white flex items-center justify-center">
                {cards.turn}
              </div>
            )}
            {cards.river && (
              <div className="w-8 h-12 sm:w-10 sm:h-14 md:w-12 md:h-16 rounded-md bg-white flex items-center justify-center">
                {cards.river}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render the current question
  const renderCurrentQuestion = () => {
    if (loading || questions.length === 0 || currentQuestionIndex >= questions.length) {
      return null;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const orderedOpponentActions = getOrderedOpponentActions(
      currentQuestion.opponent_actions,
      userPosition
    );

    return (
      <div className="w-full h-full flex flex-col items-center">
        <h1 className="text-2xl font-bold text-blue-600 mb-2">Poker Quiz</h1>
        
        {/* Poker table */}
        <div className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80 mb-4">
          {/* Oval table */}
          <div className="absolute inset-5 rounded-full bg-poker-gold border-4 border-amber-800"></div>
          
          {/* User's position and cards at the bottom */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            {renderCards(currentQuestion.cards?.player, true)}
          </div>
          
          {/* Community cards in the middle */}
          {renderCommunityCards(currentQuestion.cards)}
          
          {/* Opponents around the table */}
          {tablePositions.map((pos, index) => {
            // Skip the user's position
            if (index === positionToIndex[userPosition]) return null;
            
            // Find the opponent action for this position
            const opponentActionIndex = orderedOpponentActions.findIndex(
              action => action?.position === Object.keys(positionToIndex).find(
                key => positionToIndex[key] === index
              )
            );
            
            if (opponentActionIndex < 0) return null;
            
            const opponentAction = orderedOpponentActions[opponentActionIndex];
            const isVisible = visibleOpponents.includes(opponentActionIndex);
            
            if (!opponentAction) return null;
            
            return (
              <div 
                key={`opponent-${index}`}
                className="absolute flex flex-col items-center"
                style={{ 
                  left: `${pos.x}%`, 
                  top: `${pos.y}%`, 
                  transform: 'translate(-50%, -50%)' 
                }}
              >
                {isVisible && (
                  <div className="bg-amber-300 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md text-xs mb-1 min-w-16 sm:min-w-20 text-center animate-fade-in">
                    {opponentAction.action}
                  </div>
                )}
                <div className="flex flex-col items-center">
                  {renderCards(['', ''])}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Question and answers */}
        <div className="w-full max-w-lg">
          <h2 className="text-lg font-medium mb-3 text-center">
            {currentQuestion.question}
          </h2>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
                className={`h-14 text-lg transition-colors ${
                  selectedAnswer === option 
                    ? isCorrect 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                    : 'bg-poker-gold hover:bg-amber-600'
                }`}
              >
                {option}
                {selectedAnswer === option && (
                  <span className="ml-2">
                    {isCorrect ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                  </span>
                )}
              </Button>
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-lg font-bold">
              Score: {score}/{currentQuestionIndex + (isCorrect ? 1 : 0)}
            </div>
            <Button 
              variant="outline" 
              className="border-poker-gold text-poker-gold hover:bg-poker-gold hover:text-white"
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-10 w-10 border-4 border-poker-gold border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading questions...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <Button 
              className="mt-4 bg-poker-gold hover:bg-amber-600"
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
