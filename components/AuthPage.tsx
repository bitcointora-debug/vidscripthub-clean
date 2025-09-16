import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../services/supabaseClient';

export const AuthPage: React.FC = () => {
    // Test Supabase connection on mount
    useEffect(() => {
        const testConnection = async () => {
            try {
                const { data, error } = await supabase.from('profiles').select('count').limit(1);
                if (error) {
                    console.error('Supabase connection error:', error);
                } else {
                    console.log('✅ Supabase connected successfully');
                }
            } catch (err) {
                console.error('❌ Supabase connection failed:', err);
            }
        };
        testConnection();
    }, []);

    // Listen for auth state changes and create profile if needed
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth event:', event, 'User:', session?.user?.email);
            
            // Handle both SIGNED_UP and SIGNED_IN events
            if ((event === 'SIGNED_UP' || event === 'SIGNED_IN') && session?.user) {
                console.log(`User ${event.toLowerCase()}, checking profile...`);
                try {
                    // Wait a moment for any existing trigger to complete
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Check if profile already exists
                    const { data: existingProfile, error: fetchError } = await supabase
                        .from('profiles')
                        .select('id')
                        .eq('id', session.user.id)
                        .single();
                    
                    if (existingProfile) {
                        console.log('Profile already exists');
                        return;
                    }
                    
                    if (fetchError && fetchError.code !== 'PGRST116') {
                        console.error('Error checking profile:', fetchError);
                        return;
                    }
                    
                    console.log('Profile does not exist, creating...');
                    
                    // Create profile for user with all required fields
                    const { error } = await supabase
                        .from('profiles')
                        .insert({
                            id: session.user.id,
                            email: session.user.email || '',
                            name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email || 'New User',
                            avatar_url: session.user.user_metadata?.avatar_url || null,
                            isPersonalized: false,
                            plan: 'basic',
                            access_level: 'standard',
                            plan_level: 'standard'
                        });
                    
                    if (error) {
                        console.error('Error creating profile:', error);
                        // Try to update existing profile if insert failed
                        const { error: updateError } = await supabase
                            .from('profiles')
                            .update({
                                name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email || 'New User',
                                email: session.user.email || '',
                                avatar_url: session.user.user_metadata?.avatar_url || null,
                                isPersonalized: false,
                                plan: 'basic',
                                access_level: 'standard',
                                plan_level: 'standard'
                            })
                            .eq('id', session.user.id);
                        
                        if (updateError) {
                            console.error('Error updating profile:', updateError);
                        } else {
                            console.log('Profile updated successfully');
                        }
                    } else {
                        console.log('Profile created successfully');
                    }
                } catch (error) {
                    console.error('Error in profile creation:', error);
                }
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <div className="min-h-screen bg-[#1A0F3C] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-8">
                    <img src="/images/dashboard-logo.png" alt="Vid Script Hub Logo" className="h-10 w-auto mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-white">Welcome to Vid Script Hub</h1>
                    <p className="text-purple-300">Sign up or sign in to continue.</p>
                </div>
                <div className="bg-[#2A1A5E] p-8 rounded-xl border border-[#4A3F7A]">
                     <Auth
                        supabaseClient={supabase}
                        redirectTo={window.location.origin}
                        appearance={{ 
                            theme: ThemeSupa,
                            variables: {
                                default: {
                                    colors: {
                                        brand: '#DAFF00',
                                        brandAccent: '#a8c400',
                                        brandButtonText: '#1A0F3C',
                                        defaultButtonBackground: '#1A0F3C',
                                        defaultButtonBackgroundHover: '#4A3F7A',
                                        defaultButtonBorder: '#4A3F7A',
                                        defaultButtonText: '#F0F0F0',
                                        inputBackground: '#1A0F3C',
                                        inputBorder: '#4A3F7A',
                                        inputBorderHover: '#DAFF00',
                                        inputBorderFocus: '#DAFF00',
                                        inputText: '#F0F0F0',
                                        inputLabelText: '#a78bfa',
                                        inputPlaceholder: '#6b7280',
                                        messageText: '#F0F0F0',
                                        messageTextDanger: '#fca5a5',
                                        anchorTextColor: '#a78bfa',
                                        anchorTextHoverColor: '#DAFF00',
                                    },
                                    space: {
                                        buttonPadding: '12px 15px',
                                        inputPadding: '12px 15px',
                                        labelBottomMargin: '8px'
                                    },
                                    radii: {
                                        borderRadiusButton: '8px',
                                        inputBorderRadius: '8px'
                                    }
                                }
                            }
                        }}
                        providers={[]}
                        theme="dark"
                        localization={{
                            variables: {
                                sign_up: {
                                    email_label: 'Email address',
                                    password_label: 'Create a Password',
                                    button_label: 'Sign up',
                                    social_provider_text: 'Sign up with {{provider}}',
                                    link_text: 'Already have an account? Sign in',
                                },
                                sign_in: {
                                    email_label: 'Email address',
                                    password_label: 'Your Password',
                                    button_label: 'Sign in',
                                    social_provider_text: 'Sign in with {{provider}}',
                                    link_text: "Don't have an account? Sign up",
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
};