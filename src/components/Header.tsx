import { ChartLine } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';

const Header = ({ onCategorySelect }: { onCategorySelect: (category: string) => void }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    api.getCategories()
      .then(data => setCategories(data.categories))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const category = event.target.value;
    setSelectedCategory(category);
    onCategorySelect(category);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            <ChartLine className="h-8 w-8 text-orange-500 mr-2" />
            <span className="text-xl font-bold text-white">Product Performance</span>
          </div>
          <div className="ml-4">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="p-2 border rounded bg-white text-gray-800"
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
