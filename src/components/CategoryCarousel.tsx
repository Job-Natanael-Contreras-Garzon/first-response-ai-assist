
import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  Heart, 
  Zap, 
  Flame, 
  Scissors, 
  Activity,
  Thermometer,
  Shield,
  AlertTriangle,
  Phone,
  Droplet
} from 'lucide-react';

const categories = [
  {
    id: 'cardio',
    title: 'Cardíaco',
    description: 'Dolor de pecho, infarto',
    icon: Heart,
    color: 'text-red-500',
    bgColor: 'bg-red-900/20',
    borderColor: 'border-red-500/30'
  },
  {
    id: 'respiratory',
    title: 'Respiratorio', 
    description: 'Asfixia, dificultad respirar',
    icon: Activity,
    color: 'text-blue-500',
    bgColor: 'bg-blue-900/20',
    borderColor: 'border-blue-500/30'
  },
  {
    id: 'bleeding',
    title: 'Hemorragias',
    description: 'Cortes, sangrado severo',
    icon: Droplet,
    color: 'text-red-600',
    bgColor: 'bg-red-900/30',
    borderColor: 'border-red-600/30'
  },
  {
    id: 'burns',
    title: 'Quemaduras',
    description: 'Fuego, calor, químicos',
    icon: Flame,
    color: 'text-orange-500',
    bgColor: 'bg-orange-900/20',
    borderColor: 'border-orange-500/30'
  },
  {
    id: 'trauma',
    title: 'Trauma',
    description: 'Fracturas, golpes severos',
    icon: Zap,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-900/20',
    borderColor: 'border-yellow-500/30'
  },
  {
    id: 'poisoning',
    title: 'Intoxicación',
    description: 'Venenos, alimentos',
    icon: Thermometer,
    color: 'text-purple-500',
    bgColor: 'bg-purple-900/20',
    borderColor: 'border-purple-500/30'
  },
  {
    id: 'cpr',
    title: 'RCP',
    description: 'Paro cardíaco, inconsciente',
    icon: Shield,
    color: 'text-green-500',
    bgColor: 'bg-green-900/20',
    borderColor: 'border-green-500/30'
  },
  {
    id: 'neurological',
    title: 'Neurológico',
    description: 'Convulsiones, desmayos',
    icon: AlertTriangle,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-900/20',
    borderColor: 'border-indigo-500/30'
  }
];

const CategoryCarousel = () => {
  return (
    <div className="w-full">
      <div className="px-4 mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">Categorías de Emergencia</h3>
        <p className="text-sm text-gray-400">Desliza para ver todas las categorías</p>
      </div>
      
      {/* Carrusel horizontal con scroll */}
      <div className="relative">
        <div className="flex overflow-x-auto scrollbar-hide space-x-3 px-4 pb-4">
          {categories.map((category, index) => (
            <Card 
              key={category.id} 
              className={`
                flex-shrink-0 w-32 sm:w-36 h-28 sm:h-32 
                bg-gray-900 border ${category.borderColor} 
                ${category.bgColor} 
                hover:bg-gray-800 
                transition-all duration-200 
                cursor-pointer 
                hover:scale-105
                p-3 sm:p-4
              `}
            >
              <div className="h-full flex flex-col items-center justify-center text-center">
                <category.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${category.color} mb-2`} />
                <h4 className="font-medium text-white text-xs sm:text-sm mb-1">
                  {category.title}
                </h4>
                <p className="text-xs text-gray-400 leading-tight">
                  {category.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Gradiente de fade en los bordes */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
      </div>
      
      {/* Indicador de scroll */}
      <div className="text-center mt-2">
        <p className="text-xs text-gray-500">← Desliza para ver más →</p>
      </div>
    </div>
  );
};

export default CategoryCarousel;
