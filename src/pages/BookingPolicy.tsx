import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const BookingPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-display font-bold text-foreground mb-8">
            Booking Policy
          </h1>

          <div className="prose prose-lg max-w-none text-foreground/80">
            <p className="text-lg mb-6">
              Since Dhruva's World offers tent and nature stay accommodation services, not physical goods, our booking policy applies instead of a shipping policy.
            </p>

            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">Booking Process</h2>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-accent font-semibold">•</span>
                <span>Bookings can be made directly through our website (<a href="https://www.dhruvasworld.com" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">www.dhruvasworld.com</a>) or via our official communication channels.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-semibold">•</span>
                <span>All bookings are confirmed only after successful payment through Razorpay.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-semibold">•</span>
                <span>Guests will receive a booking confirmation via email or WhatsApp within 24 hours of payment.</span>
              </li>
            </ul>

            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">Rescheduling</h2>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-accent font-semibold">•</span>
                <span>Guests may request to reschedule their booking at least 2 days before the check-in date, subject to availability.</span>
              </li>
            </ul>
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

export default BookingPolicy;
