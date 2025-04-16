
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import MainNav from "@/components/MainNav";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import AuthorsList from "@/components/AuthorsList";
import { fetchAuthors } from "@/utils/supabaseQueries";

const Authors = () => {
  const [manualRefetchCount, setManualRefetchCount] = useState(0);
  
  const { data: authors, isLoading, error, refetch } = useQuery({
    queryKey: ['authors', manualRefetchCount],
    queryFn: fetchAuthors,
    retry: 3,
    retryDelay: 1000,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  });

  useEffect(() => {
    if (!authors || authors.length === 0) {
      console.log("No authors found, retrying in 3 seconds...");
      const timer = setTimeout(() => {
        console.log("Retrying author fetch...");
        setManualRefetchCount(prev => prev + 1);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [authors]);

  const handleRetry = () => {
    toast.info("Retrying connection to fetch authors...");
    setManualRefetchCount(prev => prev + 1);
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <MainNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="loader h-10 w-10 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
        </motion.div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <MainNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-red-500"
        >
          Error loading authors: {error.message}
        </motion.p>
        <Button 
          onClick={() => refetch()} 
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white">
      <MainNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.section 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-purple-900 mb-4 relative inline-block">
            <span className="relative z-10">Meet Our Authors</span>
            <span className="absolute bottom-0 left-0 w-full h-3 bg-purple-200 opacity-50 transform -rotate-1 z-0"></span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The brilliant minds behind our collection of books.
          </p>
        </motion.section>

        <AuthorsList 
          authors={authors}
          isLoading={isLoading}
          handleRetry={handleRetry}
        />
      </main>
    </div>
  );
};

export default Authors;
