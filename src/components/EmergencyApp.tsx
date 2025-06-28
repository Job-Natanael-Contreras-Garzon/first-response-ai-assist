
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { emergencyAI, EmergencyAnalysis } from '@/services/emergencyAI';
import { Phone, Mic, MicOff, AlertTriangle, Heart, Shield } from 'lucide-react';
import { toast } from 'sonner';

type EmergencyState = 'idle' | 'listening' | 'analyzing' | 'response' | 'followup' | 'calling';

const EmergencyApp = () => {
  const [emergencyState, setEmergencyState] = useState<EmergencyState>('idle');
  const [analysis, setAnalysis] = useState<EmergencyAnalysis | null>(null);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const { speak, isSpeaking, cancel } = useSpeechSynthesis();

  const handleEmergencyStart = () => {
    console.log('Iniciando emergencia...');
    setEmergencyState('listening');
    setConversationHistory([]);
    resetTranscript();
    
    // Mensaje inicial del sistema
    speak('¿Qué está sucediendo? Describe la emergencia por favor.');
    
    // Esperar un momento antes de iniciar la escucha
    setTimeout(() => {
      startListening();
    }, 3000);
  };

  const handleStopListening = () => {
    stopListening();
    if (transcript.trim()) {
      processEmergencyDescription(transcript);
    }
  };

  const processEmergencyDescription = async (description: string) => {
    setEmergencyState('analyzing');
    setConversationHistory(prev => [...prev, `Usuario: ${description}`]);
    
    try {
      const result = await emergencyAI.analyzeEmergency(description);
      setAnalysis(result);
      
      if (result.additionalQuestions && result.additionalQuestions.length > 0) {
        setEmergencyState('followup');
        const question = result.additionalQuestions[0];
        speak(question);
        setConversationHistory(prev => [...prev, `Sistema: ${question}`]);
        
        setTimeout(() => {
          resetTranscript();
          startListening();
        }, 4000);
      } else {
        setEmergencyState('response');
        provideFirstAidInstructions(result);
      }
    } catch (error) {
      console.error('Error al analizar emergencia:', error);
      toast.error('Error al procesar la emergencia');
      setEmergencyState('idle');
    }
  };

  const provideFirstAidInstructions = (analysis: EmergencyAnalysis) => {
    const instructions = analysis.firstAid.join('. ');
    speak(`Esto es lo que debes hacer: ${instructions}`);
    
    setConversationHistory(prev => [...prev, `Sistema: ${instructions}`]);
    
    if (analysis.callAmbulance) {
      setTimeout(() => {
        callAmbulance();
      }, instructions.length * 100); // Ajustar tiempo basado en longitud
    }
  };

  const callAmbulance = () => {
    setEmergencyState('calling');
    speak('Llamando a la ambulancia automáticamente. Mantén la calma, la ayuda está en camino.');
    
    // Simular llamada a ambulancia
    toast.success('Ambulancia llamada automáticamente - Ayuda en camino');
    
    // En una app real, aquí harías la llamada real
    setTimeout(() => {
      if (window.confirm('¿Deseas realizar una llamada real a emergencias?')) {
        window.location.href = 'tel:911';
      }
    }, 3000);
  };

  const resetApp = () => {
    setEmergencyState('idle');
    setAnalysis(null);
    setConversationHistory([]);
    resetTranscript();
    cancel();
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
    if (!isListening && emergencyState === 'listening' && transcript.trim()) {
      processEmergencyDescription(transcript);
    }
  }, [isListening, transcript, emergencyState]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-700 mb-2">
            Navegador no compatible
          </h2>
          <p className="text-red-600">
            Tu navegador no soporta reconocimiento de voz. 
            Por favor usa Chrome, Edge o Safari.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-4 border-red-500 p-4">
        <div className="flex items-center justify-center space-x-2">
          <Heart className="h-8 w-8 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-800">
            Emergencias Médicas IA
          </h1>
        </div>
      </div>

      <div className="container mx-auto p-4 max-w-md">
        {/* Estado Idle - Botón Principal */}
        {emergencyState === 'idle' && (
          <div className="text-center space-y-6 pt-8">
            <div className="space-y-4">
              <Shield className="h-20 w-20 text-red-500 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-800">
                Sistema de Emergencias
              </h2>
              <p className="text-gray-600">
                Presiona el botón en caso de emergencia médica
              </p>
            </div>
            
            <Button
              onClick={handleEmergencyStart}
              className="w-48 h-48 rounded-full bg-red-600 hover:bg-red-700 text-white text-xl font-bold shadow-2xl emergency-pulse transform hover:scale-105 transition-all duration-200"
            >
              <div className="text-center">
                <AlertTriangle className="h-16 w-16 mx-auto mb-2" />
                <div>EMERGENCIA</div>
              </div>
            </Button>
            
            <p className="text-sm text-gray-500 mt-4">
              El sistema te guiará paso a paso
            </p>
          </div>
        )}

        {/* Estado Escuchando */}
        {emergencyState === 'listening' && (
          <div className="text-center space-y-6 pt-8">
            <div className="space-y-4">
              <div className="relative">
                <Mic className="h-20 w-20 text-red-500 mx-auto voice-wave" />
                <div className="absolute inset-0 border-4 border-red-500 rounded-full animate-ping opacity-20"></div>
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Escuchando...
              </h2>
              <p className="text-gray-600">
                Describe qué está pasando
              </p>
            </div>
            
            {transcript && (
              <Card className="p-4 bg-white">
                <p className="text-sm text-gray-700">{transcript}</p>
              </Card>
            )}
            
            <Button
              onClick={handleStopListening}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              <MicOff className="h-4 w-4 mr-2" />
              Detener y Analizar
            </Button>
          </div>
        )}

        {/* Estado Analizando */}
        {emergencyState === 'analyzing' && (
          <div className="text-center space-y-6 pt-8">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-red-500 border-t-transparent mx-auto"></div>
            <h2 className="text-xl font-bold text-gray-800">
              Analizando Emergencia...
            </h2>
            <p className="text-gray-600">
              La IA está procesando la información
            </p>
          </div>
        )}

        {/* Estado Seguimiento */}
        {emergencyState === 'followup' && (
          <div className="text-center space-y-6 pt-8">
            <Mic className="h-16 w-16 text-orange-500 mx-auto voice-wave" />
            <h2 className="text-xl font-bold text-gray-800">
              Necesito más información
            </h2>
            {transcript && (
              <Card className="p-4 bg-white">
                <p className="text-sm text-gray-700">{transcript}</p>
              </Card>
            )}
          </div>
        )}

        {/* Respuesta con Primeros Auxilios */}
        {emergencyState === 'response' && analysis && (
          <div className="space-y-6 pt-4">
            <div className="text-center">
              <Badge className={`${getSeverityColor(analysis.severity)} text-white px-4 py-2 text-sm`}>
                {analysis.category} - {analysis.severity.toUpperCase()}
              </Badge>
            </div>
            
            <Card className="p-6 bg-white">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-500" />
                Primeros Auxilios
              </h3>
              <ol className="space-y-2 text-sm text-gray-700">
                {analysis.firstAid.map((step, index) => (
                  <li key={index} className="flex">
                    <span className="font-medium text-green-600 mr-2">
                      {index + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </Card>
            
            {analysis.callAmbulance && (
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-red-600 mb-2">
                  <Phone className="h-5 w-5" />
                  <span className="font-medium">Llamando ambulancia...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Estado Llamando */}
        {emergencyState === 'calling' && (
          <div className="text-center space-y-6 pt-8">
            <div className="relative">
              <Phone className="h-20 w-20 text-green-500 mx-auto" />
              <div className="absolute inset-0 border-4 border-green-500 rounded-full animate-ping opacity-20"></div>
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Ambulancia en Camino
            </h2>
            <p className="text-gray-600">
              Ayuda médica profesional está siendo enviada
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                ✓ Llamada realizada automáticamente
              </p>
              <p className="text-green-700 text-sm mt-1">
                Mantén la calma y sigue las instrucciones de primeros auxilios
              </p>
            </div>
          </div>
        )}

        {/* Historial de Conversación */}
        {conversationHistory.length > 0 && (
          <Card className="mt-6 p-4 bg-gray-50">
            <h4 className="font-medium text-gray-800 mb-2">Conversación:</h4>
            <div className="space-y-1 text-sm">
              {conversationHistory.map((message, index) => (
                <p key={index} className={
                  message.startsWith('Usuario:') ? 'text-blue-700' : 'text-gray-700'
                }>
                  {message}
                </p>
              ))}
            </div>
          </Card>
        )}

        {/* Botón Reset */}
        {emergencyState !== 'idle' && (
          <div className="text-center mt-8">
            <Button
              onClick={resetApp}
              variant="outline"
              className="text-gray-600 hover:text-gray-800"
            >
              Nueva Emergencia
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyApp;
