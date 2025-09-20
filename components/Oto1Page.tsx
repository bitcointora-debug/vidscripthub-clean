
import React from 'react';
import { CheckCircleIcon } from './icons/CheckCircleIcon.tsx';

interface Oto1PageProps {
    onUpgrade: () => void;
    onDecline: () => void;
}

export const Oto1Page: React.FC<Oto1PageProps> = ({ onUpgrade, onDecline }) => {

    const benefits = [
        "UNLIMITED Script Generations",
        "UNLIMITED Niche Searches",
        "UNLIMITED Viral Analysis"
    ];

    const newFeatures = [
        {
            title: "Unlock Advanced Tonal Styles",
            description: "(Humorous, Controversial, Shocking & More!)"
        },
        {
            title: "Unlock The \"Trending Topics\" Forecaster",
            description: ""
        }
    ];

    return (
        <div className="bg-[#1A0F3C] text-[#F0F0F0] antialiased min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">

            <div className="w-full max-w-5xl mx-auto text-center relative z-10">
                {/* Urgency Banner */}
                <div className="bg-red-600 text-white py-3 px-6 rounded-lg mb-8 animate-pulse">
                    <p className="text-lg font-bold">⚠️ ATTENTION: PRICE DOUBLES PERMANENTLY WHEN THE TIMER HITS ZERO!</p>
                    <div className="text-2xl font-mono mt-2">
                        <span className="bg-black px-2 py-1 rounded">00</span> DAYS : 
                        <span className="bg-black px-2 py-1 rounded ml-2">04</span> HOURS : 
                        <span className="bg-black px-2 py-1 rounded ml-2">19</span> MINS : 
                        <span className="bg-black px-2 py-1 rounded ml-2">24</span> SECS
                    </div>
                </div>

                {/* Pattern Interrupt Headline */}
                <h1 className="text-5xl md:text-7xl font-extrabold text-[#DAFF00]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    WAIT!
                </h1>
                <p className="text-2xl md:text-3xl font-bold mt-2 mb-4">Your Order Is Not Complete...</p>
                <p className="text-lg md:text-xl text-purple-200/80 max-w-3xl mx-auto">
                    You've Made A Smart Choice, But Your Account Is Currently Limited. Read The Page Below To See How To Remove All Restrictions...
                </p>
                <div className="w-24 h-1 bg-[#DAFF00]/50 mx-auto my-12 rounded-full"></div>

                {/* Social Proof Bar */}
                <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 px-6 rounded-lg mb-8">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">🚀 2,085+ Creators Already Using This</span>
                        <span className="text-sm bg-green-500 px-3 py-1 rounded-full">Last sale: Sydney, Australia (3 minutes ago)</span>
                    </div>
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-[#2A1A5E] p-4 rounded-lg border border-[#4A3F7A]">
                        <div className="text-2xl font-bold text-green-400">10,000+</div>
                        <div className="text-sm text-purple-200">Active Creators</div>
                    </div>
                    <div className="bg-[#2A1A5E] p-4 rounded-lg border border-[#4A3F7A]">
                        <div className="text-2xl font-bold text-white">500K+</div>
                        <div className="text-sm text-purple-200">Scripts Generated</div>
                    </div>
                    <div className="bg-[#2A1A5E] p-4 rounded-lg border border-[#4A3F7A]">
                        <div className="text-2xl font-bold text-white">50M+</div>
                        <div className="text-sm text-purple-200">Views Generated</div>
                    </div>
                    <div className="bg-[#2A1A5E] p-4 rounded-lg border border-[#4A3F7A]">
                        <div className="text-2xl font-bold text-[#DAFF00]">95%</div>
                        <div className="text-sm text-purple-200">Success Rate</div>
                    </div>
                </div>

                {/* Core Offer */}
                <div className="bg-[#2A1A5E] rounded-2xl p-8 md:p-12 shadow-2xl shadow-[#DAFF00]/5 border border-[#4A3F7A]/50">
                    {/* The Problem */}
                    <p className="text-xl text-purple-200 leading-relaxed italic max-w-3xl mx-auto mb-8">
                        "Right now, you're limited to 30 searches a month. What happens when you find a winning niche on day 5? Your momentum dies. <span className="not-italic font-semibold text-white">The pros never limit their potential.</span>"
                    </p>

                    {/* The Solution Image */}
                    <div className="my-10">
                         <img 
                            src="/images/hublogo.png" 
                            alt="VidScriptHub Unlimited Concept" 
                            className="max-w-md h-auto mx-auto rounded-lg shadow-xl shadow-black/30"
                        />
                    </div>

                    {/* The Upgrade Pitch */}
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Upgrade To VidScriptHub <span className="text-[#DAFF00]">UNLIMITED</span> And 10x Your Content Output Instantly.
                    </h2>

                    {/* Benefit List */}
                    <div className="max-w-2xl mx-auto text-left space-y-4 mb-12">
                        {benefits.map((benefit, index) => (
                             <div key={index} className="flex items-center space-x-3 bg-[#1A0F3C]/50 p-4 rounded-lg">
                                <CheckCircleIcon className="w-7 h-7 text-[#DAFF00] flex-shrink-0" />
                                <span className="text-[#F0F0F0] text-lg font-medium">{benefit}</span>
                            </div>
                        ))}
                        {newFeatures.map((feature, index) => (
                             <div key={index} className="flex items-center space-x-3 bg-[#1A0F3C]/50 p-4 rounded-lg">
                                <CheckCircleIcon className="w-7 h-7 text-[#DAFF00] flex-shrink-0" />
                                <div>
                                    <span className="text-[#F0F0F0] text-lg font-bold">
                                        <span className="text-xs uppercase bg-[#DAFF00] text-[#1A0F3C] font-bold px-2 py-0.5 rounded-full mr-2">NEW FEATURE</span>
                                        {feature.title}
                                    </span>
                                    {feature.description && <span className="text-purple-300 ml-1">{feature.description}</span>}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Call to Action (CTA) Block */}
                    <div className="max-w-xl mx-auto">
                        <div className="bg-[#1A0F3C] border-2 border-[#DAFF00] rounded-xl p-6 shadow-lg shadow-[#DAFF00]/20">
                            <h3 className="text-xl font-bold text-white">Get The UNLIMITED Upgrade Now!</h3>
                            <p className="text-5xl font-extrabold text-[#DAFF00] my-3">$67</p>
                            <p className="font-semibold text-white text-lg">One-Time Payment</p>
                            <p className="text-purple-300 text-sm mt-1 line-through">(Normally $47/Month After Launch)</p>
                            <a 
                                href="https://warriorplus.com/o2/buy/kyd6mp/x9sylm/cn135b"
                                className="block w-full bg-[#DAFF00] text-[#1A0F3C] font-bold text-xl md:text-2xl uppercase py-5 px-6 rounded-lg shadow-[0_5px_0px_0px_#a8c400] hover:translate-y-1 hover:shadow-[0_4px_0px_0px_#a8c400] transition-all duration-150 ease-in-out mt-6 text-center"
                            >
                                YES! UPGRADE MY ACCOUNT NOW!
                            </a>
                        </div>
                        <button 
                            onClick={onDecline}
                            className="block mt-6 text-purple-300/70 hover:text-white transition-colors duration-200 text-sm underline"
                        >
                            No thanks, I don't want to go unlimited. I understand I will lose access to this one-time offer forever and my account will remain limited.
                        </button>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="flex justify-center items-center space-x-8 mt-8">
                    <div className="flex items-center space-x-2 text-green-400">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="text-sm font-semibold">SSL Secured</span>
                    </div>
                    <div className="flex items-center space-x-2 text-blue-400">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="text-sm font-semibold">30-Day Guarantee</span>
                    </div>
                    <div className="flex items-center space-x-2 text-purple-400">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                        <span className="text-sm font-semibold">5-Star Rated</span>
                    </div>
                </div>
                
                 <p className="text-purple-300/40 text-xs mt-8">&copy; {new Date().getFullYear()} Vid Script Hub. All Rights Reserved.</p>
            </div>
        </div>
    );
};
