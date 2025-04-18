
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  PersonalityType,
  personalityDescriptions,
  personalityIcons,
  savePersonalityResult
} from "@/utils/personalityQuizUtils";
import { Share2, RotateCcw } from "lucide-react";

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
          // User not logged in, redirect to quiz
          navigate('/poker-personality-quiz');
          return;
        }
        
        // First try to get result from localStorage (from just completed quiz)
        const resultJson = localStorage.getItem('currentPersonalityResult');
        if (resultJson) {
          try {
            const parsedResult = JSON.parse(resultJson);
            
            // Limit to top 2 personalities if there are more than 2 tied
            if (parsedResult.topPersonalities && parsedResult.topPersonalities.length > 2) {
              parsedResult.topPersonalities = parsedResult.topPersonalities.slice(0, 2);
            }
            
            setResult(parsedResult);
            // Save the result if it was just completed
            await savePersonalityResult(user.id, parsedResult.topPersonalities);
            // Clear from localStorage after saving
            localStorage.removeItem('currentPersonalityResult');
          } catch (e) {
            console.error("Failed to parse result:", e);
            toast.error("Could not load your result");
            navigate('/poker-personality-quiz');
          }
        } else {
          // If no result in localStorage, the user might be accessing directly
          // In this case, redirect them to take the quiz
          toast.error("No quiz result found");
          navigate('/poker-personality-quiz');
        }
        setLoading(false);
      }
    };
    
    loadResult();
  }, [isLoading, user, navigate]);
  
  const handleTakeAgain = () => {
    navigate('/poker-personality-quiz');
  };
  
  const handleShare = () => {
    if (!result || !result.topPersonalities.length) return;
    
    const personalityName = result.topPersonalities[0];
    const shareText = `I'm a ${personalityName} poker player! ${personalityIcons[personalityName]} Take the Poker Personality Quiz to find out your style.`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Poker Personality',
        text: shareText,
        url: window.location.origin + '/poker-personality-quiz',
      })
      .catch((error) => {
        console.error('Error sharing:', error);
        toast.error('Failed to share result');
        
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(shareText)
          .then(() => toast.success('Copied to clipboard!'))
          .catch(() => toast.error('Could not copy to clipboard'));
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(shareText)
        .then(() => toast.success('Copied to clipboard!'))
        .catch(() => toast.error('Could not copy to clipboard'));
    }
  };
  
  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-amber-50 to-amber-100">
        <div className="animate-spin h-10 w-10 border-4 border-amber-400 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-gray-600">Loading your result...</p>
      </div>
    );
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
          <Button 
            onClick={() => navigate('/poker-personality-quiz')}
            className="bg-poker-gold hover:bg-amber-600 text-white"
          >
            Take the Quiz
          </Button>
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
            <Card key={personality} className="overflow-hidden">
              <div className="bg-poker-gold text-white p-4 text-center">
                <h2 className="text-2xl md:text-3xl font-bold">
                  {personalityIcons[personality]} {personality}
                </h2>
              </div>
              
              <CardContent className="pt-6 pb-6">
                {/* Personality icon */}
                <div className="w-full h-48 bg-amber-100 rounded-lg mb-6 flex items-center justify-center">
                  <span className="text-6xl">{personalityIcons[personality]}</span>
                </div>
                
                <p className="text-gray-700 text-lg leading-relaxed">
                  {personalityDescriptions[personality]}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button 
            onClick={handleTakeAgain}
            className="bg-poker-gold hover:bg-amber-600 text-white"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Take it Again
          </Button>
          
          <Button 
            onClick={handleShare}
            className="bg-poker-gold hover:bg-amber-600 text-white"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share Your Result
          </Button>
          
          <Button 
            onClick={() => navigate('/')}
            variant="outline" 
            className="border-poker-gold text-poker-gold"
          >
            Back to Main Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PokerPersonalityResult;
