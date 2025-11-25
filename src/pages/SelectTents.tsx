import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import { ArrowLeft, Check, Calendar, Tent, User, CreditCard, X, Users, Info } from 'lucide-react';
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
                    className={`text-xs ${
                      isActive ? 'text-primary font-semibold' : isCompleted ? 'text-primary' : 'text-muted-foreground'
                    }`}
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


const BookingInfoModal = ({
  isOpen,
  onClose,
  checkInDate,
}: {
  isOpen: boolean;
  onClose: () => void;
  checkInDate: string;
}) => {
  const [language, setLanguage] = useState<'english' | 'telugu' | 'hindi'>('english');
  const [guestCount, setGuestCount] = useState('1');
  const [guestNotes, setGuestNotes] = useState('');


  const translations = {
    english: {
      title: 'How Tent Booking Works',
      subtitle: 'Important Information',
      guestSelection: 'Number of Guests',
      guestNotesLabel: 'Additional Information (Optional)',
      guestNotesPlaceholder: 'Enter any special requirements, dietary restrictions, accessibility needs, etc.',
      tentDistribution: 'Tent Distribution',
      basedOnGuests: 'Based on your guest count, you will likely need:',
      paymentTitle: 'Payment Structure',
      advancePayment: 'Advance Payment: 50% online (to confirm booking)',
      balancePayment: 'Balance Payment: 50% at check-in',
      flexibilityTitle: 'Flexible Occupancy',
      flexibilityDesc: 'You book tents, not exact guest count. If actual guests differ, you pay for occupied tents only:',
      flexibilityExample: '2 people in one tent: Pay reduced rate',
      pricingTitle: 'Pricing for Your Selected Date',
      closeButton: 'Got it!',
      languages: 'Languages:',
      nov: 'November (All Days)',
      dec: 'December',
      jan: 'January 2026',
      people3: '3 People',
      people2: '2 People',
      monthToThurs: 'Mon-Thu',
      friToSun: 'Fri-Sun',
      premiumDates: 'Premium Dates',
      tent: 'Tent',
      people: 'people',
    },
    telugu: {
      title: 'టెంట్ బుకింగ్ ఎలా పనిచేస్తుంది',
      subtitle: 'ముఖ్యమైన సమాచారం',
      guestSelection: 'అతిథుల సంఖ్య',
      guestNotesLabel: 'అదనపు సమాచారం (ఐచ్ఛికం)',
      guestNotesPlaceholder: 'ప్రత్యేక అవసరాలు, ఆహార పరిమితులు, ప్రాప్యత అవసరాలు మొదలైనవి నమోదు చేయండి.',
      tentDistribution: 'టెంట్ల పంపిణీ',
      basedOnGuests: 'మీ అతిథుల సంఖ్య ఆధారంగా, మీకు కావాలి:',
      paymentTitle: 'చెల్లింపు నిర్మాణం',
      advancePayment: 'అడ్వాన్స్ చెల్లింపు: 50% ఆన్‌లైన్ (బుకింగ్ నిర్ధారించడానికి)',
      balancePayment: 'బ్యాలెన్స్ చెల్లింపు: 50% చెక్-ఇన్ సమయంలో',
      flexibilityTitle: 'సౌకర్యవంతమైన నివాసం',
      flexibilityDesc: 'మీరు టెంట్లను బుక్ చేస్తారు, ఖచ్చితమైన అతిథుల సంఖ్య కాదు. అసలు అతిథులు వేరుగా ఉంటే, ఆక్రమించిన టెంట్లకు మాత్రమే చెల్లిస్తారు:',
      flexibilityExample: 'ఒక టెంట్‌లో 2 మంది: తగ్గిన రేటు చెల్లించండి',
      pricingTitle: 'మీరు ఎంచుకున్న తేదీకి ధరలు',
      closeButton: 'అర్థమైంది!',
      languages: 'భాషలు:',
      nov: 'నవంబర్ (అన్ని రోజులు)',
      dec: 'డిసెంబర్',
      jan: 'జనవరి 2026',
      people3: '3 మంది',
      people2: '2 మంది',
      monthToThurs: 'సోమ-గురు',
      friToSun: 'శుక్ర-ఆది',
      premiumDates: 'ప్రీమియం తేదీలు',
      tent: 'టెంట్',
      people: 'మంది',
    },
    hindi: {
      title: 'टेंट बुकिंग कैसे काम करती है',
      subtitle: 'महत्वपूर्ण जानकारी',
      guestSelection: 'मेहमानों की संख्या',
      guestNotesLabel: 'अतिरिक्त जानकारी (वैकल्पिक)',
      guestNotesPlaceholder: 'विशेष आवश्यकताएं, आहार प्रतिबंध, पहुंच की जरूरतें आदि दर्ज करें।',
      tentDistribution: 'टेंट वितरण',
      basedOnGuests: 'आपकी मेहमान संख्या के आधार पर, आपको चाहिए:',
      paymentTitle: 'भुगतान संरचना',
      advancePayment: 'अग्रिम भुगतान: 50% ऑनलाइन (बुकिंग की पुष्टि के लिए)',
      balancePayment: 'शेष भुगतान: 50% चेक-इन के समय',
      flexibilityTitle: 'लचीली अधिभोग',
      flexibilityDesc: 'आप टेंट बुक करते हैं, सटीक मेहमानों की संख्या नहीं। यदि वास्तविक मेहमान भिन्न हैं, तो आप उपयोग किए गए टेंट के लिए ही भुगतान करते हैं:',
      flexibilityExample: 'एक टेंट में 2 लोग: कम दर का भुगतान करें',
      pricingTitle: 'आपकी चयनित तिथि के लिए मूल्य निर्धारण',
      closeButton: 'समझ गया!',
      languages: 'भाषाएँ:',
      nov: 'नवंबर (सभी दिन)',
      dec: 'दिसंबर',
      jan: 'जनवरी 2026',
      people3: '3 लोग',
      people2: '2 लोग',
      monthToThurs: 'सोम-गुरु',
      friToSun: 'शुक्र-रवि',
      premiumDates: 'प्रीमियम तिथियां',
      tent: 'टेंट',
      people: 'लोग',
    },
  };


  const t = translations[language];


  const handleGuestCountChange = (value: string) => {
    // Allow empty string or numbers only
    if (value === '' || /^\d+$/.test(value)) {
      setGuestCount(value);
    }
  };


  const getGuestCountNumber = (): number => {
    const num = parseInt(guestCount);
    if (isNaN(num) || num < 1) return 1;
    if (num > 30) return 30;
    return num;
  };


  const getPricingForDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth();
    const day = date.getDate();
    const dayOfWeek = date.getDay();
    const year = date.getFullYear();


    if (month === 10) {
      return {
        month: t.nov,
        pricing: [
          { guests: t.people3, price: '₹999' },
          { guests: t.people2, price: '₹799' },
        ],
      };
    }


    if (month === 11) {
      const premiumDays = [6, 13, 20, 24, 25, 27, 30, 31];
      const isPremium = premiumDays.includes(day);
      const isFriSatSun = dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;


      if (isPremium) {
        return {
          month: `${t.dec} (${t.premiumDates}: 6, 13, 20, 24, 25, 27, 30, 31)`,
          pricing: [
            { guests: t.people3, price: '₹1499' },
            { guests: t.people2, price: '₹999' },
          ],
        };
      } else if (isFriSatSun) {
        return {
          month: `${t.dec} (${t.friToSun})`,
          pricing: [
            { guests: t.people3, price: '₹1499' },
            { guests: t.people2, price: '₹999' },
          ],
        };
      } else {
        return {
          month: `${t.dec} (${t.monthToThurs})`,
          pricing: [
            { guests: t.people3, price: '₹999' },
            { guests: t.people2, price: '₹799' },
          ],
        };
      }
    }


    if (month === 0 && year === 2026) {
      const premiumDays = [2, 3, 4, 10, 17, 24, 31];
      const isPremium = premiumDays.includes(day);


      if (isPremium) {
        return {
          month: `${t.jan} (${t.premiumDates}: 2, 3, 4, 10, 17, 24, 31)`,
          pricing: [
            { guests: t.people3, price: '₹1499' },
            { guests: t.people2, price: '₹999' },
          ],
        };
      } else {
        return {
          month: `${t.jan}`,
          pricing: [
            { guests: t.people3, price: '₹999' },
            { guests: t.people2, price: '₹799' },
          ],
        };
      }
    }


    return {
      month: 'Standard Days',
      pricing: [
        { guests: t.people3, price: '₹999' },
        { guests: t.people2, price: '₹799' },
      ],
    };
  };


  const getTentDistribution = (guests: number) => {
    const tents = Math.ceil(guests / 3);
    const dist: number[] = new Array(tents).fill(3);
    const totalAllocated = tents * 3;
    const difference = totalAllocated - guests;


    for (let i = tents - 1; i >= Math.max(0, tents - difference); i--) {
      dist[i] = Math.max(1, 3 - (difference - (tents - 1 - i)));
    }


    return dist;
  };


  const currentPricing = getPricingForDate(checkInDate);
  const tentDistribution = getTentDistribution(getGuestCountNumber());


  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />


          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-card rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-gradient-to-r from-primary to-primary-glow text-white p-6 rounded-t-2xl z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{t.title}</h2>
                  <p className="text-sm opacity-90">{t.subtitle}</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                  aria-label="Close"
                >
                  <X size={24} />
                </button>
              </div>


              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-sm opacity-90">{t.languages}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLanguage('english')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      language === 'english' ? 'bg-white text-primary' : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('telugu')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      language === 'telugu' ? 'bg-white text-primary' : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    తెలుగు
                  </button>
                  <button
                    onClick={() => setLanguage('hindi')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      language === 'hindi' ? 'bg-white text-primary' : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    हिंदी
                  </button>
                </div>
              </div>
            </div>


            <div className="p-6">
              <div className="mb-6">
                <label htmlFor="guestCount" className="block font-semibold mb-2 text-lg">
                  {t.guestSelection}
                </label>
                <input
                  id="guestCount"
                  type="text"
                  inputMode="numeric"
                  value={guestCount}
                  onChange={(e) => handleGuestCountChange(e.target.value)}
                  onBlur={() => {
                    // Ensure valid number on blur
                    if (guestCount === '' || parseInt(guestCount) < 1) {
                      setGuestCount('1');
                    } else if (parseInt(guestCount) > 30) {
                      setGuestCount('30');
                    }
                  }}
                  placeholder="Enter number of guests"
                  className="w-full rounded-lg border-2 border-primary/30 px-4 py-2 text-lg font-semibold focus:border-primary focus:outline-none"
                  aria-label="Guest Count"
                />
                <p className="text-xs text-muted-foreground mt-1">Maximum 30 guests</p>
              </div>


              <div className="mb-6">
                <label htmlFor="guestNotes" className="block font-semibold mb-2 text-base">
                  {t.guestNotesLabel}
                </label>
                <textarea
                  id="guestNotes"
                  value={guestNotes}
                  onChange={(e) => setGuestNotes(e.target.value)}
                  placeholder={t.guestNotesPlaceholder}
                  rows={3}
                  className="w-full rounded-lg border-2 border-primary/30 px-4 py-3 text-sm focus:border-primary focus:outline-none resize-none"
                  aria-label="Guest Notes"
                />
              </div>


              <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-5 rounded-xl border-2 border-purple-300 dark:border-purple-700">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Users size={24} className="text-purple-600 dark:text-purple-400" />
                  {t.tentDistribution}
                </h3>
                <p className="mb-4 text-sm">{t.basedOnGuests}</p>
                <div className="flex gap-3 flex-wrap">
                  {tentDistribution.map((count, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-purple-300 dark:border-purple-700 text-center min-w-[80px]"
                    >
                      <Tent className="mx-auto mb-2 text-purple-600 dark:text-purple-400" size={24} />
                      <div className="font-bold text-sm mb-1">
                        {t.tent} {idx + 1}
                      </div>
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {count} {t.people}
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              <div className="mb-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-5 rounded-xl border-2 border-green-300 dark:border-green-700">
                <h3 className="font-bold text-lg mb-3 text-green-900 dark:text-green-100 flex items-center gap-2">
                  <Calendar className="text-green-600 dark:text-green-400" size={24} />
                  {t.pricingTitle}
                </h3>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-sm font-semibold text-green-800 dark:text-green-200 mb-3">{currentPricing.month}</div>
                  <div className="grid grid-cols-2 gap-4">
                    {currentPricing.pricing.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-green-100 dark:bg-green-900/50 rounded-lg p-4 text-center border-2 border-green-300 dark:border-green-700"
                      >
                        <div className="text-xs text-green-700 dark:text-green-300 mb-1 font-semibold">{item.guests}</div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{item.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>


              <div className="mb-6 bg-orange-50 dark:bg-orange-950/30 p-5 rounded-xl border-2 border-orange-200 dark:border-orange-800">
                <h3 className="font-bold text-lg mb-3 text-orange-900 dark:text-orange-100 flex items-center gap-2">
                  <CreditCard className="text-orange-600 dark:text-orange-400" size={24} />
                  {t.paymentTitle}
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" size={20} />
                    <span className="text-sm text-orange-900 dark:text-orange-100">{t.advancePayment}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" size={20} />
                    <span className="text-sm text-orange-900 dark:text-orange-100">{t.balancePayment}</span>
                  </li>
                </ul>
              </div>


              <div className="mb-6 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 p-5 rounded-xl border-l-4 border-amber-500">
                <h3 className="font-bold text-lg mb-2 text-amber-900 dark:text-amber-100 flex items-center gap-2">
                  <Info className="text-amber-600 dark:text-amber-400" size={24} />
                  {t.flexibilityTitle}
                </h3>
                <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">{t.flexibilityDesc}</p>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border-2 border-amber-300 dark:border-amber-700">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">💡 {t.flexibilityExample}</p>
                </div>
              </div>


              <Button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow text-lg py-6"
                size="lg"
              >
                {t.closeButton}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


const SelectTents = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTents, setSelectedTents] = useState<string[]>([]);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [tents, setTents] = useState<Tent[]>([]);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [hasSeenInfo, setHasSeenInfo] = useState(false);


  const currentStep = 2;


  useEffect(() => {
    const data = localStorage.getItem('bookingData');
    if (!data) {
      navigate('/booking');
      return;
    }
    
    try {
      let parsed = JSON.parse(data) as BookingData;


      if (parsed?.availabilityData?.tents) {
        setTents(parsed.availabilityData.tents);


        const bookedCount = parsed.availabilityData.tents.filter((tent) => tent.status === 'BOOKED').length;
        
        parsed = {
          ...parsed,
          availabilityData: {
            ...parsed.availabilityData,
            bookedTents: bookedCount,
          },
        };
      }


      setBookingData(parsed);


      const seenInfo = sessionStorage.getItem('hasSeenTentInfo');
      if (!seenInfo) {
        setShowInfoModal(true);
      } else {
        setHasSeenInfo(true);
      }
    } catch (error) {
      console.error('Error parsing booking data:', error);
      navigate('/booking');
    }
  }, [navigate]);


  const handleCloseInfoModal = () => {
    setShowInfoModal(false);
    setHasSeenInfo(true);
    sessionStorage.setItem('hasSeenTentInfo', 'true');
  };


  const toggleTent = (tentNumber: string, status: string) => {
    if (status === 'BOOKED' || status === 'RESERVED') return;


    if (!hasSeenInfo && selectedTents.length === 0) {
      setShowInfoModal(true);
      return;
    }


    setSelectedTents((prev) =>
      prev.includes(tentNumber) ? prev.filter((t) => t !== tentNumber) : [...prev, tentNumber]
    );
  };


  const calculateTotal = (): Pricing => {
    if (!bookingData) return { subtotal: 0, tax: 0, total: 0, advance: 0, balance: 0, nights: 0 };


    if (bookingData.availabilityData?.totalAmountPerTent) {
      const perTentTotal = bookingData.availabilityData.totalAmountPerTent;
      const perTentAdvance = bookingData.availabilityData.advanceAmountPerTent || perTentTotal * 0.5;
      const perTentBalance = bookingData.availabilityData.remainingAmountPerTent || perTentTotal - perTentAdvance;


      return {
        subtotal: perTentTotal * selectedTents.length,
        tax: 0,
        total: perTentTotal * selectedTents.length,
        advance: perTentAdvance * selectedTents.length,
        balance: perTentBalance * selectedTents.length,
        nights: bookingData.availabilityData.nights,
      };
    }


    if (bookingData.availabilityData?.totalAmount) {
      return {
        subtotal: bookingData.availabilityData.totalAmount / 1.18,
        tax: bookingData.availabilityData.totalAmount - bookingData.availabilityData.totalAmount / 1.18,
        total: bookingData.availabilityData.totalAmount,
        advance: bookingData.availabilityData.advanceAmount || 0,
        balance: bookingData.availabilityData.remainingAmount || 0,
        nights: bookingData.availabilityData.nights,
      };
    }


    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const tentPrice = 2250;


    const subtotal = tentPrice * selectedTents.length * nights;
    const total = subtotal;
    const advance = total * 0.5;
    const balance = total - advance;


    return { subtotal, tax: 0, total, advance, balance, nights };
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


    const updatedTents = tents.map((tent) => {
      if (selectedTents.includes(tent.tentNumber)) {
        return { ...tent, status: 'BOOKED' };
      } else if (tent.status !== 'RESERVED') {
        return { ...tent, status: 'AVAILABLE' };
      }
      return tent;
    });


    const bookedCount = updatedTents.filter((tent) => tent.status === 'BOOKED').length;


    const updatedAvailabilityData = {
      ...bookingData!.availabilityData!,
      tents: updatedTents,
      bookedTents: bookedCount,
    };


    const updatedData: BookingData = {
      ...bookingData!,
      selectedTents,
      availabilityData: updatedAvailabilityData,
      pricing: calculateTotal(),
    };


    localStorage.setItem('bookingData', JSON.stringify(updatedData));
    setBookingData(updatedData);
    setTents(updatedTents);
    navigate('/booking/details');
  };


  const handleStepClick = (stepIndex: number) => {
    if (stepIndex === 1) navigate('/booking');
    if (stepIndex === 2) navigate('/booking/select-tents');
  };


  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading booking data...</p>
        </div>
      </div>
    );
  }


  const pricing = calculateTotal();


  return (
    <div className="min-h-screen bg-background">
      <Navigation />


      <BookingInfoModal isOpen={showInfoModal} onClose={handleCloseInfoModal} checkInDate={bookingData.checkIn} />


      <div className="pt-32 pb-24 container mx-auto px-4">
        <div className="max-w-4xl mx-auto mb-8">
          <ProgressStepper current={currentStep} onStepClick={handleStepClick} />
        </div>


        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => navigate('/booking')}>
              <ArrowLeft className="mr-2" size={18} />
              Back
            </Button>


            <Button variant="outline" onClick={() => setShowInfoModal(true)} className="flex items-center gap-2">
              <Info size={18} />
              Booking Info
            </Button>
          </div>


          <h1 className="font-display text-4xl font-bold mb-8">Select Your Tents</h1>


          {bookingData.availabilityData && (
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 mb-6 border border-primary/20">
              <h3 className="font-semibold text-lg mb-4">
                📊 Availability for{' '}
                {new Date(bookingData.checkIn).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-sm">
                    <strong>{bookingData.availabilityData.availableTents}</strong> Available
                  </span>
                </div>


                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span className="text-sm">
                    <strong>{bookingData.availabilityData.bookedTents}</strong> Booked
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Total: {bookingData.availabilityData.totalTents} tents in the resort
              </p>
            </div>
          )}


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
                              className={`w-12 h-12 rounded-full font-semibold transition-all duration-200 ${getColor()}`}
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


            <div>
              <div className="bg-card rounded-2xl shadow-soft p-6 sticky top-32">
                <h3 className="font-display text-xl font-bold mb-4">Your Selection</h3>


                <div className="space-y-3 pb-4 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tents Selected:</span>
                    <span className="font-semibold">
                      {selectedTents.length} {selectedTents.length > 0 && `(${selectedTents.join(', ')})`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Nights:</span>
                    <span className="font-semibold">{pricing.nights}</span>
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
                  <p className="text-xs text-muted-foreground mt-2">Pay advance online, balance at check-in</p>
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
