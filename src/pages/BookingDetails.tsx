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
import { ArrowLeft } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
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
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">3</div>
              <span className="font-semibold text-primary">Your Details</span>
            </div>
            <div className="w-16 h-0.5 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">4</div>
              <span className="text-muted-foreground">Payment</span>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/booking/select-tents')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2" size={18} />
            Back
          </Button>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Form */}
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl shadow-soft p-8"
              >
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
                      <div className="w-16 flex items-center justify-center bg-muted rounded-md text-sm">
                        +91
                      </div>
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
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.requests.length}/500 characters
                    </p>
                  </div>

                  <div className="flex items-start gap-3 pt-4">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, agreeTerms: checked as boolean })
                      }
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm leading-relaxed cursor-pointer"
                    >
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
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/booking/select-tents')}
                      className="flex-1"
                    >
                      ← Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={!formData.agreeTerms}
                      className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow"
                    >
                      Continue to Payment →
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>

            {/* Summary */}
            <div>
              <div className="bg-card rounded-2xl shadow-soft p-6 sticky top-32">
                <h3 className="font-display text-xl font-bold mb-4">Booking Summary</h3>
                
                {bookingData && (
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Check-in:</span>
                      <p className="font-semibold">
                        {new Date(bookingData.checkIn).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Check-out:</span>
                      <p className="font-semibold">
                        {new Date(bookingData.checkOut).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Nights:</span>
                      <p className="font-semibold">{bookingData.pricing.nights}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Guests:</span>
                      <p className="font-semibold">{bookingData.guests}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tents:</span>
                      <p className="font-semibold">
                        {bookingData.selectedTents.length} ({bookingData.selectedTents.join(', ')})
                      </p>
                    </div>

                    <div className="border-t border-border pt-3 mt-4">
                      <div className="flex justify-between font-bold text-lg mb-3">
                        <span>Total per Tent:</span>
                        <span className="text-primary">₹{bookingData.pricing?.totalAmountPerTent?.toLocaleString()}</span>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Advance per Tent (50%):</span>
                          <span className="font-semibold text-primary">
                            ₹{bookingData.pricing?.advanceAmountPerTent?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Balance per Tent (50%):</span>
                          <span className="font-semibold">
                            ₹{bookingData.pricing?.remainingAmountPerTent?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-muted-foreground">
                        {bookingData.pricing?.pricingNote}
                      </div>
                    </div>
                  </div>
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
