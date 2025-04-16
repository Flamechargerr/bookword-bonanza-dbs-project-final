import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BookOpen, Mail, User } from 'lucide-react';
import MainNav from "@/components/MainNav";
import AuthorDetailsDialog from "@/components/AuthorDetailsDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const fetchAuthors = async () => {
  const { data, error } = await supabase
    .from('author')
    .select(`
      id,
      name,
      contact_details,
      author_book (
        book (
          isbn,
          name
        )
      )
    `);

  if (error) {
    console.error("Error fetching authors:", error);
    throw error;
  }

  console.log("Authors data:", data);  // Detailed logging for debugging

  return data.map(author => ({
    id: author.id,
    name: author.name,
    contactDetails: author.contact_details,
    books: author.author_book.map(ab => ({
      isbn: ab.book.isbn,
      title: ab.book.name
    }))
  }));
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

const Authors = () => {
  const [selectedAuthor, setSelectedAuthor] = useState<null | any>(null);
  const { data: authors, isLoading, error } = useQuery({
    queryKey: ['authors'],
    queryFn: fetchAuthors,
    retry: 2
  });

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

        {authors && authors.length > 0 ? (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {authors.map((author) => (
              <motion.div 
                key={author.id}
                variants={item}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedAuthor(author)}
              >
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-12"></div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 rounded-full p-3 mr-4">
                      <User className="h-6 w-6 text-purple-700" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">{author.name}</h2>
                  </div>
                  
                  <div className="flex items-center mt-4 text-gray-600 hover:text-purple-700 transition-colors cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(author.contactDetails);
                      toast.success(`Email copied: ${author.contactDetails}`);
                    }}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="text-sm">{author.contactDetails}</span>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-purple-700" />
                      <span>Books ({author.books.length})</span>
                    </h3>
                    <ul className="space-y-1">
                      {author.books.slice(0, 3).map((book) => (
                        <li key={book.isbn} className="text-sm text-gray-600 pl-6 py-1 border-l-2 border-purple-100 hover:border-purple-500 transition-colors cursor-pointer">
                          {book.title}
                        </li>
                      ))}
                      {author.books.length > 3 && (
                        <li className="text-xs text-purple-600 pl-6 font-medium">
                          +{author.books.length - 3} more book(s)
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 bg-white/80 rounded-xl">
            <BookOpen className="h-20 w-20 mx-auto text-purple-300 mb-4" />
            <h3 className="text-2xl font-medium text-gray-600 mb-2">No authors found</h3>
            <p className="text-gray-500">It seems there are no authors in the database</p>
          </div>
        )}

        {selectedAuthor && (
          <AuthorDetailsDialog
            author={selectedAuthor}
            isOpen={!!selectedAuthor}
            onOpenChange={(open) => !open && setSelectedAuthor(null)}
          />
        )}
      </main>
    </div>
  );
};

export default Authors;
