import React from 'react';

interface ProgressBarProps {
  progress: number;
  status: string;
  bulkProgress?: { current: number; total: number } | null;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, status, bulkProgress }) => {
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-sm font-medium text-gray-600 truncate pr-4">{status || 'Drafting Document...'}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
            {bulkProgress && bulkProgress.total > 1 && (
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                    {bulkProgress.current} of {bulkProgress.total}
                </span>
            )}
            <span className="text-sm font-semibold text-gray-800">{Math.round(progress)}%</span>
        </div>
      </div>
      <div className="w-full bg-gray-200/80 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;