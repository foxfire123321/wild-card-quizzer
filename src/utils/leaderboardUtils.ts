
import { supabase } from "@/integrations/supabase/client";

export interface LeaderboardEntry {
  user_id: string;
  score: number;
  username: string | null;  // Will be null for anonymous users
  rank?: number;  // Added by frontend
}

/**
 * Submit a score to the leaderboard if it's higher than the user's previous score
 */
export const submitScoreToLeaderboard = async (userId: string, quizId: string, score: number): Promise<boolean> => {
  try {
    // Check if user already has a score
    const { data: existingScore } = await supabase
      .from('quiz_leaderboard')
      .select('score')
      .eq('user_id', userId)
      .eq('quiz_id', quizId)
      .single();
    
    // Only update if the new score is higher or no previous score exists
    if (!existingScore || score > existingScore.score) {
      const { error } = await supabase
        .from('quiz_leaderboard')
        .upsert({
          user_id: userId,
          quiz_id: quizId,
          score: score,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,quiz_id'
        });
      
      if (error) {
        console.error('Error submitting score:', error);
        return false;
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error submitting score:', error);
    return false;
  }
};

/**
 * Get the top scores for a quiz
 */
export const getLeaderboard = async (quizId: string, limit: number = 10): Promise<LeaderboardEntry[]> => {
  try {
    // Get top scores
    const { data, error } = await supabase
      .from('quiz_leaderboard')
      .select(`
        user_id,
        score,
        user_id
      `)
      .eq('quiz_id', quizId)
      .order('score', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
    
    // Add rank and anonymize usernames
    return data.map((entry, index) => ({
      user_id: entry.user_id,
      score: entry.score,
      username: `Player ${index + 1}`, // For now, anonymize all usernames
      rank: index + 1
    }));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};
