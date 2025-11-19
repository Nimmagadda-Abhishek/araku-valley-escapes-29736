import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import { ArrowLeft, LogIn, Check, Calendar, Tent, User, CreditCard } from 'lucide-react';
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
  selectedTents: number[] | string[]; // backend sometimes uses strings
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

/**
 * ProgressStepper component
 * - steps: array of { key, title, path, icon }
 * - current: 1-based current step index
 * - onStepClick allows navigating back (prevents forward navigation)
 */
const ProgressStepper = ({
  current,
  onStepClick,
}: {
  current: number;
  onStepClick: (stepIndex: number) => void;
}) => {
  const steps = [
    { key: 'dates', title: 'Select Dates', path: '/booking', icon: Calendar },
    { key: 'tents', title: 'Choose Tents', path: '/booking/select-tents', icon: Tent },
    { key: 'details', title: 'Your Details', path: '/booking/details', icon: User },
    { key: 'payment', title: 'Payment', path: '/booking/payment', icon: CreditCard },
  ];

  return (
    <nav aria-label="Booking progress" className="w-full">
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {steps.map((step, idx) => {
          const stepIndex = idx + 1;
          const isCompleted = stepIndex < current;
          const isActive = stepIndex === current;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex items-center gap-3">
              <button
                onClick={() => {
                  // allow navigating back but not forward
                  if (stepIndex <= current) onStepClick(stepIndex);
                }}
                aria-current={isActive ? 'step' : undefined}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all
                    ${isCompleted ? 'bg-primary text-primary-foreground' : ''}
                    ${isActive ? 'bg-gradient-to-r from-primary to-primary-glow text-white shadow-glow' : ''}
                    ${!isCompleted && !isActive ? 'bg-muted text-muted-foreground' : ''}
                  `}
                >
                  {isCompleted ? <Check size={16} /> : <Icon size={16} />}
                </div>
                <div className="hidden sm:block text-left">
                  <div
                    className={`text-xs ${isActive ? 'text-primary font-semibold' : isCompleted ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    {step.title}
                  </div>
                </div>
              </button>

              {idx < steps.length - 1 && (
                <div
                  aria-hidden
                  className={`hidden md:block w-12 h-0.5 transition-colors ${isCompleted ? 'bg-primary' : 'bg-border'}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

const Payment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentOrderId, setPaymentOrderId] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('bookingData');
    if (!data || data === 'undefined') {
      navigate('/booking');
      return;
    }
    try {
      setBookingData(JSON.parse(data));
    } catch (err) {
      navigate('/booking');
      return;
    }

    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setShowAuthModal(true);
      }
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

  const pollPaymentStatus = async (orderId: string, referenceNumber: string) => {
    setIsPolling(true);
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds with 1 second intervals

    const poll = async () => {
      try {
        const response = await loggedFetch(`https://apimatrimony.lytortech.com/api/bookings/status/${orderId}`);
        const data = await response.json();

        if (data.bookingStatus === 'CONFIRMED' && data.paymentStatus === 'ADVANCE_PAID') {
          localStorage.setItem(
            'confirmationData',
            JSON.stringify({
              ...bookingData,
              referenceNumber,
              paymentStatus: 'ADVANCE_PAID',
            })
          );
          localStorage.removeItem('bookingData');
          navigate('/booking/confirmation');
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 1000);
        } else {
          setIsPolling(false);
          toast({
            title: 'Payment Verification Timeout',
            description: 'Please check your bookings page or contact support',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Polling error:', error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 1000);
        } else {
          setIsPolling(false);
          toast({
            title: 'Payment Verification Failed',
            description: 'Please contact support',
            variant: 'destructive',
          });
        }
      }
    };

    poll();
  };

  const handlePayment = async () => {
    const firebaseUid = user?.uid;
    if (!firebaseUid) {
      setShowAuthModal(true);
      return;
    }

    if (!bookingData) {
      toast({
        title: 'No Booking',
        description: 'Please complete booking details first',
        variant: 'destructive',
      });
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

      setPaymentOrderId(bookingResponse.razorpayOrderId);

      // Initialize Razorpay
      const options = {
        key: 'rzp_live_RejsUkXNc69HrM',
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
        modal: {
          ondismiss: function () {
            // Start polling when user closes the payment modal (common with UPI)
            if (!isPolling) {
              pollPaymentStatus(bookingResponse.razorpayOrderId, bookingResponse.referenceNumber);
            }
          },
        },
        handler: async function (razorpayResponse: RazorpayResponse) {
          // Verify payment
          const verifyPayload = {
            razorpayOrderId: razorpayResponse.razorpay_order_id,
            razorpayPaymentId: razorpayResponse.razorpay_payment_id,
            razorpaySignature: razorpayResponse.razorpay_signature,
          };

          console.log('Sending verify payment payload:', verifyPayload);

          const verifyResponse = await loggedFetch('https://apimatrimony.lytortech.com/api/bookings/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(verifyPayload),
          });

          if (!verifyResponse.ok) {
            throw new Error(`Payment verification failed: ${verifyResponse.status} ${verifyResponse.statusText}`);
          }

          const verifyData = await verifyResponse.json();

          console.log('Verify payment response:', verifyData);

          if (verifyData.bookingStatus === 'CONFIRMED' && verifyData.paymentStatus === 'ADVANCE_PAID') {
            localStorage.setItem(
              'confirmationData',
              JSON.stringify({
                ...bookingData,
                referenceNumber: bookingResponse.referenceNumber,
                paymentStatus: 'ADVANCE_PAID',
              })
            );
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

  // current step: 4 (Payment)
  const currentStep = 4;
  const handleStepClick = (stepIndex: number) => {
    // allow navigating back only
    if (stepIndex === 1) navigate('/booking');
    if (stepIndex === 2) navigate('/booking/select-tents');
    if (stepIndex === 3) navigate('/booking/details');
    // do not allow navigating to step 4 from here (already on step 4)
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
              <p className="text-sm text-muted-foreground mb-8">We need your email for booking confirmation</p>

              <Button onClick={handleGoogleSignIn} size="lg" className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow">
                <LogIn className="mr-2" size={20} />
                Continue with Google
              </Button>

              <p className="text-xs text-muted-foreground mt-6">We only use your name and email. No spam, ever.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-32 pb-24 container mx-auto px-4">
        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-12">
          <ProgressStepper current={currentStep} onStepClick={handleStepClick} />
        </div>

        <div className="max-w-5xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/booking/details')} className="mb-6">
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
                    <p className="text-sm text-muted-foreground">You will pay 50% advance now. The remaining 50% will be paid at check-in.</p>
                    {isPolling && (
                      <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                        <p className="text-sm text-primary font-semibold">Verifying payment... Please wait.</p>
                        <p className="text-xs text-muted-foreground mt-1">This may take a few moments for UPI payments.</p>
                      </div>
                    )}
                  </div>

                  {user && (
                    <div className="bg-primary/10 rounded-lg p-4">
                      <p className="text-sm">
                        <span className="font-semibold">Signed in as:</span> {user.name} ({user.email})
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <Button variant="outline" onClick={() => navigate('/booking/details')} className="flex-1">
                      ← Back
                    </Button>
                    <Button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow text-lg py-6"
                    >
                      {isProcessing ? 'Processing...' : `Pay ₹${bookingData?.pricing.advance.toLocaleString()}`}
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
                        <span className="font-semibold text-primary">₹{bookingData.pricing.advance.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-primary font-semibold">Pay now</p>
                    </div>

                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Balance (50%):</span>
                        <span className="font-semibold">₹{bookingData.pricing.balance.toLocaleString()}</span>
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
