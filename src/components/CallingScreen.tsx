import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';

interface CallingScreenProps {
  onReset: () => void;
}

const CallingScreen: React.FC<CallingScreenProps> = ({ onReset }) => {
  return (
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
          onClick={onReset}
          variant="outline"
          className="text-gray-400 border-gray-600 hover:text-white hover:border-gray-400"
        >
          Nueva Emergencia
        </Button>
      </div>
    </div>
  );
};

export default CallingScreen;
