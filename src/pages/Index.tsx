
import MainNav from "@/components/MainNav";
import BookCard from "@/components/BookCard";

const SAMPLE_BOOKS = [
  {
    isbn: "978-0451524935",
    title: "1984",
    author: "George Orwell",
    rating: 4.7,
    genre: "Fiction",
    imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e"
  },
  {
    isbn: "978-0061120084",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    rating: 4.8,
    genre: "Classic",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f"
  },
  {
    isbn: "978-0307474278",
    title: "The Da Vinci Code",
    author: "Dan Brown",
    rating: 4.5,
    genre: "Thriller",
    imageUrl: "https://images.unsplash.com/photo-1546521343-4eb2c01aa44b"
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <MainNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-purple-900 mb-4">
            Welcome to BookWorm Bonanza
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your personal library companion. Track your reading journey, discover new books,
            and connect with fellow bookworms.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Featured Books</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_BOOKS.map((book) => (
              <BookCard key={book.isbn} {...book} />
            ))}
          </div>
        </section>

        <section className="bg-purple-100 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-purple-900 mb-4">
            Start Your Reading Journey
          </h2>
          <p className="text-gray-700 mb-6">
            Join our community of book lovers and keep track of your reading adventures.
          </p>
          <button className="bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-800 transition-colors">
            Get Started
          </button>
        </section>
      </main>
    </div>
  );
};

export default Index;
