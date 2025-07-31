
import React from 'react';
import { downloadEmailSwipes, downloadGraphicsPack } from '../services/assetService.ts';

const InfoCard: React.FC<{ icon: string, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-[#2A1A5E]/50 rounded-xl border border-[#4A3F7A]/30 p-6">
        <div className="flex items-start gap-4">
            <i className={`${icon} text-2xl text-[#DAFF00] mt-1`}></i>
            <div>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <div className="text-purple-200/90 space-y-2 text-sm leading-relaxed">{children}</div>
            </div>
        </div>
    </div>
);

export const ResellerZoneView: React.FC = () => {
    const resellerLink = "https://warriorplus.com/as/o/YOUR_AFFILIATE_ID";

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Agency & Reseller Zone</h1>
                <p className="text-purple-300">Welcome! Here are your tools to start earning with Vid Script Hub.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <InfoCard icon="fa-solid fa-link" title="Your Reseller Link">
                    <p>This is your unique link to promote Vid Script Hub. You earn 100% commissions on the entire funnel for every sale you refer.</p>
                    <div className="mt-4">
                        <label className="text-xs font-semibold text-purple-300 uppercase">Your Link:</label>
                        <input
                            type="text"
                            readOnly
                            value={resellerLink}
                            className="w-full bg-[#1A0F3C] border border-[#4A3F7A] rounded-md py-2 px-3 text-[#F0F0F0] mt-1"
                        />
                         <button
                            onClick={() => navigator.clipboard.writeText(resellerLink)}
                            className="text-xs font-bold text-[#DAFF00] hover:underline mt-2"
                        >
                            <i className="fa-solid fa-copy mr-1"></i> Copy to Clipboard
                        </button>
                    </div>
                </InfoCard>

                 <InfoCard icon="fa-solid fa-envelope-open-text" title="Email Swipes">
                    <p>We've prepared high-converting email swipes for you to send to your list. Just copy, paste, and add your link!</p>
                     <div className="mt-4">
                        <button onClick={downloadEmailSwipes} className="bg-[#DAFF00] text-[#1A0F3C] font-bold py-2 px-4 rounded-md text-sm hover:bg-opacity-90">
                            <i className="fa-solid fa-download mr-2"></i> Download Email Swipes
                        </button>
                    </div>
                </InfoCard>

                 <InfoCard icon="fa-solid fa-image" title="Promotional Banners">
                    <p>A complete set of professionally designed banners and ad creatives for your campaigns.</p>
                     <div className="mt-4">
                        <button onClick={downloadGraphicsPack} className="bg-[#DAFF00] text-[#1A0F3C] font-bold py-2 px-4 rounded-md text-sm hover:bg-opacity-90">
                           <i className="fa-solid fa-download mr-2"></i> Download Graphics Pack
                        </button>
                    </div>
                </InfoCard>
                
                 <InfoCard icon="fa-solid fa-users" title="Agency Client Management">
                    <p>Remember, your Agency License also lets you manage clients directly. Use the "Manage Clients" tab to add clients, generate scripts for them, and charge for your services.</p>
                     <div className="mt-4">
                        <p className="text-xs text-purple-300">This is the perfect way to build a recurring monthly income stream!</p>
                    </div>
                </InfoCard>
            </div>
            
            <div className="bg-yellow-900/20 border border-yellow-500/30 text-yellow-200 px-6 py-4 rounded-lg text-center">
                <p className="font-bold">IMPORTANT: How You Get Paid</p>
                <p className="text-sm mt-1">All reseller commissions are paid out through the WarriorPlus platform. Please ensure your payment details are correctly set up in your WarriorPlus account.</p>
            </div>
        </div>
    );
};