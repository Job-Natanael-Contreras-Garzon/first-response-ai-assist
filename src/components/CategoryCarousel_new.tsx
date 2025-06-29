import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { EmergencyCategory, categories } from '@/data/emergencyCategories';

interface CategoryCarouselProps {
  onCategorySelect?: (category: EmergencyCategory) => void;
  selectedCategoryId?: string | null;
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ 
  onCategorySelect,
  selectedCategoryId
}) => {
  const [currentCategories, setCurrentCategories] = useState<EmergencyCategory[]>(categories);
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<EmergencyCategory[]>([]);

  const handleCategoryClick = (category: EmergencyCategory) => {
    // Si la categoría tiene subcategorías, mostrarlas
    if (category.subcategories && category.subcategories.length > 0) {
      setCurrentCategories(category.subcategories);
      setCurrentParentId(category.id);
      setBreadcrumb([...breadcrumb, category]);
    } else {
      // Si no tiene subcategorías, seleccionarla
      if (onCategorySelect) {
        onCategorySelect(category);
      }
    }
  };

  const handleBack = () => {
    if (breadcrumb.length === 0) return;
    
    // Si hay niveles en la navegación, volver al anterior
    const newBreadcrumb = [...breadcrumb];
    newBreadcrumb.pop(); // Eliminar el último nivel
    
    if (newBreadcrumb.length === 0) {
      // Volver a las categorías principales
      setCurrentCategories(categories);
      setCurrentParentId(null);
    } else {
      // Volver a las subcategorías del nivel anterior
      const parentCategory = newBreadcrumb[newBreadcrumb.length - 1];
      setCurrentCategories(parentCategory.subcategories || []);
      setCurrentParentId(parentCategory.id);
    }
    
    setBreadcrumb(newBreadcrumb);
  };

  // Determinar el título según el nivel de navegación
  const getTitle = () => {
    if (selectedCategoryId) {
      return "EMERGENCIA SELECCIONADA";
    }
    
    if (currentParentId) {
      const parentCategory = breadcrumb[breadcrumb.length - 1];
      return parentCategory ? parentCategory.title.toUpperCase() : "SELECCIONA TIPO";
    }
    
    return "SELECCIONA EMERGENCIA";
  };

  // Determinar el subtítulo según el nivel de navegación
  const getSubtitle = () => {
    if (selectedCategoryId) {
      return "Procesando información para esta emergencia";
    }
    
    if (currentParentId) {
      return "Selecciona una opción específica";
    }
    
    return "Selecciona la categoría de tu emergencia";
  };

  return (
    <div className="w-full">
      <div className="px-4 mb-2 flex flex-col items-center">
        <h3 className="text-lg font-bold text-slate-700">
          {getTitle()}
        </h3>
        <p className="text-sm text-slate-600 text-center mt-1">
          {getSubtitle()}
        </p>
      </div>
      
      {/* Botón de retroceso cuando estamos en subcategorías */}
      {currentParentId && (
        <div className="flex justify-start px-4 mb-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleBack}
            className="text-slate-600 flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Button>
        </div>
      )}
      
      {/* Carrusel horizontal con scroll */}
      <div className="relative">
        <div className="flex overflow-x-auto scrollbar-hide space-x-3 px-4 pb-4">
          {currentCategories.map((category, index) => {
            const isSelected = selectedCategoryId === category.id;
            const hasSubcategories = category.subcategories && category.subcategories.length > 0;
            
            return (
              <Card 
                key={category.id} 
                className={`
                  flex-shrink-0 w-32 sm:w-36 h-48 sm:h-55 
                  ${category.bgColor} border-2 
                  ${isSelected 
                    ? 'border-4 border-slate-800 shadow-xl scale-105' 
                    : category.borderColor + ' hover:shadow-lg hover:border-opacity-70 hover:scale-105'
                  }
                  transition-all duration-200 
                  cursor-pointer 
                  p-3 sm:p-4
                  ${isSelected ? 'relative' : ''}
                `}
                onClick={() => handleCategoryClick(category)}
              >
                <div className="h-full flex flex-col justify-between text-center">
                  {/* Espacio superior amplio para futuras imágenes */}
                  <div className="flex-1 flex items-center justify-center">
                    {category.icon && <category.icon className={`h-10 w-10 sm:h-12 sm:w-12 ${category.color}`} />}
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
                  
                  {/* Indicador de subcategorías */}
                  {hasSubcategories && (
                    <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-white text-xxs">
                      +
                    </div>
                  )}
                </div>
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-white text-sm">
                    ✓
                  </div>
                )}
              </Card>
            );
          })}
        </div>
        
        {/* Gradiente de fade en los bordes */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-sky-200 to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-teal-100 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default CategoryCarousel;
