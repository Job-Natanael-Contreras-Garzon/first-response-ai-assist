import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Mic } from 'lucide-react';

interface EmergencyButtonProps {
  onEmergencyStart: () => void;
  variant?: 'large' | 'small';
}

const EmergencyButton: React.FC<EmergencyButtonProps> = ({ 
  onEmergencyStart, 
  variant = 'large' 
}) => {
  if (variant === 'small') {
    return (
      <Button
        onClick={onEmergencyStart}
        className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700"
      >
        <Mic className="h-8 w-8" />
      </Button>
    );
  }

  return (
    <Button
      onClick={onEmergencyStart}
      className="emergency-btn-responsive rounded-full bg-red-600 hover:bg-red-700 text-white shadow-2xl transform hover:scale-105 transition-all duration-200 border-4 border-red-500"
    >
      <Phone className="h-12 w-12 sm:h-16 sm:w-16" />
    </Button>
  );
};

export default EmergencyButton;
