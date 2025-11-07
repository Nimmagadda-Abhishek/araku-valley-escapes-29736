import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import galleryBonfire from '@/assets/gallery-bonfire.jpg';
import galleryCoffee from '@/assets/gallery-coffee.jpg';
import galleryWaterfall from '@/assets/gallery-waterfall.jpg';
import galleryCuisine from '@/assets/gallery-cuisine.jpg';
import galleryCouple from '@/assets/gallery-couple.jpg';
import gallerySunrise from '@/assets/gallery-sunrise.jpg';
import heroImage from '@/assets/hero-araku.jpg';
import aboutImage from '@/assets/about-araku.jpg';
import ctaBackground from '@/assets/cta-background.jpg';

const Gallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    { src: aboutImage, caption: 'Luxury Tent Interior' },
    { src: gallerySunrise, caption: 'Sunrise Over Valley' },
    { src: galleryBonfire, caption: 'Bonfire Gathering' },
    { src: galleryCoffee, caption: 'Coffee Plantation' },
    { src: galleryWaterfall, caption: 'Waterfall Trek' },
    { src: galleryCuisine, caption: 'Tribal Cuisine' },
    { src: galleryCouple, caption: 'Morning Coffee' },
    { src: ctaBackground, caption: 'Starry Night' },
    { src: heroImage, caption: 'Valley Panorama' },
  ];

  return (
    <section id="gallery" ref={ref} className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Moments at Araku
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group cursor-pointer overflow-hidden rounded-xl shadow-soft aspect-[4/3]"
              onClick={() => setSelectedImage(image.src)}
            >
              <img
                src={image.src}
                alt={image.caption}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-primary-foreground font-semibold text-lg">
                  {image.caption}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Explore Full Gallery →
          </Button>
        </motion.div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-secondary/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-primary-foreground hover:text-accent"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          <img
            src={selectedImage}
            alt="Gallery"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </motion.div>
      )}
    </section>
  );
};

export default Gallery;
