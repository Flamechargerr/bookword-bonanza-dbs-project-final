
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface BookCardProps {
  isbn: string;
  title: string;
  author: string;
  rating: number;
  genre: string;
  imageUrl: string;
}

const BookCard = ({ isbn, title, author, rating, genre, imageUrl }: BookCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-[2/3] relative">
        <img
          src={imageUrl || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e"}
          alt={title}
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-semibold line-clamp-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-gray-600 mb-2">{author}</p>
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{genre}</Badge>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 text-sm">{rating}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
