
import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  Heart, 
  Zap, 
  Flame, 
  Activity,
  Thermometer,
  Shield,
  AlertTriangle,
  Droplet
} from 'lucide-react';

const categories = [
  {
    id: 'cardio',
    title: 'Cardíaco',
    description: 'Dolor de pecho, infarto',
    icon: Heart,
    color: 'text-orange-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-orange-300'
  },
  {
    id: 'respiratory',
    title: 'Respiratorio', 
    description: 'Asfixia, dificultad respirar',
    icon: Activity,
    color: 'text-sky-600',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-300'
  },
  {
    id: 'bleeding',
    title: 'Hemorragias',
    description: 'Cortes, sangrado severo',
    icon: Droplet,
    color: 'text-red-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-red-300'
  },
  {
    id: 'burns',
    title: 'Quemaduras',
    description: 'Fuego, calor, químicos',
    icon: Flame,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300'
  },
  {
    id: 'trauma',
    title: 'Trauma',
    description: 'Fracturas, golpes severos',
    icon: Zap,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300'
  },
  {
    id: 'poisoning',
    title: 'Intoxicación',
    description: 'Venenos, alimentos',
    icon: Thermometer,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300'
  },
  {
    id: 'cpr',
    title: 'RCP',
    description: 'Paro cardíaco, inconsciente',
    icon: Shield,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300'
  },
  {
    id: 'neurological',
    title: 'Neurológico',
    description: 'Convulsiones, desmayos',
    icon: AlertTriangle,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-300'
  }
];

const CategoryCarousel = () => {
  return (
    <div className="w-full">
      <div className="px-4 mb-4 flex justify-center">
        <h3 className="text-lg font-bold text-slate-700 mb-2">EMERGENCIAS</h3>
      </div>
      
      {/* Carrusel horizontal con scroll */}
      <div className="relative">
        <div className="flex overflow-x-auto scrollbar-hide space-x-3 px-4 pb-4">
          {categories.map((category, index) => (
            <Card 
              key={category.id} 
              className={`
                flex-shrink-0 w-32 sm:w-36 h-48 sm:h-55 
                ${category.bgColor} border-2 ${category.borderColor} 
                hover:shadow-lg hover:border-opacity-70
                transition-all duration-200 
                cursor-pointer 
                hover:scale-105
                p-3 sm:p-4
              `}
            >
              <div className="h-full flex flex-col justify-between text-center">
                {/* Espacio superior amplio para futuras imágenes */}
                <div className="flex-1 flex items-center justify-center">
                  <category.icon className={`h-10 w-10 sm:h-12 sm:w-12 ${category.color}`} />
                </div>
                
                {/* Texto en la parte inferior con más espacio */}
                <div className="mt-auto pb-1">
                  <h4 className="font-medium text-slate-700 text-xs sm:text-sm mb-1">
                    {category.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-tight">
                    {category.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Gradiente de fade en los bordes */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-sky-200 to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-teal-100 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default CategoryCarousel;
