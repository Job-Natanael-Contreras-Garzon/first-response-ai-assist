import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';

interface ConversationHistoryProps {
  conversationHistory: string[];
  emergencyState: string;
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({ 
  conversationHistory, 
  emergencyState 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll al último mensaje
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationHistory]);

  if (conversationHistory.length === 0 || emergencyState === 'idle') {
    return null;
  }
  
  // Determinar la posición adecuada según el estado de la emergencia
  const isInListeningMode = emergencyState === 'listening' || emergencyState === 'analyzing';
  const bottomPosition = isInListeningMode ? 'bottom-32' : 'bottom-20';
  
  // Determinar si estamos en una conversación continua (más de 2 mensajes)
  const isInContinuousConversation = conversationHistory.length > 2;

  return (
    <div className={`fixed ${bottomPosition} left-2 right-2 max-w-md mx-auto z-10`}>
      <Card className={`bg-white/95 backdrop-blur-sm border-cyan-200 p-3 max-h-44 overflow-y-auto shadow-lg rounded-xl ${isInContinuousConversation ? 'border-l-4 border-l-sky-500' : ''}`}>
        <h4 className="font-medium text-slate-700 mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 ${isInContinuousConversation ? 'text-sky-500' : 'text-cyan-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span>
              {isInContinuousConversation ? 'Conversación continua' : 'Conversación'}
            </span>
          </div>
          {isInListeningMode && <span className="text-xs text-sky-600 font-medium px-1.5 py-0.5 bg-sky-100 rounded-full"> Escuchando...</span>}
        </h4>
        <div className="space-y-1.5 text-sm">
          {conversationHistory.slice(-4).map((message, index) => (
            <p key={index} className={`${
              message.startsWith('Usuario:') 
                ? 'text-sky-600 font-medium pl-2 border-l-2 border-sky-400' 
                : message.startsWith('Sistema:') 
                  ? 'text-emerald-600 pl-2 border-l-2 border-emerald-400'
                  : 'text-slate-600'
            } py-1 rounded-sm`}>
              {message}
            </p>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </Card>
    </div>
  );
};

export default ConversationHistory;
