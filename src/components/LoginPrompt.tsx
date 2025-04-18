
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { recordLoginPrompt } from '@/utils/gameplayUtils';

interface LoginPromptProps {
  message: string;
  returnPath: string;
  onClose: () => void;
}

const LoginPrompt = ({ message, returnPath, onClose }: LoginPromptProps) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Record that we prompted the user to login
    recordLoginPrompt();
  }, []);

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
            Ready to save your progress?
          </DialogTitle>
        </DialogHeader>
        
        <DialogDescription className="text-center py-4 text-white">
          {message}
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
            Continue Without Signing In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginPrompt;
