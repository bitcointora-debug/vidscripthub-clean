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
        id: 'basic',
        name: 'Basic',
        price: 27,
        creditLimit: 30,
        features: [
            'pricing.feature_active_projects_5',
            'pricing.feature_ai_credits_30',
            'pricing.feature_script_length_basic',
            'pricing.feature_basic_analysis',
            'pricing.feature_email_support',
        ],
    },
    {
        id: 'unlimited',
        name: 'Unlimited (OTO1)',
        price: 67,
        creditLimit: -1, // Unlimited
        features: [
            'pricing.feature_unlimited_projects',
            'pricing.feature_unlimited_ai_credits',
            'pricing.feature_script_length_unlimited',
            'pricing.feature_advanced_analysis',
            'pricing.feature_trending_topics',
            'pricing.feature_advanced_tonal_styles',
            'pricing.feature_video_deconstructor',
            'pricing.feature_email_support',
        ],
    },
    {
        id: 'dfy',
        name: 'DFY Content Vault (OTO2)',
        price: 97,
        creditLimit: -1, // Unlimited
        features: [
            'pricing.feature_unlimited_everything',
            'pricing.feature_dfy_scripts',
            'pricing.feature_viral_hooks',
            'pricing.feature_trending_audio',
            'pricing.feature_monthly_new_content',
            'pricing.feature_priority_support',
        ],
    },
    {
        id: 'agency',
        name: 'Agency License (OTO3)',
        price: 197,
        creditLimit: -1, // Unlimited
        features: [
            'pricing.feature_agency_dashboard',
            'pricing.feature_client_management',
            'pricing.feature_reseller_license',
            'pricing.feature_white_label',
            'pricing.feature_priority_support',
            'pricing.feature_profit_sharing',
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
