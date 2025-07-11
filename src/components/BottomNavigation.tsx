import React from 'react';
import EmergencyButton from './EmergencyButton';

interface BottomNavigationProps {
  onEmergencyStart: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  onEmergencyStart
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-cyan-200 safe-area-pb z-40">
      <div className="flex justify-center items-center py-0.5 max-w-lg mx-auto">
        {/* Botón de Emergencia */}
        <EmergencyButton onEmergencyStart={onEmergencyStart} variant="small" />
      </div>
    </div>
  );
};

export default BottomNavigation;
