
import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.tsx';
import { DataProvider } from './context/DataContext.tsx';
import { UIProvider } from './context/UIContext.tsx';
import { supabase } from './services/supabaseClient.ts';
import type { Session } from './types.ts';
import { AppRouter } from './AppRouter.tsx';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoadingSession(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoadingSession) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#1A0F3C]">
             <svg className="animate-spin h-10 w-10 text-[#DAFF00]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    );
  }

  return (
    <AuthProvider session={session} guestPlan={null} pendingUpgradePlan={null}>
        <UIProvider>
            <DataProvider>
                <AppRouter />
            </DataProvider>
        </UIProvider>
    </AuthProvider>
  );
};

export default App;
