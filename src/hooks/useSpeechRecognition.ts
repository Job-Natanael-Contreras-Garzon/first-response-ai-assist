
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
  const retryCountRef = useRef(0);
  const maxRetries = 3;

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
      retryCountRef.current = 0; // Reset retry count on successful start
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
      setIsListening(false);
      
      // Handle different types of errors
      if (event.error === 'network') {
        retryCountRef.current++;
        
        if (retryCountRef.current <= maxRetries) {
          setError(`Error de conexión. Reintentando... (${retryCountRef.current}/${maxRetries})`);
          setTimeout(() => {
            console.log(`Reintentando reconocimiento de voz... (intento ${retryCountRef.current})`);
            if (recognitionRef.current && retryCountRef.current <= maxRetries) {
              try {
                recognitionRef.current.start();
              } catch (err) {
                console.error('Error al reintentar:', err);
                setError('No se pudo reiniciar el reconocimiento de voz');
              }
            }
          }, 2000);
        } else {
          setError('Error de conexión persistente. Por favor verifica tu conexión a internet y presiona el botón de emergencia nuevamente.');
          retryCountRef.current = 0;
        }
      } else if (event.error === 'not-allowed') {
        setError('Micrófono no permitido. Por favor permite el acceso al micrófono y recarga la página.');
      } else if (event.error === 'no-speech') {
        setError('No se detectó voz. Habla más fuerte o acércate al micrófono.');
      } else {
        setError(`Error: ${event.error}`);
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
        retryCountRef.current = 0; // Reset retry count when manually starting
        recognitionRef.current.start();
      } catch (err) {
        console.error('Error al iniciar reconocimiento:', err);
        setError('No se pudo iniciar el reconocimiento de voz. Por favor recarga la página.');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      console.log('Deteniendo escucha...');
      retryCountRef.current = maxRetries + 1; // Prevent further retries
      recognitionRef.current.stop();
    }
  };

  const resetTranscript = () => {
    console.log('Reiniciando transcript');
    setTranscript('');
    setError(null);
    retryCountRef.current = 0;
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
