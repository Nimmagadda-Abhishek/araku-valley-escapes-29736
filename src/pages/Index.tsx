import Navigation from '@/components/Navigation';
import About from '@/components/About';
import Experiences from '@/components/Experiences';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Experiences />
      <Gallery />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
