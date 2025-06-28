
import { useState, useEffect, useRef } from 'react';

interface SpeechSynthesisHook {
  speak: (text: string) => void;
  isSpeaking: boolean;
  cancel: () => void;
  voices: SpeechSynthesisVoice[];
}

export const useSpeechSynthesis = (): SpeechSynthesisHook => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      
      const updateVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      // Cargar voces inmediatamente si están disponibles
      updateVoices();
      
      // Escuchar cambios en las voces
      speechSynthesis.addEventListener('voiceschanged', updateVoices);

      return () => {
        speechSynthesis.removeEventListener('voiceschanged', updateVoices);
      };
    }
  }, []);

  const speak = (text: string) => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Buscar una voz en español
    const spanishVoice = voices.find(voice => 
      voice.lang.includes('es') || voice.lang.includes('ES')
    );
    
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  const cancel = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return {
    speak,
    isSpeaking,
    cancel,
    voices
  };
};
