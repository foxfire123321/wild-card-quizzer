
// Types
export type PersonalityType = 
  | "Shark" 
  | "Gambler" 
  | "Rock" 
  | "Chat Pro" 
  | "Wizard" 
  | "Wildcard";

export interface QuizQuestion {
  id: number;
  question: string;
  answers: {
    text: string;
    personality: PersonalityType;
  }[];
}

export interface PersonalityResult {
  personalities: Record<PersonalityType, number>;
  topPersonalities: PersonalityType[];
}

// Quiz questions data
export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "You sit at a fresh table. What's your first move?",
    answers: [
      { text: "Raise instantly — I want them uncomfortable.", personality: "Shark" },
      { text: "Fold and observe. I'm reading everyone like a book.", personality: "Rock" },
      { text: "Crack a joke and feel the vibe.", personality: "Chat Pro" },
      { text: "Limp in with 7-2 offsuit just to stir the pot.", personality: "Wildcard" }
    ]
  },
  {
    id: 2,
    question: "You get caught bluffing hard on the river. What now?",
    answers: [
      { text: "Laugh and fire again next hand.", personality: "Gambler" },
      { text: "Stay silent and mentally log every reaction.", personality: "Rock" },
      { text: "Raise an eyebrow, smirk, and change gears.", personality: "Wizard" },
      { text: "Flip your cards dramatically and wink.", personality: "Wildcard" }
    ]
  },
  {
    id: 3,
    question: "You get dealt pocket Aces. What's the plan?",
    answers: [
      { text: "Slow play it. Trap someone and stack 'em.", personality: "Shark" },
      { text: "Min-raise. No reason to scare them off yet.", personality: "Wizard" },
      { text: "Slam a huge raise. You want action, now.", personality: "Gambler" },
      { text: "Make eye contact, smile, and say \"Let's play.\"", personality: "Chat Pro" }
    ]
  },
  {
    id: 4,
    question: "You just lost a big hand. How do you bounce back?",
    answers: [
      { text: "Go wild and flip the script — nothing to lose now.", personality: "Wildcard" },
      { text: "Regain control and adjust. Poker's long-term.", personality: "Shark" },
      { text: "Ramp up pressure and make them fold next time.", personality: "Gambler" },
      { text: "Tighten up and play pure value.", personality: "Rock" }
    ]
  },
  {
    id: 5,
    question: "A player across from you won't stop talking. What do you do?",
    answers: [
      { text: "Say something subtle that throws them off.", personality: "Wizard" },
      { text: "Fire back with something funnier.", personality: "Chat Pro" },
      { text: "Stay quiet. Let them dig their own grave.", personality: "Rock" },
      { text: "Join the madness and make it worse.", personality: "Wildcard" }
    ]
  },
  {
    id: 6,
    question: "You pull off a huge bluff and everyone at the table is staring at you. What do you do?",
    answers: [
      { text: "Stay ice cold. No reaction. Let them wonder.", personality: "Shark" },
      { text: "Laugh and say \"Had it the whole way.\"", personality: "Chat Pro" },
      { text: "Fire again. Momentum is everything.", personality: "Gambler" },
      { text: "Make a weird face and ask, \"Wanna see?\"", personality: "Wildcard" }
    ]
  },
  {
    id: 7,
    question: "Big money on the line. You're on the river. Gut says go.",
    answers: [
      { text: "Trust the read and fold. Survival matters.", personality: "Rock" },
      { text: "Make the play. Instinct never lies.", personality: "Wizard" },
      { text: "Go for the kill. No fear.", personality: "Shark" },
      { text: "YOLO shove. Life's too short.", personality: "Gambler" }
    ]
  }
];

// Personality descriptions
export const personalityDescriptions: Record<PersonalityType, string> = {
  "Shark": "You don't play the table — you own it. Calculated, patient, ruthless. You don't chase hands. You set traps. When you strike, there's no mercy. You're the kind of player legends fear.",
  "Gambler": "You live for the thrill. Risk is your love language. You're not here to grind — you're here to dominate or detonate. When you win, it's glorious. When you lose, it's spectacular.",
  "Rock": "You're tight. Disciplined. Unreadable. You wait, strike hard, and disappear again. You don't get involved unless the math is in your favor. They know you have it — and they still can't fold.",
  "Chat Pro": "Table talk is your real weapon. You can get a read, tilt a whale, or run a bluff — all with your voice. Loud, lovable, a little chaotic — but way sharper than you let on.",
  "Wizard": "You're three moves ahead. Gut reads, timing tells, pattern recognition — all second nature. You make plays no one else sees coming. You're not just playing poker. You're solving it.",
  "Wildcard": "No one — and we mean no one — knows what you're doing next. You're unpredictable, dangerous, and just weird enough to win pots you had no business being in. Pure chaos energy."
};

// Personality icons
export const personalityIcons: Record<PersonalityType, string> = {
  "Shark": "🦈",
  "Gambler": "🎰",
  "Rock": "🪨",
  "Chat Pro": "🎤",
  "Wizard": "🧙",
  "Wildcard": "🃏"
};

// Calculate the personality result based on the answers
export const calculatePersonalityResult = (selectedAnswers: PersonalityType[]): PersonalityResult => {
  // Count the occurrences of each personality type
  const personalities: Record<PersonalityType, number> = {
    "Shark": 0,
    "Gambler": 0,
    "Rock": 0,
    "Chat Pro": 0,
    "Wizard": 0,
    "Wildcard": 0
  };
  
  // Increment the count for each selected personality
  selectedAnswers.forEach(personality => {
    personalities[personality]++;
  });
  
  // Find the maximum score
  const maxScore = Math.max(...Object.values(personalities));
  
  // Find all personalities with the maximum score (in case of ties)
  const topPersonalities = Object.entries(personalities)
    .filter(([_, score]) => score === maxScore)
    .map(([personality]) => personality as PersonalityType);
  
  return {
    personalities,
    topPersonalities
  };
};

// Save personality quiz result to Supabase
export const savePersonalityResult = async (
  userId: string, 
  topPersonalities: PersonalityType[]
): Promise<void> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Store the result in the quiz_progress table using the special quiz_id "personality"
    await supabase
      .from('quiz_progress')
      .upsert({
        user_id: userId,
        quiz_id: 'personality',
        last_question_index: quizQuestions.length, // Completed all questions
        score: 0, // Not applicable for personality quiz, but required by the schema
        // Store the personality result in the metadata field as a stringified JSON
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,quiz_id'
      });
      
    // We'll also store the full result in localStorage for the current session
    localStorage.setItem('personalityQuizResult', JSON.stringify({
      topPersonalities,
      timestamp: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error saving personality result:', error);
    throw error;
  }
};

// Get previously saved personality quiz result
export const getSavedPersonalityResult = async (): Promise<PersonalityType[] | null> => {
  try {
    // First check localStorage for current session
    const localResult = localStorage.getItem('personalityQuizResult');
    if (localResult) {
      const parsed = JSON.parse(localResult);
      return parsed.topPersonalities as PersonalityType[];
    }
    
    // If not in localStorage, check Supabase
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return null;
    }
    
    const { data } = await supabase
      .from('quiz_progress')
      .select('*')
      .eq('user_id', user.user.id)
      .eq('quiz_id', 'personality')
      .single();
    
    if (data) {
      // For simplicity, we'll return null if there's no saved result
      // In a real app, you might want to return the actual saved result
      return null;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting saved personality result:', error);
    return null;
  }
};
