
import React, { useContext } from 'react';
import { UIContext } from '../context/UIContext.tsx';

interface UpgradeModalProps {
    onInitiateUpgrade: (targetFlow: 'oto1' | 'oto2' | 'oto3') => void;
}

const planDetails = {
    unlimited: {
        title: "Upgrade to UNLIMITED",
        icon: "fa-solid fa-infinity",
        targetFlow: "oto1" as 'oto1',
        features: [
            "Generate scripts up to 10 minutes long",
            "Unlimited script generations per month",
            "Access the real-time Trending Topics Hub",
            "Unlock Advanced Tonal Styles (Controversial, Shocking, etc.)",
            "Unlock Premium AI Voices (Coming Soon)"
        ]
    },
    dfy: {
        title: "Get the DFY Content Vault",
        icon: "fa-solid fa-gem",
        targetFlow: "oto2" as 'oto2',
        features: [
            "Access the Viral Hooks Swipe File",
            "Unlock the Trending Audio Masterclass",
            "Get Exclusive Bonus content and case studies",
            "Receive 20 new professionally-written scripts every month"
        ]
    },
    agency: {
        title: "Get Your Agency License",
        icon: "fa-solid fa-briefcase",
        targetFlow: "oto3" as 'oto3',
        features: [
            "Unlock the 'Manage Clients' Dashboard",
            "Unlock the 'Reseller Zone' with promotional materials",
            "Get a license to sell Vid Script Hub and keep 100% of the profits",
            "Provide script-writing services to your own clients"
        ]
    }
};

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ onInitiateUpgrade }) => {
    const { state, dispatch } = useContext(UIContext);
    const { upgradeModalState } = state;
    const { isOpen, plan } = upgradeModalState;

    if (!isOpen || !plan) return null;
    
    const details = planDetails[plan];

    const handleClose = () => {
        dispatch({ type: 'CLOSE_UPGRADE_MODAL' });
    };

    const handleUpgrade = () => {
        onInitiateUpgrade(details.targetFlow);
        handleClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={handleClose}
        >
            <div 
                className="bg-gradient-to-br from-[#2A1A5E] to-[#1A0F3C] rounded-xl border-2 border-[#4A3F7A] shadow-2xl shadow-black/50 w-full max-w-lg p-8 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-purple-300 hover:text-white transition-colors duration-200"
                >
                    <i className="fa-solid fa-times text-2xl"></i>
                </button>
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-[#DAFF00] text-[#1A0F3C] flex items-center justify-center mx-auto mb-4">
                        <i className={`${details.icon} text-3xl`}></i>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">{details.title}</h2>
                    <p className="text-purple-200 mb-6">This feature is locked. Unlock it now to supercharge your results!</p>

                    <div className="text-left bg-[#1A0F3C]/50 p-4 rounded-lg my-6 space-y-3">
                        <h4 className="font-bold text-white text-center mb-3">Here's what you'll unlock:</h4>
                        {details.features.map((feature, index) => (
                             <div key={index} className="flex items-start gap-3">
                                <i className="fa-solid fa-check-circle text-green-400 text-lg mt-1 flex-shrink-0"></i>
                                <span className="text-purple-200">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <button 
                            onClick={handleClose} 
                            className="w-full px-6 py-3 text-sm font-bold bg-transparent border-2 border-[#4A3F7A] text-purple-200 rounded-md hover:bg-[#2A1A5E] hover:text-white transition-all duration-200"
                        >
                            Maybe Later
                        </button>
                        <button 
                            onClick={handleUpgrade}
                            className="w-full px-6 py-3 text-sm font-bold bg-[#DAFF00] text-[#1A0F3C] rounded-md hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105"
                        >
                            Upgrade Now & Unlock
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
