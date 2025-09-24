import React, { useState } from 'react';
import { ContractIcon, LetterIcon, AgreementIcon, TrashIcon, ChevronDownIcon } from './Icons';
import { DocumentSeries } from '../state/types';
import { playClickSound } from '../utils/uiUtils';

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
    <li className="bg-black/20 transition-colors hover:bg-black/40 relative">
      {isCurrent && <div className="absolute left-0 top-0 h-full w-0.5 bg-[var(--accent-color)]"></div>}
      {/* Series Title Row */}
      <div className="group flex items-center justify-between p-2.5">
        <button
          onClick={() => {
            playClickSound();
            onSelectSeries(series.id);
          }}
          className="flex-grow flex items-center gap-2 text-left min-w-0"
          aria-expanded={isCurrent}
        >
          <span className={`text-sm font-semibold truncate ${isCurrent ? 'text-[var(--accent-color)]' : 'text-gray-300'}`}>{series.name}</span>
        </button>
        <button
          onClick={(e) => {
            playClickSound();
            e.stopPropagation();
            onDeleteSeries(series.id);
          }}
          className="btn-icon-danger p-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 ml-1 text-gray-500 rounded-full"
          aria-label={`Delete series ${series.name}`}
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
      {/* Versions List (conditionally rendered) */}
      {isCurrent && (
        <ul className="pl-4 pr-2 pb-2 space-y-1 animate-fade-in-up">
          {series.versions.map((version) => (
            <li key={version.id}>
              <button
                onClick={() => {
                  playClickSound();
                  onSelectVersion(version.id);
                }}
                className={`relative w-full text-left p-2 text-xs transition-colors duration-150 ${version.id === currentVersionId ? 'text-[var(--accent-color)]' : 'hover:bg-gray-700/50 text-gray-400'}`}
              >
                {version.id === currentVersionId && (
                  <>
                    <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[var(--accent-color)] font-bold">[</span>
                    <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[var(--accent-color)] font-bold">]</span>
                  </>
                )}
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
    <div className="border-b border-[var(--border-color)] last:border-b-0">
      <button 
        className="w-full flex items-center justify-between p-3"
        onClick={() => {
          playClickSound();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-lg font-semibold text-gray-200 uppercase tracking-wider">{title}</h2>
        </div>
        <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
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
    <aside className="hud-panel w-full h-full flex flex-col" data-tour-id="sidebar">
      <div className="corner-bottom-left"></div>
      <div className="corner-bottom-right"></div>
      <div className="flex-grow overflow-y-auto custom-scrollbar">
        {series.length === 0 ? (
          <div className="text-center text-gray-500 p-10">
            <p className="text-sm font-medium">NO DATA LOGS FOUND</p>
            <p className="text-xs text-gray-600 mt-1">Generate new data to begin.</p>
          </div>
        ) : (
          <>
            <CategorySection
              title="Contracts"
              icon={<ContractIcon className="w-6 h-6 text-gray-500" />}
              seriesList={contracts}
              {...props}
            />
            <CategorySection
              title="Agreements"
              icon={<AgreementIcon className="w-6 h-6 text-gray-500" />}
              seriesList={agreements}
              {...props}
            />
            <CategorySection
              title="Letters"
              icon={<LetterIcon className="w-6 h-6 text-gray-500" />}
              seriesList={letters}
              {...props}
            />
          </>
        )}
      </div>
      {series.length > 0 && (
        <div className="mt-auto p-2 border-t border-[var(--border-color)] flex-shrink-0">
          <button
            onClick={() => {
              playClickSound();
              onClear();
            }}
            className="btn-danger-animated w-full text-center text-sm font-semibold py-2 px-4 focus:outline-none"
          >
            PURGE ALL DATA
          </button>
        </div>
      )}
    </aside>
  );
};

export default CategorizedSidebar;