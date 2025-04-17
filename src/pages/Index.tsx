
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { Award } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut, isLoading } = useAuth();
  
  const handleStartQuiz = () => {
    navigate("/quiz");
  };

  const handleStartQuizTwo = () => {
    navigate("/quiz-two");
  };

  const handlePokerCompanion = () => {
    // If not logged in, show login prompt
    if (!user) {
      navigate("/auth", { state: { returnPath: "/poker-companion" } });
      return;
    }
    navigate("/poker-companion");
  };
  
  const handlePokerPersonalityQuiz = () => {
    // If not logged in, show login prompt
    if (!user) {
      navigate("/auth", { state: { returnPath: "/poker-personality-quiz" } });
      return;
    }
    navigate("/poker-personality-quiz");
  };

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      navigate("/auth");
    }
  };
  
  const handleLeaderboard = () => {
    navigate("/leaderboard");
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-amber-50 to-amber-100">
      {/* Leaderboard button */}
      <div className="absolute top-4 right-4">
        <Button
          onClick={handleLeaderboard}
          variant="outline"
          className="rounded-full p-2 h-10 w-10 border-poker-gold text-poker-gold hover:bg-amber-100"
        >
          <Award className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="text-center mb-8">
        <h1 className="text-poker-gold text-4xl md:text-5xl font-bold mb-2">
          poker gone wild
        </h1>
        <h2 className="text-poker-gold text-6xl md:text-7xl font-bold">
          quiz
        </h2>
      </div>
      
      <div className="w-48 h-48 md:w-56 md:h-56 rounded-full border-4 border-poker-gold flex items-center justify-center mb-12 overflow-hidden">
        <img 
          src="/lovable-uploads/95a79a2d-e88f-49d3-a2f6-2d7bfcb138c5.png" 
          alt="Poker Gone Wild Logo" 
          className="w-full h-full object-cover" 
        />
      </div>
      
      <div className="flex flex-col gap-4 items-center">
        <Button 
          onClick={handleStartQuiz}
          className="bg-poker-gold hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-lg text-xl w-64 transform transition-transform duration-200 hover:scale-105"
          style={{
            backgroundImage: "url('/lovable-uploads/df7d54ef-8b1b-4430-9eda-5119cbc46e14.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay"
          }}
        >
          Poker Quiz One
        </Button>
        
        <Button 
          onClick={handleStartQuizTwo}
          className="bg-poker-gold hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-lg text-xl w-64 transform transition-transform duration-200 hover:scale-105"
          style={{
            backgroundImage: "url('/lovable-uploads/df7d54ef-8b1b-4430-9eda-5119cbc46e14.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay"
          }}
        >
          Poker Quiz Two
        </Button>
        
        <Button 
          onClick={handlePokerCompanion}
          className="bg-poker-gold hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-lg text-xl w-64 transform transition-transform duration-200 hover:scale-105"
          style={{
            backgroundImage: "url('/lovable-uploads/df7d54ef-8b1b-4430-9eda-5119cbc46e14.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay"
          }}
        >
          Poker Companion
        </Button>
        
        <Button 
          onClick={handlePokerPersonalityQuiz}
          className="bg-poker-gold hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-lg text-xl w-64 transform transition-transform duration-200 hover:scale-105"
          style={{
            backgroundImage: "url('/lovable-uploads/df7d54ef-8b1b-4430-9eda-5119cbc46e14.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay"
          }}
        >
          Poker Personality Quiz
        </Button>
        
        <Button 
          onClick={handleAuthAction}
          variant="outline" 
          className="mt-4 border-poker-gold text-poker-gold hover:bg-amber-100"
        >
          {user ? 'Sign Out' : 'Sign In'}
        </Button>
      </div>
    </div>
  );
};

export default Index;
