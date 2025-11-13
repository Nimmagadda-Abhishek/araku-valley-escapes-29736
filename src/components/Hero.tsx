import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-araku.jpg';

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Parallax Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />
      
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{ background: 'var(--gradient-overlay)' }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-16 h-0.5 bg-accent mb-6"
        />

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4"
        >
          Experience peaceful camping at Araku Peace Camping Tents,
        </motion.h3>

        <motion.h4
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-display text-lg md:text-xl lg:text-2xl text-primary-foreground mb-6"
        >
          Surrounded by the greenery of Araku Valley near Ranajilleda Waterfalls.
        </motion.h4>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-lg md:text-xl text-primary-foreground/90 mb-12 max-w-2xl tracking-wide"
        >
           Perfect for nature lovers and adventurers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link to="/booking">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow text-lg px-8 py-6 transition-all duration-300 transform hover:scale-105"
            >
              Book Now
            </Button>
          </Link>
          <a href="https://www.instagram.com/reel/DQ1ttNziRaQ/?igsh=MXVjZ3czemUyMTNidA==" target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white bg-black/50 hover:bg-white hover:text-black text-lg px-8 py-6 transition-all duration-300"
            >
              <Play className="mr-2" size={20} />
              Watch Story
            </Button>
          </a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-primary-foreground"
        >
          <span className="text-sm tracking-widest">SCROLL TO EXPLORE</span>
          <ChevronDown className="animate-bounce" size={24} />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
