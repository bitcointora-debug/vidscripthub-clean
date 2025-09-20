import React, { useState, useEffect } from 'react';
import { trackCTAClick } from './AnalyticsTracker.tsx';

interface ConversionOptimizerProps {
    onPurchaseClick: () => void;
}

export const ConversionOptimizer: React.FC<ConversionOptimizerProps> = ({ onPurchaseClick }) => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showStickyCTA, setShowStickyCTA] = useState(false);
    const [timeOnPage, setTimeOnPage] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            setScrollProgress(progress);
            
            // Show sticky CTA after 30% scroll
            setShowStickyCTA(progress > 30);
        };

        const handleTime = () => {
            setTimeOnPage(prev => prev + 1);
        };

        window.addEventListener('scroll', handleScroll);
        const timeInterval = setInterval(handleTime, 1000);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(timeInterval);
        };
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <>
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
                <div 
                    className="h-full bg-gradient-to-r from-[#DAFF00] to-[#B8E600] transition-all duration-300"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            {/* Sticky CTA */}
            {showStickyCTA && (
                <div className="fixed bottom-4 left-4 right-4 z-40 md:left-auto md:right-4 md:w-80">
                    <div className="bg-gradient-to-r from-[#1A0F3C] to-[#0F0A2A] border border-[#DAFF00]/30 rounded-xl p-4 shadow-2xl">
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-sm text-purple-200/80">
                                ⏰ Limited Time: <span className="text-[#DAFF00] font-bold">$27</span>
                            </div>
                            <div className="text-xs text-red-400">
                                {formatTime(timeOnPage)} on page
                            </div>
                        </div>
                        <a href="https://warriorplus.com/o2/buy/kyd6mp/lk95h4/cn135b">
                            <img src="https://warriorplus.com/o2/btn/fn060011001/kyd6mp/lk95h4/445947?ct2=GET%20INSTANT%20ACCESS%20NOW&v=1" 
                                 onClick={() => trackCTAClick('sticky_cta_purchase_button', 'sticky_cta', 27)}
                                 className="w-full" />
                        </a>
                        <div className="text-xs text-center text-purple-300/70 mt-2">
                            🔒 Secure • 💯 30-Day Guarantee
                        </div>
                    </div>
                </div>
            )}

            {/* Loss Aversion Section */}
            <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-xl p-6 mb-8">
                <h3 className="text-2xl font-bold text-red-400 mb-4 text-center">
                    ⚠️ What You'll Lose If You Don't Act Now
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-white text-sm font-bold">✗</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-red-300">Miss the $27 Launch Price</h4>
                                <p className="text-red-200/80 text-sm">Price doubles to $497 after launch</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-white text-sm font-bold">✗</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-red-300">Lose $171 Worth of Bonuses</h4>
                                <p className="text-red-200/80 text-sm">Bonuses disappear after launch</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-white text-sm font-bold">✗</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-red-300">Keep Struggling with Low Views</h4>
                                <p className="text-red-200/80 text-sm">Continue getting 200 views while others go viral</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-white text-sm font-bold">✗</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-red-300">Waste Hours on Content Creation</h4>
                                <p className="text-red-200/80 text-sm">Keep spending 6+ hours per video</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-white text-sm font-bold">✗</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-red-300">Miss Out on Viral Opportunities</h4>
                                <p className="text-red-200/80 text-sm">Watch competitors dominate your niche</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-white text-sm font-bold">✗</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-red-300">Lose Potential Revenue</h4>
                                <p className="text-red-200/80 text-sm">Miss out on monetization opportunities</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Authority & Credibility Section */}
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-6 mb-8">
                <h3 className="text-2xl font-bold text-blue-400 mb-4 text-center">
                    🏆 Why Trust VidScriptHub?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-white text-2xl">🔬</span>
                        </div>
                        <h4 className="font-bold text-blue-300 mb-2">Google-Powered AI</h4>
                        <p className="text-blue-200/80 text-sm">Uses the same algorithms that power Google's search results</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-white text-2xl">📊</span>
                        </div>
                        <h4 className="font-bold text-green-300 mb-2">Data-Driven Results</h4>
                        <p className="text-green-200/80 text-sm">Analyzes millions of viral videos to find winning patterns</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-white text-2xl">⚡</span>
                        </div>
                        <h4 className="font-bold text-purple-300 mb-2">Instant Results</h4>
                        <p className="text-purple-200/80 text-sm">Generate viral scripts in under 40 seconds</p>
                    </div>
                </div>
            </div>

            {/* Value Stacking Section */}
            <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-xl p-6 mb-8">
                <h3 className="text-2xl font-bold text-green-400 mb-4 text-center">
                    💰 Complete Value Breakdown
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-green-500/20">
                        <span className="text-green-200/80">Unlimited Viral Script Generation</span>
                        <span className="text-green-400 font-bold">$997</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-green-500/20">
                        <span className="text-green-200/80">Google-Powered AI Technology</span>
                        <span className="text-green-400 font-bold">$497</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-green-500/20">
                        <span className="text-green-200/80">Multi-Platform Script Adaptation</span>
                        <span className="text-green-400 font-bold">$297</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-green-500/20">
                        <span className="text-green-200/80">100% Unique Content Guarantee</span>
                        <span className="text-green-400 font-bold">$197</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-green-500/20">
                        <span className="text-green-200/80">37-Second Generation Speed</span>
                        <span className="text-green-400 font-bold">$97</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-green-500/20">
                        <span className="text-green-200/80">Profit-Ready Niche Database</span>
                        <span className="text-green-400 font-bold">$97</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-green-500/20">
                        <span className="text-green-200/80">Viral Monetization Blueprint</span>
                        <span className="text-green-400 font-bold">$47</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-green-500/20">
                        <span className="text-green-200/80">Ultimate Viral Hook Swipe File</span>
                        <span className="text-green-400 font-bold">$27</span>
                    </div>
                    <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-lg p-4 mt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-red-200 font-bold text-lg">Total Value:</span>
                            <span className="text-red-400 font-bold text-xl line-through">$2,257</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-[#DAFF00] font-bold text-lg">Your Price Today:</span>
                            <span className="text-[#DAFF00] font-bold text-2xl">$27</span>
                        </div>
                        <div className="text-center mt-3">
                            <span className="text-green-400 font-bold text-lg">You Save: $2,230 (99% OFF!)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Objection Handling Section */}
            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-6 mb-8">
                <h3 className="text-2xl font-bold text-purple-400 mb-4 text-center">
                    🤔 Common Concerns (And Our Answers)
                </h3>
                <div className="space-y-6">
                    <div className="bg-purple-800/20 border border-purple-500/20 rounded-lg p-4">
                        <h4 className="font-bold text-purple-300 mb-2">"What if the scripts don't work for my niche?"</h4>
                        <p className="text-purple-200/80 text-sm">
                            Our AI analyzes YOUR specific niche and creates scripts tailored to your audience. 
                            Plus, you get unlimited generations, so you can test different approaches until you find what works.
                        </p>
                    </div>
                    <div className="bg-purple-800/20 border border-purple-500/20 rounded-lg p-4">
                        <h4 className="font-bold text-purple-300 mb-2">"Is this just another generic AI tool?"</h4>
                        <p className="text-purple-200/80 text-sm">
                            No! VidScriptHub is specifically trained on viral video data and uses Google's algorithms 
                            to analyze what actually works. It's not generic - it's purpose-built for viral content.
                        </p>
                    </div>
                    <div className="bg-purple-800/20 border border-purple-500/20 rounded-lg p-4">
                        <h4 className="font-bold text-purple-300 mb-2">"What if I'm not satisfied?"</h4>
                        <p className="text-purple-200/80 text-sm">
                            We offer a 30-day money-back guarantee. If you're not completely satisfied, 
                            we'll refund every penny. No questions asked.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};
