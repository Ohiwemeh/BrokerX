import { useRef, useCallback } from 'react';

export const useNotificationSound = () => {
  const playSound = useCallback(() => {
    try {
      // Use Web Audio API to create a beep sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configure the beep sound
      oscillator.frequency.value = 800; // Frequency in Hz
      oscillator.type = 'sine'; // Sine wave for smooth sound
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); // Volume
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5); // Duration 0.5 seconds

      console.log('🔔 Notification sound played');
    } catch (error) {
      console.error('Error playing notification sound:', error);
      // Fallback: try to use a simple beep
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe77OeeSwwPUKXh8LZjHAU5kdXzzHksBSR3x/DdkEALFF+z6eyrVRQKRp/g8r5sIQYtg87y2Ik2CBhnu+znm0sMD1Cl4fC2YxwGOZHV88x5LAUkd8fw3ZBACxRfs+nsq1UUCkaf4PK+bCEGLYPO8tmJNggYZ7vs55tLDA9QpeHwtmMcBjmR1fPMeSwFJHfH8N2QQAsUX7Pp7KtVFApGn+DyvmwhBi2DzvLZiTYIGGe77OebSwwPUKXh8LZjHAY5kdXzzHksBSR3x/DdkEALFF+z6eyrVRQKRp/g8r5sIQYtg87y2Yk2CBhnu+znm0sMD1Cl4fC2YxwGOZHV88x5LAUkd8fw3ZBACxRfs+nsq1UUCkaf4PK+bCEGLYPO8tmJNggYZ7vs55tLDA9QpeHwtmMcBjmR1fPMeSwFJHfH8N2QQAsUX7Pp7KtVFApGn+DyvmwhBi2DzvLZiTYIGGe77OebSwwPUKXh8LZjHAY5kdXzzHksBSR3x/DdkEALFF+z6eyrVRQKRp/g8r5sIQYtg87y2Yk2CBhnu+znm0sMD1Cl4fC2YxwGOZHV88x5LAUkd8fw3ZBACxRfs+nsq1UUCkaf4PK+bCEGLYPO8tmJNggYZ7vs55tLDA9QpeHwtmMcBjmR1fPMeSwFJHfH8N2QQAsUX7Pp7KtVFApGn+DyvmwhBi2DzvLZiTYIGGe77OebSwwPUKXh8LZjHAY5kdXzzHksBSR3x/DdkEALFF+z6eyrVRQKRp/g8r5sIQYtg87y2Yk2CBhnu+znm0sMD1Cl4fC2YxwGOZHV88x5LAUkd8fw3ZBACxRfs+nsq1UUCkaf4PK+bCEGLYPO8tmJNggYZ7vs55tLDA9QpeHwtmMcBjmR1fPMeSwFJHfH8N2QQAsUX7Pp7KtVFApGn+DyvmwhBi2DzvLZiTYIGGe77OebSwwPUKXh8LZjHAY5kdXzzHksBSR3x/DdkEALFF+z6eyrVRQKRp/g8r5sIQYtg87y2Yk2CBhnu+znm0sMD1Cl4fC2YxwGOZHV88x5LAUkd8fw3ZBACxRfs+nsq1UUCkaf4PK+bCEGLYPO');
        audio.volume = 0.3;
        audio.play().catch(() => {});
      } catch (e) {
        console.log('Fallback beep also failed');
      }
    }
  }, []);

  return { playSound };
};
