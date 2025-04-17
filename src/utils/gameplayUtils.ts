
/**
 * Utilities for tracking gameplay sessions and login prompts
 */

// Key for storing gameplay loop counts in localStorage
const GAMEPLAY_LOOP_KEY = 'poker_quiz_gameplay_loops';
const LAST_LOGIN_PROMPT_KEY = 'poker_quiz_last_login_prompt';

/**
 * Increment the gameplay loop counter for the current day
 */
export const recordGameplayLoop = (): number => {
  const today = new Date().toDateString();
  const storedData = localStorage.getItem(GAMEPLAY_LOOP_KEY);
  
  let gameplayData: Record<string, number> = {};
  
  if (storedData) {
    try {
      gameplayData = JSON.parse(storedData);
    } catch (e) {
      console.error("Error parsing gameplay data", e);
    }
  }
  
  // Increment the counter for today
  const currentCount = gameplayData[today] || 0;
  gameplayData[today] = currentCount + 1;
  
  // Save updated data
  localStorage.setItem(GAMEPLAY_LOOP_KEY, JSON.stringify(gameplayData));
  
  return gameplayData[today];
};

/**
 * Check if we should prompt the user to login based on their gameplay history
 */
export const shouldPromptLogin = (): boolean => {
  // Get today's gameplay count
  const today = new Date().toDateString();
  const storedData = localStorage.getItem(GAMEPLAY_LOOP_KEY);
  
  if (!storedData) return true;
  
  try {
    const gameplayData = JSON.parse(storedData);
    const todayCount = gameplayData[today] || 0;
    
    // Check if last login prompt was today
    const lastPromptData = localStorage.getItem(LAST_LOGIN_PROMPT_KEY);
    
    if (lastPromptData) {
      const { date, count } = JSON.parse(lastPromptData);
      
      // If we already prompted today and it wasn't 4 gameplay loops ago, don't prompt
      if (date === today && todayCount - count < 4) {
        return false;
      }
    }
    
    // Prompt on 1st, 5th, 9th, etc. gameplay loop
    return todayCount === 1 || todayCount % 4 === 1;
    
  } catch (e) {
    console.error("Error checking login prompt status", e);
    return true;
  }
};

/**
 * Record that we prompted the user to login
 */
export const recordLoginPrompt = (): void => {
  const today = new Date().toDateString();
  const storedData = localStorage.getItem(GAMEPLAY_LOOP_KEY);
  
  if (storedData) {
    try {
      const gameplayData = JSON.parse(storedData);
      const todayCount = gameplayData[today] || 0;
      
      localStorage.setItem(LAST_LOGIN_PROMPT_KEY, JSON.stringify({
        date: today,
        count: todayCount
      }));
    } catch (e) {
      console.error("Error recording login prompt", e);
    }
  }
};
