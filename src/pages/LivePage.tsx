import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, MapPin, Clock, Users } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { useNavigate } from 'react-router-dom';

const LivePage = () => {
  const navigate = useNavigate();

  const handleEmergencyStart = () => {
    navigate('/');
  };

  const liveData = [
    {
      id: 1,
      type: 'Ambulancia',
      location: 'Centro Ciudad',
      eta: '3 min',
      status: 'En ruta',
      priority: 'high'
    },
    {
      id: 2,
      type: 'Bomberos',
      location: 'Zona Norte',
      eta: '8 min',
      status: 'Disponible',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'Policía',
      location: 'Zona Sur',
      eta: '5 min',
      status: 'Ocupado',
      priority: 'low'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <ResponsiveLayout hasBottomNav={true}>
      {/* Header */}
      <div className="text-center py-6 px-4">
        <h1 className="text-responsive-xl font-bold text-gray-300 mb-2 flex items-center justify-center">
          <Activity className="h-6 w-6 sm:h-8 sm:w-8 mr-2 text-red-500" />
          Estado en Vivo
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Monitoreo en tiempo real de servicios de emergencia
        </p>
      </div>

      {/* Live Stats */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Card className="bg-gray-900 border-gray-700 p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-green-400">12</div>
            <div className="text-xs sm:text-sm text-gray-400">Unidades Activas</div>
          </Card>
          <Card className="bg-gray-900 border-gray-700 p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-red-400">3</div>
            <div className="text-xs sm:text-sm text-gray-400">Emergencias Activas</div>
          </Card>
        </div>
      </div>

      {/* Live Units */}
      <div className="px-4 space-y-3 sm:space-y-4">
        {liveData.map((unit) => (
          <Card key={unit.id} className="bg-gray-900 border-gray-700 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(unit.priority)}`}></div>
                <span className="font-medium text-white text-sm sm:text-base">{unit.type}</span>
              </div>
              <span className="text-xs sm:text-sm text-gray-400">{unit.status}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{unit.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>ETA: {unit.eta}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Emergency Alert */}
      <div className="px-4 mt-6 sm:mt-8">
        <Card className="bg-red-900 border-red-600 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
            <span className="font-medium text-red-300 text-sm sm:text-base">Alerta de Emergencia</span>
          </div>
          <p className="text-red-200 text-xs sm:text-sm mb-3">
            Accidente de tráfico reportado en Av. Principal
          </p>
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white text-sm">
            Ver Detalles
          </Button>
        </Card>
      </div>

      <BottomNavigation onEmergencyStart={handleEmergencyStart} />
    </ResponsiveLayout>
  );
};

export default LivePage;
