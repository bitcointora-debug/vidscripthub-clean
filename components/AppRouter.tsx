
import React, { useState, useContext } from 'react';
import { Dashboard } from './Dashboard.tsx';
import type { Client } from '../types.ts';
import { AuthContext } from '../context/AuthContext.tsx';
import { SalesPage } from './SalesPage.tsx';
import { Oto1Page } from './Oto1Page.tsx';
import { Oto2Page } from './Oto2Page.tsx';
import { Oto3Page } from './Oto3Page.tsx';
import { AuthPage } from './AuthPage.tsx';

export const AppRouter: React.FC = () => {
    const { state } = useContext(AuthContext);
    const { user, isLoading } = state;

    // Default to 'app' if user is already logged in, otherwise start at 'sales'
    const [flowState, setFlowState] = useState<'sales' | 'oto1' | 'oto2' | 'oto3' | 'app'>(user ? 'app' : 'sales');
    const [impersonatingClient, setImpersonatingClient] = useState<Client | null>(null);

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
    
    if (user) {
        // User is logged in, show the OTO funnel or the main dashboard
        switch (flowState) {
            case 'oto1': return <Oto1Page onNavigateToNextStep={() => setFlowState('oto2')} />;
            case 'oto2': return <Oto2Page onNavigateToNextStep={() => setFlowState('oto3')} />;
            case 'oto3': return <Oto3Page onNavigateToDashboard={() => setFlowState('app')} />;
            case 'app':
            default:
                return <Dashboard 
                            impersonatingClient={impersonatingClient} 
                            onLoginAsClient={handleLoginAsClient} 
                            onLogoutClientView={handleLogoutClientView} 
                            setAppFlowState={setFlowState}
                        />;
        }
    } else {
        // User is not logged in
        if (flowState !== 'sales') {
            // If trying to access any protected page (OTOs or app), show the login page
            return <AuthPage />;
        } else {
            // Otherwise, show the sales page
            return <SalesPage 
                    onPurchaseClick={() => setFlowState('oto1')} 
                    onDashboardClick={() => setFlowState('app')} 
                   />;
        }
    }
};
