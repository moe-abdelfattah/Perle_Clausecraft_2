import React, { useState } from 'react';
import { DocumentType, ContractPromptType } from '../state/types';
import { ChevronDownIcon, SlidersIcon } from './Icons';

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

const baseButtonClasses = "font-semibold h-10 px-4 text-sm transition-all duration-200 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed focus:z-10";
const primaryButtonClasses = `text-white bg-orange-600 hover:bg-orange-700 shadow-sm ${baseButtonClasses}`;
const secondaryButtonClasses = `text-gray-800 bg-gray-100 hover:bg-gray-200 ${baseButtonClasses}`;
const finalButtonClasses = `text-green-800 bg-green-100 hover:bg-green-200 shadow-sm ${baseButtonClasses}`;

const selectClasses = "appearance-none w-full h-10 bg-white border border-gray-300/80 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-500 focus:border-orange-500 block pl-3 pr-8 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed transition shadow-sm";
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

  return (
    <div className="flex flex-col gap-4 mb-4 p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/60">
      <div className="flex flex-row flex-wrap items-end gap-3">
        {/* --- Settings Selectors --- */}
        <div className="flex-grow sm:flex-grow-0">
            <label htmlFor="doc-type-select" className="text-xs font-semibold text-gray-600 mb-1.5 block">Document Type</label>
            <div className="relative h-10">
                <select id="doc-type-select" value={selectedDocumentType} onChange={(e) => onDocumentTypeChange(e.target.value as DocumentType)} disabled={isLoading} className={selectClasses} >
                    {documentTypes.map(doc => <option key={doc.id} value={doc.id}>{doc.name}</option> )}
                </select>
                <div className={selectIconClasses}><ChevronDownIcon className="w-4 h-4"/></div>
            </div>
        </div>
        <div className={`flex-grow sm:flex-grow-0 transition-opacity duration-300 ${selectedDocumentType === 'contract' ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <label htmlFor="prompt-select" className="text-xs font-semibold text-gray-600 mb-1.5 block">Prompt</label>
            <div className="relative h-10">
                <select id="prompt-select" value={selectedContractPrompt} onChange={(e) => onContractPromptChange(e.target.value as ContractPromptType)} disabled={isLoading || selectedDocumentType !== 'contract'} className={selectClasses} >
                    {contractPrompts.map(prompt => <option key={prompt.id} value={prompt.id}>{prompt.name}</option> )}
                </select>
                <div className={selectIconClasses}><ChevronDownIcon className="w-4 h-4"/></div>
            </div>
        </div>
        <div className="flex-grow sm:flex-grow-0">
            <label htmlFor="model-select" className="text-xs font-semibold text-gray-600 mb-1.5 block">Model</label>
            <div className="relative h-10">
                <select id="model-select" value={selectedModel} onChange={(e) => onModelChange(e.target.value)} disabled={true} className={selectClasses} >
                    {models.map(model => <option key={model.id} value={model.id}>{model.name}</option> )}
                </select>
                <div className={selectIconClasses}><ChevronDownIcon className="w-4 h-4"/></div>
            </div>
        </div>
        
        {/* Spacer to push buttons right on large screens */}
        <div className="hidden xl:block flex-grow min-w-[2rem]"></div>
        
        {/* --- Action Buttons & Quantity --- */}
        <div className="relative inline-flex shadow-sm rounded-md focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-1">
            <button onClick={onGenerateNew} disabled={isLoading} className={`${primaryButtonClasses} rounded-l-md`}>
                {loadingAction === 'new' ? 'Generating...' : 'Generate New'}
            </button>
            <div className="relative">
                <select
                    id="new-document-qty"
                    value={newDocumentQuantity}
                    onChange={(e) => onNewDocumentQuantityChange(parseInt(e.target.value, 10))}
                    disabled={isLoading}
                    className="h-10 w-12 appearance-none bg-orange-600 border-l border-orange-500/80 text-white rounded-r-md pl-3 pr-6 text-sm text-center font-semibold focus:outline-none"
                    aria-label="Select quantity for new documents"
                >
                    {Array.from({ length: 5 }, (_, i) => i + 1).map(num => <option key={num} value={num}>{num}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1 text-white/80"><ChevronDownIcon className="w-4 h-4"/></div>
            </div>
        </div>

        <div className="relative inline-flex shadow-sm rounded-md focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-1">
            <button onClick={onGenerateVersion} disabled={isLoading || !canGenerateVersion} className={`${secondaryButtonClasses} rounded-l-md border border-r-0 border-gray-300/80`}>
                {loadingAction === 'version' ? 'Versioning...' : 'New Version'}
            </button>
            <div className="relative">
                <select
                    id="new-version-qty"
                    value={newVersionQuantity}
                    onChange={(e) => onNewVersionQuantityChange(parseInt(e.target.value, 10))}
                    disabled={isLoading || !canGenerateVersion}
                    className="h-10 w-12 appearance-none bg-gray-100 border border-gray-300/80 rounded-r-md pl-3 pr-6 text-sm text-center font-semibold focus:outline-none disabled:bg-gray-100"
                    aria-label="Select quantity for new versions"
                >
                    {Array.from({ length: 3 }, (_, i) => i + 1).map(num => <option key={num} value={num}>{num}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1 text-gray-500"><ChevronDownIcon className="w-4 h-4"/></div>
            </div>
        </div>
        
        <button onClick={onGenerateFinal} disabled={isLoading || !canGenerateFinalVersion} className={`${finalButtonClasses} rounded-md`}>
            {loadingAction === 'final' ? 'Finalizing...' : 'Generate Final Version'}
        </button>
      </div>
      
      {/* --- Advanced Controls --- */}
      <div className="border-t border-gray-200/60 pt-3 mt-1">
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 font-medium text-sm text-gray-500 hover:text-gray-800 transition-colors w-full text-left p-1 rounded"
          aria-expanded={showAdvanced}
        >
          <SlidersIcon className="w-4 h-4"/>
          Advanced AI Controls
          <ChevronDownIcon className={`w-4 h-4 ml-auto transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>
        {showAdvanced && (
          <div className="mt-4 animate-fade-in-up">
            <div className="space-y-2">
              <label htmlFor="temperature" className="block text-xs font-semibold text-gray-600">
                Creativity (Temperature): <span className="font-bold text-orange-600">{temperature.toFixed(1)}</span>
              </label>
              <input id="temperature" type="range" min="0" max="1" step="0.1" value={temperature} onChange={(e) => onTemperatureChange(parseFloat(e.target.value))} disabled={isLoading}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlBar;
