
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, BookOpen, User, Info } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BookCardProps {
  isbn: string;
  title: string;
  author: string;
  rating: number;
  genre: string;
  imageUrl: string;
  summary?: string;
}

const BookCard = ({ isbn, title, author, rating, genre, imageUrl, summary }: BookCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Generate stars array based on rating
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating));

  return (
    <div className="relative h-full perspective">
      <motion.div 
        className="h-full preserve-3d cursor-pointer"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of card */}
        <Card className="absolute w-full h-full backface-hidden overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="aspect-[2/3] relative overflow-hidden">
            <img
              src={imageUrl || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e"}
              alt={title}
              className="object-cover w-full h-full transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <p className="text-white text-sm font-medium">Click for details</p>
            </div>
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
        <Card className="absolute w-full h-full backface-hidden rotate-y-180 bg-purple-50 overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="p-4 bg-purple-600 text-white">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start">
                <User className="h-4 w-4 mt-1 mr-2 text-purple-600" />
                <p className="text-sm"><span className="font-medium">Author:</span> {author}</p>
              </div>
              <div className="flex items-start">
                <BookOpen className="h-4 w-4 mt-1 mr-2 text-purple-600" />
                <p className="text-sm"><span className="font-medium">ISBN:</span> {isbn}</p>
              </div>
              <div className="flex items-start">
                <Info className="h-4 w-4 mt-1 mr-2 text-purple-600" />
                <p className="text-sm line-clamp-4">{summary || "No summary available for this book."}</p>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <button 
                  className="mt-4 w-full bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Full Details
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{title}</DialogTitle>
                  <DialogDescription>By {author}</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="aspect-[2/3] relative">
                    <img
                      src={imageUrl || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e"}
                      alt={title}
                      className="object-cover w-full h-full rounded-md"
                    />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Genre</h4>
                      <p className="text-sm text-gray-600">{genre}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Rating</h4>
                      <div className="flex items-center">
                        {stars.map((filled, index) => (
                          <Star 
                            key={index} 
                            className={`h-4 w-4 ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">ISBN</h4>
                      <p className="text-sm text-gray-600">{isbn}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Summary</h4>
                      <p className="text-sm text-gray-600">{summary || "No summary available."}</p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default BookCard;
