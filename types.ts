

import type { AuthSession as Session } from '@supabase/supabase-js';

export interface Folder {
  id: string;
  name: string;
}

export interface ViralScoreBreakdown {
    overallScore: number;
    hookAnalysis: string;
    pacingAnalysis: string;
    valueAnalysis: string;
    ctaAnalysis: string;
    finalVerdict: string;
}

export interface Script {
  id:string;
  user_id?: string;
  folder_id?: string | null;
  title: string;
  hook: string;
  script: string;
  tone: string;
  viral_score_breakdown?: ViralScoreBreakdown;
  visuals?: string[];
  niche?: string;
  created_at?: string;
  isNew?: boolean; // This is a client-side only property
}

export interface Client {
  id: string;
  agency_owner_id?: string;
  name: string;
  email: string;
  status: 'Active' | 'Pending' | 'Inactive';
  created_at?: string;
  avatar: string;
}

export interface Trend {
  topic: string;
  summary: string;
  trendScore: number;
  audienceInsight: string;
  suggestedAngles: string[];
  competition: 'Low' | 'Medium' | 'High';
  trendDirection: 'Upward' | 'Stable' | 'Downward';
}

export interface WatchedTrend {
    id?: string;
    user_id?: string;
    trend_data: Trend;
    created_at?: string;
}

export type PlanId = 'free' | 'pro' | 'viralyzaier' | 'basic' | 'unlimited' | 'dfy' | 'agency';

export interface Plan {
    id: PlanId;
    name: string;
    price: number;
    creditLimit: number;
    features: string[];
    isMostPopular?: boolean;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
    primary_niche: string | null;
    platforms: ('tiktok' | 'instagram' | 'youtube')[] | null;
    preferred_tone: string | null;
    isPersonalized: boolean;
    plan: PlanId;
    aiCredits?: number;
    channelAudit?: any;
    cloned_voices?: any;
    content_pillars?: string[];
    subscription?: Subscription;
}

export interface Subscription {
    planId: PlanId;
    status: 'active' | 'inactive' | 'cancelled';
    endDate: string | null;
}

export interface Notification {
    id: string;
    user_id?: string;
    message: string;
    created_at: string;
    read: boolean;
    project_id?: string;
}

export interface Platform {
    id: string;
    name: string;
    icon: string;
}

export interface SceneAssets {
    id: string;
    type: 'image' | 'video' | 'audio';
    url: string;
    duration?: number;
}

export interface SoundDesign {
    id: string;
    name: string;
    url: string;
    duration: number;
    type: 'music' | 'sfx' | 'voice';
}

export interface Json {
    [key: string]: any;
}

export interface NormalizedStockAsset {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
    duration?: number;
    type: 'image' | 'video' | 'audio';
    source: string;
}

export interface JamendoTrack {
    id: string;
    name: string;
    artist_name: string;
    audio: string;
    audiodownload: string;
    duration: number;
    image: string;
}

export interface ChannelStats {
    subscriberCount: number;
    viewCount: number;
    videoCount: number;
    avgViews: number;
    engagementRate: number;
}

export interface VideoPerformance {
    videoId: string;
    title: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    engagementRate: number;
    publishedAt: string;
}

export interface Project {
    id: string;
    user_id: string;
    title: string;
    description: string;
    status: ProjectStatus;
    platform: Platform;
    created_at: string;
    updated_at: string;
}

export interface ProjectStatus {
    id: string;
    name: string;
    color: string;
}

export interface WorkflowStep {
    id: string;
    name: string;
    description: string;
    order: number;
    completed: boolean;
}

export interface Analysis {
    id: string;
    project_id: string;
    type: string;
    data: Json;
    created_at: string;
}

export interface CompetitorAnalysisResult {
    competitor: string;
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
}

export interface LaunchPlan {
    id: string;
    project_id: string;
    title: string;
    description: string;
    steps: WorkflowStep[];
    created_at: string;
}

export interface ChannelAudit {
    id: string;
    user_id: string;
    channel_url: string;
    stats: ChannelStats;
    performance: VideoPerformance[];
    created_at: string;
}

export interface ClonedVoice {
    id: string;
    user_id: string;
    name: string;
    voice_id: string;
    created_at: string;
}

export interface BrandIdentity {
    id: string;
    user_id: string;
    name: string;
    description: string;
    colors: string[];
    fonts: string[];
    tone: string;
    created_at: string;
}

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: User;
                Insert: Partial<User>;
                Update: Partial<User>;
            };
            folders: {
                Row: Folder;
                Insert: Partial<Folder>;
                Update: Partial<Folder>;
            };
            clients: {
                Row: Client;
                Insert: Partial<Client>;
                Update: Partial<Client>;
            };
            notifications: {
                Row: Notification;
                Insert: Partial<Notification>;
                Update: Partial<Notification>;
            };
            scripts: {
                Row: Script;
                Insert: Partial<Script>;
                Update: Partial<Script>;
            };
            watched_trends: {
                Row: WatchedTrend;
                Insert: Partial<WatchedTrend>;
                Update: Partial<WatchedTrend>;
            };
        };
    };
}

export interface EnhancedTopic {
    angle: string;
    rationale: string;
}

export interface VideoDeconstruction {
    title: string;
    analysis: {
        hook: string;
        structure: string;
        valueProposition: string;
        callToAction: string;
    };
    thumbnailAnalysis?: {
        effectiveness: string;
        ideas: {
            title: string;
            visual: string;
        }[];
    };
    generatedScripts: Script[];
}

export interface OptimizationStep {
    log: string;
    score: number;
    script: Pick<Script, 'title' | 'hook' | 'script'>;
}

// Add Supabase Session type
export type { Session };
