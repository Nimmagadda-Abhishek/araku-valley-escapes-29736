import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Tent, Utensils, Flame, TreesIcon } from 'lucide-react';

const Experiences = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const experiences = [
    {
      icon: Tent,
      title: 'Premium Safari Tents',
      description: 'Sleep under the stars in our spacious, weatherproof tents featuring king-size beds with premium linens, en-suite facilities, private decks, and panoramic mountain views through large windows',
    },
    {
      icon: Utensils,
      title: 'Tribal Cuisine Experience',
      description: 'Savor authentic Araku tribal delicacies prepared by local chefs using organic ingredients. Enjoy traditional cooking methods, coffee plantation tours, and multi-cuisine options for dietary preferences',
    },
    {
      icon: Flame,
      title: 'Curated Activities',
      description: 'Bonfire nights with folk music, guided sunrise treks to scenic viewpoints, waterfall rappelling, coffee roasting workshops, tribal village walks, stargazing sessions with telescopes',
    },
    {
      icon: TreesIcon,
      title: 'Guided Nature Trails',
      description: 'Expert-led expeditions through dense forests, coffee estates, and tribal hamlets. Discover hidden waterfalls, exotic flora and fauna, and capture Instagram-worthy moments at every turn',
    },
  ];

  return (
    <section id="experiences" ref={ref} className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">
            WHAT AWAITS YOU
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 text-foreground">
            Curated Experiences
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-strong transition-all duration-300 group hover:-translate-y-2"
            >
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <exp.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-4 text-foreground">
                {exp.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {exp.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experiences;
