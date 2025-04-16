
import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BookReviewFormProps {
  isbn: string;
  title?: string;
  author?: string;
  onSuccess?: () => void;
}

interface ReviewFormData {
  rating: number;
  comment: string;
}

export const BookReviewForm = ({ isbn, title, author, onSuccess }: BookReviewFormProps) => {
  const form = useForm<ReviewFormData>({
    defaultValues: {
      rating: 0,
      comment: ''
    }
  });
  const [hoveredStar, setHoveredStar] = React.useState(0);
  const [selectedRating, setSelectedRating] = React.useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check authentication status when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      setUserId(user?.id || null);
    };
    
    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
      setUserId(session?.user?.id || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const onSubmit = async (data: ReviewFormData) => {
    try {
      // Double-check authentication before submitting
      if (!isLoggedIn || !userId) {
        toast.error("Please sign in to leave a review");
        return;
      }

      setIsSubmitting(true);

      // First check if a book with this ISBN exists
      const { data: bookExists, error: bookCheckError } = await supabase
        .from('book')
        .select('isbn')
        .eq('isbn', isbn)
        .single();

      if (bookCheckError) {
        console.error("Book not found, attempting to create:", bookCheckError);
        
        // For sample books that don't exist in the database, create the book record first
        const { error: insertBookError } = await supabase
          .from('book')
          .insert({
            isbn: isbn,
            name: title || "Sample Book",
            // Add other provided fields if available
            genre: "Uncategorized",
            summary: "No summary available",
            image_url: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e"
          });
            
        if (insertBookError) {
          console.error("Error creating book:", insertBookError);
          toast.error("Unable to create book record. Please try again later.");
          setIsSubmitting(false);
          return;
        }
        
        toast.success("Book added to database");
      }

      // Now submit the review
      const { error } = await supabase
        .from('books_read')
        .upsert({
          book_isbn: isbn,
          rating: data.rating,
          comment: data.comment,
          user_id: userId
        });

      if (error) {
        console.error("Review submission error:", error);
        toast.error("Failed to submit review. Please try again.");
        setIsSubmitting(false);
        return;
      }

      toast.success("Review submitted successfully!");
      form.reset();
      setSelectedRating(0);
      setIsSubmitting(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Review submission error:", error);
      toast.error(error.message || "Failed to submit review. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-8 w-8 cursor-pointer transition-all ${
                      star <= (hoveredStar || selectedRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => {
                      setSelectedRating(star);
                      field.onChange(star);
                    }}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your thoughts about this book..."
                  className="min-h-[100px] resize-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          disabled={isSubmitting || !isLoggedIn}
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
        
        {!isLoggedIn && (
          <p className="text-sm text-red-500 text-center mt-2">
            Please sign in to leave a review
          </p>
        )}
      </form>
    </Form>
  );
};
