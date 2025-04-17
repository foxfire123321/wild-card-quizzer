
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Ribbon } from "lucide-react";

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
    if (!user) {
      if (window.confirm("You need to be logged in to access Poker Companion. Would you like to log in?")) {
        navigate("/auth", { state: { returnTo: "/poker-companion" } });
      }
    } else {
      navigate("/poker-companion");
    }
  };
  
  const handlePokerPersonalityQuiz = () => {
    if (!user) {
      if (window.confirm("You need to be logged in to take the Personality Quiz. Would you like to log in?")) {
        navigate("/auth", { state: { returnTo: "/poker-personality-quiz" } });
      }
    } else {
      navigate("/poker-personality-quiz");
    }
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
      <Button 
        onClick={handleLeaderboard}
        variant="ghost" 
        size="icon"
        className="absolute top-4 right-4 text-poker-gold"
      >
        <Ribbon className="h-6 w-6" />
      </Button>
      
      <div className="text-center mb-8">
        <h1 className="text-poker-gold text-4xl md:text-5xl font-bold mb-2">
          poker gone wild
        </h1>
        <h2 className="text-poker-gold text-6xl md:text-7xl font-bold">
          quiz
        </h2>
      </div>
      
      <div className="w-48 h-48 md:w-56 md:h-56 rounded-full border-4 border-poker-gold flex items-center justify-center mb-12 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 text-white">
          <span className="text-4xl font-bold">PGW</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 items-center">
        <Button 
          onClick={handleStartQuiz}
          className="bg-poker-gold hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-lg text-xl w-64 transform transition-transform duration-200 hover:scale-105"
        >
          Poker Quiz One
        </Button>
        
        <Button 
          onClick={handleStartQuizTwo}
          className="bg-poker-gold hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-lg text-xl w-64 transform transition-transform duration-200 hover:scale-105"
        >
          Poker Quiz Two
        </Button>
        
        <Button 
          onClick={handlePokerCompanion}
          className="bg-poker-gold hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-lg text-xl w-64 transform transition-transform duration-200 hover:scale-105"
        >
          Poker Companion
        </Button>
        
        <Button 
          onClick={handlePokerPersonalityQuiz}
          className="bg-poker-gold hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-lg text-xl w-64 transform transition-transform duration-200 hover:scale-105"
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
