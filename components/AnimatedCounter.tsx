import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
    end: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
    end,
    duration = 2000,
    prefix = '',
    suffix = '',
    className = ''
}) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const counterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (counterRef.current) {
            observer.observe(counterRef.current);
        }

        return () => observer.disconnect();
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible) return;

        let startTime: number;
        const startCount = 0;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.floor(startCount + (end - startCount) * easeOutQuart);
            
            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isVisible, end, duration]);

    return (
        <div ref={counterRef} className={className}>
            {prefix}{count.toLocaleString()}{suffix}
        </div>
    );
};






