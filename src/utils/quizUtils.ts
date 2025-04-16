
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
