import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-display font-bold text-foreground mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-lg max-w-none text-foreground/80">
            <p className="text-lg mb-6">
              At Dhruva's World, we respect your privacy and are committed to protecting your personal information.
            </p>

            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">Information We Collect</h2>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-accent font-semibold">•</span>
                <span>Name, email address, phone number, and booking details.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-semibold">•</span>
                <span>Payment information (processed securely by Razorpay).</span>
              </li>
            </ul>

            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">How We Use Your Information</h2>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-accent font-semibold">•</span>
                <span>To confirm bookings and communicate with guests.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-semibold">•</span>
                <span>To provide updates or respond to customer inquiries.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-semibold">•</span>
                <span>To comply with legal or regulatory requirements.</span>
              </li>
            </ul>

            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">Data Security</h2>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-accent font-semibold">•</span>
                <span>We use industry-standard encryption and secure payment gateways (Razorpay) to protect your personal and financial information.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-semibold">•</span>
                <span>We never sell, rent, or share your information with third parties except as required for payment processing or by law.</span>
              </li>
            </ul>

            <p className="text-lg">
              For any privacy-related concerns, email us at{' '}
              <a
                href="mailto:dhruvasworldhelp@gmail.com"
                className="text-accent hover:underline"
              >
                dhruvasworldhelp@gmail.com
              </a>
            </p>
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

export default PrivacyPolicy;
