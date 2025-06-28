
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
  const maxRetries = 2; // Reducido para evitar loops infinitos
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const browserSupportsSpeechRecognition = 
    'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) return;

    const SpeechRecognition = 
      window.webkitSpeechRecognition || window.SpeechRecognition;
    
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;

    recognition.continuous = false; // Cambiado a false para evitar problemas de red
    recognition.interimResults = true;
    recognition.lang = 'es-ES';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('Reconocimiento de voz iniciado');
      setIsListening(true);
      setError(null);
      
      // Auto-stop después de 30 segundos para evitar problemas de red
      timeoutRef.current = setTimeout(() => {
        if (recognitionRef.current && isListening) {
          console.log('Auto-deteniendo reconocimiento por timeout');
          recognition.stop();
        }
      }, 30000);
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
      setTranscript(fullTranscript.trim());
    };

    recognition.onerror = (event: any) => {
      console.error('Error en reconocimiento de voz:', event.error);
      setIsListening(false);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // Handle different types of errors with less aggressive retrying
      if (event.error === 'network' && retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        setError(`Reintentando conexión... (${retryCountRef.current}/${maxRetries})`);
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
        }, 3000); // Aumentado el delay entre reintentos
      } else if (event.error === 'not-allowed') {
        setError('Micrófono no permitido. Por favor permite el acceso al micrófono y recarga la página.');
      } else if (event.error === 'no-speech') {
        setError('No se detectó voz. Por favor habla más claro.');
      } else if (event.error === 'network') {
        setError('Error de conexión. Verifica tu conexión a internet.');
        retryCountRef.current = maxRetries + 1; // Stop retrying
      } else {
        setError(`Error de reconocimiento de voz: ${event.error}`);
      }
    };

    recognition.onend = () => {
      console.log('Reconocimiento de voz terminado');
      setIsListening(false);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    return () => {
      if (recognition) {
        recognition.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [browserSupportsSpeechRecognition]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        console.log('Iniciando escucha...');
        setError(null);
        retryCountRef.current = 0;
        setTranscript(''); // Limpiar transcript al iniciar
        recognitionRef.current.start();
      } catch (err) {
        console.error('Error al iniciar reconocimiento:', err);
        setError('No se pudo iniciar el reconocimiento de voz.');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      console.log('Deteniendo escucha...');
      retryCountRef.current = maxRetries + 1; // Prevent further retries
      recognitionRef.current.stop();
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
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
