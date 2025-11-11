import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { MapPin, Mail, Phone, Globe } from 'lucide-react';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-display font-bold text-foreground mb-8">
            Contact Us
          </h1>

          <div className="prose prose-lg max-w-none text-foreground/80">
            <p className="text-lg mb-8">
              We're always happy to help you with your booking or queries.
            </p>

            <div className="bg-secondary/50 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-display font-semibold text-foreground mb-6">
                Dhruva's World – Tent Accommodation, Araku Valley
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Location:</span>
                    <span className="ml-2">Araku Valley, Andhra Pradesh, India</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Email:</span>
                    <a
                      href="mailto:info@dhruvasworld.com"
                      className="ml-2 text-accent hover:underline"
                    >
                      dhruvasworldhelp@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Phone:</span>
                    <a
                      href="tel:+917670920235"
                      className="ml-2 text-accent hover:underline"
                    >
                      +91-7670920235
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Website:</span>
                    <a
                      href="https://www.dhruvasworld.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-accent hover:underline"
                    >
                      www.dhruvasworld.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-glow transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;
