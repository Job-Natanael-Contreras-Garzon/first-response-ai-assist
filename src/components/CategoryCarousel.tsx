
import React from 'react';
import { Card } from '@/components/ui/card';

const categories = [
  {
    id: 'dog-bite',
    title: 'Mordedura de perro',
    image: '/lovable-uploads/5f00af01-a52f-4d78-925f-02621a16d462.png',
    color: 'bg-slate-500'
  },
  {
    id: 'seizures',
    title: 'Seizures',
    image: '/lovable-uploads/5f00af01-a52f-4d78-925f-02621a16d462.png',
    color: 'bg-blue-600'
  },
  {
    id: 'fractures',
    title: 'Fractures',
    image: '/lovable-uploads/5f00af01-a52f-4d78-925f-02621a16d462.png',
    color: 'bg-teal-600'
  }
];

const CategoryCarousel = () => {
  return (
    <div className="px-4 py-6">
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
        {categories.map((category) => (
          <Card 
            key={category.id}
            className="flex-shrink-0 w-32 h-40 relative overflow-hidden cursor-pointer hover:scale-105 transition-transform"
          >
            <div className={`absolute inset-0 ${category.color} opacity-80`} />
            <div className="absolute inset-0 flex flex-col justify-end p-3">
              <h3 className="text-white text-sm font-medium text-center">
                {category.title}
              </h3>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoryCarousel;
