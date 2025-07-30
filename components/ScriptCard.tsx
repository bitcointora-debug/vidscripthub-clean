import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { Script, Folder } from '../types.ts';

interface ScriptCardProps {
  script: Script;
  onOpenSaveModal: (script: Script) => void;
  onUnsave: (scriptId: string) => void;
  onDelete?: (scriptId: string) => void;
  isSaved: boolean;
  isScoring?: boolean;
  isMoving?: boolean;
  isSavedView?: boolean;
  folders?: Folder[];
  onMoveScriptToFolder?: (scriptId: string, folderId: string | null) => void;
  addNotification?: (message: string) => void;
  onVisualize?: (scriptId: string, artStyle: string) => void;
  isVisualizing?: boolean;
  onRemix?: (script: Script) => void;
  onToggleSpeech?: (script: Script) => void;
  isSpeaking?: boolean;
}

const toneEmojis: { [key: string]: string } = {
  'Funny': '😂', 'Inspirational': '✨', 'Educational': '🎓', 'Shocking': '🤯', 'Heartwarming': '💖', 'Action-Packed': '💥',
  'Controversial': '🗣️', 'Luxury & Aspirational': '💎', 'Data-Driven': '📊', 'Viral Formula': '🧪', 'Remixed': '🎛️'
};

const artStyles = ['Cinematic', 'Anime', 'Photorealistic', 'Cartoon'];

const AnalysisDetail: React.FC<{ label: string, content?: string }> = ({ label, content }) => (
    <div>
        <h5 className="text-xs font-semibold text-purple-300 uppercase tracking-wider">{label}</h5>
        <p className="text-sm text-white/90">{content || 'N/A'}</p>
    </div>
);


export const ScriptCard: React.FC<ScriptCardProps> = ({ 
  script, onOpenSaveModal, onUnsave, onDelete, isSaved, isScoring = false, isMoving = false, isSavedView = false, 
  folders = [], onMoveScriptToFolder, addNotification, onVisualize, isVisualizing = false,
  onRemix, onToggleSpeech, isSpeaking = false
}) => {
  const [copied, setCopied] = useState(false);
  const [folderDropdownOpen, setFolderDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [visualsExpanded, setVisualsExpanded] = useState(false);
  const [analysisExpanded, setAnalysisExpanded] = useState(false);
  const [showArtStylePicker, setShowArtStylePicker] = useState(false);

  const fullScriptText = `Title: ${script.title}\n\nHook: ${script.hook}\n\nScript:\n${script.script}`;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(fullScriptText).then(() => {
      setCopied(true);
      if (addNotification) addNotification("Script copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  }, [fullScriptText, addNotification]);

  const handleSaveClick = () => { isSaved ? onUnsave(script.id) : onOpenSaveModal(script); };
  const handleDeleteClick = () => { if (onDelete) onDelete(script.id) };
  
  const handleVisualizeClick = () => {
    if (onVisualize) {
        setShowArtStylePicker(true);
    }
  };

  const handleArtStyleSelect = (style: string) => {
    if (onVisualize) {
        onVisualize(script.id, style);
        setVisualsExpanded(true);
    }
    setShowArtStylePicker(false);
  };

  const handleMove = (folderId: string | null) => { if (onMoveScriptToFolder) onMoveScriptToFolder(script.id, folderId); setFolderDropdownOpen(false); };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setFolderDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const emoji = toneEmojis[script.tone] || '📄';

  return (
    <div className={`bg-[#2A1A5E] rounded-xl border p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-[#DAFF00]/5 flex flex-col ${script.isNew ? 'border-[#DAFF00]/80' : 'border-[#4A3F7A] hover:border-[#DAFF00]/50'}`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-[#DAFF00] pr-4">{script.title}</h3>
        <div className="flex items-center space-x-2 flex-shrink-0">
          {onRemix && (
            <button onClick={() => onRemix(script)} className="text-purple-300 hover:text-[#DAFF00] transition-colors duration-200 p-2 rounded-full bg-[#1A0F3C]/50 hover:bg-[#1A0F3C]" title="Remix This Script">
               <i className="fa-solid fa-arrows-spin"></i>
            </button>
          )}
          {onVisualize && !showArtStylePicker && (
              <button onClick={handleVisualizeClick} disabled={isVisualizing} className="text-purple-300 hover:text-[#DAFF00] transition-colors duration-200 p-2 rounded-full bg-[#1A0F3C]/50 hover:bg-[#1A0F3C]" title="Visualize Script">
                {isVisualizing ? <svg className="animate-spin h-4 w-4 text-[#DAFF00]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <i className="fa-solid fa-palette"></i>}
              </button>
          )}
          {onToggleSpeech && (
            <button onClick={() => onToggleSpeech(script)} className="text-purple-300 hover:text-[#DAFF00] transition-colors duration-200 p-2 rounded-full bg-[#1A0F3C]/50 hover:bg-[#1A0F3C]" title={isSpeaking ? "Stop Voiceover" : "Listen to Script"}>
                {isSpeaking ? <i className="fa-solid fa-stop text-red-400"></i> : <i className="fa-solid fa-volume-high"></i>}
            </button>
          )}
          <button onClick={handleCopy} className="text-purple-300 hover:text-[#DAFF00] transition-colors duration-200 p-2 rounded-full bg-[#1A0F3C]/50 hover:bg-[#1A0F3C]" title={copied ? "Copied!" : "Copy Script"}>
            {copied ? <i className="fa-solid fa-check text-green-400"></i> : <i className="fa-solid fa-copy"></i>}
          </button>
          {isSavedView && onMoveScriptToFolder && (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setFolderDropdownOpen(!folderDropdownOpen)} disabled={isMoving} className="text-purple-300 hover:text-[#DAFF00] transition-colors duration-200 p-2 rounded-full bg-[#1A0F3C]/50 hover:bg-[#1A0F3C] disabled:cursor-wait" title="Move to folder">
                {isMoving ? <svg className="animate-spin h-4 w-4 text-[#DAFF00]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <i className="fa-solid fa-folder-plus"></i>}
              </button>
              {folderDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1A0F3C] border border-[#4A3F7A] rounded-md shadow-lg z-10">
                    <div className="py-1">
                        {folders.filter(f => f.id !== 'all').map(folder => (
                            <button key={folder.id} onClick={() => handleMove(folder.id)} className="w-full text-left block px-4 py-2 text-sm text-purple-200 hover:bg-[#2A1A5E] hover:text-white">
                                {folder.name}
                            </button>
                        ))}
                        {script.folder_id && (
                            <>
                                <div className="border-t border-[#4A3F7A] my-1"></div>
                                <button onClick={() => handleMove(null)} className="w-full text-left block px-4 py-2 text-sm text-purple-200 hover:bg-[#2A1A5E] hover:text-white">
                                    Remove from folder
                                </button>
                            </>
                        )}
                    </div>
                </div>
              )}
            </div>
          )}
           {isSavedView && onDelete && (
            <button onClick={handleDeleteClick} className="text-purple-300 hover:text-red-400 transition-colors duration-200 p-2 rounded-full bg-[#1A0F3C]/50 hover:bg-[#1A0F3C]" title="Delete Script">
                <i className="fa-solid fa-trash-can"></i>
            </button>
          )}
          <button onClick={handleSaveClick} disabled={isScoring} className={`transition-colors duration-200 p-2 rounded-full bg-[#1A0F3C]/50 hover:bg-[#1A0F3C] disabled:cursor-not-allowed ${isSaved ? 'text-[#DAFF00]' : 'text-purple-300 hover:text-[#DAFF00]'}`} title={isSaved ? "Unsave Script" : "Save to Favorites"}>
            {isScoring ? (<svg className="animate-spin h-4 w-4 text-[#DAFF00]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>) : (<i className={`fa-bookmark ${isSaved ? 'fa-solid' : 'fa-regular'}`}></i>)}
          </button>
        </div>
      </div>

      {showArtStylePicker && (
          <div className="bg-[#1A0F3C]/80 rounded-lg p-3 my-2">
              <p className="text-center text-xs text-purple-200 mb-2 font-semibold">Choose an art style:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {artStyles.map(style => (
                      <button key={style} onClick={() => handleArtStyleSelect(style)} className="text-xs text-center font-semibold text-white bg-[#2A1A5E] rounded-md px-2 py-1.5 hover:bg-[#DAFF00] hover:text-[#1A0F3C] transition-colors duration-200">
                          {style}
                      </button>
                  ))}
              </div>
          </div>
      )}

      <div className="flex-grow">
        <div className="space-y-4">
          <div><h4 className="font-semibold text-purple-200 text-sm tracking-wider uppercase">Hook (First 3s)</h4><p className="text-[#F0F0F0] mt-1 italic">"{script.hook}"</p></div>
          <div className="border-t border-[#4A3F7A]/50 my-4"></div>
          <div>
            <h4 className="font-semibold text-purple-200 text-sm tracking-wider uppercase">Full Script</h4>
            <pre className={`text-purple-100/90 mt-2 whitespace-pre-wrap text-sm leading-relaxed font-sans transition-all duration-300 ${!isExpanded ? 'line-clamp-3' : 'line-clamp-none'}`}>{script.script}</pre>
            <button onClick={() => setIsExpanded(!isExpanded)} className="text-[#DAFF00] text-sm font-semibold mt-2 hover:underline">
              {isExpanded ? 'Show Less' : 'Show More...'}
            </button>
          </div>
        </div>
      </div>

      {(script.viral_score_breakdown) && (
        <div className="border-t border-[#4A3F7A]/50 mt-4 pt-4">
          <button onClick={() => setAnalysisExpanded(!analysisExpanded)} className="w-full flex justify-between items-center text-left">
              <h4 className="font-semibold text-purple-200 text-sm tracking-wider uppercase">Detailed Virality Analysis</h4>
              <i className={`fa-solid fa-chevron-down transition-transform ${analysisExpanded ? 'rotate-180' : ''}`}></i>
          </button>
          {analysisExpanded && (
            <div className="mt-4 bg-[#1A0F3C]/60 p-4 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnalysisDetail label="Hook Analysis" content={script.viral_score_breakdown.hookAnalysis} />
                    <AnalysisDetail label="Pacing & Flow" content={script.viral_score_breakdown.pacingAnalysis} />
                    <AnalysisDetail label="Value Proposition" content={script.viral_score_breakdown.valueAnalysis} />
                    <AnalysisDetail label="Call To Action" content={script.viral_score_breakdown.ctaAnalysis} />
                </div>
                <div className="border-t border-[#4A3F7A]/50 pt-4">
                     <AnalysisDetail label="Final Verdict" content={script.viral_score_breakdown.finalVerdict} />
                </div>
            </div>
          )}
        </div>
      )}


       {(script.visuals || isVisualizing) && (
        <div className="border-t border-[#4A3F7A]/50 mt-4 pt-4">
            <button onClick={() => setVisualsExpanded(!visualsExpanded)} className="w-full flex justify-between items-center text-left">
              <h4 className="font-semibold text-purple-200 text-sm tracking-wider uppercase">AI Storyboard Concepts</h4>
              <i className={`fa-solid fa-chevron-down transition-transform ${visualsExpanded ? 'rotate-180' : ''}`}></i>
            </button>
             {visualsExpanded && (
                <div className="mt-4">
                    {isVisualizing && (!script.visuals || script.visuals.length === 0) ? (
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
                             <div className="aspect-video bg-slate-700 rounded-lg"></div>
                             <div className="aspect-video bg-slate-700 rounded-lg"></div>
                             <div className="aspect-video bg-slate-700 rounded-lg"></div>
                         </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {script.visuals?.map((base64Image, index) => (
                                <a href={`data:image/jpeg;base64,${base64Image}`} download={`script_visual_${script.id}_${index+1}.jpg`} key={index} className="group aspect-video block">
                                  <img src={`data:image/jpeg;base64,${base64Image}`} alt={`Visual concept ${index + 1}`} className="w-full h-full object-cover rounded-lg border-2 border-transparent group-hover:border-[#DAFF00] transition-all"/>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
             )}
        </div>
      )}

      <div className="border-t border-[#4A3F7A]/50 mt-6 pt-4 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="inline-flex items-center bg-[#1A0F3C] text-[#DAFF00] text-xs font-bold px-3 py-1 rounded-full"><span>{emoji}</span><span className="ml-1.5 uppercase tracking-wider">{script.tone}</span></div>
            {script.isNew && (<div className="inline-flex items-center bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full"><i className="fa-solid fa-star-of-life fa-spin mr-1.5" style={{animationDuration: '3s'}}></i><span className="uppercase tracking-wider">New!</span></div>)}
         </div>
          {script.viral_score_breakdown?.overallScore && (
              <div className="group relative">
                <span className="text-sm font-semibold text-purple-300">Viral Score: <span className="text-white font-bold">{script.viral_score_breakdown.overallScore}</span></span>
                {script.viral_score_breakdown.finalVerdict && <div className="absolute bottom-full mb-2 w-72 bg-black/80 text-white text-xs rounded py-1 px-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">{script.viral_score_breakdown.finalVerdict}</div>}
              </div>
          )}
      </div>
    </div>
  );
};