
import React, { useState, useCallback, useEffect, useContext } from 'react';
import Joyride, { Step, CallBackProps } from 'react-joyride';
import { InputForm } from './InputForm';
import { ScriptDisplay } from './ScriptDisplay';
import { getOptimizationTrace, analyzeScriptVirality, enhanceTopic, generateVisualsForScript, remixScript, QUOTA_ERROR_MESSAGE } from '../services/geminiService';
import type { Script, Client, Folder, User, Notification, EnhancedTopic, Trend, OptimizationStep, Plan } from '../types';
import { SavedScriptsView } from './SavedScriptsView';
import { TrendingTopicsView } from './TrendingTopicsView';
import { DFYContentView } from './DFYContentView.tsx';
import { AgencyView } from './AgencyView';
import { AddClientModal } from './AddClientModal';
import { DashboardHomeView } from './DashboardHomeView';
import { AccountSettingsView } from './AccountSettingsView';
import { NotificationsPanel } from './NotificationsPanel';
import { PlaceholderView } from './PlaceholderView';
import { SaveScriptModal } from './SaveScriptModal';
import { EditClientModal } from './EditClientModal';
import { ConfirmationModal } from './ConfirmationModal';
import { VideoDeconstructorView } from './VideoDeconstructorView';
import { PersonalizationModal } from './PersonalizationModal';
import { AuthContext } from '../context/AuthContext.tsx';
import { DataContext } from '../context/DataContext.tsx';
import { UIContext } from '../context/UIContext.tsx';
import { QuotaErrorModal } from './QuotaErrorModal';
import { supabase } from '../services/supabaseClient.ts';
import { AIOptimizerView } from './AIOptimizerView.tsx';
import { UpgradeModal } from './UpgradeModal.tsx';
import { CrownIcon } from './icons/CrownIcon.tsx';

interface DashboardProps {
    impersonatingClient: Client | null;
    onLoginAsClient: (client: Client) => void;
    onLogoutClientView: () => void;
    setAppFlowState: (state: 'sales' | 'oto1' | 'oto2' | 'oto3' | 'app') => void;
}

interface MenuItem {
    name: string;
    icon: string;
    requiredPlan?: Plan;
    hasNew?: boolean;
}

const kebabCase = (str: string) => str.toLowerCase().replace(/\s+/g, '-');

const tourSteps: Step[] = [
  {
    target: '#new-project-btn',
    content: "Welcome to Vid Script Hub! Click here to start a new project and generate your first AI-optimized script.",
    placement: 'bottom',
  },
  {
    target: `#${kebabCase('Trending Topics')}-nav`,
    content: "Don't know what to post? Visit the Trending Topics Hub to see what's currently going viral in any niche.",
    placement: 'right',
  },
  {
    target: `#${kebabCase('DFY Content Vault')}-nav`,
    content: "Need content FAST? Our DFY Vault is packed with ready-to-use scripts, hooks, and more.",
    placement: 'right',
  },
  {
    target: `#${kebabCase('Video Deconstructor')}-nav`,
    content: "Found a viral video you love? Paste its YouTube URL here to 'steal' its secret formula.",
    placement: 'right',
  },
  {
    target: `#${kebabCase('Saved Scripts')}-nav`,
    content: "All your saved creations are kept here. You can organize them into folders for easy access.",
    placement: 'right',
  },
  {
    target: `#${kebabCase('Account Settings')}-nav`,
    content: "Finally, you can manage your account details and preferences here.",
    placement: 'right',
  },
];

const joyrideStyles = {
    options: {
        arrowColor: '#2A1A5E',
        backgroundColor: '#2A1A5E',
        primaryColor: '#DAFF00',
        textColor: '#F0F0F0',
        zIndex: 10000,
    },
    tooltip: {
        border: '1px solid #4A3F7A',
        borderRadius: '8px'
    },
    buttonClose: { color: '#F0F0F0' },
    buttonNext: {
      backgroundColor: '#DAFF00',
      color: '#1A0F3C',
      fontWeight: 'bold',
      borderRadius: '6px'
    },
    buttonBack: { color: '#DAFF00' },
    buttonSkip: { color: '#a78bfa' }
};

export const Dashboard: React.FC<DashboardProps> = ({ impersonatingClient, onLoginAsClient, onLogoutClientView, setAppFlowState }) => {
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const { user, isLoading: isAuthLoading, error: authError } = authState;
  const { state: dataState, dispatch: dataDispatch } = useContext(DataContext);
  const { savedScripts, folders, clients, watchedTrends, notifications } = dataState;
  const { state: uiState, dispatch: uiDispatch } = useContext(UIContext);
  const { movingScriptId, isNewDfyAvailable, runTour } = uiState;

  const [generatedScript, setGeneratedScript] = useState<Script | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState('Dashboard');
  const [initialTopic, setInitialTopic] = useState<string | undefined>(undefined);
  const [scoringScriptId, setScoringScriptId] = useState<string | null>(null);
  const [visualizingScriptId, setVisualizingScriptId] = useState<string | null>(null);
  const [speakingScriptId, setSpeakingScriptId] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [enhancedTopics, setEnhancedTopics] = useState<EnhancedTopic[]>([]);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isRemixing, setIsRemixing] = useState(false);

  const [optimizationTrace, setOptimizationTrace] = useState<OptimizationStep[] | null>(null);
  
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [scriptToSave, setScriptToSave] = useState<Script | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationProps, setConfirmationProps] = useState({ onConfirm: () => {}, title: '', message: '' });
  const [isPersonalizationModalOpen, setIsPersonalizationModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeModalProps, setUpgradeModalProps] = useState<{ requiredPlan: Plan; featureName: string }>({ requiredPlan: 'unlimited', featureName: '' });

  
  const activeUser = impersonatingClient || user;

  useEffect(() => {
    if (user && !user.isPersonalized && !impersonatingClient) {
        setIsPersonalizationModalOpen(true);
    }
  }, [user, impersonatingClient]);
    
  const addNotification = useCallback((message: string) => {
    if (user) {
        dataDispatch({ type: 'ADD_NOTIFICATION_REQUEST', payload: { message, userId: user.id } });
    }
  }, [dataDispatch, user]);

  const handleCompletePersonalization = (data: { niche: string; platforms: ('tiktok' | 'instagram' | 'youtube')[]; tone: string }) => {
    authDispatch({ type: 'COMPLETE_PERSONALIZATION_REQUEST', payload: data });
    setIsPersonalizationModalOpen(false);
    addNotification("Your dashboard is now personalized! Welcome to Vid Script Hub.");
    const tourCompleted = localStorage.getItem('vsh_tour_completed');
    if (!tourCompleted) {
        setTimeout(() => uiDispatch({ type: 'START_TOUR' }), 500);
    }
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (['finished', 'skipped'].includes(status)) {
        uiDispatch({ type: 'STOP_TOUR' });
        localStorage.setItem('vsh_tour_completed', 'true');
    }
  };

  const handleStartOptimization = useCallback(async (task: any) => {
    setIsLoading(true); setError(null); setEnhancedTopics([]); setGeneratedScript(null); setOptimizationTrace(null);
    addNotification(`AI is starting the optimization process...`);
    try {
      const { steps } = await getOptimizationTrace(task);
      setOptimizationTrace(steps);
      addNotification(`Optimization trace received. Visualizing process...`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      if (errorMessage === QUOTA_ERROR_MESSAGE) {
        uiDispatch({ type: 'SET_QUOTA_ERROR', payload: errorMessage });
      } else {
        setError(errorMessage); 
        addNotification(`Error generating script: ${errorMessage}`); 
      }
      setIsLoading(false);
    }
  }, [addNotification, uiDispatch]);

  const handleOptimizationComplete = (finalScript: Script) => {
    setGeneratedScript(finalScript);
    setIsLoading(false);
    setOptimizationTrace(null);
    addNotification(`Script "${finalScript.title.substring(0, 20)}..." has been optimized!`);
  };
  
  const handleEnhanceTopic = useCallback(async (topic: string) => {
    if (!topic.trim()) return; setIsEnhancing(true); setEnhancedTopics([]);
    addNotification(`Supercharging topic: "${topic}"...`);
    try {
        const suggestions = await enhanceTopic(topic);
        setEnhancedTopics(suggestions); addNotification(`Generated new angles for "${topic}"!`);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "AI failed to enhance topic.";
         if (errorMessage === QUOTA_ERROR_MESSAGE) {
            uiDispatch({ type: 'SET_QUOTA_ERROR', payload: errorMessage });
        } else {
            addNotification(`Error: ${errorMessage}`);
        }
    } finally { setIsEnhancing(false); }
  }, [addNotification, uiDispatch]);

  const handleOpenSaveModal = (script: Script) => { setScriptToSave(script); setIsSaveModalOpen(true); }
  
  const handleUnsaveScript = (scriptId: string) => {
       dataDispatch({ type: 'UNSAVE_SCRIPT_REQUEST', payload: { scriptId } });
       addNotification("Script unsaved.");
       if (generatedScript?.id === scriptId) {
          const {id, ...rest} = generatedScript; // Create a new object to break reference
          setGeneratedScript(rest as Script);
       }
  };

  const handleConfirmSave = useCallback(async (scriptToSave: Script, folderId: string | null) => {
    setIsSaveModalOpen(false); 
    setScriptToSave(null); 
    setScoringScriptId(scriptToSave.id);
    addNotification(`Saving "${scriptToSave.title.substring(0,20)}..."`);
    
    // If script already has analysis, just save it. Otherwise, analyze first.
    if(scriptToSave.viral_score_breakdown) {
       const scriptWithData: Script = { ...scriptToSave, folder_id: folderId, created_at: new Date().toISOString() };
       dataDispatch({ type: 'ADD_SAVED_SCRIPT_REQUEST', payload: { script: scriptWithData } });
       addNotification(`Script saved successfully!`);
       setScoringScriptId(null);
       return;
    }

    try {
        const analysis = await analyzeScriptVirality(scriptToSave);
        const scriptWithData: Script = { ...scriptToSave, folder_id: folderId, created_at: new Date().toISOString(), viral_score_breakdown: analysis };
        dataDispatch({ type: 'ADD_SAVED_SCRIPT_REQUEST', payload: { script: scriptWithData } });
        addNotification(`Script saved successfully with virality analysis!`);
    } catch(err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
        if (errorMessage === QUOTA_ERROR_MESSAGE) { uiDispatch({ type: 'SET_QUOTA_ERROR', payload: errorMessage }); } 
        else { addNotification(`Error: Could not analyze and save script. ${errorMessage}`); }
    } finally { 
        setScoringScriptId(null); 
    }
  }, [addNotification, dataDispatch, uiDispatch]);
  
  const handleVisualizeScript = useCallback(async (scriptId: string, artStyle: string) => {
      const scriptToVisualize = generatedScript?.id === scriptId ? generatedScript : savedScripts.find(s => s.id === scriptId);
      if (!scriptToVisualize) return;
      setVisualizingScriptId(scriptId);
      addNotification(`Generating visuals for "${scriptToVisualize.title.substring(0, 20)}..." in a ${artStyle} style.`);
      try {
          const visuals = await generateVisualsForScript(scriptToVisualize, artStyle);
          if (generatedScript?.id === scriptId) setGeneratedScript(prev => prev ? {...prev, visuals} : null);
          dataDispatch({ type: 'UPDATE_SAVED_SCRIPT_VISUALS_REQUEST', payload: { scriptId, visuals } });
          addNotification("Visuals generated successfully!");
      } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
           if (errorMessage === QUOTA_ERROR_MESSAGE) { uiDispatch({ type: 'SET_QUOTA_ERROR', payload: errorMessage }); } 
           else { addNotification(`Error generating visuals: ${errorMessage}`); }
      } finally {
          setVisualizingScriptId(null);
      }
  }, [generatedScript, savedScripts, addNotification, dataDispatch, uiDispatch]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const updateVoices = () => setVoices(synth.getVoices());
    synth.onvoiceschanged = updateVoices;
    updateVoices();
    return () => { synth.onvoiceschanged = null; synth.cancel(); };
  }, []);
  
  const handleToggleSpeech = useCallback((script: Script) => {
    const synth = window.speechSynthesis;
    if (!synth) { addNotification("Sorry, your browser does not support voice synthesis."); return; }
    if (speakingScriptId === script.id) { synth.cancel(); setSpeakingScriptId(null); return; }
    if (synth.speaking) synth.cancel();
    if (voices.length === 0) { addNotification("Voice engine is still loading. Please try again in a moment."); setVoices(synth.getVoices()); return; }
    const textToSpeak = `Hook: ${script.hook}. Script: ${script.script}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const preferredVoice = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) || voices.find(v => v.lang.startsWith('en-US')) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.onend = () => setSpeakingScriptId(null);
    utterance.onerror = (event) => { console.error("SpeechSynthesisUtterance.onerror", event); setSpeakingScriptId(null); addNotification(`Voiceover failed: ${event.error}. Some voices may not be available.`); };
    setSpeakingScriptId(script.id);
    synth.speak(utterance);
  }, [speakingScriptId, addNotification, voices]);

  const handleRemixScript = useCallback(async (baseScript: Script, newTopic: string) => {
        setIsRemixing(true);
        addNotification(`AI is remixing "${baseScript.title.substring(0, 20)}..." for your topic!`);
        try {
            const newScript = await remixScript(baseScript, newTopic);
            setGeneratedScript(newScript);
            setActiveView('Script Generator');
            addNotification("Your personalized script has been generated!");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
             if (errorMessage === QUOTA_ERROR_MESSAGE) { uiDispatch({ type: 'SET_QUOTA_ERROR', payload: errorMessage }); } 
             else { addNotification(`Error remixing script: ${errorMessage}`); }
        } finally {
            setIsRemixing(false);
        }
    }, [addNotification, uiDispatch]);
    
  const handleOpenUpgradeModal = (requiredPlan: Plan, featureName: string) => {
    setUpgradeModalProps({ requiredPlan, featureName });
    setIsUpgradeModalOpen(true);
  };

  const handleUpgrade = () => {
    if (!user) return;
    const planHierarchy = { basic: 0, unlimited: 1, dfy: 2, agency: 3 };
    const userPlanLevel = planHierarchy[user.plan];

    if (userPlanLevel < 1) setAppFlowState('oto1');
    else if (userPlanLevel < 2) setAppFlowState('oto2');
    else if (userPlanLevel < 3) setAppFlowState('oto3');
    
    setIsUpgradeModalOpen(false);
  };


  //... other handlers
  const handleMoveScriptToFolder = (scriptId: string, folderId: string | null) => { uiDispatch({ type: 'SET_MOVING_SCRIPT_ID', payload: scriptId }); dataDispatch({ type: 'MOVE_SCRIPT_TO_FOLDER_REQUEST', payload: { scriptId, folderId } }); addNotification("Script moved successfully."); };
  const handleAddNewFolder = (folderName: string): string => { const newFolderId = crypto.randomUUID(); dataDispatch({ type: 'ADD_FOLDER_REQUEST', payload: { folder: { id: newFolderId, name: folderName.trim() } } }); addNotification(`Folder "${folderName.trim()}" created.`); return newFolderId; };
  const handleRenameFolder = (folderId: string, newName: string) => { dataDispatch({ type: 'RENAME_FOLDER_REQUEST', payload: { folderId, newName } }); addNotification(`Folder renamed to "${newName}".`); };
  const handleDeleteFolder = (folderId: string) => { const folderName = folders.find(f => f.id === folderId)?.name || 'folder'; setConfirmationProps({ title: "Delete Folder?", message: "Are you sure you want to delete this folder? Any scripts inside will be moved to your main library.", onConfirm: () => { dataDispatch({ type: 'DELETE_FOLDER_REQUEST', payload: { folderId } }); addNotification(`Folder "${folderName}" deleted.`); setIsConfirmationModalOpen(false); } }); setIsConfirmationModalOpen(true); };
  const handleDeleteScript = (scriptId: string) => { setConfirmationProps({ title: "Delete Script?", message: "Are you sure you want to permanently delete this script?", onConfirm: () => { handleUnsaveScript(scriptId); addNotification("Script permanently deleted."); setIsConfirmationModalOpen(false); } }); setIsConfirmationModalOpen(true); };
  const handleAddNewClient = (clientData: Omit<Client, 'id' | 'status'>) => { dataDispatch({ type: 'ADD_CLIENT_REQUEST', payload: { clientData } }); setIsAddClientModalOpen(false); addNotification(`Client "${clientData.name}" added.`); };
  const handleUpdateClient = (updatedClient: Client) => { dataDispatch({ type: 'UPDATE_CLIENT_REQUEST', payload: { updatedClient } }); setIsEditClientModalOpen(false); addNotification(`Client "${updatedClient.name}" updated.`); }
  const handleRemoveClient = (clientId: string) => { const clientName = clients.find(c => c.id === clientId)?.name || 'client'; setConfirmationProps({ title: "Delete Client?", message: `Are you sure you want to delete ${clientName}? This action is irreversible.`, onConfirm: () => { dataDispatch({ type: 'DELETE_CLIENT_REQUEST', payload: { clientId } }); addNotification(`Client "${clientName}" deleted.`); setIsConfirmationModalOpen(false); } }); setIsConfirmationModalOpen(true); };
  const handleWatchTrend = (trend: Trend) => { dataDispatch({ type: 'ADD_WATCHED_TREND_REQUEST', payload: { trend } }); addNotification(`Trend "${trend.topic}" added to your watchlist.`); }
  const handleUnwatchTrend = (topic: string) => { dataDispatch({ type: 'REMOVE_WATCHED_TREND_REQUEST', payload: { topic } }); addNotification(`Trend "${topic}" removed from your watchlist.`); }
  const getScriptOfTheDay = useCallback(() => { const mockDfyScriptsForDay: Script[] = [{ id: 'dfy-1', title: "3 'Healthy' Foods That Are Actually Scams", hook: "You won't believe what's hiding in your 'healthy' snacks...", script: "VOICEOVER: You think you're eating healthy? Think again.", tone: 'Shocking', niche: 'Weight Loss' }]; if (!user?.primary_niche) return mockDfyScriptsForDay[0]; const nicheScripts = mockDfyScriptsForDay.filter(s => s.niche === user.primary_niche); const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24); if(nicheScripts.length > 0) return nicheScripts[dayOfYear % nicheScripts.length]; return mockDfyScriptsForDay[dayOfYear % mockDfyScriptsForDay.length]; }, [user?.primary_niche]);
  const openEditClientModal = (client: Client) => { setClientToEdit(client); setIsEditClientModalOpen(true); };
  const handleGenerateForTrend = (topic: string) => { handleNavigate('Script Generator', topic); };
  const handleNewProject = () => { setGeneratedScript(null); setInitialTopic(undefined); setError(null); setEnhancedTopics([]); setActiveView('Script Generator'); }
  const handleMarkAllAsRead = () => { if (user) dataDispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ_REQUEST', payload: { userId: user.id } }); };

  const baseMenuSections: { title: string; items: MenuItem[] }[] = [ { title: 'Menu', items: [ { name: 'Dashboard', icon: 'fa-solid fa-house' }, { name: 'Script Generator', icon: 'fa-solid fa-wand-magic-sparkles' }, { name: 'Video Deconstructor', icon: 'fa-solid fa-person-burst', requiredPlan: 'unlimited' }, { name: 'Saved Scripts', icon: 'fa-solid fa-bookmark' }, { name: 'Trending Topics', icon: 'fa-solid fa-fire', requiredPlan: 'unlimited' }, { name: 'DFY Content Vault', icon: 'fa-solid fa-gem', requiredPlan: 'dfy', hasNew: isNewDfyAvailable }, ], }, { title: 'Account', items: [{ name: 'Account Settings', icon: 'fa-solid fa-gear' }], }, ];
  const agencyMenuSection: { title: string; items: MenuItem[] } = { title: 'AGENCY ZONE', items: [ { name: 'Manage Clients', icon: 'fa-solid fa-briefcase', requiredPlan: 'agency' }, ], };
  const menuSections = impersonatingClient ? baseMenuSections : [baseMenuSections[0], agencyMenuSection, baseMenuSections[1]];
  
  const handleNavigate = (view: string, topic?: string) => {
    if (topic) setInitialTopic(topic);
    if(view !== 'Script Generator' && topic === undefined) setInitialTopic(undefined);
    
    const menuItem = menuSections.flatMap(s => s.items).find(i => i.name === view);
    const requiredPlan = menuItem?.requiredPlan;

    if (user && requiredPlan) {
        const planHierarchy = { basic: 0, unlimited: 1, dfy: 2, agency: 3 };
        const userPlanLevel = planHierarchy[user.plan];
        const requiredPlanLevel = planHierarchy[requiredPlan];

        if (userPlanLevel < requiredPlanLevel) {
            handleOpenUpgradeModal(requiredPlan, view);
            return;
        }
    }
    
    setEnhancedTopics([]);
    setActiveView(view);
    if (view === 'DFY Content Vault') uiDispatch({ type: 'SET_NEW_DFY_UNAVAILABLE' });
    document.getElementById('main-content-area')?.scrollTo(0, 0);
  };

  const isScriptSaved = (script: Script) => savedScripts.some(s => s.id === script.id);
  const isTrendWatched = (topic: string) => watchedTrends.some(t => t.trend_data.topic === topic);
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  
  const renderContent = () => {
    if (activeView === 'Script Generator') {
      return (
        (isLoading || optimizationTrace) ? <AIOptimizerView trace={optimizationTrace} onComplete={handleOptimizationComplete} />
        : <>
          <InputForm onStartOptimization={handleStartOptimization} isLoading={isLoading} initialTopic={initialTopic} setInitialTopic={setInitialTopic} onEnhanceTopic={handleEnhanceTopic} isEnhancing={isEnhancing} enhancedTopics={enhancedTopics} onSelectEnhancedTopic={(topic) => setInitialTopic(topic)} onOpenUpgradeModal={handleOpenUpgradeModal} />
          <ScriptDisplay script={generatedScript} isLoading={isLoading} error={error} onOpenSaveModal={handleOpenSaveModal} onUnsaveScript={handleUnsaveScript} isScriptSaved={isScriptSaved} scoringScriptId={scoringScriptId} onVisualize={handleVisualizeScript} isVisualizing={visualizingScriptId !== null} visualizingScriptId={visualizingScriptId} onToggleSpeech={handleToggleSpeech} speakingScriptId={speakingScriptId} />
        </>
      );
    }
    
    switch (activeView) {
      case 'Dashboard': return <DashboardHomeView onNavigate={handleNavigate} recentScripts={savedScripts.slice(0, 2)} onOpenSaveModal={handleOpenSaveModal} onUnsaveScript={handleUnsaveScript} isScriptSaved={isScriptSaved} scoringScriptId={scoringScriptId} onGenerateForTrend={handleGenerateForTrend} agencyClientCount={clients.length} watchedTrends={watchedTrends.map(wt => wt.trend_data)} onWatchTrend={handleWatchTrend} onUnwatchTrend={handleUnwatchTrend} isTrendWatched={isTrendWatched} onVisualize={handleVisualizeScript} visualizingScriptId={visualizingScriptId} scriptOfTheDay={getScriptOfTheDay()} onToggleSpeech={handleToggleSpeech} speakingScriptId={speakingScriptId} />;
      case 'Video Deconstructor': return <VideoDeconstructorView onOpenSaveModal={handleOpenSaveModal} onUnsaveScript={handleUnsaveScript} isScriptSaved={isScriptSaved} scoringScriptId={scoringScriptId} onVisualize={handleVisualizeScript} visualizingScriptId={visualizingScriptId} onToggleSpeech={handleToggleSpeech} speakingScriptId={speakingScriptId} />;
      case 'Saved Scripts': return <SavedScriptsView onAddNewFolder={handleAddNewFolder} onOpenSaveModal={handleOpenSaveModal} onUnsaveScript={handleUnsaveScript} onDeleteScript={handleDeleteScript} isScriptSaved={isScriptSaved} scoringScriptId={scoringScriptId} onMoveScriptToFolder={handleMoveScriptToFolder} onRenameFolder={handleRenameFolder} onDeleteFolder={handleDeleteFolder} onVisualize={handleVisualizeScript} visualizingScriptId={visualizingScriptId} onToggleSpeech={handleToggleSpeech} speakingScriptId={speakingScriptId} />;
      case 'Trending Topics': return <TrendingTopicsView onGenerateForTrend={handleGenerateForTrend} onWatchTrend={handleWatchTrend} onUnwatchTrend={handleUnwatchTrend} isTrendWatched={isTrendWatched} />;
      case 'DFY Content Vault': return <DFYContentView onOpenSaveModal={handleOpenSaveModal} onUnsaveScript={handleUnsaveScript} isScriptSaved={isScriptSaved} scoringScriptId={scoringScriptId} onVisualize={handleVisualizeScript} visualizingScriptId={visualizingScriptId} onToggleSpeech={handleToggleSpeech} speakingScriptId={speakingScriptId} onRemixScript={handleRemixScript} isRemixing={isRemixing} />;
      case 'Manage Clients': return <AgencyView onRemoveClient={handleRemoveClient} onOpenAddClientModal={() => setIsAddClientModalOpen(true)} onLoginAsClient={onLoginAsClient} onOpenEditClientModal={openEditClientModal} />;
      case 'Account Settings': { if (!user) return null; return <AccountSettingsView onUpgrade={handleUpgrade} />; }
      default: return <PlaceholderView title="Coming Soon" message="This feature is under construction." />;
    }
  };
  
  if (isAuthLoading || !user) {
    return ( <div className="flex items-center justify-center min-h-screen bg-[#1A0F3C]"> <svg className="animate-spin h-10 w-10 text-[#DAFF00]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> </div> );
  }

  if (authError) {
    return ( <div className="flex flex-col items-center justify-center min-h-screen bg-[#1A0F3C] text-center p-4"> <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-6"></i> <h1 className="text-3xl font-bold text-white mb-2">An Error Occurred</h1> <p className="text-red-300 bg-red-900/50 p-4 rounded-lg max-w-xl mb-6">{authError}</p> <p className="text-purple-300 mb-6">This can sometimes happen during initial setup. Please try logging out and signing back in.</p> <button onClick={() => supabase.auth.signOut()} className="px-8 py-3 text-lg font-bold bg-[#DAFF00] text-[#1A0F3C] rounded-md hover:bg-opacity-90 transition-all duration-200"> Sign Out </button> </div> );
  }
  
  const activeUserForHeader: User | Client = impersonatingClient || user;
  const avatarUrl = 'avatar_url' in activeUserForHeader ? activeUserForHeader.avatar_url : activeUserForHeader.avatar;
  const fallbackAvatar = activeUserForHeader.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();
  const currentName = activeUserForHeader.name;
  const planHierarchy = { basic: 0, unlimited: 1, dfy: 2, agency: 3 };
  const userPlanLevel = planHierarchy[user.plan];

  return (
    <div className="min-h-screen bg-[#1A0F3C] text-[#F0F0F0] flex flex-col">
      <Joyride steps={tourSteps} run={runTour} continuous showProgress showSkipButton callback={handleJoyrideCallback} styles={joyrideStyles}/>
      <QuotaErrorModal />
      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} onUpgrade={handleUpgrade} {...upgradeModalProps} />
      <PersonalizationModal isOpen={isPersonalizationModalOpen} onComplete={handleCompletePersonalization} />
      <AddClientModal isOpen={isAddClientModalOpen} onClose={() => setIsAddClientModalOpen(false)} onAddClient={handleAddNewClient} />
      <EditClientModal isOpen={isEditClientModalOpen} onClose={() => setIsEditClientModalOpen(false)} onUpdateClient={handleUpdateClient} client={clientToEdit} />
      <SaveScriptModal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} scriptToSave={scriptToSave} onConfirmSave={handleConfirmSave} onAddNewFolder={handleAddNewFolder} />
      <ConfirmationModal isOpen={isConfirmationModalOpen} onClose={() => setIsConfirmationModalOpen(false)} {...confirmationProps} />

      {impersonatingClient && (<div className="bg-yellow-500 text-black text-center py-2 px-4 font-semibold flex items-center justify-center gap-4"><i className="fa-solid fa-user-secret"></i><span>You are viewing the dashboard as <strong>{impersonatingClient.name}</strong>.</span><button onClick={onLogoutClientView} className="underline hover:text-black/70">Return to Your Dashboard</button></div>)}
      
      <header className="flex-shrink-0 bg-[#1A0F3C] border-b border-[#2A1A5E] px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <img src="images/dashboard-logo.png" alt="Vid Script Hub Logo" className="h-8 w-auto" />
        <div className="flex items-center space-x-4">
          <div className="relative">
             <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="text-purple-300 hover:text-white transition-colors duration-200 relative"><i className="fa-solid fa-bell text-xl"></i>{unreadNotificationsCount > 0 && (<span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>)}</button>
            <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} onMarkAllAsRead={handleMarkAllAsRead} />
          </div>
          <div className="w-9 h-9 bg-[#DAFF00] rounded-full flex items-center justify-center font-bold text-[#1A0F3C] text-sm cursor-pointer group relative">
            {avatarUrl ? <img src={avatarUrl} alt={currentName} className="w-full h-full rounded-full object-cover" /> : fallbackAvatar}
            <div className="absolute top-full mt-2 right-0 bg-black/80 text-white text-xs rounded py-1 px-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none whitespace-nowrap">{currentName}</div>
          </div>
        </div>
      </header>

      <div className="flex-grow flex overflow-hidden">
        <aside className="hidden md:flex md:flex-shrink-0">
            <div className="flex flex-col w-64">
                <div className="flex flex-col h-full bg-[#1A0F3C] border-r border-[#4A3F7A]/30 pt-5 px-4">
                    <div className="flex-grow flex flex-col">
                        <div className="mb-4">
                            <button id="new-project-btn" onClick={handleNewProject} className="w-full flex items-center justify-center bg-[#DAFF00] text-[#1A0F3C] font-bold py-2.5 px-4 rounded-md hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#DAFF00]/50"><i className="fa-solid fa-plus mr-2"></i>New Project</button>
                        </div>
                        <nav className="flex-1 pb-4 space-y-4 overflow-y-auto">
                           {menuSections.map((section) => (
                             <div key={section.title}>
                               <h3 className="px-1 text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">{section.title}</h3>
                                {section.items.map((item) => {
                                const isActive = activeView === item.name;
                                const isLocked = item.requiredPlan && userPlanLevel < planHierarchy[item.requiredPlan];

                                let classes = isActive ? 'bg-[#DAFF00] text-[#1A0F3C]' : 'text-purple-200 hover:text-white hover:bg-[#2A1A5E]';
                                if (isLocked) classes = 'text-purple-300/60 hover:text-purple-300/60 hover:bg-[#2A1A5E]/50 cursor-pointer';

                                return (<a id={`${kebabCase(item.name)}-nav`} key={item.name} href="#" onClick={(e) => {e.preventDefault(); handleNavigate(item.name);}} className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 ${classes}`}><i className={`${item.icon} w-5 mr-3 transition-colors duration-200 ${isActive ? 'text-[#1A0F3C]/70' : 'text-purple-300/70 group-hover:text-white/80'}`}></i><span className="truncate">{item.name}</span>{item.hasNew && <span className="ml-auto text-xs bg-red-500 text-white font-bold px-1.5 py-0.5 rounded-full animate-pulse">New!</span>}{isLocked && <CrownIcon className="ml-auto w-4 h-4 text-yellow-500" />}</a>)
                              })}
                             </div>
                           ))}
                        </nav>
                    </div>
                </div>
            </div>
        </aside>

        <main id="main-content-area" className="flex-1 p-4 md:p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                {renderContent()}
            </div>
        </main>
      </div>
    </div>
  );
};
