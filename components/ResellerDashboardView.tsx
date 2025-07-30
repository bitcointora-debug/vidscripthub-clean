import React, { useState } from 'react';

interface StatCardProps { icon: string; value: string; label: string; }
interface ResellerDashboardViewProps { 
    addNotification: (message: string) => void;
    dashboardStats: { clicks: number; sales: number; earnings: number };
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => (
    <div className="bg-[#2A1A5E] p-4 rounded-xl border border-[#4A3F7A]/50 flex items-center space-x-4">
        <div className="bg-[#1A0F3C] p-3 rounded-lg"><i className={`${icon} text-2xl text-[#DAFF00]`}></i></div>
        <div><p className="text-2xl font-bold text-white">{value}</p><p className="text-sm text-purple-200">{label}</p></div>
    </div>
);

const emailSwipes = [
    {
      title: "EMAIL SWIPE #1 - The 'Problem/Agitate/Solve' Angle",
      subject: "Still staring at a blank screen?",
      body: "Hey [Name],\n\nEver feel like you have a million video ideas, but when you hit record... nothing comes out?\n\nOr worse, you spend HOURS creating what you think is a masterpiece, only to see it get less than 100 views.\n\nIt feels like you're shouting into the void, completely ignored by the algorithm.\n\nWhat if you could stop guessing?\n\nWhat if you could ethically \"clone\" what's already proven to go viral, and get unique, high-converting scripts written FOR YOU in seconds?\n\nThat's exactly what Vid Script Hub does.\n\nIt's a new A.I. tool that analyzes top-performing videos in any niche and writes you scripts that are designed to stop the scroll and get views.\n\nNo more writer's block. No more wasted effort.\n\nJust proven formulas, ready to go.\n\n[==> Insert Your Reseller Link Here <==]\n\nCheck it out and see for yourself.\n\nCheers,\n[Your Name]"
    },
    {
      title: "EMAIL SWIPE #2 - The 'Benefit-Driven' Angle",
      subject: "Generate 5 viral video scripts in 37 seconds",
      body: "Hey [Name],\n\nImagine this:\n\n- You type in a single keyword (like \"dog training\").\n- You click \"Generate\".\n- 37 seconds later, you have 5 unique, ready-to-film video scripts complete with hooks, main content, and calls to action.\n\nThat's the power of Vid Script Hub.\n\nIt's a new Google-powered AI app that automates 99% of your content creation process.\n\n- Instantly end \"creator's block\" forever.\n- Leverage AI to know what's trending RIGHT NOW.\n- Automate your content research and writing.\n\nIf you want to finally start posting consistently and getting the views you deserve, you need to see this.\n\n[==> Insert Your Reseller Link Here <==]\n\nThis is the shortcut you've been looking for.\n\nTo your success,\n[Your Name]"
    },
    {
      title: "EMAIL SWIPE #3 - The 'Scarcity/Urgency' Angle",
      subject: "This is your last chance...",
      body: "Hey [Name],\n\nI don't want you to miss out on this.\n\nThe special launch pricing for Vid Script Hub is ending soon.\n\nThis is the revolutionary AI tool that writes viral video scripts for you, and right now, you can get lifetime access for a tiny one-time fee.\n\nOnce the timer on the page hits zero, the price is going up significantly, and it will likely become a monthly subscription.\n\nIf you want to lock in your lifetime access and get all the launch bonuses (worth over $900), you need to act now.\n\nDon't pay more later for the exact same tool.\n\n[==> Click here to secure your lifetime license before it's too late <==]\n[==> Insert Your Reseller Link Here <==]\n\nThis is your final warning.\n\nBest,\n[Your Name]"
    }
  ];

export const ResellerDashboardView: React.FC<ResellerDashboardViewProps> = ({ addNotification, dashboardStats }) => {
    const [copied, setCopied] = useState(false);
    const resellerLink = "https://vidscripthub.com/resell/YOUR_ID_12345";
    const [expandedSwipe, setExpandedSwipe] = useState<number | null>(null);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(resellerLink);
        setCopied(true);
        addNotification("Reseller link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCopySwipe = (subject: string, body: string) => {
        const fullContent = `Subject: ${subject}\n\n${body.replace(/\[==> Insert Your Reseller Link Here <==\]/g, resellerLink)}`;
        navigator.clipboard.writeText(fullContent);
        addNotification("Email swipe copied to clipboard!");
    }
    
    const handleDownloadBanners = () => {
        addNotification("Our design team is creating fresh banners! They will be available for download here soon.");
    }
    
    const statsData = [
        { icon: 'fa-solid fa-computer-mouse', value: dashboardStats.clicks.toLocaleString(), label: 'Total Clicks' },
        { icon: 'fa-solid fa-cart-shopping', value: dashboardStats.sales.toLocaleString(), label: 'Total Sales' },
        { icon: 'fa-solid fa-percent', value: dashboardStats.clicks > 0 ? ((dashboardStats.sales / dashboardStats.clicks) * 100).toFixed(2) : '0.00', label: 'Conversion Rate' },
        { icon: 'fa-solid fa-wallet', value: `$${dashboardStats.earnings.toLocaleString()}`, label: 'Total Earnings' },
    ];

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Promote VidScriptHub & Keep 100% Of The Profits</h1>
                <p className="text-purple-300">Use your unique link to drive sales and track your earnings in real-time.</p>
            </div>
            <div className="bg-[#2A1A5E] border-2 border-dashed border-[#DAFF00]/50 rounded-xl p-6 mb-10">
                <label className="block text-sm font-medium text-purple-200 mb-2">Your Unique Reseller Link</label>
                <div className="flex flex-col md:flex-row gap-4">
                    <input type="text" readOnly value={resellerLink} className="w-full bg-[#1A0F3C] border border-[#4A3F7A] rounded-md py-3 px-4 text-[#F0F0F0] cursor-pointer" onClick={(e) => (e.target as HTMLInputElement).select()} />
                    <button onClick={handleCopyLink} className="w-full md:w-auto flex-shrink-0 flex items-center justify-center bg-[#DAFF00] text-[#1A0F3C] font-bold py-3 px-6 rounded-md hover:bg-opacity-90 transition-all duration-200">
                        {copied ? (<><i className="fa-solid fa-check mr-2"></i>Copied!</>) : (<><i className="fa-solid fa-copy mr-2"></i>Copy Link</>)}
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {statsData.map(stat => <StatCard key={stat.label} {...stat} />)}
            </div>
            <div>
                 <h2 className="text-2xl font-bold text-white mb-6 text-center">Promotional Tools</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Banners */}
                    <div className="bg-[#2A1A5E]/50 p-6 rounded-xl border border-[#4A3F7A]/30 flex flex-col items-center justify-center text-center">
                        <i className="fa-solid fa-image-portrait text-5xl text-[#DAFF00] mb-4"></i>
                        <h3 className="text-xl font-bold text-white mb-2">Banner Ads</h3>
                        <p className="text-sm text-purple-200 mb-4">High-converting banners for your website or ad campaigns.</p>
                        <button onClick={handleDownloadBanners} className="w-full flex items-center justify-center bg-[#1A0F3C] border-2 border-[#4A3F7A] text-purple-100 font-semibold py-3 px-6 rounded-md hover:bg-[#2A1A5E] hover:border-[#DAFF00]/50 transition-all duration-200">
                            <i className="fa-solid fa-download mr-2"></i>Get Banner Ads
                        </button>
                    </div>
                    {/* Email Swipes */}
                    <div className="bg-[#2A1A5E]/50 p-6 rounded-xl border border-[#4A3F7A]/30">
                        <div className="text-center mb-4">
                            <i className="fa-solid fa-envelope-open-text text-5xl text-[#DAFF00] mb-4"></i>
                            <h3 className="text-xl font-bold text-white mb-2">Email Swipes</h3>
                            <p className="text-sm text-purple-200">Proven email copy to send to your list.</p>
                        </div>
                        <div className="space-y-2">
                            {emailSwipes.map((swipe, index) => (
                                <div key={index} className="bg-[#1A0F3C] rounded-lg overflow-hidden">
                                    <button onClick={() => setExpandedSwipe(expandedSwipe === index ? null : index)} className="w-full p-3 text-left flex justify-between items-center">
                                        <span className="font-semibold text-purple-100">{swipe.title}</span>
                                        <i className={`fa-solid fa-chevron-down text-purple-300 transition-transform ${expandedSwipe === index ? 'rotate-180' : ''}`}></i>
                                    </button>
                                    {expandedSwipe === index && (
                                        <div className="p-4 border-t border-[#4A3F7A]/50">
                                            <div className="mb-4">
                                                <label className="text-xs font-bold text-purple-300 uppercase">Subject</label>
                                                <p className="text-sm text-white bg-[#2A1A5E]/50 p-2 rounded">{swipe.subject}</p>
                                            </div>
                                            <div className="mb-4">
                                                <label className="text-xs font-bold text-purple-300 uppercase">Body</label>
                                                <pre className="text-sm text-white whitespace-pre-wrap font-sans bg-[#2A1A5E]/50 p-2 rounded max-h-60 overflow-y-auto">{swipe.body}</pre>
                                            </div>
                                            <button onClick={() => handleCopySwipe(swipe.subject, swipe.body)} className="w-full text-center bg-[#DAFF00] text-[#1A0F3C] font-bold py-2 px-4 rounded-md text-sm hover:bg-opacity-90">
                                                <i className="fa-solid fa-copy mr-2"></i>Copy This Swipe
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    );
};