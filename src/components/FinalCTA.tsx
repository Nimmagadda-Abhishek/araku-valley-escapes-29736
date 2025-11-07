import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, XCircle } from 'lucide-react';
import ctaBackground from '@/assets/cta-background.jpg';

const FinalCTA = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const trustBadges = [
    { icon: Shield, text: 'Secure Payment' },
    { icon: CheckCircle, text: 'Instant Confirmation' },
    { icon: XCircle, text: 'Free Cancellation up to 48hrs' },
  ];

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${ctaBackground})` }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-secondary/80" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-6"
        >
          Your Mountain Escape Awaits
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-primary-foreground/90 text-xl mb-12 max-w-2xl mx-auto"
        >
          Limited slots available. Book your dates before they're gone.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link to="/booking">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow text-xl px-12 py-8 animate-pulse-glow"
            >
              Reserve Your Experience
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col md:flex-row justify-center gap-8 mt-16"
        >
          {trustBadges.map((badge, index) => (
            <div key={index} className="flex items-center gap-3 text-primary-foreground">
              <badge.icon className="w-6 h-6 text-accent" />
              <span className="text-sm font-medium">{badge.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
