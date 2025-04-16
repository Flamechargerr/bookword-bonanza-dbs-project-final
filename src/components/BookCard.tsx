
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, BookOpen, User, Heart, MessageSquare } from 'lucide-react';
import { toast } from "sonner";
import BookDetails from './BookDetails';
import { supabase } from "@/integrations/supabase/client";

interface Review {
  rating: number;
  user_id: string;
  comment?: string;
}

interface BookCardProps {
  isbn: string;
  title: string;
  author: string;
  rating: number;
  genre: string;
  imageUrl: string;
  summary?: string;
  authorDetails?: {
    id: number;
    name: string;
    contact_details: string;
  };
  reviews?: Review[];
}

const BookCard = ({ isbn, title, author, rating, genre, imageUrl, summary, authorDetails, reviews = [] }: BookCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookReviews, setBookReviews] = useState<Review[]>(reviews);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    toast.success(liked ? "Removed from favorites" : "Added to favorites!");
  };

  // This function will be called when a review is submitted
  const handleReviewSubmit = async () => {
    try {
      // Fetch the latest reviews for this book
      const { data, error } = await supabase
        .from('books_read')
        .select('*')
        .eq('book_isbn', isbn);
      
      if (error) {
        console.error("Error fetching reviews:", error);
        return;
      }

      // Update local state with the new reviews
      setBookReviews(data || []);
      toast.success("Review submitted and visible now!");
    } catch (error) {
      console.error("Error in handleReviewSubmit:", error);
    }
  };

  return (
    <>
      <div className="h-[450px] relative perspective-1000">
        <motion.div
          className="w-full h-full"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => setIsFlipped(!isFlipped)}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front of card */}
          <Card 
            className="absolute w-full h-full cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex flex-col h-full">
              <div className="relative h-[250px] overflow-hidden rounded-t-lg">
                <img
                  src={imageUrl}
                  alt={title}
                  className="object-cover w-full h-full transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <motion.button
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white/90 transition-colors"
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                >
                  <Heart className={`h-5 w-5 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </motion.button>
              </div>

              <CardHeader className="p-4">
                <CardTitle className="text-lg font-semibold line-clamp-2">{title}</CardTitle>
              </CardHeader>

              <CardContent className="p-4 pt-0 flex-1">
                <p className="text-sm text-gray-600 mb-2">{author}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                    {genre}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                  </div>
                </div>
              </CardContent>
              
              <div className="mt-auto p-4 pt-0">
                <p className="text-xs text-center text-gray-500">Click to flip</p>
              </div>
            </div>
          </Card>

          {/* Back of card */}
          <Card 
            className="absolute w-full h-full cursor-pointer transition-transform duration-300 hover:scale-[1.02] bg-gradient-to-br from-purple-50 to-indigo-50"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)"
            }}
          >
            <div className="flex flex-col h-full p-6">
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-sm text-gray-600 mb-4">by {author}</p>
              
              <div className="flex-1 overflow-hidden">
                <p className="text-sm text-gray-600 line-clamp-4">
                  {summary || "No summary available."}
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDetails(true);
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  View Details
                </button>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {bookReviews.length} reviews
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {authorDetails?.name || author}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-purple-100">
                <p className="text-xs text-center text-gray-500">Click to flip back</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <BookDetails
        book={{ isbn, title, author, rating, genre, imageUrl, summary }}
        reviews={bookReviews}
        isOpen={showDetails}
        onOpenChange={setShowDetails}
        onReviewSubmit={handleReviewSubmit}
      />
    </>
  );
};

export default BookCard;
