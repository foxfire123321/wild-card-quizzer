
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { PersonalityType, savePersonalityResult } from "@/utils/personalityQuizUtils";
import LoadingSpinner from "@/components/personality/LoadingSpinner";
import PersonalityCard from "@/components/personality/PersonalityCard";
import PersonalityNavButtons from "@/components/personality/PersonalityNavButtons";

interface PersonalityResultData {
  personalities: Record<PersonalityType, number>;
  topPersonalities: PersonalityType[];
}

const PokerPersonalityResult = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [result, setResult] = useState<PersonalityResultData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadResult = async () => {
      if (!isLoading) {
        if (!user) {
          navigate('/poker-personality-quiz');
          return;
        }
        
        const resultJson = localStorage.getItem('currentPersonalityResult');
        if (resultJson) {
          try {
            const parsedResult = JSON.parse(resultJson);
            
            if (parsedResult.topPersonalities && parsedResult.topPersonalities.length > 2) {
              parsedResult.topPersonalities = parsedResult.topPersonalities.slice(0, 2);
            }
            
            setResult(parsedResult);
            await savePersonalityResult(user.id, parsedResult.topPersonalities);
            localStorage.removeItem('currentPersonalityResult');
          } catch (e) {
            console.error("Failed to parse result:", e);
            toast.error("Could not load your result");
            navigate('/poker-personality-quiz');
          }
        } else {
          toast.error("No quiz result found");
          navigate('/poker-personality-quiz');
        }
        setLoading(false);
      }
    };
    
    loadResult();
  }, [isLoading, user, navigate]);
  
  if (loading || isLoading) {
    return <LoadingSpinner message="Loading your result..." />;
  }
  
  if (!result || !result.topPersonalities.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-amber-50 to-amber-100">
        <div className="text-center mb-8">
          <h1 className="text-poker-gold text-3xl md:text-4xl font-bold mb-6">
            No Result Found
          </h1>
          <p className="text-gray-700 mb-8">
            We couldn't find your quiz result. Please try taking the quiz again.
          </p>
          <PersonalityNavButtons />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-poker-gold text-3xl md:text-4xl font-bold mb-2">
            Your Poker Personality
          </h1>
          
          {result.topPersonalities.length > 1 ? (
            <p className="text-gray-600 text-lg">
              It's a tie! You have multiple personality traits
            </p>
          ) : null}
        </div>
        
        <div className="space-y-8 mb-8">
          {result.topPersonalities.map((personality) => (
            <PersonalityCard key={personality} personality={personality} />
          ))}
        </div>
        
        <PersonalityNavButtons topPersonality={result.topPersonalities[0]} />
      </div>
    </div>
  );
};

export default PokerPersonalityResult;
