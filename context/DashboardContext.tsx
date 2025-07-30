

import React, { createContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import type { Session, User, Script, Folder, Notification, WatchedTrend, Client, Trend } from '../types.ts';
import { supabase } from '../services/supabaseClient.ts';
import type { Json } from '../services/database.types.ts';

// --- STATE AND INITIAL VALUES ---
interface DashboardState {
    user: User | null;
    savedScripts: Script[];
    folders: Folder[];
    notifications: Notification[];
    watchedTrends: WatchedTrend[];
    clients: Client[];
    isNewDfyAvailable: boolean;
    dashboardStats: { clicks: number; sales: number; earnings: number };
    movingScriptId: string | null;
    isLoading: boolean;
    error: string | null;
    quotaError: string | null;
}

const getInitialDashboardStats = () => {
    // This remains client-side for now for demo purposes
    try {
        const storedValue = localStorage.getItem('vsh_reseller_stats');
        if (storedValue) return JSON.parse(storedValue);
    } catch (error) { console.error(error); }
    return { clicks: 1234, sales: 87, earnings: 1479 };
};

const initialState: DashboardState = {
    user: null,
    savedScripts: [],
    folders: [],
    notifications: [],
    watchedTrends: [],
    clients: [],
    isNewDfyAvailable: true,
    dashboardStats: getInitialDashboardStats(),
    movingScriptId: null,
    isLoading: true,
    error: null,
    quotaError: null,
};


// --- ACTIONS ---
type Action =
    | { type: 'FETCH_DATA_START' }
    | { type: 'FETCH_DATA_SUCCESS'; payload: { user: User; savedScripts: Script[]; folders: Folder[]; notifications: Notification[]; watchedTrends: WatchedTrend[]; clients: Client[] } }
    | { type: 'FETCH_DATA_ERROR'; payload: string }
    | { type: 'USER_LOGGED_OUT' }
    | { type: 'ADD_NOTIFICATION_SUCCESS'; payload: Notification }
    | { type: 'MARK_ALL_NOTIFICATIONS_READ_SUCCESS'; payload: Notification[] }
    | { type: 'COMPLETE_PERSONALIZATION_SUCCESS'; payload: Partial<User> }
    | { type: 'SET_NEW_DFY_UNAVAILABLE' }
    | { type: 'ADD_SAVED_SCRIPT_SUCCESS'; payload: Script }
    | { type: 'UNSAVE_SCRIPT_SUCCESS'; payload: { scriptId: string } }
    | { type: 'UPDATE_SAVED_SCRIPT_VISUALS_SUCCESS'; payload: { scriptId: string; visuals: string[] } }
    | { type: 'SET_MOVING_SCRIPT_ID'; payload: string | null }
    | { type: 'MOVE_SCRIPT_TO_FOLDER_SUCCESS'; payload: { scriptId: string; folderId: string | null } }
    | { type: 'ADD_FOLDER_SUCCESS'; payload: Folder }
    | { type: 'RENAME_FOLDER_SUCCESS'; payload: { folderId: string; newName: string } }
    | { type: 'DELETE_FOLDER_SUCCESS'; payload: { folderId: string } }
    | { type: 'ADD_CLIENT_SUCCESS'; payload: Client }
    | { type: 'UPDATE_CLIENT_SUCCESS'; payload: { updatedClient: Client } }
    | { type: 'DELETE_CLIENT_SUCCESS'; payload: { clientId: string } }
    | { type: 'ADD_WATCHED_TREND_SUCCESS'; payload: WatchedTrend }
    | { type: 'REMOVE_WATCHED_TREND_SUCCESS'; payload: { topic: string } }
    | { type: 'SET_DASHBOARD_STATS', payload: { clicks: number; sales: number; earnings: number } }
    | { type: 'SET_QUOTA_ERROR'; payload: string }
    | { type: 'CLEAR_QUOTA_ERROR' };

// This is a new type to handle the async "request" actions that components dispatch
type RequestAction = 
    | { type: 'ADD_NOTIFICATION_REQUEST'; payload: { message: string } }
    | { type: 'MARK_ALL_NOTIFICATIONS_READ_REQUEST' }
    | { type: 'COMPLETE_PERSONALIZATION_REQUEST'; payload: { niche: string; platforms: ('tiktok' | 'instagram' | 'youtube')[]; tone: string } }
    | { type: 'ADD_SAVED_SCRIPT_REQUEST'; payload: { script: Script } }
    | { type: 'UNSAVE_SCRIPT_REQUEST'; payload: { scriptId: string } }
    | { type: 'UPDATE_SAVED_SCRIPT_VISUALS_REQUEST'; payload: { scriptId: string; visuals: string[] } }
    | { type: 'MOVE_SCRIPT_TO_FOLDER_REQUEST'; payload: { scriptId: string; folderId: string | null } }
    | { type: 'ADD_FOLDER_REQUEST'; payload: { folder: Folder } }
    | { type: 'RENAME_FOLDER_REQUEST'; payload: { folderId: string; newName: string } }
    | { type: 'DELETE_FOLDER_REQUEST'; payload: { folderId: string } }
    | { type: 'ADD_CLIENT_REQUEST'; payload: { clientData: Omit<Client, 'id'|'status'|'agency_owner_id'|'created_at'|'avatar'> } }
    | { type: 'UPDATE_CLIENT_REQUEST'; payload: { updatedClient: Client } }
    | { type: 'DELETE_CLIENT_REQUEST'; payload: { clientId: string } }
    | { type: 'ADD_WATCHED_TREND_REQUEST'; payload: { trend: Trend } }
    | { type: 'REMOVE_WATCHED_TREND_REQUEST'; payload: { topic: string } };

type DispatchableAction = Action | RequestAction;

// --- REDUCER ---
const dashboardReducer = (state: DashboardState, action: Action): DashboardState => {
    switch (action.type) {
        case 'FETCH_DATA_START': return { ...state, isLoading: true, error: null };
        case 'FETCH_DATA_SUCCESS': return { ...state, isLoading: false, ...action.payload };
        case 'FETCH_DATA_ERROR': return { ...state, isLoading: false, error: action.payload };
        case 'USER_LOGGED_OUT': return { ...initialState, isLoading: false };
        
        case 'SET_QUOTA_ERROR': return { ...state, quotaError: action.payload, isLoading: false };
        case 'CLEAR_QUOTA_ERROR': return { ...state, quotaError: null };
        
        case 'ADD_NOTIFICATION_SUCCESS': return { ...state, notifications: [action.payload, ...state.notifications] };
        case 'MARK_ALL_NOTIFICATIONS_READ_SUCCESS': return { ...state, notifications: action.payload };
        case 'COMPLETE_PERSONALIZATION_SUCCESS': return { ...state, user: state.user ? { ...state.user, ...action.payload, isPersonalized: true } : null };
        case 'SET_NEW_DFY_UNAVAILABLE': return { ...state, isNewDfyAvailable: false };
        
        case 'ADD_SAVED_SCRIPT_SUCCESS': return { ...state, savedScripts: [action.payload, ...state.savedScripts] };
        case 'UNSAVE_SCRIPT_SUCCESS': return { ...state, savedScripts: state.savedScripts.filter(s => s.id !== action.payload.scriptId) };
        case 'UPDATE_SAVED_SCRIPT_VISUALS_SUCCESS': return { ...state, savedScripts: state.savedScripts.map(s => s.id === action.payload.scriptId ? { ...s, visuals: action.payload.visuals } : s) };
        
        case 'SET_MOVING_SCRIPT_ID': return { ...state, movingScriptId: action.payload };
        case 'MOVE_SCRIPT_TO_FOLDER_SUCCESS': return { ...state, savedScripts: state.savedScripts.map(s => s.id === action.payload.scriptId ? { ...s, folder_id: action.payload.folderId } : s), movingScriptId: null };
        
        case 'ADD_FOLDER_SUCCESS': return { ...state, folders: [...state.folders, action.payload] };
        case 'RENAME_FOLDER_SUCCESS': return { ...state, folders: state.folders.map(f => f.id === action.payload.folderId ? { ...f, name: action.payload.newName } : f) };
        case 'DELETE_FOLDER_SUCCESS': return { ...state, folders: state.folders.filter(f => f.id !== action.payload.folderId), savedScripts: state.savedScripts.map(s => s.folder_id === action.payload.folderId ? {...s, folder_id: null} : s) };

        case 'ADD_CLIENT_SUCCESS': return { ...state, clients: [action.payload, ...state.clients] };
        case 'UPDATE_CLIENT_SUCCESS': return { ...state, clients: state.clients.map(c => c.id === action.payload.updatedClient.id ? action.payload.updatedClient : c) };
        case 'DELETE_CLIENT_SUCCESS': return { ...state, clients: state.clients.filter(c => c.id !== action.payload.clientId) };
        
        case 'ADD_WATCHED_TREND_SUCCESS': return { ...state, watchedTrends: [action.payload, ...state.watchedTrends] };
        case 'REMOVE_WATCHED_TREND_SUCCESS': return { ...state, watchedTrends: state.watchedTrends.filter(t => t.trend_data.topic !== action.payload.topic) };
        
        case 'SET_DASHBOARD_STATS': return { ...state, dashboardStats: action.payload };

        default: return state;
    }
};

// --- CONTEXT & PROVIDER ---
export const DashboardContext = createContext<{ state: DashboardState; dispatch: React.Dispatch<DispatchableAction> }>({
    state: initialState,
    dispatch: () => null
});

export const DashboardProvider: React.FC<{ children: ReactNode; session: Session }> = ({ children, session }) => {
    const [state, dispatch] = useReducer(dashboardReducer, initialState);

    // Data fetching effect
    useEffect(() => {
        if (session) {
            const fetchData = async () => {
                dispatch({ type: 'FETCH_DATA_START' });
                try {
                    const { data: profileData, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    if (profileError) throw profileError;
                    if (!profileData) throw new Error(`User profile not found for ID: ${session.user.id}`);
                    
                    const user: User = { 
                        id: profileData.id,
                        name: profileData.name,
                        email: profileData.email,
                        avatar_url: profileData.avatar_url,
                        primary_niche: profileData.primary_niche ?? undefined,
                        platforms: profileData.platforms ?? undefined,
                        preferred_tone: profileData.preferred_tone ?? undefined,
                        isPersonalized: !!profileData.primary_niche 
                    };
                    
                    const [scriptsRes, foldersRes, notificationsRes, watchedTrendsRes, clientsRes] = await Promise.all([
                        supabase.from('scripts').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }),
                        supabase.from('folders').select('*').eq('user_id', session.user.id).order('created_at', { ascending: true }),
                        supabase.from('notifications').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(20),
                        supabase.from('watched_trends').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }),
                        supabase.from('clients').select('*').eq('agency_owner_id', session.user.id).order('created_at', { ascending: false })
                    ]);

                    if (scriptsRes.error) throw scriptsRes.error;
                    if (foldersRes.error) throw foldersRes.error;
                    if (notificationsRes.error) throw notificationsRes.error;
                    if (watchedTrendsRes.error) throw watchedTrendsRes.error;
                    if (clientsRes.error) throw clientsRes.error;
                    
                    dispatch({ type: 'FETCH_DATA_SUCCESS', payload: {
                        user,
                        savedScripts: (scriptsRes.data || []) as Script[],
                        folders: [{ id: 'all', name: 'All Scripts' }, ...((foldersRes.data || []) as Folder[])],
                        notifications: (notificationsRes.data || []) as Notification[],
                        watchedTrends: (watchedTrendsRes.data || []) as WatchedTrend[],
                        clients: (clientsRes.data || []) as Client[]
                    }});

                } catch (error: any) {
                    dispatch({ type: 'FETCH_DATA_ERROR', payload: error.message });
                    console.error("Data fetching error:", error);
                }
            };
            fetchData();
        }
    }, [session]);
    
    // Async action handler
    const handleAsyncAction = useCallback(async (action: RequestAction) => {
        if (!session) return;
        const userId = session.user.id;
        
        try {
            switch(action.type) {
                case 'ADD_NOTIFICATION_REQUEST': {
                    const { data, error } = await supabase.from('notifications').insert({ message: action.payload.message, user_id: userId }).select().single();
                    if (error) throw error;
                    if (data) dispatch({ type: 'ADD_NOTIFICATION_SUCCESS', payload: data as Notification });
                    break;
                }
                case 'MARK_ALL_NOTIFICATIONS_READ_REQUEST': {
                     const { error } = await supabase.from('notifications').update({ read: true }).eq('user_id', userId).eq('read', false);
                     if (error) throw error;
                     const updatedNotifications = state.notifications.map(n => ({...n, read: true}));
                     dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ_SUCCESS', payload: updatedNotifications });
                     break;
                }
                case 'COMPLETE_PERSONALIZATION_REQUEST': {
                    const { data, error } = await supabase.from('profiles').update({ primary_niche: action.payload.niche, platforms: action.payload.platforms, preferred_tone: action.payload.tone }).eq('id', userId).select().single();
                    if (error) throw error;
                    if (data) {
                        dispatch({ type: 'COMPLETE_PERSONALIZATION_SUCCESS', payload: { primary_niche: data.primary_niche ?? undefined, platforms: data.platforms ?? undefined, preferred_tone: data.preferred_tone ?? undefined }});
                    }
                    break;
                }
                case 'ADD_SAVED_SCRIPT_REQUEST': {
                    const { isNew, ...scriptToInsert } = action.payload.script;
                    const { data, error } = await supabase.from('scripts').insert({ ...scriptToInsert, user_id: userId }).select().single();
                    if (error) throw error;
                    if (data) dispatch({ type: 'ADD_SAVED_SCRIPT_SUCCESS', payload: data as Script });
                    break;
                }
                case 'UNSAVE_SCRIPT_REQUEST': {
                    const { error } = await supabase.from('scripts').delete().eq('id', action.payload.scriptId);
                    if(error) throw error;
                    dispatch({ type: 'UNSAVE_SCRIPT_SUCCESS', payload: action.payload });
                    break;
                }
                 case 'MOVE_SCRIPT_TO_FOLDER_REQUEST': {
                    const { error } = await supabase.from('scripts').update({ folder_id: action.payload.folderId }).eq('id', action.payload.scriptId);
                    if (error) throw error;
                    dispatch({ type: 'MOVE_SCRIPT_TO_FOLDER_SUCCESS', payload: action.payload });
                    break;
                }
                case 'ADD_FOLDER_REQUEST': {
                    const { data, error } = await supabase.from('folders').insert({ ...action.payload.folder, user_id: userId }).select().single();
                    if (error) throw error;
                    if (data) dispatch({ type: 'ADD_FOLDER_SUCCESS', payload: data as Folder });
                    break;
                }
                case 'RENAME_FOLDER_REQUEST': {
                    const { error } = await supabase.from('folders').update({ name: action.payload.newName }).eq('id', action.payload.folderId);
                    if (error) throw error;
                    dispatch({ type: 'RENAME_FOLDER_SUCCESS', payload: action.payload });
                    break;
                }
                case 'DELETE_FOLDER_REQUEST': {
                    // First, update all scripts in this folder to set folder_id to null
                    const { error: updateError } = await supabase
                        .from('scripts')
                        .update({ folder_id: null })
                        .eq('user_id', userId)
                        .eq('folder_id', action.payload.folderId);
                    
                    if (updateError) throw updateError;
                    
                    // Then, delete the folder
                    const { error: deleteError } = await supabase
                        .from('folders')
                        .delete()
                        .eq('id', action.payload.folderId)
                        .eq('user_id', userId);

                    if (deleteError) throw deleteError;
                    
                    dispatch({ type: 'DELETE_FOLDER_SUCCESS', payload: action.payload });
                    break;
                }
                case 'ADD_CLIENT_REQUEST': {
                    const { data, error } = await supabase.from('clients').insert({ ...action.payload.clientData, agency_owner_id: userId, status: 'Pending' }).select().single();
                    if (error) throw error;
                    if (data) dispatch({ type: 'ADD_CLIENT_SUCCESS', payload: data as Client });
                    break;
                }
                case 'UPDATE_CLIENT_REQUEST': {
                    const { updatedClient } = action.payload;
                    const { data, error } = await supabase.from('clients').update({ name: updatedClient.name, email: updatedClient.email, status: updatedClient.status }).eq('id', updatedClient.id).eq('agency_owner_id', userId).select().single();
                    if (error) throw error;
                    if (data) dispatch({ type: 'UPDATE_CLIENT_SUCCESS', payload: { updatedClient: data as Client } });
                    break;
                }
                case 'DELETE_CLIENT_REQUEST': {
                    const { error } = await supabase.from('clients').delete().eq('id', action.payload.clientId).eq('agency_owner_id', userId);
                    if (error) throw error;
                    dispatch({ type: 'DELETE_CLIENT_SUCCESS', payload: action.payload });
                    break;
                }
                case 'ADD_WATCHED_TREND_REQUEST': {
                    const { data, error } = await supabase.from('watched_trends').insert({ user_id: userId, trend_data: action.payload.trend as unknown as Json }).select().single();
                    if (error) throw error;
                    if (data) dispatch({ type: 'ADD_WATCHED_TREND_SUCCESS', payload: data as WatchedTrend });
                    break;
                }
                case 'REMOVE_WATCHED_TREND_REQUEST': {
                    const { error } = await supabase.from('watched_trends').delete().eq('user_id', userId).eq('trend_data->>topic', action.payload.topic);
                    if (error) throw error;
                    dispatch({ type: 'REMOVE_WATCHED_TREND_SUCCESS', payload: action.payload });
                    break;
                }
                case 'UPDATE_SAVED_SCRIPT_VISUALS_REQUEST': {
                    const { error } = await supabase.from('scripts').update({ visuals: action.payload.visuals }).eq('id', action.payload.scriptId);
                    if(error) throw error;
                    dispatch({ type: 'UPDATE_SAVED_SCRIPT_VISUALS_SUCCESS', payload: action.payload });
                    break;
                }
            }
        } catch (error: any) {
            console.error(`Error in async dispatch for ${action.type}:`, error);
        }
    }, [session, state]);

    const enhancedDispatch = useCallback((action: DispatchableAction) => {
        if (action.type.endsWith('_REQUEST')) {
            handleAsyncAction(action as RequestAction);
        } else {
            dispatch(action as Action);
        }
    }, [handleAsyncAction]);


    useEffect(() => {
        localStorage.setItem('vsh_reseller_stats', JSON.stringify(state.dashboardStats));
    }, [state.dashboardStats]);

    return (
        <DashboardContext.Provider value={{ state, dispatch: enhancedDispatch }}>
            {children}
        </DashboardContext.Provider>
    );
};
