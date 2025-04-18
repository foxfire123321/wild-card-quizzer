
// Sound effect utility for the app

// Define audio objects for reuse
let audioCache: Record<string, HTMLAudioElement> = {};

// Play a sound with optional volume control
export const playSound = (soundName: string, volume: number = 0.5): void => {
  try {
    // Check if sound is already cached
    if (!audioCache[soundName]) {
      const audio = new Audio(`/sounds/${soundName}.mp3`);
      audioCache[soundName] = audio;
      
      // Set volume
      audio.volume = Math.max(0, Math.min(1, volume)); // Ensure volume is between 0 and 1
      
      // Add event listener for when sound is loaded
      audio.addEventListener('canplaythrough', () => {
        audio.play().catch(err => {
          console.error(`Error playing ${soundName}:`, err);
        });
      });
      
      // Handle loading errors
      audio.addEventListener('error', () => {
        console.error(`Failed to load sound: ${soundName}`);
        // Remove from cache if failed to load
        delete audioCache[soundName];
      });
    } else {
      // Reuse existing audio object
      const audio = audioCache[soundName];
      
      // Reset audio to beginning if it's already playing
      audio.currentTime = 0;
      
      // Update volume (in case it changed)
      audio.volume = Math.max(0, Math.min(1, volume));
      
      // Play the sound
      audio.play().catch(err => {
        console.error(`Error playing ${soundName}:`, err);
      });
    }
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

// Trigger vibration if available on the device
export const vibrate = (pattern: number | number[]): void => {
  try {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch (error) {
    console.error('Error triggering vibration:', error);
  }
};

// Sound constants
export const SOUNDS = {
  CORRECT_ANSWER: 'correct-answer',
  CHIP_SPLASH: 'chip-splash',
  CARD_FOLD: 'card-fold',
  BUTTON_CLICK: 'button-click'
};

// Clean up audio resources when needed
export const cleanupAudio = (): void => {
  Object.values(audioCache).forEach(audio => {
    audio.pause();
    audio.src = '';
  });
  audioCache = {};
};
