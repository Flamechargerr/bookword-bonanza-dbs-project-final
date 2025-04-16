
import { Home, BookOpen, Users } from "lucide-react";
import { Link } from "react-router-dom";
import AuthButton from "./AuthButton";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const MainNav = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

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
          <div className="flex items-center">
            {isAuthenticated ? (
              <AuthButton />
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNav;
