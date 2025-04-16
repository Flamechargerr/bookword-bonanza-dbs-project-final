
import { Mail, Book, ExternalLink, Award } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface AuthorDetailsProps {
  author: {
    id: number;
    name: string;
    contactDetails: string;
    books: Array<{
      isbn: string;
      title: string;
    }>;
  };
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthorDetailsDialog = ({ author, isOpen, onOpenChange }: AuthorDetailsProps) => {
  const handleContact = () => {
    navigator.clipboard.writeText(author.contactDetails);
    toast.success(`Email copied: ${author.contactDetails}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border-none shadow-2xl">
        <DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DialogTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              {author.name}
            </DialogTitle>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full mt-2"></div>
          </motion.div>
        </DialogHeader>
        
        <div className="mt-6 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-purple-700 transition-colors p-3 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md"
            onClick={handleContact}
          >
            <div className="bg-purple-100 p-2 rounded-full">
              <Mail className="h-5 w-5 text-purple-600" />
            </div>
            <span>{author.contactDetails}</span>
            <ExternalLink className="ml-auto h-4 w-4 text-purple-400" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="bg-purple-100 p-2 rounded-full">
                <Book className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-700">
                Published Books
              </span>
              <div className="bg-purple-100 px-2 py-0.5 rounded-full text-xs text-purple-700 ml-2">
                {author.books.length}
              </div>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {author.books.map((book, index) => (
                <motion.div
                  key={book.isbn}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className="relative overflow-hidden group"
                >
                  <div className="py-3 px-4 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300 border border-purple-100 group-hover:border-purple-300">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-200/40 to-transparent rounded-bl-full"></div>
                    <h4 className="font-medium text-gray-900 group-hover:text-purple-700 transition-colors">
                      {book.title}
                    </h4>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Award className="h-3 w-3 text-purple-400" />
                      ISBN: {book.isbn}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthorDetailsDialog;
