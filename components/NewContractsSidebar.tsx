
import React from 'react';
import { HistoryIcon, TrashIcon } from './Icons';

interface ContractVersion {
  id: number;
  timestamp: string;
  markdown: string;
  versionNumber: number;
}

interface ContractSeries {
    id: number;
    name: string;
    versions: ContractVersion[];
}

interface NewContractsSidebarProps {
  series: ContractSeries[];
  currentSeriesId?: number | null;
  onSelectSeries: (id: number) => void;
  onDeleteSeries: (id: number) => void;
  onClear: () => void;
}

const NewContractsSidebar: React.FC<NewContractsSidebarProps> = ({ series, currentSeriesId, onSelectSeries, onDeleteSeries, onClear }) => {
  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Prevent any lingering propagation issues
    if (window.confirm('Are you sure you want to delete this entire contract series?')) {
        onDeleteSeries(id);
    }
  };

  const selectedClasses = 'text-white shadow-md bg-gradient-to-r from-orange-500 to-red-600';
  const unselectedClasses = 'hover:bg-gray-100 text-gray-500';

  return (
    <aside className="w-full bg-white rounded-xl shadow-lg border border-gray-200 p-4 flex flex-col">
      <div className="flex items-center mb-4 pb-3 border-b border-gray-200">
        <HistoryIcon className="w-7 h-7 mr-3 text-red-600" />
        <h2 className="text-xl font-bold text-gray-900">New Contracts</h2>
      </div>
      <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 max-h-60">
        {series.length > 0 ? (
          <ul className="space-y-2">
            {series.map((s) => (
              <li
                key={s.id}
                className={`w-full rounded-lg flex justify-between items-center transition-all duration-200 ${
                  currentSeriesId === s.id ? selectedClasses : unselectedClasses
                }`}
              >
                <div
                  onClick={() => onSelectSeries(s.id)}
                  className="flex-grow p-3 cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectSeries(s.id); }}
                  aria-pressed={currentSeriesId === s.id}
                  aria-label={`Select series ${s.name}`}
                >
                  <div className="flex flex-col">
                    <span className={`font-bold ${currentSeriesId === s.id ? 'text-white' : 'text-gray-800'}`}>{s.name}</span>
                    <span className={`text-sm ${currentSeriesId === s.id ? 'text-white/80' : 'text-gray-500/80'}`}>
                        {s.versions.length} {s.versions.length === 1 ? 'version' : 'versions'}
                    </span>
                  </div>
                </div>
                <button
                   onClick={(e) => handleDeleteClick(e, s.id)}
                   className={`p-1 mr-2 rounded-full transition-colors flex-shrink-0 ${
                      currentSeriesId === s.id
                      ? 'hover:bg-red-700/50'
                      : 'text-gray-400 hover:bg-red-100 hover:text-red-600'
                   }`}
                   aria-label={`Delete series ${s.name}`}
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500 mt-4">
            <p>No saved contracts yet.</p>
          </div>
        )}
      </div>
      {series.length > 0 && (
         <div className="mt-4 pt-4 border-t border-gray-200">
            <button 
                onClick={onClear}
                className="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
            >
                Clear History
            </button>
         </div>
      )}
    </aside>
  );
};

export default NewContractsSidebar;