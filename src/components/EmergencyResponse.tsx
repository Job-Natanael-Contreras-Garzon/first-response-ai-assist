import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChatResponse } from '@/services/backendAPI';
import { Phone } from 'lucide-react';

interface EmergencyResponseProps {
  chatResponse: ChatResponse;
  onReset: () => void;
}

const EmergencyResponse: React.FC<EmergencyResponseProps> = ({ 
  chatResponse, 
  onReset 
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
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
            onClick={onReset}
            variant="outline"
            className="text-gray-400 border-gray-600 hover:text-white hover:border-gray-400"
          >
            Nueva Emergencia
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyResponse;
