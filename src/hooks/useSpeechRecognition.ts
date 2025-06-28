
import { useState, useEffect, useRef } from 'react';

interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  browserSupportsSpeechRecognition: boolean;
  error: string | null;
}

export const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const browserSupportsSpeechRecognition = 
    'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) return;

    const SpeechRecognition = 
      window.webkitSpeechRecognition || window.SpeechRecognition;
    
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-ES';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('Reconocimiento de voz iniciado');
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart + ' ';
        } else {
          interimTranscript += transcriptPart;
        }
      }

      const fullTranscript = finalTranscript + interimTranscript;
      console.log('Texto reconocido:', fullTranscript);
      setTranscript(fullTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Error en reconocimiento de voz:', event.error);
      setError(`Error: ${event.error}`);
      setIsListening(false);
      
      // Reintentar automáticamente en caso de error de red
      if (event.error === 'network') {
        setTimeout(() => {
          console.log('Reintentando reconocimiento de voz...');
          setError(null);
          startListening();
        }, 2000);
      }
    };

    recognition.onend = () => {
      console.log('Reconocimiento de voz terminado');
      setIsListening(false);
    };

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [browserSupportsSpeechRecognition]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        console.log('Iniciando escucha...');
        setError(null);
        recognitionRef.current.start();
      } catch (err) {
        console.error('Error al iniciar reconocimiento:', err);
        setError('No se pudo iniciar el reconocimiento de voz');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      console.log('Deteniendo escucha...');
      recognitionRef.current.stop();
    }
  };

  const resetTranscript = () => {
    console.log('Reiniciando transcript');
    setTranscript('');
    setError(null);
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    error
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}
