import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Truck, Mic, Ambulance } from 'lucide-react';

interface EmergencyButtonProps {
  onEmergencyStart: () => void;
  variant?: 'large' | 'small';
  directCall?: boolean; // Nueva prop para llamada directa
}

const EmergencyButton: React.FC<EmergencyButtonProps> = ({ 
  onEmergencyStart, 
  variant = 'large',
  directCall = false
}) => {
  // Estado para almacenar dimensiones responsivas
  const [buttonSize, setButtonSize] = useState({ width: '14rem', height: '14rem' });
  const [iconSize, setIconSize] = useState({ width: '8rem', height: '8rem' });
  const [smallButtonSize, setSmallButtonSize] = useState({ width: '5rem', height: '5rem' });
  const [smallIconSize, setSmallIconSize] = useState({ width: '3rem', height: '3rem' });
  
  // Actualizar tamaños basados en el ancho de la ventana
  useEffect(() => {
    const updateSizes = () => {
      const width = window.innerWidth;
      
      if (width < 640) { // Móvil
        setButtonSize({ width: '12rem', height: '12rem' });
        setIconSize({ width: '7rem', height: '7rem' });
        setSmallButtonSize({ width: '5rem', height: '5rem' });
        setSmallIconSize({ width: '3rem', height: '3rem' });
      } else if (width < 768) { // Tablet pequeña
        setButtonSize({ width: '14rem', height: '14rem' });
        setIconSize({ width: '8rem', height: '8rem' });
        setSmallButtonSize({ width: '6rem', height: '6rem' });
        setSmallIconSize({ width: '3.5rem', height: '3.5rem' });
      } else if (width < 1024) { // Tablet
        setButtonSize({ width: '16rem', height: '16rem' });
        setIconSize({ width: '9rem', height: '9rem' });
        setSmallButtonSize({ width: '7rem', height: '7rem' });
        setSmallIconSize({ width: '4rem', height: '4rem' });
      } else { // Desktop
        setButtonSize({ width: '18rem', height: '18rem' });
        setIconSize({ width: '10rem', height: '10rem' });
        setSmallButtonSize({ width: '8rem', height: '8rem' });
        setSmallIconSize({ width: '4.5rem', height: '4.5rem' });
      }
    };
    
    updateSizes(); // Ejecutar al montar
    
    window.addEventListener('resize', updateSizes);
    return () => window.removeEventListener('resize', updateSizes);
  }, []);
  
  const handleClick = () => {
    if (directCall) {
      // Llamada directa a emergencias
      if (window.confirm('¿Deseas realizar una llamada de emergencia al 911?')) {
        window.location.href = 'tel:911';
      }
    } else {
      // Flujo normal de emergencia
      onEmergencyStart();
    }
  };
  if (variant === 'small') {
    return (
      <Button
        onClick={handleClick}
        className="rounded-full bg-gradient-to-br from-rose-400 to-red-500 hover:from-rose-500 hover:to-red-600 shadow-lg flex items-center justify-center"
        style={{
          width: smallButtonSize.width,
          height: smallButtonSize.height,
          padding: 0,
        }}
      >
        <Mic 
          className="text-white" 
          style={{
            width: smallIconSize.width,
            height: smallIconSize.height
          }}
        />
      </Button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      className="rounded-full bg-gradient-to-br from-rose-400 to-red-500 hover:from-rose-500 hover:to-red-600 text-white shadow-2xl transform hover:scale-105 transition-all duration-200 border-4 border-rose-300/40 flex items-center justify-center"
      style={{
        width: buttonSize.width,
        height: buttonSize.height,
        padding: 0,
      }}
    >
      <Ambulance 
        className="stroke-[1.5] text-white drop-shadow-md" 
        style={{
          width: iconSize.width,
          height: iconSize.height
        }}
      />
    </Button>
  );
};

export default EmergencyButton;
