
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut, isLoading } = useAuth();
  
  // Redirect unauthenticated users to auth page
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  const handleStartQuiz = () => {
    navigate("/quiz");
  };

  const handleStartQuizTwo = () => {
    navigate("/quiz-two");
  };

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      navigate("/auth");
    }
  };
  
  // Show loading state while checking authentication
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
      <div className="text-center mb-8">
        <h1 className="text-poker-gold text-4xl md:text-5xl font-bold mb-2">
          poker gone wild
        </h1>
        <h2 className="text-poker-gold text-6xl md:text-7xl font-bold">
          quiz
        </h2>
      </div>
      
      <div className="w-48 h-48 md:w-56 md:h-56 rounded-full border-4 border-poker-gold flex items-center justify-center mb-12">
        <div className="text-poker-gold text-5xl font-bold italic">Logo</div>
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
