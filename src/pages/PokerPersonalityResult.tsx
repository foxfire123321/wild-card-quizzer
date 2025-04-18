import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { PersonalityType, savePersonalityResult } from "@/utils/personalityQuizUtils";
import LoadingSpinner from "@/components/personality/LoadingSpinner";
import PersonalityCard from "@/components/personality/PersonalityCard";
import PersonalityNavButtons from "@/components/personality/PersonalityNavButtons";
import ErrorBoundary from "@/components/personality/ErrorBoundary";
import LoginPrompt from "@/components/LoginPrompt";

interface PersonalityResultData {
  personalities: Record<PersonalityType, number>;
  topPersonalities: PersonalityType[];
}

const PokerPersonalityResult = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [result, setResult] = useState<PersonalityResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  useEffect(() => {
    const loadResult = async () => {
      if (isLoading) return;
      
      if (!user) {
        setShowLoginPrompt(true);
        return;
      }
      
      try {
        // Get result from localStorage (from completed quiz or previous fetch)
        const resultJson = localStorage.getItem('currentPersonalityResult');
        
        if (resultJson) {
          try {
            const parsedResult = JSON.parse(resultJson);
            
            if (parsedResult.topPersonalities && parsedResult.topPersonalities.length > 0) {
              // Ensure we only show at most 2 personalities
              if (parsedResult.topPersonalities.length > 2) {
                parsedResult.topPersonalities = parsedResult.topPersonalities.slice(0, 2);
              }
              
              setResult(parsedResult);
              
              // Save the result to the user's account if it's a fresh result
              if (user.id) {
                try {
                  await savePersonalityResult(user.id, parsedResult.topPersonalities);
                } catch (e) {
                  console.error("Failed to save result to account:", e);
                }
              }
            } else {
              throw new Error("Invalid personality result format");
            }
          } catch (e) {
            console.error("Failed to parse result:", e);
            setErrorMessage("Could not load your result. Please try again.");
            toast.error("Could not load your result");
            setTimeout(() => navigate('/poker-personality-quiz'), 2000);
          }
        } else {
          // If no result in localStorage, redirect to quiz
          setErrorMessage("No quiz result found. Starting quiz...");
          toast.error("No quiz result found");
          setTimeout(() => navigate('/poker-personality-quiz'), 2000);
        }
      } catch (error) {
        console.error("Error in loadResult:", error);
        setErrorMessage("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    loadResult();
  }, [isLoading, user, navigate]);
  
  if (loading || isLoading) {
    return <LoadingSpinner message="Loading your result..." />;
  }
  
  if (!result || !result.topPersonalities || !result.topPersonalities.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-amber-50 to-amber-100">
        <div className="text-center mb-8">
          <h1 className="text-poker-gold text-3xl md:text-4xl font-bold mb-6">
            {errorMessage || "No Result Found"}
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
    <ErrorBoundary>
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
      
      {showLoginPrompt && (
        <LoginPrompt
          type="personality"
          returnPath="/poker-personality-result"
          onClose={() => setShowLoginPrompt(false)}
        />
      )}
    </ErrorBoundary>
  );
};

export default PokerPersonalityResult;
