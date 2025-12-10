import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, CreditCard, Clock, CheckCircle, XCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { auth } from '../lib/firebase';
import { useToast } from '../hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { loggedFetch } from '../lib/utils';

// Razorpay types
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  handler: (response: RazorpayResponse) => void;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

interface RazorpayInstance {
  open: () => void;
}

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [firebaseUid, setFirebaseUid] = useState(null);
  const [contactSupportOpen, setContactSupportOpen] = useState(false);
  const [supportForm, setSupportForm] = useState({
    subject: '',
    message: '',
    bookingId: null
  });


  useEffect(() => {
   const unsubscribe = auth.onAuthStateChanged((user) => {
     if (user) {
       setFirebaseUid(user.uid);
     } else {
       setError('Please log in to view your bookings.');
       setLoading(false);
     }
   });
   return unsubscribe;
   }, []);

 useEffect(() => {
   if (firebaseUid) {
     fetchBookings();
   }
 }, [firebaseUid]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await loggedFetch(
        `https://apimatrimony.lytortech.com/api/bookings/user/${firebaseUid}`,
        {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch bookings');

      const data = await response.json();
      setBookings(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
    if (status === 'CONFIRMED') return <CheckCircle className="w-4 h-4" />;
    if (status === 'CANCELLED') return <XCircle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.bookingStatus === filter.toUpperCase();
  });

  const handleViewDetails = (booking) => {
    // Navigate to booking details page with booking data
    navigate(`/booking-details/${booking.id}`, { state: { booking } });
  };



  const handleContactSupport = (booking) => {
    setSupportForm({
      subject: `Support for ${booking.referenceNumber}`,
      message: '',
      bookingId: booking.id
    });
    setContactSupportOpen(true);
  };

  const submitSupportRequest = async () => {
    if (!supportForm.subject || !supportForm.message) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      const supportPayload = {
        bookingId: supportForm.bookingId,
        subject: supportForm.subject,
        message: supportForm.message,
        customerEmail: bookings.find(b => b.id === supportForm.bookingId)?.customerEmail,
      };

      const response = await loggedFetch('https://apimatrimony.lytortech.com/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supportPayload),
      });

      if (response.ok) {
        toast({
          title: 'Support Request Sent',
          description: 'We will get back to you soon!',
        });
        setContactSupportOpen(false);
        setSupportForm({ subject: '', message: '', bookingId: null });
      } else {
        throw new Error('Failed to send support request');
      }
    } catch (error) {
      toast({
        title: 'Failed to Send Request',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[hsl(36,33%,97%)] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[hsl(142,76%,25%)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[hsl(24,30%,15%)] font-medium">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[hsl(36,33%,97%)] to-white flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-display font-semibold text-[hsl(24,30%,15%)] mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-[hsl(24,15%,45%)] mb-6">{error}</p>
          <button
            onClick={fetchBookings}
            className="bg-[hsl(142,76%,25%)] text-white px-6 py-3 rounded-lg hover:bg-[hsl(142,76%,20%)] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(36,33%,97%)] to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[hsl(142,76%,25%)] to-[hsl(142,76%,35%)] text-white py-8 md:py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold mb-2 md:mb-4">
            My Bookings
          </h1>
          <p className="text-sm md:text-lg opacity-90">
            Manage and track all your camping reservations
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-8">
        <div className="bg-white rounded-xl shadow-md p-2 flex flex-wrap gap-2">
          {['all', 'confirmed', 'pending', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all text-sm md:text-base ${
                filter === tab
                  ? 'bg-[hsl(142,76%,25%)] text-white shadow-md'
                  : 'text-[hsl(24,30%,15%)] hover:bg-[hsl(36,20%,90%)]'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-[hsl(36,20%,90%)] rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-[hsl(24,15%,45%)]" />
            </div>
            <h3 className="text-2xl font-display font-semibold text-[hsl(24,30%,15%)] mb-2">
              No bookings found
            </h3>
            <p className="text-[hsl(24,15%,45%)] mb-8">
              {filter === 'all'
                ? "You haven't made any bookings yet"
                : `No ${filter} bookings available`}
            </p>
            <button 
              onClick={() => navigate('/booking')}
              className="bg-[hsl(142,76%,25%)] text-white px-8 py-3 rounded-lg hover:bg-[hsl(142,76%,20%)] transition-colors"
            >
              Book Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-[hsl(36,20%,85%)]"
              >
                <div className="p-6 md:p-8">
                  {/* Header Row */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-display font-semibold text-[hsl(24,30%,15%)]">
                          {booking.referenceNumber}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(booking.bookingStatus)}`}>
                          {getStatusIcon(booking.bookingStatus)}
                          {booking.bookingStatus}
                        </span>
                      </div>
                      <p className="text-[hsl(24,15%,45%)] text-sm">
                        Booked on {formatDate(booking.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[hsl(24,15%,45%)] mb-1">Total Amount</p>
                      <p className="text-3xl font-bold text-[hsl(142,76%,25%)]">
                        ₹{booking.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[hsl(142,76%,25%)]/10 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-[hsl(142,76%,25%)]" />
                        </div>
                        <div>
                          <p className="text-sm text-[hsl(24,15%,45%)]">Check-in</p>
                          <p className="font-semibold text-[hsl(24,30%,15%)]">
                            {formatDate(booking.bookingDate)} at 4:00 PM
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[hsl(142,76%,25%)]/10 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-[hsl(142,76%,25%)]" />
                        </div>
                        <div>
                          <p className="text-sm text-[hsl(24,15%,45%)]">Check-out</p>
                          <p className="font-semibold text-[hsl(24,30%,15%)]">
                            {formatDate(new Date(new Date(booking.bookingDate).getTime() + 24 * 60 * 60 * 1000))} at 9:00 AM
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[hsl(142,76%,25%)]/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-[hsl(142,76%,25%)]" />
                        </div>
                        <div>
                          <p className="text-sm text-[hsl(24,15%,45%)]">Tent Numbers</p>
                          <div className="flex flex-wrap gap-2 mt-1">
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

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[hsl(142,76%,25%)]/10 flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-[hsl(142,76%,25%)]" />
                        </div>
                        <div>
                          <p className="text-sm text-[hsl(24,15%,45%)]">Number of Guests</p>
                          <p className="font-semibold text-[hsl(24,30%,15%)]">
                            {booking.numberOfGuests} {booking.numberOfGuests === 1 ? 'Guest' : 'Guests'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-[hsl(36,33%,97%)] rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-[hsl(24,30%,15%)] mb-3 flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Payment Details
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-[hsl(24,15%,45%)]">Advance Paid</span>
                            <span className="font-semibold text-[hsl(24,30%,15%)]">
                              ₹{booking.advanceAmount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-[hsl(24,15%,45%)]">Remaining</span>
                            <span className="font-semibold text-[hsl(24,30%,15%)]">
                              ₹{booking.remainingAmount.toLocaleString()}
                            </span>
                          </div>
                          <div className="pt-2 border-t border-[hsl(36,20%,85%)]">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-[hsl(24,15%,45%)]">Payment Status</span>
                              <span className={`font-semibold text-sm ${getPaymentStatusColor(booking.paymentStatus)}`}>
                                {booking.paymentStatus.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-[hsl(36,20%,85%)]">
                    {booking.bookingStatus === 'CONFIRMED' && (
                      <Button
                        onClick={() => handleViewDetails(booking)}
                        className="flex-1 min-w-[150px] bg-[hsl(142,76%,25%)] text-white px-6 py-3 rounded-lg hover:bg-[hsl(142,76%,20%)] transition-colors font-medium"
                      >
                        View Details
                      </Button>
                    )}
                    <Button
                      onClick={() => window.location.href = '/#contact'}
                      variant="outline"
                      className="px-6 py-3 border-2 border-[hsl(36,20%,85%)] text-[hsl(24,30%,15%)] rounded-lg hover:bg-[hsl(36,20%,90%)] transition-colors font-medium"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
