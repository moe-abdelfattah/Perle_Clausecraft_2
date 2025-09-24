import React from 'react';
import ProgressBar from './ProgressBar';
import { AlertTriangleIcon, ClausecraftHeroIcon } from './Icons';
import { DocumentVersion } from '../state/types';
import GeneratingCodeDisplay from './GeneratingCodeDisplay';

interface StatusDisplayProps {
  isLoading: boolean;
  error: string;
  currentDocument: DocumentVersion | null;
  progress: number;
  progressStatus: string;
  bulkProgress?: { current: number; total: number; } | null;
  children: React.ReactNode;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({
  isLoading,
  error,
  currentDocument,
  progress,
  progressStatus,
  bulkProgress,
  children
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-start h-full text-center p-4 w-full">
        <div className="w-full mb-6">
          <ProgressBar progress={progress} status={progressStatus} bulkProgress={bulkProgress} />
        </div>
        <div className="w-full flex-1 min-h-0 relative">
          <GeneratingCodeDisplay />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <AlertTriangleIcon className="w-12 h-12 mb-4 text-red-500/50" />
        <h3 className="text-xl font-semibold mb-2 text-gray-200 uppercase tracking-wider">Error Encountered</h3>
        <p className="text-gray-400 max-w-md">{error}</p>
      </div>
    );
  }

  if (currentDocument) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
      <ClausecraftHeroIcon className="w-24 h-24 mb-6 text-[var(--accent-color)] opacity-50 animate-float" />
      <h2 className="text-xl font-semibold mb-1 text-gray-200 uppercase tracking-widest">Perle Clausecraft</h2>
      <p className="max-w-md text-gray-400 leading-relaxed">
        Select a document type and click "Generate New" to initialize system.
      </p>
    </div>
  );
};

export default StatusDisplay;