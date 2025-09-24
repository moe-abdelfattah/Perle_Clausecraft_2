import React, { useState, useEffect, useRef, useCallback } from 'react';

const PREFIXES = ['[SYNC]', '[INIT]', '[AUTH]', '[EXEC]', '[QUERY]', '[RENDER]', '[GC]', '[COMPRESS]'];
const MODULES = ['CORE_SYNTHESIZER', 'LEGAL_ONTOLOGY_SA', 'DATA_MATRIX', 'ENCRYPTION_LAYER', 'QUANTUM_PROCESSOR', 'SIGNATURE_MODULE', 'ANNEX_GENERATOR', 'NLP_SUBSYSTEM'];
const ACTIONS = ['OK', 'SYNCING...', 'ALLOCATING_RESOURCES', 'DECRYPTING_PAYLOAD', 'COMPLETED', 'HASHING_BLOCK...', 'VERIFIED', 'QUERYING...'];
const HEX = '0123456789ABCDEF';

const generateRandomHex = (length: number) => {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += HEX[Math.floor(Math.random() * HEX.length)];
    }
    return result;
};

const generateRandomLine = () => {
    const r = Math.random();
    if (r < 0.4) {
        const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
        const module = MODULES[Math.floor(Math.random() * MODULES.length)];
        const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
        return `${prefix} ${module} :: ${action}`;
    } else if (r < 0.7) {
        return `> Transaction ${generateRandomHex(8)}-${generateRandomHex(4)}... ${(Math.random() * 200).toFixed(2)}ms`;
    } else if (r < 0.9) {
        return `// Processing data chunk 0x${generateRandomHex(12)}`;
    } else {
        return `...SYSTEM CHECK...${Math.random() > 0.8 ? 'ERROR_CORRECTED' : 'OK'}`;
    }
};


const GeneratingCodeDisplay: React.FC = () => {
    const [visibleLines, setVisibleLines] = useState<string[]>([]);
    const intervalRef = useRef<number | null>(null);
    const endOfLogRef = useRef<HTMLDivElement>(null);

    const startGenerator = useCallback(() => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
        }
        setVisibleLines([]); // Clear previous log
        intervalRef.current = window.setInterval(() => {
            setVisibleLines(prevLines => {
                const newLines = [...prevLines, generateRandomLine()];
                // Keep the log from getting excessively long
                if (newLines.length > 50) {
                    return newLines.slice(newLines.length - 50);
                }
                return newLines;
            });
        }, 200); // Add a new line every 200ms
    }, []);

    const stopGenerator = useCallback(() => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        startGenerator();
        return () => stopGenerator();
    }, [startGenerator, stopGenerator]);

    useEffect(() => {
        endOfLogRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [visibleLines]);

    return (
        <div className="absolute inset-0 bg-black/30 p-4 overflow-y-auto custom-scrollbar font-mono text-xs text-gray-400 text-left">
            {visibleLines.map((line, index) => (
                <p key={index} className="animate-fade-in whitespace-pre-wrap leading-relaxed">
                    <span className="text-[var(--accent-color)]/70 mr-2">{`> `}</span>
                    {line}
                </p>
            ))}
            <div ref={endOfLogRef} />
        </div>
    );
};

export default GeneratingCodeDisplay;