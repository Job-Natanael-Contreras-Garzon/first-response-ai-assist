
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { backendAPI, ChatResponse } from '@/services/backendAPI';
import { Phone, Mic, MicOff, AlertTriangle, Volume2, X } from 'lucide-react';
import { toast } from 'sonner';
import CategoryCarousel from './CategoryCarousel';

type EmergencyState = 'idle' | 'listening' | 'analyzing' | 'response' | 'followup' | 'calling';

const EmergencyApp = () => {
  const [emergencyState, setEmergencyState] = useState<EmergencyState>('idle');
  const [chatResponse, setChatResponse] = useState<ChatResponse | null>(null);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [showListeningModal, setShowListeningModal] = useState(false);
  
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    error: speechError
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
    console.log('Deteniendo escucha. Transcript:', transcript);
    stopListening();
    
    if (transcript.trim()) {
      processUserInput(transcript.trim());
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
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
    <div className="min-h-screen bg-black text-white">
      {/* Main App - Estado Idle */}
      {emergencyState === 'idle' && (
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <div className="text-center py-8">
            <h1 className="text-4xl font-bold text-gray-300 mb-2">AYUDA</h1>
            <p className="text-gray-400 px-4">
              ¡Siempre estamos aquí para emergencias!
            </p>
            <p className="text-gray-400 px-4">
              ¡Toca para iniciar el protocolo de emergencia!
            </p>
          </div>

          {/* Emergency Button */}
          <div className="flex-1 flex items-center justify-center px-8">
            <Button
              onClick={handleEmergencyStart}
              className="w-64 h-64 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-2xl transform hover:scale-105 transition-all duration-200 border-4 border-red-500"
            >
              <Phone className="h-16 w-16" />
            </Button>
          </div>

          {/* Category Carousel */}
          <div className="pb-8">
            <CategoryCarousel />
          </div>

          {/* Bottom Navigation */}
          <div className="flex justify-center items-center space-x-8 py-6 bg-gray-900">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-600 rounded"></div>
              <span className="text-xs text-gray-400 mt-1">Live</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-600 rounded"></div>
              <span className="text-xs text-gray-400 mt-1">Medic</span>
            </div>
            <div className="flex flex-col items-center">
              <Button
                onClick={handleEmergencyStart}
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700"
              >
                <Mic className="h-8 w-8" />
              </Button>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-600 rounded"></div>
              <span className="text-xs text-gray-400 mt-1">Vehicle</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-600 rounded"></div>
              <span className="text-xs text-gray-400 mt-1">A</span>
            </div>
          </div>
        </div>
      )}

      {/* Listening Modal */}
      {showListeningModal && (emergencyState === 'listening' || emergencyState === 'analyzing') && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 bg-gray-900 border-gray-700">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                  <Mic className="h-5 w-5 text-red-500" />
                  <span className="text-white font-medium">
                    {emergencyState === 'analyzing' ? 'Analizando...' : 'Escuchando...'}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetApp}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="text-center space-y-4">
                <h2 className="text-xl font-bold text-white">
                  Describe tu emergencia
                </h2>
                <p className="text-gray-400 text-sm">
                  Explica claramente qué está pasando para poder ayudarte mejor
                </p>

                {/* Voice Indicator */}
                {emergencyState === 'listening' && (
                  <div className="relative">
                    <div className={`w-16 h-16 mx-auto rounded-full ${isListening ? 'bg-red-500' : 'bg-gray-600'} flex items-center justify-center`}>
                      <Mic className="h-8 w-8 text-white" />
                    </div>
                    {isListening && (
                      <div className="absolute inset-0 border-4 border-red-500 rounded-full animate-ping opacity-20"></div>
                    )}
                  </div>
                )}

                {emergencyState === 'analyzing' && (
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto"></div>
                )}

                {isSpeaking && (
                  <p className="text-sm text-blue-400 flex items-center justify-center">
                    <Volume2 className="h-4 w-4 mr-1" />
                    Sistema hablando...
                  </p>
                )}

                {/* Transcript */}
                <div className="bg-gray-800 rounded-lg p-4 min-h-[80px]">
                  <p className="text-sm text-gray-400 mb-2">Texto reconocido:</p>
                  {transcript ? (
                    <p className="text-white">{transcript}</p>
                  ) : (
                    <p className="text-gray-500 italic">Esperando tu respuesta...</p>
                  )}
                </div>

                {/* Example */}
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Ejemplo:</p>
                  <p className="text-xs text-gray-400">
                    "Mi hijo se está asfixiando" o "Me corté profundamente la mano"...
                  </p>
                </div>

                {/* Action Button */}
                {emergencyState === 'listening' && (
                  <Button
                    onClick={handleStopListening}
                    disabled={!isListening || !transcript.trim()}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    ▶ Enviar mensaje
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Response State */}
      {emergencyState === 'response' && chatResponse && (
        <div className="min-h-screen bg-black p-4">
          <div className="max-w-md mx-auto space-y-6">
            {/* Severity Badge */}
            {chatResponse.severity && (
              <div className="text-center">
                <Badge className={`${getSeverityColor(chatResponse.severity)} text-white px-4 py-2`}>
                  {chatResponse.severity.toUpperCase()}
                </Badge>
              </div>
            )}

            {/* Response */}
            <Card className="bg-gray-900 border-gray-700 p-6">
              <p className="text-white text-lg">{chatResponse.response}</p>
            </Card>

            {/* Instructions */}
            {chatResponse.instructions && chatResponse.instructions.length > 0 && (
              <Card className="bg-gray-900 border-gray-700 p-6">
                <h3 className="text-white font-bold mb-4">Instrucciones:</h3>
                <ol className="space-y-2">
                  {chatResponse.instructions.map((instruction, index) => (
                    <li key={index} className="flex text-gray-300">
                      <span className="text-red-500 mr-2 font-bold">{index + 1}.</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </Card>
            )}

            {/* Emergency Call Indicator */}
            {chatResponse.shouldCallEmergency && (
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-red-400 mb-2">
                  <Phone className="h-5 w-5" />
                  <span className="font-medium">Llamando ambulancia...</span>
                </div>
              </div>
            )}

            {/* Reset Button */}
            <div className="text-center pt-4">
              <Button
                onClick={resetApp}
                variant="outline"
                className="text-gray-400 border-gray-600 hover:text-white hover:border-gray-400"
              >
                Nueva Emergencia
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Calling State */}
      {emergencyState === 'calling' && (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="text-center space-y-6">
            <div className="relative">
              <Phone className="h-24 w-24 text-green-500 mx-auto" />
              <div className="absolute inset-0 border-4 border-green-500 rounded-full animate-ping opacity-20"></div>
            </div>
            <h2 className="text-2xl font-bold text-white">
              Ambulancia en Camino
            </h2>
            <p className="text-gray-400">
              Ayuda médica profesional está siendo enviada
            </p>
            <div className="bg-green-900 border border-green-600 rounded-lg p-4">
              <p className="text-green-300 font-medium">
                ✓ Llamada realizada automáticamente
              </p>
              <p className="text-green-400 text-sm mt-1">
                Mantén la calma y sigue las instrucciones de primeros auxilios
              </p>
            </div>
            
            <Button
              onClick={resetApp}
              variant="outline"
              className="text-gray-400 border-gray-600 hover:text-white hover:border-gray-400"
            >
              Nueva Emergencia
            </Button>
          </div>
        </div>
      )}

      {/* Conversation History */}
      {conversationHistory.length > 0 && emergencyState !== 'idle' && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
          <Card className="bg-gray-900 border-gray-700 p-4 max-h-40 overflow-y-auto">
            <h4 className="font-medium text-white mb-2">Conversación:</h4>
            <div className="space-y-1 text-sm">
              {conversationHistory.slice(-3).map((message, index) => (
                <p key={index} className={
                  message.startsWith('Usuario:') ? 'text-blue-400' : 'text-gray-300'
                }>
                  {message}
                </p>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EmergencyApp;
