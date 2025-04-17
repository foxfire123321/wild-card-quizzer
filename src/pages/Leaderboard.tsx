
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, ArrowLeft, Medal } from "lucide-react";
import { getLeaderboard, LeaderboardEntry } from "@/utils/leaderboardUtils";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const data = await getLeaderboard('quiz-one', 20);
        setLeaderboardData(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRowStyle = (rank: number) => {
    if (rank === 1) return "bg-amber-100 text-amber-800 font-bold";
    if (rank === 2) return "bg-gray-100 text-gray-800 font-semibold";
    if (rank === 3) return "bg-amber-50 text-amber-700 font-semibold";
    return "";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-amber-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-500" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />;
    return <span className="text-gray-600">{rank}</span>;
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-8 bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="max-w-4xl w-full mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-gray-700"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Home
          </Button>
          
          <h1 className="text-2xl md:text-3xl font-bold text-poker-gold text-center">
            Poker Quiz Leaderboard
          </h1>
          
          <div className="w-10"></div> {/* Empty div for alignment */}
        </div>
        
        <Card className="shadow-md">
          <CardHeader className="bg-poker-gold text-white">
            <CardTitle className="text-center">Top Players</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin h-10 w-10 border-4 border-amber-400 border-t-transparent rounded-full"></div>
              </div>
            ) : leaderboardData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No scores yet. Be the first to submit your score!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-amber-50">
                    <TableHead className="w-16 text-center">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboardData.map((entry) => (
                    <TableRow key={entry.user_id} className={getRowStyle(entry.rank || 0)}>
                      <TableCell className="text-center font-medium">
                        {getRankIcon(entry.rank || 0)}
                      </TableCell>
                      <TableCell className="font-medium">{entry.username}</TableCell>
                      <TableCell className="text-right">{entry.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
