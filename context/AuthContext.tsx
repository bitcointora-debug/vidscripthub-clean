
import React, { createContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import type { Session, User, Plan } from '../types.ts';
import { supabase } from '../services/supabaseClient.ts';
import { fetchUser, createUser, updateUser } from '../services/supabaseService.ts';

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
    | { type: 'FETCH_USER_SUCCESS'; payload: User | null }
    | { type: 'FETCH_USER_ERROR'; payload: string }
    | { type: 'SET_GUEST_USER'; payload: Plan }
    | { type: 'COMPLETE_PERSONALIZATION_SUCCESS'; payload: Partial<User> }
    | { type: 'UPGRADE_PLAN_SUCCESS'; payload: Plan };

type RequestAction =
    | { type: 'COMPLETE_PERSONALIZATION_REQUEST'; payload: { niche: string; platforms: ('tiktok' | 'instagram' | 'youtube')[]; tone: string } }
    | { type: 'UPGRADE_PLAN_REQUEST'; payload: Plan };

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
        case 'SET_GUEST_USER':
            const guestId = `guest-${crypto.randomUUID()}`;
            return {
                ...state,
                isLoading: false,
                user: {
                    id: guestId,
                    name: 'Guest User',
                    email: `guest@${guestId}.com`,
                    avatar_url: null,
                    primary_niche: null,
                    platforms: null,
                    preferred_tone: null,
                    isPersonalized: true, // Skip personalization for guests
                    plan: action.payload,
                }
            };
        case 'COMPLETE_PERSONALIZATION_SUCCESS': return { ...state, user: state.user ? { ...state.user, ...action.payload, isPersonalized: true } : null };
        case 'UPGRADE_PLAN_SUCCESS': return { ...state, user: state.user ? { ...state.user, plan: action.payload } : null };
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

interface AuthProviderProps {
    children: ReactNode;
    session: Session | null;
    guestPlan: Plan | null;
    pendingUpgradePlan: Plan | null;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, session, guestPlan, pendingUpgradePlan }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        if (!session) {
            if (guestPlan) {
                dispatch({ type: 'SET_GUEST_USER', payload: guestPlan });
            } else {
                dispatch({ type: 'FETCH_USER_SUCCESS', payload: null });
            }
            return;
        }

        const fetchDataWithRetry = async () => {
            dispatch({ type: 'FETCH_USER_START' });
            try {
                let user = await fetchUser(session.user.id);
                
                if (!user) {
                    console.warn("Profile not found, creating new profile.");
                    const newProfile = {
                        id: session.user.id,
                        email: session.user.email || '',
                        name: String(session.user.user_metadata?.name || session.user.user_metadata?.full_name || 'New User'),
                        avatar_url: (session.user.user_metadata?.avatar_url as string | null) || null,
                        isPersonalized: false,
                        plan: pendingUpgradePlan || 'basic'
                    };
                    user = await createUser(newProfile);
                }
                
                dispatch({ type: 'FETCH_USER_SUCCESS', payload: user });

            } catch (error: any) {
                console.error("Auth context error:", error);
                dispatch({ type: 'FETCH_USER_ERROR', payload: `There was a problem loading your profile: ${error.message}. Please try signing out and back in.` });
            }
        };

        fetchDataWithRetry();
    }, [session, guestPlan, pendingUpgradePlan]);

    const handleAsyncAction = useCallback(async (action: RequestAction) => {
        if (!state.user || state.user.id.startsWith('guest-')) {
            console.warn("Cannot perform request for a guest user or without a user.");
            return;
        }
        
        switch(action.type) {
            case 'COMPLETE_PERSONALIZATION_REQUEST': {
                const { niche, platforms, tone } = action.payload;
                const updatePayload: Database['public']['Tables']['profiles']['Update'] = {
                    primary_niche: niche,
                    platforms: platforms,
                    preferred_tone: tone,
                    isPersonalized: true
                };
                const { error } = await supabase.from('profiles').update(updatePayload).eq('id', state.user.id);
                if (error) console.error("Error updating personalization:", error.message);
                else dispatch({ type: 'COMPLETE_PERSONALIZATION_SUCCESS', payload: updatePayload });
                break;
            }
            case 'UPGRADE_PLAN_REQUEST': {
                const newPlan = action.payload;
                const { error } = await supabase.from('profiles').update({ plan: newPlan }).eq('id', state.user.id);
                if (error) console.error("Error upgrading plan:", error.message);
                else dispatch({ type: 'UPGRADE_PLAN_SUCCESS', payload: newPlan });
                break;
            }
        }
    }, [state.user]);
    
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
