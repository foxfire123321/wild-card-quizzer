import { useEffect, useState } from "react";

export interface OpponentAction {
  position: string;
  action: string;
}

export interface Cards {
  player: string[];
  flop: string[];
  turn: string | null;
  river: string | null;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  opponent_actions?: OpponentAction[];
  cards?: Cards;
}

// Fisher-Yates shuffle algorithm
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const useQuizData = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again later.');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return { questions, loading, error };
};

// Extract position from question text (e.g., "You have A♠ K♠ in BTN—best move?")
export const extractUserPosition = (questionText: string): string => {
  const match = questionText.match(/in\s+(\w+)/i);
  if (match && match[1]) {
    const position = match[1].toUpperCase();
    // Default to BTN if not a valid position
    return ['BTN', 'SB', 'BB', 'UTG', 'HJ', 'CO'].includes(position) ? position : 'BTN';
  }
  return 'BTN'; // Default position
};

// Function to check if user should be prompted to login
export const shouldPromptLogin = (): boolean => {
  const today = new Date().toDateString();
  
  // Get login prompt data from localStorage
  const loginPromptData = localStorage.getItem('quizLoginPrompt');
  let promptCount = 0;
  let lastPromptDate = '';
  
  if (loginPromptData) {
    const parsedData = JSON.parse(loginPromptData);
    promptCount = parsedData.count || 0;
    lastPromptDate = parsedData.date || '';
  }
  
  // Reset counter if it's a new day
  if (lastPromptDate !== today) {
    promptCount = 0;
  }
  
  // Check if user should be prompted based on gameplay loop count
  // First time: prompt after 1 loop
  // Then: prompt every 4 loops
  return promptCount === 0 || (promptCount >= 3 && (promptCount - 1) % 4 === 0);
};

// Function to record a completed gameplay loop
export const recordGameplayLoop = (): void => {
  const today = new Date().toDateString();
  
  // Get current data
  const loginPromptData = localStorage.getItem('quizLoginPrompt');
  let promptCount = 0;
  
  if (loginPromptData) {
    const parsedData = JSON.parse(loginPromptData);
    // Reset if it's a new day
    promptCount = parsedData.date === today ? parsedData.count : 0;
  }
  
  // Increment count and save
  promptCount++;
  localStorage.setItem('quizLoginPrompt', JSON.stringify({
    count: promptCount,
    date: today
  }));
};
