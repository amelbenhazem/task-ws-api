// Create an audio context for playing sounds
let audioContext: AudioContext | null = null;

// Initialize audio context on user interaction
const initializeAudioContext = () => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
};

// Function to play a notification sound
export const playNotificationSound = async () => {
  try {
    if (!audioContext) {
      initializeAudioContext();
    }

    if (audioContext) {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configure sound
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      // Play sound
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};

// Initialize audio context on page load
if (typeof window !== 'undefined') {
  window.addEventListener('click', initializeAudioContext, { once: true });
} 