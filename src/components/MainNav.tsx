
import { Home, BookOpen, Users } from "lucide-react";
import { Link } from "react-router-dom";

const MainNav = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center px-2 py-2 text-purple-700 font-bold text-xl">
              BookWorm Bonanza
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-gray-700 hover:text-purple-700"
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
              <Link
                to="/books"
                className="inline-flex items-center px-1 pt-1 text-gray-700 hover:text-purple-700"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Books
              </Link>
              <Link
                to="/authors"
                className="inline-flex items-center px-1 pt-1 text-gray-700 hover:text-purple-700"
              >
                <Users className="mr-2 h-4 w-4" />
                Authors
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNav;
