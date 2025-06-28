import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  const callEmergency = () => {
    window.open('tel:160', '_self');
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-md mx-auto space-y-6">
        <Card className="bg-gray-900 border-gray-700 p-6">
          <p className="text-white text-lg leading-relaxed">{chatResponse.response}</p>
        </Card>

        <div className="space-y-4">
          <Button 
            onClick={callEmergency}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-lg"
            size="lg"
          >
            <Phone className="w-5 h-5 mr-2" />
            Llamar a Emergencias (911)
          </Button>
          
          <Button 
            onClick={onReset}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 py-4"
            size="lg"
          >
            Nueva Emergencia
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyResponse;