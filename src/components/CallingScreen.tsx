import React from 'react';
import { Button } from '@/components/ui/button';
import { Ambulance, ArrowLeft, Home, AlertTriangle } from 'lucide-react';

interface CallingScreenProps {
  onReset: () => void;
  onBack?: () => void;
  onHome?: () => void;
}

const CallingScreen: React.FC<CallingScreenProps> = ({ onReset, onBack, onHome }) => {
  const handleCancelCall = () => {
    // En lugar de simular cancelación, volver a la conversación o inicio
    if (onBack) {
      onBack(); // Volver al modal anterior para continuar conversando
    } else {
      onReset(); // O ir al inicio
    }
  };

  const handleGoHome = () => {
    if (onHome) {
      onHome();
    } else {
      onReset();
    }
  };

  return (
    <div className="full-height bg-gradient-to-br from-sky-200 via-cyan-100 to-teal-100 flex flex-col">
      {/* Header con navegación */}
      <div className="flex justify-between items-center p-4 border-b border-cyan-200 bg-white/50 backdrop-blur-sm">
        <Button
          onClick={onBack || onReset}
          variant="ghost"
          size="sm"
          className="text-slate-600 hover:text-slate-800 hover:bg-white/70"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        
        <h1 className="text-lg font-semibold text-slate-700">Emergencia Activa</h1>
        
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
            onClick={() => window.open('tel:911', '_self')}
            className="w-full bg-gradient-to-br from-rose-400 to-red-500 hover:from-rose-500 hover:to-red-600 text-white py-6 text-xl font-bold animate-pulse shadow-lg"
            size="lg"
          >
            <Ambulance className="w-12 h-12 mr-3" />
            🚨 LLAMAR EMERGENCIAS (911) 🚨
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md">
            <div className="relative">
              <Ambulance className="h-36 w-36 text-emerald-500 mx-auto" />
              <div className="absolute inset-0 border-4 border-emerald-500 rounded-full animate-ping opacity-20"></div>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-700">
              Ambulancia en Camino
            </h2>
            
            <p className="text-slate-600">
              Ayuda médica profesional está siendo enviada
            </p>
            
            <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-4">
              <p className="text-emerald-700 font-medium">
                ✓ Llamada realizada automáticamente
              </p>
              <p className="text-emerald-600 text-sm mt-1">
                Mantén la calma y sigue las instrucciones de primeros auxilios
              </p>
            </div>

            {/* Información adicional */}
            <div className="bg-sky-50 border border-sky-300 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <AlertTriangle className="h-5 w-5 text-sky-600 mr-2" />
                <p className="text-sky-700 font-medium text-sm">
                  Información importante
                </p>
              </div>
              <p className="text-sky-600 text-xs">
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
                className="w-full bg-rose-500 hover:bg-rose-600 shadow-md"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Conversación
              </Button>
              
              <Button
                onClick={onReset}
                variant="outline"
                className="w-full text-slate-600 border-slate-300 hover:text-slate-800 hover:bg-white/70"
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
