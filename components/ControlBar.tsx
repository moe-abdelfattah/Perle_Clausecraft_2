import React, { useState } from 'react';
import { DocumentType, ContractPromptType } from '../state/types';
import { ChevronDownIcon, SlidersIcon } from './Icons';
import { playClickSound } from '../utils/uiUtils';

// --- TYPE DEFINITIONS --- //

interface Model {
  id: string;
  name: string;
}

interface ContractPrompt {
  id: ContractPromptType;
  name: string;
}

interface DocType {
    id: DocumentType;
    name: string;
}

interface ControlBarProps {
  isLoading: boolean;
  loadingAction: 'new' | 'version' | 'final' | null;
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  selectedDocumentType: DocumentType;
  onDocumentTypeChange: (docType: DocumentType) => void;
  selectedContractPrompt: ContractPromptType;
  onContractPromptChange: (prompt: ContractPromptType) => void;
  onGenerateNew: () => void;
  onGenerateVersion: () => void;
  canGenerateVersion: boolean;
  onGenerateFinal: () => void;
  canGenerateFinalVersion: boolean;
  newDocumentQuantity: number;
  onNewDocumentQuantityChange: (quantity: number) => void;
  newVersionQuantity: number;
  onNewVersionQuantityChange: (quantity: number) => void;
  temperature: number;
  onTemperatureChange: (temp: number) => void;
}

// --- CONSTANTS --- //

const models: Model[] = [
  { id: 'gemini-2.5-pro', name: 'Perle-Pro (Experimental)' }
];

const contractPrompts: ContractPrompt[] = [
    { id: 'dyno', name: 'Clausecraft Dyno' },
    { id: 'revo', name: 'Clausecraft Revo' }
];

const documentTypes: DocType[] = [
    { id: 'contract', name: 'Contract' },
    { id: 'letter', name: 'Official Letter' },
    { id: 'agreement', name: 'Official Agreement' }
];

// --- STYLED SUB-COMPONENTS --- //

const baseButtonClasses = "btn-animated font-semibold h-10 px-4 text-sm transition-all duration-200 ease-in-out focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed disabled:animate-none";
const primaryButtonClasses = `text-white bg-[var(--accent-color)] hover:bg-[var(--accent-color-dark)] ${baseButtonClasses}`;
const secondaryButtonClasses = `text-gray-200 bg-gray-700/80 hover:bg-gray-700 ${baseButtonClasses}`;
const finalButtonClasses = `text-white bg-blue-700 hover:bg-blue-600 ${baseButtonClasses}`;

const selectClasses = "appearance-none w-full h-10 bg-black/50 border border-[var(--border-color)] text-gray-200 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] block pl-3 pr-8 text-sm disabled:bg-gray-800/50 disabled:cursor-not-allowed transition";
const selectIconClasses = "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500";


// --- MAIN COMPONENT --- //

const ControlBar: React.FC<ControlBarProps> = ({
  isLoading,
  loadingAction,
  selectedModel,
  onModelChange,
  selectedDocumentType,
  onDocumentTypeChange,
  selectedContractPrompt,
  onContractPromptChange,
  onGenerateNew,
  onGenerateVersion,
  canGenerateVersion,
  onGenerateFinal,
  canGenerateFinalVersion,
  newDocumentQuantity,
  onNewDocumentQuantityChange,
  newVersionQuantity,
  onNewVersionQuantityChange,
  temperature,
  onTemperatureChange,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const handleAction = (action: () => void) => {
    playClickSound();
    action();
  };
  
  const handleSelectChange = (setter: (value: any) => void) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    playClickSound();
    setter(e.target.value);
  }

  return (
    <div className="hud-panel flex flex-col gap-4 mb-4 p-4" data-tour-id="control-bar">
      <div className="corner-bottom-left"></div>
      <div className="corner-bottom-right"></div>
      <div className="flex flex-row flex-wrap items-end gap-3">
        {/* --- Settings Selectors --- */}
        <div className="flex-grow sm:flex-grow-0">
            <label htmlFor="doc-type-select" className="text-xs font-semibold text-gray-400 mb-1.5 block uppercase tracking-wider">Type</label>
            <div className="relative h-10">
                <select id="doc-type-select" value={selectedDocumentType} onChange={handleSelectChange(onDocumentTypeChange)} disabled={isLoading} className={selectClasses} >
                    {documentTypes.map(doc => <option key={doc.id} value={doc.id}>{doc.name}</option> )}
                </select>
                <div className={selectIconClasses}><ChevronDownIcon className="w-4 h-4"/></div>
            </div>
        </div>
        <div className={`flex-grow sm:flex-grow-0 transition-opacity duration-300 ${selectedDocumentType === 'contract' ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <label htmlFor="prompt-select" className="text-xs font-semibold text-gray-400 mb-1.5 block uppercase tracking-wider">Prompt</label>
            <div className="relative h-10">
                <select id="prompt-select" value={selectedContractPrompt} onChange={handleSelectChange(onContractPromptChange)} disabled={isLoading || selectedDocumentType !== 'contract'} className={selectClasses} >
                    {contractPrompts.map(prompt => <option key={prompt.id} value={prompt.id}>{prompt.name}</option> )}
                </select>
                <div className={selectIconClasses}><ChevronDownIcon className="w-4 h-4"/></div>
            </div>
        </div>
        <div className="flex-grow sm:flex-grow-0">
            <label htmlFor="model-select" className="text-xs font-semibold text-gray-400 mb-1.5 block uppercase tracking-wider">Model</label>
            <div className="relative h-10">
                <select id="model-select" value={selectedModel} onChange={handleSelectChange(onModelChange)} disabled={true} className={selectClasses} >
                    {models.map(model => <option key={model.id} value={model.id}>{model.name}</option> )}
                </select>
                <div className={selectIconClasses}><ChevronDownIcon className="w-4 h-4"/></div>
            </div>
        </div>
        
        {/* Spacer to push buttons right on large screens */}
        <div className="hidden xl:block flex-grow min-w-[2rem]"></div>
        
        {/* --- Action Buttons & Quantity --- */}
        <div className="relative inline-flex" data-tour-id="generate-button">
            <button onClick={() => handleAction(onGenerateNew)} disabled={isLoading} className={`${primaryButtonClasses}`}>
                {loadingAction === 'new' ? 'Generating...' : 'Generate New'}
            </button>
            <div className="relative">
                <select
                    id="new-document-qty"
                    value={newDocumentQuantity}
                    onChange={handleSelectChange((val) => onNewDocumentQuantityChange(parseInt(val, 10)))}
                    disabled={isLoading}
                    className="h-10 w-12 appearance-none bg-[var(--accent-color-dark)] border-l border-blue-500/80 text-white pl-3 pr-6 text-sm text-center font-bold focus:outline-none"
                    aria-label="Select quantity for new documents"
                >
                    {Array.from({ length: 5 }, (_, i) => i + 1).map(num => <option key={num} value={num}>{num}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1 text-white/80"><ChevronDownIcon className="w-4 h-4"/></div>
            </div>
        </div>

        <div className="relative inline-flex">
            <button onClick={() => handleAction(onGenerateVersion)} disabled={isLoading || !canGenerateVersion} className={`${secondaryButtonClasses}`}>
                {loadingAction === 'version' ? 'Versioning...' : 'New Version'}
            </button>
            <div className="relative">
                <select
                    id="new-version-qty"
                    value={newVersionQuantity}
                    onChange={handleSelectChange((val) => onNewVersionQuantityChange(parseInt(val, 10)))}
                    disabled={isLoading || !canGenerateVersion}
                    className="h-10 w-12 appearance-none bg-gray-700 border-l border-gray-600 pl-3 pr-6 text-sm text-center font-semibold focus:outline-none disabled:bg-gray-800/50"
                    aria-label="Select quantity for new versions"
                >
                    {Array.from({ length: 3 }, (_, i) => i + 1).map(num => <option key={num} value={num}>{num}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1 text-gray-400"><ChevronDownIcon className="w-4 h-4"/></div>
            </div>
        </div>
        
        <button onClick={() => handleAction(onGenerateFinal)} disabled={isLoading || !canGenerateFinalVersion} className={`${finalButtonClasses}`}>
            {loadingAction === 'final' ? 'Finalizing...' : 'Generate Final Version'}
        </button>
      </div>
      
      {/* --- Advanced Controls --- */}
      <div className="border-t border-[var(--border-color)] pt-3 mt-1">
        <button 
          onClick={() => {
            playClickSound();
            setShowAdvanced(!showAdvanced);
          }}
          className="btn-subtle-animated flex items-center gap-2 font-medium text-sm w-full text-left p-1 rounded"
          aria-expanded={showAdvanced}
        >
          <SlidersIcon className="w-4 h-4"/>
          Advanced AI Controls
          <ChevronDownIcon className={`w-4 h-4 ml-auto transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>
        {showAdvanced && (
          <div className="mt-4 animate-fade-in-up">
            <div className="relative group space-y-2">
              <label htmlFor="temperature" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Creativity (Temperature): <span className="font-bold text-[var(--accent-color)]">{temperature.toFixed(1)}</span>
              </label>
              <input id="temperature" type="range" min="0" max="1" step="0.1" value={temperature} onChange={(e) => onTemperatureChange(parseFloat(e.target.value))} disabled={isLoading}
                className="w-full h-1.5 bg-gray-700/50 rounded-lg appearance-none cursor-pointer accent-[var(--accent-color)]" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
                        bg-gray-900 text-gray-200 text-xs rounded-md py-1.5 px-3 shadow-lg border border-gray-700 z-10">
                  Higher values increase creativity and randomness. Lower values are more deterministic.
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0
                                  border-x-4 border-x-transparent
                                  border-t-4 border-t-gray-900"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlBar;