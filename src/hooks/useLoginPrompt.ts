
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { shouldPromptLogin } from '@/utils/gameplayUtils';
import { LoginPromptType } from '@/components/auth/GameLoginPrompt';

export const useLoginPrompt = (type: LoginPromptType, returnPath?: string) => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();

  const handleAuthAction = useCallback(() => {
    navigate('/auth');
  }, [navigate]);

  const checkAndShowPrompt = useCallback((forceShow: boolean = false) => {
    const shouldShow = forceShow || (type === 'quiz-one-leaderboard' ? shouldPromptLogin() : true);
    if (shouldShow) {
      setShowLoginPrompt(true);
      return true;
    }
    return false;
  }, [type]);

  const closePrompt = useCallback(() => {
    setShowLoginPrompt(false);
  }, []);

  return {
    showLoginPrompt,
    checkAndShowPrompt,
    closePrompt,
    handleAuthAction
  };
};
