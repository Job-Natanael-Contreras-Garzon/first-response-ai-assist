import { useState, useEffect, useRef } from 'react';

// Version de respaldo usando Web Speech API nativa
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
}

// Detectar navegador una sola vez al cargar el módulo
const detectBrowser = () => {
  const isBrave = typeof (navigator as typeof navigator & { brave?: { isBrave?: () => Promise<boolean> } }).brave !== 'undefined';
  const userAgent = navigator.userAgent;
  const isBraveDetected = isBrave || userAgent.includes('Brave');
  const isChrome = userAgent.includes('Chrome') && !isBraveDetected;
  const isEdge = userAgent.includes('Edg');
  const isFirefox = userAgent.includes('Firefox');
  
  return {
    isBraveDetected,
    isChrome,
    isEdge,
    isFirefox,
    browserName: isBraveDetected ? 'Brave' : isChrome ? 'Chrome' : isEdge ? 'Edge' : isFirefox ? 'Firefox' : 'Desconocido'
  };
};

const BROWSER_INFO = detectBrowser();

interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  startListening: () => Promise<void>;
  stopListening: () => void;
  resetTranscript: () => void;
  clearTranscript: () => void;
  browserSupportsSpeechRecognition: boolean;
  error: string | null;
  hasPermission: boolean | null;
  requestMicrophonePermission: () => Promise<void>;
}

export const useSpeechRecognitionNative = (): SpeechRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isManuallyStoppedRef = useRef(false);

  const browserSupportsSpeechRecognition = 
    'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  useEffect(() => {
    console.log(`🔍 Navegador detectado (Nativo): ${BROWSER_INFO.browserName}`, BROWSER_INFO);
  }, []);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) return;

    console.log('🔧 Inicializando Web Speech API nativa...');

    const SpeechRecognition = 
      (window as typeof globalThis & { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition || 
      window.SpeechRecognition;
    
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;

    // Configuración optimizada para localhost
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'es-ES';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('🎤 Web Speech API: Reconocimiento iniciado');
      setIsListening(true);
      setError(null);
      isManuallyStoppedRef.current = false;
      
      // Timeout más corto para entorno local
      timeoutRef.current = setTimeout(() => {
        if (recognitionRef.current && !isManuallyStoppedRef.current) {
          console.log('⏰ Auto-deteniendo reconocimiento por timeout (15s)');
          recognition.stop();
        }
      }, 15000);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let currentInterimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart + ' ';
        } else {
          currentInterimTranscript += transcriptPart;
        }
      }

      // Update interim transcript for real-time display
      setInterimTranscript(currentInterimTranscript);
      
      // Update final transcript
      if (finalTranscript) {
        setTranscript(prev => (prev + finalTranscript).trim());
        setInterimTranscript(''); // Clear interim when we have final
        console.log('✅ Texto final reconocido:', finalTranscript.trim());
      }

      if (currentInterimTranscript) {
        console.log('⏳ Texto temporal:', currentInterimTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('❌ Error en Web Speech API:', event.error);
      setIsListening(false);
      setInterimTranscript('');
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // Manejo de errores específicos
      switch (event.error) {
        case 'not-allowed':
          setError('Permisos de micrófono denegados. Recarga la página y permite el acceso al micrófono.');
          setHasPermission(false);
          break;
        case 'no-speech':
          setError('No se detectó voz. Haz clic en el micrófono e intenta hablar de nuevo.');
          break;
        case 'network':
          if (BROWSER_INFO.isBraveDetected) {
            setError('Error de conexión en Brave. Ve a brave://settings/content/microphone, agrega localhost:8081, y desactiva Brave Shields para localhost.');
          } else {
            setError('Error de conexión. Para localhost, verifica que estés usando HTTPS o que el navegador permita el micrófono en HTTP local.');
          }
          break;
        case 'aborted':
          console.log('🛑 Reconocimiento abortado por el usuario');
          break;
        case 'audio-capture':
          setError('No se puede acceder al micrófono. Verifica que esté conectado y no esté siendo usado por otra aplicación.');
          break;
        default:
          if (BROWSER_INFO.isBraveDetected) {
            setError(`Error en Brave: ${event.error}. Intenta desactivar Brave Shields para localhost o usa Chrome para desarrollo.`);
          } else {
            setError(`Error de reconocimiento: ${event.error}. Intenta de nuevo.`);
          }
      }
    };

    recognition.onend = () => {
      console.log('🔴 Web Speech API: Reconocimiento terminado');
      setIsListening(false);
      setInterimTranscript('');
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    // Solicitar permisos de micrófono inmediatamente
    const initializeMicrophone = async () => {
      try {
        console.log('🎤 Solicitando permisos iniciales...');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
        console.log('✅ Permisos de micrófono obtenidos exitosamente');
        
        // Detener el stream inmediatamente
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error('❌ Error al obtener permisos de micrófono:', error);
        setHasPermission(false);
        setError('Necesitas permitir el acceso al micrófono para usar esta función. Por favor recarga la página y permite el acceso.');
      }
    };

    initializeMicrophone();

    return () => {
      if (recognition) {
        recognition.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [browserSupportsSpeechRecognition]);

  const requestMicrophonePermission = async (): Promise<void> => {
    try {
      console.log('🎤 Solicitando permisos de micrófono...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      setError(null);
      console.log('✅ Permisos de micrófono concedidos');
      
      // Detener el stream inmediatamente
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error('❌ Error solicitando permisos de micrófono:', err);
      setHasPermission(false);
      setError('Permisos de micrófono denegados. Para usar esta función en localhost, debes permitir el acceso al micrófono en tu navegador.');
    }
  };

  const startListening = async (): Promise<void> => {
    console.log('🚀 Intentando iniciar reconocimiento de voz (Nativo)...');
    
    // Verificar soporte del navegador
    if (!browserSupportsSpeechRecognition) {
      setError('Tu navegador no soporta reconocimiento de voz. Usa Chrome, Edge o Safari.');
      return;
    }

    // Solicitar permisos si no los tenemos
    if (hasPermission !== true) {
      console.log('📋 Solicitando permisos primero...');
      await requestMicrophonePermission();
      
      if (hasPermission === false) {
        console.log('❌ Permisos denegados, no se puede continuar');
        return;
      }
    }

    // Verificar que no estemos ya escuchando
    if (isListening) {
      console.log('⚠️ Ya estamos escuchando, ignorando solicitud duplicada');
      return;
    }

    if (recognitionRef.current) {
      try {
        console.log('🎯 Iniciando Web Speech API nativa...');
        setError(null);
        setTranscript('');
        setInterimTranscript('');
        isManuallyStoppedRef.current = false;
        
        recognitionRef.current.start();
        console.log('✅ Web Speech API iniciada');
      } catch (err) {
        console.error('❌ Error al iniciar reconocimiento:', err);
        setError('No se pudo iniciar el reconocimiento de voz. Intenta de nuevo.');
      }
    } else {
      setError('Sistema de reconocimiento no disponible. Recarga la página.');
    }
  };

  const stopListening = (): void => {
    console.log('🛑 Deteniendo reconocimiento de voz manualmente...');
    
    if (recognitionRef.current) {
      isManuallyStoppedRef.current = true;
      setIsListening(false);
      recognitionRef.current.stop();
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  };

  const resetTranscript = (): void => {
    console.log('🔄 Reiniciando transcript completamente...');
    
    // Detener cualquier reconocimiento en curso
    if (recognitionRef.current && isListening) {
      isManuallyStoppedRef.current = true;
      recognitionRef.current.stop();
    }
    
    // Limpiar todos los estados
    setTranscript('');
    setInterimTranscript('');
    setError(null);
    setIsListening(false);
    
    // Limpiar timeouts pendientes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const clearTranscript = (): void => {
    console.log('🧹 Limpiando transcripts...');
    setTranscript('');
    setInterimTranscript('');
  };

  return {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    clearTranscript,
    browserSupportsSpeechRecognition,
    error,
    hasPermission,
    requestMicrophonePermission
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
    SpeechRecognition: new () => SpeechRecognition;
  }
}
