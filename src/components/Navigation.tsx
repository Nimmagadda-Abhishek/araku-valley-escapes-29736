import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if current route is home page
  const isHomePage = location.pathname === '/';

  const navLinks = [
    { name: 'Home', href: '/', showAlways: true },
    { name: 'About', href: '#about', showAlways: false },
    { name: 'Experiences', href: '#experiences', showAlways: false },
    { name: 'Gallery', href: '#gallery', showAlways: false },
    { name: 'Reviews', href: '#testimonials', showAlways: false },
    { name: 'My Bookings', href: '/my-bookings', showAlways: true },
    { name: 'Contact Us', href: '/contact-us', showAlways: true },
  ];

  // Filter nav links based on current page
  const filteredNavLinks = navLinks.filter(link => {
    if (link.showAlways) return true;
    return isHomePage;
  });

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white shadow-medium py-3'
            : 'bg-white py-6'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo - Truncated on mobile */}
            <Link
              to="/"
              className="font-display text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground overflow-hidden text-ellipsis whitespace-nowrap max-w-[calc(100vw-120px)] md:max-w-none"
            >
              Araku Peace Camping Tents
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {filteredNavLinks.map((link) => (
                link.href.startsWith('/') ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-foreground hover:text-primary transition-colors duration-300 relative group whitespace-nowrap text-sm xl:text-base"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-foreground hover:text-primary transition-colors duration-300 relative group whitespace-nowrap text-sm xl:text-base"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                  </a>
                )
              ))}
            </div>

            {/* Desktop CTA Button */}
            <div className="hidden lg:block">
              <Link to="/booking">
                <Button className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300 whitespace-nowrap">
                  Book Now
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button - Always visible */}
            <button
              className="lg:hidden text-foreground p-2 -mr-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(event, info) => {
              if (info.offset.x > 50) {
                setIsMobileMenuOpen(false);
              }
            }}
            className="fixed inset-0 z-40 bg-white lg:hidden"
          >
            <div className="flex flex-col items-center justify-start h-full gap-6 pt-24 overflow-y-auto pb-8 px-4">
              {filteredNavLinks.map((link, index) => (
                link.href.startsWith('/') ? (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link
                      to={link.href}
                      className="text-2xl font-display text-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-2xl font-display text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </motion.a>
                )
              ))}
              <Link to="/booking" onClick={() => setIsMobileMenuOpen(false)}>
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow mt-4">
                  Book Now
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
