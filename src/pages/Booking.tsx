import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users } from 'lucide-react';
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

const Booking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckAvailability = async () => {
    if (!checkIn || !checkOut) {
      toast({
        title: 'Missing Information',
        description: 'Please select check-in and check-out dates',
        variant: 'destructive',
      });
      return;
    }

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
          guests: parseInt(guests),
          availabilityData: data,
        })
      );

      navigate('/booking/select-tents');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to check availability. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-24 container mx-auto px-4">
        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                1
              </div>
              <span className="font-semibold text-primary text-xs sm:text-sm md:text-base">
                Select Dates
              </span>
            </div>

            <div className="w-10 sm:w-16 h-0.5 bg-border" />

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm">
                2
              </div>
              <span className="text-muted-foreground text-xs sm:text-sm md:text-base">
                Choose Tents
              </span>
            </div>

            <div className="w-10 sm:w-16 h-0.5 bg-border" />

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm">
                3
              </div>
              <span className="text-muted-foreground text-xs sm:text-sm md:text-base">
                Your Details
              </span>
            </div>

            <div className="w-10 sm:w-16 h-0.5 bg-border" />

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm">
                4
              </div>
              <span className="text-muted-foreground text-xs sm:text-sm md:text-base">
                Payment
              </span>
            </div>
          </div>
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
            <div>
              <Label
                htmlFor="guests"
                className="text-base mb-2 flex items-center gap-2"
              >
                <Users size={18} className="text-primary" />
                Number of Tents
              </Label>
              <Select value={guests} onValueChange={setGuests}>
                <SelectTrigger className="text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={String(num)}>
                      {num} {num === 1 ? 'Tent' : 'Tents'}
                    </SelectItem>
                  ))}
                  <SelectItem value="9">8+ Tents</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
