import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, MapPin, Clock, Fuel, Settings as SettingsIcon } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { useNavigate } from 'react-router-dom';

const VehiclePage = () => {
  const navigate = useNavigate();

  const handleEmergencyStart = () => {
    navigate('/');
  };

  const vehicles = [
    {
      id: 'AMB-001',
      type: 'Ambulancia',
      status: 'Disponible',
      location: 'Hospital Central',
      fuel: 85,
      lastMaintenance: '2024-06-15',
      priority: 'high'
    },
    {
      id: 'FIRE-002',
      type: 'Camión de Bomberos',
      status: 'En servicio',
      location: 'Estación Norte',
      fuel: 92,
      lastMaintenance: '2024-06-20',
      priority: 'medium'
    },
    {
      id: 'POL-003',
      type: 'Patrulla',
      status: 'Disponible',
      location: 'Sector 4',
      fuel: 78,
      lastMaintenance: '2024-06-18',
      priority: 'low'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponible': return 'bg-green-500';
      case 'En servicio': return 'bg-yellow-500';
      case 'Mantenimiento': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getFuelColor = (fuel: number) => {
    if (fuel >= 70) return 'text-green-400';
    if (fuel >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <ResponsiveLayout hasBottomNav={true}>
      {/* Header */}
      <div className="text-center py-6 px-4">
        <h1 className="text-responsive-xl font-bold text-gray-300 mb-2 flex items-center justify-center">
          <Truck className="h-6 w-6 sm:h-8 sm:w-8 mr-2 text-blue-500" />
          Gestión de Vehículos
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Monitoreo y control de flota de emergencias
        </p>
      </div>

      {/* Fleet Summary */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <Card className="bg-gray-900 border-gray-700 p-3 text-center">
            <div className="text-lg sm:text-xl font-bold text-green-400">8</div>
            <div className="text-xs text-gray-400">Disponibles</div>
          </Card>
          <Card className="bg-gray-900 border-gray-700 p-3 text-center">
            <div className="text-lg sm:text-xl font-bold text-yellow-400">3</div>
            <div className="text-xs text-gray-400">En Servicio</div>
          </Card>
          <Card className="bg-gray-900 border-gray-700 p-3 text-center">
            <div className="text-lg sm:text-xl font-bold text-red-400">1</div>
            <div className="text-xs text-gray-400">Mantenimiento</div>
          </Card>
        </div>
      </div>

      {/* Vehicle List */}
      <div className="px-4 space-y-3 sm:space-y-4">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="bg-gray-900 border-gray-700 p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium text-white text-sm sm:text-base">{vehicle.type}</h3>
                <p className="text-xs sm:text-sm text-gray-400">{vehicle.id}</p>
              </div>
              <Badge className={`${getStatusColor(vehicle.status)} text-white text-xs`}>
                {vehicle.status}
              </Badge>
            </div>
            
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{vehicle.location}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-gray-400">
                  <Fuel className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Combustible:</span>
                </div>
                <span className={getFuelColor(vehicle.fuel)}>{vehicle.fuel}%</span>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-400">
                <SettingsIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Último mantenimiento: {vehicle.lastMaintenance}</span>
              </div>
            </div>
            
            <div className="mt-3 flex space-x-2">
              <Button size="sm" variant="outline" className="flex-1 text-xs">
                Ubicar
              </Button>
              <Button size="sm" variant="outline" className="flex-1 text-xs">
                Detalles
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-semibold text-white mb-3">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button variant="outline" className="bg-gray-900 border-gray-700 text-gray-300 text-sm">
            Despachar Vehículo
          </Button>
          <Button variant="outline" className="bg-gray-900 border-gray-700 text-gray-300 text-sm">
            Programar Mantenimiento
          </Button>
        </div>
      </div>

      <BottomNavigation onEmergencyStart={handleEmergencyStart} />
    </ResponsiveLayout>
  );
};

export default VehiclePage;
