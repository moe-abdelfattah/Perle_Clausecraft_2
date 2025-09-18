import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { generateContract, generateAmendedContract } from './services/geminiService';
import { parseContractDetails } from './utils/contractParser';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import ContractDisplay from './components/ContractDisplay';
import NewContractsSidebar from './components/NewContractsSidebar';
import VersionHistorySidebar from './components/VersionHistorySidebar';
import ControlBar from './components/ControlBar';
import DownloadBar from './components/DownloadBar';
import StatusDisplay from './components/StatusDisplay';

// --- TYPE DEFINITIONS --- //

export interface ContractVersion {
  id: number;
  timestamp: string;
  markdown: string;
  versionNumber: number;
  party1: string;
  party2: string;
  contractDate: string; // YYYYMMDD format
}

export interface ContractSeries {
    id: number;
    name: string;
    versions: ContractVersion[];
}

// --- CONSTANTS --- //

const generationSteps = [
  "Initializing AI model...",
  "Generating unique scenario & base template...",
  "Creating unique party details...",
  "Drafting contract preamble & background...",
  "Writing detailed Scope of Work (≥600 words)...",
  "Populating specification tables...",
  "Generating Annex A: Technical Specifications...",
  "Generating Annex B: Detailed Timeline...",
  "Generating Annex C: Penalties Table...",
  "Generating Annex D: Payment Schedule...",
  "Finalizing signature blocks...",
  "Performing self-correction checks...",
  "Finalizing document..."
];

// --- MAIN APP COMPONENT --- //

export default function App() {
  // --- CORE STATE --- //
  // Manages all contract series and their versions, acting as the single source of truth.
  const [contractSeries, setContractSeries] = useState<ContractSeries[]>([]);
  // Tracks the currently selected series and version for display.
  const [currentSeriesId, setCurrentSeriesId] = useState<number | null>(null);
  const [currentVersionId, setCurrentVersionId] = useState<number | null>(null);
  // Holds the user's selected AI model.
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-pro');

  // --- UI & ASYNC STATE --- //
  // Tracks the current loading action ('new' contract or new 'version') to show the correct UI state.
  const [loadingAction, setLoadingAction] = useState<'new' | 'version' | null>(null);
  // Stores any error message to be displayed to the user.
  const [error, setError] = useState<string>('');
  // State for the loading progress bar simulation.
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState<string>('');
  
  // --- REFS --- //
  const progressIntervalRef = useRef<number | null>(null);
  const contractDisplayRef = useRef<HTMLDivElement>(null);
  
  // --- DERIVED STATE & MEMOS --- //

  // A boolean flag indicating if any generation process is currently active.
  const isLoading = useMemo(() => loadingAction !== null, [loadingAction]);

  // Memoized value of the currently selected contract series object.
  const currentSeries = useMemo(() => {
    return contractSeries.find(s => s.id === currentSeriesId) || null;
  }, [contractSeries, currentSeriesId]);

  // Memoized values providing the current contract and its immediate predecessor for the diff view.
  const { currentContract, previousContract } = useMemo(() => {
    if (!currentSeries) {
        return { currentContract: null, previousContract: null };
    }
    const current = currentSeries.versions.find(v => v.id === currentVersionId) || null;
    if (!current || current.versionNumber === 1) {
        return { currentContract: current, previousContract: null };
    }
    const previous = currentSeries.versions.find(v => v.versionNumber === current.versionNumber - 1) || null;
    return { currentContract: current, previousContract: previous };
  }, [currentSeries, currentVersionId]);


  // --- SIDE EFFECTS --- //

  // Load contract history from localStorage on initial component mount and handle data migration.
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('contractHistory');
      if (savedHistory) {
        const parsedHistory: any[] = JSON.parse(savedHistory);
        
        // This migration ensures contracts saved before the file-naming feature
        // are updated with parsed details (party names, date) upon first load.
        const migratedHistory: ContractSeries[] = parsedHistory.map(series => ({
            ...series,
            versions: series.versions.map((version: any): ContractVersion => {
                if ('party1' in version && version.party1 !== 'UnknownParty') {
                    return version as ContractVersion;
                }
                const { party1, party2, contractDate } = parseContractDetails(version.markdown);
                return { ...version, party1, party2, contractDate };
            })
        }));

        setContractSeries(migratedHistory);
      }
    } catch (e) {
      console.error("Failed to load/migrate contract history from localStorage", e);
      localStorage.removeItem('contractHistory'); // Clear corrupted data
    }

    // Cleanup progress interval on component unmount to prevent memory leaks.
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // --- HELPER & CALLBACK FUNCTIONS --- //
  
  /**
   * Starts a simulated progress bar animation with dynamic status updates.
   */
  const startProgressSimulation = useCallback(() => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    setProgress(0);
    setProgressStatus(generationSteps[0]);
    let currentStep = 0;
    const totalSteps = generationSteps.length;
    let inPhase2 = false;
    const phase1Interval = 2500; // 2.5s per step
    const phase2Interval = 1000; // 1s per increment

    const tick = () => {
      if (!inPhase2) {
        // --- PHASE 1: Step-based progress ---
        currentStep++;
        if (currentStep < totalSteps) {
          // Progress up to 80%
          const progressTarget = Math.round(((currentStep + 1) / totalSteps) * 80);
          setProgress(progressTarget);
          setProgressStatus(generationSteps[currentStep]);
        } else {
          // Transition to Phase 2
          inPhase2 = true;
          setProgress(80);
          setProgressStatus(generationSteps[totalSteps - 1]);
          // Clear old interval and start new one for phase 2
          if(progressIntervalRef.current) clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = window.setInterval(tick, phase2Interval);
        }
      } else {
        // --- PHASE 2: Slow crawl ---
        setProgress(prevProgress => {
            if (prevProgress < 95) {
                return prevProgress + 0.25; // Slow increment
            }
            // Once it reaches 95, stop the interval
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            return 95;
        });
      }
    };
    
    progressIntervalRef.current = window.setInterval(tick, phase1Interval);
  }, []);

  /**
   * Completes the progress simulation (jumps to 100%) and triggers a callback.
   * @param callback The function to call after the "100%" state is shown.
   */
  const completeProgressSimulation = useCallback((callback: () => void) => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setProgress(100);
    setProgressStatus("Document generated successfully!");
    setTimeout(callback, 500);
  }, []);

  /**
   * Resets the progress bar to its initial state.
   */
  const resetProgress = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setProgress(0);
    setProgressStatus('');
  }, []);

  /**
   * Processes a newly generated markdown string, creating a new contract series and version.
   * @param markdown The contract content returned from the AI.
   */
  const handleNewContractSuccess = (markdown: string) => {
    const timestamp = new Date().toLocaleString();
    const { party1, party2, contractDate } = parseContractDetails(markdown);
    
    const newVersion: ContractVersion = {
      id: Date.now(),
      timestamp,
      markdown,
      versionNumber: 1,
      party1,
      party2,
      contractDate
    };
    
    const newSeries: ContractSeries = {
        id: newVersion.id,
        name: `Contract ${timestamp}`,
        versions: [newVersion]
    };

    const updatedHistory = [newSeries, ...contractSeries];
    setContractSeries(updatedHistory);
    localStorage.setItem('contractHistory', JSON.stringify(updatedHistory));
    setCurrentSeriesId(newSeries.id);
    setCurrentVersionId(newVersion.id);
    
    completeProgressSimulation(() => setLoadingAction(null));
  };

  /**
   * Processes a newly generated markdown string, adding it as a new version to the current series.
   * @param markdown The amended contract content returned from the AI.
   */
  const handleNewVersionSuccess = (markdown: string) => {
    if (!currentSeries) return;

    const { party1, party2, contractDate } = parseContractDetails(markdown);
    const newVersion: ContractVersion = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        markdown,
        versionNumber: currentSeries.versions.length + 1,
        party1,
        party2,
        contractDate
    };

    const updatedSeriesList = contractSeries.map(series => 
        series.id === currentSeriesId 
            ? { ...series, versions: [...series.versions, newVersion] } 
            : series
    );

    setContractSeries(updatedSeriesList);
    localStorage.setItem('contractHistory', JSON.stringify(updatedSeriesList));
    setCurrentVersionId(newVersion.id);
    
    completeProgressSimulation(() => setLoadingAction(null));
  };
  
  /**
   * Handles errors from the AI generation process.
   * @param error The error object or message.
   */
  const handleGenerationError = (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    setError(`Failed to generate contract: ${errorMessage}`);
    resetProgress();
    setLoadingAction(null);
  };
  
  // --- EVENT HANDLERS --- //

  const handleGenerateNewContract = useCallback(async () => {
    setLoadingAction('new');
    setError('');
    startProgressSimulation();
    try {
      const markdown = await generateContract(selectedModel);
      handleNewContractSuccess(markdown);
    } catch (err) {
      handleGenerationError(err);
    }
  }, [contractSeries, selectedModel, startProgressSimulation]);

  const handleGenerateNewVersion = useCallback(async () => {
    if (!currentContract) return;

    setLoadingAction('version');
    setError('');
    startProgressSimulation();

    try {
        const markdown = await generateAmendedContract(currentContract.markdown, selectedModel);
        handleNewVersionSuccess(markdown);
    } catch (err) {
        handleGenerationError(err);
    }
  }, [currentContract, contractSeries, selectedModel, startProgressSimulation]);

  const handleDownload = useCallback((format: 'pdf' | 'md' | 'txt') => {
    if (!currentContract) return;

    const { party1, party2, contractDate, versionNumber } = currentContract;
    const versionStr = `V${versionNumber}`;
    const filename = `${party1}_${party2}_${contractDate}_${versionStr}`;

    if (format === 'md') {
      const blob = new Blob([currentContract.markdown], { type: 'text/markdown;charset=utf-8' });
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
      const element = contractDisplayRef.current;
      if (element && (window as any).html2pdf) {
        const clonedElement = element.cloneNode(true) as HTMLElement;
        clonedElement.style.maxHeight = 'none';
        
        const legend = clonedElement.querySelector('.diff-legend');
        if (legend) legend.remove();

        const opt = {
          margin: 0.5,
          filename: `${filename}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        (window as any).html2pdf().from(clonedElement).set(opt).save();
      } else {
        setError("PDF generation library is not available.");
      }
    }
  }, [currentContract]);

  const handleSelectSeries = useCallback((seriesId: number) => {
    const seriesToLoad = contractSeries.find(s => s.id === seriesId);
    if (seriesToLoad) {
        setError('');
        setCurrentSeriesId(seriesId);
        setCurrentVersionId(seriesToLoad.versions[seriesToLoad.versions.length - 1].id);
    }
  }, [contractSeries]);

  const handleSelectVersion = useCallback((versionId: number) => {
    setCurrentVersionId(versionId);
  }, []);
  
  const handleDeleteSeries = useCallback((seriesId: number) => {
    setContractSeries(prevSeries => {
        const updatedHistory = prevSeries.filter(s => s.id !== seriesId);
        localStorage.setItem('contractHistory', JSON.stringify(updatedHistory));
        if (currentSeriesId === seriesId) {
            setCurrentSeriesId(null);
            setCurrentVersionId(null);
        }
        return updatedHistory;
    });
  }, [currentSeriesId]);

  const handleClearHistory = useCallback(() => {
    if (window.confirm('Are you sure you want to delete all contract history? This action cannot be undone.')) {
        setContractSeries([]);
        localStorage.setItem('contractHistory', JSON.stringify([]));
        setCurrentSeriesId(null);
        setCurrentVersionId(null);
    }
  }, []);

  // --- RENDER LOGIC --- //

  return (
    <div className="min-h-screen bg-[rgb(244,246,245)] text-gray-800 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">
        <div className="flex flex-col gap-8 w-full md:w-80 lg:w-96 flex-shrink-0">
            <NewContractsSidebar
                series={contractSeries}
                currentSeriesId={currentSeriesId}
                onSelectSeries={handleSelectSeries}
                onDeleteSeries={handleDeleteSeries}
                onClear={handleClearHistory}
            />
            <VersionHistorySidebar
                series={currentSeries}
                currentVersionId={currentVersionId}
                onSelectVersion={handleSelectVersion}
            />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
            <ControlBar
                isLoading={isLoading}
                loadingAction={loadingAction}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                onGenerateNew={handleGenerateNewContract}
                onGenerateVersion={handleGenerateNewVersion}
                canGenerateVersion={!!currentContract}
            />
          
            {currentContract && !isLoading && !error && (
                <DownloadBar onDownload={handleDownload} />
            )}

            <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 flex-1 min-h-[60vh] border border-gray-200 flex flex-col">
              <StatusDisplay
                isLoading={isLoading}
                error={error}
                currentContract={currentContract}
                progress={progress}
                progressStatus={progressStatus}
              >
                <ContractDisplay 
                  ref={contractDisplayRef} 
                  markdownContent={currentContract?.markdown || ''}
                  previousMarkdownContent={previousContract?.markdown}
                  versionNumber={currentContract?.versionNumber || 0}
                />
              </StatusDisplay>
            </div>
        </div>
      </main>
    </div>
  );
}