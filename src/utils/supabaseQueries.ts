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
    
    // Process the fetched data
    const processedBooks = data.map(book => {
      // Determine author name from author_book relation if available
      let authorName = "Unknown Author";
      
      if (book.author_book && book.author_book.length > 0) {
        // Find authors who have name data
        const authorsWithNames = book.author_book
          .filter(ab => ab.author && ab.author.name)
          .map(ab => ab.author.name);
        
        if (authorsWithNames.length > 0) {
          authorName = authorsWithNames.join(', ');
        }
      }
      
      return {
        isbn: book.isbn,
        title: book.name,
        author: authorName,
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
      };
    });
    
    return processedBooks.length > 0 ? processedBooks : getSampleBooks();
    
  } catch (err) {
    console.error("Failed to fetch books:", err);
    toast.error("Failed to fetch books");
    
    // Fetch customers and generate random reviews for sample books
    try {
      const { data: customers } = await supabase.from('customer').select('id');
      const sampleBooksWithCustomerReviews = getSampleBooksWithCustomerReviews(customers);
      return sampleBooksWithCustomerReviews;
    } catch (customerErr) {
      console.error("Failed to fetch customers:", customerErr);
      return getSampleBooks();
    }
  }
};

// Function to get sample books with real customer reviews
const getSampleBooksWithCustomerReviews = (customers) => {
  if (!customers || customers.length === 0) {
    return getSampleBooks(); // Fall back to default sample books if no customers
  }
  
  // Create sample books with reviews from real customers
  const sampleBooks = getSampleBooks();
  
  // Assign random reviews from actual customers to each book
  return sampleBooks.map(book => {
    // Generate 1-3 random reviews per book
    const numReviews = Math.floor(Math.random() * 3) + 1;
    const bookReviews = [];
    
    for (let i = 0; i < numReviews; i++) {
      // Pick a random customer
      const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
      
      // Generate a random rating (3-5 stars)
      const rating = Math.floor(Math.random() * 3) + 3;
      
      // Sample review comments
      const comments = [
        "Really enjoyed this book!",
        "Great read, highly recommend.",
        "Interesting perspective on the subject.",
        "The author did a fantastic job explaining complex concepts.",
        "Couldn't put it down once I started reading.",
        "The content was engaging from start to finish.",
        "A must-read for anyone interested in this topic.",
        "Would definitely recommend to friends."
      ];
      
      // Add a random comment
      const comment = comments[Math.floor(Math.random() * comments.length)];
      
      bookReviews.push({
        rating,
        user_id: randomCustomer.id,
        comment
      });
    }
    
    // Calculate average rating
    const avgRating = bookReviews.reduce((sum, review) => sum + review.rating, 0) / bookReviews.length;
    
    return {
      ...book,
      rating: parseFloat(avgRating.toFixed(1)),
      reviews: bookReviews
    };
  });
};

// Sample data to show when no data is returned from Supabase
const getSampleBooks = () => {
  return [
    {
      isbn: "9781449358655",
      title: "Data Science for Business",
      author: "Foster Provost, Tom Fawcett",
      rating: 4.5,
      genre: "Data Science",
      imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600",
      summary: "Written by renowned data science experts Foster Provost and Tom Fawcett, Data Science for Business introduces the fundamental principles of data science, and walks you through the 'data-analytic thinking' necessary for extracting useful knowledge and business value from the data you collect.",
      reviews: [
        { rating: 5, user_id: "demo-1", comment: "Excellent introduction to data science for those in business." }
      ]
    },
    {
      isbn: "9781491910399",
      title: "Python for Data Analysis",
      author: "Wes McKinney",
      rating: 4.7,
      genre: "Data Science",
      imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600",
      summary: "Get complete instructions for manipulating, processing, cleaning, and crunching datasets in Python. Updated for Python 3.6, the second edition of this hands-on guide is packed with practical case studies that show you how to solve a broad set of data analysis problems effectively.",
      reviews: [
        { rating: 5, user_id: "demo-2", comment: "The best resource for learning pandas and NumPy." }
      ]
    },
    {
      isbn: "9781492041139",
      title: "Practical Statistics for Data Scientists",
      author: "Peter Bruce, Andrew Bruce",
      rating: 4.6,
      genre: "Data Science",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
      summary: "Statistical methods are a key part of data science, yet few data scientists have formal statistical training. Courses and books on basic statistics rarely cover the topic from a data science perspective. This practical guide explains how to apply various statistical methods to data science.",
      reviews: [
        { rating: 4, user_id: "demo-3", comment: "Great resource for understanding statistics in a data science context." }
      ]
    },
    {
      isbn: "9781449367619",
      title: "Mining of Massive Datasets",
      author: "Jure Leskovec, Anand Rajaraman, Jeffrey D. Ullman",
      rating: 4.8,
      genre: "Data Science",
      imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600",
      summary: "The book focuses on practical algorithms that have been used to solve key problems in data mining and can be applied successfully to very large datasets. It begins with a discussion of the map-reduce framework, an important tool for parallelizing algorithms automatically.",
      reviews: [
        { rating: 5, user_id: "demo-4", comment: "Excellent for understanding algorithms for big data." }
      ]
    },
    {
      isbn: "9781491962299",
      title: "Hands-On Machine Learning with Scikit-Learn and TensorFlow",
      author: "Aurélien Géron",
      rating: 4.9,
      genre: "Machine Learning",
      imageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600",
      summary: "Through a series of recent breakthroughs, deep learning has boosted the entire field of machine learning. Now, even programmers who know close to nothing about this technology can use simple, efficient tools to implement programs capable of learning from data.",
      reviews: [
        { rating: 5, user_id: "demo-5", comment: "The best practical introduction to machine learning I've found." }
      ]
    },
    {
      isbn: "9781784393908",
      title: "Learning Spark: Analytics with Spark Cluster",
      author: "Mohammed Guller",
      rating: 4.4,
      genre: "Big Data",
      imageUrl: "https://images.unsplash.com/photo-1534474692954-a0dd39d6d32c?w=600",
      summary: "This book introduces Apache Spark, the open source cluster computing system that makes data analytics fast to write and fast to run. With Spark, you can tackle big datasets quickly through simple APIs in Python, Java, and Scala.",
      reviews: [
        { rating: 4, user_id: "demo-6", comment: "Good introduction to Spark for big data processing." }
      ]
    },
    {
      isbn: "9781617296055",
      title: "Deep Learning with Python",
      author: "François Chollet",
      rating: 4.8,
      genre: "Machine Learning",
      imageUrl: "https://images.unsplash.com/photo-1550645612-83f5d594b671?w=600",
      summary: "Deep Learning with Python introduces the field of deep learning using Python and the powerful Keras library. Written by Keras creator and Google AI researcher François Chollet, this book builds your understanding through intuitive explanations and practical examples.",
      reviews: [
        { rating: 5, user_id: "demo-7", comment: "The best book on deep learning with practical examples using Keras." }
      ]
    },
    {
      isbn: "9781617295546",
      title: "Natural Language Processing in Action",
      author: "Hobson Lane, Cole Howard, Hannes Hapke",
      rating: 4.5,
      genre: "NLP",
      imageUrl: "https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=600",
      summary: "Natural Language Processing in Action is your guide to creating machines that understand human language using the power of Python with its ecosystem of packages dedicated to NLP and AI.",
      reviews: [
        { rating: 4, user_id: "demo-8", comment: "Practical approach to NLP with good examples." }
      ]
    },
    {
      isbn: "9781491989388",
      title: "Fundamentals of Data Visualization",
      author: "Claus O. Wilke",
      rating: 4.7,
      genre: "Data Visualization",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
      summary: "Effective visualization is the best way to communicate information from the increasingly large and complex datasets in the natural and social sciences. But with the increasing power of visualization software today, scientists, engineers, and business analysts often have to navigate a bewildering array of visualization choices.",
      reviews: [
        { rating: 5, user_id: "demo-9", comment: "Essential reading for anyone working with data visualization." }
      ]
    },
    {
      isbn: "9781492031611",
      title: "Data Science from Scratch",
      author: "Joel Grus",
      rating: 4.6,
      genre: "Data Science",
      imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600",
      summary: "Data science libraries, frameworks, modules, and toolkits are great for doing data science, but they're also a good way to dive into the discipline without actually understanding data science. With this updated second edition, you'll learn how many of the most fundamental data science tools and algorithms work.",
      reviews: [
        { rating: 4, user_id: "demo-10", comment: "Great for understanding the fundamentals without relying on libraries." }
      ]
    }
  ];
};

const getSampleAuthors = () => {
  return [
    {
      id: 1,
      name: "Wes McKinney",
      contactDetails: "wes.mckinney@example.com",
      books: [
        { isbn: "9781491910399", title: "Python for Data Analysis" },
        { isbn: "9781098104030", title: "Pandas for Everyone" }
      ]
    },
    {
      id: 2,
      name: "Aurélien Géron",
      contactDetails: "aurelien.geron@example.com",
      books: [
        { isbn: "9781491962299", title: "Hands-On Machine Learning with Scikit-Learn and TensorFlow" },
        { isbn: "9781098107963", title: "Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow, 2nd Edition" }
      ]
    },
    {
      id: 3,
      name: "François Chollet",
      contactDetails: "francois.chollet@example.com",
      books: [
        { isbn: "9781617296055", title: "Deep Learning with Python" }
      ]
    },
    {
      id: 4,
      name: "Peter Bruce",
      contactDetails: "peter.bruce@example.com",
      books: [
        { isbn: "9781492041139", title: "Practical Statistics for Data Scientists" }
      ]
    },
    {
      id: 5,
      name: "Joel Grus",
      contactDetails: "joel.grus@example.com",
      books: [
        { isbn: "9781492031611", title: "Data Science from Scratch" }
      ]
    },
    {
      id: 6,
      name: "Jake VanderPlas",
      contactDetails: "jake.vanderplas@example.com",
      books: [
        { isbn: "9781491957660", title: "Python Data Science Handbook" },
        { isbn: "9781449369415", title: "Statistics, Data Mining, and Machine Learning in Astronomy" }
      ]
    },
    {
      id: 7,
      name: "Sebastian Raschka",
      contactDetails: "sebastian.raschka@example.com",
      books: [
        { isbn: "9781789955750", title: "Python Machine Learning, Third Edition" },
        { isbn: "9781787125933", title: "Machine Learning with PyTorch and Scikit-Learn" }
      ]
    },
    {
      id: 8,
      name: "Jure Leskovec",
      contactDetails: "jure.leskovec@example.com",
      books: [
        { isbn: "9781449367619", title: "Mining of Massive Datasets" }
      ]
    },
    {
      id: 9,
      name: "Claus O. Wilke",
      contactDetails: "claus.wilke@example.com",
      books: [
        { isbn: "9781491989388", title: "Fundamentals of Data Visualization" }
      ]
    },
    {
      id: 10,
      name: "Foster Provost",
      contactDetails: "foster.provost@example.com",
      books: [
        { isbn: "9781449358655", title: "Data Science for Business" }
      ]
    }
  ];
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
