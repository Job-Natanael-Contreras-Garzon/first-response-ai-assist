import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChatResponse } from '@/services/backendAPI';
import { Phone, ArrowLeft, Home, MessageCircle, Mic } from 'lucide-react';

interface EmergencyResponseProps {
  chatResponse: ChatResponse;
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
        
        <h1 className="text-lg font-semibold text-slate-700">Respuesta de Emergencia</h1>
        
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

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col p-4">
        {/* Botón de emergencia fijo y prominente */}
        <div className="mb-6">
          <Button 
            onClick={callEmergency}
            className="w-full bg-gradient-to-br from-rose-400 to-red-500 hover:from-rose-500 hover:to-red-600 text-white py-6 text-xl font-bold shadow-lg"
            size="lg"
          >
            <Phone className="w-8 h-8 mr-3" />
            🚨 LLAMAR EMERGENCIAS (911) 🚨
          </Button>
        </div>

        {/* Respuesta del sistema */}
        <div className="flex-1 flex items-start justify-center">
          <div className="max-w-md w-full space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-cyan-200 p-6 shadow-lg">
              <div className="flex items-start space-x-3 mb-4">
                <div className="bg-sky-500 rounded-full p-2">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-600 mb-2">Asistente de Emergencias</p>
                  <p className="text-slate-700 text-lg leading-relaxed">{chatResponse.response}</p>
                </div>
              </div>
            </Card>

            {/* Opciones de acción */}
            <div className="space-y-4">
              <Button 
                onClick={handleContinueConversation}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white py-4 text-lg shadow-md"
                size="lg"
              >
                <Mic className="w-5 h-5 mr-2" />
                Continuar Conversación
              </Button>
              
              <Button 
                onClick={onReset}
                variant="outline"
                className="w-full border-slate-300 text-slate-600 hover:bg-white/70 py-4"
                size="lg"
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

export default EmergencyResponse;