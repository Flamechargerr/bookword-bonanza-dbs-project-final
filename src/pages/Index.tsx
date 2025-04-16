
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { Book, Users, BookOpen, TrendingUp } from 'lucide-react';
import { toast } from "sonner";
import MainNav from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useInView } from 'react-intersection-observer';

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

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const FadeInWhenVisible = ({ children }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={fadeInUp}
    >
      {children}
    </motion.div>
  );
};

const Index = () => {
  const bookCounterRef = useRef(null);
  
  useEffect(() => {
    // Welcome notification
    setTimeout(() => {
      toast.success("Welcome to BookWorm Bonanza!", {
        description: "Explore our collection of amazing books and authors.",
      });
    }, 1000);
    
    // Animate book counter
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(bookCounterRef.current, 0, 150, 2000);
          observer.unobserve(entry.target);
        }
      });
    });
    
    if (bookCounterRef.current) {
      observer.observe(bookCounterRef.current);
    }
    
    return () => {
      if (bookCounterRef.current) {
        observer.unobserve(bookCounterRef.current);
      }
    };
  }, []);
  
  const animateCounter = (element, start, end, duration) => {
    let startTime = null;
    
    const animation = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      element.textContent = value;
      
      if (progress < 1) {
        window.requestAnimationFrame(animation);
      }
    };
    
    window.requestAnimationFrame(animation);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white overflow-x-hidden">
      <MainNav />
      
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="absolute inset-0 bg-purple-500 opacity-5 -skew-y-3 transform origin-top-left"
          style={{ height: '70%', zIndex: 0 }}
        ></div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-purple-900 mb-6 relative inline-block">
              <span className="relative z-10">BookWorm Bonanza</span>
              <motion.span 
                className="absolute bottom-0 left-0 w-full h-4 bg-purple-200 opacity-50 z-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              ></motion.span>
            </h1>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Your personal library companion. Track your reading journey, discover new books,
              and connect with fellow bookworms.
            </motion.p>
            
            <motion.div 
              className="mt-8 flex justify-center space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <Link to="/books">
                <Button className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-6">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Explore Books
                </Button>
              </Link>
              <Link to="/authors">
                <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50 px-6 py-6">
                  <Users className="mr-2 h-4 w-4" />
                  Meet Authors
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Stats Section */}
      <motion.section 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 bg-purple-900 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div variants={fadeInUp} className="flex flex-col items-center">
              <div className="bg-white/10 rounded-full p-4 mb-4">
                <Book className="h-8 w-8" />
              </div>
              <h3 ref={bookCounterRef} className="text-4xl font-bold mb-2">0</h3>
              <p className="text-purple-200">Books in Library</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="flex flex-col items-center">
              <div className="bg-white/10 rounded-full p-4 mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-4xl font-bold mb-2">20+</h3>
              <p className="text-purple-200">Featured Authors</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="flex flex-col items-center">
              <div className="bg-white/10 rounded-full p-4 mb-4">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-4xl font-bold mb-2">10+</h3>
              <p className="text-purple-200">Genres</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="flex flex-col items-center">
              <div className="bg-white/10 rounded-full p-4 mb-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-4xl font-bold mb-2">4.5</h3>
              <p className="text-purple-200">Avg. Rating</p>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Featured Books Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 relative inline-block">
              <span className="relative z-10">Featured Books</span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-purple-200 opacity-50 z-0"></span>
            </h2>
          </FadeInWhenVisible>
          
          <Carousel className="max-w-5xl mx-auto">
            <CarouselContent>
              {SAMPLE_BOOKS.map((book) => (
                <CarouselItem key={book.isbn} className="md:basis-1/2 lg:basis-1/3">
                  <FadeInWhenVisible>
                    <div className="p-1">
                      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
                        <div className="aspect-[2/3] relative overflow-hidden">
                          <img
                            src={book.imageUrl}
                            alt={book.title}
                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                            <h3 className="text-white font-semibold mb-1">{book.title}</h3>
                            <p className="text-white/80 text-sm">{book.author}</p>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-800 mb-1">{book.title}</h3>
                          <p className="text-sm text-gray-600">{book.author}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-purple-700">{book.genre}</span>
                            <span className="flex items-center text-yellow-500">
                              ★ {book.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </FadeInWhenVisible>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-6" />
            <CarouselNext className="hidden md:flex -right-6" />
          </Carousel>
        </div>
      </section>
      
      {/* CTA Section */}
      <FadeInWhenVisible>
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-90"></div>
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              mixBlendMode: "overlay"
            }}
          ></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Start Your Reading Journey</h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Join our community of book lovers and keep track of your reading adventures.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-purple-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-purple-50 transition-colors"
              onClick={() => toast.success("Welcome to the community!", { description: "Your reading journey begins now." })}
            >
              Join Now
            </motion.button>
          </div>
        </section>
      </FadeInWhenVisible>
    </div>
  );
};

export default Index;
