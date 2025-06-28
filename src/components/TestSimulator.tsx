
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Target, TestTube } from 'lucide-react';

interface TestSimulatorProps {
  onSimulateEmergency: (description: string) => void;
}

const TestSimulator: React.FC<TestSimulatorProps> = ({ onSimulateEmergency }) => {
  const simulateGunshotWound = () => {
    const description = "Me dispararon en la pierna, hay mucha sangre y duele mucho, no puedo caminar";
    console.log('Simulando herida de bala:', description);
    onSimulateEmergency(description);
  };

  const simulateOtherEmergencies = [
    {
      name: "Corte profundo",
      description: "Me corté la mano con un cuchillo, está sangrando mucho"
    },
    {
      name: "Quemadura",
      description: "Me quemé con agua caliente en el brazo, me duele mucho"
    },
    {
      name: "Caída",
      description: "Me caí de las escaleras, me duele mucho la espalda y no puedo moverme"
    }
  ];

  return (
    <Card className="p-4 mb-4 border-2 border-dashed border-blue-300 bg-blue-50">
      <div className="flex items-center space-x-2 mb-3">
        <TestTube className="h-5 w-5 text-blue-600" />
        <h3 className="font-bold text-blue-800">Simulador de Pruebas</h3>
      </div>
      
      <div className="space-y-2">
        <Button
          onClick={simulateGunshotWound}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          <Target className="h-4 w-4 mr-2" />
          Simular Herida de Bala en Pierna
        </Button>
        
        <div className="grid grid-cols-1 gap-2">
          {simulateOtherEmergencies.map((emergency, index) => (
            <Button
              key={index}
              onClick={() => onSimulateEmergency(emergency.description)}
              variant="outline"
              className="text-sm border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              {emergency.name}
            </Button>
          ))}
        </div>
      </div>
      
      <p className="text-xs text-blue-600 mt-2">
        * Estos botones simulan descripciones de emergencias para pruebas
      </p>
    </Card>
  );
};

export default TestSimulator;
