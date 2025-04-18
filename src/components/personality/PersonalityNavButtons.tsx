
import { Button } from "@/components/ui/button";
import { Share2, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PersonalityType, personalityIcons } from "@/utils/personalityQuizUtils";

interface PersonalityNavButtonsProps {
  topPersonality?: PersonalityType;
}

const PersonalityNavButtons = ({ topPersonality }: PersonalityNavButtonsProps) => {
  const navigate = useNavigate();

  const handleShare = () => {
    if (!topPersonality) return;
    
    const shareText = `I'm a ${topPersonality} poker player! ${personalityIcons[topPersonality]} Take the Poker Personality Quiz to find out your style.`;
    
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

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <Button 
        onClick={() => navigate('/poker-personality-quiz')}
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
  );
};

export default PersonalityNavButtons;
