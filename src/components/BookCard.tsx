import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, BookOpen, User, Info, MessageSquare, Heart } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating));

  const handleLike = () => {
    setLiked(!liked);
    // Add animation and notification
    toast.success(liked ? "Removed from favorites" : "Added to favorites!");
  };

  return (
    <>
      <motion.div 
        className="relative perspective-1000" 
        onClick={() => setIsFlipped(!isFlipped)}
        whileHover={{ scale: 1.02 }}
      >
        <motion.div 
          className="relative preserve-3d cursor-pointer duration-500"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
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
                <p className="text-white text-sm font-medium">Click for details</p>
              </motion.div>
              <motion.button
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm"
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
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
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">{genre}</Badge>
                <div className="flex items-center">
                  {stars.map((filled, index) => (
                    <Star 
                      key={index} 
                      className={`h-4 w-4 ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back of card */}
          <Card className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardHeader className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 mt-1 text-purple-600" />
                  <button 
                    className="text-sm hover:text-purple-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAuthorDetails(true);
                    }}
                  >
                    Author: {author}
                  </button>
                </div>
                
                <div className="flex items-start">
                  <BookOpen className="h-4 w-4 mt-1 mr-2 text-purple-600" />
                  <p className="text-sm"><span className="font-medium">ISBN:</span> {isbn}</p>
                </div>
                <div className="flex items-start">
                  <Info className="h-4 w-4 mt-1 mr-2 text-purple-600" />
                  <p className="text-sm line-clamp-4">{summary || "No summary available for this book."}</p>
                </div>
                
                <button 
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDetails(true);
                  }}
                >
                  View Full Details
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Book Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl bg-gradient-to-br from-purple-50 to-indigo-50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              {title}
            </DialogTitle>
            <DialogDescription>By {author}</DialogDescription>
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
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Summary</h3>
                <p className="text-gray-600">{summary}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Details</h3>
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
                      <div className="flex">
                        {stars.map((filled, index) => (
                          <Star 
                            key={index}
                            className={`h-4 w-4 ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="ml-2">{rating.toFixed(1)}</span>
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  Reader Reviews
                </h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4">
                  {reviews.length > 0 ? reviews.map((review, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarFallback>{review.user_id.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
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
                      </div>
                    </motion.div>
                  )) : (
                    <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Author Details Dialog */}
      {authorDetails && (
        <AuthorDetailsDialog
          author={authorDetails}
          isOpen={showAuthorDetails}
          onOpenChange={setShowAuthorDetails}
        />
      )}
    </>
  );
};

export default BookCard;
