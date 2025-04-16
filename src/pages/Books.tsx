
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import MainNav from "@/components/MainNav";
import BookCard from "@/components/BookCard";
import { supabase } from "@/integrations/supabase/client";

const fetchBooks = async () => {
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
    throw error;
  }

  // Transform the data to match BookCard props
  return data.map(book => ({
    isbn: book.isbn,
    title: book.name,
    author: book.author_book.map(ab => ab.author.name).join(', '),
    rating: book.rating || 0,
    genre: book.genre || 'Unknown',
    imageUrl: book.image_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e'
  }));
};

const Books = () => {
  const { data: books, isLoading, error } = useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks
  });

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <MainNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p>Loading books...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <MainNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p>Error loading books: {error.message}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <MainNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-purple-900 mb-4">
            Book Catalog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of books across various genres and topics.
          </p>
        </section>

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <BookCard key={book.isbn} {...book} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Books;
