
import React from 'react';
import { motion } from 'framer-motion';
import BookCard from './BookCard';
import { Database, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Book {
  isbn: string;
  title: string;
  author: string;
  rating: number;
  genre?: string;
  imageUrl: string;
  summary?: string;
  authorDetails?: any;
  reviews?: Array<any>;
}

interface BooksListProps {
  books: Book[] | undefined;
  isLoading: boolean;
  handleRetry: () => void;
  searchTerm: string;
  filterGenre: string;
}

const BooksList: React.FC<BooksListProps> = ({ books, isLoading, handleRetry, searchTerm, filterGenre }) => {
  const filteredBooks = books?.filter(book => {
    const matchesSearch = searchTerm === "" || 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = filterGenre === "" || 
      (book.genre?.toLowerCase() === filterGenre.toLowerCase());
    
    return matchesSearch && matchesGenre;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin"></div>
          <BookCard className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-purple-600" />
        </div>
        <p className="mt-4 text-purple-600 font-medium">Loading your library...</p>
      </div>
    );
  }

  if (!filteredBooks || filteredBooks.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm"
      >
        <Database className="h-20 w-20 mx-auto text-purple-300 mb-4" />
        <h3 className="text-2xl font-medium text-gray-600 mb-2">No books found</h3>
        <p className="text-gray-500 mb-6">
          {searchTerm || filterGenre 
            ? "No books match your search criteria. Try adjusting your filters."
            : "There are currently no books in the database or there might be an issue with the connection"}
        </p>
        <div className="space-y-4">
          <Button 
            onClick={handleRetry}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Retry Connection
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredBooks.map((book, index) => (
        <motion.div
          key={book.isbn}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <BookCard {...book} />
        </motion.div>
      ))}
    </div>
  );
};

export default BooksList;
