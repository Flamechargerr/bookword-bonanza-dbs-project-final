
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Mail, User, Database } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AuthorDetailsDialog from "@/components/AuthorDetailsDialog";

interface Author {
  id: number;
  name: string;
  contactDetails: string;
  books: Array<{
    isbn: string;
    title: string;
  }>;
}

interface AuthorsListProps {
  authors: Author[] | undefined;
  isLoading: boolean;
  handleRetry: () => void;
}

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

const AuthorsList: React.FC<AuthorsListProps> = ({ authors, isLoading, handleRetry }) => {
  const [selectedAuthor, setSelectedAuthor] = React.useState<null | any>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div className="loader h-10 w-10 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!authors || authors.length === 0) {
    return (
      <div className="text-center py-12 bg-white/80 rounded-xl">
        <Database className="h-20 w-20 mx-auto text-purple-300 mb-4" />
        <h3 className="text-2xl font-medium text-gray-600 mb-2">No authors found</h3>
        <p className="text-gray-500 mb-6">There are currently no authors in the database or there might be an issue with the connection</p>
        <Button 
          onClick={handleRetry} 
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <User className="h-4 w-4" />
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <>
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
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(author.contactDetails);
                  // Toast notification will be shown by the copied event
                }}
              >
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">{author.contactDetails}</span>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-purple-700" />
                  <span>Books ({author.books?.length || 0})</span>
                </h3>
                <ul className="space-y-1">
                  {author.books && author.books.slice(0, 3).map((book) => (
                    <li key={book.isbn} className="text-sm text-gray-600 pl-6 py-1 border-l-2 border-purple-100 hover:border-purple-500 transition-colors cursor-pointer">
                      {book.title}
                    </li>
                  ))}
                  {author.books && author.books.length > 3 && (
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

      {selectedAuthor && (
        <AuthorDetailsDialog
          author={selectedAuthor}
          isOpen={!!selectedAuthor}
          onOpenChange={(open) => !open && setSelectedAuthor(null)}
        />
      )}
    </>
  );
};

export default AuthorsList;
