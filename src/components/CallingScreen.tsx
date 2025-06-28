import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, PhoneOff, ArrowLeft, Home, AlertTriangle } from 'lucide-react';

interface CallingScreenProps {
  onReset: () => void;
  onBack?: () => void;
  onHome?: () => void;
}

const CallingScreen: React.FC<CallingScreenProps> = ({ onReset, onBack, onHome }) => {
  const [callCancelled, setCallCancelled] = useState(false);

  const handleCancelCall = () => {
    setCallCancelled(true);
    // Simular cancelación de llamada
    setTimeout(() => {
      if (onBack) {
        onBack();
      } else {
        onReset();
      }
    }, 1500);
  };

  const handleGoHome = () => {
    if (onHome) {
      onHome();
    } else {
      onReset();
    }
  };

  if (callCancelled) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="relative">
            <PhoneOff className="h-24 w-24 text-red-500 mx-auto" />
            <div className="absolute inset-0 border-4 border-red-500 rounded-full animate-pulse opacity-30"></div>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Llamada Cancelada
          </h2>
          <p className="text-gray-400">
            La llamada de emergencia ha sido cancelada
          </p>
          <div className="bg-red-900 border border-red-600 rounded-lg p-4">
            <p className="text-red-300 font-medium">
              ⚠ Si aún necesitas ayuda, no dudes en volver a llamar
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header con navegación */}
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <Button
          onClick={onBack || onReset}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        
        <h1 className="text-lg font-semibold text-white">Emergencia Activa</h1>
        
        <Button
          onClick={handleGoHome}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
        >
          <Home className="h-4 w-4 mr-2" />
          Inicio
        </Button>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col p-4">
        {/* Botón de emergencia fijo y prominente */}
        <div className="mb-6">
          <Button 
            onClick={() => window.open('tel:911', '_self')}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-xl font-bold animate-pulse"
            size="lg"
          >
            <Phone className="w-8 h-8 mr-3" />
            🚨 LLAMAR EMERGENCIAS (911) 🚨
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md">
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

            {/* Información adicional */}
            <div className="bg-blue-900/20 border border-blue-600/50 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <AlertTriangle className="h-5 w-5 text-blue-400 mr-2" />
                <p className="text-blue-300 font-medium text-sm">
                  Información importante
                </p>
              </div>
              <p className="text-blue-400 text-xs">
                • Mantén la línea telefónica libre<br/>
                • Ten documentos de identidad listos<br/>
                • Permanece en el lugar indicado
              </p>
            </div>

            {/* Botones de acción */}
            <div className="space-y-3">
              <Button
                onClick={handleCancelCall}
                variant="destructive"
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <PhoneOff className="h-4 w-4 mr-2" />
                Cancelar Llamada
              </Button>
              
              <Button
                onClick={onReset}
                variant="outline"
                className="w-full text-gray-400 border-gray-600 hover:text-white hover:border-gray-400"
              >
                Nueva Emergencia
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallingScreen;
