
import { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition as useReactSpeechRecognition } from 'react-speech-recognition';

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

export const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isManuallyStoppedRef = useRef(false);

  // Usar el hook oficial de react-speech-recognition
  const {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript: resetOfficialTranscript,
    listening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useReactSpeechRecognition();

  // Debug: Log todos los estados del hook oficial
  useEffect(() => {
    console.log('🔍 Estados del hook oficial:', {
      transcript: transcript || '(vacío)',
      interimTranscript: interimTranscript || '(vacío)',
      finalTranscript: finalTranscript || '(vacío)',
      listening,
      browserSupportsSpeechRecognition,
      isMicrophoneAvailable
    });
  }, [transcript, interimTranscript, finalTranscript, listening, browserSupportsSpeechRecognition, isMicrophoneAvailable]);

  // Log de navegador detectado una sola vez
  useEffect(() => {
    console.log(`🔍 Navegador detectado: ${BROWSER_INFO.browserName}`, BROWSER_INFO);
  }, []);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) return;

    // Debug: Verificar que SpeechRecognition esté disponible
    console.log('🔍 SpeechRecognition global:', {
      SpeechRecognition: typeof SpeechRecognition,
      startListening: typeof SpeechRecognition.startListening,
      stopListening: typeof SpeechRecognition.stopListening,
      browserSupportsSpeechRecognition
    });

    // Immediately request microphone permissions
    const initializeMicrophone = async () => {
      try {
        console.log('🎤 Solicitando permisos iniciales...');
        // Request microphone access upfront
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
        console.log('✅ Permisos de micrófono obtenidos exitosamente');
        
        // Detener el stream inmediatamente - solo necesitábamos el permiso
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error('❌ Error al obtener permisos de micrófono:', error);
        setHasPermission(false);
        setError('Necesitas permitir el acceso al micrófono para usar esta función. Por favor recarga la página y permite el acceso.');
      }
    };

    initializeMicrophone();
  }, [browserSupportsSpeechRecognition]);

  // Monitorear estado del micrófono
  useEffect(() => {
    if (isMicrophoneAvailable === false) {
      setHasPermission(false);
      setError('Micrófono no disponible. Verifica que esté conectado y que tengas permisos.');
    } else if (isMicrophoneAvailable === true) {
      setHasPermission(true);
      setError(null);
    }
  }, [isMicrophoneAvailable]);

  // Log de transcripción en tiempo real
  useEffect(() => {
    if (interimTranscript) {
      console.log('⏳ Texto temporal:', interimTranscript);
    }
  }, [interimTranscript]);

  useEffect(() => {
    if (finalTranscript) {
      console.log('✅ Texto final reconocido:', finalTranscript);
    }
  }, [finalTranscript]);

  // Manejo de timeouts para evitar sesiones colgadas
  useEffect(() => {
    if (listening) {
      console.log('🎤 Reconocimiento de voz iniciado');
      setError(null);
      isManuallyStoppedRef.current = false;
      
      // Timeout más corto para entorno local
      timeoutRef.current = setTimeout(() => {
        if (listening && !isManuallyStoppedRef.current) {
          console.log('⏰ Auto-deteniendo reconocimiento por timeout (15s)');
          SpeechRecognition.stopListening();
        }
      }, 15000); // 15 segundos optimizado para localhost
    } else {
      console.log('🔴 Reconocimiento de voz terminado');
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [listening]);

  const requestMicrophonePermission = async (): Promise<void> => {
    try {
      console.log('🎤 Solicitando permisos de micrófono...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      setError(null);
      console.log('✅ Permisos de micrófono concedidos');
      
      // Detener el stream inmediatamente - solo necesitábamos el permiso
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error('❌ Error solicitando permisos de micrófono:', err);
      setHasPermission(false);
      setError('Permisos de micrófono denegados. Para usar esta función en localhost, debes permitir el acceso al micrófono en tu navegador.');
    }
  };

  const startListening = async (): Promise<void> => {
    console.log('🚀 Intentando iniciar reconocimiento de voz...');
    
    // Verificar soporte del navegador
    if (!browserSupportsSpeechRecognition) {
      const errorMsg = 'Tu navegador no soporta reconocimiento de voz. Usa Chrome, Edge o Safari.';
      console.error('❌', errorMsg);
      setError(errorMsg);
      return;
    }

    console.log('✅ Navegador soporta reconocimiento de voz');
    console.log('🔍 Estado actual - isMicrophoneAvailable:', isMicrophoneAvailable);
    console.log('🔍 Estado actual - hasPermission:', hasPermission);
    console.log('🔍 Estado actual - listening:', listening);

    // Verificar que no estemos ya escuchando
    if (listening) {
      console.log('⚠️ Ya estamos escuchando, ignorando solicitud duplicada');
      return;
    }

    // Solicitar permisos si no los tenemos
    if (hasPermission !== true) {
      console.log('📋 Solicitando permisos primero...');
      await requestMicrophonePermission();
      
      // Pequeña pausa para que se actualice el estado
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verificar el estado actual después de la solicitud
      if (hasPermission === false) {
        console.log('❌ Permisos denegados, no se puede continuar');
        return;
      }
    }

    try {
      console.log('🎯 Iniciando reconocimiento de voz con librería oficial...');
      setError(null);
      isManuallyStoppedRef.current = false;
      
      // Usar la función oficial directamente
      console.log('📞 Llamando a SpeechRecognition.startListening...');
      
      SpeechRecognition.startListening({
        continuous: false, // Una sesión por vez para evitar problemas de red
        language: 'es-ES', // Idioma español
        interimResults: true // Transcripción en tiempo real
      });
      
      console.log('✅ Comando startListening ejecutado');
      
    } catch (err) {
      console.error('❌ Error al iniciar reconocimiento:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      // Manejo de errores específicos por navegador
      if (errorMessage.includes('network') || errorMessage.includes('Network')) {
        if (BROWSER_INFO.isBraveDetected) {
          setError('Error de conexión en Brave. Sigue estos pasos:\n1. Ve a brave://settings/content/microphone\n2. Agrega http://localhost:8081 a sitios permitidos\n3. Desactiva Brave Shields en localhost\n4. O usa los scripts start-brave-dev.bat incluidos');
        } else {
          setError(`Error de conexión en ${BROWSER_INFO.browserName}. Para localhost:\n1. Usa HTTPS o permite micrófono en configuraciones\n2. Prueba con los scripts incluidos: start-chrome-dev.bat\n3. Verifica que localhost esté en sitios permitidos`);
        }
      } else if (errorMessage.includes('not-allowed') || errorMessage.includes('denied')) {
        setError('Permisos de micrófono denegados. Recarga la página y permite el acceso cuando aparezca el popup.');
        setHasPermission(false);
      } else {
        if (BROWSER_INFO.isBraveDetected) {
          setError(`Error en Brave: ${errorMessage}. Soluciones:\n1. Desactiva Brave Shields para localhost\n2. Usa Chrome para desarrollo\n3. Ejecuta start-brave-dev.bat con flags especiales`);
        } else {
          setError(`Error de reconocimiento en ${BROWSER_INFO.browserName}: ${errorMessage}. Intenta:\n1. Recargar la página\n2. Verificar permisos de micrófono\n3. Usar scripts de desarrollo incluidos`);
        }
      }
    }
  };

  const stopListening = (): void => {
    console.log('🛑 Deteniendo reconocimiento de voz manualmente...');
    
    isManuallyStoppedRef.current = true;
    SpeechRecognition.stopListening();
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const resetTranscript = (): void => {
    console.log('🔄 Reiniciando transcript completamente...');
    
    // Detener cualquier reconocimiento en curso
    if (listening) {
      isManuallyStoppedRef.current = true;
      SpeechRecognition.stopListening();
    }
    
    // Limpiar todos los estados
    resetOfficialTranscript();
    setError(null);
    
    // Limpiar timeouts pendientes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const clearTranscript = (): void => {
    console.log('🧹 Limpiando transcripts...');
    resetOfficialTranscript();
  };

  return {
    isListening: listening,
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
