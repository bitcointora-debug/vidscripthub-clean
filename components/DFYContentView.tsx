import React, { useState, useMemo, useCallback } from 'react';
import type { Script } from '../types';
import { ScriptCard } from './ScriptCard';
import { RemixScriptModal } from './RemixScriptModal';
import { generateBonusPdf } from '../services/pdfService';

export const mockDfyScripts: Script[] = [
    { id: 'dfy-1', title: "3 'Healthy' Foods That Are Actually Scams", hook: "You won't believe what's hiding in your 'healthy' snacks...", script: "VOICEOVER: You think you're eating healthy? Think again.\n[SCENE]: A vibrant, colorful shot of a fruit yogurt parfait. Looks delicious.\n[SOUND EFFECT: record scratch]\nON-SCREEN TEXT: High in Sugar!\nVOICEOVER: This is packed with more sugar than a candy bar. The 'fruit' is basically jam.\n[SCENE]: A hand grabbing a handful of granola from a bag.\nON-SCREEN TEXT: Mostly Processed Oats & Oil!\nVOICEOVER: And this 'wholesome' granola? It's basically dessert, coated in oil and sugar.\n[SCENE]: A bag of veggie chips next to actual vegetables.\nVOICEOVER: Don't even get me started on these. They're just potato chips in disguise with a sprinkle of vegetable powder. \nON-SCREEN TEXT: Follow for more health truths.", tone: 'Shocking', niche: 'Weight Loss', isNew: true },
    { id: 'dfy-2', title: "The Easiest Side Hustle You Can Start TODAY", hook: "I made $200 last weekend with this simple side hustle...", script: "VOICEOVER: Stop scrolling and start earning. \n[SCENE]: Show a person cleaning a slightly dirty car headlight with a microfiber towel.\n[CAMERA ANGLE: Close-up on the yellow, hazy grime]\nVOICEOVER: This is headlight restoration. You can buy a kit for $20 online.\n[SCENE]: A super satisfying before-and-after shot of a crystal clear headlight.\n[SOUND EFFECT: Sparkle]\nVOICEOVER: And you can charge $50 per car for 30 minutes of work. That's $100 an hour for making cars safer and look better.\nON-SCREEN TEXT: Want more side hustles? Link in bio!", tone: 'Educational', niche: 'Make Money', isNew: true },
    { id: 'dfy-3', title: "This Fitness Myth is Destroying Your Progress", hook: "If you're still doing hours of cardio, you need to see this.", script: "VOICEOVER: You've been told cardio is the key to fat loss. You've been lied to.\n[SCENE]: Show someone looking exhausted and bored on a treadmill in black and white.\nON-SCREEN TEXT: Endless Cardio = High Cortisol\nVOICEOVER: Endless cardio can actually raise your cortisol levels, a stress hormone that makes you store MORE belly fat.\n[SCENE]: Show a person lifting weights, looking powerful and focused, in full color.\nON-SCREEN TEXT: Strength Training = Higher Metabolism\nVOICEOVER: Prioritize strength training to build muscle. More muscle burns more calories 24/7, even when you're resting. Your body will thank you.", tone: 'Data-Driven', niche: 'Fitness' },
    { id: 'dfy-4', title: "The 5-Second Rule to Stop Procrastinating", hook: "This simple trick will change your life.", script: "VOICEOVER: The moment you feel yourself hesitating to do something you know you should do... \n[SCENE]: A person staring at a laptop, hesitating to start work. The world is in slow motion.\nVOICEOVER: ...count backwards. 5-4-3-2-1. And when you hit 1, MOVE.\n[SCENE]: The person physically pushes back from the table and stands up at normal speed.\n[SOUND EFFECT: Whoosh]\nVOICEOVER: This interrupts your brain's habit of making excuses and forces you into action. It's a mental trick to launch yourself. Try it now.", tone: 'Inspirational', niche: 'Productivity' },
    { id: 'dfy-5', title: "Unboxing the new AI Pin That's Replacing Phones", hook: "Is this the end of the iPhone?", script: "VOICEOVER: This little device right here? It might just replace your smartphone.\n[SCENE]: A clean, aesthetic unboxing of the Humane AI Pin, showing its sleek design.\nVOICEOVER: It has no screen. You just talk to it. It has a camera, a projector, and it's powered by AI.\n[SCENE]: Demonstrating a feature, like holding up a piece of fruit and the pin projecting nutritional info onto their hand.\nON-SCREEN TEXT: '105 Calories, 27g Carbs'\nVOICEOVER: The future is weird, but I'm here for it. Full review coming soon.", tone: 'Tech', niche: 'Tech' },
    { id: 'dfy-6', title: "IKEA Hack: Turn a $20 Shelf into a Masterpiece", hook: "Don't buy this, HACK it.", script: "VOICEOVER: Don't just build your IKEA furniture, transform it.\n[SCENE]: Show a basic, boring IKEA 'KALLAX' shelf unit.\nON-SCREEN TEXT: Boring Kallax Shelf: $20\nVOICEOVER: We're taking this shelf and making it look custom. You'll need paint, fluted wood trim, and a good adhesive.\n[SCENE]: A satisfying timelapse of painting the shelf and precisely attaching the trim, all set to upbeat music.\n[ACTION: Show the final product, now looking like a high-end designer piece of furniture.]\nVOICEOVER: And just like that... a custom piece that looks like it's from a high-end store.", tone: 'DIY', niche: 'DIY' },
    { id: 'dfy-7', title: "Crypto Investing for Absolute Beginners (in 60s)", hook: "Here's everything you need to know to start investing in crypto.", script: "VOICEOVER: Crypto seems confusing, right? Let's fix that. \n[SCENE]: Show logos of trusted crypto exchanges like Coinbase or Kraken on a phone screen.\nON-SCREEN TEXT: Step 1: Use a Trusted Exchange\nVOICEOVER: Download a major, trusted exchange. This is where you buy.\n[SCENE]: Show the logos of Bitcoin and Ethereum prominently.\nON-SCREEN TEXT: Step 2: Start with the 'Blue Chips'\nVOICEOVER: For your first buys, stick with the big two: Bitcoin and Ethereum. They're the most established.\n[SCENE]: A screen recording of someone setting up a recurring buy for a small amount, like $25.\nON-SCREEN TEXT: Step 3: Dollar-Cost Average\nVOICEOVER: Buy a small, fixed amount every week or month. Don't try to time the market. This is the safest way to start. You're welcome.", tone: 'Educational', niche: 'Make Money' },
    // more scripts...
    { id: 'dfy-40', title: "How a 'Sinking Fund' Prevents Financial Emergencies", hook: "This simple bank account trick will save you from debt.", script: "VOICEOVER: Stop letting unexpected expenses like car repairs become financial emergencies.\n[SCENE]: A person looking stressed, holding a huge car repair bill with a dramatic red 'PAST DUE' stamp on it.\nON-SCREEN TEXT: The Problem: The 'Oh No!' Fund\nVOICEOVER: Most people have one savings account. It feels painful to use it for a car repair or a new fridge.\n[SCENE]: Show a clean, organized banking app with multiple, named savings accounts: 'Car Repairs: $240', 'Vacation: $500', 'New Laptop: $150'.\nON-SCREEN TEXT: The Solution: Sinking Funds\nVOICEOVER: This is a 'sinking fund'. You create separate savings accounts for specific, future expenses. Every payday, you automatically transfer a small amount into each one. $20 to car repairs, $50 to vacation.\n[SCENE]: The person now pays the car repair bill with a calm expression, easily transferring money from their 'Car Repairs' sinking fund.\nVOICEOVER: Now, when your car breaks down, it's not an emergency. It's just an expense you already planned for. You're not touching your real emergency fund; you're just using the money you set aside for that exact purpose.", tone: 'Educational', niche: 'Personal Finance' },

];

const niches = ['All', 'Weight Loss', 'Make Money', 'Fitness', 'Productivity', 'Tech', 'DIY', 'Cooking', 'Pets', 'Travel', 'Gardening', 'Real Estate', 'Parenting', 'Gaming', 'Car Detailing', 'Relationships', 'Personal Finance', 'Philosophy', 'History', 'Career', 'Psychology'];

const viralHooks = {
    "Controversial & Bold Statements": [
        "Everything you know about [topic] is a lie.",
        "I'm about to get cancelled for this, but someone has to say it...",
        "Hot take: [Popular opinion/product] is actually terrible and here's the proof.",
        "Unpopular opinion: You should be doing [counter-intuitive action] instead of [common action].",
        "Stop doing [common activity] right now. It's killing your [results].",
        "The [industry] is lying to you about [topic].",
        "Your [teacher/parent/boss] was wrong about [topic].",
        "Here's the uncomfortable truth about [popular trend].",
    ],
    "Problem & Agitation Hooks": [
        "The real reason you're failing at [goal]. (It's not what you think).",
        "You're making this one mistake with [topic] and it's costing you dearly.",
        "If you have [specific problem], you need to watch this entire video.",
        "Your [product/item] is dirtier than you think. Let's look under a microscope.",
        "The ugly truth about the [industry/topic] industry they don't want you to see.",
        "Your [body part] pain isn't from [common reason], it's from this.",
        "This 'healthy' habit is actually making you [negative outcome].",
        "Why you feel so tired all the time.",
    ],
    "Question & Curiosity Hooks": [
        "What if I told you that [common belief] is completely wrong?",
        "Why is nobody talking about this [topic/method]?",
        "How I went from [negative state] to [positive state] in 30 days.",
        "Have you ever wondered how [desirable outcome] is possible with so little effort?",
        "What's the real difference between [item A] and [item B]?",
        "Did you know about the secret feature inside your [common object]?",
        "Can you spot the mistake in this [image/video clip]?",
        "How much does it really cost to [achieve something]?",
    ],
    "Listicle & \"How-To\" Hooks": [
        "3 signs you're about to [achieve a goal/face a problem].",
        "Here's my 5-step process for a perfect [result] every single time.",
        "The top 5 [tools/apps/books] for [niche] that feel like a cheat code.",
        "Here's how to [do something difficult] in under 60 seconds.",
        "The only 3 [exercises/tips/tricks] you'll ever need for [topic].",
        "My 4-part framework for mastering [skill].",
        "7 things I wish I knew before I started [activity].",
        "The A-B-C method for solving [problem].",
    ],
    "Relatability & \"Us vs. Them\" Hooks": [
        "POV: You're a [specific type of person] and this happens every time.",
        "Tell me you're a [niche enthusiast] without telling me you're a [niche enthusiast]. I'll go first.",
        "They don't want you to know this secret about [topic].",
        "Rich people do this one thing differently when it comes to [topic].",
        "The top 1% have been using this [method/tool] for years.",
        "If you remember this, your childhood was awesome.",
        "Finally, someone says it: [common relatable frustration].",
        "Every [specific group] needs to hear this right now."
    ]
};

const bonuses = [
    { title: "Profit Niches Exposed", description: "Our secret list of 20+ underexploited niches where you can go viral fast.", icon: "fa-solid fa-lightbulb" },
    { title: "The 60-Second Video Toolkit", description: "A simple checklist for shooting high-quality viral videos with just your smartphone.", icon: "fa-solid fa-camera" },
    { title: "The Viral Monetization Blueprint", description: "Learn 5 easy ways to turn your newfound views into actual, spendable cash.", icon: "fa-solid fa-sack-dollar" },
];

type Tab = 'Scripts' | 'Hooks' | 'Audio' | 'Bonuses';

interface DFYContentViewProps {
    onOpenSaveModal: (script: Script) => void;
    onUnsaveScript: (scriptId: string) => void;
    isScriptSaved: (script: Script) => boolean;
    scoringScriptId: string | null;
    addNotification: (message: string) => void;
    onVisualize: (scriptId: string, artStyle: string) => void;
    visualizingScriptId: string | null;
    onToggleSpeech: (script: Script) => void;
    speakingScriptId: string | null;
    onRemixScript: (baseScript: Script, newTopic: string) => void;
    isRemixing: boolean;
}

export const DFYContentView: React.FC<DFYContentViewProps> = ({ 
    onOpenSaveModal, onUnsaveScript, isScriptSaved, scoringScriptId, addNotification,
    onVisualize, visualizingScriptId, onToggleSpeech, speakingScriptId, onRemixScript, isRemixing
}) => {
    const [activeTab, setActiveTab] = useState<Tab>('Scripts');
    const [activeNiche, setActiveNiche] = useState('All');
    const [remixModalOpen, setRemixModalOpen] = useState(false);
    const [scriptToRemix, setScriptToRemix] = useState<Script | null>(null);

    const filteredScripts = useMemo(() => {
        if (activeNiche === 'All') return mockDfyScripts;
        return mockDfyScripts.filter(script => script.niche === activeNiche);
    }, [activeNiche]);
    
    const handleOpenRemixModal = (script: Script) => {
        setScriptToRemix(script);
        setRemixModalOpen(true);
    };

    const handleConfirmRemix = (baseScript: Script, newTopic: string) => {
        onRemixScript(baseScript, newTopic);
        setRemixModalOpen(false);
    };
    
    const handleHookCopy = useCallback((hookText: string) => {
        navigator.clipboard.writeText(hookText);
        addNotification("Hook copied to clipboard!");
    }, [addNotification]);

    const handleDownloadBonus = (title: string) => {
        addNotification(`Generating PDF for "${title}"...`);
        try {
            generateBonusPdf(title);
        } catch (error) {
            console.error("PDF Generation failed:", error);
            addNotification("Sorry, could not generate the PDF at this time.");
        }
    };

    const TabButton: React.FC<{tabName: Tab, currentTab: Tab, children: React.ReactNode, icon: string}> = ({ tabName, currentTab, children, icon }) => (
        <button onClick={() => setActiveTab(tabName)} className={`flex-1 group flex items-center justify-center gap-2 px-3 py-3 text-sm font-bold rounded-t-lg transition-all duration-200 border-b-4 ${currentTab === tabName ? 'text-[#DAFF00] border-[#DAFF00]' : 'text-purple-300 border-transparent hover:text-white hover:bg-[#4A3F7A]/30'}`}>
            <i className={`${icon} transition-colors duration-200 ${currentTab === tabName ? 'text-[#DAFF00]' : 'text-purple-300/70 group-hover:text-white'}`}></i>
            {children}
        </button>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'Scripts':
                return (
                    <>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {niches.map(niche => (
                                <button key={niche} onClick={() => setActiveNiche(niche)} className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${activeNiche === niche ? 'bg-[#DAFF00] text-[#1A0F3C]' : 'bg-[#2A1A5E] text-purple-200 hover:bg-[#4A3F7A]/80'}`}>
                                    {niche}
                                </button>
                            ))}
                        </div>
                        <div className="space-y-6">
                            {filteredScripts.map(script => (
                                <ScriptCard
                                    key={script.id}
                                    script={script}
                                    onOpenSaveModal={onOpenSaveModal}
                                    onUnsave={onUnsaveScript}
                                    isSaved={isScriptSaved(script)}
                                    isScoring={scoringScriptId === script.id}
                                    addNotification={addNotification}
                                    onVisualize={onVisualize}
                                    isVisualizing={visualizingScriptId === script.id}
                                    onRemix={handleOpenRemixModal}
                                    onToggleSpeech={onToggleSpeech}
                                    isSpeaking={speakingScriptId === script.id}
                                />
                            ))}
                        </div>
                    </>
                );
            case 'Hooks':
                return (
                    <div className="space-y-8">
                        {Object.entries(viralHooks).map(([category, hooks]) => (
                            <div key={category} className="bg-[#2A1A5E]/50 rounded-xl border border-[#4A3F7A]/30 p-6">
                                <h3 className="text-xl font-bold text-[#DAFF00] mb-4">{category}</h3>
                                <div className="space-y-3">
                                    {hooks.map((hook, index) => (
                                        <div key={index} className="flex items-center justify-between gap-4 p-3 bg-[#1A0F3C] rounded-lg">
                                            <p className="text-purple-100 italic">"{hook}"</p>
                                            <button onClick={() => handleHookCopy(hook)} className="text-purple-300 hover:text-white transition-colors duration-200 flex-shrink-0" title="Copy hook"><i className="fa-solid fa-copy"></i></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'Audio':
                return (
                    <div className="bg-[#2A1A5E]/50 rounded-xl border border-[#4A3F7A]/30 p-6 md:p-8 space-y-8">
                        <div className="text-center">
                            <i className="fa-solid fa-headphones-simple text-4xl text-[#DAFF00] mb-3"></i>
                            <h2 className="text-3xl font-bold text-white mb-2">The Trending Audio Masterclass</h2>
                            <p className="text-purple-200 max-w-2xl mx-auto">Your quick-start guide to using trending audio to get more views, even if your content isn't perfect.</p>
                        </div>
                        <div className="space-y-6 text-purple-200/90 leading-relaxed max-w-3xl mx-auto">
                           <div className="border-t border-[#4A3F7A]/50 pt-6">
                                <h3 className="text-xl font-bold text-white mb-3"><span className="text-[#DAFF00]">Step 1:</span> Understand WHY It Works</h3>
                                <p>The algorithm's #1 goal is to keep people on the app. When a sound is trending, the algorithm actively pushes videos using that sound to more users, because it knows people are already engaging with it. By using a trending sound, you're essentially "hitching a ride" on a rocket that's already taking off. It's one of the easiest ways to get your video in front of a new audience.</p>
                           </div>
                           <div className="border-t border-[#4A3F7A]/50 pt-6">
                                <h3 className="text-xl font-bold text-white mb-3"><span className="text-[#DAFF00]">Step 2:</span> How to FIND Trending Audio (The Right Way)</h3>
                                <p className="mb-4">Don't just use any sound you hear. Look for these specific signals:</p>
                                <ul className="space-y-3 pl-5">
                                    <li className="flex items-start gap-3"><i className="fa-solid fa-arrow-up-right-dots text-green-400 mt-1"></i><span>Look for the little arrow icon next to a sound. This is TikTok or Instagram explicitly telling you "This sound is trending RIGHT NOW."</span></li>
                                    <li className="flex items-start gap-3"><i className="fa-solid fa-video text-green-400 mt-1"></i><span>Check the video count. A sound with 5k-50k videos is often in the sweet spot. It's popular, but not yet completely saturated.</span></li>
                                    <li className="flex items-start gap-3"><i className="fa-solid fa-calendar-day text-green-400 mt-1"></i><span>Check the dates on the top videos. Are they from the last few days? If so, the trend is current. If they're from weeks ago, you might have missed the peak.</span></li>
                                </ul>
                           </div>
                            <div className="border-t border-[#4A3F7A]/50 pt-6">
                                <h3 className="text-xl font-bold text-white mb-3"><span className="text-[#DAFF00]">Step 3:</span> Match the Audio to Your Niche</h3>
                                <p>This is the secret sauce. Don't just do the dance. Find a way to apply the audio's theme or format to YOUR niche. If a sound is a "before and after" format, show a before and after of your client's results, your weight loss journey, or a dirty car you detailed. This combination of a familiar trend with your unique content is what makes people stop scrolling.</p>
                           </div>
                           <div className="bg-[#1A0F3C] p-5 rounded-lg border-l-4 border-[#DAFF00]">
                                <h4 className="font-bold text-white">PRO TIP: Save Sounds Instantly</h4>
                                <p className="text-sm mt-1">Whenever you're scrolling and hear a sound you might want to use later, tap the sound and hit "Add to Favorites." Create a collection of potential sounds so you're never starting from scratch when it's time to create.</p>
                           </div>
                        </div>
                    </div>
                );
             case 'Bonuses':
                return (
                     <div className="bg-[#2A1A5E]/50 rounded-xl border border-[#4A3F7A]/30 p-6 md:p-8 space-y-8">
                        <div className="text-center">
                            <i className="fa-solid fa-gift text-4xl text-[#DAFF00] mb-3"></i>
                            <h2 className="text-3xl font-bold text-white mb-2">Your Launch Bonuses</h2>
                            <p className="text-purple-200 max-w-2xl mx-auto">Thank you for your purchase! Here are the special bonuses included with your order.</p>
                        </div>
                        <div className="space-y-6 max-w-3xl mx-auto">
                            {bonuses.map(bonus => (
                                <div key={bonus.title} className="bg-[#1A0F3C] rounded-lg p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <i className={`${bonus.icon} text-2xl text-[#DAFF00] w-8 text-center`}></i>
                                        <div>
                                            <h3 className="font-bold text-white">{bonus.title}</h3>
                                            <p className="text-xs text-purple-200">{bonus.description}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDownloadBonus(bonus.title)} className="w-full md:w-auto flex-shrink-0 bg-[#DAFF00] text-[#1A0F3C] font-bold py-2 px-4 rounded-md text-sm hover:bg-opacity-90 transition-all">
                                        <i className="fa-solid fa-download mr-2"></i>Download PDF
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
        }
    }

    return (
        <div>
            <RemixScriptModal 
                isOpen={remixModalOpen}
                onClose={() => setRemixModalOpen(false)}
                baseScript={scriptToRemix}
                onConfirmRemix={handleConfirmRemix}
                isRemixing={isRemixing}
            />

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Done-For-You Content Vault</h1>
                <p className="text-purple-300">Your private library of proven scripts, hooks, and bonuses.</p>
            </div>
            
            <div className="border-b border-[#4A3F7A]/30 mb-6">
                <div className="flex -mb-px">
                    <TabButton tabName="Scripts" currentTab={activeTab} icon="fa-solid fa-scroll">DFY Scripts</TabButton>
                    <TabButton tabName="Hooks" currentTab={activeTab} icon="fa-solid fa-fish-fins">Viral Hooks</TabButton>
                    <TabButton tabName="Audio" currentTab={activeTab} icon="fa-solid fa-headphones-simple">Audio Masterclass</TabButton>
                    <TabButton tabName="Bonuses" currentTab={activeTab} icon="fa-solid fa-gift">Bonuses</TabButton>
                </div>
            </div>
            {renderContent()}
        </div>
    );
};