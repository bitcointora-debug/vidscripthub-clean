const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for server-side operations
);

// Warrior Plus product mapping
const WARRIOR_PLUS_PRODUCTS = {
    'your-basic-product-id': 'basic',
    'your-unlimited-product-id': 'unlimited', 
    'your-dfy-product-id': 'dfy',
    'your-agency-product-id': 'agency'
};

exports.handler = async (event, context) => {
    // Set timeout to prevent 504 errors
    context.callbackWaitsForEmptyEventLoop = false;
    
    // Handle CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ message: 'Method Not Allowed' })
        };
    }

    try {
        console.log('=== WARRIOR PLUS IPN RECEIVED ===');
        console.log('Headers:', event.headers);
        console.log('Body:', event.body);

        // Parse the IPN data from Warrior Plus
        const ipnData = JSON.parse(event.body);
        
        // Verify this is a valid Warrior Plus IPN
        if (!ipnData.wp_sale_id || !ipnData.product_id) {
            console.error('Invalid IPN data - missing required fields');
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ message: 'Invalid IPN data' })
            };
        }

        // Map Warrior Plus product ID to our plan
        const plan = WARRIOR_PLUS_PRODUCTS[ipnData.product_id];
        if (!plan) {
            console.error('Unknown product ID:', ipnData.product_id);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ message: 'Unknown product ID' })
            };
        }

        // Extract customer email
        const customerEmail = ipnData.customer_email || ipnData.email;
        if (!customerEmail) {
            console.error('No customer email found in IPN');
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ message: 'No customer email found' })
            };
        }

        console.log(`Processing order for ${customerEmail} - Plan: ${plan}`);

        // Find user by email
        const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', customerEmail)
            .single();

        if (userError) {
            console.error('Error finding user:', userError);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ message: 'Error finding user' })
            };
        }

        if (!userData) {
            console.error('User not found for email:', customerEmail);
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ message: 'User not found' })
            };
        }

        // Update user's plan
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ 
                plan: plan,
                updated_at: new Date().toISOString()
            })
            .eq('id', userData.id);

        if (updateError) {
            console.error('Error updating user plan:', updateError);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ message: 'Error updating user plan' })
            };
        }

        // Log the successful upgrade
        console.log(`Successfully upgraded user ${customerEmail} to plan ${plan}`);

        // Add notification for the user
        const { error: notificationError } = await supabase
            .from('notifications')
            .insert({
                user_id: userData.id,
                message: `Welcome to ${plan.toUpperCase()} plan! You now have access to all premium features.`,
                read: false
            });

        if (notificationError) {
            console.warn('Error creating notification:', notificationError);
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                message: 'IPN processed successfully',
                user_id: userData.id,
                plan: plan
            })
        };

    } catch (error) {
        console.error('Error processing Warrior Plus IPN:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                message: 'Internal server error',
                error: error.message 
            })
        };
    }
};

