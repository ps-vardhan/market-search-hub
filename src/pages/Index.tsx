
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import { processMlQuery } from '@/services/mlService';
import { Smartphone, ShoppingBag, TrendingUp, ShoppingCart, Laptop } from 'lucide-react';

const categories = [
  {
    name: "Smartphones",
    icon: Smartphone,
    className: "bg-gradient-vibrant-blue text-white hover:shadow-lg"
  },
  {
    name: "Fashion",
    icon: ShoppingBag,
    className: "bg-gradient-vibrant-pink text-white hover:shadow-lg"
  },
  {
    name: "Stocks",
    icon: TrendingUp,
    className: "bg-gradient-vibrant-green text-white hover:shadow-lg"
  },
  {
    name: "Groceries",
    icon: ShoppingCart,
    className: "bg-gradient-vibrant-orange text-white hover:shadow-lg"
  },
  {
    name: "Electronics",
    icon: Laptop,
    className: "bg-gradient-vibrant-purple text-white hover:shadow-lg"
  }
];

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearch = async (query: string) => {
    if (!query.trim() || !selectedCategory) return;
    
    try {
      const result = await processMlQuery(selectedCategory as any, query);
      navigate(`/results?query=${encodeURIComponent(query)}&category=${selectedCategory}`, {
        state: { mlResults: result }
      });
    } catch (error) {
      toast.error("Error processing your search. Please try again.");
      console.error('Search error:', error);
    }
  };

  return (
    <main className="min-h-screen relative">
      <Header />
      
      {/* First Section - Introduction */}
      <section className="min-h-screen relative flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f2c]/95 via-[#0EA5E9]/80 to-[#8B5CF6]/90" />
          <div className="absolute inset-0 bg-[url('/lovable-uploads/58828f58-010b-458d-84ce-7a0afb939604.png')] bg-cover bg-center opacity-30" />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <div className={`transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-shadow-lg">
              Product Performance Insights
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-8">
              Discover real-time performance metrics and insights for products across various categories.
            </p>
            <div className="animate-bounce mt-12">
              <p className="text-white/90">Scroll down to explore categories</p>
              <div className="mt-4 w-6 h-6 mx-auto border-b-2 border-r-2 border-white transform rotate-45"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Second Section - Category Selection */}
      <section className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-[#1a1f2c] via-[#0EA5E9]/30 to-[#EC4899]/30">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.1"/>
                <stop offset="100%" stopColor="#EC4899" stopOpacity="0.1"/>
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#grad1)"/>
            
            {/* Animated shapes */}
            <circle className="animate-float-1" cx="10%" cy="20%" r="80" fill="#8B5CF6" opacity="0.05"/>
            <circle className="animate-float-2" cx="80%" cy="60%" r="120" fill="#EC4899" opacity="0.05"/>
            <circle className="animate-float-3" cx="50%" cy="30%" r="100" fill="#0EA5E9" opacity="0.05"/>
          </svg>
        </div>
        
        <div className="relative z-10 w-full px-4">
          <div className={`transition-all duration-1000`}>
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
              {selectedCategory ? `Search ${selectedCategory}` : 'Select a Category'}
            </h2>
            <p className="text-lg md:text-xl text-white/90 text-center mb-8 max-w-2xl mx-auto">
              {selectedCategory 
                ? 'Enter a product to instantly see its latest performance & insights.'
                : 'Choose a category to begin your search.'}
            </p>

            {selectedCategory && (
              <div className="w-full max-w-2xl mx-auto mb-12 transition-all duration-500">
                <SearchBar onSearch={handleSearch} />
              </div>
            )}

            <div className="mt-6 flex flex-col items-center">
              <span className="text-xl text-white/90 mb-6 font-medium">
                {selectedCategory ? 'Change Category' : 'Browse Categories'}
              </span>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.name}
                      onClick={() => handleCategoryClick(category.name)}
                      className={`${category.className} p-4 rounded-xl flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 group ${
                        selectedCategory === category.name ? 'ring-2 ring-white shadow-lg' : ''
                      }`}
                    >
                      <Icon className="w-8 h-8 text-white group-hover:text-white" />
                      <span className="text-white font-medium">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
