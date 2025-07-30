
import React from 'react';
import { RadialProgress } from './icons/RadialProgress';
import type { Trend } from '../types';

interface TrendCardProps {
    trend: Trend;
    onGenerateForTrend: (topic: string) => void;
    onWatchTrend: (trend: Trend) => void;
    onUnwatchTrend: (topic: string) => void;
    isWatched: boolean;
}

const competitionStyles = {
    Low: 'bg-green-500/10 text-green-400 border-green-500/30',
    Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    High: 'bg-red-500/10 text-red-400 border-red-500/30',
};

const trendDirectionStyles = {
    Upward: { icon: 'fa-arrow-trend-up', color: 'text-green-400' },
    Stable: { icon: 'fa-minus', color: 'text-yellow-400' },
    Downward: { icon: 'fa-arrow-trend-down', color: 'text-red-400' },
};

export const TrendCard: React.FC<TrendCardProps> = ({ 
    trend,
    onGenerateForTrend,
    onWatchTrend,
    onUnwatchTrend,
    isWatched
}) => {
    const { topic, trendScore, summary, audienceInsight, suggestedAngles, competition, trendDirection } = trend;
    const directionInfo = trendDirectionStyles[trendDirection] || trendDirectionStyles.Stable;

    const handleWatchClick = () => {
        isWatched ? onUnwatchTrend(topic) : onWatchTrend(trend);
    }

    return (
        <div className="bg-[#2A1A5E] rounded-xl border border-[#4A3F7A] p-6 shadow-lg transition-all duration-300 hover:border-[#DAFF00]/50 hover:shadow-2xl hover:shadow-[#DAFF00]/5 flex flex-col space-y-4">
            {/* Top Section */}
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                    <RadialProgress progress={trendScore} />
                </div>
                <div className="flex-grow">
                    <h3 className="text-xl font-bold text-white mb-1">{topic}</h3>
                    <p className="text-sm text-purple-200/80 leading-relaxed">{summary}</p>
                </div>
                <div className="flex-shrink-0">
                    <button onClick={handleWatchClick} className={`p-2 rounded-full bg-[#1A0F3C]/50 hover:bg-[#1A0F3C] transition-colors duration-200 ${isWatched ? 'text-yellow-400' : 'text-purple-300 hover:text-yellow-400'}`} title={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}>
                        <i className={`fa-star ${isWatched ? 'fa-solid' : 'fa-regular'}`}></i>
                    </button>
                </div>
            </div>

            {/* Data Section */}
            <div className="border-t border-[#4A3F7A]/50 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1">Audience Insight</h4>
                    <p className="text-sm text-white/90">{audienceInsight}</p>
                </div>
                 <div className="flex items-start gap-4">
                    <div>
                        <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1">Competition</h4>
                        <div className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full border ${competitionStyles[competition]}`}>
                            {competition}
                        </div>
                    </div>
                     <div>
                        <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1">Momentum</h4>
                         <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold rounded-full`}>
                             <i className={`fa-solid ${directionInfo.icon} ${directionInfo.color}`}></i>
                             <span className={directionInfo.color}>{trendDirection}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Suggested Angles Section */}
            {suggestedAngles && suggestedAngles.length > 0 && (
              <div>
                  <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">Suggested Angles</h4>
                  <div className="space-y-2">
                      {suggestedAngles.map((angle, index) => (
                          <a href="#" onClick={(e) => {e.preventDefault(); onGenerateForTrend(angle)}} key={index} className="block text-sm text-[#DAFF00]/80 hover:text-[#DAFF00] hover:underline transition-colors duration-200 cursor-pointer">
                              <i className="fa-regular fa-lightbulb w-4 mr-1.5 opacity-70"></i> {angle}
                          </a>
                      ))}
                  </div>
              </div>
            )}

             {/* Generate Button */}
             <div className="mt-auto pt-4">
                <button
                    onClick={() => onGenerateForTrend(topic)}
                    className="w-full text-center bg-[#DAFF00] text-[#1A0F3C] font-bold py-2.5 px-4 rounded-md hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#DAFF00]/50 text-sm"
                >
                    <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>
                    Generate Scripts For This Trend
                </button>
             </div>
        </div>
    );
};