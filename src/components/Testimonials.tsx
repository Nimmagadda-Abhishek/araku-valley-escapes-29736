import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Travel Blogger',
      rating: 5,
      quote: 'An absolutely transformative experience! The tents exceeded expectations, the tribal cuisine was phenomenal, and watching sunrise from our private deck was magical. The staff anticipated every need. Can\'t wait to return!',
      date: 'November 2025',
    },
    {
      name: 'Priya Sharma',
      role: 'Adventure Enthusiast',
      rating: 5,
      quote: 'Perfect blend of adventure and luxury! The guided treks were incredible, bonfire nights unforgettable, and the level of service was impeccable. Best family vacation we\'ve ever had!',
      date: 'October 2025',
    },
    {
      name: 'Arun Reddy',
      role: 'Photographer',
      rating: 5,
      quote: 'A photographer\'s paradise! Every corner is Instagram-worthy. The staff helped us capture stunning sunrise shots, and the night sky photography session was spectacular. Highly professional team!',
      date: 'September 2025',
    },
  ];

  return (
    <section id="testimonials" ref={ref} className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Guest Stories
          </h2>
          <p className="text-muted-foreground text-lg">
            Hear from those who've experienced the magic
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-strong transition-all duration-300 relative"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-primary/10" />
              
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </p>

              <div className="border-t border-border pt-4">
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                <p className="text-xs text-muted-foreground mt-2">{testimonial.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
