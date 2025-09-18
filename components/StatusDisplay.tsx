import React from 'react';
import ProgressBar from './ProgressBar';
import { ContractIcon, AlertTriangleIcon } from './Icons';
import { ContractVersion } from '../App';

interface StatusDisplayProps {
  isLoading: boolean;
  error: string;
  currentContract: ContractVersion | null;
  progress: number;
  progressStatus: string;
  children: React.ReactNode;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({
  isLoading,
  error,
  currentContract,
  progress,
  progressStatus,
  children
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <ProgressBar progress={progress} status={progressStatus} />
        <p className="mt-6 text-lg text-gray-500">
          Clausecraft is drafting your document... This may take a few minutes
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-orange-600">
        <AlertTriangleIcon className="w-16 h-16 mb-4" />
        <h3 className="text-2xl font-bold mb-2 text-gray-900">An Error Occurred</h3>
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  if (currentContract) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
      <ContractIcon className="w-24 h-24 mb-4 text-gray-300" />
      <h2 className="text-3xl font-bold mb-2 text-gray-800">Welcome to Perle Clausecraft</h2>
      <p className="text-xl">
        Click "Generate New Contract" to begin or load a contract from the history.
      </p>
    </div>
  );
};

export default StatusDisplay;