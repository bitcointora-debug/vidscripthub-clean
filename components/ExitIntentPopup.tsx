
import React, { useState, useEffect } from 'react';

const CountdownUnit = ({ value, label }: { value: string; label: string }) => (
    <div className="flex flex-col items-center leading-none">
        <span className="text-3xl md:text-4xl font-bold">{value}</span>
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
    </div>
);

interface ExitIntentPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onAcceptOffer: () => void;
}

export const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({ isOpen, onClose, onAcceptOffer }) => {
    const [secondsLeft, setSecondsLeft] = useState(15 * 60); // 15 minutes

    useEffect(() => {
        if (!isOpen) return;

        setSecondsLeft(15 * 60); // Reset timer when opened

        const interval = setInterval(() => {
            setSecondsLeft(seconds => (seconds > 0 ? seconds - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [isOpen]);

    if (!isOpen) return null;

    const formatTime = (totalSeconds: number) => {
        if (totalSeconds <= 0) return { hours: '00', minutes: '00', seconds: '00' };
        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return { hours, minutes, seconds };
    };

    const { hours, minutes, seconds } = formatTime(secondsLeft);

    const handleAcceptAndClose = () => {
        onAcceptOffer();
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-intent-title"
        >
            <div 
                className="bg-yellow-400 rounded-xl border-4 border-black w-full max-w-2xl text-black relative shadow-2xl shadow-black/50 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button onClick={onClose} className="absolute -top-3 -right-3 w-8 h-8 bg-black rounded-full text-white font-bold text-xl border-2 border-yellow-400 hover:scale-110 transition-transform z-10" aria-label="Close popup">&times;</button>
                
                {/* Main Content */}
                <div className="p-8 text-center">
                    <h1 id="exit-intent-title" className="text-5xl md:text-6xl font-extrabold" style={{ fontFamily: "'Poppins', sans-serif" }}>WAIT! HOLD UP!!</h1>
                    <div className="bg-red-600 text-white font-bold text-xl py-2 my-4 flex items-center justify-center gap-2">
                        <i className="fa-solid fa-hand"></i>
                        DON'T LEAVE YET!
                    </div>

                    <p className="text-lg font-medium">Use Coupon <b className="bg-black text-yellow-400 px-2 py-1 rounded">"SAVE5"</b> Get <b className="text-red-600">$5 OFF</b> Instantly!</p>
                    <p className="font-semibold text-red-700">(EARLY BIRD SPECIAL - EXPIRES Soon, Hurry!)</p>
                    
                    <button
                        onClick={handleAcceptAndClose}
                        className="block w-full bg-green-600 text-white font-bold text-xl md:text-2xl uppercase py-4 px-6 rounded-lg shadow-[0_5px_0px_0px_#15803d] hover:translate-y-1 hover:shadow-[0_4px_0px_0px_#15803d] transition-all duration-150 ease-in-out my-6"
                    >
                       GRAB VID SCRIPT HUB NOW!
                       <i className="fa-solid fa-cart-shopping ml-3"></i>
                    </button>

                    <a href="#" onClick={(e) => { e.preventDefault(); handleAcceptAndClose(); }} className="text-purple-800 font-bold hover:underline">*Get Unlimited Version (90% Buy This)</a>
                </div>

                {/* Upsell Details */}
                <div className="bg-gray-100 p-6">
                    <p className="text-sm text-gray-800 leading-relaxed">
                        Get <b>Premium Support</b> + <b>UNLIMITED Video Scripts</b> + <b>UNLIMITED SEO Optimisations</b> Per Month + <b>High Priority</b> Rendering + <b>FASTER</b> Downloads + <b>Additional</b> AI Voices + <b>Additional</b> 50 Million Stock Data + <b>34,092 Buyers List CASE STUDY</b>, 10X More Profitable, 10X Cheaper + <b>AFFILIATE PROFITS CLUB</b> Membership + <b>Traffic Accelerator</b> Training!
                    </p>
                    <p className="mt-4 font-bold text-center">
                        <span className="text-red-600">All these Costs $97/m But Now Only For $67.00 (1st 50 Buyers Only)</span>
                    </p>
                    <button
                        onClick={handleAcceptAndClose}
                        className="block w-full bg-red-600 text-white font-bold text-lg md:text-xl uppercase py-4 px-6 rounded-lg shadow-[0_5px_0px_0px_#b91c1c] hover:translate-y-1 hover:shadow-[0_4px_0px_0px_#b91c1c] transition-all duration-150 ease-in-out mt-4"
                    >
                       GET UNLIMITED VERSION HERE!
                       <i className="fa-solid fa-cart-shopping ml-3"></i>
                    </button>
                </div>

                {/* Countdown Timer */}
                <div className="bg-red-600 text-white p-4">
                    <p className="font-bold text-lg mb-2">COUPON CODE EXPIRES IN:</p>
                     <div className="flex items-center justify-center space-x-3 md:space-x-4">
                        <CountdownUnit value={hours} label="Hours" />
                        <span className="text-3xl md:text-4xl font-bold">:</span>
                        <CountdownUnit value={minutes} label="Mins" />
                        <span className="text-3xl md:text-4xl font-bold">:</span>
                        <CountdownUnit value={seconds} label="Secs" />
                    </div>
                </div>
            </div>
        </div>
    );
};
