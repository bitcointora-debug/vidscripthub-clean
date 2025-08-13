
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './context/AuthContext.tsx';
import type { Plan, Client } from './types.ts';
import { SalesPage } from './components/SalesPage.tsx';
import { Oto1Page } from './components/Oto1Page.tsx';
import { Oto2Page } from './components/Oto2Page.tsx';
import { Oto3Page } from './components/Oto3Page.tsx';
import { AuthPage } from './components/AuthPage.tsx';
import { Dashboard } from './components/Dashboard.tsx';

type FlowState = 'sales' | 'oto1' | 'oto2' | 'oto3' | 'app' | 'auth';
type PostAuthAction = { plan: Plan; next: FlowState };

export const AppRouter: React.FC = () => {
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
    const { user, isLoading: isAuthLoading } = authState;

    const [flowState, setFlowState] = useState<FlowState>('sales');
    const [postAuthAction, setPostAuthAction] = useState<PostAuthAction | null>(null);
    const [impersonatingClient, setImpersonatingClient] = useState<Client | null>(null);

    useEffect(() => {
        if (isAuthLoading) return;

        if (user) {
            // User is logged in
            if (postAuthAction) {
                authDispatch({ type: 'UPGRADE_PLAN_REQUEST', payload: postAuthAction.plan });
                setFlowState(postAuthAction.next);
                setPostAuthAction(null);
            } else if (['sales', 'auth'].includes(flowState)) {
                setFlowState('app');
            }
        } else {
            // User is logged out
            if (!['sales', 'oto1', 'oto2', 'oto3', 'auth'].includes(flowState)) {
                 setFlowState('sales');
            }
            setImpersonatingClient(null);
        }
    }, [user, isAuthLoading, flowState, postAuthAction, authDispatch]);

    const handleLoginAsClient = (client: Client) => {
        setImpersonatingClient(client);
        window.scrollTo(0, 0);
    };

    const handleLogoutClientView = () => {
        setImpersonatingClient(null);
    };
    
    const handleUpgradeAndAuth = (plan: Plan, next: FlowState) => {
        // Since AuthProvider now handles pending plans, we can just trigger auth
        // And the correct plan will be assigned on user creation.
        // We'll set a postAuthAction to navigate correctly after login.
        authDispatch({ type: 'UPGRADE_PLAN_REQUEST', payload: plan });
        setPostAuthAction({ plan, next });
        setFlowState('auth');
    };
    
    const handleGuestDeclineOto3 = () => {
        authDispatch({ type: 'SET_GUEST_USER', payload: 'basic' });
        setFlowState('app');
    };

    if (isAuthLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#1A0F3C]">
                <svg className="animate-spin h-10 w-10 text-[#DAFF00]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }
    
    const dashboardComponent = <Dashboard impersonatingClient={impersonatingClient} onLoginAsClient={handleLoginAsClient} onLogoutClientView={handleLogoutClientView} onNavigate={setFlowState} />;

    if (user) {
        // --- LOGGED-IN & GUEST USER FLOW ---
        // Guests have a temporary user object, so they fall into this block too.
        switch (flowState) {
            case 'oto1':
                return <Oto1Page onUpgrade={() => { authDispatch({ type: 'UPGRADE_PLAN_REQUEST', payload: 'unlimited' }); setFlowState('oto2'); }} onDecline={() => setFlowState('oto2')} />;
            case 'oto2':
                return <Oto2Page onUpgrade={() => { authDispatch({ type: 'UPGRADE_PLAN_REQUEST', payload: 'dfy' }); setFlowState('oto3'); }} onDecline={() => setFlowState('oto3')} />;
            case 'oto3':
                return <Oto3Page onUpgrade={() => { authDispatch({ type: 'UPGRADE_PLAN_REQUEST', payload: 'agency' }); setFlowState('app'); }} onDecline={() => setFlowState('app')} />;
            case 'app':
            default:
                return dashboardComponent;
        }
    } else {
        // --- LOGGED-OUT USER FLOW ---
        switch (flowState) {
            case 'sales':
                return <SalesPage onPurchaseClick={() => setFlowState('oto1')} onDashboardClick={() => setFlowState('auth')} />;
            case 'oto1':
                return <Oto1Page onUpgrade={() => handleUpgradeAndAuth('unlimited', 'oto2')} onDecline={() => setFlowState('oto2')} />;
            case 'oto2':
                return <Oto2Page onUpgrade={() => handleUpgradeAndAuth('dfy', 'oto3')} onDecline={() => setFlowState('oto3')} />;
            case 'oto3':
                return <Oto3Page onUpgrade={() => handleUpgradeAndAuth('agency', 'app')} onDecline={handleGuestDeclineOto3} />;
            case 'auth':
                return <AuthPage />;
            case 'app':
            default:
                // User is not logged in, show auth page
                return <AuthPage />;
        }
    }
};
