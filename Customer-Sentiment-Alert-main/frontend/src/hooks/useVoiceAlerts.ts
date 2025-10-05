import { useRef, useEffect, useState, useCallback } from 'react';

interface VoiceAlertsOptions {
  enabled: boolean;
  onlyHighSeverity?: boolean;
}

export function useVoiceAlerts(options: VoiceAlertsOptions) {
  const { enabled, onlyHighSeverity = true } = options;
  const hasSpokenRef = useRef(new Set<number>());
  // State to hold and manage the preferred voice once loaded
  const [preferredVoice, setPreferredVoice] = useState<SpeechSynthesisVoice | null>(null);

  // 1. Voice Loading and Caching
  useEffect(() => {
    const handleVoicesChanged = () => {
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') || 
        voice.name.includes('Samantha') // Add a common Mac voice as a backup
      );
      if (selectedVoice) {
        setPreferredVoice(selectedVoice);
      } else if (voices.length > 0) {
        // Fallback to the first available voice
        setPreferredVoice(voices[0]);
      }
    };

    // Attach the event listener to ensure voices are loaded
    if ('speechSynthesis' in window) {
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      // Call it once immediately in case voices are already loaded
      handleVoicesChanged();
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      }
    };
  }, []); // Run only once on mount

  // 2. The core speak function (Memoized for stability)
  const speak = useCallback((text: string) => {
    // Check for both user setting and browser API support
    if (!enabled || !('speechSynthesis' in window)) {
      return;
    }

    // Cancel any ongoing speech to prioritize the new alert
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1; // Slightly faster
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    // Apply the preferred voice if it has been loaded
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, [enabled, preferredVoice]); // Re-create if enabled status or preferred voice changes

  // 3. Alert announcement logic
  const announceAlert = (severity: string, alertId: number) => {
    // Prevent announcing the same alert twice
    if (hasSpokenRef.current.has(alertId)) {
      return;
    }

    hasSpokenRef.current.add(alertId);

    // Clean up old IDs to prevent memory leak (Improved logic)
    if (hasSpokenRef.current.size > 100) {
      const idsToKeep = Array.from(hasSpokenRef.current).slice(-50);
      hasSpokenRef.current.clear();
      idsToKeep.forEach(id => hasSpokenRef.current.add(id));
    }

    let message = '';
    
    switch (severity.toLowerCase()) {
      case 'critical':
        message = 'Critical alert detected! Immediate action required.';
        break;
      case 'high':
        message = 'High priority alert detected.';
        break;
      case 'medium':
        if (!onlyHighSeverity) {
          message = 'Medium priority alert.';
        }
        break;
      case 'low':
        if (!onlyHighSeverity) {
          message = 'New alert detected.';
        }
        break;
      default:
        // No message for unknown severity
        return;
    }

    if (message) {
      speak(message);
    }
  };

  // 4. Test function
  const testVoice = () => {
    speak('Voice alerts are now enabled. You will be notified of critical sentiment.');
  };

  return { announceAlert, testVoice, speak };
}