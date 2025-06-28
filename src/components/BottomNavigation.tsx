import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Heart, 
  Mic, 
  Car, 
  Settings,
  Activity,
  Stethoscope,
  Truck
} from 'lucide-react';
import EmergencyButton from './EmergencyButton';

interface BottomNavigationProps {
  onEmergencyStart: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ onEmergencyStart }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      icon: Activity,
      label: 'Live',
      path: '/live',
      action: () => navigate('/live')
    },
    {
      icon: Stethoscope,
      label: 'Medic',
      path: '/medic',
      action: () => navigate('/medic')
    },
    {
      icon: null, // Emergency button
      label: 'Emergency',
      path: null,
      action: onEmergencyStart
    },
    {
      icon: Truck,
      label: 'Vehicle',
      path: '/vehicle',
      action: () => navigate('/vehicle')
    },
    {
      icon: Settings,
      label: 'Settings',
      path: '/settings',
      action: () => navigate('/settings')
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 safe-area-pb z-40">
      <div className="flex justify-center items-center bottom-nav-responsive max-w-lg mx-auto">
        <div className="flex justify-between items-center w-full">
          {navigationItems.map((item, index) => {
            const isActive = item.path && location.pathname === item.path;
            
            if (index === 2) { // Emergency button
              return (
                <div key="emergency" className="flex flex-col items-center">
                  <EmergencyButton onEmergencyStart={onEmergencyStart} variant="small" />
                </div>
              );
            }

            const IconComponent = item.icon!;
            
            return (
              <button
                key={item.label}
                onClick={item.action}
                className={`flex flex-col items-center space-y-1 px-2 sm:px-3 py-1 rounded-lg transition-colors min-w-0 ${
                  isActive 
                    ? 'text-red-400 bg-gray-800' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-xs font-medium truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
