
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className="relative w-full max-w-3xl mx-auto group"
    >
      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder="Search for markets, stocks, or trends..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-4 pr-16 py-6 w-full text-lg rounded-full border-2 border-gray-200 focus:border-orange-500 shadow-lg transition-all duration-300 focus:shadow-orange-200 focus:shadow-md"
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-2 p-2 rounded-full bg-orange-500 hover:bg-orange-600 transition-all duration-300"
        >
          <Search className="h-5 w-5 text-white" />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
