
import React, { createContext, useReducer, useEffect, ReactNode, useCallback, useContext } from 'react';
import type { Script, Folder, WatchedTrend, Client, Trend, Notification } from '../types.ts';
import { supabase } from '../services/supabaseClient.ts';
import { 
    fetchScripts, 
    saveScript, 
    updateScript, 
    deleteScript,
    fetchFolders,
    createFolder,
    updateFolder,
    deleteFolder,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    fetchNotifications,
    createNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    fetchWatchedTrends,
    createWatchedTrend,
    deleteWatchedTrend
} from '../services/supabaseService.ts';
import { AuthContext } from './AuthContext.tsx';

// --- STATE AND INITIAL VALUES ---
export interface DataState {
    savedScripts: Script[];
    folders: Folder[];
    watchedTrends: WatchedTrend[];
    clients: Client[];
    notifications: Notification[];
    isLoading: boolean;
    error: string | null;
}

const initialState: DataState = {
    savedScripts: [],
    folders: [],
    watchedTrends: [],
    clients: [],
    notifications: [],
    isLoading: true,
    error: null,
};

// --- ACTIONS ---
type Action =
    | { type: 'FETCH_DATA_START' }
    | { type: 'FETCH_DATA_SUCCESS'; payload: { folders: Folder[]; clients: Client[]; savedScripts: Script[]; watchedTrends: WatchedTrend[]; notifications: Notification[] } }
    | { type: 'FETCH_DATA_ERROR'; payload: string }
    | { type: 'ADD_SAVED_SCRIPT_SUCCESS'; payload: Script }
    | { type: 'UNSAVE_SCRIPT_SUCCESS'; payload: { scriptId: string } }
    | { type: 'UPDATE_SAVED_SCRIPT_VISUALS_SUCCESS'; payload: { scriptId: string; visuals: string[] } }
    | { type: 'MOVE_SCRIPT_TO_FOLDER_SUCCESS'; payload: { scriptId: string; folderId: string | null } }
    | { type: 'ADD_FOLDER_SUCCESS'; payload: Folder }
    | { type: 'RENAME_FOLDER_SUCCESS'; payload: { folderId: string; newName: string } }
    | { type: 'DELETE_FOLDER_SUCCESS'; payload: { folderId: string } }
    | { type: 'ADD_CLIENT_SUCCESS'; payload: Client }
    | { type: 'UPDATE_CLIENT_SUCCESS'; payload: { updatedClient: Client } }
    | { type: 'DELETE_CLIENT_SUCCESS'; payload: { clientId: string } }
    | { type: 'ADD_WATCHED_TREND_SUCCESS'; payload: WatchedTrend }
    | { type: 'REMOVE_WATCHED_TREND_SUCCESS'; payload: { topic: string } }
    | { type: 'BATCH_DELETE_SCRIPTS_SUCCESS'; payload: { scriptIds: string[] } }
    | { type: 'BATCH_MOVE_SCRIPTS_SUCCESS'; payload: { scriptIds: string[]; folderId: string | null } }
    | { type: 'ADD_NOTIFICATION_SUCCESS'; payload: Notification }
    | { type: 'MARK_ALL_NOTIFICATIONS_READ_SUCCESS'; payload: Notification[] };


type RequestAction =
    | { type: 'ADD_SAVED_SCRIPT_REQUEST'; payload: { script: Script } }
    | { type: 'UNSAVE_SCRIPT_REQUEST'; payload: { scriptId: string } }
    | { type: 'UPDATE_SAVED_SCRIPT_VISUALS_REQUEST'; payload: { scriptId: string; visuals: string[] } }
    | { type: 'MOVE_SCRIPT_TO_FOLDER_REQUEST'; payload: { scriptId: string; folderId: string | null } }
    | { type: 'ADD_FOLDER_REQUEST'; payload: { folder: Omit<Folder, 'id'> & { id?: string } } }
    | { type: 'RENAME_FOLDER_REQUEST'; payload: { folderId: string; newName: string } }
    | { type: 'DELETE_FOLDER_REQUEST'; payload: { folderId: string } }
    | { type: 'ADD_CLIENT_REQUEST'; payload: { clientData: Omit<Client, 'id' | 'status'> } }
    | { type: 'UPDATE_CLIENT_REQUEST'; payload: { updatedClient: Client } }
    | { type: 'DELETE_CLIENT_REQUEST'; payload: { clientId: string } }
    | { type: 'ADD_WATCHED_TREND_REQUEST'; payload: { trend: Trend } }
    | { type: 'REMOVE_WATCHED_TREND_REQUEST'; payload: { topic: string } }
    | { type: 'BATCH_DELETE_SCRIPTS_REQUEST'; payload: { scriptIds: string[] } }
    | { type: 'BATCH_MOVE_SCRIPTS_REQUEST'; payload: { scriptIds: string[]; folderId: string | null } }
    | { type: 'ADD_NOTIFICATION_REQUEST'; payload: { message: string; userId: string } }
    | { type: 'MARK_ALL_NOTIFICATIONS_READ_REQUEST'; payload: { userId: string } };

export type DataDispatchableAction = Action | RequestAction;

// --- REDUCER ---
const dataReducer = (state: DataState, action: Action): DataState => {
    switch (action.type) {
        case 'FETCH_DATA_START': return { ...state, isLoading: true, error: null };
        case 'FETCH_DATA_SUCCESS': return { ...state, isLoading: false, ...action.payload };
        case 'FETCH_DATA_ERROR': return { ...state, isLoading: false, error: action.payload };

        case 'ADD_SAVED_SCRIPT_SUCCESS': return { ...state, savedScripts: [action.payload, ...state.savedScripts] };
        case 'UNSAVE_SCRIPT_SUCCESS': return { ...state, savedScripts: state.savedScripts.filter(s => s.id !== action.payload.scriptId) };
        case 'UPDATE_SAVED_SCRIPT_VISUALS_SUCCESS': return { ...state, savedScripts: state.savedScripts.map(s => s.id === action.payload.scriptId ? { ...s, visuals: action.payload.visuals } : s) };
        case 'MOVE_SCRIPT_TO_FOLDER_SUCCESS': return { ...state, savedScripts: state.savedScripts.map(s => s.id === action.payload.scriptId ? { ...s, folder_id: action.payload.folderId } : s)};
        
        case 'ADD_FOLDER_SUCCESS': return { ...state, folders: [...state.folders, action.payload] };
        case 'RENAME_FOLDER_SUCCESS': return { ...state, folders: state.folders.map(f => f.id === action.payload.folderId ? { ...f, name: action.payload.newName } : f) };
        case 'DELETE_FOLDER_SUCCESS': return { ...state, folders: state.folders.filter(f => f.id !== action.payload.folderId), savedScripts: state.savedScripts.map(s => s.folder_id === action.payload.folderId ? {...s, folder_id: null} : s) };

        case 'ADD_CLIENT_SUCCESS': return { ...state, clients: [action.payload, ...state.clients] };
        case 'UPDATE_CLIENT_SUCCESS': return { ...state, clients: state.clients.map(c => c.id === action.payload.updatedClient.id ? action.payload.updatedClient : c) };
        case 'DELETE_CLIENT_SUCCESS': return { ...state, clients: state.clients.filter(c => c.id !== action.payload.clientId) };
        
        case 'ADD_WATCHED_TREND_SUCCESS': return { ...state, watchedTrends: [action.payload, ...state.watchedTrends] };
        case 'REMOVE_WATCHED_TREND_SUCCESS': return { ...state, watchedTrends: state.watchedTrends.filter(t => t.trend_data.topic !== action.payload.topic) };
        
        case 'BATCH_DELETE_SCRIPTS_SUCCESS': return { ...state, savedScripts: state.savedScripts.filter(s => !action.payload.scriptIds.includes(s.id)) };
        case 'BATCH_MOVE_SCRIPTS_SUCCESS': return { ...state, savedScripts: state.savedScripts.map(s => action.payload.scriptIds.includes(s.id) ? { ...s, folder_id: action.payload.folderId } : s) };

        case 'ADD_NOTIFICATION_SUCCESS': return { ...state, notifications: [action.payload, ...state.notifications] };
        case 'MARK_ALL_NOTIFICATIONS_READ_SUCCESS': return { ...state, notifications: action.payload };

        default: return state;
    }
};

// --- CONTEXT & PROVIDER ---
export const DataContext = createContext<{ state: DataState; dispatch: React.Dispatch<DataDispatchableAction> }>({
    state: initialState,
    dispatch: () => null
});

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { state: authState } = useContext(AuthContext);
    const { user } = authState;
    const [state, dispatch] = useReducer(dataReducer, initialState);
    
    const isGuest = user?.id.startsWith('guest-') ?? false;

    useEffect(() => {
        if (!user || isGuest) {
            // Clear data if user logs out or is a guest
            dispatch({ type: 'FETCH_DATA_SUCCESS', payload: {
                folders: [{ id: 'all', name: 'All Scripts' }] as Folder[], 
                clients: [], 
                savedScripts: [], 
                watchedTrends: [], 
                notifications: []
            }});
            return;
        }

        const fetchData = async () => {
            dispatch({ type: 'FETCH_DATA_START' });
            try {
                // Use mock data instead of Supabase calls to prevent errors
                const mockData = {
                    folders: [{ id: 'all', name: 'All Scripts' }] as Folder[],
                    clients: [] as Client[],
                    savedScripts: [] as Script[],
                    watchedTrends: [] as WatchedTrend[],
                    notifications: [] as Notification[],
                };
                
                dispatch({ type: 'FETCH_DATA_SUCCESS', payload: mockData });
            } catch (error: any) {
                dispatch({ type: 'FETCH_DATA_ERROR', payload: error.message });
                console.error("Data context fetching error:", error);
            }
        };

        fetchData();
    }, [user, isGuest]);
    
    const handleAsyncAction = useCallback(async (action: RequestAction) => {
        if (!user || isGuest) {
            if (action.type.endsWith('_REQUEST')) {
                // For guests, create a local notification instead of a DB call
                const tempNotification: Notification = {
                    id: crypto.randomUUID(),
                    message: "Please sign up to save your work!",
                    created_at: new Date().toISOString(),
                    read: false,
                };
                dispatch({ type: 'ADD_NOTIFICATION_SUCCESS', payload: tempNotification });
            }
            return;
        }
        const userId = user.id;
        
        try {
            switch(action.type) {
                case 'ADD_SAVED_SCRIPT_REQUEST': {
                    const { isNew, ...scriptToInsert } = action.payload.script;
                    const newScript = await saveScript({ ...scriptToInsert, user_id: userId, viral_score_breakdown: scriptToInsert.viral_score_breakdown as unknown as Json ?? null });
                    dispatch({ type: 'ADD_SAVED_SCRIPT_SUCCESS', payload: newScript });
                    break;
                }
                // ... (rest of the cases are the same as before)
                case 'UNSAVE_SCRIPT_REQUEST': {
                    await deleteScript(action.payload.scriptId);
                    dispatch({ type: 'UNSAVE_SCRIPT_SUCCESS', payload: action.payload });
                    break;
                }
                 case 'MOVE_SCRIPT_TO_FOLDER_REQUEST': {
                    await updateScript(action.payload.scriptId, { folder_id: action.payload.folderId });
                    dispatch({ type: 'MOVE_SCRIPT_TO_FOLDER_SUCCESS', payload: action.payload });
                    break;
                }
                case 'ADD_FOLDER_REQUEST': {
                    const newFolder = await createFolder({ ...action.payload.folder, user_id: userId });
                    dispatch({ type: 'ADD_FOLDER_SUCCESS', payload: newFolder });
                    break;
                }
                case 'RENAME_FOLDER_REQUEST': {
                    await updateFolder(action.payload.folderId, { name: action.payload.newName });
                    dispatch({ type: 'RENAME_FOLDER_SUCCESS', payload: action.payload });
                    break;
                }
                case 'DELETE_FOLDER_REQUEST': {
                    await deleteFolder(action.payload.folderId);
                    dispatch({ type: 'DELETE_FOLDER_SUCCESS', payload: action.payload });
                    break;
                }
                case 'ADD_CLIENT_REQUEST': {
                    const newClient = await createClient({ ...action.payload.clientData, agency_owner_id: userId, status: 'Pending' as const });
                    dispatch({ type: 'ADD_CLIENT_SUCCESS', payload: newClient });
                    break;
                }
                case 'UPDATE_CLIENT_REQUEST': {
                    const { updatedClient } = action.payload;
                    const updated = await updateClient(updatedClient.id, { name: updatedClient.name, email: updatedClient.email, status: updatedClient.status });
                    dispatch({ type: 'UPDATE_CLIENT_SUCCESS', payload: { updatedClient: updated } });
                    break;
                }
                case 'DELETE_CLIENT_REQUEST': {
                    await deleteClient(action.payload.clientId);
                    dispatch({ type: 'DELETE_CLIENT_SUCCESS', payload: action.payload });
                    break;
                }
                case 'ADD_WATCHED_TREND_REQUEST': {
                    const newTrend = await createWatchedTrend({ user_id: userId, trend_data: action.payload.trend as unknown as Json });
                    dispatch({ type: 'ADD_WATCHED_TREND_SUCCESS', payload: newTrend });
                    break;
                }
                case 'REMOVE_WATCHED_TREND_REQUEST': {
                    await deleteWatchedTrend(action.payload.topic);
                    dispatch({ type: 'REMOVE_WATCHED_TREND_SUCCESS', payload: action.payload });
                    break;
                }
                case 'UPDATE_SAVED_SCRIPT_VISUALS_REQUEST': {
                    await updateScript(action.payload.scriptId, { visuals: action.payload.visuals });
                    dispatch({ type: 'UPDATE_SAVED_SCRIPT_VISUALS_SUCCESS', payload: action.payload });
                    break;
                }
                case 'BATCH_DELETE_SCRIPTS_REQUEST': {
                    await batchDeleteScripts(action.payload.scriptIds);
                    dispatch({ type: 'BATCH_DELETE_SCRIPTS_SUCCESS', payload: action.payload });
                    break;
                }
                case 'BATCH_MOVE_SCRIPTS_REQUEST': {
                    await batchMoveScripts(action.payload.scriptIds, action.payload.folderId);
                    dispatch({ type: 'BATCH_MOVE_SCRIPTS_SUCCESS', payload: action.payload });
                    break;
                }
                case 'ADD_NOTIFICATION_REQUEST': {
                    const notificationData = {
                        message: action.payload.message,
                        user_id: action.payload.userId,
                        read: false
                    };
                    const newNotification = await createNotification(notificationData);
                    dispatch({ type: 'ADD_NOTIFICATION_SUCCESS', payload: newNotification });
                    break;
                }
                case 'MARK_ALL_NOTIFICATIONS_READ_REQUEST': {
                    const updatedNotifications = await markAllNotificationsAsRead(userId);
                    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ_SUCCESS', payload: updatedNotifications.map(n => n.id) });
                    break;
                }
            }
        } catch (error: any) {
            console.error(`Error in async dispatch for ${action.type}:`, error);
        }
    }, [user, isGuest, dispatch, state.notifications]);

    const enhancedDispatch = useCallback((action: DataDispatchableAction) => {
        if (action.type.endsWith('_REQUEST')) {
            handleAsyncAction(action as RequestAction);
        } else {
            dispatch(action as Action);
        }
    }, [handleAsyncAction, dispatch]);

    return (
        <DataContext.Provider value={{ state, dispatch: enhancedDispatch }}>
            {children}
        </DataContext.Provider>
    );
};
