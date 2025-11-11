import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-display font-bold text-foreground mb-8">
            Terms and Conditions
          </h1>

          <div className="prose prose-lg max-w-none text-foreground/80">
            <p className="text-lg mb-6">
              Welcome to Dhruva's World, your nature getaway destination in Araku Valley, Andhra Pradesh. By booking accommodation through our website, you agree to the following Terms and Conditions:
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-accent font-semibold">•</span>
                <span>All bookings are subject to room and tent availability.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-semibold">•</span>
                <span>Guests must present a valid government-issued photo ID at the time of check-in.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-semibold">•</span>
                <span>Check-in time: 12:00 PM | Check-out time: 11:00 AM.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-semibold">•</span>
                <span>The property is to be used only for peaceful accommodation purposes — unlawful or disruptive behavior is strictly prohibited.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-semibold">•</span>
                <span>Smoking and alcohol consumption are allowed only in designated areas.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-semibold">•</span>
                <span>Dhruva's World reserves the right to cancel or modify bookings at any time due to unforeseen circumstances (natural calamities, maintenance, etc.), in which case a full refund will be provided.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-semibold">•</span>
                <span>Prices, amenities, and services listed on our website are subject to change without prior notice.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-semibold">•</span>
                <span>Any disputes are subject to the jurisdiction of Visakhapatnam, Andhra Pradesh.</span>
              </li>
            </ul>

            <p className="text-lg">
              For any clarification, please contact us at{' '}
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

export default TermsAndConditions;
