
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Smartphone, ShoppingBag, TrendingUp, ShoppingCart, Laptop } from 'lucide-react';

const categories = [
  {
    name: "Smartphones",
    icon: Smartphone,
    className: "bg-blue-500/10 hover:bg-blue-500/20"
  },
  {
    name: "Fashion",
    icon: ShoppingBag,
    className: "bg-pink-500/10 hover:bg-pink-500/20"
  },
  {
    name: "Stocks",
    icon: TrendingUp,
    className: "bg-green-500/10 hover:bg-green-500/20"
  },
  {
    name: "Groceries",
    icon: ShoppingCart,
    className: "bg-orange-500/10 hover:bg-orange-500/20"
  },
  {
    name: "Electronics",
    icon: Laptop,
    className: "bg-purple-500/10 hover:bg-purple-500/20"
  }
];

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleCategoryClick = (category: string) => {
    setQuery(category);
    navigate(`/results?query=${category.toLowerCase()}`);
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background with product images and gradient overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f2c]/95 via-[#1EAEDB]/80 to-[#7E69AB]/90" />
        <div className="absolute inset-0 bg-[url('/lovable-uploads/58828f58-010b-458d-84ce-7a0afb939604.png')] bg-cover bg-center opacity-30" />
      </div>

      <div className="relative z-20 flex flex-col items-center w-full px-4">
        <Header />
        <div className="w-full flex flex-col items-center justify-center pt-36 pb-10">
          <div className={`transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-4 drop-shadow-lg">
              Find Product Performance
            </h1>
            <p className="text-lg md:text-xl text-white/80 text-center mb-8 max-w-2xl mx-auto">
              Enter a product to instantly see its latest performance & insights.
            </p>
            <div className="w-full max-w-2xl mx-auto relative">
              <SearchBar />
            </div>
            <div className={`mt-12 flex flex-col items-center transition-all duration-700 delay-400 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="text-xl text-white/90 mb-6 font-medium">Browse Categories</span>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.name}
                      onClick={() => handleCategoryClick(category.name)}
                      className={`${category.className} p-4 rounded-xl flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 group`}
                    >
                      <Icon className="w-8 h-8 text-white/90 group-hover:text-white" />
                      <span className="text-white font-medium">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Index;
