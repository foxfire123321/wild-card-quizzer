
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { HomeIcon, Medal } from "lucide-react";

interface LeaderboardEntry {
  user_id: string;
  username: string;
  score: number;
  rank: number;
}

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        
        // Fetch top scores for Quiz 1
        const { data, error } = await supabase
          .from('quiz_progress')
          .select('user_id, score')
          .eq('quiz_id', 'quiz')  // 'quiz' is the id for Quiz 1
          .order('score', { ascending: false })
          .limit(20);
        
        if (error) {
          throw error;
        }

        // Transform the data and add ranks
        const leaderboardWithRanks = data.map((entry, index) => {
          return {
            user_id: entry.user_id,
            username: `Player ${index + 1}`, // Anonymized ID for now
            score: entry.score,
            rank: index + 1
          };
        });

        setLeaderboard(leaderboardWithRanks);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        toast.error('Failed to fetch leaderboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <HomeIcon className="h-4 w-4" />
            Back to Main Menu
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-poker-gold">
            Leaderboard
          </h1>
          <div className="w-[100px]"></div> {/* Spacer for center alignment */}
        </div>

        <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-amber-100 py-4">
            <CardTitle className="text-center text-2xl text-poker-gold">
              Quiz 1 Top Scores
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin h-10 w-10 border-4 border-amber-400 border-t-transparent rounded-full"></div>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No scores recorded yet. Be the first to submit your score!
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                <div className="grid grid-cols-12 py-4 px-6 bg-amber-50 font-semibold text-gray-700">
                  <div className="col-span-2 text-center">Rank</div>
                  <div className="col-span-6">Player</div>
                  <div className="col-span-4 text-right">Score</div>
                </div>
                
                {leaderboard.map((entry) => (
                  <div 
                    key={entry.user_id}
                    className="grid grid-cols-12 py-4 px-6 items-center hover:bg-gray-50 transition-colors"
                  >
                    <div className="col-span-2 text-center">
                      {entry.rank <= 3 ? (
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full">
                          {entry.rank === 1 && <span className="text-2xl">🥇</span>}
                          {entry.rank === 2 && <span className="text-2xl">🥈</span>}
                          {entry.rank === 3 && <span className="text-2xl">🥉</span>}
                        </span>
                      ) : (
                        <span className="text-gray-500">{entry.rank}</span>
                      )}
                    </div>
                    <div className="col-span-6 font-medium truncate">
                      {entry.username}
                    </div>
                    <div className="col-span-4 text-right font-bold text-amber-600">
                      {entry.score}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
