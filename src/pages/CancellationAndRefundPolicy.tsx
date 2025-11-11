import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const CancellationAndRefundPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-display font-bold text-foreground mb-8">
            Cancellation and Refund Policy
          </h1>

          <div className="prose prose-lg max-w-none text-foreground/80">
            <p className="text-lg mb-6">
              We understand that travel plans can change. Our policies are designed to be transparent and fair.
            </p>

            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">Cancellation Policy</h2>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-accent font-semibold">•</span>
                <span>Cancellations made at least 2 days before the check-in date will be eligible for a full refund.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-semibold">•</span>
                <span>Cancellations made within 2 days of check-in will not be eligible for a refund.</span>
              </li>
            </ul>

            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">Refund Policy</h2>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-accent font-semibold">•</span>
                <span>Approved refunds will be processed within 2 business days after cancellation confirmation.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-semibold">•</span>
                <span>Refunds will be credited to the original payment method used during booking.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-semibold">•</span>
                <span>In case of cancellations made by Dhruva's World (due to weather or operational issues), guests will receive a 100% refund or can choose to reschedule.</span>
              </li>
            </ul>

            <p className="text-lg">
              For refund-related queries, contact:{' '}
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

export default CancellationAndRefundPolicy;
