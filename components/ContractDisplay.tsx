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
  '#0D47A1', // Dark Blue
  '#004D40', // Dark Green
  '#B71C1C', // Dark Red
  '#4A148C', // Dark Purple
  '#3E2723', // Dark Brown
  '#1A237E', // Indigo
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
      'bg-slate-100', 'bg-stone-100', 'bg-red-100', 'bg-orange-100', 
      'bg-amber-100', 'bg-yellow-100', 'bg-lime-100', 'bg-green-100', 
      'bg-emerald-100', 'bg-teal-100', 'bg-cyan-100', 'bg-sky-100', 
      'bg-blue-100', 'bg-indigo-100', 'bg-violet-100', 'bg-purple-100', 
      'bg-fuchsia-100', 'bg-pink-100', 'bg-rose-100'
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
    <div ref={ref} dir="rtl" lang="ar" className="font-arabic max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar relative prose prose-lg prose-rtl max-w-none">
       {showDiff && (
        <div className="diff-legend mb-4 p-2 bg-white/70 backdrop-blur-sm rounded-md text-xs sticky top-0 z-10 border border-gray-200/60 flex items-center justify-center gap-3 shadow-sm">
          <span className="font-semibold text-gray-600">Changes:</span>
          <div className="flex items-center gap-1.5">
             <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(249, 115, 22, 0.15)', border: '1px solid rgba(249, 115, 22, 0.3)' }}></span>
             <span className="text-gray-500">Added</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)' }}></span>
            <span className="text-gray-500">Removed</span>
          </div>
        </div>
      )}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-300 text-right" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 pb-2 border-b border-gray-200/80 text-right text-orange-700" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3 text-right" {...props} />,
          p: ({node, ...props}) => <p className="mb-5 text-base leading-relaxed text-gray-600 text-right" {...props} />,
          strong: ({node, ...props}) => <strong className="font-semibold text-gray-800" {...props} />,
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
          blockquote: ({node, ...props}) => <blockquote className="pr-4 border-r-4 border-gray-200 text-gray-500 italic text-right" {...props} />,
          table: ({node, ...props}) => <div className="overflow-x-auto my-6"><table className="min-w-full border border-gray-300 text-sm" {...props} /></div>,
          thead: ({node, ...props}) => <thead className={tableHeaderColor} {...props} />,
          th: ({node, ...props}) => <th className="p-3 font-semibold text-right border border-gray-300 text-gray-700 text-right" {...props} />,
          td: ({node, ...props}) => <td className="p-3 border border-gray-300 text-right" {...props} />,
        }}
      >
        {contentToRender}
      </ReactMarkdown>
    </div>
  );
});

export default ContractDisplay;