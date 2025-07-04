import React from 'react';
import { 
  Heart, 
  Zap, 
  Flame, 
  Activity,
  Thermometer,
  Shield,
  AlertTriangle,
  Droplet,
  Eye,
  Scissors,
  BatteryFull,
  Skull,
  Pill,
  Utensils,
  Bug,
  BoneIcon,
  Wind,
  SunIcon,
  Snowflake,
  Frown,
  Waves,
  Brain
} from 'lucide-react';

// Definimos la interface para la categoría
export interface EmergencyCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  bgColor: string;
  borderColor: string;
  subcategories?: EmergencyCategory[];
  parentId?: string; // Para saber a qué categoría pertenece esta subcategoría
}

export const categories: EmergencyCategory[] = [
  // Ojo - dolor en el ojo
  {
    id: 'ojo',
    title: 'Ojo',
    description: 'Dolor en el ojo',
    icon: Eye,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300'
  },
  
  
  
  // Intoxicación - leve
  
  
  // Dolor abdominal
  
  
  
  
  // Crisis de ansiedad
  
  
  // Mordeduras
  
  // Alergias - leve
  
  
  // Dientes rotos
  {
    id: 'dientes_rotos',
    title: 'Dientes rotos',
    description: 'Traumatismo dental',
    icon: Scissors,
    color: 'text-stone-600',
    bgColor: 'bg-stone-50',
    borderColor: 'border-stone-300'
  },
  
  // Dificultad para respirar
  {
    id: 'dificultad_para_respirar',
    title: 'Dificultad para respirar',
    description: 'Problemas respiratorios',
    icon: Activity,
    color: 'text-sky-600',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-300'
  },
  
  // Quemaduras - superficial(1er Grado) - ampollas(2do grado)
  {
    id: 'quemaduras',
    title: 'Quemaduras',
    description: 'Lesiones térmicas',
    icon: Flame,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    subcategories: [
      {
        id: 'quemaduras_superficial',
        title: 'Superficial (1er Grado)',
        description: 'Enrojecimiento',
        icon: Flame,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-300',
        parentId: 'quemaduras'
      }
    ]
  },
  
  // Atragantamiento - adultos niños mayores - bebes(menor 1 año)
  {
    id: 'atragantamiento',
    title: 'Atragantamiento',
    description: 'Obstrucción vía aérea',
    icon: Activity,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    subcategories: [
      {
        id: 'atragantamiento_adultos_ninos_mayores',
        title: 'Adultos niños mayores',
        description: 'Mayores de 1 año',
        icon: Activity,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-300',
        parentId: 'atragantamiento'
      },
      {
        id: 'atragantamiento_bebes',
        title: 'Bebés (menor 1 año)',
        description: 'Lactantes',
        icon: Activity,
        color: 'text-red-700',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-400',
        parentId: 'atragantamiento'
      }
    ]
  },
  
  // RCP - Adultos - niños(1-8) - bebes(-1)
  {
    id: 'rcp',
    title: 'RCP',
    description: 'Reanimación cardiopulmonar',
    icon: Shield,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    subcategories: [
      {
        id: 'rcp_adultos',
        title: 'Adultos',
        description: 'Mayores de 8 años',
        icon: Shield,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-300',
        parentId: 'rcp'
      },
      {
        id: 'rcp_ninos',
        title: 'Niños (1-8)',
        description: 'Entre 1 y 8 años',
        icon: Shield,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-100',
        borderColor: 'border-emerald-400',
        parentId: 'rcp'
      },
      {
        id: 'rcp_bebes',
        title: 'Bebés (menor 1 año)',
        description: 'Menores de 1 año',
        icon: Shield,
        color: 'text-emerald-700',
        bgColor: 'bg-emerald-100',
        borderColor: 'border-emerald-400',
        parentId: 'rcp'
      }
    ]
  },
  
  // Choque electrico(quemadura electrica)
  {
    id: 'choque_electrico',
    title: 'Choque eléctrico',
    description: 'Quemadura eléctrica',
    icon: BatteryFull,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-300'
  },
  
  // Fracturas
  {
    id: 'fracturas',
    title: 'Fracturas',
    description: 'Huesos rotos',
    icon: BoneIcon,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300'
  },
  
  // Hemorragia
  {
    id: 'hemorragia',
    title: 'Hemorragia',
    description: 'Sangrado abundante',
    icon: Droplet,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300'
  },
  
  // Ahogamiento
  {
    id: 'ahogamiento',
    title: 'Ahogamiento',
    description: 'Inmersión en agua',
    icon: Waves,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300'
  },
  
  // Golpe en la Cabeza
  {
    id: 'golpe_en_la_cabeza',
    title: 'Golpe en la cabeza',
    description: 'Traumatismo craneal',
    icon: Skull,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-300'
  },
  
  // Corte y raspadura
  {
    id: 'corte_y_raspadura',
    title: 'Corte y raspadura',
    description: 'Heridas superficiales',
    icon: Scissors,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300'
  },
  
  // Esguince
  {
    id: 'esguince',
    title: 'Esguince',
    description: 'Torcedura de articulación',
    icon: Zap,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300'
  },
  
  // Picadura - insectos
  {
    id: 'picadura',
    title: 'Picadura',
    description: 'Insectos',
    icon: Bug,
    color: 'text-lime-600',
    bgColor: 'bg-lime-50',
    borderColor: 'border-lime-300',
    subcategories: [
      {
        id: 'picadura_insectos',
        title: 'Insectos',
        description: 'Abejas, avispas, etc.',
        icon: Bug,
        color: 'text-lime-600',
        bgColor: 'bg-lime-50',
        borderColor: 'border-lime-300',
        parentId: 'picadura'
      }
    ]
  },
  
  // Golpes y contusiones
  {
    id: 'golpes_y_contusiones',
    title: 'Golpes y contusiones',
    description: 'Moretones',
    icon: Zap,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300'
  },
  
  // Sangrado Nasal
  {
    id: 'sangrado_nasal',
    title: 'Sangrado nasal',
    description: 'Epistaxis',
    icon: Droplet,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300'
  },
  
  // Insolación
  {
    id: 'insolacion',
    title: 'Insolación',
    description: 'Golpe de calor',
    icon: SunIcon,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300'
  },
  
  // Hipotermia - leve
  {
    id: 'hipotermia',
    title: 'Hipotermia',
    description: 'Temperatura corporal baja',
    icon: Snowflake,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    subcategories: [
      {
        id: 'hipotermia_leve',
        title: 'Leve',
        description: 'Hipotermia leve',
        icon: Snowflake,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-300',
        parentId: 'hipotermia'
      }
    ]
  },
  
  // Desmayo
  {
    id: 'desmayo',
    title: 'Desmayo',
    description: 'Pérdida de consciencia',
    icon: Frown,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-300'
  },
  
  // Convulsiones
  {
    id: 'convulsiones',
    title: 'Convulsiones',
    description: 'Crisis convulsivas',
    icon: AlertTriangle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300'
  }
];
