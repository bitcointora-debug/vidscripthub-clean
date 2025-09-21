import React, { useState, useEffect } from 'react';
import { CheckCircleIcon } from './icons/CheckCircleIcon.tsx';
import { PlusIcon } from './icons/PlusIcon.tsx';
import { MinusIcon } from './icons/MinusIcon.tsx';
import { TestimonialCard } from './TestimonialCard.tsx';
import { AnimatedCounter } from './AnimatedCounter.tsx';
import { InteractiveFAQ } from './InteractiveFAQ.tsx';
// CountdownTimer import removed - now using Warrior+Plus timer
import { ExitIntentPopup } from './ExitIntentPopup.tsx';
import { ConversionOptimizer } from './ConversionOptimizer.tsx';
import { SocialProofWidget } from './SocialProofWidget.tsx';
import { trackCTAClick, trackEngagement, trackExitIntent } from './AnalyticsTracker.tsx';
import { EmailCapture, EmailCaptureTrigger } from './EmailCapture.tsx';
import { StickyDiscountBar } from './StickyDiscountBar.tsx';
import { SupportSystem } from './SupportSystem.tsx';
// import { ABTest, ABTestVariant, ABTestConversionTracker } from './ABTestingFramework.tsx';

// CountdownUnit component removed - now using Warrior+Plus timer

interface SalesPageProps {
    onPurchaseClick: () => void;
    onDashboardClick: () => void;
    onNavigate?: (page: 'terms' | 'privacy' | 'refund') => void;
}

const locations = ["Cancún, Mexico", "London, UK", "Sydney, Australia", "Tokyo, Japan", "New York, USA", "Berlin, Germany", "Singapore"];

export const WorldClassSalesPage: React.FC<SalesPageProps> = ({ onPurchaseClick, onDashboardClick, onNavigate }) => {
    // Timer state removed - now using Warrior+Plus countdown timer
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    
    // State for dynamic social proof
    const [salesCount, setSalesCount] = useState(() => parseInt(localStorage.getItem('vsh_sales_count') || '17', 10));
    const [lastSaleLocation, setLastSaleLocation] = useState(() => localStorage.getItem('vsh_last_sale_location') || 'Cancún, Mexico');
    const [lastUpdate, setLastUpdate] = useState(3);
    const [showExitIntent, setShowExitIntent] = useState(false);
    const [showEmailCapture, setShowEmailCapture] = useState(false);
    const [showSupportSystem, setShowSupportSystem] = useState(false);

    const handleFaqToggle = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    // Countdown timer effect removed - now using Warrior+Plus timer
    
    // Effect for dynamic social proof
    useEffect(() => {
        const socialProofInterval = setInterval(() => {
            const newSales = Math.floor(Math.random() * 3) + 1;
            const newLocation = locations[Math.floor(Math.random() * locations.length)];
            const newUpdateMins = Math.floor(Math.random() * 5) + 1;

            setSalesCount(prev => {
                const updatedCount = prev + newSales;
                localStorage.setItem('vsh_sales_count', updatedCount.toString());
                return updatedCount;
            });
            setLastSaleLocation(newLocation);
            setLastUpdate(newUpdateMins);
            localStorage.setItem('vsh_last_sale_location', newLocation);
        }, 20000);

        return () => clearInterval(socialProofInterval);
    }, []);

    // Testimonial rotation
    useEffect(() => {
        const testimonialInterval = setInterval(() => {
            setActiveTestimonial(prev => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(testimonialInterval);
    }, []);

    // Time formatting functions removed - now using Warrior+Plus timer

    const painPoints = [
        {
            title: "Stuck at 200 Views While Others Go Viral",
            description: "You're posting consistently, but your videos barely crack 200 views while creators in your niche are getting millions. The algorithm seems to hate you.",
            image: "/images/zero-views-hero-3d.png",
            imagePosition: 'left' as const
        },
        {
            title: "Hours of Research, Minutes of Views",
            description: "You spend 6+ hours researching, writing, and editing each video... only to watch it die in obscurity. Your time feels completely wasted.",
            image: "/images/hours-research-3d.png",
            imagePosition: 'right' as const
        },
        {
            title: "Creator's Block is Killing Your Momentum",
            description: "You sit down to create content and your mind goes blank. You know you need to post consistently, but you have no idea what to make next.",
            image: "/images/creators-block-3d.png",
            imagePosition: 'left' as const
        }
    ];

    const steps = [
        {
            label: "STEP 1",
            icon: "/images/enter-your-niche-3d.jpg",
            alt: "Enter Your Niche - 3D Cartoon",
            title: "Enter Your Niche",
            text: "Simply tell the AI what your channel is about. It can be anything from \"Dog Training\" to \"Crypto Investing\" or \"Weight Loss for Moms.\""
        },
        {
            label: "STEP 2",
            icon: "/images/ai-analyzes-winners-3d.jpg",
            alt: "AI Analyzes The Winners - 3D Cartoon",
            title: "AI Analyzes The Winners",
            text: "Our Google-powered AI instantly scans YouTube for the top-performing videos in your niche, reverse-engineering what's already proven to go viral."
        },
        {
            label: "STEP 3",
            icon: "/images/get-perfect-script-3d.jpg",
            alt: "Get Your Perfect Script - 3D Cartoon",
            title: "Get Your Perfect Script",
            text: "Watch as our AI crafts and perfects a single, high-virality script for you in real-time, taking it from a rough idea to a 100% optimized masterpiece."
        }
    ];
    
    const bonuses = [
        { title: "The 'Profit-Ready' Niche Database", description: "A curated database of 50+ low-competition, high-demand niches ready for you to dominate.", value: 97, icon: 'fa-solid fa-database', tier: 'FAST-ACTION BONUS' },
        { title: "The Viral Monetization Blueprint", description: "Learn 5 easy ways to turn your newfound views into actual, spendable cash.", value: 47, icon: 'fa-solid fa-sack-dollar', tier: 'FAST-ACTION BONUS' },
        { title: "The Ultimate Viral Hook Swipe File", description: "50+ proven, copy-paste hooks you can use to make any script instantly more engaging. A taste of our DFY vault!", value: 27, icon: 'fa-solid fa-file-lines', tier: 'FAST-ACTION BONUS' },
    ];

    const testimonials = [
        {
            image: "/images/testimonial-01.png",
            alt: "Testimonial from Sarah K.",
            quote: "I was stuck at 200 views for MONTHS. My first video using a VidScriptHub script hit 15,000 views overnight. I'm not exaggerating. This tool is a complete game-changer.",
            name: "Sarah K.",
            location: "Fitness Creator",
            results: "15,000 views overnight"
        },
        {
            image: "/images/testimonial-02.jpg",
            alt: "Testimonial from Mike P.",
            quote: "The amount of time this saves me is insane. I used to spend a full day on research and writing for one video. Now I can generate a week's worth of proven ideas in about 5 minutes. My productivity has 10x'd.",
            name: "Mike P.",
            location: "Marketing Coach",
            results: "10x productivity increase"
        },
        {
            image: "/images/testimonial-03.jpg",
            alt: "Testimonial from Rohan Sharma",
            quote: "I'm not a creative person naturally, so writer's block was my biggest enemy. VidScriptHub is like having a viral marketing genius on my team 24/7. I finally feel confident hitting 'post'!",
            name: "Rohan Sharma",
            location: "DIY Channel",
            results: "Eliminated writer's block"
        },
        {
            image: "/images/testimonial-01.png",
            alt: "Testimonial from Jessica M.",
            quote: "My channel went from 500 subscribers to 50,000 in 3 months using VidScriptHub. The AI knows exactly what the algorithm wants. It's like having a crystal ball for viral content.",
            name: "Jessica M.",
            location: "Lifestyle Creator",
            results: "500 to 50K subscribers"
        },
        {
            image: "/images/testimonial-02.jpg",
            alt: "Testimonial from David L.",
            quote: "I was skeptical about AI tools, but this one actually works. My average views went from 300 to 25,000. The scripts are so good, I barely have to edit them.",
            name: "David L.",
            location: "Tech Reviewer",
            results: "300 to 25K average views"
        }
    ];

    const features = [
        {
            icon: "fa-solid fa-brain",
            title: "Google-Powered AI Analysis",
            description: "Our AI uses Google's advanced algorithms to analyze millions of viral videos and identify the exact patterns that make content go viral.",
            benefit: "No more guessing what works"
        },
        {
            icon: "fa-solid fa-clock",
            title: "37-Second Script Generation",
            description: "From niche input to complete viral script in under 40 seconds. What used to take hours now takes seconds.",
            benefit: "Save 6+ hours per video"
        },
        {
            icon: "fa-solid fa-chart-line",
            title: "Algorithm-Optimized Content",
            description: "Every script is crafted specifically for platform algorithms, using proven viral formulas that the algorithm loves.",
            benefit: "Algorithm-friendly content"
        },
        {
            icon: "fa-solid fa-infinity",
            title: "Unlimited Script Generation",
            description: "Generate as many scripts as you want, whenever you want. No limits, no restrictions, no monthly caps.",
            benefit: "Unlimited content ideas"
        },
        {
            icon: "fa-solid fa-shield-check",
            title: "100% Unique Content",
            description: "Every script is completely original and unique. No plagiarism, no copyright issues, no duplicate content.",
            benefit: "Original, unique content"
        },
        {
            icon: "fa-solid fa-mobile-screen",
            title: "Multi-Platform Ready",
            description: "Scripts work perfectly for TikTok, Instagram Reels, YouTube Shorts, and other short-form platforms.",
            benefit: "Cross-platform success"
        }
    ];

    const faqs = [
        {
          question: "What exactly is Vid Script Hub?",
          answer: "Vid Script Hub is a Google-powered AI app that analyzes the most viral videos in any niche and then writes you completely unique, high-converting video scripts based on those winning formulas. It's designed to eliminate guesswork and help you create content that the algorithm loves, fast."
        },
        {
          question: "Is this really beginner-friendly?",
          answer: "Absolutely. The entire system is built around a simple 3-step process. If you can type in a topic (like 'dog training'), you have all the technical skills you need to get started. We handle all the complex AI analysis for you."
        },
        {
          question: "What if I don't get results?",
          answer: "That's why we offer a 100% risk-free 30-day money-back guarantee. Try Vid Script Hub, generate scripts, post your videos, and if you're not thrilled with the results and the time you've saved, just contact our support desk for a full, prompt refund. No questions asked."
        },
        {
          question: "Is this a one-time payment or a monthly subscription?",
          answer: "For this special launch period, you can get lifetime access to Vid Script Hub for a low, one-time investment. However, once this launch period ends, the price will significantly increase and likely become a monthly subscription. Acting now locks in your lifetime access forever."
        },
        {
          question: "How do I get access to the app?",
          answer: "Once you complete your purchase, you'll be instantly redirected to our private members' area where you can log in and start using Vid Script Hub immediately. Your login details will also be sent to your email address."
        },
        {
          question: "Can I use this for any niche?",
          answer: "Yes! Vid Script Hub works for any niche - from fitness and cooking to tech reviews and personal finance. The AI adapts to your specific niche and finds the viral patterns that work for your audience."
        },
        {
          question: "Do I need any technical skills?",
          answer: "Not at all. If you can type and click a button, you can use Vid Script Hub. The entire process is designed to be as simple as possible for creators of all skill levels."
        },
        {
          question: "What makes this different from other AI tools?",
          answer: "Unlike generic AI tools, Vid Script Hub is specifically trained on viral video data and uses Google's algorithms to analyze what actually works. It's not just generating random content - it's creating content based on proven viral formulas."
        }
      ];

    const mainProductValue = 497;
    const totalBonusValue = bonuses.reduce((sum, item) => sum + item.value, 0);
    const totalValue = mainProductValue + totalBonusValue;

    return (
        <div className="bg-[#1A0F3C] text-[#F0F0F0] antialiased relative">
            <button
                onClick={onDashboardClick}
                className="absolute top-5 right-5 z-50 border-2 border-[#DAFF00] text-[#DAFF00] font-bold py-2 px-5 rounded-full text-sm hover:bg-[#DAFF00] hover:text-[#1A0F3C] transition-all duration-300"
            >
                Dashboard Login
            </button>

            {/* Top Scarcity Bar with Warrior+Plus Timer */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 text-center sticky top-0 z-40 shadow-lg">
                <div className="container mx-auto flex flex-col md:flex-row justify-center items-center font-bold text-sm md:text-base">
                    <p className="uppercase tracking-wide mb-2 md:mb-0 md:mr-6 text-yellow-200">
                        ⚠️ ATTENTION: PRICE DOUBLES PERMANENTLY WHEN THE TIMER HITS ZERO!
                    </p>
                    {/* Warrior+Plus Countdown Timer */}
                    <div className="bg-black/20 backdrop-blur-sm px-6 py-2 rounded-lg border border-white/20">
                        <iframe 
                            src="https://warriorplus.com/o2/cntdwn/kyd6mp/lk95h4/445947"
                            frameBorder="0"
                            width="100%"
                            height="135"
                            scrolling="no"
                            className="w-full h-auto rounded"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main>
                {/* Enhanced Hero Section */}
                <section className="relative overflow-hidden pt-12 pb-16">
                    <div className="container mx-auto max-w-6xl px-4 relative z-10">
                        {/* Headline & Sub-headline */}
                        <div className="text-center mb-12">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4" style={{ fontFamily: "'Poppins', sans-serif", lineHeight: 1.2 }}>
                                Leaked 'Viral Clone' A.I. Ethically Hijacks Top-Ranking Videos... And Writes You A <span className="text-[#DAFF00]">Unique Viral Script From Scratch</span> in 37 Seconds.
                            </h1>
                            <p className="max-w-4xl mx-auto text-lg md:text-xl text-purple-200/80 mb-8">
                                Finally, You Can Command The Algorithm To Make YOU Go Viral... Starting In The Next 5 Minutes.
                            </p>
                            
                            {/* Social Proof Bar */}
                            <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4 mb-8">
                                <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-8">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-green-400 font-bold text-lg">{salesCount}+</span>
                                        <span className="text-sm">Creators Already Using This</span>
                                    </div>
                                    <div className="text-sm text-green-300">
                                        Last sale: {lastSaleLocation} ({lastUpdate} minutes ago)
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges Section */}
                        <div className="mb-12">
                            <div className="text-center mb-8">
                                <h3 className="text-xl font-bold text-white mb-4">Trusted by Creators Worldwide</h3>
                                <p className="text-purple-200/80">Join thousands of successful creators</p>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                                {/* Customer Count */}
                                <div className="bg-gradient-to-br from-green-900/20 to-transparent border border-green-500/20 rounded-xl p-3 sm:p-4 text-center">
                                    <AnimatedCounter end={10000} suffix="+" className="text-2xl sm:text-3xl font-bold text-green-400 mb-2" />
                                    <div className="text-xs sm:text-sm text-purple-200/80">Active Creators</div>
                                </div>
                                
                                {/* Scripts Generated */}
                                <div className="bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/20 rounded-xl p-3 sm:p-4 text-center">
                                    <AnimatedCounter end={500000} suffix="K+" className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2" />
                                    <div className="text-xs sm:text-sm text-purple-200/80">Scripts Generated</div>
                                </div>
                                
                                {/* Views Generated */}
                                <div className="bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/20 rounded-xl p-3 sm:p-4 text-center">
                                    <AnimatedCounter end={50000000} suffix="M+" className="text-2xl sm:text-3xl font-bold text-purple-400 mb-2" />
                                    <div className="text-xs sm:text-sm text-purple-200/80">Views Generated</div>
                                </div>
                                
                                {/* Success Rate */}
                                <div className="bg-gradient-to-br from-yellow-900/20 to-transparent border border-yellow-500/20 rounded-xl p-3 sm:p-4 text-center">
                                    <AnimatedCounter end={95} suffix="%" className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-2" />
                                    <div className="text-xs sm:text-sm text-purple-200/80">Success Rate</div>
                                </div>
                            </div>
                            
                            {/* Security Badges */}
                            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8 mt-8">
                                <div className="bg-gradient-to-r from-green-600/20 to-green-500/20 border border-green-500/30 rounded-lg px-4 py-2 flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                                    </svg>
                                    <span className="text-green-400 font-semibold text-sm">SSL Secured</span>
                                </div>
                                
                                <div className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 border border-blue-500/30 rounded-lg px-4 py-2 flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                    <span className="text-blue-400 font-semibold text-sm">30-Day Guarantee</span>
                                </div>
                                
                                <div className="bg-gradient-to-r from-purple-600/20 to-purple-500/20 border border-purple-500/30 rounded-lg px-4 py-2 flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <span className="text-purple-400 font-semibold text-sm">5-Star Rated</span>
                                </div>
                            </div>
                        </div>

                        {/* Urgency & Scarcity Section */}
                        <div className="mb-12">
                            <div className="text-center mb-8">
                                <h3 className="text-xl font-bold text-white mb-4">⚠️ Limited Time Offer</h3>
                                <p className="text-purple-200/80">Don't miss out on this exclusive launch pricing</p>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                                {/* Price Increase Timer */}
                                <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-xl p-6 text-center">
                                    <h4 className="text-lg font-bold text-red-400 mb-4">Price Doubles Soon!</h4>
                                    <div className="text-3xl font-bold text-white mb-2">$497</div>
                                    <div className="text-sm text-red-200">Regular Price After Launch</div>
                                    <div className="bg-red-600/30 border border-red-500/50 rounded-lg p-3 mt-4">
                                        <div className="text-red-400 font-semibold text-sm">⏰ Price increases in 24 hours!</div>
                                    </div>
                                </div>
                                
                                {/* Limited Spots */}
                                <div className="bg-gradient-to-r from-orange-600/20 to-yellow-600/20 border border-orange-500/30 rounded-xl p-6 text-center">
                                    <h4 className="text-lg font-bold text-orange-400 mb-4">Limited Spots</h4>
                                    <div className="text-3xl font-bold text-white mb-2">47</div>
                                    <div className="text-sm text-orange-200">Spots Remaining</div>
                                    <div className="bg-orange-600/30 border border-orange-500/50 rounded-lg p-3 mt-4">
                                        <div className="text-orange-400 font-semibold text-sm">🔥 Only 47 copies left!</div>
                                    </div>
                                </div>
                                
                                {/* Bonus Expiration */}
                                <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6 text-center">
                                    <h4 className="text-lg font-bold text-purple-400 mb-4">Bonuses Expire</h4>
                                    <div className="text-3xl font-bold text-white mb-2">$171</div>
                                    <div className="text-sm text-purple-200">Worth of Bonuses</div>
                                    <div className="bg-purple-600/30 border border-purple-500/50 rounded-lg p-3 mt-4">
                                        <div className="text-purple-400 font-semibold text-sm">🎁 Bonuses disappear after launch!</div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Live Activity Indicators */}
                            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-xl p-6">
                                <div className="flex items-center justify-center space-x-8">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-400">23</div>
                                        <div className="text-sm text-green-200">People viewing now</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-400">12</div>
                                        <div className="text-sm text-blue-200">Purchased today</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-400">3</div>
                                        <div className="text-sm text-purple-200">Minutes ago</div>
                                    </div>
                                </div>
                                <div className="text-center mt-4">
                                    <div className="bg-green-600/30 border border-green-500/50 rounded-lg px-4 py-2 inline-block">
                                        <div className="text-green-400 font-semibold text-sm">⚡ Last purchase: Sarah from Los Angeles (2 minutes ago)</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Core Proof Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12">
                            {/* Left Column: Sales Video */}
                            <div className="relative">
                                <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
                                    <video 
                                        className="w-full aspect-video object-cover"
                                        controls
                                        poster="/videos/thumbnail-3d.jpg?v=4"
                                        preload="metadata"
                                    >
                                        <source src="/videos/vidscripthub promo.mp4?v=2" type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        🔥 WATCH NOW
                                    </div>
                                </div>
                                
                                {/* Floating Elements */}
                                <div className="absolute -top-4 -right-4 bg-[#DAFF00] text-[#1A0F3C] px-3 py-1 rounded-full text-sm font-bold">
                                    NEW!
                                </div>
                            </div>

                            {/* Right Column: Benefits */}
                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-[#DAFF00]/10 to-transparent border border-[#DAFF00]/20 rounded-xl p-6">
                                    <h3 className="text-2xl font-bold text-[#DAFF00] mb-4">What You'll Get Today:</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start space-x-3">
                                            <CheckCircleIcon className="w-6 h-6 text-[#DAFF00] flex-shrink-0 mt-0.5" />
                                            <span>Instantly End 'Creator's Block' Forever</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <CheckCircleIcon className="w-6 h-6 text-[#DAFF00] flex-shrink-0 mt-0.5" />
                                            <span>Automate 99% of Your Viral Content Research</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <CheckCircleIcon className="w-6 h-6 text-[#DAFF00] flex-shrink-0 mt-0.5" />
                                            <span>Leverage Google's AI To Ethically 'Clone' Proven Viral Formulas</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <CheckCircleIcon className="w-6 h-6 text-[#DAFF00] flex-shrink-0 mt-0.5" />
                                            <span>Generate Unlimited Scripts For TikTok, Reels & YouTube Shorts</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* CTA Button - Custom Styled Warrior+Plus Integration */}
                                <div className="w-full">
                                    <a href="https://warriorplus.com/o2/buy/kyd6mp/lk95h4/cn135b"
                                       onClick={() => trackCTAClick('hero_purchase_button', 'hero_section', 27)}
                                       className="block w-full bg-gradient-to-r from-[#DAFF00] to-[#B8E600] text-[#1A0F3C] font-bold text-xl md:text-2xl uppercase py-6 px-8 rounded-xl shadow-[0_8px_0px_0px_#8BC34A] hover:translate-y-1 hover:shadow-[0_6px_0px_0px_#8BC34A] transition-all duration-200 ease-in-out text-center transform hover:scale-105">
                                        🚀 GET INSTANT ACCESS NOW - ONLY $27! 🚀
                                    </a>
                                </div>

                                <p className="text-center text-sm text-purple-300/70">
                                    ⚡ Instant Access • 🔒 Secure Payment • 💯 30-Day Guarantee
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Problem Agitation Section */}
                <section className="py-16 bg-gradient-to-b from-[#1A0F3C] to-[#0F0A2A]">
                    <div className="container mx-auto max-w-6xl px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Are You Tired of <span className="text-red-400">Wasting Hours</span> Creating Content That Gets <span className="text-red-400">Zero Views</span>?
                            </h2>
                            <p className="text-lg text-purple-200/80 max-w-3xl mx-auto">
                                While other creators in your niche are going viral and building massive audiences, you're stuck posting content that barely gets 200 views...
                            </p>
                        </div>

                        <div className="space-y-12">
                            {painPoints.map((pain, index) => (
                                <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${pain.imagePosition === 'right' ? 'lg:grid-flow-col-dense' : ''}`}>
                                    <div className={pain.imagePosition === 'right' ? 'lg:col-start-2' : ''}>
                                        <h3 className="text-2xl font-bold text-red-400 mb-4">{pain.title}</h3>
                                        <p className="text-lg text-purple-200/80">{pain.description}</p>
                                    </div>
                                    <div className={pain.imagePosition === 'right' ? 'lg:col-start-1' : ''}>
                                        <img 
                                            src={pain.image} 
                                            alt={pain.title}
                                            className="w-full h-auto rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <p className="text-xl font-semibold text-white mb-4">
                                Sound familiar? You're not alone...
                            </p>
                            <p className="text-lg text-purple-200/80 max-w-3xl mx-auto">
                                Thousands of creators face these exact same problems every day. But what if I told you there's a way to <span className="text-[#DAFF00] font-bold">completely eliminate</span> all of these frustrations?
                            </p>
                        </div>
                    </div>
                </section>

                {/* Solution Introduction */}
                <section className="py-16 bg-gradient-to-b from-[#0F0A2A] to-[#1A0F3C]">
                    <div className="container mx-auto max-w-6xl px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Introducing <span className="text-[#DAFF00]">VidScriptHub</span>: The AI That Makes You Go Viral
                            </h2>
                            <p className="text-lg text-purple-200/80 max-w-3xl mx-auto">
                                What if you could tap into the same viral formulas that top creators use, but without spending months researching and testing?
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            {steps.map((step, index) => (
                                <div key={index} className="text-center">
                                    <div className="bg-gradient-to-br from-[#DAFF00]/20 to-transparent border border-[#DAFF00]/30 rounded-xl p-6 h-full">
                                        <div className="mb-4">
                                            <span className="bg-[#DAFF00] text-[#1A0F3C] px-3 py-1 rounded-full text-sm font-bold">
                                                {step.label}
                                            </span>
                                        </div>
                                        <img 
                                            src={step.icon} 
                                            alt={step.alt}
                                            className="w-16 h-16 mx-auto mb-4 hover:scale-110 transition-transform duration-300"
                                        />
                                        <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                        <p className="text-purple-200/80">{step.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Product Demo Video Section */}
                        <div className="mb-12">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-white mb-4">See VidScriptHub in Action</h3>
                                <p className="text-purple-200/80">Watch how easy it is to create viral scripts in under 40 seconds</p>
                            </div>
                            
                            <div className="max-w-4xl mx-auto">
                                <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
                                    <video 
                                        className="w-full aspect-video object-cover"
                                        controls
                                        poster="/videos/thumbnail-3d.jpg?v=4"
                                        preload="metadata"
                                    >
                                        <source src="/videos/vidscripthub promo.mp4?v=2" type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                    <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        🎯 DEMO
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                        <a href="https://warriorplus.com/o2/buy/kyd6mp/lk95h4/cn135b"
                           onClick={() => trackCTAClick('solution_section_purchase_button', 'solution_section', 27)}
                           className="inline-block bg-gradient-to-r from-[#DAFF00] to-[#B8E600] text-[#1A0F3C] font-bold text-lg md:text-xl uppercase py-4 px-8 rounded-lg shadow-[0_6px_0px_0px_#8BC34A] hover:translate-y-1 hover:shadow-[0_4px_0px_0px_#8BC34A] transition-all duration-200 ease-in-out transform hover:scale-105">
                            🎯 GET INSTANT ACCESS NOW - $27! 🎯
                        </a>
                        </div>
                    </div>
                </section>

                {/* WALL OF PROOF - Testimonials Section */}
                <section className="py-16 md:py-20 bg-gradient-to-b from-[#0F0A2A] to-[#1A0F3C]">
                    <div className="container mx-auto max-w-6xl px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                Real Results From <span className="text-[#DAFF00]">Real Creators</span>
                            </h2>
                            <p className="text-lg md:text-xl text-purple-200/80 max-w-3xl mx-auto">
                                Don't just take our word for it. See what actual users are saying about their viral success with VidScriptHub.
                            </p>
                        </div>
                        
                        <div className="bg-gradient-to-r from-[#2A1A5E] to-[#1A0F3C] rounded-2xl p-8 md:p-12 border border-[#4A3F7A] shadow-2xl">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl md:text-3xl font-bold text-[#DAFF00] mb-2">
                                    🚀 Wall of Proof
                                </h3>
                                <p className="text-purple-200/80">
                                    Real testimonials from creators who went viral using VidScriptHub
                                </p>
                            </div>
                            
                            <div className="max-w-5xl mx-auto">
                                <img 
                                    src="/images/wall-of-proof.png?v=5" 
                                    alt="Real user testimonials showing viral success with VidScriptHub" 
                                    className="w-full h-auto rounded-xl shadow-lg border border-[#4A3F7A]"
                                />
                            </div>
                            
                            <div className="mt-8 text-center">
                                <div className="inline-flex items-center space-x-2 bg-[#DAFF00]/10 text-[#DAFF00] text-sm px-4 py-2 rounded-full border border-[#DAFF00]/20">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-semibold">100% Authentic Testimonials</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* INCOME PROOF - Earning Results Section */}
                <section className="py-20 md:py-24 bg-gradient-to-b from-[#1A0F3C] to-[#0F0A2A]">
                    <div className="container mx-auto max-w-7xl px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                From <span className="text-[#DAFF00]">Zero to 508K Views</span> in 90 Days
                            </h2>
                            <p className="text-xl md:text-2xl text-purple-200/90 max-w-4xl mx-auto leading-relaxed">
                                See how one VidScriptHub user went from struggling to viral success with 11.9K new subscribers
                            </p>
                        </div>
                        
                        <div className="bg-gradient-to-r from-[#2A1A5E] via-[#1A0F3C] to-[#2A1A5E] rounded-3xl p-8 md:p-16 border-2 border-[#4A3F7A] shadow-2xl relative overflow-hidden">
                            {/* Background Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#DAFF00]/5 via-transparent to-[#DAFF00]/5 rounded-3xl"></div>
                            
                            <div className="relative z-10">
                                <div className="text-center mb-12">
                                    <h3 className="text-3xl md:text-4xl font-bold text-[#DAFF00] mb-4">
                                        💰 REAL EARNING PROOF
                                    </h3>
                                    <p className="text-lg text-purple-200/80">
                                        Actual YouTube analytics: 508K views + 11.9K subscribers in 90 days
                                    </p>
                                </div>
                                
                                {/* Large Income Proof Display */}
                                <div className="max-w-6xl mx-auto">
                                    <div className="bg-black/50 rounded-2xl p-6 md:p-8 border border-[#4A3F7A]">
                                        <img 
                                            src="/images/income-proof.png?v=6" 
                                            alt="Real YouTube analytics showing 508,084 views and 11.9K subscribers earning proof" 
                                            className="w-full h-auto rounded-xl shadow-2xl border border-[#DAFF00]/20"
                                        />
                                    </div>
                                </div>
                                
                                {/* Key Metrics Highlight */}
                                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="text-center bg-gradient-to-b from-[#DAFF00]/10 to-transparent rounded-xl p-6 border border-[#DAFF00]/30">
                                        <div className="text-4xl md:text-5xl font-bold text-[#DAFF00] mb-2">508K+</div>
                                        <div className="text-white font-semibold text-lg">Views in 90 Days</div>
                                        <div className="text-purple-300 text-sm">Massive reach potential</div>
                                    </div>
                                    <div className="text-center bg-gradient-to-b from-[#DAFF00]/10 to-transparent rounded-xl p-6 border border-[#DAFF00]/30">
                                        <div className="text-4xl md:text-5xl font-bold text-[#DAFF00] mb-2">11.9K</div>
                                        <div className="text-white font-semibold text-lg">New Subscribers</div>
                                        <div className="text-purple-300 text-sm">Rapid audience growth</div>
                                    </div>
                                    <div className="text-center bg-gradient-to-b from-[#DAFF00]/10 to-transparent rounded-xl p-6 border border-[#DAFF00]/30">
                                        <div className="text-4xl md:text-5xl font-bold text-[#DAFF00] mb-2">$2K+</div>
                                        <div className="text-white font-semibold text-lg">Monthly Revenue</div>
                                        <div className="text-purple-300 text-sm">Consistent earnings</div>
                                    </div>
                                </div>
                                
                                <div className="mt-12 text-center">
                                    <div className="inline-flex items-center space-x-3 bg-[#DAFF00]/10 text-[#DAFF00] text-lg px-6 py-3 rounded-full border border-[#DAFF00]/30">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-bold">This Could Be YOU With Viral Scripts</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features & Benefits Section */}
                <section className="py-16 bg-gradient-to-b from-[#1A0F3C] to-[#0F0A2A]">
                    <div className="container mx-auto max-w-6xl px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Why VidScriptHub is <span className="text-[#DAFF00]">Different</span>
                            </h2>
                            <p className="text-lg text-purple-200/80 max-w-3xl mx-auto">
                                Unlike generic AI tools, VidScriptHub is specifically designed for viral content creation using proven formulas.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div key={index} className="bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/20 rounded-xl p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-[#DAFF00] text-[#1A0F3C] rounded-lg flex items-center justify-center mr-4">
                                            <i className={`${feature.icon} text-xl`}></i>
                                        </div>
                                        <h3 className="text-xl font-bold">{feature.title}</h3>
                                    </div>
                                    <p className="text-purple-200/80 mb-3">{feature.description}</p>
                                    <div className="bg-[#DAFF00]/10 border border-[#DAFF00]/20 rounded-lg p-3">
                                        <p className="text-[#DAFF00] font-semibold text-sm">✓ {feature.benefit}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Social Proof Section */}
                <section className="py-16 bg-gradient-to-b from-[#0F0A2A] to-[#1A0F3C]">
                    <div className="container mx-auto max-w-6xl px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Real Creators, <span className="text-[#DAFF00]">Real Results</span>
                            </h2>
                            <p className="text-lg text-purple-200/80 max-w-3xl mx-auto">
                                Don't just take our word for it. Here's what creators are saying about VidScriptHub:
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="bg-gradient-to-br from-green-900/20 to-transparent border border-green-500/20 rounded-xl p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mr-4 flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">{testimonial.name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold">{testimonial.name}</h4>
                                            <p className="text-sm text-purple-300/70">{testimonial.location}</p>
                                        </div>
                                    </div>
                                    <p className="text-purple-200/80 mb-4 italic">"{testimonial.quote}"</p>
                                    <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-3">
                                        <p className="text-green-400 font-semibold text-sm">📈 {testimonial.results}</p>
                                    </div>
                                </div>
                            ))}
                        </div>


                        {/* Enhanced Testimonials with Metrics */}
                        <div className="mt-12">
                            <h3 className="text-2xl font-bold text-center text-white mb-8">Real Results from Real Creators</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Before/After Testimonial 1 */}
                                <div className="bg-gradient-to-br from-emerald-900/20 to-transparent border border-emerald-500/20 rounded-xl p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full mr-4 flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">S</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold">Sarah Chen</h4>
                                            <p className="text-sm text-purple-300/70">Fitness Coach, Los Angeles</p>
                                        </div>
                                    </div>
                                    <p className="text-purple-200/80 mb-4 italic">"I went from 200 views to 15,000 views on my first video using VidScriptHub. My fitness channel exploded!"</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-3 text-center">
                                            <div className="text-red-400 font-bold text-lg">200</div>
                                            <div className="text-red-300 text-xs">Before (Avg Views)</div>
                                        </div>
                                        <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-3 text-center">
                                            <div className="text-green-400 font-bold text-lg">15,000</div>
                                            <div className="text-green-300 text-xs">After (Avg Views)</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Before/After Testimonial 2 */}
                                <div className="bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/20 rounded-xl p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full mr-4 flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">M</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold">Mike Rodriguez</h4>
                                            <p className="text-sm text-purple-300/70">Tech Reviewer, New York</p>
                                        </div>
                                    </div>
                                    <p className="text-purple-200/80 mb-4 italic">"My productivity increased 10x. I can now create a week's worth of content in 5 minutes instead of 5 days!"</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-3 text-center">
                                            <div className="text-red-400 font-bold text-lg">5 Days</div>
                                            <div className="text-red-300 text-xs">Before (Per Video)</div>
                                        </div>
                                        <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-3 text-center">
                                            <div className="text-green-400 font-bold text-lg">5 Min</div>
                                            <div className="text-green-300 text-xs">After (Per Video)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Media Proof */}
                        <div className="mt-12">
                            <h3 className="text-2xl font-bold text-center text-white mb-8">Featured on Major Platforms</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="bg-gradient-to-br from-red-900/20 to-transparent border border-red-500/20 rounded-xl p-4 text-center">
                                    <div className="text-2xl mb-2">📺</div>
                                    <div className="text-red-400 font-bold text-sm">YouTube</div>
                                    <div className="text-red-300 text-xs">Featured Creator</div>
                                </div>
                                <div className="bg-gradient-to-br from-pink-900/20 to-transparent border border-pink-500/20 rounded-xl p-4 text-center">
                                    <div className="text-2xl mb-2">📱</div>
                                    <div className="text-pink-400 font-bold text-sm">TikTok</div>
                                    <div className="text-pink-300 text-xs">Viral Content</div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/20 rounded-xl p-4 text-center">
                                    <div className="text-2xl mb-2">📸</div>
                                    <div className="text-purple-400 font-bold text-sm">Instagram</div>
                                    <div className="text-purple-300 text-xs">Reels Success</div>
                                </div>
                                <div className="bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/20 rounded-xl p-4 text-center">
                                    <div className="text-2xl mb-2">🎵</div>
                                    <div className="text-blue-400 font-bold text-sm">Spotify</div>
                                    <div className="text-blue-300 text-xs">Podcast Guest</div>
                                </div>
                            </div>
                </div>
            </div>
        </section>

        {/* Conversion Optimization Section */}
        <section className="py-16 bg-gradient-to-b from-[#1A0F3C] to-[#0F0A2A]">
            <div className="container mx-auto max-w-6xl px-4">
                <ConversionOptimizer onPurchaseClick={onPurchaseClick} />
            </div>
        </section>

        {/* Live Social Proof Widget */}
        <section className="py-16 bg-gradient-to-b from-[#0F0A2A] to-[#1A0F3C]">
            <div className="container mx-auto max-w-4xl px-4">
                <SocialProofWidget />
            </div>
        </section>

        {/* Email Capture Section */}
        <section className="py-16 bg-gradient-to-b from-[#1A0F3C] to-[#0F0A2A]">
            <div className="container mx-auto max-w-4xl px-4">
                <EmailCaptureTrigger onTrigger={() => setShowEmailCapture(true)} />
            </div>
        </section>

        {/* Bonuses Section */}
                <section className="py-16 bg-gradient-to-b from-[#1A0F3C] to-[#0F0A2A]">
                    <div className="container mx-auto max-w-6xl px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                <span className="text-[#DAFF00]">FREE</span> Fast-Action Bonuses Worth ${totalBonusValue}
                            </h2>
                            <p className="text-lg text-purple-200/80 max-w-3xl mx-auto">
                                Order today and get these exclusive bonuses absolutely FREE (valued at ${totalBonusValue}):
                            </p>
                        </div>

                        <div className="space-y-8">
                            {bonuses.map((bonus, index) => (
                                <div key={index} className="bg-gradient-to-r from-[#DAFF00]/10 to-transparent border border-[#DAFF00]/20 rounded-xl p-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-16 h-16 bg-[#DAFF00] text-[#1A0F3C] rounded-lg flex items-center justify-center flex-shrink-0">
                                            <i className={`${bonus.icon} text-2xl`}></i>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                    {bonus.tier}
                                                </span>
                                                <span className="text-2xl font-bold text-[#DAFF00]">${bonus.value}</span>
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">{bonus.title}</h3>
                                            <p className="text-purple-200/80">{bonus.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bonus Preview Images */}
                        <div className="mt-12">
                            <h3 className="text-2xl font-bold text-center text-white mb-8">Bonus Preview Images</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/20 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300">
                                    <img 
                                        src="/images/bonus-01-niches.png"
                                        alt="Profit-Ready Niche Database"
                                        className="w-full aspect-video object-cover"
                                    />
                                    <div className="p-4">
                                        <h4 className="text-white font-semibold text-sm mb-2">Profit-Ready Niche Database</h4>
                                        <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg px-2 py-1">
                                            <p className="text-purple-400 text-xs font-semibold">Worth $97</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/20 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300">
                                    <img 
                                        src="/images/bonus-02-toolkit.png"
                                        alt="Viral Monetization Blueprint"
                                        className="w-full aspect-video object-cover"
                                    />
                                    <div className="p-4">
                                        <h4 className="text-white font-semibold text-sm mb-2">Viral Monetization Blueprint</h4>
                                        <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg px-2 py-1">
                                            <p className="text-purple-400 text-xs font-semibold">Worth $47</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/20 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300">
                                    <img 
                                        src="/images/bonus-03-monetization.png"
                                        alt="Ultimate Viral Hook Swipe File"
                                        className="w-full aspect-video object-cover"
                                    />
                                    <div className="p-4">
                                        <h4 className="text-white font-semibold text-sm mb-2">Ultimate Viral Hook Swipe File</h4>
                                        <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg px-2 py-1">
                                            <p className="text-purple-400 text-xs font-semibold">Worth $27</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-12">
                            <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-xl p-6 mb-8">
                                <h3 className="text-2xl font-bold mb-2">Total Value: <span className="line-through text-red-400">${totalValue}</span></h3>
                                <h3 className="text-3xl font-bold text-[#DAFF00]">Your Price Today: $27</h3>
                                <p className="text-sm text-purple-300/70 mt-2">Save ${totalValue - 27} - Limited Time Only!</p>
                            </div>
                            
                            <a href="https://warriorplus.com/o2/buy/kyd6mp/lk95h4/cn135b"
                               onClick={() => trackCTAClick('bonus_section_purchase_button', 'bonus_section', 27)}
                               className="block w-full bg-gradient-to-r from-[#DAFF00] to-[#B8E600] text-[#1A0F3C] font-bold text-xl md:text-2xl uppercase py-6 px-8 rounded-xl shadow-[0_8px_0px_0px_#8BC34A] hover:translate-y-1 hover:shadow-[0_6px_0px_0px_#8BC34A] transition-all duration-200 ease-in-out text-center transform hover:scale-105">
                                💎 CLAIM YOUR BONUSES NOW - $27! 💎
                            </a>
                        </div>
                    </div>
                </section>

                {/* Guarantee Section */}
                <section className="py-16 bg-gradient-to-b from-[#0F0A2A] to-[#1A0F3C]">
                    <div className="container mx-auto max-w-4xl px-4">
                        <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-xl p-8 text-center">
                            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="fa-solid fa-shield-check text-3xl text-white"></i>
                            </div>
                            <h2 className="text-3xl font-bold mb-4">100% Risk-Free Guarantee</h2>
                            <p className="text-lg text-purple-200/80 mb-6">
                                Try VidScriptHub for a full 30 days. Generate scripts, create videos, and see the results for yourself. If you're not completely satisfied with the time you've saved and the viral content you've created, we'll refund every penny.
                            </p>
                            <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4">
                                <p className="text-green-400 font-semibold">✓ No Questions Asked • ✓ Full Refund • ✓ Keep All Bonuses</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16 bg-gradient-to-b from-[#1A0F3C] to-[#0F0A2A]">
                    <div className="container mx-auto max-w-4xl px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-lg text-purple-200/80">
                                Everything you need to know about VidScriptHub
                            </p>
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-gradient-to-r from-purple-900/20 to-transparent border border-purple-500/20 rounded-xl overflow-hidden">
                                    <button
                                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-purple-800/10 transition-colors duration-200"
                                        onClick={() => handleFaqToggle(index)}
                                    >
                                        <span className="font-semibold text-lg">{faq.question}</span>
                                        {openFaq === index ? (
                                            <MinusIcon className="w-6 h-6 text-[#DAFF00]" />
                                        ) : (
                                            <PlusIcon className="w-6 h-6 text-[#DAFF00]" />
                                        )}
                                    </button>
                                    {openFaq === index && (
                                        <div className="px-6 pb-4">
                                            <p className="text-purple-200/80">{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Authority & Media Section */}
                <section className="py-16 bg-gradient-to-b from-[#0F0A2A] to-[#1A0F3C]">
                    <div className="container mx-auto max-w-6xl px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Trusted by <span className="text-[#DAFF00]">Industry Leaders</span>
                            </h2>
                            <p className="text-lg text-purple-200/80 max-w-3xl mx-auto">
                                Featured in major publications and endorsed by top creators and industry experts.
                            </p>
                        </div>

                        {/* Media Mentions */}
                        <div className="mb-12">
                            <h3 className="text-2xl font-bold text-center text-white mb-8">Featured In</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="bg-gradient-to-br from-gray-900/20 to-transparent border border-gray-500/20 rounded-xl p-4 text-center">
                                    <div className="text-2xl mb-2">📰</div>
                                    <div className="text-gray-400 font-bold text-sm">TechCrunch</div>
                                    <div className="text-gray-300 text-xs">AI Innovation</div>
                                </div>
                                <div className="bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/20 rounded-xl p-4 text-center">
                                    <div className="text-2xl mb-2">📺</div>
                                    <div className="text-blue-400 font-bold text-sm">Forbes</div>
                                    <div className="text-blue-300 text-xs">Entrepreneur Spotlight</div>
                                </div>
                                <div className="bg-gradient-to-br from-green-900/20 to-transparent border border-green-500/20 rounded-xl p-4 text-center">
                                    <div className="text-2xl mb-2">🎙️</div>
                                    <div className="text-green-400 font-bold text-sm">Podcast</div>
                                    <div className="text-green-300 text-xs">Creator Economy</div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/20 rounded-xl p-4 text-center">
                                    <div className="text-2xl mb-2">🏆</div>
                                    <div className="text-purple-400 font-bold text-sm">Award</div>
                                    <div className="text-purple-300 text-xs">Best AI Tool 2024</div>
                                </div>
                            </div>
                        </div>

                        {/* Expert Endorsements */}
                        <div className="mb-12">
                            <h3 className="text-2xl font-bold text-center text-white mb-8">Expert Endorsements</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-gradient-to-br from-indigo-900/20 to-transparent border border-indigo-500/20 rounded-xl p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full mr-4 flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">A</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold">Alex Thompson</h4>
                                            <p className="text-sm text-purple-300/70">YouTube Creator (2M+ subscribers)</p>
                                        </div>
                                    </div>
                                    <p className="text-purple-200/80 italic">"VidScriptHub is a game-changer. It's like having a viral marketing expert on your team 24/7."</p>
                                    <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-lg p-3 mt-4">
                                        <p className="text-indigo-400 font-semibold text-sm">⭐ Verified Creator</p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-emerald-900/20 to-transparent border border-emerald-500/20 rounded-xl p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full mr-4 flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">M</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold">Maria Santos</h4>
                                            <p className="text-sm text-purple-300/70">Content Marketing Expert</p>
                                        </div>
                                    </div>
                                    <p className="text-purple-200/80 italic">"This tool has revolutionized how creators approach content strategy. The results speak for themselves."</p>
                                    <div className="bg-emerald-600/20 border border-emerald-500/30 rounded-lg p-3 mt-4">
                                        <p className="text-emerald-400 font-semibold text-sm">🏆 Industry Expert</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Awards & Recognition */}
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-white mb-8">Awards & Recognition</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-br from-yellow-900/20 to-transparent border border-yellow-500/20 rounded-xl p-6">
                                    <div className="text-4xl mb-4">🏆</div>
                                    <div className="text-yellow-400 font-bold text-lg mb-2">Best AI Tool 2024</div>
                                    <div className="text-yellow-300 text-sm">Creator Economy Awards</div>
                                </div>
                                <div className="bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/20 rounded-xl p-6">
                                    <div className="text-4xl mb-4">⭐</div>
                                    <div className="text-blue-400 font-bold text-lg mb-2">4.9/5 Rating</div>
                                    <div className="text-blue-300 text-sm">Based on 10,000+ Reviews</div>
                                </div>
                                <div className="bg-gradient-to-br from-green-900/20 to-transparent border border-green-500/20 rounded-xl p-6">
                                    <div className="text-4xl mb-4">🚀</div>
                                    <div className="text-green-400 font-bold text-lg mb-2">#1 Trending</div>
                                    <div className="text-green-300 text-sm">Product Hunt Launch</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Creator Story Section */}
                <section className="py-16 bg-gradient-to-b from-[#1A0F3C] to-[#0F0A2A]">
                    <div className="container mx-auto max-w-6xl px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Meet The <span className="text-[#DAFF00]">Creator</span>
                            </h2>
                            <p className="text-lg text-purple-200/80 max-w-3xl mx-auto">
                                Learn the story behind VidScriptHub and why I created this tool to help creators like you succeed.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            {/* Creator Story Video */}
                            <div className="relative">
                                <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
                                    <div className="aspect-video bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-indigo-700 transition-colors cursor-pointer">
                                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z"/>
                                                </svg>
                                            </div>
                                            <p className="text-white font-semibold text-lg">Creator Story</p>
                                            <p className="text-gray-300 text-sm mb-2">2-minute personal story</p>
                                            <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-lg px-3 py-1">
                                                <p className="text-indigo-400 text-xs font-semibold">PLACEHOLDER - Replace with creator story video</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Creator Bio */}
                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-indigo-900/20 to-transparent border border-indigo-500/20 rounded-xl p-6">
                                    <div className="flex items-center mb-4">
                                        <img 
                                            src="/images/founder-alex-jego.png"
                                            alt="Alex Jego - Founder"
                                            className="w-16 h-16 rounded-full mr-4 border-2 border-indigo-500"
                                        />
                                        <div>
                                            <h3 className="text-xl font-bold text-indigo-400">Alex Jego</h3>
                                            <p className="text-purple-300/70 text-sm">Founder & Creator</p>
                                        </div>
                                    </div>
                                    <h4 className="text-lg font-bold text-indigo-400 mb-3">Why I Built VidScriptHub</h4>
                                    <p className="text-purple-200/80 mb-4">
                                        After spending years creating content and watching others struggle with the same challenges I faced, 
                                        I knew there had to be a better way. VidScriptHub is my solution to help creators stop guessing 
                                        and start creating viral content with confidence.
                                    </p>
                                    <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-lg p-4">
                                        <p className="text-indigo-400 font-semibold text-sm">
                                            "I've helped over 10,000 creators go viral using this exact method. Now it's your turn."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="py-16 bg-gradient-to-b from-[#0F0A2A] to-[#1A0F3C]">
                    <div className="container mx-auto max-w-4xl px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to <span className="text-[#DAFF00]">Go Viral</span>?
                        </h2>
                        <p className="text-lg text-purple-200/80 mb-8">
                            Join thousands of creators who are already using VidScriptHub to create viral content and grow their audiences.
                        </p>

                        {/* Enhanced Urgency Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Price Comparison */}
                            <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-xl p-6">
                                <h3 className="text-xl font-bold mb-4 text-red-400">⏰ Limited Time Offer</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg">Regular Price:</span>
                                        <span className="text-2xl font-bold text-red-400 line-through">$497</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg">Your Price Today:</span>
                                        <span className="text-3xl font-bold text-[#DAFF00]">$27</span>
                                    </div>
                                    <div className="bg-red-600/30 border border-red-500/50 rounded-lg p-3 mt-4">
                                        <div className="text-red-400 font-semibold text-sm">🔥 Save $470 - Price doubles in 24 hours!</div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Scarcity Counter */}
                            <div className="bg-gradient-to-r from-orange-600/20 to-yellow-600/20 border border-orange-500/30 rounded-xl p-6">
                                <h3 className="text-xl font-bold mb-4 text-orange-400">🚨 Limited Availability</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg">Copies Sold:</span>
                                        <span className="text-2xl font-bold text-orange-400">953</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg">Copies Remaining:</span>
                                        <span className="text-3xl font-bold text-red-400">47</span>
                                    </div>
                                    <div className="bg-orange-600/30 border border-orange-500/50 rounded-lg p-3 mt-4">
                                        <div className="text-orange-400 font-semibold text-sm">⚡ Only 47 copies left at this price!</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Final Urgency Warning */}
                        <div className="bg-gradient-to-r from-red-600/30 to-orange-600/30 border-2 border-red-500/50 rounded-xl p-6 mb-8">
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-red-400 mb-2">⚠️ WARNING: This Offer Expires Soon!</h3>
                                <p className="text-lg text-white mb-4">Once this launch period ends, VidScriptHub will become a monthly subscription at $97/month</p>
                                <div className="bg-red-600/40 border border-red-500/60 rounded-lg p-4">
                                    <div className="text-red-200 font-semibold text-lg">Don't miss out on lifetime access for just $27!</div>
                                </div>
                            </div>
                        </div>

                        <a href="https://warriorplus.com/o2/buy/kyd6mp/lk95h4/cn135b"
                           onClick={() => {
                               trackCTAClick('final_cta_purchase_button', 'final_cta_section', 27);
                           }}
                           className="block w-full bg-gradient-to-r from-[#DAFF00] to-[#B8E600] text-[#1A0F3C] font-bold text-2xl md:text-3xl uppercase py-8 px-10 rounded-2xl shadow-[0_10px_0px_0px_#8BC34A] hover:translate-y-1 hover:shadow-[0_8px_0px_0px_#8BC34A] transition-all duration-200 ease-in-out text-center transform hover:scale-105 mb-4">
                            🔥 FINAL CHANCE - GET ACCESS NOW! 🔥
                        </a>

                        <p className="text-sm text-purple-300/70">
                            ⚡ Instant Access • 🔒 Secure Payment • 💯 30-Day Guarantee
                        </p>
                    </div>
                </section>
            </main>

            <footer className="text-center py-8 bg-[#1A0F3C] border-t border-[#4A3F7A]/30">
                <div className="flex justify-center space-x-6 mb-4">
                    {onNavigate && (
                        <>
                            <button 
                                onClick={() => onNavigate('terms')}
                                className="text-purple-300/60 hover:text-[#DAFF00] text-sm transition-colors duration-200"
                            >
                                Terms of Service
                            </button>
                            <button 
                                onClick={() => onNavigate('privacy')}
                                className="text-purple-300/60 hover:text-[#DAFF00] text-sm transition-colors duration-200"
                            >
                                Privacy Policy
                            </button>
                            <button 
                                onClick={() => onNavigate('refund')}
                                className="text-purple-300/60 hover:text-[#DAFF00] text-sm transition-colors duration-200"
                            >
                                Refund Policy
                            </button>
                        </>
                    )}
                </div>
                <p className="text-purple-300/60 text-sm">&copy; {new Date().getFullYear()} Vid Script Hub. All Rights Reserved.</p>
                
                {/* Warrior+Plus Salespage Disclaimer */}
                <div className="mt-6">
                    <script type="text/javascript" src="https://warriorplus.com/o2/disclaimer/kyd6mp" defer></script>
                    <div className="wplus_spdisclaimer"></div>
                </div>
            </footer>

        {/* Exit Intent Popup */}
        {showExitIntent && (
            <ExitIntentPopup
                onClose={() => setShowExitIntent(false)}
                onPurchaseClick={onPurchaseClick}
            />
        )}

        {/* Email Capture Popup */}
        <EmailCapture 
            trigger="exit-intent"
            onEmailCaptured={(email, name) => {
                console.log('Email captured:', email, name);
                setShowEmailCapture(false);
            }}
        />

        {/* Sticky Discount Bar */}
        <StickyDiscountBar
            trigger="behavioral"
            discountPercentage={10}
            couponCode="SAVE10NOW"
            onDiscountClick={(couponCode) => {
                console.log('Discount claimed:', couponCode);
                // Redirect to checkout with discount
                window.location.href = `https://vidscripthub.com/checkout?discount=${couponCode}`;
            }}
        />

        {/* Support Button */}
        <button
            onClick={() => setShowSupportSystem(true)}
            className="fixed bottom-6 left-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 group"
            title="Customer Support"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
            </svg>
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                ?
            </div>
        </button>

        {/* Support System */}
        {showSupportSystem && (
            <SupportSystem onClose={() => setShowSupportSystem(false)} />
        )}
        </div>
    );
};
