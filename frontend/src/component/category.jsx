import { useState } from 'react';
import All from '../component/g.jpg';
import Men from '../component/gg.png';
import Women from '../component/g.jpg';
import Kids from '../component/g.jpg';

const SmallScreenCategory = ({activeCategory,setActiveCategory}) => {
//   const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: All },
    { id: 'men', name: 'Men', icon: Men },
    { id: 'women', name: 'Women', icon: Women },
    { id: 'kids', name: 'Kids', icon: Kids }
  ];

  return (
    <div className="mt-4 md:hidden">
      <div className="grid grid-cols-4 gap-3 px-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex flex-col items-center ${activeCategory === category.id ? 'text-indigo-600' : 'text-gray-700'}`}
            aria-current={activeCategory === category.id ? 'true' : 'false'}
          >
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center mb-1 p-1
              overflow-hidden transition-all duration-200
              ${activeCategory === category.id 
                ? 'bg-indigo-50 ring-2 ring-indigo-200 scale-105' 
                : 'bg-gray-100 hover:bg-gray-200'}
            `}>
              <div className="w-full h-full rounded-full overflow-hidden">
                <img 
                  src={category.icon}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <span className="text-xs font-medium">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SmallScreenCategory;