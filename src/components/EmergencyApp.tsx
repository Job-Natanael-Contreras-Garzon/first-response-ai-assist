import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { backendAPI, ChatResponse } from '@/services/backendAPI';
import { AlertTriangle, Ambulance, User } from 'lucide-react';
import { toast } from 'sonner';
import CategoryCarousel from './CategoryCarousel';
import { EmergencyCategory, categories } from '@/data/emergencyCategories';
import EmergencyButton from './EmergencyButton';
import ListeningModal from './ListeningModal';
import EmergencyResponse from './EmergencyResponse';
import ConversationHistory from './ConversationHistory';
import BottomNavigation from './BottomNavigation';
import ResponsiveLayout from './ResponsiveLayout';
import ProfilePage from '../pages/ProfilePage';
import SilentEmergencyModal from './SilentEmergencyModal';

interface ConversationMessage {
  id: string;
  type: 'user' | 'assistant';
  message: string;
  timestamp: Date;
}

type EmergencyState = 'idle' | 'listening' | 'analyzing' | 'response' | 'followup' | 'conversation' | 'profile' | 'silent';

const EmergencyApp = () => {
  const [emergencyState, setEmergencyState] = useState<EmergencyState>('idle');
  const [chatResponse, setChatResponse] = useState<ChatResponse | null>(null);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([]);
  const [showListeningModal, setShowListeningModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<EmergencyCategory | null>(null);
  const [isSilentLoading, setIsSilentLoading] = useState(false);
  const [showSilentModal, setShowSilentModal] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    fullName?: string;
    bloodType?: string;
    allergies?: string[];
    emergencyContact?: string;
  } | null>(null);
  
  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    clearTranscript,
    browserSupportsSpeechRecognition,
    error: speechError,
    hasPermission,
    requestMicrophonePermission
  } = useSpeechRecognition();

  const { speak, isSpeaking, cancel } = useSpeechSynthesis();

  const handleEmergencyStart = () => {
    console.log('Iniciando emergencia...');
    setEmergencyState('listening');
    setShowListeningModal(true);
    setConversationHistory([]);
    resetTranscript();
    cancel();
    
    // Reset backend session para crear una nueva conversación
    backendAPI.resetSession();
    console.log('📋 Nueva sesión creada:', backendAPI.getSessionId());
    
    // Almacenamos el session_id en sessionStorage para mantener consistencia
    sessionStorage.setItem('emergency_session_id', backendAPI.getSessionId());
    
    const initialMessage = 'Dime que paso?.';
    speak(initialMessage);
    setConversationHistory([`Sistema: ${initialMessage}`]);
    
    setTimeout(() => {
      if (!isSpeaking) {
        startListening();
      }
    }, 4000);
  };

  const handleProfileOpen = () => {
    console.log('Abriendo perfil...');
    setEmergencyState('profile');
  };

  const handleStopListening = () => {
    const finalText = (transcript + ' ' + interimTranscript).trim();
    console.log('Deteniendo escucha. Texto final:', finalText);
    stopListening();
    
    if (finalText) {
      processUserInput(finalText);
    } else {
      toast.error('No se detectó ningún texto. Inténtalo de nuevo.');
      setTimeout(() => {
        resetTranscript();
        startListening();
      }, 1000);
    }
  };

  const processUserInput = async (userInput: string) => {
    // Simplificamos el flujo - ya no distinguimos entre estados de conversación
    // porque siempre estamos en una conversación continua usando el mismo sessionId
    
    setEmergencyState('analyzing');
    setConversationHistory(prev => [...prev, `Usuario: ${userInput}`]);
    
    try {
      console.log('Procesando entrada del usuario:', userInput);
      const response = await backendAPI.sendMessage(userInput, userProfile);
      setChatResponse(response);
      
      // Agregamos el mensaje a la conversación para el historial
      setConversationMessages(prev => [
        ...prev, 
        {
          id: Date.now().toString(),
          type: 'user',
          message: userInput,
          timestamp: new Date()
        },
        {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          message: response.response,
          timestamp: new Date()
        }
      ]);
      
      // Siempre vamos a la vista de respuesta
      setEmergencyState('response');
      
      // Speak the response
      speak(response.response);
      setConversationHistory(prev => [...prev, `Sistema: ${response.response}`]);
      
      // Cerrar el modal de escucha
      setShowListeningModal(false);
      
    } catch (error) {
      console.error('Error al procesar entrada del usuario:', error);
      
      // En lugar de ir a idle, podemos proporcionar una respuesta de fallback
      // y seguir en el estado de respuesta para permitir continuar la conversación
      const fallbackResponse = {
        response: "Lo siento, tuve problemas para conectarme al servicio. Por favor, intenta de nuevo o considera llamar directamente al 911 si es una emergencia."
      };
      
      // Usar respuesta fallback
      setChatResponse(fallbackResponse);
      
      // Agregar mensajes a la conversación
      setConversationMessages(prev => [
        ...prev, 
        {
          id: Date.now().toString(),
          type: 'user',
          message: userInput,
          timestamp: new Date()
        },
        {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          message: fallbackResponse.response,
          timestamp: new Date()
        }
      ]);
      
      // Ir a la vista de respuesta a pesar del error
      setEmergencyState('response');
      
      // Hablar el mensaje fallback
      speak(fallbackResponse.response);
      setConversationHistory(prev => [...prev, `Sistema: ${fallbackResponse.response}`]);
      
      // Cerrar el modal de escucha
      setShowListeningModal(false);
      
      // Mostrar toast más informativo
      toast.error('Problemas de conexión con el servidor. La conversación continuará en modo local.', {
        duration: 5000,
      });
    }
  };

  const callAmbulance = () => {
    const message = 'Llamando a la ambulancia automáticamente. Mantén la calma, la ayuda está en camino.';
    speak(message);
    
    toast.success('Ambulancia llamada automáticamente - Ayuda en camino');
    
    // Llamar directamente al número de emergencia
    if (window.confirm('¿Deseas realizar una llamada real a emergencias?')) {
      window.location.href = 'tel:911';
    }
  };

  const resetApp = () => {
    console.log('Reiniciando aplicación');
    setEmergencyState('idle');
    setChatResponse(null);
    setConversationHistory([]);
    setConversationMessages([]);
    setShowListeningModal(false);
    resetTranscript();
    cancel();
    backendAPI.resetSession();
  };

  const goBackToPreviousState = () => {
    console.log('Volviendo al estado anterior');
    if (emergencyState === 'response') {
      // Si está en respuesta, volver a escucha
      setEmergencyState('idle');
    } else {
      // Por defecto, volver al inicio
      resetApp();
    }
  };

  const goToHome = () => {
    console.log('Volviendo al inicio');
    resetApp();
  };

  const startContinuousConversation = () => {
    console.log('Continuando conversación directamente...');
    // No cambiamos a la vista de conversación continua
    // En su lugar, iniciamos directamente el modo de escucha
    
    // No reiniciamos la sesión del backend para mantener el contexto
    // El backend mantiene la información por 3 minutos con el mismo ID
    
    // Verificamos si el session_id está sincronizado
    const storedSessionId = sessionStorage.getItem('emergency_session_id');
    const currentSessionId = backendAPI.getSessionId();
    
    if (storedSessionId && storedSessionId !== currentSessionId) {
      console.log('⚠️ Detectada inconsistencia en session_id. Sincronizando...');
      console.log(`SessionStorage: ${storedSessionId}`);
      console.log(`BackendAPI: ${currentSessionId}`);
    }
    
    // Aseguramos que el ID sea consistente para esta conversación
    console.log('🔄 Continuando con session_id:', currentSessionId);
    
    // Primero activamos la escucha para evitar navegación intermedia
    resetTranscript();
    cancel();
    
    // Pequeña pausa para preparar al usuario
    const continueMessage = 'Dime más sobre la situación.';
    
    // Inmediatamente activamos la escucha y cambiamos el estado
    setEmergencyState('listening');
    setShowListeningModal(true);
    
    // Hablar y empezar a escuchar casi inmediatamente
    speak(continueMessage);
    
    // Comenzar a escuchar en paralelo para no perder nada de lo que dice el usuario
    startListening();
  };

  // Ya no necesitamos handleConversationListening, 
  // lo hemos incorporado en startContinuousConversation

  const addMessageToConversation = (message: string, type: 'user' | 'assistant') => {
    const newMessage: ConversationMessage = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date()
    };
    setConversationMessages(prev => [...prev, newMessage]);
  };

  const updateUserProfile = (profile: {
    fullName?: string;
    bloodType?: string;
    allergies?: string[];
    emergencyContact?: string;
  } | null) => {
    setUserProfile(profile);
  };

  const handleCategorySelect = async (category: EmergencyCategory) => {
    console.log('Categoría seleccionada:', category);
    setSelectedCategory(category);
    setEmergencyState('silent');
    setShowSilentModal(true);
    setIsSilentLoading(true);
    
    // Creamos mensaje según jerarquía
    let silentMessage = "";
    
    // Si es subcategoría, incluir la categoría principal en el mensaje
    if (category.parentId) {
      // Buscamos la categoría padre
      const parentCategory = categories.find(c => c.id === category.parentId);
      if (parentCategory) {
        silentMessage = `Tengo una emergencia de tipo ${parentCategory.title.toLowerCase()} ${category.title.toLowerCase()}`;
      } else {
        silentMessage = `Tengo una emergencia de tipo ${category.title.toLowerCase()}`;
      }
    } else {
      // Es una categoría principal
      silentMessage = `Tengo una emergencia de tipo ${category.title.toLowerCase()}`;
    }
    
    // Siempre generar un nuevo ID de sesión para cada interacción con categoría primaria
    // Si es una categoría principal o estamos cambiando de categoría principal
    const isNewMainCategory = !category.parentId || 
      (category.parentId && (!selectedCategory || !selectedCategory.parentId || 
      selectedCategory.parentId !== category.parentId));
      
    if (isNewMainCategory) {
      backendAPI.resetSession();
      console.log('🔄 Nueva sesión para nueva emergencia principal:', backendAPI.getSessionId());
    } else {
      console.log('📝 Continuando con la misma sesión para subcategoría de la misma categoría principal');
    }
    
    console.log('Enviando mensaje silencioso:', silentMessage);
    
    try {
      
      const response = await backendAPI.sendMessage(silentMessage, userProfile);
      setChatResponse(response);
      
      // Agregamos mensajes a la conversación
      setConversationMessages(prev => [
        ...prev, 
        {
          id: Date.now().toString(),
          type: 'user',
          message: silentMessage,
          timestamp: new Date()
        },
        {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          message: response.response,
          timestamp: new Date()
        }
      ]);
      
      // Leer la respuesta en voz alta
      speak(response.response);
      
    } catch (error) {
      console.error('Error al procesar emergencia silenciosa:', error);
      
      const fallbackResponse = {
        response: "Lo siento, tuve problemas para conectarme al servicio. Por favor, intenta seleccionar otra categoría o considera llamar directamente al 911 si es una emergencia."
      };
      
      setChatResponse(fallbackResponse);
      
      // Agregar mensajes a la conversación
      // Usar el mismo formato de mensaje para mantener coherencia
      setConversationMessages(prev => [
        ...prev, 
        {
          id: Date.now().toString(),
          type: 'user',
          message: silentMessage || ` ${category.title.toLowerCase()}: ${category.description}`,
          timestamp: new Date()
        },
        {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          message: fallbackResponse.response,
          timestamp: new Date()
        }
      ]);
      
      // Leer el mensaje de error
      speak(fallbackResponse.response);
      
      toast.error('Problemas de conexión con el servidor', {
        duration: 5000,
      });
    } finally {
      setIsSilentLoading(false);
    }
  };

  const handleCloseSilentModal = () => {
    setShowSilentModal(false);
    setEmergencyState('idle');
    setSelectedCategory(null);
    setChatResponse(null);
    cancel();
  };

  const handleSilentEmergencyCall = () => {
    if (window.confirm('¿Deseas realizar una llamada de emergencia al 160?')) {
      window.location.href = 'tel:160';
    }
  };

  useEffect(() => {
    if (speechError) {
      toast.error(`Error de voz: ${speechError}`);
    }
  }, [speechError]);
  
  // Ya no cargamos automáticamente los datos del perfil al montar el componente
  // Los datos serán cargados únicamente cuando el usuario presione el botón "CARGAR DATOS"

  // Escuchar cambios en localStorage para actualizar el perfil en tiempo real
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'emergencyProfile') {
        try {
          if (e.newValue) {
            setUserProfile(JSON.parse(e.newValue));
            console.log('Perfil actualizado en EmergencyApp:', JSON.parse(e.newValue));
          } else {
            setUserProfile(null);
          }
        } catch (error) {
          console.error('Error al actualizar perfil en EmergencyApp:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md bg-gray-900 border-gray-700">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-400 mb-2">
            Navegador no compatible
          </h2>
          <p className="text-gray-300">
            Tu navegador no soporta reconocimiento de voz. 
            Por favor usa Chrome, Edge o Safari.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <ResponsiveLayout hasBottomNav={emergencyState === 'idle'}>
      {/* Botón de perfil fijo en esquina superior izquierda */}
      {emergencyState === 'idle' && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={handleProfileOpen}
            className={`w-14 h-14 rounded-full ${userProfile ? 'bg-emerald-600' : 'bg-cyan-600'} hover:bg-slate-700 text-white shadow-lg relative`}
          >
            <User className="h-6 w-6" />
            {userProfile && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></span>
            )}
          </Button>
        </div>
      )}

      {/* Main App - Estado Idle */}
      {emergencyState === 'idle' && (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="text-center py-6 sm:py-8 px-4 flex-shrink-0">
            <h1 className="text-responsive-xl font-bold text-slate-700 mb-3">AI LIFE</h1>
          </div>

          {/* Emergency Button */}
          <div className="flex-1 flex items-center justify-center px-8">
            <EmergencyButton onEmergencyStart={handleEmergencyStart} directCall={true} />
          </div>

          {/* Category Carousel */}
          <div className="pb-6 flex-shrink-0">
            <CategoryCarousel 
              onCategorySelect={handleCategorySelect}
              selectedCategoryId={selectedCategory?.id || null}
            />
          </div>

          {/* Bottom Navigation */}
          <BottomNavigation onEmergencyStart={handleEmergencyStart} />
        </div>
      )}

      {/* Profile State */}
      {emergencyState === 'profile' && (
        <ProfilePage 
          onBack={goToHome} 
          onProfileUpdate={updateUserProfile}
        />
      )}

      {/* Listening Modal */}
      <ListeningModal
        isOpen={showListeningModal && (emergencyState === 'listening' || emergencyState === 'analyzing')}
        emergencyState={emergencyState}
        isListening={isListening}
        isSpeaking={isSpeaking}
        transcript={transcript}
        interimTranscript={interimTranscript}
        onStopListening={handleStopListening}
        onClose={resetApp}
        error={speechError}
        hasPermission={hasPermission}
        onRequestPermission={requestMicrophonePermission}
      />

      {/* Response State */}
      {emergencyState === 'response' && chatResponse && (
        <EmergencyResponse 
          chatResponse={chatResponse}
          userProfile={userProfile}
          onReset={resetApp}
          onBack={goBackToPreviousState}
          onHome={goToHome}
          onContinueConversation={startContinuousConversation}
        />
      )}

      {/* El estado 'calling' ha sido eliminado */}

      {/* Ya no necesitamos el componente ContinuousConversation 
          porque la conversación continua se maneja directamente con el ListeningModal */}

      {/* Conversation History */}
      <ConversationHistory 
        conversationHistory={conversationHistory}
        emergencyState={emergencyState}
      />
      
      {/* Silent Emergency Modal */}
      <SilentEmergencyModal
        isOpen={showSilentModal}
        onClose={handleCloseSilentModal}
        category={selectedCategory}
        chatResponse={chatResponse}
        isLoading={isSilentLoading}
        onCallEmergency={handleSilentEmergencyCall}
        isSpeaking={isSpeaking}
      />

      {/* Botón fijo de emergencias - Visible durante la respuesta y la escucha para continuar la conversación */}
      {(emergencyState === 'response' || emergencyState === 'listening') && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={callAmbulance}
            className="bg-rose-500 hover:bg-rose-600 text-white rounded-full w-24 h-24 shadow-lg flex items-center justify-center"
            size="lg"
          >
            <Ambulance className="w-16 h-16 sm:w-18 sm:h-18" />
          </Button>
          <div className="text-center mt-2">
            <span className="text-xs text-red-600 font-medium bg-white px-2 py-1 rounded-full shadow-sm">
              911
            </span>
          </div>
        </div>
      )}

      {/* Silent Emergency Modal */}
      <SilentEmergencyModal
        isOpen={showSilentModal}
        onClose={handleCloseSilentModal}
        category={selectedCategory}
        chatResponse={chatResponse}
        isLoading={isSilentLoading}
        onCallEmergency={handleSilentEmergencyCall}
        isSpeaking={isSpeaking}
      />
    </ResponsiveLayout>
  );
};

export default EmergencyApp;
