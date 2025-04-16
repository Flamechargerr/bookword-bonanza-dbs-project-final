
import { useState } from 'react';
import { Star, UserRound } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BookDetailsProps {
  book: {
    isbn: string;
    title: string;
    author: string;
    rating?: number;
    genre?: string;
    imageUrl: string;
    summary?: string;
  };
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const BookDetailsDialog = ({ book, isOpen, onOpenChange }: BookDetailsProps) => {
  const [userRating, setUserRating] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const { toast } = useToast();

  const handleRating = async (rating: number) => {
    try {
      const { error } = await supabase
        .from('books_read')
        .upsert({
          book_isbn: book.isbn,
          rating: rating,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
      
      setUserRating(rating);
      toast({
        title: "Rating Submitted!",
        description: `You rated ${book.title} ${rating} stars.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Please sign in to rate books.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{book.title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <div className="aspect-[2/3] relative overflow-hidden rounded-lg">
            <img
              src={book.imageUrl}
              alt={book.title}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <UserRound className="h-5 w-5 text-purple-600" />
                Author
              </h3>
              <p className="text-gray-600">{book.author}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Summary</h3>
              <p className="text-gray-600">{book.summary || "No summary available."}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Details</h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Genre</dt>
                  <dd className="text-gray-900">{book.genre}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">ISBN</dt>
                  <dd className="text-gray-900">{book.isbn}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Overall Rating</dt>
                  <dd className="text-gray-900 flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {book.rating || "N/A"}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Rate this Book</h3>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-8 w-8 cursor-pointer transition-all ${
                      star <= (hoveredStar || userRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => handleRating(star)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookDetailsDialog;
