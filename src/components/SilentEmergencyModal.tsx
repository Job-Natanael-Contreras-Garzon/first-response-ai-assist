import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChatResponse } from '@/services/backendAPI';
import { EmergencyCategory } from '@/data/emergencyCategories';
import { X, Ambulance, Volume2, MessageSquare } from 'lucide-react';

interface SilentEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: EmergencyCategory | null;
  chatResponse: ChatResponse | null;
  isLoading: boolean;
  onCallEmergency: () => void;
  isSpeaking: boolean;
}

const SilentEmergencyModal: React.FC<SilentEmergencyModalProps> = ({
  isOpen,
  onClose,
  category,
  chatResponse,
  isLoading,
  onCallEmergency,
  isSpeaking
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Botón flotante de emergencia en la parte superior */}
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-60">
        <Button
          onClick={onCallEmergency}
          className="bg-gradient-to-br from-rose-400 to-red-500 hover:from-rose-500 hover:to-red-600 text-white rounded-full w-20 h-20 shadow-2xl animate-pulse"
        >
          <Ambulance className="h-14 w-14 sm:h-16 sm:w-16" />
        </Button>
        <div className="text-center mt-2">
          <span className="text-xs text-white font-medium bg-red-600 px-2 py-1 rounded-full shadow-sm">
            160
          </span>
        </div>
      </div>

      <Card className="w-full max-w-md mx-4 bg-white/95 border-cyan-200 shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              {category && <category.icon className={`h-5 w-5 ${category.color}`} />}
              <span className="text-slate-700 font-medium">
                {category ? category.title : 'Emergencia'}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-600 hover:text-slate-800 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-slate-700">
              {category ? `Información sobre ${category.title.toLowerCase()}` : 'Selecciona una emergencia'}
            </h2>
            
            {/* Category Details */}
            {category && (
              <div className="bg-slate-100 rounded-lg p-4 text-left mb-4">
                <div className="flex items-center mb-2">
                  <category.icon className={`h-6 w-6 ${category.color} mr-2`} />
                  <h3 className="font-medium">{category.title}</h3>
                </div>
                <p className="text-sm text-slate-600">{category.description}</p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="space-y-3">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-500 border-t-transparent mx-auto"></div>
                <p className="text-sky-600 text-sm">Analizando la emergencia...</p>
              </div>
            )}

            {/* Response */}
            {!isLoading && chatResponse && (
              <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
                <div className="flex items-start mb-3">
                  <MessageSquare className="h-5 w-5 text-sky-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-left text-slate-700">{chatResponse.response}</p>
                </div>
                {isSpeaking && (
                  <div className="flex items-center justify-center mt-2 text-sky-600 text-xs">
                    <Volume2 className="h-3 w-3 mr-1 animate-pulse" />
                    Reproduciendo audio...
                  </div>
                )}
              </div>
            )}

            {/* Call Emergency Button */}
            <Button
              onClick={onCallEmergency}
              className="w-full bg-gradient-to-br from-rose-400 to-red-500 hover:from-rose-500 hover:to-red-600 text-white py-3 rounded-xl shadow-lg"
            >
              <Ambulance className="h-5 w-5 mr-2" />
              Llamar a emergencias (911)
            </Button>

            <p className="text-xs text-slate-500">
              Para emergencias graves, no dudes en llamar al número de emergencia directamente.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SilentEmergencyModal;
