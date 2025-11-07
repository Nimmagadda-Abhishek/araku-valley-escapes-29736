import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Tent, Users, Star } from 'lucide-react';

const SocialProof = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const stats = [
    { icon: Tent, value: 50, label: 'Luxury Tents', suffix: '+' },
    { icon: Users, value: 500, label: 'Happy Travelers', suffix: '+' },
    { icon: Star, value: 4.9, label: 'Guest Rating', suffix: '/5' },
  ];

  return (
    <section
      ref={ref}
      className="py-16 bg-gradient-to-r from-primary-light to-primary shadow-soft"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex flex-col items-center text-center text-primary-foreground"
            >
              <stat.icon className="w-12 h-12 mb-4 animate-float" />
              <div className="text-5xl font-display font-bold mb-2">
                <Counter target={stat.value} isInView={isInView} />
                {stat.suffix}
              </div>
              <div className="text-lg tracking-wide opacity-90">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Counter = ({ target, isInView }: { target: number; isInView: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span>{count}</span>;
};

export default SocialProof;
