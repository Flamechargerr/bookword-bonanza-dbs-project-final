
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface BooksFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterGenre: string;
  setFilterGenre: (genre: string) => void;
  genres: string[];
}

const BooksFilter: React.FC<BooksFilterProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  filterGenre, 
  setFilterGenre, 
  genres 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm"
    >
      <div className="relative w-full md:w-1/2">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-500" />
        <Input
          type="text"
          placeholder="Search by title or author..."
          className="pl-10 w-full border-purple-200 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2 w-full md:w-auto">
        <Filter className="h-4 w-4 text-purple-600" />
        <select
          className="w-full md:w-auto px-4 py-2 border border-purple-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          value={filterGenre}
          onChange={(e) => setFilterGenre(e.target.value)}
        >
          <option value="">All Genres</option>
          {genres.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>
    </motion.div>
  );
};

export default BooksFilter;
