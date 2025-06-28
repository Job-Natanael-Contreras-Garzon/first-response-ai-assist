import React from 'react';
import { Card } from '@/components/ui/card';

interface ConversationHistoryProps {
  conversationHistory: string[];
  emergencyState: string;
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({ 
  conversationHistory, 
  emergencyState 
}) => {
  if (conversationHistory.length === 0 || emergencyState === 'idle') {
    return null;
  }

  return (
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
  );
};

export default ConversationHistory;
