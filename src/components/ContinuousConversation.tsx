import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChatResponse } from '@/services/backendAPI';
import { Phone, ArrowLeft, Home, MessageCircle, Mic, Send, User, Bot } from 'lucide-react';

interface ConversationMessage {
  id: string;
  type: 'user' | 'assistant';
  message: string;
  timestamp: Date;
}

interface ContinuousConversationProps {
  initialResponse: ChatResponse;
  conversationHistory: ConversationMessage[];
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
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-cyan-100 to-teal-100 flex flex-col">
      {/* Header con navegación */}
      <div className="flex justify-between items-center p-4 border-b border-cyan-200 bg-white/50 backdrop-blur-sm">
        <Button
          onClick={handleGoBack}
          variant="ghost"
          size="sm"
          className="text-slate-600 hover:text-slate-800 hover:bg-white/70"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        
        <h1 className="text-lg font-semibold text-slate-700">Conversación de Emergencia</h1>
        
        <Button
          onClick={handleGoHome}
          variant="ghost"
          size="sm"
          className="text-slate-600 hover:text-slate-800 hover:bg-white/70"
        >
          <Home className="h-4 w-4 mr-2" />
          Inicio
        </Button>
      </div>

      {/* Botón de emergencia fijo y prominente */}
      <div className="p-4 border-b border-cyan-200 bg-white/30">
        <Button 
          onClick={callEmergency}
          className="w-full bg-gradient-to-br from-rose-400 to-red-500 hover:from-rose-500 hover:to-red-600 text-white py-4 text-lg font-bold shadow-lg"
          size="lg"
        >
          <Phone className="w-6 h-6 mr-3" />
          🚨 LLAMAR EMERGENCIAS (911) 🚨
        </Button>
      </div>

      {/* Área de conversación */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-4 shadow-md ${
              message.type === 'user' 
                ? 'bg-sky-500 text-white' 
                : 'bg-white/80 text-slate-700 border border-cyan-200'
            }`}>
              <div className="flex items-start space-x-2">
                <div className={`rounded-full p-1 ${
                  message.type === 'user' ? 'bg-sky-400' : 'bg-slate-200'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-slate-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm opacity-70 mb-1 ${
                    message.type === 'user' ? 'text-sky-100' : 'text-slate-500'
                  }`}>
                    {message.type === 'user' ? 'Tú' : 'Asistente de Emergencias'}
                  </p>
                  <p className="text-sm leading-relaxed">{message.message}</p>
                  <p className={`text-xs opacity-50 mt-2 ${
                    message.type === 'user' ? 'text-sky-100' : 'text-slate-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Indicador de que está escuchando */}
        {isListening && (
          <div className="flex justify-end">
            <div className="max-w-[80%] bg-sky-100 border border-sky-300 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="animate-pulse">
                  <Mic className="w-4 h-4 text-sky-600" />
                </div>
                <p className="text-sky-700 text-sm">
                  Escuchando... {transcript && `"${transcript}"`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Área de entrada */}
      <div className="p-4 border-t border-cyan-200 bg-white/50 backdrop-blur-sm">
        <div className="space-y-3">
          <Button
            onClick={handleStartListening}
            disabled={isListening}
            className={`w-full py-4 text-lg shadow-md ${
              isListening 
                ? 'bg-sky-300 cursor-not-allowed' 
                : 'bg-sky-500 hover:bg-sky-600'
            }`}
            size="lg"
          >
            <Mic className="w-5 h-5 mr-2" />
            {isListening ? 'Escuchando...' : 'Hacer otra pregunta'}
          </Button>
          
          <Button 
            onClick={onReset}
            variant="outline"
            className="w-full border-slate-300 text-slate-600 hover:bg-white/70 py-3"
            size="lg"
          >
            Nueva Emergencia
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContinuousConversation;
