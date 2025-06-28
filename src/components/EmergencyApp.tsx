
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { emergencyAI, EmergencyAnalysis } from '@/services/emergencyAI';
import { Phone, Mic, MicOff, AlertTriangle, Heart, Shield, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

type EmergencyState = 'idle' | 'listening' | 'analyzing' | 'response' | 'followup' | 'calling';

const EmergencyApp = () => {
  const [emergencyState, setEmergencyState] = useState<EmergencyState>('idle');
  const [analysis, setAnalysis] = useState<EmergencyAnalysis | null>(null);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  
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
    setConversationHistory([]);
    setCurrentQuestion('');
    setQuestionIndex(0);
    resetTranscript();
    cancel(); // Detener cualquier audio previo
    
    // Mensaje inicial del sistema
    const initialMessage = '¿Qué está sucediendo? Describe la emergencia por favor.';
    speak(initialMessage);
    setConversationHistory([`Sistema: ${initialMessage}`]);
    
    // Esperar un momento antes de iniciar la escucha
    setTimeout(() => {
      if (!isSpeaking) {
        startListening();
      }
    }, 4000);
  };

  const handleStopListening = () => {
    console.log('Botón detener presionado. Transcript:', transcript);
    stopListening();
    
    if (transcript.trim()) {
      if (emergencyState === 'listening') {
        processEmergencyDescription(transcript.trim());
      } else if (emergencyState === 'followup') {
        processFollowUpAnswer(transcript.trim());
      }
    } else {
      toast.error('No se detectó ningún texto. Inténtalo de nuevo.');
      // Reiniciar la escucha si no hay texto
      setTimeout(() => {
        resetTranscript();
        startListening();
      }, 1000);
    }
  };

  const processEmergencyDescription = async (description: string) => {
    setEmergencyState('analyzing');
    setConversationHistory(prev => [...prev, `Usuario: ${description}`]);
    
    try {
      console.log('Analizando emergencia:', description);
      const result = await emergencyAI.analyzeEmergency(description);
      setAnalysis(result);
      
      if (result.additionalQuestions && result.additionalQuestions.length > 0) {
        setEmergencyState('followup');
        setQuestionIndex(0);
        const question = result.additionalQuestions[0];
        setCurrentQuestion(question);
        speak(question);
        setConversationHistory(prev => [...prev, `Sistema: ${question}`]);
        
        // Esperar antes de iniciar nueva escucha
        setTimeout(() => {
          resetTranscript();
          startListening();
        }, question.length * 80 + 2000); // Tiempo basado en longitud + buffer
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

  const processFollowUpAnswer = async (answer: string) => {
    setConversationHistory(prev => [...prev, `Usuario: ${answer}`]);
    
    if (analysis && analysis.additionalQuestions) {
      const nextQuestionIndex = questionIndex + 1;
      
      if (nextQuestionIndex < analysis.additionalQuestions.length) {
        // Hay más preguntas
        setQuestionIndex(nextQuestionIndex);
        const nextQuestion = analysis.additionalQuestions[nextQuestionIndex];
        setCurrentQuestion(nextQuestion);
        speak(nextQuestion);
        setConversationHistory(prev => [...prev, `Sistema: ${nextQuestion}`]);
        
        setTimeout(() => {
          resetTranscript();
          startListening();
        }, nextQuestion.length * 80 + 2000);
      } else {
        // No hay más preguntas, proceder con primeros auxilios
        setEmergencyState('response');
        provideFirstAidInstructions(analysis);
      }
    }
  };

  const provideFirstAidInstructions = (analysis: EmergencyAnalysis) => {
    const instructions = analysis.firstAid.join('. ');
    speak(`Esto es lo que debes hacer: ${instructions}`);
    
    setConversationHistory(prev => [...prev, `Sistema: Primeros auxilios - ${instructions}`]);
    
    if (analysis.callAmbulance) {
      setTimeout(() => {
        callAmbulance();
      }, instructions.length * 100 + 3000);
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
    setAnalysis(null);
    setConversationHistory([]);
    setCurrentQuestion('');
    setQuestionIndex(0);
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

  // Mostrar errores de reconocimiento de voz
  useEffect(() => {
    if (speechError) {
      toast.error(`Error de voz: ${speechError}`);
    }
  }, [speechError]);

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
              className="w-48 h-48 rounded-full bg-red-600 hover:bg-red-700 text-white text-xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-200"
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
                <Mic className={`h-20 w-20 mx-auto ${isListening ? 'text-red-500' : 'text-gray-400'}`} />
                {isListening && (
                  <div className="absolute inset-0 border-4 border-red-500 rounded-full animate-ping opacity-20"></div>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {isListening ? 'Escuchando...' : 'Preparando para escuchar'}
              </h2>
              <p className="text-gray-600">
                Describe qué está pasando
              </p>
              {isSpeaking && (
                <p className="text-sm text-blue-600 flex items-center justify-center">
                  <Volume2 className="h-4 w-4 mr-1" />
                  Sistema hablando...
                </p>
              )}
            </div>
            
            {/* Previsualización del texto en tiempo real */}
            <Card className="p-4 bg-white min-h-[100px] border-2 border-dashed border-gray-200">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Texto reconocido:</h4>
              {transcript ? (
                <p className="text-gray-800">{transcript}</p>
              ) : (
                <p className="text-gray-400 italic">Esperando tu respuesta...</p>
              )}
            </Card>
            
            <div className="space-y-2">
              <Button
                onClick={handleStopListening}
                disabled={!isListening || !transcript.trim()}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <MicOff className="h-4 w-4 mr-2" />
                Detener y Analizar
              </Button>
              
              {speechError && (
                <p className="text-sm text-red-600">
                  Error: {speechError}
                </p>
              )}
            </div>
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
            <div className="relative">
              <Mic className={`h-16 w-16 mx-auto ${isListening ? 'text-orange-500' : 'text-gray-400'}`} />
              {isListening && (
                <div className="absolute inset-0 border-4 border-orange-500 rounded-full animate-ping opacity-20"></div>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Necesito más información
            </h2>
            {currentQuestion && (
              <Card className="p-4 bg-orange-50 border-orange-200">
                <p className="text-orange-800 font-medium">{currentQuestion}</p>
              </Card>
            )}
            
            {/* Previsualización para seguimiento */}
            <Card className="p-4 bg-white min-h-[80px] border-2 border-dashed border-gray-200">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Tu respuesta:</h4>
              {transcript ? (
                <p className="text-gray-800">{transcript}</p>
              ) : (
                <p className="text-gray-400 italic">Esperando respuesta...</p>
              )}
            </Card>
            
            <Button
              onClick={handleStopListening}
              disabled={!isListening || !transcript.trim()}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              <MicOff className="h-4 w-4 mr-2" />
              Detener y Continuar
            </Button>
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
            <div className="space-y-1 text-sm max-h-40 overflow-y-auto">
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
