import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, X, Volume2 } from 'lucide-react';

interface ListeningModalProps {
  isOpen: boolean;
  emergencyState: string;
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  interimTranscript?: string;
  onStopListening: () => void;
  onClose: () => void;
  error?: string | null;
  hasPermission?: boolean | null;
  onRequestPermission?: () => void;
}

const ListeningModal: React.FC<ListeningModalProps> = ({
  isOpen,
  emergencyState,
  isListening,
  isSpeaking,
  transcript,
  interimTranscript = '',
  onStopListening,
  onClose,
  error,
  hasPermission,
  onRequestPermission
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-4 bg-gray-900 border-gray-700">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Mic className="h-5 w-5 text-red-500" />
              <span className="text-white font-medium">
                {emergencyState === 'analyzing' ? 'Analizando...' : 'Escuchando...'}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-white">
              Describe tu emergencia
            </h2>
            <p className="text-gray-400 text-sm">
              Explica claramente qué está pasando para poder ayudarte mejor
            </p>

            {/* Voice Indicator */}
            {emergencyState === 'listening' && (
              <div className="relative">
                <div className={`w-16 h-16 mx-auto rounded-full ${isListening ? 'bg-red-500' : 'bg-gray-600'} flex items-center justify-center`}>
                  <Mic className="h-8 w-8 text-white" />
                </div>
                {isListening && (
                  <div className="absolute inset-0 border-4 border-red-500 rounded-full animate-ping opacity-20"></div>
                )}
              </div>
            )}

            {emergencyState === 'analyzing' && (
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto"></div>
            )}

            {isSpeaking && (
              <p className="text-sm text-blue-400 flex items-center justify-center">
                <Volume2 className="h-4 w-4 mr-1" />
                Sistema hablando...
              </p>
            )}

            {/* Transcript */}
            <div className="bg-gray-800 rounded-lg p-4 min-h-[80px]">
              <p className="text-sm text-gray-400 mb-2">Texto reconocido:</p>
              {transcript || interimTranscript ? (
                <div className="text-white">
                  <span className="text-white">{transcript}</span>
                  {interimTranscript && (
                    <span className="text-gray-400 italic"> {interimTranscript}</span>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">Esperando tu respuesta...</p>
              )}
              
              {/* Error display */}
              {error && (
                <div className="mt-2 p-2 bg-red-900/50 border border-red-500 rounded text-red-300 text-xs">
                  {error}
                  {hasPermission === false && onRequestPermission && (
                    <Button
                      onClick={onRequestPermission}
                      size="sm"
                      className="ml-2 bg-red-600 hover:bg-red-700 text-white text-xs"
                    >
                      Permitir Micrófono
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Example */}
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Ejemplo:</p>
              <p className="text-xs text-gray-400">
                "Mi hijo se está asfixiando" o "Me corté profundamente la mano"...
              </p>
            </div>

            {/* Action Button */}
            {emergencyState === 'listening' && (
              <Button
                onClick={onStopListening}
                disabled={!(transcript.trim() || interimTranscript.trim())}
                className="w-full bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(transcript.trim() || interimTranscript.trim()) ? '🔴 Detener y Analizar' : '🎤 Hablando...'}
              </Button>
            )}

            {emergencyState === 'analyzing' && (
              <div className="text-center">
                <p className="text-blue-400 text-sm">🤖 Analizando tu emergencia...</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ListeningModal;
