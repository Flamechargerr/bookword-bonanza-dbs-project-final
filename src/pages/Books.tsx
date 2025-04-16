
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import BooksList from "@/components/BooksList";
import MainNav from "@/components/MainNav";
import { fetchBooks } from "@/utils/supabaseQueries";
import { Input } from "@/components/ui/input";
import { Search, BookOpen } from "lucide-react";

const Books = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("");

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setIsLoading(true);
    try {
      const booksData = await fetchBooks();
      setBooks(booksData);
    } catch (error) {
      console.error("Failed to load books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    loadBooks();
  };

  return (
    <div>
      <MainNav />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Book Collection</h1>
            <div className="text-gray-700">
              Welcome, book lovers! 📚 Explore our collection.
            </div>
          </div>
          <div className="relative w-full md:w-64 mt-4 md:mt-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <Input
              type="text"
              placeholder="Search books or authors..."
              className="pl-10 pr-4 py-2 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <BooksList 
          books={books} 
          isLoading={isLoading} 
          handleRetry={handleRetry} 
          searchTerm={searchTerm}
          filterGenre={filterGenre}
        />
      </div>
    </div>
  );
};

export default Books;
