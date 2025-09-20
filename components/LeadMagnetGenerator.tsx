import React, { useState } from 'react';
import { trackEngagement } from './AnalyticsTracker.tsx';

interface LeadMagnetGeneratorProps {
  onClose: () => void;
  userEmail: string;
  userName: string;
}

export const LeadMagnetGenerator: React.FC<LeadMagnetGeneratorProps> = ({ onClose, userEmail, userName }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [selectedNiche, setSelectedNiche] = useState('');

  const niches = [
    'Personal Development',
    'Business & Entrepreneurship', 
    'Health & Fitness',
    'Technology & AI',
    'Finance & Investing',
    'Lifestyle & Productivity',
    'Education & Learning',
    'Entertainment & Pop Culture'
  ];

  const generateFreeScript = async () => {
    setIsGenerating(true);
    
    // Track lead magnet usage
    trackEngagement('free_script_generated', { 
      niche: selectedNiche, 
      email: userEmail 
    });

    // Simulate AI script generation
    setTimeout(() => {
      const script = generateScriptForNiche(selectedNiche);
      setGeneratedScript(script);
      setIsGenerating(false);
    }, 3000);
  };

  const generateScriptForNiche = (niche: string): string => {
    const scripts = {
      'Personal Development': `🎯 VIRAL SCRIPT: "The 3-Second Rule That Changed My Life"

HOOK (0-3 seconds):
"Three seconds. That's all it took to change everything."

PROBLEM (3-15 seconds):
"Most people spend years trying to improve themselves, but I discovered something that works in just 3 seconds. And it's not what you think."

SOLUTION (15-45 seconds):
"Here's the 3-second rule: Before you react to anything, pause for 3 seconds and ask yourself: 'Is this helping me grow or holding me back?' That's it. Three seconds of conscious choice."

PROOF (45-60 seconds):
"I've used this rule for 6 months now, and it's eliminated 90% of my negative reactions. My relationships improved, my productivity doubled, and my stress levels dropped."

CALL TO ACTION (60-75 seconds):
"Try it right now. The next time something triggers you, pause for 3 seconds. Comment below and tell me what happens. And if this helped you, follow me for more life-changing tips."

HASHTAGS: #PersonalDevelopment #Mindfulness #SelfImprovement #LifeHacks #Growth`,

      'Business & Entrepreneurship': `🚀 VIRAL SCRIPT: "The $1 Million Mistake I Made (And How You Can Avoid It)"

HOOK (0-3 seconds):
"I lost $1 million because of one simple mistake. Here's how you can avoid it."

PROBLEM (3-15 seconds):
"Most entrepreneurs focus on making money, but they ignore the one thing that actually builds wealth. I learned this the hard way."

SOLUTION (15-45 seconds):
"The mistake? I focused on revenue instead of systems. Revenue comes and goes, but systems create lasting wealth. Here's what I do now: I build one system every month that works without me."

PROOF (45-60 seconds):
"Last month, my systems generated $50K while I was on vacation. That's the power of building systems instead of just chasing revenue."

CALL TO ACTION (60-75 seconds):
"Start building one system this week. Comment below what system you'll build first. Follow me for more business strategies that actually work."

HASHTAGS: #Entrepreneur #BusinessTips #WealthBuilding #Systems #Success`,

      'Health & Fitness': `💪 VIRAL SCRIPT: "The 2-Minute Rule That Transformed My Body"

HOOK (0-3 seconds):
"Two minutes. That's how long it takes to start transforming your body."

PROBLEM (3-15 seconds):
"Everyone thinks you need hours in the gym to get results. But I discovered something that works in just 2 minutes a day."

SOLUTION (15-45 seconds):
"The 2-minute rule: Do one exercise for 2 minutes every day. That's it. No gym membership, no equipment, no excuses. Just 2 minutes of movement."

PROOF (45-60 seconds):
"I've done this for 3 months now. Lost 15 pounds, gained muscle, and have more energy than ever. All from 2 minutes a day."

CALL TO ACTION (60-75 seconds):
"Start today. Pick one exercise and do it for 2 minutes. Comment below what exercise you chose. Follow me for more simple fitness tips that actually work."

HASHTAGS: #Fitness #HealthTips #WeightLoss #SimpleFitness #HealthyLiving`,

      'Technology & AI': `🤖 VIRAL SCRIPT: "The AI Tool That's About to Replace Your Job (And How to Use It)"

HOOK (0-3 seconds):
"This AI tool just replaced my entire team. Here's how you can use it before it replaces you."

PROBLEM (3-15 seconds):
"Most people are scared of AI taking their jobs, but smart people are using AI to make more money. The difference? They know which tools to use."

SOLUTION (15-45 seconds):
"Meet ChatGPT-4. It can write code, create content, analyze data, and even run your business. But here's the secret: you need to know how to prompt it correctly."

PROOF (45-60 seconds):
"I used ChatGPT to automate my entire content creation process. What used to take 8 hours now takes 30 minutes. My productivity increased by 1600%."

CALL TO ACTION (60-75 seconds):
"Start experimenting with AI today. Pick one task and see how AI can help. Comment below what you'll automate first. Follow me for more AI strategies."

HASHTAGS: #AI #Technology #Automation #Productivity #FutureOfWork`
    };

    return scripts[niche as keyof typeof scripts] || scripts['Personal Development'];
  };

  const downloadScript = () => {
    if (!generatedScript) return;
    
    const element = document.createElement('a');
    const file = new Blob([generatedScript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Viral-Script-${selectedNiche.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    trackEngagement('script_downloaded', { niche: selectedNiche, email: userEmail });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            🎁 Your Free Viral Script Generator
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {!generatedScript ? (
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#DAFF00] to-[#B8E600] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#1A0F3C] text-2xl">🎬</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Welcome, {userName}! 👋
              </h3>
              <p className="text-gray-600">
                As promised, here's your <strong>FREE viral script</strong> worth $97!
              </p>
            </div>

            <div className="bg-gradient-to-r from-[#DAFF00]/10 to-transparent border border-[#DAFF00]/20 rounded-xl p-6 mb-6">
              <h4 className="font-bold text-[#1A0F3C] mb-3">What You're Getting:</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="text-[#DAFF00] mr-2">✓</span>
                  Complete viral script template
                </li>
                <li className="flex items-center">
                  <span className="text-[#DAFF00] mr-2">✓</span>
                  Hook, problem, solution, proof structure
                </li>
                <li className="flex items-center">
                  <span className="text-[#DAFF00] mr-2">✓</span>
                  Platform-specific optimizations
                </li>
                <li className="flex items-center">
                  <span className="text-[#DAFF00] mr-2">✓</span>
                  Ready-to-use hashtags
                </li>
                <li className="flex items-center">
                  <span className="text-[#DAFF00] mr-2">✓</span>
                  Call-to-action examples
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Your Niche:
              </label>
              <select
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DAFF00] focus:border-transparent"
              >
                <option value="">Select a niche...</option>
                {niches.map(niche => (
                  <option key={niche} value={niche}>{niche}</option>
                ))}
              </select>
            </div>

            <button
              onClick={generateFreeScript}
              disabled={!selectedNiche || isGenerating}
              className="w-full bg-gradient-to-r from-[#DAFF00] to-[#B8E600] text-[#1A0F3C] font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating Your Script...</span>
                </div>
              ) : (
                'Generate My Free Viral Script! 🚀'
              )}
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                🎉 Your Script is Ready!
              </h3>
              <p className="text-gray-600">
                Here's your personalized viral script for <strong>{selectedNiche}</strong>
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 max-h-60 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                {generatedScript}
              </pre>
            </div>

            <div className="flex space-x-4 mb-6">
              <button
                onClick={downloadScript}
                className="flex-1 bg-gradient-to-r from-[#DAFF00] to-[#B8E600] text-[#1A0F3C] font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
              >
                📥 Download Script
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedScript);
                  trackEngagement('script_copied', { niche: selectedNiche, email: userEmail });
                }}
                className="flex-1 bg-gray-600 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
              >
                📋 Copy to Clipboard
              </button>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-bold text-blue-900 mb-2">🚀 Want More Scripts?</h4>
              <p className="text-blue-800 text-sm mb-3">
                This was just a taste! With VidScriptHub Pro, you get unlimited viral scripts, 
                AI-powered optimization, and platform-specific templates.
              </p>
              <button
                onClick={() => {
                  trackEngagement('upgrade_prompt_clicked', { email: userEmail });
                  window.location.href = 'https://vidscripthub.com/checkout';
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity text-sm"
              >
                Get Unlimited Access - $27
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};






