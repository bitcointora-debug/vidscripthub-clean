# Warrior Plus Integration Setup Guide

## Overview
Your VidScript Hub application has been configured to integrate with Warrior Plus marketplace for payment processing. This guide will help you complete the setup.

## What's Been Done

### ✅ Completed Changes:
1. **Removed Stripe Integration** - Replaced with Warrior Plus redirects
2. **Updated Payment Flow** - All upgrade buttons now redirect to Warrior Plus
3. **Created IPN Handler** - Netlify function to process Warrior Plus notifications
4. **Added Legal Pages** - Terms of Service, Privacy Policy, Refund Policy
5. **Updated UI** - Added legal page links to footer

## Next Steps Required

### 1. Create Products on Warrior Plus
1. Go to [Warrior Plus](https://warriorplus.com/) and create a vendor account
2. Create products for each plan:
   - **Basic Plan** ($27)
   - **Unlimited Plan** ($67) 
   - **DFY Content Vault** ($97)
   - **Agency License** ($197)

### 2. Update Product URLs
In `services/paymentService.ts`, replace the placeholder URLs with your actual Warrior Plus product URLs:

```typescript
const WARRIOR_PLUS_PRODUCTS: Record<PlanId, string> = {
    'free': '', // No purchase needed for free plan
    'basic': 'https://warriorplus.com/your-actual-basic-product-url',
    'unlimited': 'https://warriorplus.com/your-actual-unlimited-product-url',
    'dfy': 'https://warriorplus.com/your-actual-dfy-product-url',
    'agency': 'https://warriorplus.com/your-actual-agency-product-url',
    // ... other plans
};
```

### 3. Configure Warrior Plus IPN
1. In your Warrior Plus product settings, set the IPN URL to:
   ```
   https://your-domain.netlify.app/.netlify/functions/warrior-plus-ipn
   ```
2. Update the product IDs in `netlify/functions/warrior-plus-ipn.js`:
   ```javascript
   const WARRIOR_PLUS_PRODUCTS = {
       'your-actual-basic-product-id': 'basic',
       'your-actual-unlimited-product-id': 'unlimited',
       'your-actual-dfy-product-id': 'dfy',
       'your-actual-agency-product-id': 'agency'
   };
   ```

### 4. Set Environment Variables
Add these to your Netlify environment variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (not anon key)

### 5. Test the Integration
1. Deploy your site to Netlify
2. Make a test purchase through Warrior Plus
3. Verify the IPN handler updates the user's plan
4. Check that the user receives access to premium features

## How It Works

### Payment Flow:
1. User clicks upgrade button → Redirects to Warrior Plus product page
2. User completes purchase on Warrior Plus
3. Warrior Plus sends IPN to your site
4. IPN handler updates user's plan in database
5. User gets access to premium features

### IPN Handler:
- Located at: `netlify/functions/warrior-plus-ipn.js`
- Processes Warrior Plus notifications
- Updates user plans in Supabase
- Sends notifications to users

## Legal Compliance
- Terms of Service: `/terms`
- Privacy Policy: `/privacy` 
- Refund Policy: `/refund`

## Support
If you need help with the integration, contact support@vidscripthub.com

## Files Modified:
- `services/paymentService.ts` - Updated to redirect to Warrior Plus
- `context/AuthContext.tsx` - Modified upgrade handling
- `netlify/functions/warrior-plus-ipn.js` - New IPN handler
- `components/LegalPages.tsx` - New legal pages
- `AppRouter.tsx` - Added legal page routes
- `components/SalesPage.tsx` - Added legal links to footer

