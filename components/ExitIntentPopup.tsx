import React, { useState, useEffect } from 'react';
import { trackCTAClick, trackExitIntent } from './AnalyticsTracker.tsx';

interface ExitIntentPopupProps {
    onClose: () => void;
    onPurchaseClick: () => void;
}

export const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({ onClose, onPurchaseClick }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0) {
                setIsVisible(true);
                trackExitIntent();
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-[#1A0F3C] to-[#0F0A2A] border border-[#DAFF00]/30 rounded-xl p-6 sm:p-8 max-w-md w-full relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Content */}
                <div className="text-center">
                    <div className="text-4xl mb-4">⏰</div>
                    <h3 className="text-2xl font-bold text-[#DAFF00] mb-4">Wait! Don't Miss Out!</h3>
                    <p className="text-purple-200/80 mb-6">
                        You're about to leave without getting VidScriptHub. This special launch price of $27 
                        won't last long!
                    </p>
                    
                    <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4 mb-6">
                        <div className="text-red-400 font-bold text-lg mb-2">Limited Time Offer</div>
                        <div className="text-white text-sm">
                            Regular Price: <span className="line-through">$497</span><br/>
                            Your Price: <span className="text-[#DAFF00] font-bold">$27</span>
                        </div>
                    </div>

                    <a href="https://warriorplus.com/o2/buy/kyd6mp/lk95h4/cn135b">
                        <img src="https://warriorplus.com/o2/btn/fn060011001/kyd6mp/lk95h4/445947?ct2=GET%20INSTANT%20ACCESS%20NOW&v=1" 
                             onClick={() => trackCTAClick('exit_intent_popup_purchase_button', 'exit_intent_popup', 27)}
                             className="w-full mb-4" />
                    </a>

                    <p className="text-xs text-purple-300/70">
                        ⚡ Instant Access • 🔒 Secure Payment • 💯 30-Day Guarantee
                    </p>
                </div>
            </div>
        </div>
    );
};