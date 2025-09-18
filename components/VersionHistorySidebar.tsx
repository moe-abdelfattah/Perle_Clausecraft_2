
import React from 'react';
import { HistoryIcon } from './Icons';

interface ContractVersion {
  id: number;
  versionNumber: number;
  timestamp: string;
}

interface ContractSeries {
    id: number;
    name: string;
    versions: ContractVersion[];
}

interface VersionHistorySidebarProps {
  series: ContractSeries | null;
  currentVersionId: number | null;
  onSelectVersion: (versionId: number) => void;
}

const VersionHistorySidebar: React.FC<VersionHistorySidebarProps> = ({ series, currentVersionId, onSelectVersion }) => {
  
  const selectedClasses = 'text-white shadow-md bg-gradient-to-r from-orange-500 to-red-600';
  const unselectedClasses = 'hover:bg-gray-100 text-gray-500';
  
  return (
    <aside className="w-full bg-white rounded-xl shadow-lg border border-gray-200 p-4 flex flex-col">
      <div className="flex items-center mb-4 pb-3 border-b border-gray-200">
        <HistoryIcon className="w-7 h-7 mr-3 text-red-600" />
        <h2 className="text-xl font-bold text-gray-900">Version History</h2>
      </div>
      <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 max-h-60">
        {series ? (
          <ul className="space-y-2">
            {series.versions.map((version) => (
              <li key={version.id}>
                <button
                  onClick={() => onSelectVersion(version.id)}
                  className={`w-full text-left p-3 rounded-lg flex justify-between items-center transition-colors duration-200 ${
                    currentVersionId === version.id
                      ? selectedClasses
                      : unselectedClasses
                  }`}
                  aria-pressed={currentVersionId === version.id}
                >
                  <div className="flex flex-col">
                    <span className={`font-bold ${currentVersionId === version.id ? 'text-white' : 'text-gray-800'}`}>Version {version.versionNumber}</span>
                    <span className={`text-sm ${currentVersionId === version.id ? 'text-white/80' : 'text-gray-500/80'}`}>
                        {version.timestamp}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500 mt-4">
            <p>Select a contract to see its versions.</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default VersionHistorySidebar;