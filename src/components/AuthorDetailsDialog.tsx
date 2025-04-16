
import { Mail, Book } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{author.name}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-6 space-y-6">
          <div className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-purple-700 transition-colors"
               onClick={handleContact}>
            <Mail className="h-5 w-5" />
            <span>{author.contactDetails}</span>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Book className="h-5 w-5 text-purple-600" />
              Published Books
            </h3>
            <ul className="space-y-3">
              {author.books.map((book) => (
                <li key={book.isbn} 
                    className="py-2 px-4 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors">
                  <h4 className="font-medium text-gray-900">{book.title}</h4>
                  <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthorDetailsDialog;
