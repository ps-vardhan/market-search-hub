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
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f2c]/95 via-[#1EAEDB]/80 to-[#7E69AB]/90" />
          <div className="absolute inset-0 bg-[url('/lovable-uploads/58828f58-010b-458d-84ce-7a0afb939604.png')] bg-cover bg-center opacity-30" />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <div className={`transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Product Performance Insights
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-8">
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
      <section className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-[#1a1f2c] via-[#1EAEDB]/20 to-[#7E69AB]/20">
        <div className="relative z-10 w-full px-4">
          <div className={`transition-all duration-1000`}>
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
              {selectedCategory ? `Search ${selectedCategory}` : 'Select a Category'}
            </h2>
            <p className="text-lg md:text-xl text-white/80 text-center mb-8 max-w-2xl mx-auto">
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
                        selectedCategory === category.name ? 'ring-2 ring-white' : ''
                      }`}
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
      </section>
    </main>
  );
};

export default Index;
