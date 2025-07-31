
import React, { useState, useEffect, useContext } from 'react';
import type { EnhancedTopic } from '../types.ts';
import { AuthContext } from '../context/AuthContext.tsx';
import { UIContext } from '../context/UIContext.tsx';

interface InputFormProps {
  onGenerate: (topic: string, tone: string, length: number) => void;
  isLoading: boolean;
  initialTopic?: string;
  setInitialTopic: (topic: string | undefined) => void;
  onEnhanceTopic: (topic: string) => void;
  isEnhancing: boolean;
  enhancedTopics: EnhancedTopic[];
  onSelectEnhancedTopic: (topic: string) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ 
    onGenerate, 
    isLoading, 
    initialTopic, 
    setInitialTopic,
    onEnhanceTopic,
    isEnhancing,
    enhancedTopics,
    onSelectEnhancedTopic,
}) => {
  const { state: { user } } = useContext(AuthContext);
  const { dispatch: uiDispatch } = useContext(UIContext);
  const { primary_niche: primaryNiche, preferred_tone: preferredTone, plan_level } = user || {};
  const isUnlimited = plan_level === 'unlimited';
  const maxLength = isUnlimited ? 600 : 60;

  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Funny');
  const [length, setLength] = useState(60); // Default to 60 seconds
  const tones = ['Funny', 'Inspirational', 'Educational', 'Heartwarming', 'Action-Packed'];
  const advancedTones = ['Controversial', 'Shocking', 'Luxury & Aspirational', 'Data-Driven'];
  
  useEffect(() => {
    // Prioritize initialTopic (e.g. from a trend click)
    if (initialTopic) {
        setTopic(initialTopic);
    } else if (primaryNiche) {
        // Otherwise, set to the user's primary niche
        setTopic(primaryNiche);
    }
    // Set the tone from user preferences if available
    if (preferredTone) {
        setTone(preferredTone);
    }
  }, [initialTopic, primaryNiche, preferredTone]);

  useEffect(() => {
    if (length > maxLength) {
      setLength(maxLength);
    }
  }, [maxLength, length]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate(topic, tone, length);
      setInitialTopic(undefined); // Clear initial topic after use
    }
  };
  
  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTopic(e.target.value);
      if(initialTopic) {
        setInitialTopic(undefined); // Clear initial topic if user starts typing
      }
  }

  const handleSelectAndGenerate = (selectedTopic: string) => {
    setTopic(selectedTopic);
    onSelectEnhancedTopic(selectedTopic);
    onGenerate(selectedTopic, tone, length);
  };

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds} seconds`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds === 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    return `${minutes} min ${remainingSeconds} sec`;
  };

  const handleUpgradeClick = (plan: 'unlimited' | 'dfy' | 'agency') => {
    uiDispatch({ type: 'OPEN_UPGRADE_MODAL', payload: plan });
  };

  const renderToneButton = (t: string) => (
    <button
      key={t}
      type="button"
      onClick={() => setTone(t)}
      className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#2A1A5E] focus:ring-[#DAFF00] ${
        tone === t
          ? 'bg-[#DAFF00] text-[#1A0F3C]'
          : 'bg-[#1A0F3C] text-purple-200 hover:bg-[#4A3F7A]/50'
      }`}
    >
      {t}
    </button>
  );

  return (
    <div className="bg-[#2A1A5E]/50 rounded-xl border border-[#4A3F7A]/30 shadow-lg mb-10 p-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Topic Input */}
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-purple-200 mb-2">
              Enter Your Niche or Keyword...
            </label>
            <div className="flex gap-2">
                <input
                    id="topic"
                    type="text"
                    value={topic}
                    onChange={handleTopicChange}
                    placeholder="e.g., 'Healthy dog food recipes'"
                    className="w-full bg-[#1A0F3C] border border-[#4A3F7A] rounded-md py-3 px-4 text-[#F0F0F0] placeholder-purple-300/50 focus:ring-2 focus:ring-[#DAFF00] focus:border-[#DAFF00] focus:outline-none transition duration-200"
                    required
                />
                 <button 
                    type="button"
                    onClick={() => onEnhanceTopic(topic)}
                    disabled={isLoading || isEnhancing || !topic.trim()}
                    className="flex-shrink-0 flex items-center justify-center bg-[#1A0F3C] border-2 border-[#DAFF00] text-[#DAFF00] font-bold py-3 px-4 rounded-md hover:bg-[#DAFF00] hover:text-[#1A0F3C] disabled:bg-slate-700 disabled:text-slate-400 disabled:border-slate-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:scale-100"
                    title="Supercharge Topic"
                >
                     {isEnhancing ? (
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                     ) : (
                        <i className="fa-solid fa-bolt"></i>
                     )}
                </button>
            </div>
          </div>
          
          {/* AI Topic Enhancer Results */}
          {(isEnhancing || enhancedTopics.length > 0) && (
             <div className="bg-[#1A0F3C]/50 rounded-lg p-4 space-y-3">
                 <h4 className="text-sm font-semibold text-purple-200 text-center">AI Suggested Angles (Click to Generate)</h4>
                 {isEnhancing && <div className="text-center text-purple-300 text-sm animate-pulse">Analyzing topic...</div>}
                 {enhancedTopics.map((suggestion, index) => (
                    <button 
                        key={index}
                        type="button"
                        onClick={() => handleSelectAndGenerate(suggestion.angle)}
                        className="w-full text-left p-3 bg-[#2A1A5E] rounded-md hover:bg-[#4A3F7A]/50 transition-colors duration-200"
                    >
                        <p className="font-semibold text-white">{suggestion.angle}</p>
                        <p className="text-xs text-purple-300/80 mt-1">{suggestion.rationale}</p>
                    </button>
                 ))}
             </div>
          )}

          {/* Script Length Selector */}
          <div>
            <label htmlFor="length" className="flex justify-between items-center text-sm font-medium text-purple-200 mb-2">
              <span>Script Length</span>
              <span className="font-bold text-[#DAFF00] bg-[#1A0F3C] px-2 py-1 rounded-md text-xs">{formatDuration(length)}</span>
            </label>
            <div className="relative">
              <input
                  id="length"
                  type="range"
                  min="10"
                  max={maxLength}
                  step="5"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value, 10))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              />
               {!isUnlimited && (
                  <button type="button" onClick={() => handleUpgradeClick('unlimited')} className="w-full text-center text-xs text-yellow-200/70 mt-2 hover:text-yellow-100">
                      <i className="fa-solid fa-lock mr-1.5"></i>
                      Upgrade to UNLIMITED to generate scripts up to 10 minutes long.
                  </button>
               )}
            </div>
          </div>


          {/* Tone Selector */}
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-3">
              Select Script Tone
            </label>
            <div className="flex flex-wrap gap-2">
              {tones.map(renderToneButton)}
            </div>
          </div>
          
          {/* UNLOCKED/LOCKED: Advanced Tonal Styles */}
          {isUnlimited ? (
            <div className="pt-8 pb-4 px-4 border-t border-[#DAFF00]/20 bg-gradient-to-b from-[#DAFF00]/5 to-transparent rounded-lg relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#DAFF00] text-[#1A0F3C] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-[#DAFF00]/20">
                        UNLIMITED
                    </span>
                </div>
                <label className="block text-sm font-medium text-[#DAFF00] mb-3 text-center tracking-wide">
                Advanced Tonal Styles
                </label>
                <div className="flex flex-wrap gap-2 justify-center">
                {advancedTones.map(renderToneButton)}
                </div>
            </div>
          ) : (
            <button type="button" onClick={() => handleUpgradeClick('unlimited')} className="w-full pt-4 pb-4 px-4 border border-yellow-500/30 bg-yellow-900/10 rounded-lg relative text-center group cursor-pointer hover:bg-yellow-900/20">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-yellow-400/20">
                       <i className="fa-solid fa-lock mr-1.5"></i> LOCKED
                    </span>
                </div>
                <label className="block text-sm font-medium text-yellow-300 mb-2 mt-2 tracking-wide pointer-events-none">
                    Upgrade to UNLIMITED to Unlock Advanced Tones
                </label>
                <p className="text-xs text-yellow-200/60 mb-3 pointer-events-none">Get access to Controversial, Shocking, Luxury, and Data-Driven tonal styles to maximize viral potential.</p>
                <span className="font-bold text-white text-sm group-hover:text-yellow-300 transition-colors pointer-events-none">Click here to upgrade!</span>
            </button>
          )}


          {/* Generate Button */}
          <button
            type="submit"
            disabled={isLoading || !topic.trim() || isEnhancing}
            className="w-full flex items-center justify-center bg-[#DAFF00] text-[#1A0F3C] font-bold py-4 px-4 rounded-md hover:bg-opacity-90 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-4 focus:ring-[#DAFF00]/50 text-lg"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#1A0F3C]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Scripts...
              </>
            ) : (
              <>
                <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>
                Generate Scripts
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
