
import React from 'react';
import { Star, User, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookReviewForm } from './BookReviewForm';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Review {
  rating: number;
  user_id: string;
  comment?: string;
}

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
  reviews?: Review[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onReviewSubmit?: () => void;
}

const BookDetails = ({ book, reviews = [], isOpen, onOpenChange, onReviewSubmit }: BookDetailsProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-gradient-to-br from-purple-50 to-indigo-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            {book.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <div className="space-y-6">
            <div className="aspect-[2/3] relative overflow-hidden rounded-lg shadow-lg group">
              <img
                src={book.imageUrl}
                alt={book.title}
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-purple-600" />
                Summary
              </h3>
              <p className="text-gray-600 leading-relaxed">{book.summary || "No summary available."}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-purple-600" />
                Details
              </h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Author</dt>
                  <dd className="text-gray-900">{book.author}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Genre</dt>
                  <dd>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {book.genre}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Rating</dt>
                  <dd className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{book.rating?.toFixed(1) || "N/A"}</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">ISBN</dt>
                  <dd className="text-gray-900">{book.isbn}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
              <BookReviewForm isbn={book.isbn} onSuccess={onReviewSubmit} />
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Reviews</h3>
              <ScrollArea className="h-[200px] rounded-md">
                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-white shadow-sm border border-purple-100"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= (review.rating || 0)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          {review.comment || "No comment provided."}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">No reviews yet</p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookDetails;
