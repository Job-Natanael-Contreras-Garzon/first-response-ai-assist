import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, Heart, Thermometer, Activity, FileText } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { useNavigate } from 'react-router-dom';

const MedicPage = () => {
  const navigate = useNavigate();

  const handleEmergencyStart = () => {
    navigate('/');
  };

  const medicCategories = [
    {
      icon: Heart,
      title: 'Cardíaco',
      description: 'Problemas del corazón y circulación',
      color: 'text-red-500',
      bgColor: 'bg-red-900/20'
    },
    {
      icon: Activity,
      title: 'Respiratorio',
      description: 'Dificultades para respirar',
      color: 'text-blue-500',
      bgColor: 'bg-blue-900/20'
    },
    {
      icon: Thermometer,
      title: 'Trauma',
      description: 'Heridas y lesiones físicas',
      color: 'text-orange-500',
      bgColor: 'bg-orange-900/20'
    },
    {
      icon: FileText,
      title: 'Neurológico',
      description: 'Problemas cerebrales y nerviosos',
      color: 'text-purple-500',
      bgColor: 'bg-purple-900/20'
    }
  ];

  const quickActions = [
    'RCP - Reanimación Cardiopulmonar',
    'Maniobra de Heimlich',
    'Control de Hemorragias',
    'Posición de Recuperación',
    'Vendaje de Heridas',
    'Inmovilización de Fracturas'
  ];

  return (
    <ResponsiveLayout hasBottomNav={true}>
      {/* Header */}
      <div className="text-center py-6 px-4">
        <h1 className="text-responsive-xl font-bold text-gray-300 mb-2 flex items-center justify-center">
          <Stethoscope className="h-6 w-6 sm:h-8 sm:w-8 mr-2 text-green-500" />
          Centro Médico
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Guías médicas y protocolos de emergencia
        </p>
      </div>

      {/* Medical Categories */}
      <div className="px-4 mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Categorías Médicas</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {medicCategories.map((category, index) => (
            <Card key={index} className={`bg-gray-900 border-gray-700 p-3 sm:p-4 ${category.bgColor} hover:bg-gray-800 transition-colors cursor-pointer`}>
              <div className="text-center">
                <category.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${category.color} mx-auto mb-2`} />
                <h3 className="font-medium text-white mb-1 text-sm sm:text-base">{category.title}</h3>
                <p className="text-xs text-gray-400">{category.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Medical Actions */}
      <div className="px-4 mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Acciones Rápidas</h2>
        <div className="space-y-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start text-left bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white text-sm"
            >
              <span className="text-green-500 mr-2">{index + 1}.</span>
              {action}
            </Button>
          ))}
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="px-4">
        <Card className="bg-green-900 border-green-600 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
            <span className="font-medium text-green-300 text-sm sm:text-base">Asistencia Médica</span>
          </div>
          <p className="text-green-200 text-xs sm:text-sm mb-3">
            ¿Necesitas ayuda médica inmediata? Usa nuestro asistente de IA
          </p>
          <Button 
            onClick={handleEmergencyStart}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-sm"
          >
            Iniciar Consulta de Emergencia
          </Button>
        </Card>
      </div>

      <BottomNavigation onEmergencyStart={handleEmergencyStart} />
    </ResponsiveLayout>
  );
};

export default MedicPage;
