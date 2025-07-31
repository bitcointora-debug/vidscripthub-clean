
import React, { useContext } from 'react';
import { CheckCircleIcon } from './icons/CheckCircleIcon.tsx';
import { AuthContext } from '../context/AuthContext.tsx';

interface Oto1PageProps {
    onNavigateToNextStep: () => void;
}

export const Oto1Page: React.FC<Oto1PageProps> = ({ onNavigateToNextStep }) => {
    const { dispatch } = useContext(AuthContext);

    const handleUpgrade = () => {
        dispatch({ type: 'UPGRADE_TO_UNLIMITED_REQUEST' });
        onNavigateToNextStep();
    }

    return (
        <div className="bg-[#1A0F3C] text-[#F0F0F0] antialiased min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
            <img src="images/oto1-flying-infinity.png" alt="Floating 3D infinity symbol" className="absolute top-1/4 -left-12 w-32 h-32 opacity-10 transform-gpu animate-pulse hidden lg:block" style={{animationDuration: '7s'}} />
            <img src="images/oto1-flying-chart.png" alt="Floating 3D upward chart" className="absolute bottom-1/4 -right-12 w-32 h-32 opacity-10 transform-gpu animate-bounce hidden lg:block" style={{animationDuration: '9s'}} />

            <div className="w-full max-w-4xl mx-auto text-center relative z-10">
                {/* Pattern Interrupt Headline */}
                <h1 className="text-5xl md:text-7xl font-extrabold text-[#DAFF00]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    WAIT!
                </h1>
                <p className="text-2xl md:text-3xl font-bold mt-2 mb-4">Your Order Is Not Complete...</p>
                <p className="text-base md:text-xl text-purple-200/80 max-w-3xl mx-auto">
                    You've Made A Smart Choice, But Your Account Is Currently Limited. Read The Page Below To See How To Remove All Restrictions...
                </p>
                <div className="w-24 h-1 bg-[#DAFF00]/50 mx-auto my-8 md:my-12 rounded-full"></div>

                {/* Core Offer */}
                <div className="bg-[#2A1A5E] rounded-2xl p-6 md:p-12 shadow-2xl shadow-[#DAFF00]/5 border border-[#4A3F7A]/50">
                    {/* The Problem */}
                    <p className="text-lg md:text-xl text-purple-200 leading-relaxed italic max-w-3xl mx-auto mb-8">
                        "Right now, you're limited to 30 searches a month. What happens when you find a winning niche on day 5? Your momentum dies. <span className="not-italic font-semibold text-white">The pros never limit their potential.</span>"
                    </p>

                    {/* The Solution Image */}
                    <div className="my-10">
                         <img 
                            src="images/oto1-unlimited-concept.png" 
                            alt="VidScriptHub Unlimited Concept" 
                            className="max-w-md h-auto mx-auto rounded-lg shadow-xl shadow-black/30"
                        />
                    </div>

                    {/* The Upgrade Pitch */}
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Upgrade To VidScriptHub <span className="text-[#DAFF00]">UNLIMITED</span> And 10x Your Content Output Instantly.
                    </h2>
                    
                    {/* NEW COMPARISON TABLE */}
                    <div className="max-w-2xl mx-auto my-12 text-left">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Standard Column */}
                            <div className="bg-[#1A0F3C]/50 rounded-lg p-6 border border-red-500/50">
                                <h4 className="font-bold text-xl text-red-400 text-center mb-4">Standard</h4>
                                <ul className="space-y-3 text-purple-200 text-sm">
                                    <li className="flex items-start gap-2"><i className="fa-solid fa-times text-red-400 mt-1 flex-shrink-0 w-4 text-center"></i><span>Scripts up to 1 minute</span></li>
                                    <li className="flex items-start gap-2"><i className="fa-solid fa-times text-red-400 mt-1 flex-shrink-0 w-4 text-center"></i><span>Limited Script Generations</span></li>
                                    <li className="flex items-start gap-2"><i className="fa-solid fa-times text-red-400 mt-1 flex-shrink-0 w-4 text-center"></i><span><b className="text-red-300">LOCKED:</b> Advanced Tones</span></li>
                                    <li className="flex items-start gap-2"><i className="fa-solid fa-times text-red-400 mt-1 flex-shrink-0 w-4 text-center"></i><span><b className="text-red-300">LOCKED:</b> Trending Topics Hub</span></li>
                                </ul>
                            </div>
                            {/* Unlimited Column */}
                            <div className="bg-[#DAFF00]/10 rounded-lg p-6 border-2 border-[#DAFF00]">
                                <h4 className="font-bold text-xl text-[#DAFF00] text-center mb-4">UNLIMITED</h4>
                                <ul className="space-y-3 text-white text-sm">
                                    <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-400 mt-1 flex-shrink-0 w-4 text-center"></i><span>Scripts up to 10 minutes</span></li>
                                    <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-400 mt-1 flex-shrink-0 w-4 text-center"></i><span><b>UNLIMITED</b> Script Generations</span></li>
                                    <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-400 mt-1 flex-shrink-0 w-4 text-center"></i><span><b className="text-green-300">UNLOCKED:</b> Advanced Tones</span></li>
                                    <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-400 mt-1 flex-shrink-0 w-4 text-center"></i><span><b className="text-green-300">UNLOCKED:</b> Trending Topics Hub</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action (CTA) Block */}
                    <div className="max-w-xl mx-auto">
                        <div className="bg-[#1A0F3C] border-2 border-[#DAFF00] rounded-xl p-6 md:p-8 shadow-lg shadow-[#DAFF00]/20">
                            <h3 className="text-xl md:text-2xl font-bold text-white">Get The UNLIMITED Upgrade Now!</h3>
                            <div className="flex items-center justify-center gap-4 my-3">
                                <p className="text-xl md:text-2xl text-purple-300 line-through">Regular: $197</p>
                                <p className="text-4xl md:text-6xl font-extrabold text-[#DAFF00]">$67</p>
                            </div>
                            <p className="font-semibold text-white text-base md:text-lg">One-Time Payment</p>
                            <p className="text-purple-300 text-xs md:text-sm mt-1">(Normally $47/Month After Launch)</p>
                            <button 
                                onClick={handleUpgrade}
                                className="block w-full bg-[#DAFF00] text-[#1A0F3C] font-bold text-lg md:text-2xl uppercase py-4 px-5 rounded-lg shadow-[0_5px_0px_0px_#a8c400] hover:translate-y-1 hover:shadow-[0_4px_0px_0px_#a8c400] transition-all duration-150 ease-in-out mt-8"
                            >
                                YES! UPGRADE MY ACCOUNT NOW!
                            </button>
                        </div>
                        <button 
                            onClick={onNavigateToNextStep}
                            className="block mt-6 text-purple-300/70 hover:text-white transition-colors duration-200 text-xs md:text-sm underline"
                        >
                            No thanks, I don't want to go unlimited. I understand I will lose access to this one-time offer forever and my account will remain limited.
                        </button>
                    </div>
                </div>
                
                 <p className="text-purple-300/40 text-xs mt-8">&copy; {new Date().getFullYear()} Vid Script Hub. All Rights Reserved.</p>
            </div>
        </div>
    );
};
