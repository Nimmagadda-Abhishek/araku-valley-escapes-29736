import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import { ArrowLeft, Check, Calendar, Tent, User, CreditCard } from 'lucide-react';

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

const BookingDetails = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookingData, setBookingData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    requests: '',
    agreeTerms: false,
  });

  useEffect(() => {
    const data = localStorage.getItem('bookingData');
    if (!data) {
      navigate('/booking');
      return;
    }
    setBookingData(JSON.parse(data));
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.agreeTerms) {
      toast({
        title: 'Terms Required',
        description: 'Please agree to the terms and conditions',
        variant: 'destructive',
      });
      return;
    }

    const updatedData = {
      ...bookingData,
      customerDetails: formData,
    };

    localStorage.setItem('bookingData', JSON.stringify(updatedData));
    navigate('/booking/payment');
  };

  // current step: 3 (Your Details)
  const currentStep = 3;

  const handleStepClick = (stepIndex: number) => {
    // allow navigating back only
    if (stepIndex === 1) navigate('/booking');
    if (stepIndex === 2) navigate('/booking/select-tents');
    if (stepIndex === 3) navigate('/booking/details'); // current
    // do not allow navigating to 4 from here
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-24 container mx-auto px-4">
        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-8">
          <ProgressStepper current={currentStep} onStepClick={handleStepClick} />
        </div>

        <div className="max-w-5xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/booking/select-tents')} className="mb-6">
            <ArrowLeft className="mr-2" size={18} />
            Back
          </Button>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Form */}
            <div className="md:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl shadow-soft p-8">
                <h1 className="font-display text-3xl font-bold mb-8">Contact Information</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="flex gap-2">
                      <div className="w-16 flex items-center justify-center bg-muted rounded-md text-sm">+91</div>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="98765 43210"
                        pattern="[0-9]{10}"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="requests">Special Requests (Optional)</Label>
                    <Textarea
                      id="requests"
                      value={formData.requests}
                      onChange={(e) => setFormData({ ...formData, requests: e.target.value })}
                      placeholder="Any dietary preferences, celebration plans, or special requirements..."
                      rows={4}
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground mt-1">{formData.requests.length}/500 characters</p>
                  </div>

                  <div className="flex items-start gap-3 pt-4">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
                    />
                    <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                      I agree to the{' '}
                      <a href="#" className="text-primary hover:underline">
                        Terms & Conditions
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-primary hover:underline">
                        Cancellation Policy
                      </a>
                    </label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={() => navigate('/booking/select-tents')} className="flex-1">
                      ← Back
                    </Button>
                    <Button type="submit" disabled={!formData.agreeTerms} className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow">
                      Continue to Payment →
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>

            {/* Summary / right column (keeps empty or you can add booking summary) */}
            <div>
              <div className="bg-card rounded-2xl shadow-soft p-6 sticky top-32">
                <h3 className="font-display text-xl font-bold mb-4">Booking Summary</h3>
                {bookingData ? (
                  <>
                    <div className="text-sm mb-2">
                      <strong>Dates:</strong>{' '}
                      {new Date(bookingData.checkIn).toLocaleDateString()} —{' '}
                      {new Date(bookingData.checkOut).toLocaleDateString()}
                    </div>
                    <div className="text-sm mb-2">
                      <strong>Times:</strong>{' '}
                      Check-in: {bookingData.checkInTime || '16:00'} — Check-out: {bookingData.checkOutTime || '09:00'}
                    </div>
                    <div className="text-sm mb-2">
                      <strong>Tents:</strong> {bookingData.selectedTents?.length || 0} — {bookingData.selectedTents?.join(', ') || '—'}
                    </div>
                    <div className="text-sm mb-2">
                      <strong>Guests:</strong> {bookingData.guests}
                    </div>
                    <div className="text-sm mt-4">
                      <strong>Price (est.):</strong> {bookingData.pricing ? `₹${bookingData.pricing.total.toLocaleString()}` : '—'}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">No booking data available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
