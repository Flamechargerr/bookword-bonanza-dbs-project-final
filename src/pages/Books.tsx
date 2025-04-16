
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import MainNav from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import BooksList from "@/components/BooksList";
import BooksFilter from "@/components/BooksFilter";
import { fetchBooks } from "@/utils/supabaseQueries";

const Books = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [manualRefetchCount, setManualRefetchCount] = useState(0);

  const { data: books, isLoading, error, refetch } = useQuery({
    queryKey: ['books', manualRefetchCount],
    queryFn: fetchBooks,
    retry: 3,
    retryDelay: 1000,
    staleTime: 0, 
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  });

  useEffect(() => {
    setTimeout(() => {
      toast.success("Welcome to Book Catalog!", {
        description: "Explore our collection of amazing books.",
      });
    }, 1000);

    if (!books || books.length === 0) {
      const timer = setTimeout(() => {
        console.log("No books found on initial load, retrying...");
        setManualRefetchCount(prev => prev + 1);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [books]);

  const handleRetry = () => {
    toast.info("Retrying...");
    setManualRefetchCount(prev => prev + 1);
  };
  
  const genres = books ? [...new Set(books.map(book => book.genre).filter(Boolean))] : [];

  if (error) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <MainNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg max-w-lg">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Unable to Load Books</h2>
              <p className="text-red-500 mb-4">{error.message}</p>
              <Button 
                onClick={handleRetry}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <MainNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.section 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl font-bold mb-4 relative inline-block">
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              Book Catalog
              <motion.span
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute -right-8 -top-2"
              >
                <Sparkles className="h-6 w-6 text-purple-400" />
              </motion.span>
            </span>
            <motion.div 
              className="absolute bottom-2 left-0 w-full h-3 bg-gradient-to-r from-purple-400/30 to-indigo-400/30 transform rotate-1 z-0 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </h1>
        </motion.section>

        <BooksFilter 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterGenre={filterGenre}
          setFilterGenre={setFilterGenre}
          genres={genres}
        />

        <BooksList 
          books={books}
          isLoading={isLoading}
          handleRetry={handleRetry}
          searchTerm={searchTerm}
          filterGenre={filterGenre}
        />
      </main>
    </motion.div>
  );
};

export default Books;
