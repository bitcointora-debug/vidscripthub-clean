import { Plan } from '../types';

export const PLANS: Plan[] = [
    {
        id: 'free',
        name: 'Free',
        price: 0,
        creditLimit: 10,
        features: [
            'pricing.feature_active_projects_1',
            'pricing.feature_ai_credits_10',
            'pricing.feature_script_length_free',
            'pricing.feature_basic_analysis',
            'pricing.feature_community_support',
        ],
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 49,
        creditLimit: 100,
        features: [
            'pricing.feature_unlimited_projects',
            'pricing.feature_ai_credits_100',
            'pricing.feature_script_length_pro',
            'pricing.feature_advanced_analysis',
            'pricing.feature_trend_explorer',
            'pricing.feature_email_support',
        ],
        isMostPopular: true,
    },
    {
        id: 'viralyzaier',
        name: 'Viralyzaier',
        price: 99,
        creditLimit: 1000,
        features: [
            'pricing.feature_pro_everything',
            'pricing.feature_ai_credits_1000',
            'pricing.feature_script_length_viralyzaier',
            'pricing.feature_channel_intelligence',
            'pricing.feature_ai_video_generation',
            'pricing.feature_true_voice_cloning',
            'pricing.feature_priority_support',
        ],
    }
];
