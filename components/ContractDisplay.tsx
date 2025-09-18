
import React, { forwardRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface ContractDisplayProps {
  markdownContent: string;
  previousMarkdownContent?: string | null;
  versionNumber: number;
}

const ContractDisplay = forwardRef<HTMLDivElement, ContractDisplayProps>(({ markdownContent, previousMarkdownContent, versionNumber }, ref) => {
  
  const showDiff = versionNumber > 1 && !!previousMarkdownContent;

  const contentToRender = useMemo(() => {
    if (!showDiff || !previousMarkdownContent) {
      return markdownContent;
    }

    const jsdiff = (window as any).Diff;
    if (!jsdiff) {
      console.error("jsdiff library not found on window object.");
      return markdownContent; // Fallback to showing current content without diff
    }
    
    const diff = jsdiff.diffWordsWithSpace(previousMarkdownContent, markdownContent);
    
    const htmlString = diff.map((part: { value: string; added?: boolean; removed?: boolean; }) => {
      if (part.added) {
        return `<ins>${part.value}</ins>`;
      }
      if (part.removed) {
        return `<del>${part.value}</del>`;
      }
      return part.value; // Unchanged part
    }).join('');
    
    return htmlString;

  }, [markdownContent, previousMarkdownContent, showDiff]);
  
  return (
    <div ref={ref} className="max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar relative">
       {showDiff && (
        <div className="diff-legend mb-4 p-2 bg-white/80 backdrop-blur-sm rounded-md text-sm sticky top-0 z-10 border-b border-gray-200 flex items-center justify-center gap-4">
          <span className="font-semibold text-gray-700">Changes from previous version:</span>
          <div className="flex items-center gap-2">
             <span className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(255, 165, 0, 0.3)' }}></span>
             <span className="text-gray-600">Added</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(235, 100, 55, 0.2)' }}></span>
            <span className="text-gray-600">Removed</span>
          </div>
        </div>
      )}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({...props}) => <h1 className="text-3xl md:text-4xl font-bold mt-8 mb-6 pb-3 border-b-2 border-gray-200 text-gray-900" {...props} />,
          h2: ({...props}) => <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-4 pb-2 border-b border-gray-200 text-gray-900" {...props} />,
          h3: ({...props}) => <h3 className="text-xl md:text-2xl font-bold mt-6 mb-3 text-gray-800" {...props} />,
          p: ({...props}) => <p className="mb-6 text-lg leading-loose text-gray-600" {...props} />,
          ul: ({...props}) => <ul className="list-disc list-outside mb-6 pr-8 space-y-2 text-lg text-gray-600" {...props} />,
          ol: ({...props}) => <ol className="list-decimal list-outside mb-6 pr-8 space-y-2 text-lg text-gray-600" {...props} />,
          li: ({...props}) => <li className="pl-2" {...props} />,
          strong: ({...props}) => <strong className="font-semibold text-gray-800" {...props} />,
        }}
      >
        {contentToRender}
      </ReactMarkdown>
    </div>
  );
});

export default ContractDisplay;