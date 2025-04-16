
import React from 'react';
import { Button } from "@/components/ui/button";
import BooksList from "@/components/BooksList";
import MainNav from "@/components/MainNav";

const Books = () => {
  return (
    <div>
      <MainNav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Book Collection</h1>
        <div className="mb-4 text-gray-700">
          Welcome, book lovers! 📚 Explore our collection.
        </div>
        <BooksList />
      </div>
    </div>
  );
};

export default Books;
