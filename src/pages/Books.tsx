
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import MainNav from "@/components/MainNav";
import BookCard from "@/components/BookCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const fetchBooks = async () => {
  // Log the fetch attempt to help debug
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
        author (
          name
        )
      )
    `);

  if (error) {
    console.error("Error fetching books:", error);
    throw error;
  }

  console.log("Books fetched:", data);
  
  // If no books found, add some sample data for demo purposes
  if (!data || data.length === 0) {
    console.log("No books found, using sample data");
    return [
      {
        isbn: "978-0451524935",
        title: "1984",
        author: "George Orwell",
        rating: 4.7,
        genre: "Dystopian Fiction",
        imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e",
        summary: "A dystopian novel set in a totalitarian society led by Big Brother, where truth and history are manipulated by the ruling party."
      },
      {
        isbn: "978-0061120084",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        rating: 4.8,
        genre: "Classic",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
        summary: "Set in the American South during the 1930s, the story follows Scout Finch and her father, Atticus, who defends a Black man accused of a terrible crime."
      },
      {
        isbn: "978-0307474278",
        title: "The Da Vinci Code",
        author: "Dan Brown",
        rating: 4.5,
        genre: "Thriller",
        imageUrl: "https://images.unsplash.com/photo-1546521343-4eb2c01aa44b",
        summary: "A thriller novel that follows symbologist Robert Langdon as he investigates a murder in the Louvre Museum and discovers a battle between the Priory of Sion and Opus Dei."
      },
      {
        isbn: "978-0743273565",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        rating: 4.3,
        genre: "Classic",
        imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19",
        summary: "Set in the Jazz Age, the novel explores themes of decadence, idealism, and the American Dream through the life of millionaire Jay Gatsby."
      },
      {
        isbn: "978-0618640157",
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        rating: 4.9,
        genre: "Fantasy",
        imageUrl: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6",
        summary: "An epic high-fantasy novel that follows hobbit Frodo Baggins as he embarks on a quest to destroy the One Ring and defeat the Dark Lord Sauron."
      }
    ];
  }

  // Transform the data to match BookCard props
  return data.map(book => ({
    isbn: book.isbn,
    title: book.name,
    author: book.author_book?.map(ab => ab.author?.name).filter(Boolean).join(', ') || "Unknown Author",
    rating: book.rating || 0,
    genre: book.genre || 'Unknown',
    imageUrl: book.image_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e',
    summary: book.summary || "No summary available."
  }));
};

// Animation variants
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
  
  const { data: books, isLoading, error, refetch } = useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks
  });

  useEffect(() => {
    // Welcome notification to enhance UX
    setTimeout(() => {
      toast.success("Welcome to Book Catalog!", {
        description: "Explore our collection of amazing books.",
      });
    }, 1000);
  }, []);

  // Handle retry when there's an error
  const handleRetry = () => {
    toast.info("Retrying...");
    refetch();
  };
  
  // Filter books based on search term and genre
  const filteredBooks = books?.filter(book => {
    const matchesSearch = searchTerm === "" || 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = filterGenre === "" || 
      book.genre.toLowerCase() === filterGenre.toLowerCase();
    
    return matchesSearch && matchesGenre;
  });

  // Get unique genres for filter
  const genres = books ? [...new Set(books.map(book => book.genre))] : [];

  if (isLoading) return (
    <motion.div 
      className="min-h-screen bg-gradient-to-tr from-purple-100 via-indigo-50 to-blue-50"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <MainNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="relative">
            <div className="h-16 w-16 border-4 border-t-purple-600 border-purple-300 rounded-full animate-spin"></div>
            <BookOpen className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-purple-600" />
          </div>
          <p className="mt-4 text-purple-700 font-medium">Loading amazing books for you...</p>
        </div>
      </div>
    </motion.div>
  );

  if (error) return (
    <motion.div 
      className="min-h-screen bg-gradient-to-tr from-purple-100 via-indigo-50 to-blue-50"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <MainNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-lg max-w-lg">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Error Loading Books</h2>
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

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-tr from-purple-100 via-indigo-50 to-blue-50"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <MainNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.section 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-4 relative inline-block">
            <span className="relative z-10">Book Catalog</span>
            <motion.span 
              className="absolute bottom-2 left-0 w-full h-3 bg-gradient-to-r from-purple-400/50 to-indigo-400/50 transform rotate-1 z-0 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            ></motion.span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of books across various genres and topics.
          </p>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-sm"
        >
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-500" />
            <Input
              type="text"
              placeholder="Search by title or author..."
              className="pl-10 w-full border-purple-200 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="bg-purple-100 p-1.5 rounded-full">
              <Filter className="h-4 w-4 text-purple-600" />
            </div>
            <select
              className="px-3 py-2 border border-purple-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80"
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            {(searchTerm || filterGenre) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSearchTerm("");
                  setFilterGenre("");
                }}
                className="text-purple-600 hover:text-purple-800 hover:bg-purple-50"
              >
                Clear
              </Button>
            )}
          </div>
        </motion.div>

        {filteredBooks?.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm"
          >
            <BookOpen className="h-20 w-20 mx-auto text-purple-300 mb-4" />
            <h3 className="text-2xl font-medium text-gray-600 mb-2">No books match your search</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setFilterGenre("");
              }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Show All Books
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredBooks?.map((book) => (
              <motion.div 
                key={book.isbn}
                variants={item}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
              >
                <BookCard {...book} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-gray-500">
            Showing {filteredBooks?.length} of {books?.length} books
          </p>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default Books;
