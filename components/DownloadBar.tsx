
import React from 'react';
import { DownloadIcon } from './Icons';

// --- TYPE DEFINITIONS --- //

type DownloadFormat = 'pdf' | 'md' | 'txt';

interface DownloadBarProps {
    onDownload: (format: DownloadFormat) => void;
}

// --- STYLING CONSTANTS --- //

const baseButtonClasses = "text-white font-bold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 py-2 px-4";
const gradientButtonClasses = "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 focus:ring-orange-500/50";
const secondaryButtonClasses = "bg-gray-700 hover:bg-gray-800 focus:ring-gray-500/50";

// --- COMPONENT --- //

const DownloadBar: React.FC<DownloadBarProps> = ({ onDownload }) => {
    return (
        <div className="flex justify-end items-center mb-4 gap-4 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <DownloadIcon className="w-6 h-6 text-gray-500"/>
            <span className="font-semibold text-gray-700">Download:</span>
            <button
                onClick={() => onDownload('pdf')}
                className={`${baseButtonClasses} ${gradientButtonClasses}`}
                aria-label="Download as PDF"
            >
                PDF
            </button>
            <button
                onClick={() => onDownload('md')}
                className={`${baseButtonClasses} ${secondaryButtonClasses}`}
                aria-label="Download as Markdown"
            >
                MD
            </button>
             <button
                onClick={() => onDownload('txt')}
                className={`${baseButtonClasses} ${secondaryButtonClasses}`}
                aria-label="Download as Plain Text"
            >
                TXT
            </button>
        </div>
    );
};

export default DownloadBar;