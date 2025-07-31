
import React, { createContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import type { Session, User } from '../types.ts';
import { supabase } from '../services/supabaseClient.ts';
import type { Database } from '../services/database.types.ts';

// --- STATE AND INITIAL VALUES ---
export interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isLoading: true,
    error: null,
};

// --- ACTIONS ---
type Action =
    | { type: 'FETCH_USER_START' }
    | { type: 'FETCH_USER_SUCCESS'; payload: User }
    | { type: 'FETCH_USER_ERROR'; payload: string }
    | { type: 'COMPLETE_PERSONALIZATION_SUCCESS'; payload: Partial<User> }
    | { type: 'UPGRADE_TO_UNLIMITED_SUCCESS'; payload: { plan_level: 'unlimited' } }
    | { type: 'PURCHASE_DFY_VAULT_SUCCESS'; payload: { has_dfy_vault: boolean } }
    | { type: 'PURCHASE_AGENCY_LICENSE_SUCCESS'; payload: { is_agency: boolean } }
    | { type: 'UPDATE_PROFILE_SUCCESS'; payload: { name: string; email: string } };


type RequestAction =
    | { type: 'COMPLETE_PERSONALIZATION_REQUEST'; payload: { niche: string; platforms: ('tiktok' | 'instagram' | 'youtube')[]; tone: string } }
    | { type: 'UPGRADE_TO_UNLIMITED_REQUEST' }
    | { type: 'PURCHASE_DFY_VAULT_REQUEST' }
    | { type: 'PURCHASE_AGENCY_LICENSE_REQUEST' }
    | { type: 'UPDATE_PROFILE_REQUEST'; payload: { name: string; email: string } };


export type AuthDispatchableAction = Action | RequestAction;

// Type guard to differentiate between sync and async (request) actions
function isRequestAction(action: AuthDispatchableAction): action is RequestAction {
    return action.type.endsWith('_REQUEST');
}


// --- REDUCER ---
const authReducer = (state: AuthState, action: Action): AuthState => {
    switch (action.type) {
        case 'FETCH_USER_START': return { ...state, isLoading: true, error: null };
        case 'FETCH_USER_SUCCESS': return { ...state, isLoading: false, user: action.payload };
        case 'FETCH_USER_ERROR': return { ...state, isLoading: false, error: action.payload };
        case 'COMPLETE_PERSONALIZATION_SUCCESS': return { ...state, user: state.user ? { ...state.user, ...action.payload, isPersonalized: true } : null };
        case 'UPGRADE_TO_UNLIMITED_SUCCESS': return { ...state, user: state.user ? { ...state.user, plan_level: action.payload.plan_level } : null };
        case 'PURCHASE_DFY_VAULT_SUCCESS': return { ...state, user: state.user ? { ...state.user, has_dfy_vault: action.payload.has_dfy_vault } : null };
        case 'PURCHASE_AGENCY_LICENSE_SUCCESS': return { ...state, user: state.user ? { ...state.user, is_agency: action.payload.is_agency } : null };
        case 'UPDATE_PROFILE_SUCCESS': return { ...state, user: state.user ? { ...state.user, ...action.payload } : null };
        default: return state;
    }
};

// --- CONTEXT & PROVIDER ---
export const AuthContext = createContext<{
    state: AuthState;
    dispatch: React.Dispatch<AuthDispatchableAction>;
}>({
    state: initialState,
    dispatch: () => null
});

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const AuthProvider: React.FC<{ children: ReactNode; session: Session }> = ({ children, session }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        if (!session) {
            dispatch({ type: 'FETCH_USER_ERROR', payload: 'No active session.' });
            return;
        }

        const fetchDataWithRetry = async () => {
            dispatch({ type: 'FETCH_USER_START' });
            try {
                let profileData: Database['public']['Tables']['profiles']['Row'] | null = null;
                
                for (let i = 0; i < 5; i++) {
                    const { data, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                    if (error && error.code !== 'PGRST116') throw new Error(error.message);
                    if (data) { 
                        profileData = data;
                        break; 
                    }
                    await delay(500);
                }

                if (!profileData) {
                    console.warn("Profile not found after polling, attempting to create it as a fallback.");
                    const newProfile: Database['public']['Tables']['profiles']['Insert'] = {
                        id: session.user.id,
                        email: session.user.email ?? `user-${session.user.id}@example.com`,
                        name: session.user.user_metadata?.name ?? session.user.user_metadata?.full_name ?? 'New User',
                        avatar_url: session.user.user_metadata?.avatar_url ?? null,
                    };
                    const { data: insertedData, error: insertError } = await supabase.from('profiles').insert(newProfile).select().single();
                    if (insertError) {
                        if (insertError.code === '23505') { // unique_violation
                             console.log("Profile creation conflict (23505), re-fetching profile.");
                            const { data: refetchedData, error: refetchError } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                            if (refetchError) throw refetchError;
                            if (refetchedData) {
                                profileData = refetchedData;
                            }
                        } else {
                            throw new Error(insertError.message);
                        }
                    } else if (insertedData) {
                        profileData = insertedData;
                    }
                }
                
                if (!profileData) throw new Error("Fatal Error: Could not fetch or create a user profile.");
                
                const user: User = { 
                    id: profileData.id,
                    name: profileData.name,
                    email: profileData.email,
                    avatar_url: profileData.avatar_url,
                    primary_niche: profileData.primary_niche ?? undefined,
                    platforms: profileData.platforms ?? undefined,
                    preferred_tone: profileData.preferred_tone ?? undefined,
                    isPersonalized: profileData.isPersonalized,
                    plan_level: profileData.plan_level,
                    has_dfy_vault: profileData.has_dfy_vault,
                    is_agency: profileData.is_agency,
                };
                
                dispatch({ type: 'FETCH_USER_SUCCESS', payload: user });
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown data fetching error occurred.';
                dispatch({ type: 'FETCH_USER_ERROR', payload: errorMessage });
                console.error("Auth data fetching error:", error);
            }
        };

        fetchDataWithRetry();
    }, [session]);
    
    const handleAsyncAction = useCallback(async (action: RequestAction) => {
        if (!session) return;
        const userId = session.user.id;
        try {
            switch(action.type) {
                case 'COMPLETE_PERSONALIZATION_REQUEST': {
                    const updatePayload: Database['public']['Tables']['profiles']['Update'] = {
                        primary_niche: action.payload.niche,
                        platforms: action.payload.platforms,
                        preferred_tone: action.payload.tone,
                        isPersonalized: true
                    };
                    const { data, error } = await supabase.from('profiles').update(updatePayload).eq('id', userId).select().single();
                    if (error) throw error;
                    if (data) {
                        dispatch({
                            type: 'COMPLETE_PERSONALIZATION_SUCCESS',
                            payload: {
                                primary_niche: data.primary_niche ?? undefined,
                                platforms: data.platforms ?? undefined,
                                preferred_tone: data.preferred_tone ?? undefined,
                                isPersonalized: data.isPersonalized
                            }
                        });
                    }
                    break;
                }
                case 'UPGRADE_TO_UNLIMITED_REQUEST': {
                    const { error } = await supabase.from('profiles').update({ plan_level: 'unlimited' }).eq('id', userId);
                    if (error) throw error;
                    dispatch({ type: 'UPGRADE_TO_UNLIMITED_SUCCESS', payload: { plan_level: 'unlimited' } });
                    break;
                }
                 case 'PURCHASE_DFY_VAULT_REQUEST': {
                    const { error } = await supabase.from('profiles').update({ has_dfy_vault: true }).eq('id', userId);
                    if (error) throw error;
                    dispatch({ type: 'PURCHASE_DFY_VAULT_SUCCESS', payload: { has_dfy_vault: true } });
                    break;
                }
                case 'PURCHASE_AGENCY_LICENSE_REQUEST': {
                    const { error } = await supabase.from('profiles').update({ is_agency: true }).eq('id', userId);
                    if (error) throw error;
                    dispatch({ type: 'PURCHASE_AGENCY_LICENSE_SUCCESS', payload: { is_agency: true } });
                    break;
                }
                case 'UPDATE_PROFILE_REQUEST': {
                    const { name, email } = action.payload;
                    const { data, error } = await supabase.from('profiles').update({ name, email }).eq('id', userId).select().single();
                    if (error) throw error;
                    if (data) {
                        dispatch({ type: 'UPDATE_PROFILE_SUCCESS', payload: { name: data.name, email: data.email } });
                    }
                    break;
                }
            }
        } catch (error: any) {
            console.error(`Error in async dispatch for ${action.type}:`, error);
            // Optionally, dispatch a generic error action to show in UI
            // dispatch({ type: 'ASYNC_ACTION_ERROR', payload: error.message });
        }
    }, [session, dispatch]);

    const enhancedDispatch = useCallback((action: AuthDispatchableAction) => {
        if (isRequestAction(action)) {
            handleAsyncAction(action);
        } else {
            dispatch(action as Action);
        }
    }, [handleAsyncAction]);

    return (
        <AuthContext.Provider value={{ state, dispatch: enhancedDispatch }}>
            {children}
        </AuthContext.Provider>
    );
};
