import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
    targetDate: Date;
    onComplete?: () => void;
    className?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
    targetDate,
    onComplete,
    className = ''
}) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance > 0) {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                setIsExpired(true);
                if (onComplete) onComplete();
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate, onComplete]);

    if (isExpired) {
        return (
            <div className={`text-center ${className}`}>
                <div className="text-red-400 font-bold text-xl">OFFER EXPIRED!</div>
            </div>
        );
    }

    return (
        <div className={`${className}`}>
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
                <div className="bg-red-600/30 border border-red-500/50 rounded-lg p-2 sm:p-3 text-center">
                    <div className="text-lg sm:text-2xl font-bold text-white">{timeLeft.days}</div>
                    <div className="text-xs sm:text-sm text-red-200">Days</div>
                </div>
                <div className="bg-red-600/30 border border-red-500/50 rounded-lg p-2 sm:p-3 text-center">
                    <div className="text-lg sm:text-2xl font-bold text-white">{timeLeft.hours}</div>
                    <div className="text-xs sm:text-sm text-red-200">Hours</div>
                </div>
                <div className="bg-red-600/30 border border-red-500/50 rounded-lg p-2 sm:p-3 text-center">
                    <div className="text-lg sm:text-2xl font-bold text-white">{timeLeft.minutes}</div>
                    <div className="text-xs sm:text-sm text-red-200">Minutes</div>
                </div>
                <div className="bg-red-600/30 border border-red-500/50 rounded-lg p-2 sm:p-3 text-center">
                    <div className="text-lg sm:text-2xl font-bold text-white">{timeLeft.seconds}</div>
                    <div className="text-xs sm:text-sm text-red-200">Seconds</div>
                </div>
            </div>
        </div>
    );
};






