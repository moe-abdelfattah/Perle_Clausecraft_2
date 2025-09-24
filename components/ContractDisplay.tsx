import React, { forwardRef, useMemo, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface ContractDisplayProps {
  title: string;
  markdownContent: string;
  previousMarkdownContent?: string | null;
  versionNumber: number;
}

const signatureColors = [
  '#00E5FF', // Neon Blue
  '#818cf8', // indigo-400
  '#f472b6', // pink-400
  '#a78bfa', // violet-400
  '#4ade80', // green-400
  '#fbbf24', // amber-400
];

const signatureFonts = [
  'font-signature-aref',
  'font-signature-lateef',
  'font-signature-scheherazade',
];


const ContractDisplay = forwardRef<HTMLDivElement, ContractDisplayProps>(({ title, markdownContent, previousMarkdownContent, versionNumber }, ref) => {
  
  const showDiff = versionNumber > 1 && !!previousMarkdownContent;
  const signatureIndexRef = useRef(0);

  const signatureStyles = useMemo(() => {
    const font = signatureFonts[Math.floor(Math.random() * signatureFonts.length)];
    
    // New, more robust color selection logic to guarantee two different colors.
    const colorPalette = [...signatureColors];
    const firstColorIndex = Math.floor(Math.random() * colorPalette.length);
    const firstColor = colorPalette.splice(firstColorIndex, 1)[0]; // Select and remove the first color
    const secondColorIndex = Math.floor(Math.random() * colorPalette.length); // Select from the remaining
    const secondColor = colorPalette[secondColorIndex];
    
    const colors = [firstColor, secondColor];
    
    return { font, colors };
  }, [markdownContent]);

  const tableHeaderColor = useMemo(() => {
    const headerColors = [
      'bg-gray-800/20', 'bg-gray-900/30',
      'bg-cyan-950/40', 'bg-cyan-900/30',
      'bg-teal-950/40', 'bg-teal-900/30',
      'bg-slate-900/40',
    ];
    return headerColors[Math.floor(Math.random() * headerColors.length)];
  }, [markdownContent]);

  useEffect(() => {
    signatureIndexRef.current = 0;
  }, [markdownContent]);

  const contentToRender = useMemo(() => {
    if (!showDiff || !previousMarkdownContent) {
      return markdownContent;
    }

    const jsdiff = (window as any).Diff;
    
    if (!jsdiff) {
      console.error("jsdiff library not found on window object.");
      return markdownContent; // Fallback
    }
    
    const diff = jsdiff.diffWordsWithSpace(previousMarkdownContent, markdownContent);
    
    const htmlString = diff.map((part: { value: string; added?: boolean; removed?: boolean; }) => {
      // The value here is already decoded, so we just need to handle diff tags
      const sanitizedValue = part.value.replace(/<ins>|<\/ins>|<del>|<\/del>/g, '');
      if (part.added) {
        return `<ins>${sanitizedValue}</ins>`;
      }
      if (part.removed) {
        return `<del>${sanitizedValue}</del>`;
      }
      return sanitizedValue;
    }).join('');
    
    return htmlString;

  }, [markdownContent, previousMarkdownContent, showDiff]);
  
  return (
    <div ref={ref} dir="rtl" lang="ar" className="printable-content font-arabic max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar relative prose prose-lg prose-rtl max-w-none prose-invert">
       <h1 className="text-3xl font-bold mb-6 pb-4 border-b border-gray-700 text-right">{title}</h1>
       {showDiff && (
        <div className="diff-legend mb-4 p-2 bg-black/60 backdrop-blur-sm rounded-sm text-xs sticky top-0 z-10 border border-[var(--border-color)] flex items-center justify-center gap-4">
          <span className="font-semibold text-gray-400 uppercase tracking-wider">Legend:</span>
          <div className="flex items-center gap-1.5">
             <span className="w-3 h-3" style={{ backgroundColor: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.3)' }}></span>
             <span className="text-gray-400">Added</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3" style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)' }}></span>
            <span className="text-gray-400">Removed</span>
          </div>
        </div>
      )}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-6 pb-4 border-b border-gray-700 text-right" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mt-8 mb-4 pb-2 border-b border-gray-800 text-right text-[var(--accent-color)]" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-6 mb-3 text-right" {...props} />,
          p: ({node, ...props}) => <p className="mb-5 text-base leading-relaxed text-right" {...props} />,
          strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
          em: ({node, ...props}) => {
              const color = signatureStyles.colors[signatureIndexRef.current % 2];
              signatureIndexRef.current += 1;
              return (
                  <em 
                      className={`${signatureStyles.font} not-italic text-2xl tracking-wide`}
                      style={{ color: color }} 
                      {...props} 
                  />
              );
          },
          blockquote: ({node, ...props}) => <blockquote className="pr-4 border-r-4 border-gray-700 italic text-right" {...props} />,
          table: ({node, ...props}) => <div className="overflow-x-auto my-6"><table className="min-w-full border border-gray-700 text-sm" {...props} /></div>,
          thead: ({node, ...props}) => <thead className={tableHeaderColor} {...props} />,
          th: ({node, ...props}) => <th className="p-3 font-semibold text-right border border-gray-700 text-gray-200 text-right" {...props} />,
          td: ({node, ...props}) => <td className="p-3 border border-gray-700 text-right" {...props} />,
        }}
      >
        {contentToRender}
      </ReactMarkdown>
    </div>
  );
});

export default ContractDisplay;