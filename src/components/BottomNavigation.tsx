import React from 'react';
import { Mic } from 'lucide-react';
import EmergencyButton from './EmergencyButton';

interface BottomNavigationProps {
  onEmergencyStart: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ onEmergencyStart }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 safe-area-pb z-40">
      <div className="flex justify-center items-center py-4 max-w-lg mx-auto">
        <EmergencyButton onEmergencyStart={onEmergencyStart} variant="small" />
      </div>
    </div>
  );
};

export default BottomNavigation;
