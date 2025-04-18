import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { Award, Trophy } from "lucide-react";
import GameLoginPrompt from "@/components/auth/GameLoginPrompt";
import { useLoginPrompt } from "@/hooks/useLoginPrompt";

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut, isLoading } = useAuth();
  const { showLoginPrompt, checkAndShowPrompt, closePrompt, handleAuthAction } = useLoginPrompt('poker-companion', '/poker-companion');

  const handleStartQuiz = () => {
    navigate("/quiz");
  };

  const handleStartQuizTwo = () => {
    navigate("/quiz-two");
  };

  const handlePokerCompanion = () => {
    if (!user) {
      checkAndShowPrompt(true);
      return;
    }
    navigate("/poker-companion");
  };

  const handlePokerPersonalityQuiz = () => {
    navigate("/poker-personality-quiz");
  };

  const handleLeaderboard = () => {
    navigate("/leaderboard");
  };
  
  const handleAchievements = () => {
    navigate("/achievements");
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-amber-50 to-amber-100">
        <div className="animate-spin h-10 w-10 border-4 border-amber-400 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-amber-50 to-amber-100">
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            onClick={handleAchievements}
            variant="outline"
            className="rounded-full p-2 h-10 w-10 border-amber-400 text-amber-400 hover:bg-amber-100"
          >
            <Trophy className="h-5 w-5" />
          </Button>
          <Button
            onClick={handleLeaderboard}
            variant="outline"
            className="rounded-full p-2 h-10 w-10 border-amber-400 text-amber-400 hover:bg-amber-100"
          >
            <Award className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="text-center mb-8 mt-[-10vh]">
          <h1 className="text-amber-500 text-4xl md:text-5xl font-bold mb-2">
            poker gone wild
          </h1>
          <h2 className="text-amber-500 text-6xl md:text-7xl font-bold">
            quiz
          </h2>
        </div>
        
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-full border-4 border-amber-500 flex items-center justify-center mb-12 overflow-hidden">
          <img 
            src="/lovable-uploads/1fcdc667-e288-446c-8967-7bdc58f5d993.png" 
            alt="Poker Gone Wild Logo" 
            className="w-full h-full object-cover" 
          />
        </div>
        
        <div className="flex flex-col gap-4 items-center">
          <Button 
            onClick={handleStartQuiz}
            className="bg-amber-400 hover:bg-amber-500 text-black font-bold py-4 px-8 rounded-lg text-xl w-64 transform transition-transform duration-200 hover:scale-105"
          >
            Poker Quiz One
          </Button>
          
          <Button 
            onClick={handleStartQuizTwo}
            className="bg-amber-400 hover:bg-amber-500 text-black font-bold py-4 px-8 rounded-lg text-xl w-64 transform transition-transform duration-200 hover:scale-105"
          >
            Poker Quiz Two
          </Button>
          
          <Button 
            onClick={handlePokerCompanion}
            className="bg-amber-400 hover:bg-amber-500 text-black font-bold py-4 px-8 rounded-lg text-xl w-64 transform transition-transform duration-200 hover:scale-105"
          >
            Poker Companion
          </Button>
          
          <Button 
            onClick={handlePokerPersonalityQuiz}
            className="bg-amber-400 hover:bg-amber-500 text-black font-bold py-4 px-8 rounded-lg text-xl w-64 transform transition-transform duration-200 hover:scale-105"
          >
            Poker Personality Quiz
          </Button>
          
          <Button 
            onClick={handleAuthAction}
            variant="outline" 
            className="mt-4 border-amber-400 text-amber-400 hover:bg-amber-100"
          >
            {user ? 'Sign Out' : 'Sign In'}
          </Button>
        </div>
      </div>
      
      <GameLoginPrompt
        type="poker-companion"
        open={showLoginPrompt}
        onClose={closePrompt}
        onLogin={handleAuthAction}
        returnPath="/poker-companion"
      />
    </>
  );
};

export default Index;
