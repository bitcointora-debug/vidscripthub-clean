

import React, { useState, useMemo, useCallback, useEffect, useContext } from 'react';
import type { Script } from '../types.ts';
import { ScriptCard } from './ScriptCard.tsx';
import { RemixScriptModal } from './RemixScriptModal.tsx';
import { generateBonusPdf } from '../services/pdfService.ts';
import { DataContext } from '../context/DataContext.tsx';
import { AuthContext } from '../context/AuthContext.tsx';

const niches = ['All', 'Weight Loss', 'Make Money', 'Fitness', 'Productivity', 'Tech', 'DIY', 'Cooking', 'Pets', 'Travel', 'Real Estate', 'Psychology', 'Personal Finance', 'Gaming', 'Parenting', 'Car Detailing', 'Relationships', 'Philosophy', 'History', 'Career'];

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
    { title: "The 'Profit-Ready' Niche Database", description: "A curated database of 50+ low-competition, high-demand niches ready for you to dominate.", icon: "fa-solid fa-database", value: "$97" },
    { title: "The Viral Monetization Blueprint", description: "Learn 5 easy ways to turn your newfound views into actual, spendable cash.", icon: "fa-solid fa-sack-dollar", value: "$47" },
    { title: "The Ultimate Viral Hook Swipe File", description: "50+ proven, copy-paste hooks you can use to make any script instantly more engaging. A taste of our DFY vault!", icon: "fa-solid fa-file-lines", value: "$27" },
];

type Tab = 'Scripts' | 'Hooks' | 'Audio' | 'Bonuses';

interface DFYContentViewProps {
    onOpenSaveModal: (script: Script) => void;
    onUnsaveScript: (scriptId: string) => void;
    isScriptSaved: (script: Script) => boolean;
    scoringScriptId: string | null;
    onVisualize: (scriptId: string, artStyle: string) => void;
    visualizingScriptId: string | null;
    onToggleSpeech: (script: Script) => void;
    speakingScriptId: string | null;
    onRemixScript: (baseScript: Script, newTopic: string) => void;
    isRemixing: boolean;
}

export const DFYContentView: React.FC<DFYContentViewProps> = ({ 
    onOpenSaveModal, onUnsaveScript, isScriptSaved, scoringScriptId,
    onVisualize, visualizingScriptId, onToggleSpeech, speakingScriptId, onRemixScript, isRemixing
}) => {
    const { state: { user } } = useContext(AuthContext);
    const { dispatch: dataDispatch } = useContext(DataContext);
    
    // Check if user has DFY plan
    const hasDfyPlan = user?.plan === 'dfy' || user?.plan === 'agency';
    
    if (!hasDfyPlan) {
        return (
            <div className="p-6 bg-[#1A0F3C] min-h-screen text-white flex flex-col items-center justify-center">
                <div className="text-center max-w-2xl">
                    <div className="mb-8">
                        <i className="fas fa-gem text-6xl text-yellow-400 mb-4"></i>
                        <h2 className="text-3xl font-bold mb-4">DFY Content Vault</h2>
                        <p className="text-purple-300 text-lg">
                            This feature requires the Done-For-You Content Vault plan (OTO2).
                        </p>
                    </div>
                    <div className="bg-[#2A1A5E] p-6 rounded-xl border border-[#4A3F7A]">
                        <h3 className="text-xl font-bold mb-4">What's Inside:</h3>
                        <ul className="text-left space-y-2 text-purple-200">
                            <li>• 100+ DFY Viral Scripts</li>
                            <li>• 50+ Viral Hook Swipe File</li>
                            <li>• Trending Audio Cheat Sheet</li>
                            <li>• 20+ New Scripts Added Monthly</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
    const [activeTab, setActiveTab] = useState<Tab>('Scripts');
    const [activeNiche, setActiveNiche] = useState('All');
    const [activeTone, setActiveTone] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [dfyScripts, setDfyScripts] = useState<Script[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [remixModalOpen, setRemixModalOpen] = useState(false);
    const [scriptToRemix, setScriptToRemix] = useState<Script | null>(null);

    const addNotification = useCallback((message: string) => {
        if(user) {
           dataDispatch({ type: 'ADD_NOTIFICATION_REQUEST', payload: { message, userId: user.id } });
        }
    }, [dataDispatch, user]);

    useEffect(() => {
        // Mock DFY scripts data instead of fetching from API
        const mockDfyScripts: Script[] = [
            {
                id: 'dfy-1',
                title: 'The 5-Minute Morning Routine That Changed Everything',
                hook: 'What if I told you that just 5 minutes every morning could completely transform your life?',
                script: '[SCENE: Person waking up, looking tired]\n\nMost people wake up and immediately reach for their phone. But what if I told you that just 5 minutes every morning could completely transform your life?\n\n[SCENE: Person doing morning routine]\n\nHere\'s the simple routine that changed everything for me:\n\n1. Make your bed (30 seconds)\n2. Drink a glass of water (30 seconds)\n3. Write down 3 things you\'re grateful for (2 minutes)\n4. Do 10 push-ups (1 minute)\n5. Read one page of a book (1 minute)\n\n[SCENE: Person looking energized and happy]\n\nThat\'s it. Just 5 minutes. But here\'s what happened when I started doing this every single day:\n\n- My energy levels skyrocketed\n- I felt more accomplished before 8 AM than most people do all day\n- My mood improved dramatically\n- I started reading more books than ever before\n- I felt stronger and more confident\n\n[SCENE: Split screen showing before/after]\n\nThe best part? It takes less time than scrolling through social media.\n\nTry it for just one week. I promise you\'ll feel the difference.\n\n[SCENE: Call to action]\n\nWhat\'s your morning routine? Let me know in the comments below!',
                tone: 'Motivational',
                length: 60,
                created_at: new Date().toISOString(),
                user_id: 'dfy',
                folder_id: null,
                is_saved: false,
                viral_score: 85,
                niche: 'Productivity',
                platforms: ['TikTok', 'YouTube Shorts', 'Instagram Reels']
            },
            {
                id: 'dfy-2',
                title: 'The $1 Challenge That Made Me $10,000',
                hook: 'I started with just $1 and turned it into $10,000 in 90 days. Here\'s exactly how I did it.',
                script: '[SCENE: Person holding a single dollar bill]\n\nI started with just $1 and turned it into $10,000 in 90 days. Here\'s exactly how I did it.\n\n[SCENE: Person looking skeptical]\n\nI know what you\'re thinking. "That\'s impossible." But hear me out.\n\n[SCENE: Person working on computer]\n\nHere\'s the simple strategy I used:\n\nDay 1-7: I used that $1 to buy something I could resell for $2\nDay 8-14: I used $2 to buy something I could resell for $5\nDay 15-30: I used $5 to buy something I could resell for $15\n\n[SCENE: Person showing phone with increasing numbers]\n\nAnd so on. Each week, I doubled my money by finding undervalued items and reselling them.\n\n[SCENE: Person at garage sales, thrift stores]\n\nI found vintage clothing, electronics, books, and collectibles that people were selling for way less than they were worth.\n\n[SCENE: Person listing items online]\n\nThen I listed them on Facebook Marketplace, eBay, and local buy/sell groups.\n\n[SCENE: Person counting money]\n\nBy day 90, I had turned $1 into $10,000.\n\n[SCENE: Call to action]\n\nThe key isn\'t the money. It\'s the mindset. Start small, think big, and never give up.\n\nWhat would you do with $1? Let me know in the comments!',
                tone: 'Educational',
                length: 90,
                created_at: new Date().toISOString(),
                user_id: 'dfy',
                folder_id: null,
                is_saved: false,
                viral_score: 92,
                niche: 'Make Money',
                platforms: ['TikTok', 'YouTube Shorts', 'Instagram Reels']
            },
            {
                id: 'dfy-3',
                title: 'The 30-Second Rule That Saved My Marriage',
                hook: 'My marriage was falling apart until I discovered this 30-second rule that changed everything.',
                script: '[SCENE: Couple arguing, looking frustrated]\n\nMy marriage was falling apart until I discovered this 30-second rule that changed everything.\n\n[SCENE: Person looking sad and alone]\n\nWe were constantly fighting. About money, about chores, about everything. I thought we were done.\n\n[SCENE: Person reading a book or article]\n\nThen I read about the 30-second rule. It\'s simple:\n\nBefore you respond to your partner, take 30 seconds to think about what they\'re really saying.\n\n[SCENE: Person taking a deep breath, counting to 30]\n\nNot what you think they\'re saying. Not what you want to hear. What they\'re actually saying.\n\n[SCENE: Couple having a calm conversation]\n\nHere\'s what happened when I started using this rule:\n\n- I stopped reacting defensively\n- I started listening to understand, not to respond\n- Our arguments became conversations\n- We started connecting again\n\n[SCENE: Couple laughing together, holding hands]\n\nThat 30 seconds gave me time to remember that I love this person. That we\'re on the same team.\n\n[SCENE: Split screen showing before/after]\n\nNow, instead of fighting, we talk. Instead of blaming, we solve problems together.\n\n[SCENE: Call to action]\n\nIt\'s not about being right. It\'s about being happy together.\n\nTry it for one week. Your relationship will thank you.\n\nWhat\'s your biggest relationship challenge? Let me know below!',
                tone: 'Personal',
                length: 75,
                created_at: new Date().toISOString(),
                user_id: 'dfy',
                folder_id: null,
                is_saved: false,
                viral_score: 88,
                niche: 'Relationships',
                platforms: ['TikTok', 'YouTube Shorts', 'Instagram Reels']
            }
        ];
        
        setDfyScripts(mockDfyScripts);
        setIsLoading(false);
    }, []);
    
    const tones = useMemo(() => ['All', ...Array.from(new Set(dfyScripts.map(s => s.tone)))], [dfyScripts]);

    const filteredScripts = useMemo(() => {
        let scripts = dfyScripts;
        if (activeNiche !== 'All') {
            scripts = scripts.filter(script => script.niche === activeNiche);
        }
        if (activeTone !== 'All') {
            scripts = scripts.filter(script => script.tone === activeTone);
        }
        if (searchTerm) {
            scripts = scripts.filter(script => 
                script.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                script.script.toLowerCase().includes(searchTerm.toLowerCase()) ||
                script.hook.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return scripts;
    }, [activeNiche, activeTone, searchTerm, dfyScripts]);
    
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

    const FilterButton: React.FC<{label: string, activeLabel: string, onClick: () => void}> = ({ label, activeLabel, onClick }) => (
        <button onClick={onClick} className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${activeLabel === label ? 'bg-[#DAFF00] text-[#1A0F3C]' : 'bg-[#2A1A5E] text-purple-200 hover:bg-[#4A3F7A]/80'}`}>
            {label}
        </button>
    );


    const renderContent = () => {
        switch (activeTab) {
            case 'Scripts':
                return (
                    <>
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="relative flex-grow">
                                <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-purple-300/50"></i>
                                <input type="text" placeholder="Search all DFY scripts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#1A0F3C] border border-[#4A3F7A] rounded-md py-2.5 pl-10 pr-4 text-[#F0F0F0] placeholder-purple-300/50 focus:ring-2 focus:ring-[#DAFF00] focus:border-[#DAFF00] focus:outline-none transition duration-200" />
                            </div>
                        </div>
                        <div className="space-y-4 mb-6">
                            <div>
                                <h4 className="text-xs font-semibold uppercase text-purple-300/80 mb-2">Filter by Niche</h4>
                                <div className="flex flex-wrap gap-2">
                                    {niches.map(niche => (
                                        <FilterButton key={niche} label={niche} activeLabel={activeNiche} onClick={() => setActiveNiche(niche)} />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold uppercase text-purple-300/80 mb-2">Filter by Tone</h4>
                                 <div className="flex flex-wrap gap-2">
                                    {tones.map(tone => (
                                        <FilterButton key={tone} label={tone} activeLabel={activeTone} onClick={() => setActiveTone(tone)} />
                                    ))}
                                </div>
                            </div>
                        </div>

                         {isLoading ? (
                            <div className="space-y-6">
                                {[...Array(3)].map((_, i) => <div key={i} className="bg-[#2A1A5E] p-6 rounded-xl animate-pulse h-64"></div>)}
                            </div>
                        ) : filteredScripts.length > 0 ? (
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
                        ) : (
                             <div className="text-center py-16 px-6 bg-[#1A0F3C]/50 rounded-lg border-2 border-dashed border-[#4A3F7A]">
                                <i className="fa-regular fa-face-sad-tear text-4xl text-purple-300 mb-4"></i>
                                <h3 className="mt-2 text-lg font-medium text-[#F0F0F0]">No Scripts Found</h3>
                                <p className="mt-1 text-sm text-purple-200/80">Your search and filter criteria did not match any scripts.</p>
                            </div>
                        )}
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
                        <div className="space-y-6 max-w-4xl mx-auto">
                            {bonuses.map(bonus => (
                                <div key={bonus.title} className="bg-[#1A0F3C] rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-[#4A3F7A]/30">
                                    <div className="flex items-center gap-4 flex-grow">
                                        <i className={`${bonus.icon} text-3xl text-[#DAFF00] w-10 text-center`}></i>
                                        <div className="flex-grow">
                                            <h3 className="font-bold text-white text-lg mb-1">{bonus.title}</h3>
                                            <p className="text-sm text-purple-200 mb-2">{bonus.description}</p>
                                            <span className="inline-block bg-[#DAFF00] text-[#1A0F3C] text-xs font-bold px-2 py-1 rounded-full">
                                                Value: {bonus.value}
                                            </span>
                                        </div>
                                    </div>
                                    <button onClick={() => {
                                        const bonusFiles = {
                                            "The 'Profit-Ready' Niche Database": 'https://vidscripthub.netlify.app/bonuses/Profit-Ready-Niche-Database.pdf',
                                            "The Viral Monetization Blueprint": 'https://vidscripthub.netlify.app/bonuses/Viral-Monetization-Blueprint.pdf',
                                            "The Ultimate Viral Hook Swipe File": 'https://vidscripthub.netlify.app/bonuses/Ultimate-Viral-Hook-Swipe-File.pdf'
                                        };
                                        const fileUrl = bonusFiles[bonus.title];
                                        if (fileUrl) {
                                            window.open(fileUrl, '_blank');
                                        }
                                    }} className="w-full md:w-auto flex-shrink-0 bg-[#DAFF00] text-[#1A0F3C] font-bold py-3 px-6 rounded-lg hover:bg-[#a8c400] transition-colors duration-200">
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