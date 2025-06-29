import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChatResponse } from '@/services/backendAPI';
import { Ambulance, ArrowLeft, Home, MessageCircle, Mic } from 'lucide-react';

interface EmergencyResponseProps {
  chatResponse: ChatResponse;
  userProfile?: {
    fullName?: string;
    bloodType?: string;
    allergies?: string[];
    emergencyContact?: string;
  } | null;
  onReset: () => void;
  onBack?: () => void;
  onHome?: () => void;
  onContinueConversation?: () => void;
}

const EmergencyResponse: React.FC<EmergencyResponseProps> = ({ 
  chatResponse, 
  onReset,
  onBack,
  onHome,
  onContinueConversation 
}) => {
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

  const handleContinueConversation = () => {
    if (onContinueConversation) {
      onContinueConversation();
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
        
        <h1 className="text-base md:text-lg font-semibold text-slate-700">Respuesta de Emergencia</h1>
        
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

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col p-4">
        {/* Botón de emergencia fijo y prominente */}
        <div className="mb-4 px-1">
          <Button 
            onClick={callEmergency}
            className="w-full bg-gradient-to-br from-rose-400 to-red-500 hover:from-rose-500 hover:to-red-600 text-white py-4 md:py-6 text-base md:text-xl font-bold shadow-lg rounded-xl flex items-center justify-center"
            size="lg"
          >
            <Ambulance className="w-10 h-10 md:w-14 md:h-14 mr-2 md:mr-3 animate-pulse" />
            <span className="whitespace-nowrap">🚨 LLAMAR EMERGENCIAS (911) 🚨</span>
          </Button>
        </div>

        {/* Respuesta del sistema */}
        <div className="flex-1 flex items-start justify-center">
          <div className="max-w-md w-full space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-cyan-200 p-4 md:p-6 shadow-lg rounded-xl">
              <div className="flex items-start space-x-3">
                <div className="bg-sky-500 rounded-full p-2 flex-shrink-0">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-sky-600 mb-2">Asistente de Emergencias</p>
                  <p className="text-slate-700 text-base md:text-lg leading-relaxed">{chatResponse.response}</p>
                </div>
              </div>
            </Card>

            {/* Opciones de acción */}
            <div className="space-y-3 sticky bottom-0">
              <Button 
                onClick={handleContinueConversation}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 md:py-4 text-base md:text-lg shadow-md rounded-xl flex items-center justify-center relative overflow-hidden"
                size="lg"
              >
                <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                <Mic className="w-5 h-5 mr-2 animate-bounce" />
                Hablar ahora (activará micrófono)
              </Button>
              
              <Button 
                onClick={onReset}
                variant="outline"
                className="w-full border-slate-300 text-slate-600 hover:bg-white/70 py-3 rounded-xl"
                size="lg"
              >
                Nueva Emergencia
              </Button>
              
              <p className="text-xs text-center text-slate-500 mt-1">
                Al dar clic arriba se activará el micrófono inmediatamente
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyResponse;