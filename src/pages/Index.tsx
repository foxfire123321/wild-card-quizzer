
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate("/quiz");
  };

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
      
      <Button 
        onClick={handleStartQuiz}
        className="bg-poker-gold hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-lg text-xl w-64 transform transition-transform duration-200 hover:scale-105"
      >
        Poker Quiz One
      </Button>
    </div>
  );
};

export default Index;
