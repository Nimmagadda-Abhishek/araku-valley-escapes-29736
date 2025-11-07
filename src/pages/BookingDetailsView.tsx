import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import { ArrowLeft, Calendar, MapPin, Users, CreditCard, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const BookingDetailsView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    // Get booking data from navigation state
    if (location.state?.booking) {
      setBooking(location.state.booking);
    } else {
      // If no booking data in state, redirect to my bookings
      navigate('/my-bookings');
    }
  }, [location.state, navigate]);

  const getStatusColor = (status) => {
    const colors = {
      CONFIRMED: 'bg-green-100 text-green-800 border-green-200',
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200',
      COMPLETED: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      ADVANCE_PAID: 'text-orange-600',
      PAID: 'text-green-600',
      PENDING: 'text-yellow-600',
      FAILED: 'text-red-600'
    };
    return colors[status] || 'text-gray-600';
  };

  const getStatusIcon = (status) => {
    if (status === 'CONFIRMED') return <CheckCircle className="w-5 h-5" />;
    if (status === 'CANCELLED') return <XCircle className="w-5 h-5" />;
    return <AlertCircle className="w-5 h-5" />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[hsl(36,33%,97%)] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[hsl(142,76%,25%)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[hsl(24,30%,15%)] font-medium">Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(36,33%,97%)] to-white">
      <Navigation />

      <div className="pt-32 pb-24 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/my-bookings')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to My Bookings
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[hsl(142,76%,25%)] to-[hsl(142,76%,35%)] text-white p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-display font-bold mb-2">
                    Booking Details
                  </h1>
                  <p className="text-white/90">
                    Reference: {booking.referenceNumber}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold border flex items-center gap-2 w-fit ${getStatusColor(booking.bookingStatus)}`}>
                    {getStatusIcon(booking.bookingStatus)}
                    {booking.bookingStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Booking Info Grid */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[hsl(142,76%,25%)]/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-[hsl(142,76%,25%)]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[hsl(24,30%,15%)] mb-1">Check-in Date</h3>
                      <p className="text-[hsl(24,15%,45%)]">{formatDate(booking.bookingDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[hsl(142,76%,25%)]/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-[hsl(142,76%,25%)]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[hsl(24,30%,15%)] mb-1">Tent Numbers</h3>
                      <div className="flex flex-wrap gap-2">
                        {booking.tentNumbers.map((tent, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-[hsl(36,20%,90%)] text-[hsl(24,30%,15%)] rounded-lg text-sm font-medium"
                          >
                            {tent}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[hsl(142,76%,25%)]/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-[hsl(142,76%,25%)]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[hsl(24,30%,15%)] mb-1">Number of Guests</h3>
                      <p className="text-[hsl(24,15%,45%)]">
                        {booking.numberOfGuests} {booking.numberOfGuests === 1 ? 'Guest' : 'Guests'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-[hsl(36,33%,97%)] rounded-xl p-6">
                    <h3 className="font-semibold text-[hsl(24,30%,15%)] mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-[hsl(24,15%,45%)]">Advance Paid</span>
                        <span className="font-semibold text-[hsl(24,30%,15%)]">
                          ₹{booking.advanceAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[hsl(24,15%,45%)]">Remaining</span>
                        <span className="font-semibold text-[hsl(24,30%,15%)]">
                          ₹{booking.remainingAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="pt-3 border-t border-[hsl(36,20%,85%)]">
                        <div className="flex justify-between items-center">
                          <span className="text-[hsl(24,15%,45%)]">Payment Status</span>
                          <span className={`font-semibold ${getPaymentStatusColor(booking.paymentStatus)}`}>
                            {booking.paymentStatus.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[hsl(36,33%,97%)] rounded-xl p-6">
                    <h3 className="font-semibold text-[hsl(24,30%,15%)] mb-4">Booking Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[hsl(24,15%,45%)]">Total Amount</span>
                        <span className="font-bold text-[hsl(142,76%,25%)] text-lg">
                          ₹{booking.totalAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[hsl(24,15%,45%)]">Booked on</span>
                        <span>{formatDate(booking.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-6 border-t border-[hsl(36,20%,85%)]">
                <Button
                  onClick={() => window.location.href = '/#contact'}
                  variant="outline"
                  className="px-6 py-3 border-2 border-[hsl(36,20%,85%)] text-[hsl(24,30%,15%)] rounded-lg hover:bg-[hsl(36,20%,90%)] transition-colors font-medium"
                >
                  Contact Support
                </Button>
                <Button
                  onClick={() => navigate('/my-bookings')}
                  className="px-6 py-3 bg-[hsl(142,76%,25%)] text-white rounded-lg hover:bg-[hsl(142,76%,20%)] transition-colors font-medium"
                >
                  Back to Bookings
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsView;
