
import React from 'react';
import { Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BookReviewFormProps {
  isbn: string;
  onSuccess?: () => void;
}

interface ReviewFormData {
  rating: number;
  comment: string;
}

export const BookReviewForm = ({ isbn, onSuccess }: BookReviewFormProps) => {
  const form = useForm<ReviewFormData>({
    defaultValues: {
      rating: 0,
      comment: ''
    }
  });
  const [hoveredStar, setHoveredStar] = React.useState(0);
  const [selectedRating, setSelectedRating] = React.useState(0);

  const onSubmit = async (data: ReviewFormData) => {
    try {
      const { error } = await supabase
        .from('books_read')
        .upsert({
          book_isbn: isbn,
          rating: data.rating,
          comment: data.comment,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast.success("Review submitted successfully!");
      form.reset();
      setSelectedRating(0);
      onSuccess?.();
    } catch (error) {
      toast.error("Please sign in to leave a review");
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
        >
          Submit Review
        </Button>
      </form>
    </Form>
  );
};
