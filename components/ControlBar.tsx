
import React from 'react';

// --- TYPE DEFINITIONS --- //

interface Model {
  id: string;
  name: string;
}

interface ControlBarProps {
  isLoading: boolean;
  loadingAction: 'new' | 'version' | null;
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  onGenerateNew: () => void;
  onGenerateVersion: () => void;
  canGenerateVersion: boolean;
}

// --- CONSTANTS --- //

const models: Model[] = [
  { id: 'gemini-2.5-pro', name: 'Perle-Pro (Advanced) Recommended' },
  { id: 'gemini-2.5-flash', name: 'Perle-Flash' }
];

const baseButtonClasses = "text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4";
const disabledButtonClasses = "disabled:bg-gray-400 disabled:text-white/70 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none";
const gradientButtonClasses = "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 focus:ring-orange-500/50";
const actionButtonClasses = `${baseButtonClasses} ${disabledButtonClasses} ${gradientButtonClasses}`;

// --- COMPONENT --- //

const ControlBar: React.FC<ControlBarProps> = ({
  isLoading,
  loadingAction,
  selectedModel,
  onModelChange,
  onGenerateNew,
  onGenerateVersion,
  canGenerateVersion,
}) => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-4 mb-8 p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2">
        <label htmlFor="model-select" className="font-semibold text-gray-700 whitespace-nowrap">Select Prompt</label>
        <select
          id="model-select"
          value={selectedModel}
          onChange={(e) => onModelChange(e.target.value)}
          disabled={isLoading}
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 p-2.5 shadow-sm disabled:bg-gray-200"
        >
          {models.map(model => (
            <option key={model.id} value={model.id}>{model.name}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={onGenerateNew}
          disabled={isLoading}
          className={actionButtonClasses}
        >
          {loadingAction === 'new' ? '...Generating' : 'Generate New Contract'}
        </button>
        <button
          onClick={onGenerateVersion}
          disabled={isLoading || !canGenerateVersion}
          className={actionButtonClasses}
        >
          {loadingAction === 'version' ? '...Versioning' : 'Generate New Version'}
        </button>
      </div>
    </div>
  );
};

export default ControlBar;