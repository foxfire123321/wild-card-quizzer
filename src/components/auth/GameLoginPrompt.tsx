
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export type LoginPromptType = 'quiz-one-leaderboard' | 'quiz-two-progress' | 'poker-companion' | 'personality-quiz';

interface GameLoginPromptProps {
  type: LoginPromptType;
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
  returnPath?: string;
}

const PROMPT_CONTENT = {
  'quiz-one-leaderboard': {
    title: 'Log in to Share Your Score!',
    message: 'Want to show off your poker skills? Log in to post your score to the global leaderboard.',
    cancelText: 'Cancel'
  },
  'quiz-two-progress': {
    title: 'Save Your Progress',
    message: 'Sign up or log in to save your Quiz 2 results.',
    cancelText: 'Cancel'
  },
  'poker-companion': {
    title: 'Sign In Required',
    message: 'Log in to access the Poker Companion and track your sessions.',
    cancelText: 'Cancel'
  },
  'personality-quiz': {
    title: 'Discover Your Poker Personality',
    message: 'Log in to reveal your result.',
    cancelText: 'Back to Main Menu'
  }
};

const GameLoginPrompt = ({ type, open, onClose, onLogin, returnPath }: GameLoginPromptProps) => {
  const navigate = useNavigate();
  const content = PROMPT_CONTENT[type];
  
  const handleCancel = () => {
    if (type === 'personality-quiz') {
      navigate('/');
    }
    onClose();
  };

  const handleLogin = () => {
    sessionStorage.setItem('returnPath', returnPath || '');
    onLogin();
  };

  return (
    <Dialog open={open} onOpenChange={open => !open && handleCancel()}>
      <DialogContent className="bg-stone-800 border-amber-500">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-amber-400">
            {content.title}
          </DialogTitle>
        </DialogHeader>
        
        <DialogDescription className="text-center py-4 text-white">
          {content.message}
        </DialogDescription>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            className="bg-amber-400 hover:bg-amber-500 text-black w-full"
            onClick={handleLogin}
          >
            Log In or Sign Up
          </Button>
          
          <Button 
            variant="outline" 
            className="border-amber-400 text-amber-400 hover:bg-amber-100 hover:text-amber-600 w-full"
            onClick={handleCancel}
          >
            {content.cancelText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GameLoginPrompt;
