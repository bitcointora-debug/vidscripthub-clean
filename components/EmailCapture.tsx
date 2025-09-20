import React, { useState, useEffect } from 'react';
import { trackCTAClick } from './AnalyticsTracker.tsx';
import { LeadMagnetGenerator } from './LeadMagnetGenerator.tsx';

interface EmailCaptureProps {
  onEmailCaptured?: (email: string, name: string) => void;
  trigger?: 'exit-intent' | 'scroll' | 'time' | 'manual';
  delay?: number;
  scrollThreshold?: number;
}

export const EmailCapture: React.FC<EmailCaptureProps> = ({
  onEmailCaptured,
  trigger = 'manual',
  delay = 30000, // 30 seconds
  scrollThreshold = 70 // 70% scroll
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showLeadMagnet, setShowLeadMagnet] = useState(false);
  const [capturedEmail, setCapturedEmail] = useState('');
  const [capturedName, setCapturedName] = useState('');

  // Check if popup was previously closed
  const checkIfClosed = () => {
    const closed = localStorage.getItem('email_capture_closed');
    const closedTime = localStorage.getItem('email_capture_closed_time');
    
    if (closed && closedTime) {
      const timeDiff = Date.now() - parseInt(closedTime);
      // Show again after 24 hours
      return timeDiff < 24 * 60 * 60 * 1000;
    }
    return false;
  };

  useEffect(() => {
    // Don't show if user closed it recently
    if (checkIfClosed()) {
      return;
    }

    if (trigger === 'exit-intent') {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0 && !checkIfClosed()) {
          setIsVisible(true);
          trackCTAClick('exit_intent_email_capture', 'email_capture', 0);
        }
      };

      document.addEventListener('mouseleave', handleMouseLeave);
      return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }

    if (trigger === 'scroll') {
      const handleScroll = () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent >= scrollThreshold && !checkIfClosed()) {
          setIsVisible(true);
          trackCTAClick('scroll_email_capture', 'email_capture', 0);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }

    if (trigger === 'time') {
      const timer = setTimeout(() => {
        if (!checkIfClosed()) {
          setIsVisible(true);
          trackCTAClick('time_email_capture', 'email_capture', 0);
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [trigger, delay, scrollThreshold]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      if (!name.trim()) {
        throw new Error('Please enter your name');
      }

      // Send email via Netlify function
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name: name.trim(),
          type: 'welcome'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      const result = await response.json();
      
      if (result.success) {
        setCapturedEmail(email);
        setCapturedName(name.trim());
        setShowLeadMagnet(true);
        trackCTAClick('email_capture_success', 'email_capture', 0);
        onEmailCaptured?.(email, name.trim());
        
        // Track conversion in Google Analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'email_capture', {
            event_category: 'engagement',
            event_label: 'email_signup',
            value: 1
          });
        }
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      trackCTAClick('email_capture_error', 'email_capture', 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setEmail('');
    setName('');
    setError('');
    setIsSuccess(false);
    
    // Store close state in localStorage
    localStorage.setItem('email_capture_closed', 'true');
    localStorage.setItem('email_capture_closed_time', Date.now().toString());
    
    // Track close event
    trackCTAClick('email_capture_closed', 'email_capture', 0);
  };

  if (!isVisible) return null;

  // Show lead magnet if email was captured successfully
  if (showLeadMagnet) {
    return (
      <LeadMagnetGenerator
        onClose={() => {
          setShowLeadMagnet(false);
          setIsVisible(false);
        }}
        userEmail={capturedEmail}
        userName={capturedName}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-[#1A0F3C] to-[#0F0A2A] border border-purple-500/30 rounded-xl shadow-2xl p-8 max-w-md w-full text-center relative animate-scaleIn">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-purple-300 hover:text-[#DAFF00] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        {isSuccess ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#DAFF00] mb-4">
              Welcome to VidScriptHub! 🎉
            </h2>
            <p className="text-purple-200/80 mb-6">
              Check your email for your welcome message and get ready to create viral content!
            </p>
            <button
              onClick={handleClose}
              className="bg-gradient-to-r from-[#DAFF00] to-[#B8E600] text-[#1A0F3C] font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Get Started Now!
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-[#DAFF00] mb-4">
              Get Your FREE Viral Script! 🎁
            </h2>
            <p className="text-purple-200/80 mb-4">
              <strong>Worth $97 - Yours FREE!</strong><br/>
              Get a complete viral script template with hook, problem, solution, proof, and call-to-action.
            </p>
            <div className="bg-gradient-to-r from-[#DAFF00]/20 to-transparent border border-[#DAFF00]/30 rounded-lg p-3 mb-6">
              <p className="text-sm text-[#DAFF00] font-semibold">
                ✨ Instant Access • 📱 Mobile Optimized • 🎯 Platform Ready
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-[#0F0A2A] border border-purple-500/30 rounded-lg text-white placeholder-purple-300/60 focus:outline-none focus:border-[#DAFF00] transition-colors"
                  required
                />
              </div>
              
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email Address"
                  className="w-full px-4 py-3 bg-[#0F0A2A] border border-purple-500/30 rounded-lg text-white placeholder-purple-300/60 focus:outline-none focus:border-[#DAFF00] transition-colors"
                  required
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#DAFF00] to-[#B8E600] text-[#1A0F3C] font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Generating...' : 'Get My FREE Script Now! 🚀'}
              </button>
            </form>

            <p className="text-xs text-purple-300/70 mt-4">
              🔒 We respect your privacy. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

// Email capture trigger component
export const EmailCaptureTrigger: React.FC<{ onTrigger: () => void }> = ({ onTrigger }) => {
  return (
    <div className="bg-gradient-to-r from-[#1A0F3C] to-transparent border border-purple-500/20 rounded-xl p-6 mb-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-[#DAFF00] mb-4">
          Ready to Go Viral? 🚀
        </h3>
        <p className="text-purple-200/80 mb-6">
          Get your first viral script in 37 seconds. Join thousands of creators who are already dominating their niches.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h4 className="font-bold text-white">37 Seconds</h4>
            <p className="text-purple-200/80 text-sm">To generate your script</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h4 className="font-bold text-white">AI-Powered</h4>
            <p className="text-purple-200/80 text-sm">Google-trained algorithms</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">📈</div>
            <h4 className="font-bold text-white">Proven Results</h4>
            <p className="text-purple-200/80 text-sm">10,000+ creators</p>
          </div>
        </div>

        <button
          onClick={() => {
            trackCTAClick('email_capture_trigger', 'email_capture', 0);
            onTrigger();
          }}
          className="bg-gradient-to-r from-[#DAFF00] to-[#B8E600] text-[#1A0F3C] font-bold py-4 px-8 rounded-xl shadow-[0_8px_0px_0px_#a8c400] hover:translate-y-1 hover:shadow-[0_6px_0px_0px_#a8c400] transition-all duration-150 ease-in-out"
        >
          Get My Free Viral Script Now!
        </button>
      </div>
    </div>
  );
};
