import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Check, Tent, User, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import { loggedFetch } from '@/lib/utils';

const ProgressStepper = ({ current, onStepClick }) => {
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
                  <div className={`text-xs ${isActive ? 'text-primary font-semibold' : isCompleted ? 'text-primary' : 'text-muted-foreground'}`}>
                    {step.title}
                  </div>
                </div>
              </button>

              {idx < steps.length - 1 && (
                <div aria-hidden className={`hidden md:block w-12 h-0.5 transition-colors ${isCompleted ? 'bg-primary' : 'bg-border'}`} />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

const Booking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [isLoading, setIsLoading] = useState(false);

  // Allowed months: Nov(10), Dec(11), Jan(0), Feb(1)
  const allowedMonthIndexes = [10, 11, 0, 1];

  // Parse YYYY-MM-DD -> local Date at midnight (avoids timezone shifts)
  const parseLocalDate = (isoDateStr) => {
    if (!isoDateStr) return null;
    const parts = isoDateStr.split('-').map(Number);
    if (parts.length !== 3) return null;
    const [y, m, d] = parts;
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  };

  // Return true only if every day in range [startIso, endIso] has month in allowedMonthIndexes
  const rangeIsInAllowedMonths = (startIso, endIso) => {
    const s = parseLocalDate(startIso);
    const e = parseLocalDate(endIso);
    if (!s || !e) return false;
    if (s > e) return false;

    for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
      if (!allowedMonthIndexes.includes(d.getMonth())) {
        // debug: console.debug('out-of-season day:', d.toISOString(), 'month:', d.getMonth());
        return false;
      }
    }
    return true;
  };

  const handleCheckAvailability = async () => {
    if (!checkIn || !checkOut) {
      toast({
        title: 'Missing Information',
        description: 'Please select check-in and check-out dates',
        variant: 'destructive',
      });
      return;
    }

    // Basic validity: parse and ensure checkOut >= checkIn
    const s = parseLocalDate(checkIn);
    const e = parseLocalDate(checkOut);
    if (!s || !e || s > e) {
      toast({
        title: 'Invalid Dates',
        description: 'Please select valid check-in and check-out dates (check-out must be same or after check-in).',
        variant: 'destructive',
      });
      return;
    }

    // Season check: every day must be in Nov/Dec/Jan/Feb
    const inSeason = rangeIsInAllowedMonths(checkIn, checkOut);
    if (!inSeason) {
      toast({
        title: 'Seasonal closure',
        description: 'Tents are available only during November, December, January and February. Please pick dates within those months.',
        variant: 'destructive',
      });
      return; // IMPORTANT: do not call API if out of season
    }

    // All client-side checks passed -> call API
    setIsLoading(true);
    try {
      const response = await loggedFetch(
        `https://apimatrimony.lytortech.com/api/availability/${checkIn}?checkOut=${checkOut}&numberOfTents=${guests}`
      );
      const data = await response.json();

      localStorage.setItem(
        'bookingData',
        JSON.stringify({
          checkIn,
          checkOut,
          guests: parseInt(guests, 10),
          availabilityData: data,
        })
      );

      navigate('/booking/select-tents');
    } catch (error) {
      console.error('availability error', error);
      toast({
        title: 'Error',
        description: 'Failed to check availability. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // current step: 1 (Select Dates)
  const currentStep = 1;
  const handleStepClick = (stepIndex) => {
    // allow navigating back only (from step 1 there is nothing earlier)
    if (stepIndex === 1) navigate('/booking');
    // do not allow navigating to 2/3/4 from here
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-24 container mx-auto px-4">
        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-12">
          <ProgressStepper current={currentStep} onStepClick={handleStepClick} />
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-card rounded-2xl shadow-strong p-8 md:p-12"
        >
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-center whitespace-nowrap mb-8 text-foreground">
            Plan Your Escape
          </h1>

          <div className="space-y-6">
            {/* Check-in Date */}
            <div>
              <Label
                htmlFor="checkIn"
                className="text-base mb-2 flex items-center gap-2"
              >
                <Calendar size={18} className="text-primary" />
                Check-in Date
              </Label>
              <Input
                id="checkIn"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="text-base"
              />
            </div>

            {/* Check-out Date */}
            <div>
              <Label
                htmlFor="checkOut"
                className="text-base mb-2 flex items-center gap-2"
              >
                <Calendar size={18} className="text-primary" />
                Check-out Date
              </Label>
              <Input
                id="checkOut"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split('T')[0]}
                className="text-base"
              />
            </div>

            {/* Number of Guests */}
            

            {/* Submit Button */}
            <Button
              onClick={handleCheckAvailability}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow text-lg py-6 mt-8"
              size="lg"
            >
              {isLoading ? 'Checking...' : 'Check Availability'}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Booking;
