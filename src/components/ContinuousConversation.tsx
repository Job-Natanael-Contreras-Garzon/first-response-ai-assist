import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChatResponse } from '@/services/backendAPI';
import { Ambulance, ArrowLeft, Home, MessageCircle, Mic, Send, User, Bot } from 'lucide-react';

interface ConversationMessage {
  id: string;
  type: 'user' | 'assistant';
  message: string;
  timestamp: Date;
}

interface ContinuousConversationProps {
  initialResponse: ChatResponse;
  conversationHistory: ConversationMessage[];
  userProfile?: {
    fullName?: string;
    bloodType?: string;
    allergies?: string[];
    emergencyContact?: string;
  } | null;
  onReset: () => void;
  onBack?: () => void;
  onHome?: () => void;
  onStartListening?: () => void;
  isListening?: boolean;
  transcript?: string;
}

const ContinuousConversation: React.FC<ContinuousConversationProps> = ({
  initialResponse,
  conversationHistory,
  onReset,
  onBack,
  onHome,
  onStartListening,
  isListening = false,
  transcript = ''
}) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);

  useEffect(() => {
    // Inicializar con la respuesta inicial si no hay historial
    if (conversationHistory.length === 0) {
      setMessages([{
        id: '1',
        type: 'assistant',
        message: initialResponse.response,
        timestamp: new Date()
      }]);
    } else {
      setMessages(conversationHistory);
    }
  }, [initialResponse, conversationHistory]);

  const callEmergency = () => {
    window.open('tel:160', '_self');
  };

  const handleGoHome = () => {
    if (onHome) {
      onHome();
    } else {
      onReset();
    }
  };

  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else {
      onReset();
    }
  };

  const handleStartListening = () => {
    if (onStartListening) {
      onStartListening();
    }
  };

  return (
    <div className="full-height bg-gradient-to-br from-sky-200 via-cyan-100 to-teal-100 flex flex-col">
      {/* Header con navegación - Versión mejorada para móviles */}
      <div className="flex justify-between items-center p-3 border-b border-cyan-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <Button
          onClick={handleGoBack}
          variant="ghost"
          size="sm"
          className="text-slate-600 hover:text-slate-800 hover:bg-white/70 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="ml-1 hidden sm:inline">Volver</span>
        </Button>
        
        <h1 className="text-base md:text-lg font-semibold text-slate-700">Conversación de Emergencia</h1>
        
        <Button
          onClick={handleGoHome}
          variant="ghost"
          size="sm"
          className="text-slate-600 hover:text-slate-800 hover:bg-white/70 rounded-full"
        >
          <Home className="h-5 w-5" />
          <span className="ml-1 hidden sm:inline">Inicio</span>
        </Button>
      </div>

      {/* Botón de emergencia fijo y prominente */}
      <div className="p-3 border-b border-cyan-200 bg-white/30">
        <Button 
          onClick={callEmergency}
          className="w-full bg-gradient-to-br from-rose-400 to-red-500 hover:from-rose-500 hover:to-red-600 text-white py-3 md:py-4 text-base md:text-lg font-bold shadow-lg rounded-xl flex items-center justify-center"
          size="lg"
        >
          <Ambulance className="w-10 h-10 md:w-12 md:h-12 mr-2 animate-pulse" />
          <span>🚨 LLAMAR EMERGENCIAS (160) 🚨</span>
        </Button>
      </div>

      {/* Área de conversación */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 pb-20">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className={`max-w-[85%] rounded-2xl p-3 shadow-md ${
              message.type === 'user' 
                ? 'bg-sky-500 text-white mr-1' 
                : 'bg-white/90 text-slate-700 border border-cyan-200 ml-1'
            }`}>
              <div className="flex items-start gap-2">
                <div className={`rounded-full p-1.5 flex-shrink-0 ${
                  message.type === 'user' ? 'bg-sky-400' : 'bg-sky-100'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-3 h-3 text-white" />
                  ) : (
                    <Bot className="w-3 h-3 text-sky-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-xs font-medium mb-0.5 ${
                    message.type === 'user' ? 'text-sky-50' : 'text-sky-600'
                  }`}>
                    {message.type === 'user' ? 'Tú' : 'Asistente de Emergencias'}
                  </p>
                  <p className="text-sm leading-relaxed">{message.message}</p>
                  <p className={`text-xs mt-1.5 text-right ${
                    message.type === 'user' ? 'text-sky-100 opacity-60' : 'text-slate-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Indicador de que está escuchando */}
        {isListening && (
          <div className="flex justify-end sticky bottom-20">
            <div className="max-w-[85%] bg-sky-100 border border-sky-300 rounded-2xl p-3 shadow-md mr-1 animate-pulse">
              <div className="flex items-center gap-2">
                <div className="bg-sky-200 rounded-full p-1.5">
                  <Mic className="w-3 h-3 text-sky-600" />
                </div>
                <p className="text-sky-700 text-sm font-medium">
                  Escuchando...
                </p>
              </div>
              {transcript && (
                <p className="text-sky-600 text-sm mt-2 pl-6 italic">
                  "{transcript}"
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Área de entrada - Versión mejorada para móviles */}
      <div className="fixed bottom-0 left-0 right-0 p-3 border-t border-cyan-200 bg-white/80 backdrop-blur-lg shadow-lg">
        <div className="max-w-md mx-auto space-y-2">
          <Button
            onClick={handleStartListening}
            disabled={isListening}
            className={`w-full py-3 md:py-4 text-base md:text-lg rounded-xl shadow-md flex items-center justify-center ${
              isListening 
                ? 'bg-sky-300 cursor-not-allowed' 
                : 'bg-sky-500 hover:bg-sky-600 text-white'
            }`}
            size="lg"
          >
            <Mic className={`${isListening ? 'animate-pulse' : ''} w-5 h-5 mr-2`} />
            {isListening ? 'Escuchando...' : 'Hacer otra pregunta'}
          </Button>
          
          <Button 
            onClick={onReset}
            variant="outline"
            className="w-full border-slate-300 text-slate-600 hover:bg-white/70 py-2.5 md:py-3 rounded-xl"
            size="default"
          >
            Nueva Emergencia
          </Button>
          
          {/* Indicador de deslizar para ver el historial */}
          <p className="text-xs text-center text-slate-500 pb-0.5">
            Desliza hacia arriba para ver el historial completo
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContinuousConversation;
