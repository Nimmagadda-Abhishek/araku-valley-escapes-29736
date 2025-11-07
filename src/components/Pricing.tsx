import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const packages = [
    {
      name: 'Standard Luxury Package',
      price: '2,250',
      features: [
        'Accommodates 2 guests',
        'Premium tent with mountain view',
        'Breakfast & dinner included',
        'Evening bonfire access',
        'Guided morning nature walk',
      ],
      featured: false,
    },
    {
      name: 'Premium Experience Package',
      price: '3,500',
      features: [
        'Accommodates up to 4 guests',
        'Deluxe tent with panoramic views',
        'All meals + evening snacks',
        'Private bonfire arrangement',
        'Sunrise trek + coffee tour',
        'Photography session',
        'Special tribal performance',
      ],
      featured: true,
    },
  ];

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Luxury Camping Packages
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`bg-card rounded-2xl p-8 shadow-soft ${
                pkg.featured
                  ? 'border-2 border-primary shadow-strong relative'
                  : ''
              }`}
            >
              {pkg.featured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-6 py-2 rounded-full text-sm font-semibold">
                  MOST POPULAR
                </div>
              )}

              <h3 className="font-display text-2xl font-bold mb-2 text-foreground">
                {pkg.name}
              </h3>
              <div className="flex items-baseline mb-6">
                <span className="text-5xl font-display font-bold text-primary">₹{pkg.price}</span>
                <span className="text-muted-foreground ml-2">per night</span>
              </div>

              <ul className="space-y-4 mb-8">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/booking">
                <Button
                  className={
                    pkg.featured
                      ? 'w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow'
                      : 'w-full'
                  }
                  size="lg"
                >
                  {pkg.featured ? 'Choose Premium' : 'Select Package'}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center text-muted-foreground text-sm mt-8"
        >
          Extra guest: ₹500/night | Check-in: 2 PM | Check-out: 11 AM
        </motion.p>
      </div>
    </section>
  );
};

export default Pricing;
