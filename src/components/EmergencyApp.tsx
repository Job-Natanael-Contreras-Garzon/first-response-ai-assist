
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { backendAPI, ChatResponse } from '@/services/backendAPI';
import { AlertTriangle } from 'lucide-react';
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
      
      // If instructions are provided, speak them too
      if (response.instructions && response.instructions.length > 0) {
        setTimeout(() => {
          const instructionsText = `Instrucciones: ${response.instructions!.join('. ')}`;
          speak(instructionsText);
          setConversationHistory(prev => [...prev, `Sistema: ${instructionsText}`]);
        }, response.response.length * 80 + 2000);
      }
      
      // Call emergency if needed
      if (response.shouldCallEmergency) {
        setTimeout(() => {
          callAmbulance();
        }, (response.response.length + (response.instructions?.join(' ').length || 0)) * 100 + 4000);
      }
      
    } catch (error) {
      console.error('Error al procesar entrada del usuario:', error);
      toast.error('Error al procesar la emergencia');
      setEmergencyState('idle');
      setShowListeningModal(false);
    }
  };

  const handleSimulateEmergency = (text: string) => {
    console.log('Simulando emergencia:', text);
    setShowListeningModal(false);
    processUserInput(text);
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
          <div className="pb-6">
            <TestSimulator onSimulate={handleSimulateEmergency} />
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
    </ResponsiveLayout>
  );
};

export default EmergencyApp;
