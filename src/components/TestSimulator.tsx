import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Zap, TestTube, Play } from 'lucide-react';

interface TestSimulatorProps {
  onSimulate: (text: string) => void;
}

const TestSimulator: React.FC<TestSimulatorProps> = ({ onSimulate }) => {
  const testScenarios = [
    {
      id: 'gunshot',
      title: 'Disparo en la Pierna',
      text: 'Me dispararon en la pierna, hay mucha sangre',
      icon: Zap,
      color: 'bg-red-900 border-red-600'
    },
    {
      id: 'choking',
      title: 'Atragantamiento',
      text: 'mi hijo se está asfixiando no puede respirar',
      icon: TestTube,
      color: 'bg-blue-900 border-blue-600'
    },
    {
      id: 'chest_pain',
      title: 'Dolor de Pecho',
      text: 'tengo dolor opresivo en el pecho y sudor frío',
      icon: Play,
      color: 'bg-orange-900 border-orange-600'
    },
    {
      id: 'severe_cut',
      title: 'Corte Profundo',
      text: 'me corté profundo en el brazo y no para de sangrar',
      icon: TestTube,
      color: 'bg-purple-900 border-purple-600'
    }
  ];

  return (
    <Card className="bg-gray-900 border-gray-700 p-4 m-4">
      <div className="flex items-center space-x-2 mb-4">
        <TestTube className="h-5 w-5 text-green-400" />
        <h3 className="text-lg font-semibold text-white">Simulador de Pruebas</h3>
      </div>
      
      <p className="text-sm text-gray-400 mb-4">
        Prueba diferentes escenarios de emergencia mientras configuras tu API
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {testScenarios.map((scenario) => (
          <Button
            key={scenario.id}
            onClick={() => onSimulate(scenario.text)}
            variant="outline"
            className={`${scenario.color} text-white hover:opacity-80 transition-opacity p-3 h-auto`}
          >
            <div className="flex items-center space-x-2">
              <scenario.icon className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium text-sm">{scenario.title}</div>
                <div className="text-xs opacity-70 truncate max-w-32">
                  "{scenario.text.substring(0, 30)}..."
                </div>
              </div>
            </div>
          </Button>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
        <p className="text-xs text-yellow-300">
          💡 <strong>Nota:</strong> Estos simuladores te permiten probar la lógica de primeros auxilios sin necesidad de reconocimiento de voz.
        </p>
      </div>
    </Card>
  );
};

export default TestSimulator;
