import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { backendAPI, ChatResponse } from '@/services/backendAPI';
import { AlertTriangle, Phone } from 'lucide-react';
import { toast } from 'sonner';
import CategoryCarousel from './CategoryCarousel';
import EmergencyButton from './EmergencyButton';
import ListeningModal from './ListeningModal';
import EmergencyResponse from './EmergencyResponse';
import CallingScreen from './CallingScreen';
import ConversationHistory from './ConversationHistory';
import BottomNavigation from './BottomNavigation';
import ResponsiveLayout from './ResponsiveLayout';
import TestSimulator from './TestSimulator';

type EmergencyState = 'idle' | 'listening' | 'analyzing' | 'response' | 'followup' | 'calling';

const EmergencyApp = () => {
  const [emergencyState, setEmergencyState] = useState<EmergencyState>('idle');
  const [chatResponse, setChatResponse] = useState<ChatResponse | null>(null);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [showListeningModal, setShowListeningModal] = useState(false);
  
  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    clearTranscript,
    browserSupportsSpeechRecognition,
    error: speechError,
    hasPermission,
    requestMicrophonePermission
  } = useSpeechRecognition();

  const { speak, isSpeaking, cancel } = useSpeechSynthesis();

  const handleEmergencyStart = () => {
    console.log('Iniciando emergencia...');
    setEmergencyState('listening');
    setShowListeningModal(true);
    setConversationHistory([]);
    resetTranscript();
    cancel();
    
    // Reset backend session
    backendAPI.resetSession();
    
    const initialMessage = 'Describe tu emergencia. Explica claramente qué está pasando para poder ayudarte mejor.';
    speak(initialMessage);
    setConversationHistory([`Sistema: ${initialMessage}`]);
    
    setTimeout(() => {
      if (!isSpeaking) {
        startListening();
      }
    }, 4000);
  };

  const handleStopListening = () => {
    const finalText = (transcript + ' ' + interimTranscript).trim();
    console.log('Deteniendo escucha. Texto final:', finalText);
    stopListening();
    
    if (finalText) {
      processUserInput(finalText);
    } else {
      toast.error('No se detectó ningún texto. Inténtalo de nuevo.');
      setTimeout(() => {
        resetTranscript();
        startListening();
      }, 1000);
    }
  };

  const processUserInput = async (userInput: string) => {
    setEmergencyState('analyzing');
    setConversationHistory(prev => [...prev, `Usuario: ${userInput}`]);
    
    try {
      console.log('Procesando entrada del usuario:', userInput);
      const response = await backendAPI.sendMessage(userInput);
      setChatResponse(response);
      
      setEmergencyState('response');
      
      // Speak the response
      speak(response.response);
      setConversationHistory(prev => [...prev, `Sistema: ${response.response}`]);
      
    } catch (error) {
      console.error('Error al procesar entrada del usuario:', error);
      toast.error('No se pudo conectar con el servicio de emergencias. Verifica tu conexión a internet.');
      setEmergencyState('idle');
      setShowListeningModal(false);
    }
  };

  const handleSimulateEmergency = (text: string) => {
    console.log('Simulando emergencia:', text);
    setShowListeningModal(false);
    processUserInput(text);
  };

  // Función para probar la conectividad con el backend
  const handleTestConnection = async () => {
    try {
      toast.loading('Probando conectividad con el backend...');
      const isConnected = await backendAPI.testConnection();
      if (isConnected) {
        toast.success('✅ Conectividad exitosa con el backend');
      } else {
        toast.error('❌ Error de conectividad. Usando respuestas locales.');
      }
    } catch (error) {
      console.error('Error al probar conectividad:', error);
      toast.error('❌ Error al probar la conectividad');
    }
  };

  const callAmbulance = () => {
    setEmergencyState('calling');
    const message = 'Llamando a la ambulancia automáticamente. Mantén la calma, la ayuda está en camino.';
    speak(message);
    
    toast.success('Ambulancia llamada automáticamente - Ayuda en camino');
    
    setTimeout(() => {
      if (window.confirm('¿Deseas realizar una llamada real a emergencias?')) {
        window.location.href = 'tel:911';
      }
    }, 5000);
  };

  const resetApp = () => {
    console.log('Reiniciando aplicación');
    setEmergencyState('idle');
    setChatResponse(null);
    setConversationHistory([]);
    setShowListeningModal(false);
    resetTranscript();
    cancel();
    backendAPI.resetSession();
  };

  useEffect(() => {
    if (speechError) {
      toast.error(`Error de voz: ${speechError}`);
    }
  }, [speechError]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md bg-gray-900 border-gray-700">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-400 mb-2">
            Navegador no compatible
          </h2>
          <p className="text-gray-300">
            Tu navegador no soporta reconocimiento de voz. 
            Por favor usa Chrome, Edge o Safari.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <ResponsiveLayout hasBottomNav={emergencyState === 'idle'}>
      {/* Main App - Estado Idle */}
      {emergencyState === 'idle' && (
        <>
          {/* Header */}
          <div className="text-center py-6 sm:py-8 px-4">
            <h1 className="text-responsive-xl font-bold text-gray-300 mb-2">AYUDA</h1>
            <p className="text-gray-400 px-4 text-sm sm:text-base">
              ¡Siempre estamos aquí para emergencias!
            </p>
            <p className="text-gray-400 px-4 text-sm sm:text-base">
              ¡Toca para iniciar el protocolo de emergencia!
            </p>
          </div>

          {/* Emergency Button */}
          <div className="flex-1 flex items-center justify-center px-8 my-8">
            <EmergencyButton onEmergencyStart={handleEmergencyStart} />
          </div>

          {/* Category Carousel */}
          <div className="pb-6">
            <CategoryCarousel />
          </div>

          {/* Test Simulator - Solo visible en desarrollo */}
          <div className="pb-6 space-y-4">
            <TestSimulator onSimulate={handleSimulateEmergency} />
            
            {/* Botón de prueba de conectividad - temporal */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">🔧 Test de Conectividad</h3>
              <Button 
                onClick={handleTestConnection}
                variant="outline"
                size="sm"
                className="text-blue-700 border-blue-300 hover:bg-blue-100"
              >
                Probar Backend API
              </Button>
              <p className="text-xs text-blue-600 mt-2">
                Verifica si el backend está funcionando correctamente
              </p>
            </div>
          </div>

          {/* Bottom Navigation */}
          <BottomNavigation onEmergencyStart={handleEmergencyStart} />
        </>
      )}

      {/* Listening Modal */}
      <ListeningModal
        isOpen={showListeningModal && (emergencyState === 'listening' || emergencyState === 'analyzing')}
        emergencyState={emergencyState}
        isListening={isListening}
        isSpeaking={isSpeaking}
        transcript={transcript}
        interimTranscript={interimTranscript}
        onStopListening={handleStopListening}
        onClose={resetApp}
        error={speechError}
        hasPermission={hasPermission}
        onRequestPermission={requestMicrophonePermission}
      />

      {/* Response State */}
      {emergencyState === 'response' && chatResponse && (
        <EmergencyResponse 
          chatResponse={chatResponse}
          onReset={resetApp}
        />
      )}

      {/* Calling State */}
      {emergencyState === 'calling' && (
        <CallingScreen onReset={resetApp} />
      )}

      {/* Conversation History */}
      <ConversationHistory 
        conversationHistory={conversationHistory}
        emergencyState={emergencyState}
      />

      {/* Botón fijo de emergencias - Siempre visible */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={callAmbulance}
          className="bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16 shadow-lg flex items-center justify-center"
          size="lg"
        >
          <Phone className="w-6 h-6" />
        </Button>
        <div className="text-center mt-2">
          <span className="text-xs text-red-600 font-medium bg-white px-2 py-1 rounded-full shadow-sm">
            911
          </span>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default EmergencyApp;
