
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const fetchBooks = async () => {
  console.log("Fetching books from Supabase...");
  
  try {
    // First, check if the book table exists and has data
    const { count, error: countError } = await supabase
      .from('book')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error("Error checking book table:", countError);
      throw countError;
    }
    
    console.log(`Book table check: Found ${count} records`);
    
    // Now fetch the full data with relations
    const { data, error } = await supabase
      .from('book')
      .select(`
        isbn,
        name,
        summary,
        rating,
        genre,
        image_url,
        author_book (
          author_id,
          author (
            id,
            name,
            contact_details
          )
        ),
        books_read (
          rating,
          comment,
          user_id
        )
      `);

    if (error) {
      console.error("Error fetching books:", error);
      throw error;
    }

    console.log("Books data from Supabase:", data);
    
    if (!data || data.length === 0) {
      console.warn("No books found in database. Check if data exists in Supabase.");
      // Display sample data for demonstration if no real data exists
      return getSampleBooks();
    }
    
    return data?.map(book => ({
      isbn: book.isbn,
      title: book.name,
      author: book.author_book?.map(ab => ab.author?.name).filter(Boolean).join(', ') || "Unknown Author",
      rating: book.rating || 4.5,
      genre: book.genre || 'Uncategorized',
      imageUrl: book.image_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e',
      summary: book.summary || "No summary available.",
      authorDetails: book.author_book?.[0]?.author || null,
      reviews: book.books_read?.map(review => ({
        rating: review.rating || 0,
        user_id: review.user_id,
        comment: review.comment || "No comment available"
      })) || []
    })) || getSampleBooks();
  } catch (err) {
    console.error("Failed to fetch books:", err);
    toast.error("Failed to fetch books");
    return getSampleBooks();
  }
};

export const fetchAuthors = async () => {
  console.log("Fetching authors...");
  
  try {
    // First, check if the author table exists and has data
    const { count, error: countError } = await supabase
      .from('author')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error("Error checking author table:", countError);
      throw countError;
    }
    
    console.log(`Author table check: Found ${count} records`);
    
    // Fetch all authors directly, without filters or limitations
    const { data, error } = await supabase
      .from('author')
      .select(`
        id,
        name,
        contact_details,
        author_book (
          book_isbn,
          book (
            isbn,
            name,
            summary,
            genre
          )
        )
      `);

    if (error) {
      console.error("Error fetching authors:", error);
      throw error;
    }

    console.log("Authors data from Supabase:", data);
    
    if (!data || data.length === 0) {
      console.warn("No authors found in database. Check if data exists in Supabase.");
      // Display sample data for demonstration if no real data exists
      return getSampleAuthors();
    }
    
    return data?.map(author => ({
      id: author.id,
      name: author.name,
      contactDetails: author.contact_details || 'No contact details',
      books: author.author_book?.map(ab => ({
        isbn: ab.book?.isbn || 'Unknown ISBN',
        title: ab.book?.name || 'Unknown Title'
      })) || []
    })) || getSampleAuthors();
  } catch (err) {
    console.error("Failed to fetch authors:", err);
    toast.error("Failed to fetch authors");
    return getSampleAuthors();
  }
};

// Sample data to show when no data is returned from Supabase
const getSampleBooks = () => {
  return [
    {
      isbn: "9780141439518",
      title: "Pride and Prejudice",
      author: "Jane Austen",
      rating: 4.7,
      genre: "Classic",
      imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000",
      summary: "Pride and Prejudice follows the turbulent relationship between Elizabeth Bennet, the daughter of a country gentleman, and Fitzwilliam Darcy, a rich aristocratic landowner.",
      reviews: [
        { rating: 5, user_id: "demo-1", comment: "A timeless classic that never fails to charm." }
      ]
    },
    {
      isbn: "9780061120084",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      rating: 4.8,
      genre: "Fiction",
      imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000",
      summary: "To Kill a Mockingbird is a novel by Harper Lee published in 1960. It was immediately successful, winning the Pulitzer Prize, and has become a classic of modern American literature.",
      reviews: [
        { rating: 5, user_id: "demo-2", comment: "Profound and moving exploration of racial injustice." }
      ]
    }
  ];
};

const getSampleAuthors = () => {
  return [
    {
      id: 1,
      name: "Jane Austen",
      contactDetails: "jane.austen@example.com",
      books: [
        { isbn: "9780141439518", title: "Pride and Prejudice" },
        { isbn: "9780141439662", title: "Emma" }
      ]
    },
    {
      id: 2,
      name: "Harper Lee",
      contactDetails: "harper.lee@example.com",
      books: [
        { isbn: "9780061120084", title: "To Kill a Mockingbird" }
      ]
    },
    {
      id: 3,
      name: "George Orwell",
      contactDetails: "george.orwell@example.com",
      books: [
        { isbn: "9780451524935", title: "1984" },
        { isbn: "9780452284241", title: "Animal Farm" }
      ]
    }
  ];
};
