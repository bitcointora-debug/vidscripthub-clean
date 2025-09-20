
import React, { useState, useContext, useEffect, Dispatch, SetStateAction } from 'react';
import { Dashboard } from './Dashboard.tsx';
import type { Client, Plan } from '../types.ts';
import { AuthContext } from '../context/AuthContext.tsx';
import { WorldClassSalesPage } from './WorldClassSalesPage.tsx';
import { Oto1Page } from './Oto1Page.tsx';
import { Oto2Page } from './Oto2Page.tsx';
import { Oto3Page } from './Oto3Page.tsx';
import { AuthPage } from './AuthPage.tsx';

type FlowState = 'sales' | 'oto1' | 'oto2' | 'oto3' | 'app' | 'auth';
type PostAuthAction = { planToUpgrade: Plan, nextFlowState: 'oto2' | 'oto3' | 'app' };


export const AppRouter: React.FC = () => {
    const { state, dispatch: authDispatch } = useContext(AuthContext);
    const { user, isLoading } = state;
    
    // Simple function to get current page from URL
    const getCurrentPage = (): FlowState => {
        const hash = window.location.hash;
        const pathname = window.location.pathname;
        
        console.log('🔍 getCurrentPage - Hash:', hash, 'Pathname:', pathname);
        
        // Direct hash check
        if (hash === '#oto1') {
            console.log('✅ Returning oto1 from hash');
            return 'oto1';
        }
        if (hash === '#oto2') {
            console.log('✅ Returning oto2 from hash');
            return 'oto2';
        }
        if (hash === '#oto3') {
            console.log('✅ Returning oto3 from hash');
            return 'oto3';
        }
        if (hash === '#app') return 'app';
        if (hash === '#sales') return 'sales';
        
        // Direct path check
        if (pathname.includes('/oto1')) {
            console.log('✅ Returning oto1 from path');
            return 'oto1';
        }
        if (pathname.includes('/oto2')) {
            console.log('✅ Returning oto2 from path');
            return 'oto2';
        }
        if (pathname.includes('/oto3')) {
            console.log('✅ Returning oto3 from path');
            return 'oto3';
        }
        
        // Default behavior
        console.log('⚠️ Returning default:', user ? 'app' : 'sales');
        return user ? 'app' : 'sales';
    };
    
    const [flowState, setFlowState] = useState<FlowState>(getCurrentPage());
    const [postAuthAction, setPostAuthAction] = useState<PostAuthAction | null>(null);
    const [impersonatingClient, setImpersonatingClient] = useState<Client | null>(null);

    // This effect handles the post-login action for upgrades.
    useEffect(() => {
        if (user && postAuthAction) {
            authDispatch({ type: 'UPGRADE_PLAN_REQUEST', payload: postAuthAction.planToUpgrade });
            setFlowState(postAuthAction.nextFlowState);
            setPostAuthAction(null); // Clear the action
        }
    }, [user, postAuthAction, authDispatch]);

    // Listen for URL changes
    useEffect(() => {
        const handleUrlChange = () => {
            const newPage = getCurrentPage();
            setFlowState(newPage);
        };

        // Check on page load
        handleUrlChange();

        window.addEventListener('hashchange', handleUrlChange);
        window.addEventListener('popstate', handleUrlChange);
        return () => {
            window.removeEventListener('hashchange', handleUrlChange);
            window.removeEventListener('popstate', handleUrlChange);
        };
    }, [user]);

    // Re-evaluate flow state when user state changes
    useEffect(() => {
        const hash = window.location.hash;
        if (hash === '#oto1' || hash === '#oto2' || hash === '#oto3') {
            // Keep OTO pages regardless of user state
            return;
        }
        if (hash === '#app') {
            setFlowState('app');
        } else if (hash === '#sales' || hash === '') {
            setFlowState(user ? 'app' : 'sales');
        }
    }, [user]);

    const handleRequireAuth = (action: PostAuthAction) => {
        setPostAuthAction(action);
        setFlowState('auth');
    };
    
    const handleLoginAsClient = (client: Client) => {
        setImpersonatingClient(client);
        window.scrollTo(0, 0);
    };

    const handleLogoutClientView = () => {
        setImpersonatingClient(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#1A0F3C]">
                <svg className="animate-spin h-10 w-10 text-[#DAFF00]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }
    
    // Simple direct routing based on current state
    console.log('🎯 AppRouter Render - flowState:', flowState, 'user:', !!user);
    
    if (!user) {
        // --- USER IS LOGGED OUT ---
        switch (flowState) {
            case 'oto1':
                console.log('🚀 Redirecting to OTO1 HTML page');
                window.location.href = '/oto1.html';
                return <div>Redirecting to OTO1...</div>;
            case 'oto2':
                console.log('🚀 Redirecting to OTO2 HTML page');
                window.location.href = '/oto2.html';
                return <div>Redirecting to OTO2...</div>;
            case 'oto3':
                console.log('🚀 Redirecting to OTO3 HTML page');
                window.location.href = '/oto3.html';
                return <div>Redirecting to OTO3...</div>;
            case 'sales':
                console.log('🚀 Rendering WorldClassSalesPage');
                return <WorldClassSalesPage onPurchaseClick={() => setFlowState('oto1')} onDashboardClick={() => setFlowState('auth')} />;
            case 'auth':
                console.log('🚀 Rendering AuthPage');
                return <AuthPage />;
            case 'app': // User tried to access dashboard while logged out
            default:
                console.log('🚀 Rendering AuthPage (default)');
                return <AuthPage />;
        }
    } else {
        // --- USER IS LOGGED IN ---
        const dashboard = <Dashboard impersonatingClient={impersonatingClient} onLoginAsClient={handleLoginAsClient} onLogoutClientView={handleLogoutClientView} onNavigate={setFlowState} />;
        
        switch (flowState) {
            case 'sales':
            case 'auth':
                 // Logged in user should not see these pages, redirect to app
                setFlowState('app');
                return dashboard;
            case 'oto1':
                window.location.href = '/oto1.html';
                return <div>Redirecting to OTO1...</div>;
            case 'oto2':
                window.location.href = '/oto2.html';
                return <div>Redirecting to OTO2...</div>;
            case 'oto3':
                window.location.href = '/oto3.html';
                return <div>Redirecting to OTO3...</div>;
            case 'app':
            default:
                return dashboard;
        }
    }
};
