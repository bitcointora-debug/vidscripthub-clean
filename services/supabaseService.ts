import { supabase, supabaseUrl, supabaseAnonKey } from './supabaseClient';
import { 
    User, 
    Script,
    Notification,
    Json,
    Database,
} from '../types';
import { PLANS } from './plans';
import { getErrorMessage } from '../utils';

// --- Type Aliases for Supabase Payloads ---
type TProfiles = Database["public"]["Tables"]["profiles"];
type ProfileInsert = TProfiles["Insert"];
type ProfileUpdate = TProfiles["Update"];

type TNotifications = Database["public"]["Tables"]["notifications"];
type NotificationUpdate = TNotifications["Update"];

// --- Type Guards for Data Validation ---
const isValidSubscription = (sub: any): sub is any => {
    return sub && typeof sub === 'object' &&
           ['free', 'pro', 'viralyzaier', 'basic', 'unlimited', 'dfy', 'agency'].includes(sub.planId) &&
           ['active', 'canceled', 'inactive'].includes(sub.status);
};

// Helper to sanitize JSON before sending it to Supabase
const sanitizeJson = (value: any): Json | null => {
    return value ? JSON.parse(JSON.stringify(value)) as Json : null;
}

// --- Mappers ---
export const profileRowToUser = (row: any): User => ({
    id: row.id,
    name: row.name || 'User',
    email: row.email,
    avatar_url: row.avatar_url,
    primary_niche: row.primary_niche,
    platforms: row.platforms || [],
    preferred_tone: row.preferred_tone,
    isPersonalized: row.isPersonalized || false,
    plan: row.plan || 'basic',
    aiCredits: row.ai_credits || 0,
    channelAudit: row.channel_audit || null,
    cloned_voices: row.cloned_voices || [],
    content_pillars: row.content_pillars || [],
    subscription: isValidSubscription(row.subscription) ? row.subscription : { planId: 'basic', status: 'active', endDate: null },
});

const userToProfileUpdate = (updates: Partial<User>): ProfileUpdate => {
    const dbUpdates: ProfileUpdate = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.avatar_url !== undefined) dbUpdates.avatar_url = updates.avatar_url;
    if (updates.primary_niche !== undefined) dbUpdates.primary_niche = updates.primary_niche;
    if (updates.platforms !== undefined) dbUpdates.platforms = updates.platforms;
    if (updates.preferred_tone !== undefined) dbUpdates.preferred_tone = updates.preferred_tone;
    if (updates.isPersonalized !== undefined) dbUpdates.isPersonalized = updates.isPersonalized;
    if (updates.plan !== undefined) dbUpdates.plan = updates.plan;
    return dbUpdates;
};

// --- Auth ---
export const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return { session };
};

export const onAuthStateChange = (callback: (event: string, session: any | null) => void) => {
    const { data: authListener } = supabase.auth.onAuthStateChange(callback);
    return authListener;
};

export const signInWithPassword = async (email: string, password: string): Promise<any | null> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(getErrorMessage(error));
    return data.session;
};

export const signUp = async (email: string, password: string): Promise<void> => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(getErrorMessage(error));
};

export const sendPasswordResetEmail = async (email: string): Promise<void> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
    if (error) throw new Error(getErrorMessage(error));
};

export const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(getErrorMessage(error));
};

// --- User Management ---
export const fetchUser = async (userId: string): Promise<User | null> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching user:', error);
        return null;
    }

    return profileRowToUser(data);
};

export const createUser = async (userData: ProfileInsert): Promise<User> => {
    const { data, error } = await supabase
        .from('profiles')
        .insert([userData])
        .select('*')
        .single();

    if (error) throw new Error(getErrorMessage(error));
    return profileRowToUser(data);
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<User> => {
    const dbUpdates = userToProfileUpdate(updates);
    
    const { data, error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', userId)
        .select('*')
        .single();

    if (error) throw new Error(getErrorMessage(error));
    return profileRowToUser(data);
};

// --- Scripts ---
export const fetchScripts = async (userId: string): Promise<Script[]> => {
    const { data, error } = await supabase
        .from('scripts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching scripts:', error);
        return [];
    }

    return data || [];
};

export const saveScript = async (script: Omit<Script, 'id' | 'created_at'>): Promise<Script> => {
    const { data, error } = await supabase
        .from('scripts')
        .insert([{
            user_id: script.user_id,
            folder_id: script.folder_id,
            title: script.title,
            hook: script.hook,
            script: script.script,
            tone: script.tone,
            viral_score_breakdown: script.viral_score_breakdown ? sanitizeJson(script.viral_score_breakdown) : null,
            visuals: script.visuals || [],
            niche: script.niche,
        }])
        .select('*')
        .single();

    if (error) throw new Error(getErrorMessage(error));
    return data;
};

export const updateScript = async (scriptId: string, updates: Partial<Script>): Promise<Script> => {
    const { data, error } = await supabase
        .from('scripts')
        .update({
            title: updates.title,
            hook: updates.hook,
            script: updates.script,
            tone: updates.tone,
            viral_score_breakdown: updates.viral_score_breakdown ? sanitizeJson(updates.viral_score_breakdown) : null,
            visuals: updates.visuals,
            niche: updates.niche,
            folder_id: updates.folder_id,
        })
        .eq('id', scriptId)
        .select('*')
        .single();

    if (error) throw new Error(getErrorMessage(error));
    return data;
};

export const deleteScript = async (scriptId: string): Promise<void> => {
    const { error } = await supabase
        .from('scripts')
        .delete()
        .eq('id', scriptId);

    if (error) throw new Error(getErrorMessage(error));
};

// --- Folders ---
export const fetchFolders = async (userId: string): Promise<any[]> => {
    const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching folders:', error);
        return [];
    }

    return data || [];
};

export const createFolder = async (folder: { name: string; user_id: string }): Promise<any> => {
    const { data, error } = await supabase
        .from('folders')
        .insert([folder])
        .select('*')
        .single();

    if (error) throw new Error(getErrorMessage(error));
    return data;
};

export const updateFolder = async (folderId: string, name: string): Promise<any> => {
    const { data, error } = await supabase
        .from('folders')
        .update({ name })
        .eq('id', folderId)
        .select('*')
        .single();

    if (error) throw new Error(getErrorMessage(error));
    return data;
};

export const deleteFolder = async (folderId: string): Promise<void> => {
    const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', folderId);

    if (error) throw new Error(getErrorMessage(error));
};

// --- Clients ---
export const fetchClients = async (userId: string): Promise<any[]> => {
    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('agency_owner_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching clients:', error);
        return [];
    }

    return data || [];
};

export const createClient = async (client: Omit<any, 'id' | 'created_at'>): Promise<any> => {
    const { data, error } = await supabase
        .from('clients')
        .insert([client])
        .select('*')
        .single();

    if (error) throw new Error(getErrorMessage(error));
    return data;
};

export const updateClient = async (clientId: string, updates: Partial<any>): Promise<any> => {
    const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', clientId)
        .select('*')
        .single();

    if (error) throw new Error(getErrorMessage(error));
    return data;
};

export const deleteClient = async (clientId: string): Promise<void> => {
    const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

    if (error) throw new Error(getErrorMessage(error));
};

// --- Notifications ---
export const fetchNotifications = async (userId: string): Promise<Notification[]> => {
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }

    return data || [];
};

export const createNotification = async (notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification> => {
    const { data, error } = await supabase
        .from('notifications')
        .insert([notification])
        .select('*')
        .single();

    if (error) throw new Error(getErrorMessage(error));
    return data;
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

    if (error) throw new Error(getErrorMessage(error));
};

export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId);

    if (error) throw new Error(getErrorMessage(error));
};

// --- Watched Trends ---
export const fetchWatchedTrends = async (userId: string): Promise<any[]> => {
    const { data, error } = await supabase
        .from('watched_trends')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching watched trends:', error);
        return [];
    }

    return data || [];
};

export const createWatchedTrend = async (trend: { user_id: string; trend_data: any }): Promise<any> => {
    const { data, error } = await supabase
        .from('watched_trends')
        .insert([{
            user_id: trend.user_id,
            trend_data: sanitizeJson(trend.trend_data),
        }])
        .select('*')
        .single();

    if (error) throw new Error(getErrorMessage(error));
    return data;
};

export const deleteWatchedTrend = async (trendId: string): Promise<void> => {
    const { error } = await supabase
        .from('watched_trends')
        .delete()
        .eq('id', trendId);

    if (error) throw new Error(getErrorMessage(error));
};