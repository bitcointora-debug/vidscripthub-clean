
import React, { useState, useMemo, useRef, useContext, useCallback, useEffect } from 'react';
import { ScriptCard } from './ScriptCard';
import type { Script, Folder } from '../types';
import { DataContext } from '../context/DataContext';
import { UIContext } from '../context/UIContext';

interface SavedScriptsViewProps {
    onAddNewFolder: (folderName: string) => void;
    onOpenSaveModal: (script: Script) => void;
    onUnsaveScript: (scriptId: string) => void;
    onDeleteScript: (scriptId: string) => void;
    isScriptSaved: (script: Script) => boolean;
    scoringScriptId: string | null;
    onMoveScriptToFolder: (scriptId:string, folderId: string | null) => void;
    onRenameFolder: (folderId: string, newName: string) => void;
    onDeleteFolder: (folderId: string) => void;
    onVisualize: (scriptId: string, artStyle: string) => void;
    visualizingScriptId: string | null;
    onToggleSpeech: (script: Script) => void;
    speakingScriptId: string | null;
}

export const SavedScriptsView: React.FC<SavedScriptsViewProps> = ({ 
    onAddNewFolder, onOpenSaveModal, onUnsaveScript, onDeleteScript,
    isScriptSaved, scoringScriptId, onMoveScriptToFolder, onRenameFolder, onDeleteFolder,
    onVisualize, visualizingScriptId, onToggleSpeech, speakingScriptId
}) => {
    const { state: dataState, dispatch: dataDispatch } = useContext(DataContext);
    const { savedScripts, folders } = dataState;
    const { state: uiState } = useContext(UIContext);
    const { movingScriptId } = uiState;
    
    const [activeFolderId, setActiveFolderId] = useState('all');
    const [sortBy, setSortBy] = useState<'dateSaved' | 'viralScore'>('dateSaved');
    const [searchTerm, setSearchTerm] = useState('');
    const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
    const [tempFolderName, setTempFolderName] = useState('');
    const renameInputRef = useRef<HTMLInputElement>(null);
    const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);
    const [selectedScriptIds, setSelectedScriptIds] = useState<string[]>([]);
    const [isBatchMoveOpen, setIsBatchMoveOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const isSelectionMode = selectedScriptIds.length > 0;

    const addNotification = useCallback((message: string) => {
      // This component doesn't have direct access to userId for async dispatch
      // Notifications are handled via the Dashboard component for now.
      console.log("Notification intended:", message);
    }, []);

    const filteredAndSortedScripts = useMemo(() => {
        let scriptsToDisplay = savedScripts.filter(script => 
            searchTerm === '' || 
            script.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            script.script.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (script.hook && script.hook.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        if (activeFolderId !== 'all') {
            scriptsToDisplay = scriptsToDisplay.filter(script => script.folder_id === activeFolderId);
        }
        
        return scriptsToDisplay.sort((a, b) => {
            if (sortBy === 'viralScore') return (b.viral_score_breakdown?.overallScore || 0) - (a.viral_score_breakdown?.overallScore || 0);
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
        });
    }, [savedScripts, searchTerm, sortBy, activeFolderId]);

    const totalPages = Math.ceil(filteredAndSortedScripts.length / itemsPerPage);
    const paginatedScripts = useMemo(() => {
        return filteredAndSortedScripts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [filteredAndSortedScripts, currentPage, itemsPerPage]);
    
    const allVisibleScriptsSelected = useMemo(() => {
        const visibleIds = paginatedScripts.map(s => s.id);
        return visibleIds.length > 0 && visibleIds.every(id => selectedScriptIds.includes(id));
    }, [selectedScriptIds, paginatedScripts]);
    
    const handleAddNewFolderClick = () => {
        const newFolderName = prompt("Enter new folder name:");
        if (newFolderName) onAddNewFolder(newFolderName);
    };

    const handleRenameStart = (folder: Folder) => {
        setRenamingFolderId(folder.id);
        setTempFolderName(folder.name);
        setTimeout(() => renameInputRef.current?.focus(), 0);
    };
    
    const handleRenameCancel = () => {
        setRenamingFolderId(null);
        setTempFolderName('');
    };

    const handleRenameSubmit = (folderId: string) => {
        if (tempFolderName.trim() && tempFolderName.trim() !== folders.find(f => f.id === folderId)?.name) {
            onRenameFolder(folderId, tempFolderName.trim());
        }
        setRenamingFolderId(null);
    };
    
    const renderEmptyState = () => {
        if (searchTerm && filteredAndSortedScripts.length === 0) {
            return { title: 'No Results Found', message: `Your search for "${searchTerm}" did not match any scripts.` };
        }
        if (activeFolderId !== 'all' && filteredAndSortedScripts.length === 0) {
            return { title: 'This Folder is Empty', message: 'You can drag and drop scripts here.' };
        }
        if (savedScripts.length === 0) {
            return { title: 'Your Library is Empty', message: 'Generate some scripts and click the bookmark icon to save them here.' };
        }
        return { title: 'No Scripts Found', message: 'Try adjusting your search or filter criteria.' };
    };

    const getFolderScriptCount = (folderId: string) => {
        if (folderId === 'all') return savedScripts.length;
        return savedScripts.filter(s => s.folder_id === folderId).length;
    };
    
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, scriptId: string) => {
        e.dataTransfer.setData('scriptId', scriptId);
        e.currentTarget.style.opacity = '0.5';
    };
    
    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.style.opacity = '1';
        setDragOverFolderId(null);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, folderId: string) => {
        e.preventDefault();
        if(dragOverFolderId !== folderId) {
            setDragOverFolderId(folderId);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, folderId: string | null) => {
        e.preventDefault();
        const scriptId = e.dataTransfer.getData('scriptId');
        if (scriptId) {
            onMoveScriptToFolder(scriptId, folderId);
        }
        setDragOverFolderId(null);
    };
    
    const handleToggleSelect = (scriptId: string) => {
        setSelectedScriptIds(prev =>
            prev.includes(scriptId) ? prev.filter(id => id !== scriptId) : [...prev, scriptId]
        );
    };
    
    const handleToggleSelectAll = () => {
        if (allVisibleScriptsSelected) {
            const visibleIds = paginatedScripts.map(s => s.id);
            setSelectedScriptIds(prev => prev.filter(id => !visibleIds.includes(id)));
        } else {
            setSelectedScriptIds(prev => [...new Set([...prev, ...paginatedScripts.map(s => s.id)])]);
        }
    };
    
    const handleBatchDelete = () => {
        if (selectedScriptIds.length === 0) return;
        dataDispatch({ type: 'BATCH_DELETE_SCRIPTS_REQUEST', payload: { scriptIds: selectedScriptIds } });
        addNotification(`${selectedScriptIds.length} scripts deleted.`);
        setSelectedScriptIds([]);
    };
    
    const handleBatchMove = (folderId: string | null) => {
        if (selectedScriptIds.length === 0) return;
        const folderName = folderId ? folders.find(f => f.id === folderId)?.name : 'main library';
        dataDispatch({ type: 'BATCH_MOVE_SCRIPTS_REQUEST', payload: { scriptIds: selectedScriptIds, folderId } });
        addNotification(`${selectedScriptIds.length} scripts moved to "${folderName}".`);
        setSelectedScriptIds([]);
        setIsBatchMoveOpen(false);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [activeFolderId, sortBy, searchTerm]);


    return (
        <div className="flex flex-col md:flex-row gap-8 h-full">
            <aside className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
                <div className="bg-[#2A1A5E]/50 rounded-xl p-4 h-full">
                     <button onClick={handleAddNewFolderClick} className="w-full flex items-center justify-center bg-[#DAFF00] text-[#1A0F3C] font-bold py-2.5 px-4 rounded-md hover:bg-opacity-90 transition-all duration-200 text-sm mb-4"><i className="fa-solid fa-plus mr-2"></i>New Folder</button>
                    <nav className="space-y-1">
                        <h3 className="px-3 text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">Folders</h3>
                        {folders.map(folder => {
                            const isDropTarget = dragOverFolderId === folder.id;
                            return (
                                <div 
                                    key={folder.id} 
                                    className={`group flex items-center text-sm font-medium rounded-md transition-colors duration-200 relative ${isDropTarget ? 'bg-[#DAFF00]/10' : ''}`}
                                    onDragLeave={() => setDragOverFolderId(null)}
                                    onDragOver={(e) => handleDragOver(e, folder.id)}
                                    onDrop={(e) => handleDrop(e, folder.id === 'all' ? null : folder.id)}
                                >
                                    {renamingFolderId === folder.id ? (
                                        <input
                                            ref={renameInputRef}
                                            type="text"
                                            value={tempFolderName}
                                            onChange={(e) => setTempFolderName(e.target.value)}
                                            onBlur={() => handleRenameSubmit(folder.id)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') handleRenameSubmit(folder.id); if (e.key === 'Escape') handleRenameCancel(); }}
                                            className="w-full bg-[#1A0F3C] border border-[#DAFF00] rounded-md py-1.5 px-2 text-sm text-white"
                                            autoFocus
                                        />
                                    ) : (
                                    <>
                                        <button onClick={() => setActiveFolderId(folder.id)} className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${activeFolderId === folder.id ? 'bg-[#DAFF00] text-[#1A0F3C]' : 'text-purple-200 hover:bg-[#4A3F7A]/50 hover:text-white'}`}>
                                            <i className="fa-regular fa-folder w-4 text-center"></i>
                                            <span className="flex-1 truncate">{folder.name}</span>
                                            <span className="text-xs opacity-70">{getFolderScriptCount(folder.id)}</span>
                                        </button>
                                        {folder.id !== 'all' && (
                                        <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleRenameStart(folder)} className="p-1 text-purple-300 hover:text-white" title="Rename"><i className="fa-solid fa-pencil text-xs"></i></button>
                                            <button onClick={() => onDeleteFolder(folder.id)} className="p-1 text-purple-300 hover:text-red-400" title="Delete"><i className="fa-solid fa-trash-can text-xs"></i></button>
                                        </div>
                                        )}
                                    </>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                </div>
            </aside>
            <main className="flex-1">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                     <div className="relative flex-grow">
                        <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-purple-300/50"></i>
                        <input type="text" placeholder="Search saved scripts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#2A1A5E]/50 border border-[#4A3F7A]/30 rounded-md py-2.5 pl-10 pr-4 text-[#F0F0F0] placeholder-purple-300/50 focus:ring-2 focus:ring-[#DAFF00] focus:border-[#DAFF00] focus:outline-none transition duration-200" />
                    </div>
                    <div className="flex-shrink-0">
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="w-full md:w-auto bg-[#2A1A5E]/50 border border-[#4A3F7A]/30 rounded-md py-2.5 pl-4 pr-10 text-white focus:ring-2 focus:ring-[#DAFF00] appearance-none bg-no-repeat" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`}}>
                            <option value="dateSaved">Sort by Date</option>
                            <option value="viralScore">Sort by Viral Score</option>
                        </select>
                    </div>
                </div>
                
                {isSelectionMode && (
                    <div className="bg-[#1A0F3C] p-3 rounded-lg mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <input 
                                type="checkbox"
                                className="h-5 w-5 rounded bg-[#2A1A5E] border-[#4A3F7A] text-[#DAFF00] focus:ring-[#DAFF00]"
                                checked={allVisibleScriptsSelected}
                                onChange={handleToggleSelectAll}
                                title={allVisibleScriptsSelected ? "Deselect all on this page" : "Select all on this page"}
                            />
                            <span className="text-sm font-semibold text-white">{selectedScriptIds.length} script{selectedScriptIds.length !== 1 ? 's' : ''} selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="relative">
                                <button onClick={() => setIsBatchMoveOpen(o => !o)} className="px-3 py-1.5 text-xs font-bold text-purple-200 bg-[#2A1A5E] rounded-md hover:bg-[#4A3F7A] flex items-center gap-2"><i className="fa-solid fa-folder-plus"></i>Move</button>
                                {isBatchMoveOpen && (
                                     <div className="absolute right-0 bottom-full mb-2 w-48 bg-[#1A0F3C] border border-[#4A3F7A] rounded-md shadow-lg z-20 p-1">
                                        <button onClick={() => handleBatchMove(null)} className="w-full text-left block px-3 py-2 text-sm text-purple-200 hover:bg-[#2A1A5E] hover:text-white rounded-md">
                                            All Scripts (no folder)
                                        </button>
                                        <div className="border-t border-[#4A3F7A]/50 my-1"></div>
                                        {folders.filter(f => f.id !== 'all').map(folder => (
                                            <button key={folder.id} onClick={() => handleBatchMove(folder.id)} className="w-full text-left block px-3 py-2 text-sm text-purple-200 hover:bg-[#2A1A5E] hover:text-white rounded-md">
                                                {folder.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                           </div>
                           <button onClick={handleBatchDelete} className="px-3 py-1.5 text-xs font-bold text-red-400 bg-red-900/50 rounded-md hover:bg-red-900/80 flex items-center gap-2"><i className="fa-solid fa-trash-can"></i>Delete</button>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {paginatedScripts.length > 0 ? (
                        paginatedScripts.map(script => (
                            <div key={script.id} draggable onDragStart={(e) => handleDragStart(e, script.id)} onDragEnd={handleDragEnd}>
                                <ScriptCard
                                    script={script}
                                    onOpenSaveModal={onOpenSaveModal}
                                    onUnsave={onUnsaveScript}
                                    onDelete={onDeleteScript}
                                    isSaved={isScriptSaved(script)}
                                    isScoring={scoringScriptId === script.id}
                                    isMoving={movingScriptId === script.id}
                                    isSavedView={true}
                                    folders={folders}
                                    onMoveScriptToFolder={onMoveScriptToFolder}
                                    addNotification={addNotification}
                                    onVisualize={onVisualize}
                                    isVisualizing={visualizingScriptId === script.id}
                                    onToggleSpeech={onToggleSpeech}
                                    isSpeaking={speakingScriptId === script.id}
                                    isSelectable={true}
                                    isSelected={selectedScriptIds.includes(script.id)}
                                    onToggleSelect={handleToggleSelect}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 px-6 bg-[#2A1A5E]/30 rounded-lg border-2 border-dashed border-[#4A3F7A]/50">
                            <i className="fa-regular fa-folder-open text-4xl text-purple-300 mb-4"></i>
                            <h3 className="mt-2 text-lg font-medium text-[#F0F0F0]">{renderEmptyState().title}</h3>
                            <p className="mt-1 text-sm text-purple-200/80">{renderEmptyState().message}</p>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center items-center gap-2">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 rounded-md bg-[#2A1A5E] text-purple-200 disabled:opacity-50 hover:bg-[#4A3F7A]"><i className="fa-solid fa-chevron-left text-xs"></i></button>
                        <span className="text-sm text-purple-300">Page {currentPage} of {totalPages}</span>
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 rounded-md bg-[#2A1A5E] text-purple-200 disabled:opacity-50 hover:bg-[#4A3F7A]"><i className="fa-solid fa-chevron-right text-xs"></i></button>
                    </div>
                )}
            </main>
        </div>
    );
};
