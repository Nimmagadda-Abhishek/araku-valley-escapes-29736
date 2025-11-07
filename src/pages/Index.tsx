import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import SocialProof from '@/components/SocialProof';
import About from '@/components/About';
import Experiences from '@/components/Experiences';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <SocialProof />
      <About />
      <Experiences />
      <Gallery />
      <Testimonials />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
