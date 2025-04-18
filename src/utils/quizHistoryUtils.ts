
import { supabase } from "@/integrations/supabase/client";

export interface QuizHistory {
  quizId: string;
  bestScore: number;
  lastPlayed: string; // ISO date string
  totalAttempts: number;
}

// Get quiz history for a specific quiz
export const getQuizHistory = async (quizId: string): Promise<QuizHistory | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      console.log("No authenticated user for quiz history");
      return null;
    }
    
    const { data, error } = await supabase
      .from('quiz_progress')
      .select('score, updated_at')
      .eq('user_id', user.user.id)
      .eq('quiz_id', quizId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No data found
        return null;
      }
      console.error('Error fetching quiz history:', error);
      return null;
    }
    
    if (!data) return null;
    
    return {
      quizId,
      bestScore: data.score,
      lastPlayed: data.updated_at,
      totalAttempts: 1 // We don't track this yet, but could be added in the future
    };
  } catch (error) {
    console.error('Error in getQuizHistory:', error);
    return null;
  }
};

// Format the date for display
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    // Format: April 17, 2025
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Unknown date';
  }
};
