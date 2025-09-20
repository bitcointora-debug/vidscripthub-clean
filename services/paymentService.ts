import { PlanId } from '../types';

// Warrior Plus product URLs - you'll get these when you create your products on Warrior Plus
const WARRIOR_PLUS_PRODUCTS: Record<PlanId, string> = {
    'free': '', // No purchase needed for free plan
    'basic': 'https://warriorplus.com/your-basic-product-url', // Replace with your actual Warrior Plus product URL
    'unlimited': 'https://warriorplus.com/your-unlimited-product-url', // Replace with your actual Warrior Plus product URL
    'dfy': 'https://warriorplus.com/your-dfy-product-url', // Replace with your actual Warrior Plus product URL
    'agency': 'https://warriorplus.com/your-agency-product-url', // Replace with your actual Warrior Plus product URL
    'pro': 'https://warriorplus.com/your-pro-product-url', // Replace with your actual Warrior Plus product URL
    'viralyzaier': 'https://warriorplus.com/your-viralyzaier-product-url', // Replace with your actual Warrior Plus product URL
};

// Redirect to Warrior Plus product page
export const redirectToWarriorPlus = async (planId: PlanId): Promise<{ checkoutUrl: string }> => {
    if (planId === 'free') {
        throw new Error("Cannot redirect to Warrior Plus for a free plan.");
    }
    
    const productUrl = WARRIOR_PLUS_PRODUCTS[planId];
    
    if (!productUrl) {
        throw new Error(`No Warrior Plus product URL configured for plan: ${planId}`);
    }
    
    return { checkoutUrl: productUrl };
};
