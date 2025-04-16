import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, AlertCircle, RefreshCw, Sparkles, Database } from 'lucide-react';
import MainNav from "@/components/MainNav";
import BookCard from "@/components/BookCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const fetchBooks = async () => {
  console.log("Fetching books from Supabase...");
  
  const { data, error } = await supabase
    .from('book')
    .select(`
      isbn,
      name,
      summary,
      rating,
      genre,
      image_url,
      author_book (
        author_id,
        author (
          id,
          name,
          contact_details
        )
      ),
      books_read (
        rating,
        comment,
        user_id
      )
    `);

  if (error) {
    console.error("Error fetching books:", error);
    throw error;
  }

  console.log("Books data from Supabase:", data);
  console.log("Books count:", data?.length);
  
  if (!data || data.length === 0) {
    console.warn("No books found in database. Check if data exists in Supabase.");
  }
  
  return data?.map(book => ({
    isbn: book.isbn,
    title: book.name,
    author: book.author_book?.map(ab => ab.author?.name).filter(Boolean).join(', ') || "Unknown Author",
    rating: book.rating || 4.5,
    genre: book.genre || 'Uncategorized',
    imageUrl: book.image_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e',
    summary: book.summary || "No summary available.",
    authorDetails: book.author_book?.[0]?.author || null,
    reviews: book.books_read?.map(review => ({
      rating: review.rating || 0,
      user_id: review.user_id,
      comment: review.comment || "No comment available"
    })) || []
  })) || [];
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const pageVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.7
    }
  },
  exit: { opacity: 0 }
};

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
  
  const filteredBooks = books?.filter(book => {
    const matchesSearch = searchTerm === "" || 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = filterGenre === "" || 
      book.genre.toLowerCase() === filterGenre.toLowerCase();
    
    return matchesSearch && matchesGenre;
  });

  const genres = books ? [...new Set(books.map(book => book.genre))] : [];
  
  if (isLoading) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <MainNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="relative">
              <div className="h-16 w-16 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin"></div>
              <BookOpen className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-purple-600" />
            </div>
            <p className="mt-4 text-purple-600 font-medium">Loading your library...</p>
          </div>
        </div>
      </motion.div>
    );
  }

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

        {filteredBooks?.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm"
          >
            <Database className="h-20 w-20 mx-auto text-purple-300 mb-4" />
            <h3 className="text-2xl font-medium text-gray-600 mb-2">No books found</h3>
            <p className="text-gray-500 mb-6">
              There are currently no books in the database or there might be an issue with the connection
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks?.map((book, index) => (
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
        )}
      </main>
    </motion.div>
  );
};

export default Books;
