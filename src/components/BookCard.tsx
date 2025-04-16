import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, BookOpen, User, Heart, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AuthorDetailsDialog from './AuthorDetailsDialog';
import { toast } from "sonner";

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
  const [showAuthorDetails, setShowAuthorDetails] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    toast.success(liked ? "Removed from favorites" : "Added to favorites!");
  };

  // Format author details to match expected format in AuthorDetailsDialog
  const formattedAuthorDetails = authorDetails ? {
    id: authorDetails.id,
    name: authorDetails.name,
    contactDetails: authorDetails.contact_details,
    books: [{ isbn, title }]
  } : null;

  return (
    <motion.div className="relative h-full perspective-1000">
      <motion.div
        className="relative h-full preserve-3d cursor-pointer duration-500"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of card */}
        <Card className="absolute w-full h-full backface-hidden">
          <div className="aspect-[2/3] relative overflow-hidden rounded-t-lg">
            <img
              src={imageUrl}
              alt={title}
              className="object-cover w-full h-full transition-transform duration-700 hover:scale-110"
            />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              <p className="text-white text-sm font-medium">Click to see details</p>
            </motion.div>
            <motion.button
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm"
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
            >
              <Heart className={`h-5 w-5 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </motion.button>
          </div>

          <CardHeader className="p-4">
            <CardTitle className="text-lg font-semibold line-clamp-2">{title}</CardTitle>
          </CardHeader>

          <CardContent className="p-4 pt-0">
            <p className="text-sm text-gray-600 mb-2">{author}</p>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                {genre}
              </Badge>
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star 
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back of card */}
        <Card className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-purple-50 to-indigo-50">
          <CardHeader className="p-4">
            <CardTitle className="text-lg font-semibold mb-2">{title}</CardTitle>
            <p className="text-sm text-gray-600">by {author}</p>
          </CardHeader>

          <CardContent className="p-4 space-y-4">
            <div className="flex flex-col gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(true);
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors"
              >
                View Full Details
              </button>
              
              {formattedAuthorDetails && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAuthorDetails(true);
                  }}
                  className="w-full bg-white text-purple-600 border border-purple-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors"
                >
                  About the Author
                </button>
              )}
            </div>

            <div className="text-sm text-gray-600">
              <p className="line-clamp-4">{summary || "No summary available."}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl bg-gradient-to-br from-purple-50 to-indigo-50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              {title}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            <div className="aspect-[2/3] relative overflow-hidden rounded-lg shadow-lg">
              <img
                src={imageUrl}
                alt={title}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-600" />
                  Author
                </h3>
                <p className="text-gray-600">{author}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Summary</h3>
                <p className="text-gray-600">{summary || "No summary available."}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Details</h3>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-gray-500">Genre</dt>
                    <dd className="text-gray-900">{genre}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">ISBN</dt>
                    <dd className="text-gray-900">{isbn}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Rating</dt>
                    <dd className="text-gray-900 flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {rating.toFixed(1)}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  Reviews
                </h3>
                <div className="space-y-4 max-h-[200px] overflow-y-auto pr-4">
                  {reviews.length > 0 ? reviews.map((review, index) => (
                    <div 
                      key={index}
                      className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star 
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{review.comment || "No comment provided."}</p>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-center py-4">No reviews yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Author Details Dialog */}
      {formattedAuthorDetails && (
        <AuthorDetailsDialog
          author={formattedAuthorDetails}
          isOpen={showAuthorDetails}
          onOpenChange={setShowAuthorDetails}
        />
      )}
    </motion.div>
  );
};

export default BookCard;
