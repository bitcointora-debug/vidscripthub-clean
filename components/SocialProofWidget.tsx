import React, { useState, useEffect } from 'react';

interface SocialProofWidgetProps {
    className?: string;
}

export const SocialProofWidget: React.FC<SocialProofWidgetProps> = ({ className = '' }) => {
    const [recentPurchases, setRecentPurchases] = useState([
        { name: 'Sarah M.', location: 'Los Angeles, CA', time: '2 minutes ago', amount: '$27' },
        { name: 'Mike R.', location: 'New York, NY', time: '5 minutes ago', amount: '$27' },
        { name: 'Emma L.', location: 'London, UK', time: '8 minutes ago', amount: '$27' },
        { name: 'David K.', location: 'Toronto, CA', time: '12 minutes ago', amount: '$27' },
        { name: 'Lisa P.', location: 'Sydney, AU', time: '15 minutes ago', amount: '$27' },
    ]);

    const [viewersCount, setViewersCount] = useState(23);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Update time every minute
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        // Simulate new purchases every 2-5 minutes
        const purchaseInterval = setInterval(() => {
            const names = ['Alex', 'Maria', 'John', 'Sophie', 'Carlos', 'Anna', 'Tom', 'Nina'];
            const locations = ['Chicago, IL', 'Miami, FL', 'Seattle, WA', 'Denver, CO', 'Austin, TX', 'Portland, OR', 'Boston, MA', 'Phoenix, AZ'];
            
            const newPurchase = {
                name: `${names[Math.floor(Math.random() * names.length)]} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}.`,
                location: locations[Math.floor(Math.random() * locations.length)],
                time: 'Just now',
                amount: '$27'
            };

            setRecentPurchases(prev => [newPurchase, ...prev.slice(0, 4)]);
        }, Math.random() * 180000 + 120000); // 2-5 minutes

        // Simulate viewer count changes
        const viewerInterval = setInterval(() => {
            setViewersCount(prev => {
                const change = Math.floor(Math.random() * 6) - 3; // -3 to +3
                return Math.max(15, Math.min(35, prev + change));
            });
        }, 30000); // Every 30 seconds

        return () => {
            clearInterval(timeInterval);
            clearInterval(purchaseInterval);
            clearInterval(viewerInterval);
        };
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    };

    return (
        <div className={`bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-xl p-6 ${className}`}>
            <h3 className="text-xl font-bold text-green-400 mb-4 text-center">
                🔥 Live Activity Feed
            </h3>
            
            {/* Current Viewers */}
            <div className="text-center mb-6">
                <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                        {viewersCount} people viewing now
                    </div>
                    <div className="text-sm text-green-200/80">
                        Last updated: {formatTime(currentTime)}
                    </div>
                </div>
            </div>

            {/* Recent Purchases */}
            <div className="space-y-3">
                <h4 className="text-lg font-semibold text-green-300 text-center mb-4">
                    Recent Purchases
                </h4>
                {recentPurchases.map((purchase, index) => (
                    <div 
                        key={index}
                        className="bg-green-800/20 border border-green-500/20 rounded-lg p-3 flex items-center justify-between animate-fadeIn"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">
                                    {purchase.name.charAt(0)}
                                </span>
                            </div>
                            <div>
                                <div className="text-green-300 font-semibold text-sm">
                                    {purchase.name}
                                </div>
                                <div className="text-green-200/70 text-xs">
                                    {purchase.location}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-green-400 font-bold text-sm">
                                {purchase.amount}
                            </div>
                            <div className="text-green-200/70 text-xs">
                                {purchase.time}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Trust Indicators */}
            <div className="mt-6 pt-4 border-t border-green-500/20">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <div className="text-lg font-bold text-green-400">10,000+</div>
                        <div className="text-xs text-green-200/80">Happy Customers</div>
                    </div>
                    <div>
                        <div className="text-lg font-bold text-green-400">4.9/5</div>
                        <div className="text-xs text-green-200/80">Average Rating</div>
                    </div>
                </div>
            </div>

            {/* Security Badge */}
            <div className="mt-4 text-center">
                <div className="inline-flex items-center space-x-2 bg-green-600/20 border border-green-500/30 rounded-lg px-3 py-2">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                    </svg>
                    <span className="text-green-400 font-semibold text-sm">SSL Secured Checkout</span>
                </div>
            </div>
        </div>
    );
};






