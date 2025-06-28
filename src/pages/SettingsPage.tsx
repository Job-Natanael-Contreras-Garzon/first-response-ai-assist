import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Volume2, 
  Mic, 
  Shield, 
  Globe,
  Moon,
  Sun
} from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [voiceResponse, setVoiceResponse] = useState(true);
  const [autoCall, setAutoCall] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [volume, setVolume] = useState([75]);

  const handleEmergencyStart = () => {
    navigate('/');
  };

  const settingsGroups = [
    {
      title: 'Notificaciones',
      icon: Bell,
      settings: [
        {
          label: 'Notificaciones Push',
          description: 'Recibir alertas de emergencia',
          component: (
            <Switch 
              checked={notifications} 
              onCheckedChange={setNotifications}
            />
          )
        }
      ]
    },
    {
      title: 'Audio y Voz',
      icon: Volume2,
      settings: [
        {
          label: 'Respuesta por Voz',
          description: 'El sistema responderá hablando',
          component: (
            <Switch 
              checked={voiceResponse} 
              onCheckedChange={setVoiceResponse}
            />
          )
        },
        {
          label: 'Volumen del Sistema',
          description: 'Ajustar volumen de respuestas',
          component: (
            <div className="w-32">
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-gray-400 mt-1">{volume[0]}%</div>
            </div>
          )
        }
      ]
    },
    {
      title: 'Emergencias',
      icon: Shield,
      settings: [
        {
          label: 'Llamada Automática',
          description: 'Llamar servicios automáticamente en emergencias críticas',
          component: (
            <Switch 
              checked={autoCall} 
              onCheckedChange={setAutoCall}
            />
          )
        }
      ]
    },
    {
      title: 'Apariencia',
      icon: Moon,
      settings: [
        {
          label: 'Modo Oscuro',
          description: 'Usar tema oscuro en la aplicación',
          component: (
            <Switch 
              checked={darkMode} 
              onCheckedChange={setDarkMode}
            />
          )
        }
      ]
    }
  ];

  const accountActions = [
    'Información Personal',
    'Contactos de Emergencia',
    'Historial Médico',
    'Exportar Datos',
    'Privacidad y Seguridad'
  ];

  return (
    <ResponsiveLayout hasBottomNav={true}>
      {/* Header */}
      <div className="text-center py-6 px-4">
        <h1 className="text-responsive-xl font-bold text-gray-300 mb-2 flex items-center justify-center">
          <SettingsIcon className="h-6 w-6 sm:h-8 sm:w-8 mr-2 text-gray-400" />
          Configuración
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Personaliza tu experiencia de emergencias
        </p>
      </div>

      <div className="px-4 space-y-4 sm:space-y-6">
        {/* Settings Groups */}
        {settingsGroups.map((group, groupIndex) => (
          <Card key={groupIndex} className="bg-gray-900 border-gray-700 p-4">
            <div className="flex items-center space-x-2 mb-4">
              <group.icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <h2 className="text-base sm:text-lg font-semibold text-white">{group.title}</h2>
            </div>
            
            <div className="space-y-4">
              {group.settings.map((setting, settingIndex) => (
                <div key={settingIndex} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm sm:text-base">{setting.label}</h3>
                    <p className="text-xs sm:text-sm text-gray-400 break-words">{setting.description}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {setting.component}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}

        {/* Account Section */}
        <Card className="bg-gray-900 border-gray-700 p-4">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-4">Cuenta</h2>
          <div className="space-y-1 sm:space-y-2">
            {accountActions.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 text-sm"
              >
                {action}
              </Button>
            ))}
          </div>
        </Card>

        {/* About Section */}
        <Card className="bg-gray-900 border-gray-700 p-4">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-4">Acerca de</h2>
          <div className="space-y-2 text-xs sm:text-sm text-gray-400">
            <p>Versión: 1.0.0</p>
            <p>Última actualización: Junio 2025</p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
              <Button variant="outline" size="sm" className="text-xs">
                Términos de Uso
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                Privacidad
              </Button>
            </div>
          </div>
        </Card>

        {/* Emergency Test */}
        <Card className="bg-red-900 border-red-600 p-4">
          <h2 className="text-base sm:text-lg font-semibold text-red-300 mb-2">Prueba de Emergencia</h2>
          <p className="text-red-200 text-xs sm:text-sm mb-3">
            Prueba el sistema de emergencias para asegurar que todo funcione correctamente
          </p>
          <Button 
            onClick={handleEmergencyStart}
            className="w-full bg-red-600 hover:bg-red-700 text-white text-sm"
          >
            Iniciar Prueba
          </Button>
        </Card>
      </div>

      <BottomNavigation onEmergencyStart={handleEmergencyStart} />
    </ResponsiveLayout>
  );
};

export default SettingsPage;
