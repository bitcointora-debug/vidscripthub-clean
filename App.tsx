
import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard.tsx';
import type { Client, Session } from './types.ts';
import { AuthProvider } from './context/AuthContext.tsx';
import { DataProvider } from './context/DataContext.tsx';
import { UIProvider } from './context/UIContext.tsx';
import { supabase } from './services/supabaseClient.ts';
import { AuthPage } from './components/AuthPage.tsx';
import { SalesPage } from './components/SalesPage.tsx';
import { Oto1Page } from './components/Oto1Page.tsx';
import { Oto2Page } from './components/Oto2Page.tsx';
import { Oto3Page } from './components/Oto3Page.tsx';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [impersonatingClient, setImpersonatingClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [flowState, setFlowState] = useState<'sales' | 'oto1' | 'oto2' | 'oto3' | 'app'>('sales');
  const [cameFromApp, setCameFromApp] = useState(false);

  useEffect(() => {
    const getSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setIsLoading(false);
    }
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginAsClient = (client: Client) => {
    setImpersonatingClient(client);
    window.scrollTo(0, 0);
  };

  const handleLogoutClientView = () => {
    setImpersonatingClient(null);
  };
  
  const handleInitiateUpgrade = (targetFlow: 'oto1' | 'oto2' | 'oto3') => {
    setCameFromApp(true);
    setFlowState(targetFlow);
  };

  if (flowState === 'sales') {
    return <SalesPage onPurchaseClick={() => setFlowState('oto1')} onDashboardClick={() => setFlowState('app')} />;
  }
  if (flowState === 'oto1') {
      const nextStep = cameFromApp ? 'app' : 'oto2';
      return <Oto1Page onNavigateToNextStep={() => { setFlowState(nextStep); if(cameFromApp) setCameFromApp(false); }} />;
  }
  if (flowState === 'oto2') {
      const nextStep = cameFromApp ? 'app' : 'oto3';
      return <Oto2Page onNavigateToNextStep={() => { setFlowState(nextStep); if(cameFromApp) setCameFromApp(false); }} />;
  }
  if (flowState === 'oto3') {
      return <Oto3Page onNavigateToDashboard={() => { setFlowState('app'); if(cameFromApp) setCameFromApp(false); }} />;
  }

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

  if (!session) {
    return <AuthPage />;
  }
  
  return (
    <AuthProvider session={session}>
        <UIProvider>
            <DataProvider>
                <Dashboard 
                    impersonatingClient={impersonatingClient} 
                    onLoginAsClient={handleLoginAsClient} 
                    onLogoutClientView={handleLogoutClientView}
                    onInitiateUpgrade={handleInitiateUpgrade}
                />
            </DataProvider>
        </UIProvider>
    </AuthProvider>
  );
};

export default App;
