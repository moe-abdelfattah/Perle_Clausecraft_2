import React from 'react';
import ProgressBar from './ProgressBar';
import { AlertTriangleIcon, ClausecraftHeroIcon } from './Icons';
// FIX: Corrected import path for types. Types are defined in state/types.ts, not App.tsx.
import { DocumentVersion } from '../state/types';

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
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <ProgressBar progress={progress} status={progressStatus} bulkProgress={bulkProgress} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <AlertTriangleIcon className="w-12 h-12 mb-4 text-red-300" />
        <h3 className="text-xl font-semibold mb-2 text-gray-800">An Error Occurred</h3>
        <p className="text-gray-600 max-w-md">{error}</p>
      </div>
    );
  }

  if (currentDocument) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
      <ClausecraftHeroIcon className="w-20 h-20 mb-6" />
      <h2 className="text-xl font-semibold mb-1 text-gray-800">Welcome to Perle Clausecraft</h2>
      <p className="max-w-md text-gray-500 leading-relaxed">
        Select a document type and click "Generate New" to begin.
      </p>
    </div>
  );
};

export default StatusDisplay;