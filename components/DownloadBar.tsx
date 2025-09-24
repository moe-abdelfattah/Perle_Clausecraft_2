import React from 'react';
import { PdfFileIcon, MarkdownFileIcon, TxtFileIcon, ArrowRightIcon } from './Icons';
import { playClickSound } from '../utils/uiUtils';

// --- TYPE DEFINITIONS --- //

type DownloadFormat = 'pdf' | 'md' | 'txt';

interface DownloadBarProps {
    onDownload: (format: DownloadFormat) => void;
}

// --- SUB-COMPONENTS --- //

const DownloadOption: React.FC<{
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
    description: string;
    ariaLabel: string;
}> = ({ onClick, icon, title, description, ariaLabel }) => (
    <button
        onClick={() => {
            playClickSound();
            onClick();
        }}
        className="group hud-panel interactive-hud-panel w-full text-left p-4 flex items-center gap-4"
        aria-label={ariaLabel}
    >
        <div className="corner-bottom-left"></div>
        <div className="corner-bottom-right"></div>
        {icon}
        <div className="flex-grow">
            <span className="font-semibold text-base text-gray-200 uppercase tracking-wider">{title}</span>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="text-gray-600 group-hover:text-[var(--accent-color)] transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100">
            <ArrowRightIcon className="w-5 h-5" />
        </div>
    </button>
);


// --- MAIN COMPONENT --- //

const DownloadBar: React.FC<DownloadBarProps> = ({ onDownload }) => {
    return (
        <div className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DownloadOption
                    onClick={() => onDownload('pdf')}
                    icon={
                        <div className="flex-shrink-0 bg-red-900/30 p-3 border border-red-500/30 group-hover:bg-red-800/40 transition-colors duration-300">
                            <PdfFileIcon className="w-6 h-6 text-red-400" />
                        </div>
                    }
                    title="Print / Save as PDF"
                    description="[System Print Dialog]"
                    ariaLabel="Print or Save as PDF"
                />
                <DownloadOption
                    onClick={() => onDownload('md')}
                    icon={
                        <div className="flex-shrink-0 bg-gray-800/50 p-3 border border-gray-500/30 group-hover:bg-gray-700/50 transition-colors duration-300">
                            <MarkdownFileIcon className="w-6 h-6 text-gray-300" />
                        </div>
                    }
                    title="Markdown File"
                    description="[*.MD]"
                    ariaLabel="Download as Markdown"
                />
                <DownloadOption
                    onClick={() => onDownload('txt')}
                    icon={
                        <div className="flex-shrink-0 bg-blue-900/30 p-3 border border-blue-500/30 group-hover:bg-blue-800/40 transition-colors duration-300">
                            <TxtFileIcon className="w-6 h-6 text-blue-400" />
                        </div>
                    }
                    title="Plain Text"
                    description="[*.TXT]"
                    ariaLabel="Download as Plain Text"
                />
            </div>
        </div>
    );
};

export default DownloadBar;