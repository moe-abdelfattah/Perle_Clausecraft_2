import React, { useState } from 'react';
import { ContractIcon, LetterIcon, AgreementIcon, TrashIcon, ChevronDownIcon } from './Icons';
import { DocumentSeries } from '../state/types';

// A single, reusable component for rendering a document series and its versions
const SeriesItem: React.FC<{
  series: DocumentSeries;
  isCurrent: boolean;
  currentVersionId: number | null;
  onSelectSeries: (id: number) => void;
  onSelectVersion: (id: number) => void;
  onDeleteSeries: (id: number) => void;
}> = ({ series, isCurrent, currentVersionId, onSelectSeries, onSelectVersion, onDeleteSeries }) => {
  return (
    <li className="bg-gray-50/50 rounded-md">
      {/* Series Title Row */}
      <div className="group flex items-center justify-between p-2.5 rounded-md hover:bg-gray-100 transition-colors duration-150">
        <button
          onClick={() => onSelectSeries(series.id)}
          className="flex-grow flex items-center gap-2 text-left min-w-0"
          aria-expanded={isCurrent}
        >
          <span className={`text-sm font-semibold truncate ${isCurrent ? 'text-orange-600' : 'text-gray-800'}`}>{series.name}</span>
          <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isCurrent ? 'rotate-180' : ''}`} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteSeries(series.id);
          }}
          className="p-1.5 rounded-md transition-all flex-shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 ml-1 text-gray-400 hover:bg-red-100 hover:text-red-600"
          aria-label={`Delete series ${series.name}`}
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
      {/* Versions List (conditionally rendered) */}
      {isCurrent && (
        <ul className="pl-6 pr-2 py-1 space-y-1 border-l-2 border-gray-200 ml-4 animate-fade-in-up">
          {series.versions.map((version) => (
            <li key={version.id}>
              <button
                onClick={() => onSelectVersion(version.id)}
                className={`w-full text-left p-2 rounded-md text-xs transition-colors duration-150 ${version.id === currentVersionId ? 'bg-orange-100/80 text-orange-800 font-semibold' : 'hover:bg-gray-200/60 text-gray-600'}`}
              >
                Version {version.versionNumber}
                <span className="block text-gray-500 text-[10px] font-normal">{version.timestamp}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

// A component for a whole category (e.g., Contracts)
const CategorySection: React.FC<{
  title: string;
  icon: React.ReactNode;
  seriesList: DocumentSeries[];
  currentSeriesId: number | null;
  currentVersionId: number | null;
  onSelectSeries: (id: number) => void;
  onSelectVersion: (id: number) => void;
  onDeleteSeries: (id: number) => void;
}> = ({ title, icon, seriesList, ...props }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (seriesList.length === 0) {
    return null; // Don't render empty categories
  }

  return (
    <div className="border-b border-gray-200/60 last:border-b-0">
      <button 
        className="w-full flex items-center justify-between p-3"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
        <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-2 pt-0">
          <ul className="space-y-2">
            {seriesList.map(series => (
              <SeriesItem
                key={series.id}
                series={series}
                isCurrent={props.currentSeriesId === series.id}
                currentVersionId={props.currentVersionId}
                onSelectSeries={props.onSelectSeries}
                onSelectVersion={props.onSelectVersion}
                onDeleteSeries={props.onDeleteSeries}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


// The main sidebar component
interface CategorizedSidebarProps {
  series: DocumentSeries[];
  currentSeriesId: number | null;
  currentVersionId: number | null;
  onSelectSeries: (id: number) => void;
  onSelectVersion: (id: number) => void;
  onDeleteSeries: (id: number) => void;
  onClear: () => void;
}

const CategorizedSidebar: React.FC<CategorizedSidebarProps> = ({ series, onClear, ...props }) => {
  const contracts = series.filter(s => s.type === 'contract');
  const agreements = series.filter(s => s.type === 'agreement');
  const letters = series.filter(s => s.type === 'letter');

  return (
    <aside className="w-full h-full bg-white rounded-lg border border-gray-200/60 flex flex-col">
      <div className="flex-grow overflow-y-auto custom-scrollbar">
        {series.length === 0 ? (
          <div className="text-center text-gray-500 p-10">
            <p className="text-sm font-medium">No saved documents yet.</p>
            <p className="text-xs text-gray-400 mt-1">Generate a new document to begin.</p>
          </div>
        ) : (
          <>
            <CategorySection
              title="Contracts"
              icon={<ContractIcon className="w-6 h-6 text-gray-400" />}
              seriesList={contracts}
              {...props}
            />
            <CategorySection
              title="Agreements"
              icon={<AgreementIcon className="w-6 h-6 text-gray-400" />}
              seriesList={agreements}
              {...props}
            />
            <CategorySection
              title="Letters"
              icon={<LetterIcon className="w-6 h-6 text-gray-400" />}
              seriesList={letters}
              {...props}
            />
          </>
        )}
      </div>
      {series.length > 0 && (
        <div className="mt-auto p-2 border-t border-gray-200/60 flex-shrink-0">
          <button
            onClick={onClear}
            className="w-full text-center text-sm font-semibold text-red-600 bg-transparent py-2 px-4 rounded-md transition-colors duration-200 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Clear All History
          </button>
        </div>
      )}
    </aside>
  );
};

export default CategorizedSidebar;
