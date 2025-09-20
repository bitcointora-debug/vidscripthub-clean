import React, { useState, useEffect } from 'react';
import { trackCTAClick } from './AnalyticsTracker.tsx';

interface StickyDiscountBarProps {
  onDiscountClick?: (couponCode: string) => void;
  trigger?: 'scroll' | 'time' | 'exit-intent' | 'behavioral';
  delay?: number;
  scrollThreshold?: number;
  discountPercentage?: number;
  couponCode?: string;
}

export const StickyDiscountBar: React.FC<StickyDiscountBarProps> = ({
  onDiscountClick,
  trigger = 'scroll',
  delay = 30000, // 30 seconds
  scrollThreshold = 30, // 30% scroll
  discountPercentage = 10,
  couponCode = 'SAVE10NOW'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes countdown
  const [hasSeenOffer, setHasSeenOffer] = useState(false);

  useEffect(() => {
    // Check if user has already seen this offer today
    const today = new Date().toDateString();
    const lastSeen = localStorage.getItem('discount_bar_seen');
    if (lastSeen === today) {
      setHasSeenOffer(true);
      return;
    }

    if (trigger === 'exit-intent') {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0 && !hasSeenOffer) {
          setIsVisible(true);
          trackCTAClick('exit_intent_discount_bar', 'sticky_discount', discountPercentage);
        }
      };

      document.addEventListener('mouseleave', handleMouseLeave);
      return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }

    if (trigger === 'scroll') {
      const handleScroll = () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent >= scrollThreshold && !hasSeenOffer) {
          setIsVisible(true);
          trackCTAClick('scroll_discount_bar', 'sticky_discount', discountPercentage);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }

    if (trigger === 'time') {
      const timer = setTimeout(() => {
        if (!hasSeenOffer) {
          setIsVisible(true);
          trackCTAClick('time_discount_bar', 'sticky_discount', discountPercentage);
        }
      }, delay);

      return () => clearTimeout(timer);
    }

    if (trigger === 'behavioral') {
      // Show after user interacts with pricing section
      const handlePricingInteraction = () => {
        if (!hasSeenOffer) {
          setTimeout(() => {
            setIsVisible(true);
            trackCTAClick('behavioral_discount_bar', 'sticky_discount', discountPercentage);
          }, 2000);
        }
      };

      // Listen for clicks on pricing elements
      const pricingElements = document.querySelectorAll('[data-pricing]');
      pricingElements.forEach(el => {
        el.addEventListener('click', handlePricingInteraction);
      });

      return () => {
        pricingElements.forEach(el => {
          el.removeEventListener('click', handlePricingInteraction);
        });
      };
    }
  }, [trigger, delay, scrollThreshold, hasSeenOffer, discountPercentage]);

  // Countdown timer
  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClaimDiscount = () => {
    // Mark as seen today
    localStorage.setItem('discount_bar_seen', new Date().toDateString());
    
    // Track conversion
    trackCTAClick('discount_bar_claim', 'sticky_discount', discountPercentage);
    
    // Call callback
    onDiscountClick?.(couponCode);
    
    // Hide the bar
    setIsVisible(false);
    
    // Track in Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'discount_claimed', {
        event_category: 'conversion',
        event_label: couponCode,
        value: discountPercentage
      });
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
  };

  if (!isVisible || hasSeenOffer) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
      isMinimized ? 'transform translate-y-full' : 'transform translate-y-0'
    }`}>
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white shadow-2xl">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Offer details */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="bg-white/20 rounded-full p-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-lg">
                    🔥 {discountPercentage}% OFF - Limited Time!
                  </div>
                  <div className="text-sm opacity-90">
                    Use code: <span className="font-mono font-bold bg-white/20 px-2 py-1 rounded">{couponCode}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center - Countdown timer */}
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-xs opacity-80">Offer expires in:</div>
                <div className="font-mono font-bold text-lg bg-white/20 px-3 py-1 rounded">
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleClaimDiscount}
                className="bg-white text-red-600 font-bold px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                CLAIM {discountPercentage}% OFF
              </button>
              
              <button
                onClick={handleMinimize}
                className="text-white/80 hover:text-white p-1"
                title="Minimize"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Minimized state - small floating button */}
      {isMinimized && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={handleMaximize}
            className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors animate-pulse"
            title="Show discount offer"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

// Advanced discount bar with multiple offers
export const AdvancedDiscountBar: React.FC = () => {
  const [currentOffer, setCurrentOffer] = useState(0);
  
  const offers = [
    {
      percentage: 10,
      code: 'SAVE10NOW',
      message: '🔥 10% OFF - Limited Time!',
      urgency: 'high'
    },
    {
      percentage: 15,
      code: 'VIP15OFF',
      message: '💎 VIP 15% OFF - Exclusive!',
      urgency: 'medium'
    },
    {
      percentage: 20,
      code: 'MEGA20',
      message: '🚀 MEGA 20% OFF - Flash Sale!',
      urgency: 'high'
    }
  ];

  const handleDiscountClick = (couponCode: string) => {
    // Apply discount logic
    console.log('Applying discount:', couponCode);
    
    // Redirect to checkout with discount
    window.location.href = `https://vidscripthub.com/checkout?discount=${couponCode}`;
  };

  return (
    <StickyDiscountBar
      trigger="behavioral"
      discountPercentage={offers[currentOffer].percentage}
      couponCode={offers[currentOffer].code}
      onDiscountClick={handleDiscountClick}
    />
  );
};






