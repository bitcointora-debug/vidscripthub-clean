

import React, { useState, useContext, useEffect } from 'react';
import type { User } from '../types.ts';
import { supabase } from '../services/supabaseClient.ts';
import { createBillingPortalSession } from '../services/geminiService.ts';
import { AuthContext } from '../context/AuthContext.tsx';

interface AccountSettingsViewProps {
  user: User;
}

interface FormState {
    isSaving: boolean;
    message: string | null;
    messageType: 'success' | 'error' | null;
}

const InfoRow: React.FC<{ label: string; name: string; value: string; isInput?: boolean; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string }> = ({ label, name, value, isInput = false, onChange, type = 'text' }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 items-center">
        <label htmlFor={name} className="text-sm font-medium text-purple-200">{label}</label>
        <div className="md:col-span-2">
            {isInput ? (
                <input
                    id={name}
                    name={name}
                    type={type}
                    defaultValue={value}
                    onChange={onChange}
                    className="w-full bg-[#1A0F3C] border border-[#4A3F7A] rounded-md py-2 px-3 text-[#F0F0F0] placeholder-purple-300/50 focus:ring-2 focus:ring-[#DAFF00] focus:border-[#DAFF00] focus:outline-none transition duration-200"
                />
            ) : (
                <span className="text-white">{value}</span>
            )}
        </div>
    </div>
);

export const AccountSettingsView: React.FC<AccountSettingsViewProps> = ({ user: initialUser }) => {
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
    // Use the user from context as the primary source of truth, fallback to prop
    const user = authState.user || initialUser;
    
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    
    useEffect(() => {
        setName(user.name);
        setEmail(user.email);
    }, [user]);

    const [profileState, setProfileState] = useState<FormState>({ isSaving: false, message: null, messageType: null });
    const [isManaging, setIsManaging] = useState(false);
    const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);
    
    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileState({ isSaving: true, message: null, messageType: null });
        
        try {
            authDispatch({ type: 'UPDATE_PROFILE_REQUEST', payload: { name, email } });
            // The context will handle the optimistic update. We'll show a success message here.
            setProfileState({ isSaving: false, message: "Profile updated successfully!", messageType: 'success' });
        } catch (error) {
            setProfileState({ isSaving: false, message: "Failed to update profile.", messageType: 'error' });
        }
        
        setTimeout(() => setProfileState({ isSaving: false, message: null, messageType: null }), 3000);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    const handleManageSubscription = async () => {
        setIsManaging(true);
        setFallbackUrl(null);
        try {
            const { url } = await createBillingPortalSession();
            const newWindow = window.open(url, '_blank');
            if (newWindow === null || typeof newWindow === 'undefined' || newWindow.closed) {
                setFallbackUrl(url);
            }
        } catch (error) {
            console.error('Could not create billing portal session:', error);
            alert('Could not open the subscription management page. Please try again later.');
        } finally {
            setIsManaging(false);
        }
    };

    const PlanDetails = () => (
        <div className="p-6 space-y-2">
             <h3 className="font-bold text-white">Your Plan Details</h3>
             <div className="bg-[#1A0F3C] p-3 rounded-lg flex items-center gap-3">
                <i className="fa-solid fa-star text-lg text-yellow-400"></i>
                <div>
                    <p className="font-semibold text-white">Standard Plan</p>
                    <p className="text-xs text-purple-300">Core script generation features.</p>
                </div>
             </div>
             {user.plan_level === 'unlimited' && (
                <div className="bg-[#1A0F3C] p-3 rounded-lg flex items-center gap-3">
                    <i className="fa-solid fa-infinity text-lg text-purple-400"></i>
                    <div>
                        <p className="font-semibold text-white">Unlimited Add-on</p>
                        <p className="text-xs text-purple-300">Longer scripts, trending topics, advanced tones.</p>
                    </div>
                </div>
             )}
              {user.has_dfy_vault && (
                <div className="bg-[#1A0F3C] p-3 rounded-lg flex items-center gap-3">
                    <i className="fa-solid fa-gem text-lg text-cyan-400"></i>
                    <div>
                        <p className="font-semibold text-white">DFY Vault Add-on</p>
                        <p className="text-xs text-purple-300">Premium scripts, hooks, and masterclasses.</p>
                    </div>
                </div>
             )}
              {user.is_agency && (
                <div className="bg-[#1A0F3C] p-3 rounded-lg flex items-center gap-3">
                    <i className="fa-solid fa-briefcase text-lg text-green-400"></i>
                    <div>
                        <p className="font-semibold text-white">Agency License</p>
                        <p className="text-xs text-purple-300">Client management and reseller rights.</p>
                    </div>
                </div>
             )}
        </div>
    );

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
                <p className="text-purple-300">Manage your profile, password, and subscription plan.</p>
            </div>

            {/* Profile Information Section */}
            <form onSubmit={handleProfileUpdate}>
                <section className="bg-[#2A1A5E]/50 rounded-xl border border-[#4A3F7A]/30 shadow-lg">
                    <div className="p-6 border-b border-[#4A3F7A]/30">
                        <h2 className="text-xl font-bold text-white">Profile Information</h2>
                        <p className="text-sm text-purple-300 mt-1">Update your personal details.</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <InfoRow label="Full Name" name="name" value={name} onChange={e => setName(e.target.value)} isInput />
                        <InfoRow label="Email Address" name="email" value={email} onChange={e => setEmail(e.target.value)} isInput type="email" />
                    </div>
                    <div className="p-6 bg-[#1A0F3C]/50 rounded-b-xl flex justify-between items-center gap-4 flex-wrap">
                        <button 
                            type="button"
                            onClick={handleSignOut}
                            className="px-5 py-2 text-sm font-bold text-red-400 bg-red-900/50 rounded-md hover:bg-red-900/80 transition-all duration-200"
                        >
                           <i className="fa-solid fa-arrow-right-from-bracket mr-2"></i>
                           Sign Out
                        </button>
                        <div className="flex items-center gap-4">
                            {profileState.message && (
                                <span className={`text-sm ${profileState.messageType === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                    {profileState.message}
                                </span>
                            )}
                            <button 
                                type="submit"
                                disabled={profileState.isSaving}
                                className="px-5 py-2 w-32 text-sm font-bold bg-[#DAFF00] text-[#1A0F3C] rounded-md hover:bg-opacity-90 transition-all duration-200 disabled:bg-slate-700 disabled:text-slate-400"
                            >
                                {profileState.isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </section>
            </form>
            
            {/* Subscription Plan Section */}
            <section className="bg-[#2A1A5E]/50 rounded-xl border border-[#4A3F7A]/30 shadow-lg">
                <div className="p-6 border-b border-[#4A3F7A]/30 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white">Subscription Plan</h2>
                        <p className="text-sm text-purple-300 mt-1">View and manage your purchases.</p>
                    </div>
                    <button
                        onClick={handleManageSubscription}
                        disabled={isManaging}
                        className="px-4 py-1.5 w-40 text-center text-xs font-bold bg-transparent border-2 border-[#4A3F7A] text-purple-200 rounded-md hover:bg-[#2A1A5E] hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isManaging ? 'Loading...' : 'Manage Subscription'}
                    </button>
                </div>
                <PlanDetails />
                 {fallbackUrl && (
                    <div className="p-6 border-t border-[#4A3F7A]/30">
                        <div className="bg-yellow-900/20 border border-yellow-500/30 text-yellow-200 px-4 py-3 rounded-lg text-sm">
                            <p>
                                <i className="fa-solid fa-circle-exclamation mr-2"></i>
                                Your browser may have blocked the pop-up. 
                                <a href={fallbackUrl} target="_blank" rel="noopener noreferrer" className="font-bold underline ml-1 hover:text-yellow-100">Click here to open it manually.</a>
                            </p>
                        </div>
                    </div>
                )}
                 {user.plan_level === 'unlimited' && (
                    <div className="p-6 border-t border-[#4A3F7A]/30">
                        <div className="bg-[#1A0F3C] p-4 rounded-lg border-l-4 border-[#DAFF00]">
                            <h3 className="font-bold text-white flex items-center gap-2"><i className="fa-solid fa-star text-yellow-400"></i>Premium Support</h3>
                            <p className="text-sm text-purple-200 mt-2">As an Unlimited member, you have access to priority support. Please email us at <a href="mailto:unlimited@vidscripthub.com" className="text-[#DAFF00] underline">unlimited@vidscripthub.com</a> for faster assistance.</p>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};