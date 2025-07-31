
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.tsx';

interface Oto2PageProps {
    onNavigateToNextStep: () => void;
}

export const Oto2Page: React.FC<Oto2PageProps> = ({ onNavigateToNextStep }) => {
    const { dispatch } = useContext(AuthContext);

    const handlePurchase = () => {
        dispatch({ type: 'PURCHASE_DFY_VAULT_REQUEST' });
        onNavigateToNextStep();
    };

    return (
        <div className="bg-[#F7F8FC] text-[#1A1A1A] antialiased min-h-screen flex flex-col justify-center py-12 px-4 relative overflow-hidden">
            <img src="images/oto2-flying-folder.png" alt="Floating 3D folder icon" className="absolute top-1/4 -left-12 w-32 h-32 opacity-5 transform-gpu animate-bounce hidden lg:block" style={{animationDuration: '9s'}} />
            <img src="images/oto2-flying-star.png" alt="Floating 3D star icon" className="absolute bottom-1/3 -right-12 w-28 h-28 opacity-5 transform-gpu animate-pulse hidden lg:block" style={{animationDuration: '7s'}} />

            <div className="w-full max-w-5xl mx-auto text-center relative z-10">

                {/* Headline */}
                <h1 className="text-4xl md:text-6xl font-extrabold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Want To Put VidScriptHub On <span className="text-[#2A1A5E]">Complete Autopilot?</span>
                </h1>
                <p className="text-base md:text-xl font-semibold mt-4 text-gray-700 max-w-3xl mx-auto">
                    This Is Your ONE CHANCE To Clone Our Private "Done-For-You" Vault of Profit-Ready Scripts & Viral Assets...
                </p>
                <div className="w-24 h-1.5 bg-gray-300 mx-auto my-8 md:my-12 rounded-full"></div>

                {/* Core Offer */}
                <div className="bg-white rounded-2xl p-6 md:p-12 shadow-xl border border-gray-200">
                    {/* The Problem */}
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed italic max-w-3xl mx-auto mb-8">
                        "You now have the tool to create amazing scripts... but you still have to do the initial research. <span className="font-semibold text-[#1A1A1A] not-italic">What if you're too busy? Or just want the fastest results possible?</span>"
                    </p>

                    {/* The Solution Image */}
                    <div className="my-10">
                        <img 
                            src="images/oto2-dfy-vault.png" 
                            alt="VidScriptHub DFY Content Vault" 
                            className="max-w-xl h-auto mx-auto rounded-lg shadow-2xl"
                        />
                    </div>
                    
                    {/* WHAT YOU GET SECTION */}
                    <div className="my-12 md:my-16 text-left max-w-3xl mx-auto">
                        <h3 className="text-2xl md:text-3xl font-bold text-center text-[#1A1A1A] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>Here's Exactly What You're Unlocking:</h3>
                        <div className="space-y-4">
                            <div className="bg-white p-4 rounded-lg shadow-md border flex items-center gap-4">
                                <i className="fa-solid fa-scroll text-2xl text-purple-600 w-8 text-center"></i>
                                <div>
                                    <h4 className="font-bold text-[#1A1A1A]">100+ Done-For-You Scripts</h4>
                                    <p className="text-sm text-gray-600">In the hottest niches, ready to shoot.</p>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-md border flex items-center gap-4">
                                <i className="fa-solid fa-fish-fins text-2xl text-purple-600 w-8 text-center"></i>
                                <div>
                                    <h4 className="font-bold text-[#1A1A1A]">The Viral Hooks Swipe File</h4>
                                    <p className="text-sm text-gray-600">50+ copy-paste hooks to make any video go viral.</p>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-md border flex items-center gap-4">
                                <i className="fa-solid fa-headphones-simple text-2xl text-purple-600 w-8 text-center"></i>
                                <div>
                                    <h4 className="font-bold text-[#1A1A1A]">Trending Audio Masterclass</h4>
                                    <p className="text-sm text-gray-600">Learn how to leverage trending sounds for easy views.</p>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-md border flex items-center gap-4">
                                <i className="fa-solid fa-gift text-2xl text-purple-600 w-8 text-center"></i>
                                <div>
                                    <h4 className="font-bold text-[#1A1A1A]">Exclusive Bonus Content</h4>
                                    <p className="text-sm text-gray-600">Access to case studies and guides not available anywhere else.</p>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-md border flex items-center gap-4">
                                <i className="fa-solid fa-calendar-days text-2xl text-purple-600 w-8 text-center"></i>
                                <div>
                                    <h4 className="font-bold text-[#1A1A1A]">20 New Scripts Every Month</h4>
                                    <p className="text-sm text-gray-600">Your vault is always growing with fresh, relevant content.</p>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Call to Action (CTA) Block */}
                    <div className="max-w-xl mx-auto">
                         <div className="bg-white border-2 border-gray-300 rounded-xl p-6 md:p-8 shadow-2xl mb-8">
                            <h3 className="text-xl md:text-2xl font-bold text-[#1A1A1A]">Add The "Done-For-You" Vault To Your Order</h3>
                            <div className="flex items-center justify-center gap-4 my-3">
                                <p className="text-xl md:text-2xl text-gray-500 line-through">Value: $297</p>
                                <p className="text-4xl md:text-6xl font-extrabold text-[#1A0F3C]">$97</p>
                            </div>
                            <p className="font-semibold text-gray-800 text-base md:text-lg">One-Time Payment, Lifetime Access</p>
                        </div>
                        <button 
                            onClick={handlePurchase}
                            className="block w-full bg-[#DAFF00] text-[#1A0F3C] font-bold text-lg md:text-2xl uppercase py-4 px-5 rounded-lg shadow-[0_5px_0px_0px_#a8c400] hover:translate-y-1 hover:shadow-[0_4px_0px_0px_#a8c400] transition-all duration-150 ease-in-out"
                        >
                            YES! Add The DFY Content Bank To My Order!
                        </button>
                        <button 
                            onClick={onNavigateToNextStep}
                            className="block mt-6 text-gray-500 hover:text-black transition-colors duration-200 text-xs md:text-sm underline"
                        >
                            No thanks, I'm happy to do all the research and hard work myself.
                        </button>
                    </div>
                </div>
            </div>
             <p className="text-gray-400 text-xs mt-8 text-center">&copy; {new Date().getFullYear()} Vid Script Hub. All Rights Reserved.</p>
        </div>
    );
};
