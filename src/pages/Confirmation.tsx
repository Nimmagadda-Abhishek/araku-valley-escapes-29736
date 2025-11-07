import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';

const Confirmation = () => {
  const navigate = useNavigate();
  const [confirmationData, setConfirmationData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem('confirmationData');
    if (!data) {
      navigate('/booking');
      return;
    }
    setConfirmationData(JSON.parse(data));
  }, [navigate]);

  if (!confirmationData) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-24 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-8"
          >
            <CheckCircle className="w-16 h-16 text-primary" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-display text-4xl md:text-5xl font-bold mb-4"
          >
            Booking Confirmed!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-muted-foreground mb-12"
          >
            Get ready for an unforgettable experience
          </motion.p>

          {/* Confirmation Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-card rounded-2xl shadow-strong p-8 md:p-12 text-left border-2 border-primary/20"
          >
            <div className="border-b border-dashed border-border pb-6 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-muted-foreground">Booking Reference</span>
                <span className="text-2xl font-display font-bold text-primary">
                  {confirmationData.referenceNumber}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-muted-foreground">Payment Status</span>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  <CheckCircle size={16} />
                  Confirmed
                </span>
              </div>
            </div>

            <h3 className="font-display text-xl font-bold mb-6">Your Reservation</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">📅 Check-in:</span>
                <span className="font-semibold">
                  {new Date(confirmationData.checkIn).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })} (2:00 PM)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">📅 Check-out:</span>
                <span className="font-semibold">
                  {new Date(confirmationData.checkOut).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })} (11:00 AM)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">⛺ Tents:</span>
                <span className="font-semibold">
                  {confirmationData.selectedTents.length} ({confirmationData.selectedTents.join(', ')})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">👥 Guests:</span>
                <span className="font-semibold">{confirmationData.guests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">👤 Name:</span>
                <span className="font-semibold">{confirmationData.customerDetails.name}</span>
              </div>
            </div>

            <div className="border-t border-border pt-6 mb-6">
              <h3 className="font-display text-lg font-bold mb-4">Payment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="font-bold">₹{confirmationData.pricing.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">✓ Paid Now:</span>
                  <span className="font-semibold text-primary">
                    ₹{confirmationData.pricing.advance.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">💵 Due at Check-in:</span>
                  <span className="font-semibold">
                    ₹{confirmationData.pricing.balance.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="text-sm mb-2">
                📧 <span className="font-semibold">Confirmation email sent to:</span>
              </p>
              <p className="text-sm text-primary font-semibold">
                {confirmationData.customerDetails.email}
              </p>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-display text-lg font-bold mb-4">Next Steps</h3>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="font-semibold text-foreground">1.</span>
                  <span>Save your reference number: <span className="font-semibold text-primary">{confirmationData.referenceNumber}</span></span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-foreground">2.</span>
                  <span>Present this at check-in</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-foreground">3.</span>
                  <span>Pay balance amount at reception</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-foreground">4.</span>
                  <span>Free cancellation up to 48 hours before check-in</span>
                </li>
              </ol>
            </div>

            <div className="border-t border-border pt-6 mt-6">
              <p className="text-sm text-muted-foreground text-center">
                Need Help? Call: <span className="font-semibold text-foreground">+91-XXXXX-XXXXX</span>
              </p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 mt-8"
          >
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => window.print()}
            >
              <Download className="mr-2" size={18} />
              Download Invoice
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow"
              onClick={() => {
                localStorage.removeItem('bookingData');
                localStorage.removeItem('confirmationData');
                navigate('/');
              }}
            >
              <Home className="mr-2" size={18} />
              Back to Home
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Confirmation;
