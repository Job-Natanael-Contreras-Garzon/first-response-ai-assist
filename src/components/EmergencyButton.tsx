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
        className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-red-500 hover:from-rose-500 hover:to-red-600 shadow-lg"
      >
        <Mic className="h-8 w-8 text-white" />
      </Button>
    );
  }

  return (
    <Button
      onClick={onEmergencyStart}
      className="emergency-btn-responsive rounded-full bg-gradient-to-br from-rose-400 to-red-500 hover:from-rose-500 hover:to-red-600 text-white shadow-2xl transform hover:scale-105 transition-all duration-200 border-4 border-rose-300/40"
    >
      <Phone className="h-12 w-12 sm:h-16 sm:w-16" />
    </Button>
  );
};

export default EmergencyButton;
