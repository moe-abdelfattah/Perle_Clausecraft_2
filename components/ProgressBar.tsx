
import React from 'react';

interface ProgressBarProps {
  progress: number;
  status: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, status }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between mb-2">
        <span className="text-base font-medium text-gray-700">{status || 'Drafting Contract...'}</span>
        <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 border border-gray-300/50 overflow-hidden">
        <div
          className="bg-gradient-to-r from-orange-400 to-red-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;