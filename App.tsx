import React, { useState, useCallback, useRef, useEffect, useMemo, useReducer } from 'react';
import { generateDocument, generateAmendedDocument, generateFinalDocument } from './services/geminiService';
import { sanitizeForFilename } from './utils/documentParser';
import { playClickSound } from './utils/uiUtils';
import Header from './components/Header';
import ContractDisplay from './components/ContractDisplay';
import CategorizedSidebar from './components/DocumentsSidebar';
import ControlBar from './components/ControlBar';
import DownloadBar from './components/DownloadBar';
import StatusDisplay from './components/StatusDisplay';
import FeedbackForm from './components/FeedbackForm';
import CodeMatrixBackground from './components/CodeMatrixBackground';
import StartupScreen from './components/StartupScreen';
import OnboardingTour from './components/OnboardingTour'; // New component
import { appReducer, initialState } from './state/appReducer';
import type { Action, BulkProgress, DocumentSeries, DocumentVersion, GenerationSession, DocumentType, ContractPromptType } from './state/types';

// --- ULTRA-DETAILED REALISTIC PROGRESS STEPS --- //
const getGenerationSteps = (
    action: 'new' | 'version' | 'final',
    docType: DocumentType
) => {
    // This block represents the multi-stage quality check, including the new self-correction step.
    const qualityAssuranceSteps = [
        { status: "Submitting for AI quality review...", duration: 1000 },
        { status: "AI Judge: Verifying structural integrity...", duration: 1500 },
        { status: "AI Judge: Checking for placeholders & empty data...", duration: 1500 },
        { status: "AI Judge: Cross-referencing with prompt directives...", duration: 1500 },
        { status: "Self-Correction Loop: Applying quality feedback for regeneration...", duration: 2000 },
        { status: "Final verification passed...", duration: 500 },
        { status: "Compiling final document...", duration: 1000 },
    ];

    if (action === 'final') {
        return [
            { status: "Parsing document for revision markers...", duration: 1000 },
            { status: "Identifying all <ins> and <del> tags...", duration: 1500 },
            { status: "Merging accepted changes into base text...", duration: 2000 },
            { status: "Sanitizing text to remove all markers...", duration: 1500 },
            { status: "Re-sequencing clause and paragraph numbering...", duration: 2000 },
            { status: "Performing final typography check...", duration: 1500 },
            ...qualityAssuranceSteps,
        ];
    }
    if (action === 'version') {
         return [
            { status: "Parsing original document structure...", duration: 1500 },
            { status: "Identifying key clauses for negotiation...", duration: 2000 },
            { status: "Simulating negotiation strategy for Party Two...", duration: 2500 },
            { status: "Re-drafting primary legal text...", duration: 4000 },
            { status: "Propagating changes to dependent clauses...", duration: 2500 },
            { status: "Verifying financial and timeline consistency...", duration: 2000 },
            { status: "Generating diff markers for review...", duration: 1000 },
            ...qualityAssuranceSteps,
        ];
    }
    // action === 'new'
    switch(docType) {
        case 'contract':
            return [
                { status: "Initializing cognitive core...", duration: 500 },
                { status: "Loading Saudi Arabian legal ontology...", duration: 1500 },
                { status: "Instantiating party data structures...", duration: 1200 },
                { status: "Synthesizing unique entity details (CRNs, addresses)...", duration: 1800 },
                { status: "Drafting preamble and recitals...", duration: 1500 },
                { status: "Constructing core legal framework...", duration: 1000 },
                { status: "Generating primary 'Scope of Work' clauses...", duration: 2500 },
                { status: "Populating specification data matrix...", duration: 2000 },
                { status: "Generating Annex A: Scope of Work...", duration: 800 },
                { status: "Constructing timeline schema for Annex B...", duration: 800 },
                { status: "Populating detailed milestone data...", duration: 1500 },
                { status: "Generating Annex B: Project Timeline...", duration: 800 },
                { status: "Defining penalty matrix for Annex C...", duration: 800 },
                { status: "Calculating financial penalty clauses...", duration: 1200 },
                { status: "Generating Annex C: Penalties...", duration: 800 },
                { status: "Composing formal signature block...", duration: 1000 },
                ...qualityAssuranceSteps,
            ];
        case 'agreement':
            return [
                { status: "Initializing agreement synthesis engine...", duration: 500 },
                { status: "Selecting agreement type (MOU, NDA)...", duration: 1500 },
                { status: "Instantiating party data structures...", duration: 2000 },
                { status: "Drafting preamble and recitals...", duration: 3000 },
                { status: "Generating purpose-specific core clauses...", duration: 4000 },
                { status: "Composing formal signature block...", duration: 1500 },
                ...qualityAssuranceSteps,
            ];
        case 'letter':
            return [
                { status: "Initializing formal correspondence module...", duration: 500 },
                { status: "Selecting communication scenario...", duration: 1500 },
                { status: "Instantiating sender/recipient data...", duration: 1800 },
                { status: "Drafting main body content...", duration: 2500 },
                { status: "Formatting formal salutations and closing...", duration: 1000 },
                { status: "Generating stylized signature block...", duration: 1200 },
                ...qualityAssuranceSteps,
            ];
        default:
            return [];
    }
};

const runProgressSimulation = async (
    action: 'new' | 'version' | 'final',
    docType: DocumentType,
    dispatch: React.Dispatch<Action>
) => {
    const steps = getGenerationSteps(action, docType);
    if (!steps || steps.length === 0) {
        dispatch({ type: 'UPDATE_PROGRESS', payload: { progress: 50, status: 'Processing...' } });
        await new Promise(resolve => setTimeout(resolve, 5000));
        return;
    }

    const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0);
    let elapsedTime = 0;
    
    for (const step of steps) {
        const startProgress = (elapsedTime / totalDuration) * 95;
        dispatch({ type: 'UPDATE_PROGRESS', payload: { progress: startProgress, status: step.status } });

        const microSteps = Math.max(1, Math.floor(step.duration / 50)); // Update interval of 50ms
        const timePerMicroStep = step.duration / microSteps;

        for (let i = 0; i < microSteps; i++) {
            await new Promise(resolve => setTimeout(resolve, timePerMicroStep));
            elapsedTime += timePerMicroStep;
            const currentProgress = (elapsedTime / totalDuration) * 95;
            dispatch({ type: 'UPDATE_PROGRESS', payload: { progress: currentProgress, status: step.status } });
        }
    }
    
    dispatch({ type: 'UPDATE_PROGRESS', payload: { progress: 95, status: 'Finalizing document stream...' } });
};

// --- MAIN APP COMPONENT --- //
export default function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { documentSeries, currentSeriesId, currentVersionId, loadingAction, error, progress, progressStatus, lastGeneratedVersionId, bulkProgress } = state;

  // --- UI-ONLY STATE --- //
  const [isInitializing, setIsInitializing] = useState(true);
  const [isExitingStartup, setIsExitingStartup] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-pro');
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType>('contract');
  const [selectedContractPrompt, setSelectedContractPrompt] = useState<ContractPromptType>('dyno');
  const [newDocumentQuantity, setNewDocumentQuantity] = useState<number>(1);
  const [newVersionQuantity, setNewVersionQuantity] = useState<number>(1);
  const [temperature, setTemperature] = useState<number>(0.8);
  const [recoverySession, setRecoverySession] = useState<GenerationSession | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  
  // --- REFS --- //
  const contractDisplayRef = useRef<HTMLDivElement>(null);
  
  // --- DERIVED STATE & MEMOS --- //
  const isLoading = useMemo(() => loadingAction !== null, [loadingAction]);

  const currentSeries = useMemo(() => {
    return documentSeries.find(s => s.id === currentSeriesId) || null;
  }, [documentSeries, currentSeriesId]);

  const { currentDocument, previousDocument } = useMemo(() => {
    if (!currentSeries) return { currentDocument: null, previousDocument: null };
    const current = currentSeries.versions.find(v => v.id === currentVersionId) || null;
    if (!current || current.versionNumber === 1) return { currentDocument: current, previousDocument: null };
    const previous = currentSeries.versions.find(v => v.versionNumber === current.versionNumber - 1) || null;
    return { currentDocument: current, previousDocument: previous };
  }, [currentSeries, currentVersionId]);
  
  const canGenerateVersion = useMemo(() => {
    if (!currentDocument) return false;
    return currentDocument.type === 'contract';
  }, [currentDocument]);

  const canGenerateFinalVersion = useMemo(() => {
    if (!currentSeries) return false;
    return (currentSeries.type === 'contract' || currentSeries.type === 'agreement') && currentSeries.versions.length >= 2;
  }, [currentSeries]);

  const lastGeneratedDocument = useMemo(() => {
    if (!lastGeneratedVersionId) return null;
    return documentSeries.flatMap(s => s.versions).find(v => v.id === lastGeneratedVersionId) || null;
  }, [documentSeries, lastGeneratedVersionId]);

  const shouldShowFeedback = useMemo(() => {
    return !!(lastGeneratedDocument && !lastGeneratedDocument.feedbackSubmitted);
  }, [lastGeneratedDocument]);

  // --- SIDE EFFECTS (localStorage, Startup, Onboarding) --- //
  useEffect(() => {
    dispatch({ type: 'LOAD_HISTORY_FROM_STORAGE' });

    try {
        const savedSessionJSON = localStorage.getItem('generationSession');
        if (savedSessionJSON) {
            const session: GenerationSession = JSON.parse(savedSessionJSON);
            const oneHour = 60 * 60 * 1000;
            if (Date.now() - session.startTime < oneHour) setRecoverySession(session);
            else localStorage.removeItem('generationSession');
        }
    } catch (e) {
        console.error("Failed to load generation session from localStorage", e);
    }
  }, []);
  
  const unlockAndPlayLoadSound = useCallback(() => {
    if (audioUnlocked) return; // Only unlock once

    const unlock = (sound: HTMLAudioElement | null) => {
        if (sound) {
            // A common way to unlock audio context. Play and immediately pause.
            const playPromise = sound.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    sound.pause();
                    sound.currentTime = 0;
                }).catch(() => { /* This can fail if another sound is already trying to play. It's okay. */ });
            }
        }
    };
    
    const loadSound = document.getElementById('load-sound') as HTMLAudioElement;
    const clickSound = document.getElementById('click-sound') as HTMLAudioElement;

    // Unlock both sounds
    unlock(loadSound);
    unlock(clickSound);
    setAudioUnlocked(true);
    
    // Now, actually play the load sound for the transition.
    if (loadSound) {
        loadSound.volume = 0.4;
        loadSound.currentTime = 0;
        const playPromise = loadSound.play();
        if(playPromise !== undefined) {
            playPromise.catch(e => console.warn("Could not play load sound on transition:", e));
        }
    }
  }, [audioUnlocked]);

  const handleEnterApp = useCallback(() => {
    setIsExitingStartup(true);
    unlockAndPlayLoadSound();

    setTimeout(() => {
      setIsInitializing(false); // Remove startup screen from DOM after animation
      const hasCompletedTour = localStorage.getItem('onboardingComplete');
      if (!hasCompletedTour) {
          // A small delay for the main UI to animate in before starting the tour.
          setTimeout(() => setShowOnboarding(true), 500);
      }
    }, 500); // Wait for fade-out animation to complete
  }, [unlockAndPlayLoadSound]);

  // --- CORE GENERATION LOGIC --- //
  const handleGenerate = useCallback(async (
    generationType: 'new' | 'version', 
    quantity: number,
    docType: DocumentType,
    baseMarkdown?: string,
    seriesId?: number,
  ) => {
    dispatch({ type: 'START_GENERATION', payload: { action: generationType } });

    const session: GenerationSession = {
        type: generationType,
        model: selectedModel,
        documentType: docType,
        prompt: docType === 'contract' ? selectedContractPrompt : undefined,
        originalMarkdown: baseMarkdown,
        seriesId: seriesId,
        startTime: Date.now(),
        temperature,
    };
    localStorage.setItem('generationSession', JSON.stringify(session));

    try {
        const config = { temperature };
        let latestMarkdown = baseMarkdown || '';
        const generatedMarkdowns: string[] = [];
        
        for (let i = 0; i < quantity; i++) {
            dispatch({ type: 'SET_BULK_PROGRESS', payload: { current: i + 1, total: quantity } });

            const simulationPromise = runProgressSimulation(generationType, docType, dispatch);

            const generationPromise = (async () => {
                if (generationType === 'new') {
                    return await generateDocument(selectedModel, docType, selectedContractPrompt, config);
                } else {
                    const result = await generateAmendedDocument(latestMarkdown, selectedModel, docType, config);
                    latestMarkdown = result;
                    return result;
                }
            })();

            const [newMarkdown] = await Promise.all([generationPromise, simulationPromise]);
            generatedMarkdowns.push(newMarkdown);
        }
        
        dispatch({ type: 'UPDATE_PROGRESS', payload: { progress: 100, status: "Document generated successfully!" } });
        await new Promise(resolve => setTimeout(resolve, 500));

        dispatch({ type: 'GENERATION_SUCCESS', payload: { 
            type: generationType,
            markdowns: generatedMarkdowns, 
            docType,
            seriesId: seriesId
        } });

        dispatch({ type: 'END_GENERATION' });

    } catch (err) {
        dispatch({ type: 'GENERATION_FAILURE', payload: { error: err instanceof Error ? err.message : 'An unknown error occurred.' } });
    } finally {
        localStorage.removeItem('generationSession');
    }
  }, [selectedModel, selectedDocumentType, selectedContractPrompt, temperature]);

  const handleGenerateNewDocument = () => handleGenerate('new', newDocumentQuantity, selectedDocumentType);
  const handleGenerateNewVersion = () => {
    if (currentDocument && currentSeriesId) {
        handleGenerate('version', newVersionQuantity, currentDocument.type, currentDocument.markdown, currentSeriesId);
    }
  };

  const handleGenerateFinalVersion = useCallback(async () => {
    if (!currentDocument || !currentSeriesId) return;

    dispatch({ type: 'START_GENERATION', payload: { action: 'final' } });

    try {
        // Pre-process the markdown on the client to remove diff tags for a more reliable finalization.
        let preCleanedMarkdown = currentDocument.markdown;
        preCleanedMarkdown = preCleanedMarkdown.replace(/<del>[\s\S]*?<\/del>/g, ''); // Remove deletions
        preCleanedMarkdown = preCleanedMarkdown.replace(/<\/?ins>/g, ''); // Remove insertion tags
        preCleanedMarkdown = preCleanedMarkdown.replace(/ +/g, ' ').replace(/\n{3,}/g, '\n\n').trim();

        const config = { temperature };

        const finalizationPromise = generateFinalDocument(
            preCleanedMarkdown, // Pass the pre-cleaned version to the AI
            selectedModel,
            currentDocument.type,
            config
        );

        const simulationPromise = runProgressSimulation('final', currentDocument.type, dispatch);
        
        const [finalMarkdown] = await Promise.all([finalizationPromise, simulationPromise]);
        
        dispatch({ type: 'UPDATE_PROGRESS', payload: { progress: 100, status: "Document finalized successfully!" } });
        await new Promise(resolve => setTimeout(resolve, 500));

        dispatch({ type: 'GENERATION_SUCCESS', payload: { 
            type: 'final',
            markdowns: [finalMarkdown], 
            docType: currentDocument.type,
            seriesId: currentSeriesId
        }});

        dispatch({ type: 'END_GENERATION' });
    } catch (err) {
        dispatch({ type: 'GENERATION_FAILURE', payload: { error: err instanceof Error ? err.message : 'An unknown error occurred.' } });
    }
  }, [currentDocument, currentSeriesId, selectedModel, temperature]);

  // --- ONBOARDING HANDLERS --- //
  const handleNextOnboardingStep = () => setOnboardingStep(prev => prev + 1);
  const handleEndOnboarding = () => {
      setShowOnboarding(false);
      localStorage.setItem('onboardingComplete', 'true');
  };

  // --- OTHER EVENT HANDLERS --- //
  const handleDownload = useCallback((format: 'pdf' | 'md' | 'txt') => {
    if (!currentDocument) return;

    const { documentDate, type, party1, subject } = currentDocument;

    const datePart = documentDate; // YYYYMMDD format
    
    const typePart = type.charAt(0).toUpperCase() + type.slice(1);

    let namePart = '';
    if (type === 'letter' && subject && subject !== 'Unknown') {
        namePart = subject;
    } else {
        namePart = party1;
    }

    const filename = `${typePart}-${datePart}-${sanitizeForFilename(namePart)}`;

    if (format === 'md') {
      const blob = new Blob([currentDocument.markdown], { type: 'text/markdown;charset=utf-t' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.md`;
      link.click();
      URL.revokeObjectURL(link.href);
    } else if (format === 'txt') {
      const textContent = contractDisplayRef.current?.innerText || '';
      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.txt`;
      link.click();
      URL.revokeObjectURL(link.href);
    } else if (format === 'pdf') {
      // Trigger the browser's native print dialog
      window.print();
    }
  }, [currentDocument]);

  const handleSelectSeries = useCallback((seriesId: number) => dispatch({ type: 'SET_CURRENT_DOCUMENT', payload: { seriesId } }), []);
  const handleSelectVersion = useCallback((versionId: number) => dispatch({ type: 'SET_CURRENT_DOCUMENT', payload: { versionId } }), []);
  const handleDeleteSeries = useCallback((seriesId: number) => {
    if (window.confirm('Are you sure you want to delete this entire document series? This action cannot be undone.')) {
        dispatch({ type: 'DELETE_SERIES', payload: { seriesId } });
    }
  }, []);
  const handleClearHistory = useCallback(() => {
    if (window.confirm('Are you sure you want to delete all document history? This action cannot be undone.')) {
        dispatch({ type: 'CLEAR_HISTORY' });
    }
  }, []);
  
  const handleResumeGeneration = useCallback(async () => {
    playClickSound();
    if (!recoverySession) return;
    const { type, originalMarkdown, seriesId, documentType, prompt, model, temperature } = recoverySession;
    
    // Set UI state to match session
    setSelectedModel(model);
    setSelectedDocumentType(documentType);
    if(prompt) setSelectedContractPrompt(prompt);
    setTemperature(temperature);
    setRecoverySession(null);

    // Use the generic handler to resume
    handleGenerate(type, 1, documentType, originalMarkdown, seriesId);
  }, [recoverySession, handleGenerate]);
  
  const handleDiscardSession = useCallback(() => {
    playClickSound();
    localStorage.removeItem('generationSession');
    setRecoverySession(null);
  }, []);

  const handleFeedbackSubmit = useCallback((rating: number, comment: string) => {
    if (!lastGeneratedVersionId) return;
    const feedbackData = { versionId: lastGeneratedVersionId, rating, comment, timestamp: new Date().toISOString() };
    const existingFeedback = JSON.parse(localStorage.getItem('documentFeedback') || '[]');
    localStorage.setItem('documentFeedback', JSON.stringify([...existingFeedback, feedbackData]));
    console.log('Feedback Submitted:', feedbackData);

    dispatch({ type: 'SET_FEEDBACK_SUBMITTED', payload: { versionId: lastGeneratedVersionId } });
    setFeedbackMessage('Thank you for your feedback!');
    setTimeout(() => setFeedbackMessage(''), 3000);
  }, [lastGeneratedVersionId]);

  const handleFeedbackDismiss = useCallback(() => {
    if (!lastGeneratedVersionId) return;
    dispatch({ type: 'SET_FEEDBACK_SUBMITTED', payload: { versionId: lastGeneratedVersionId } });
  }, [lastGeneratedVersionId]);

  // --- RENDER LOGIC --- //
  if (isInitializing) {
    return <StartupScreen isExiting={isExitingStartup} onEnter={handleEnterApp} />;
  }
  
  return (
    <div className="min-h-screen text-gray-300 flex flex-col animate-fade-in">
      <CodeMatrixBackground />
      {showOnboarding && <OnboardingTour step={onboardingStep} onNext={handleNextOnboardingStep} onEnd={handleEndOnboarding} />}
      {recoverySession && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in">
              <div className="hud-panel p-8 max-w-md w-full text-center">
                  <div className="corner-bottom-left"></div>
                  <div className="corner-bottom-right"></div>
                  <h2 className="text-xl font-bold text-gray-100 mb-2">Resume Session?</h2>
                  <p className="text-gray-400 mb-6">Your last session was interrupted. Would you like to continue where you left off?</p>
                  <div className="flex justify-center gap-4">
                      <button onClick={handleDiscardSession} className="btn-animated font-semibold py-2 px-5 transition-colors focus:outline-none bg-gray-700 text-gray-200 hover:bg-gray-600">Discard</button>
                      <button onClick={handleResumeGeneration} className="btn-animated text-white font-semibold py-2 px-5 transition-colors duration-200 ease-in-out focus:outline-none bg-[var(--accent-color)] hover:bg-[var(--accent-color-dark)]">Resume</button>
                  </div>
              </div>
          </div>
      )}
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex flex-col md:flex-row gap-6 lg:gap-8">
        <div className="w-full md:w-80 lg:w-96 flex-shrink-0">
          <CategorizedSidebar
            series={documentSeries}
            currentSeriesId={currentSeriesId}
            currentVersionId={currentVersionId}
            onSelectSeries={handleSelectSeries}
            onSelectVersion={handleSelectVersion}
            onDeleteSeries={handleDeleteSeries}
            onClear={handleClearHistory}
          />
        </div>
        <div className="flex-1 flex flex-col min-w-0 main-content-area-wrapper" data-tour-id="content-area">
            <div className="control-bar-container">
                <ControlBar isLoading={isLoading} loadingAction={loadingAction} selectedModel={selectedModel} onModelChange={setSelectedModel} selectedDocumentType={selectedDocumentType} onDocumentTypeChange={setSelectedDocumentType} selectedContractPrompt={selectedContractPrompt} onContractPromptChange={setSelectedContractPrompt} onGenerateNew={handleGenerateNewDocument} onGenerateVersion={handleGenerateNewVersion} canGenerateVersion={canGenerateVersion} onGenerateFinal={handleGenerateFinalVersion} canGenerateFinalVersion={canGenerateFinalVersion} newDocumentQuantity={newDocumentQuantity} onNewDocumentQuantityChange={setNewDocumentQuantity} newVersionQuantity={newVersionQuantity} onNewVersionQuantityChange={setNewVersionQuantity} temperature={temperature} onTemperatureChange={setTemperature} />
            </div>
          
            {currentDocument && !isLoading && !error ? (
              <>
                <div className="download-bar-container">
                    <DownloadBar onDownload={handleDownload} />
                </div>
                {shouldShowFeedback ? (<div className="feedback-form-container"><FeedbackForm onSubmit={handleFeedbackSubmit} onDismiss={handleFeedbackDismiss} /></div>) : null}
                {feedbackMessage ? (<div className="text-center p-3 my-4 bg-blue-900/50 text-cyan-300 rounded-md border border-blue-500/30 transition-all duration-300 ease-in-out">{feedbackMessage}</div>) : null}
              </>
            ) : null}

            <div className="hud-panel p-6 md:p-8 flex-1 min-h-[60vh] flex flex-col main-content-area">
              <div className="corner-bottom-left"></div>
              <div className="corner-bottom-right"></div>
              <StatusDisplay isLoading={isLoading} error={error} currentDocument={currentDocument} progress={progress} progressStatus={progressStatus} bulkProgress={bulkProgress}>
                {currentDocument && currentSeries ? <ContractDisplay ref={contractDisplayRef} title={currentSeries.name} markdownContent={currentDocument.markdown || ''} previousMarkdownContent={previousDocument?.markdown} versionNumber={currentDocument.versionNumber || 0} /> : null}
              </StatusDisplay>
            </div>
        </div>
      </main>
    </div>
  );
}