
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

export type LoginPromptType = 'leaderboard' | 'quiz-two' | 'poker-companion' | 'personality';

interface LoginPromptConfig {
  title: string;
  message: string;
}

const PROMPT_CONFIGS: Record<LoginPromptType, LoginPromptConfig> = {
  'leaderboard': {
    title: "Log in to Share Your Score!",
    message: "Want to show off your poker skills? Log in to post your score to the global leaderboard.",
  },
  'quiz-two': {
    title: "Save Your Progress",
    message: "Sign up or log in to save your Quiz 2 results.",
  },
  'poker-companion': {
    title: "Sign In Required",
    message: "Log in to access the Poker Companion and track your sessions.",
  },
  'personality': {
    title: "Discover Your Poker Personality",
    message: "Log in to reveal your result.",
  }
};

interface LoginPromptProps {
  type: LoginPromptType;
  returnPath: string;
  onClose: () => void;
  message?: string; // Optional custom message that overrides the default
}

const LoginPrompt = ({ type, returnPath, onClose, message }: LoginPromptProps) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const config = PROMPT_CONFIGS[type];

  const handleLogin = () => {
    // Store the return path so we can redirect back after login
    sessionStorage.setItem('returnPath', returnPath);
    navigate('/auth');
    setOpen(false);
    onClose();
  };

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-stone-800 border-amber-500">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-amber-400">
            {config.title}
          </DialogTitle>
        </DialogHeader>
        
        <DialogDescription className="text-center py-4 text-white">
          {message || config.message}
        </DialogDescription>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            className="bg-amber-400 hover:bg-amber-500 text-black w-full"
            onClick={handleLogin}
          >
            Sign In / Register
          </Button>
          
          <Button 
            variant="outline" 
            className="border-amber-400 text-amber-400 hover:bg-amber-100 hover:text-amber-600 w-full"
            onClick={handleClose}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginPrompt;
