import React from 'react';

interface ProgressBarProps {
  progress: number;
  status: string;
  bulkProgress?: { current: number; total: number } | null;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, status, bulkProgress }) => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-sm font-medium text-gray-400 truncate pr-4">{status || 'INITIALIZING...'}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
            {bulkProgress && bulkProgress.total > 1 && (
                <span className="text-xs font-semibold text-gray-400 bg-gray-700/50 px-1.5 py-0.5 border border-gray-600">
                    {bulkProgress.current} / {bulkProgress.total}
                </span>
            )}
            <span className="text-sm font-semibold text-gray-200">{Math.round(progress)}%</span>
        </div>
      </div>
      <div className="w-full bg-black/50 rounded-sm h-3 overflow-hidden border border-[var(--border-color)] relative p-0.5">
        <div
          className="bg-[var(--accent-color)] h-full transition-all duration-500 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse"></div>
        </div>
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.4) 50%, transparent 50%)',
            backgroundSize: '100% 4px',
            animation: 'scanline 2s linear infinite'
          }}
        ></div>
        <style>{`
          @keyframes scanline {
            0% { background-position: 0 0; }
            100% { background-position: 0 20px; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ProgressBar;
