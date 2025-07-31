

import type { AuthSession as Session } from '@supabase/supabase-js';

export interface Folder {
  id: string;
  name: string;
  user_id?: string;
  created_at?: string;
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

export interface User {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
    primary_niche?: string;
    platforms?: ('tiktok' | 'instagram' | 'youtube')[];
    preferred_tone?: string;
    isPersonalized: boolean;
    plan_level: 'standard' | 'unlimited';
    has_dfy_vault: boolean;
    is_agency: boolean;
}

export interface Notification {
    id: string;
    user_id?: string;
    message: string;
    created_at: string;
    read: boolean;
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

// Add Supabase Session type
export type { Session };