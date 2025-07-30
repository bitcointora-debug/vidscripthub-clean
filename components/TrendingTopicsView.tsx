


import React, { useState, useEffect, useCallback, useContext } from 'react';
import { TrendCard } from './TrendCard.tsx';
import type { Trend } from '../types.ts';
import { fetchTrendingTopics, QUOTA_ERROR_MESSAGE } from '../services/geminiService.ts';
import { formatDistanceToNow } from 'date-fns';
import { DashboardContext } from '../context/DashboardContext.tsx';

interface TrendingTopicsViewProps {
    onGenerateForTrend: (topic: string) => void;
    addNotification: (message: string) => void;
    onWatchTrend: (trend: Trend) => void;
    onUnwatchTrend: (topic: string) => void;
    isTrendWatched: (topic: string) => boolean;
}

const LoadingState = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
             <div key={i} className="bg-[#2A1A5E] rounded-xl border border-[#4A3F7A] p-6 shadow-lg animate-pulse flex flex-col space-y-4 h-[320px]">
                <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-full bg-slate-700 flex-shrink-0"></div>
                    <div className="flex-grow space-y-2 pt-2">
                        <div className="h-5 bg-slate-700 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-700 rounded w-full"></div>
                        <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                    </div>
                </div>
                <div className="space-y-3 pt-4 border-t border-slate-700">
                     <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                     <div className="h-4 bg-slate-700 rounded w-1/3"></div>
                </div>
                 <div className="mt-auto pt-4">
                    <div className="h-9 bg-slate-700 rounded-md w-full"></div>
                </div>
            </div>
        ))}
    </div>
);


export const TrendingTopicsView: React.FC<TrendingTopicsViewProps> = ({ onGenerateForTrend, addNotification, onWatchTrend, onUnwatchTrend, isTrendWatched }) => {
    const { dispatch } = useContext(DashboardContext);
    const [trends, setTrends] = useState<Trend[]>([]);
    const [sources, setSources] = useState<{ uri: string; title: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const loadTrends = useCallback(async (forceRefresh: boolean = false) => {
        const cacheKey = 'vsh_trending_topics';
        setIsLoading(true);
        setError(null);

        if (forceRefresh) {
            sessionStorage.removeItem(cacheKey);
            addNotification("AI is fetching the latest trending topics...");
        } else {
             const cachedData = sessionStorage.getItem(cacheKey);
            if (cachedData) {
                const { trends, sources, timestamp } = JSON.parse(cachedData);
                // Cache valid for 15 minutes
                if (new Date().getTime() - timestamp < 15 * 60 * 1000) {
                    setTrends(trends);
                    setSources(sources);
                    setLastUpdated(new Date(timestamp));
                    setIsLoading(false);
                    return;
                }
            }
        }
        
        try {
            const { trends: fetchedTrends, sources: fetchedSources } = await fetchTrendingTopics();
            const timestamp = new Date().getTime();
            const cachePayload = { trends: fetchedTrends, sources: fetchedSources, timestamp };
            sessionStorage.setItem(cacheKey, JSON.stringify(cachePayload));
            setTrends(fetchedTrends);
            setSources(fetchedSources);
            setLastUpdated(new Date(timestamp));
            if (forceRefresh) {
                addNotification("Successfully fetched trending topics!");
            }
        } catch (err: unknown) {
             const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
             if (errorMessage === QUOTA_ERROR_MESSAGE) {
                dispatch({ type: 'SET_QUOTA_ERROR', payload: errorMessage });
             } else {
                setError(errorMessage);
                addNotification(`Error fetching trends: ${errorMessage}`);
             }
        } finally {
            setIsLoading(false);
        }
    }, [addNotification, dispatch]);

    useEffect(() => {
        loadTrends();
    }, [loadTrends]);


    return (
        <div>
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-3xl font-bold text-white">Trending Topics Hub</h1>
                    <button onClick={() => loadTrends(true)} disabled={isLoading} className="text-purple-300 hover:text-white disabled:text-purple-300/50 disabled:cursor-wait transition-colors" title="Refresh Trends">
                        <i className={`fa-solid fa-rotate-right text-xl ${isLoading ? 'animate-spin' : ''}`}></i>
                    </button>
                </div>
                
                <p className="text-purple-300">Discover emerging trends and generate viral scripts before anyone else.</p>
                {lastUpdated && !isLoading && <p className="text-xs text-purple-400/70 mt-1">Last updated: {formatDistanceToNow(lastUpdated, { addSuffix: true })}</p>}
            </div>
            
            {isLoading && <LoadingState />}
            
            {error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg flex flex-col items-center justify-center text-center" role="alert">
                    <strong className="font-bold">Error: {error}</strong>
                    <p className="text-sm">The AI failed to fetch trends. This can happen during peak hours.</p>
                    <button 
                        onClick={() => loadTrends(true)}
                        className="mt-4 bg-red-500/50 text-white font-bold py-2 px-4 rounded-md hover:bg-red-500/70 transition-colors"
                    >
                        <i className="fa-solid fa-rotate-right mr-2"></i>
                        Retry
                    </button>
                </div>
            )}
            
            {!isLoading && !error && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {trends.map((trend, index) => (
                            <TrendCard 
                                key={trend.topic} 
                                trend={trend}
                                onGenerateForTrend={onGenerateForTrend} 
                                onWatchTrend={onWatchTrend}
                                onUnwatchTrend={onUnwatchTrend}
                                isWatched={isTrendWatched(trend.topic)}
                            />
                        ))}
                    </div>

                    {sources.length > 0 && (
                        <div className="mt-12 pt-6 border-t border-[#4A3F7A]/30">
                            <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-3">Data Sources</h3>
                            <ul className="list-disc list-inside space-y-2">
                                {sources.map((source, index) => (
                                    <li key={index} className="text-xs">
                                        <a 
                                            href={source.uri} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-purple-300 hover:text-[#DAFF00] underline"
                                        >
                                            {source.title || source.uri}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                 </>
            )}
        </div>
    );
};