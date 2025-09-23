import React from 'react';
import { PdfFileIcon, MarkdownFileIcon, TxtFileIcon, ArrowRightIcon } from './Icons';

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
        onClick={onClick}
        className="group w-full text-left p-4 rounded-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 bg-white border border-gray-200/60 hover:shadow-lg hover:border-orange-300/50 hover:-translate-y-1 flex items-center gap-4"
        aria-label={ariaLabel}
    >
        {icon}
        <div className="flex-grow">
            <span className="font-semibold text-base text-gray-800">{title}</span>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="text-gray-300 group-hover:text-orange-500 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100">
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
                        <div className="flex-shrink-0 bg-red-50 p-3 rounded-full group-hover:bg-red-100 transition-colors duration-300">
                            <PdfFileIcon className="w-6 h-6 text-red-600" />
                        </div>
                    }
                    title="PDF Document"
                    description="For sharing & printing"
                    ariaLabel="Download as PDF"
                />
                <DownloadOption
                    onClick={() => onDownload('md')}
                    icon={
                        <div className="flex-shrink-0 bg-gray-100 p-3 rounded-full group-hover:bg-gray-200 transition-colors duration-300">
                            <MarkdownFileIcon className="w-6 h-6 text-gray-700" />
                        </div>
                    }
                    title="Markdown File"
                    description="For editing & code"
                    ariaLabel="Download as Markdown"
                />
                <DownloadOption
                    onClick={() => onDownload('txt')}
                    icon={
                        <div className="flex-shrink-0 bg-blue-50 p-3 rounded-full group-hover:bg-blue-100 transition-colors duration-300">
                            <TxtFileIcon className="w-6 h-6 text-blue-600" />
                        </div>
                    }
                    title="Plain Text"
                    description="For max compatibility"
                    ariaLabel="Download as Plain Text"
                />
            </div>
        </div>
    );
};

export default DownloadBar;