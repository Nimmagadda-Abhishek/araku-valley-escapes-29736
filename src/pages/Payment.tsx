import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import { ArrowLeft, LogIn } from 'lucide-react';
import { loggedFetch } from '@/lib/utils';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingData {
  customerDetails: {
    name: string;
    phone: string;
    email: string;
  };
  checkIn: string;
  checkOut: string;
  selectedTents: number[];
  guests: number;
  pricing: {
    total: number;
    advance: number;
    balance: number;
  };
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const Payment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('bookingData');
    if (!data || data === "undefined") {
      navigate('/booking');
      return;
    }
    setBookingData(JSON.parse(data));

    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    } else {
      setShowAuthModal(true);
    }
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userData = {
        uid: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setShowAuthModal(false);
      toast({
        title: 'Signed In Successfully',
        description: `Welcome, ${userData.name}!`,
      });
    } catch (error) {
      toast({
        title: 'Sign In Failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const handlePayment = async () => {
    const firebaseUid = user?.uid;
    if (!firebaseUid) {
      setShowAuthModal(true);
      return;
    }

    setIsProcessing(true);

    try {
      // Create booking
      const bookingPayload = {
        firebaseUid,
        customerName: bookingData.customerDetails.name,
        customerPhone: bookingData.customerDetails.phone,
        customerEmail: bookingData.customerDetails.email,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        tentNumbers: bookingData.selectedTents,
        numberOfGuests: bookingData.guests,
      };

      console.log('Sending booking payload:', bookingPayload);

      const response = await loggedFetch('https://apimatrimony.lytortech.com/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });

      const bookingResponse = await response.json();

      console.log('Booking response:', bookingResponse);

      // Initialize Razorpay
      const options = {
        key: 'rzp_live_BnPhMdUqppmXgD',
        amount: bookingData.pricing.advance * 100,
        currency: 'INR',
        order_id: bookingResponse.razorpayOrderId,
        name: 'Araku Valley Camping',
        description: `Tent Booking - ${bookingResponse.referenceNumber}`,
        prefill: {
          name: bookingData.customerDetails.name,
          email: bookingData.customerDetails.email,
          contact: bookingData.customerDetails.phone,
        },
        handler: async function (razorpayResponse: RazorpayResponse) {
          // Verify payment
          const verifyPayload = {
            razorpayOrderId: razorpayResponse.razorpay_order_id,
            razorpayPaymentId: razorpayResponse.razorpay_payment_id,
            razorpaySignature: razorpayResponse.razorpay_signature,
          };

          console.log('Sending verify payment payload:', verifyPayload);

          const verifyResponse = await loggedFetch(
            'https://apimatrimony.lytortech.com/api/bookings/verify-payment',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(verifyPayload),
            }
          );

          if (!verifyResponse.ok) {
            throw new Error(`Payment verification failed: ${verifyResponse.status} ${verifyResponse.statusText}`);
          }

          const verifyData = await verifyResponse.json();

          console.log('Verify payment response:', verifyData);

          if (verifyData.bookingStatus === 'CONFIRMED' && verifyData.paymentStatus === 'ADVANCE_PAID') {
            localStorage.setItem('confirmationData', JSON.stringify({
              ...bookingData,
              referenceNumber: bookingResponse.referenceNumber,
              paymentStatus: 'ADVANCE_PAID',
            }));
            localStorage.removeItem('bookingData');
            navigate('/booking/confirmation');
          } else {
            toast({
              title: 'Payment Verification Failed',
              description: 'Please contact support',
              variant: 'destructive',
            });
          }
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const razorpay = new (window as any).Razorpay(options) as any;
      razorpay.open();
    } catch (error) {
      toast({
        title: 'Payment Failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-secondary/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card rounded-2xl shadow-strong p-8 max-w-md w-full text-center"
            >
              <h2 className="font-display text-3xl font-bold mb-4">Almost There!</h2>
              <p className="text-muted-foreground mb-2">Sign in to complete your booking</p>
              <p className="text-sm text-muted-foreground mb-8">
                We need your email for booking confirmation
              </p>

              <Button
                onClick={handleGoogleSignIn}
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow"
              >
                <LogIn className="mr-2" size={20} />
                Continue with Google
              </Button>

              <p className="text-xs text-muted-foreground mt-6">
                We only use your name and email. No spam, ever.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-32 pb-24 container mx-auto px-4">
        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">✓</div>
              <span className="text-primary font-semibold">Select Dates</span>
            </div>
            <div className="w-16 h-0.5 bg-primary" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">✓</div>
              <span className="text-primary font-semibold">Choose Tents</span>
            </div>
            <div className="w-16 h-0.5 bg-primary" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">✓</div>
              <span className="text-primary font-semibold">Your Details</span>
            </div>
            <div className="w-16 h-0.5 bg-primary" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">4</div>
              <span className="font-semibold text-primary">Payment</span>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/booking/details')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2" size={18} />
            Back
          </Button>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Payment Info */}
            <div className="md:col-span-2">
              <div className="bg-card rounded-2xl shadow-soft p-8">
                <h1 className="font-display text-3xl font-bold mb-8">Payment</h1>
                
                <div className="space-y-6">
                  <div className="bg-muted/50 rounded-lg p-6">
                    <h3 className="font-semibold mb-4">Payment will be processed via Razorpay</h3>
                    <p className="text-sm text-muted-foreground">
                      You will pay 50% advance now. The remaining 50% will be paid at check-in.
                    </p>
                  </div>

                  {user && (
                    <div className="bg-primary/10 rounded-lg p-4">
                      <p className="text-sm">
                        <span className="font-semibold">Signed in as:</span> {user.name} ({user.email})
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/booking/details')}
                      className="flex-1"
                    >
                      ← Back
                    </Button>
                    <Button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow text-lg py-6"
                    >
                      {isProcessing
                        ? 'Processing...'
                        : `Pay ₹${bookingData?.pricing.advance.toLocaleString()}`}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Summary */}
            <div>
              <div className="bg-card rounded-2xl shadow-soft p-6 sticky top-32">
                <h3 className="font-display text-xl font-bold mb-4">Final Summary</h3>
                
                {bookingData && (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between font-bold text-lg text-primary">
                      <span>Total Amount:</span>
                      <span>₹{bookingData.pricing.total.toLocaleString()}</span>
                    </div>

                    <div className="border-t border-border pt-3 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Advance (50%):</span>
                        <span className="font-semibold text-primary">
                          ₹{bookingData.pricing.advance.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-primary font-semibold">Pay now</p>
                    </div>

                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Balance (50%):</span>
                        <span className="font-semibold">
                          ₹{bookingData.pricing.balance.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Cash at check-in</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Load Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" />
    </div>
  );
};

export default Payment;
