import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import { ArrowLeft, Check, Calendar, Tent, User, CreditCard } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Tent {
  tentNumber: string;
  status: string;
}

interface AvailabilityData {
  tents: Tent[];
  availableTents: number;
  bookedTents: number;
  totalTents: number;
  totalAmount?: number;
  advanceAmount?: number;
  remainingAmount?: number;
  nights: number;
  totalAmountPerTent?: number;
  advanceAmountPerTent?: number;
  remainingAmountPerTent?: number;
  pricingNote?: string;
}

interface Pricing {
  subtotal: number;
  tax: number;
  total: number;
  advance: number;
  balance: number;
  nights: number;
}

interface BookingData {
  checkIn: string;
  checkOut: string;
  guests: number;
  availabilityData?: AvailabilityData;
  selectedTents?: string[];
  pricing?: Pricing;
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
            <div
              key={step.key}
              className="flex items-center gap-3"
            >
              <button
                onClick={() => {
                  // allow navigating back but not forward
                  if (stepIndex <= current) onStepClick(stepIndex);
                }}
                aria-current={isActive ? 'step' : undefined}
                className={`flex items-center gap-2 focus:outline-none`}
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
                <div
                  aria-hidden
                  className={`hidden md:block w-12 h-0.5 transition-colors
                    ${isCompleted ? 'bg-primary' : 'bg-border'}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

const SelectTents = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTents, setSelectedTents] = useState<string[]>([]);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [tents, setTents] = useState<Tent[]>([]);

  // current step: 2 (Choose Tents)
  const currentStep = 2;

  useEffect(() => {
    const data = localStorage.getItem('bookingData');
    if (!data) {
      navigate('/booking');
      return;
    }
    const parsed = JSON.parse(data);
    setBookingData(parsed);
    
    if (parsed.availabilityData?.tents) {
      // Show ALL 50 tents - do not filter
      setTents(parsed.availabilityData.tents);
    }
  }, [navigate]);

  const toggleTent = (tentNumber: string, status: string) => {
    if (status === 'BOOKED' || status === 'RESERVED') return;

    setSelectedTents((prev) =>
      prev.includes(tentNumber)
        ? prev.filter((t) => t !== tentNumber)
        : [...prev, tentNumber]
    );
  };

  const calculateTotal = () => {
    if (!bookingData) return { subtotal: 0, tax: 0, total: 0, advance: 0, balance: 0, nights: 0 };

    // Use per-tent pricing from API if available
    if (bookingData.availabilityData?.totalAmountPerTent) {
      const perTentTotal = bookingData.availabilityData.totalAmountPerTent;
      const perTentAdvance = bookingData.availabilityData.advanceAmountPerTent || perTentTotal * 0.5;
      const perTentBalance = bookingData.availabilityData.remainingAmountPerTent || perTentTotal - perTentAdvance;

      return {
        subtotal: perTentTotal * selectedTents.length,
        tax: 0, // Assuming tax is included in the per-tent pricing
        total: perTentTotal * selectedTents.length,
        advance: perTentAdvance * selectedTents.length,
        balance: perTentBalance * selectedTents.length,
        nights: bookingData.availabilityData.nights,
      };
    }

    // Use total pricing from API if available (legacy support)
    if (bookingData.availabilityData?.totalAmount) {
      return {
        subtotal: bookingData.availabilityData.totalAmount / 1.18, // Remove tax
        tax: bookingData.availabilityData.totalAmount - (bookingData.availabilityData.totalAmount / 1.18),
        total: bookingData.availabilityData.totalAmount,
        advance: bookingData.availabilityData.advanceAmount,
        balance: bookingData.availabilityData.remainingAmount,
        nights: bookingData.availabilityData.nights,
      };
    }

    // Fallback to local calculation if API pricing not available
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const tentPrice = 2250;

    const subtotal = tentPrice * selectedTents.length * nights;
    const total = subtotal;
    const advance = total * 0.5;
    const balance = total - advance;

    return { subtotal, total, advance, balance, nights };
  };

  const handleContinue = () => {
    if (selectedTents.length === 0) {
      toast({
        title: 'No Tents Selected',
        description: 'Please select at least one tent',
        variant: 'destructive',
      });
      return;
    }

    const updatedData = {
      ...bookingData,
      selectedTents,
      pricing: calculateTotal(),
    };
    
    localStorage.setItem('bookingData', JSON.stringify(updatedData));
    navigate('/booking/details');
  };

  const pricing = calculateTotal();

  // handle step clicks from ProgressStepper
  const handleStepClick = (stepIndex: number) => {
    // allow navigating back only
    if (stepIndex === 1) navigate('/booking');
    if (stepIndex === 2) navigate('/booking/select-tents'); // current
    // do not allow navigating to 3/4 from here
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-24 container mx-auto px-4">
        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-8">
          <ProgressStepper current={currentStep} onStepClick={handleStepClick} />
        </div>

        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/booking')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2" size={18} />
            Back
          </Button>

          <h1 className="font-display text-4xl font-bold mb-8">Select Your Tents</h1>

          {/* Availability Summary */}
          {bookingData?.availabilityData && (
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 mb-6 border border-primary/20">
              <h3 className="font-semibold text-lg mb-4">
                📊 Availability for {new Date(bookingData.checkIn).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-sm">
                    <strong>{bookingData.availabilityData.availableTents}</strong> Available
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span className="text-sm">
                    <strong>{bookingData.availabilityData.totalTents - bookingData.availabilityData.availableTents - bookingData.availabilityData.bookedTents}</strong>booked
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Total: {bookingData.availabilityData.totalTents} tents in the resort</p>
            </div>
          )}

          {/* Legend */}
          <div className="bg-card rounded-lg p-6 mb-8 flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                T
              </div>
              <span className="text-sm">Available (Click to Select)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-semibold">
                T
              </div>
              <span className="text-sm">Unavailable (Booked)</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-white font-semibold">
                T
              </div>
              <span className="text-sm">Your Selection</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Tent Grid */}
            <div className="md:col-span-2">
              <div className="bg-card rounded-2xl shadow-soft p-8">
                <TooltipProvider>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                    {tents.map((tent) => {
                      const isSelected = selectedTents.includes(tent.tentNumber);
                      const isDisabled = tent.status === 'BOOKED' || tent.status === 'RESERVED';
                      
                      const getColor = () => {
                        if (isSelected) return 'bg-orange-400 text-white shadow-glow';
                        if (tent.status === 'BOOKED') return 'bg-red-600 text-white cursor-not-allowed opacity-70';
                        if (tent.status === 'RESERVED') return 'bg-red-600 text-white cursor-not-allowed opacity-70';
                        return 'bg-green-500 text-white hover:shadow-medium';
                      };
                      
                      const getTooltip = () => {
                        if (tent.status === 'BOOKED') return 'Already booked';
                        if (tent.status === 'RESERVED') return 'Unavailable';
                        return 'Click to select';
                      };
                      
                      return (
                        <Tooltip key={tent.tentNumber}>
                          <TooltipTrigger asChild>
                            <motion.button
                              whileHover={{ scale: tent.status === 'AVAILABLE' ? 1.05 : 1 }}
                              whileTap={{ scale: tent.status === 'AVAILABLE' ? 0.95 : 1 }}
                              onClick={() => toggleTent(tent.tentNumber, tent.status)}
                              disabled={isDisabled}
                              className={`
                                w-12 h-12 rounded-full font-semibold transition-all duration-200
                                ${getColor()}
                              `}
                            >
                              {tent.tentNumber.replace('T', '')}
                            </motion.button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{getTooltip()}</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </TooltipProvider>
              </div>
            </div>

            {/* Selection Summary */}
            <div>
              <div className="bg-card rounded-2xl shadow-soft p-6 sticky top-32">
                <h3 className="font-display text-xl font-bold mb-4">Your Selection</h3>
                
                <div className="space-y-3 pb-4 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tents Selected:</span>
                    <span className="font-semibold">
                      {selectedTents.length} ({selectedTents.join(', ')})
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Nights:</span>
                    <span className="font-semibold">{pricing.nights}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Guests:</span>
                    <span className="font-semibold">{bookingData?.guests}</span>
                  </div>
                </div>

                <div className="space-y-2 py-4 border-b border-border">
                  <h4 className="font-semibold mb-2">Price Calculation</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tent Price:</span>
                    <span>₹{pricing.subtotal.toLocaleString()}</span>
                  </div>

                </div>

                <div className="flex justify-between font-bold text-lg mt-4 mb-4">
                  <span>Total:</span>
                  <span className="text-primary">₹{pricing.total.toLocaleString()}</span>
                </div>

                <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm mb-6">
                  <div className="flex justify-between">
                    <span>Advance (50%):</span>
                    <span className="font-semibold text-primary">₹{pricing.advance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Balance (50%):</span>
                    <span className="font-semibold">₹{pricing.balance.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Pay advance online, balance at check-in
                  </p>
                </div>

                <Button
                  onClick={handleContinue}
                  disabled={selectedTents.length === 0}
                  className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow"
                  size="lg"
                >
                  Continue to Details →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectTents;
