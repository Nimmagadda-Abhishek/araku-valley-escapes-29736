import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Shield, Car, Toilet, Coffee, Flame, Mountain } from 'lucide-react';
import aboutImage from '@/assets/about-araku.jpg';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    { icon: Shield, text: '24*7 cctv camera Security' },
    { icon: Car, text: 'large parking area' },
    { icon: Toilet, text: '3 toilet rooms for women 2 toilet rooms for men' },
    { icon: Coffee, text: 'tea coffe green tea and black tea' },
    { icon: Flame, text: 'fire camps' },
    { icon: Mountain, text: 'Beautiful araku nature view' },
  ];

  return (
    <section id="about" ref={ref} className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative group"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent opacity-20 rounded-2xl blur-xl group-hover:opacity-30 transition-opacity" />
            <img
              src={aboutImage}
              alt="Luxury tent with mountain view"
              className="relative rounded-2xl shadow-strong w-full h-[500px] object-cover transform group-hover:scale-[1.02] transition-transform duration-500"
            />
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-primary text-sm font-semibold tracking-widest uppercase">
              Discovery araku
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6 text-foreground">
              Where Nature Meets Luxury
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Experience the calm of Araku Valley at Araku Peace Camping Tents — where nature, peace, and comfort come together.
Escape the noise, breathe fresh air, and live the Araku dream.
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="#experiences"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="inline-flex items-center gap-2 mt-8 text-primary font-semibold hover:gap-4 transition-all duration-300 group"
            >
              Learn Our Story
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
