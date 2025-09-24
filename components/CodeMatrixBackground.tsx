import React, { useMemo } from 'react';

const generateRandomChars = (length: number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const generateCodeSnippet = () => {
    const snippets = [
        `0x${Math.random().toString(16).substr(2, 8).toUpperCase()}`,
        `// SYNCING NODE...`,
        `[STATUS: OK]`,
        `LOADING MODULE...`,
        `> ${generateRandomChars(Math.floor(Math.random() * 10) + 5)}`,
        `...`,
        `...`,
        `...`,
        `...`,
        `${(Math.random() * 100).toFixed(4)}ms`,
        `ACCESS GRANTED`,
        `DECRYPTING...`,
    ];
    return snippets[Math.floor(Math.random() * snippets.length)];
}

const CodeMatrixBackground: React.FC = () => {
    const columns = useMemo(() => {
        return Array.from({ length: 30 }).map((_, colIndex) => {
            const duration = Math.random() * 20 + 15; // 15-35s duration
            const delay = Math.random() * -20; // Start at different times
            const snippets = Array.from({ length: 40 }).map(() => generateCodeSnippet());
            return {
                id: colIndex,
                duration,
                delay,
                snippets,
            };
        });
    }, []);

    return (
        <div id="matrix-bg" className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
            <style>
                {`
                @keyframes fall {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100vh); }
                }
                .matrix-column {
                    position: absolute;
                    top: 0;
                    height: 100%;
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                    white-space: nowrap;
                    user-select: none;
                    animation-name: fall;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                    text-shadow: 0 0 5px var(--accent-color);
                }
                .matrix-char {
                  font-family: 'Roboto Mono', monospace;
                  color: var(--accent-color);
                  opacity: 0.1;
                }
                `}
            </style>
            {columns.map(col => (
                <div
                    key={col.id}
                    className="matrix-column"
                    style={{
                        left: `${(col.id / columns.length) * 100}%`,
                        animationDuration: `${col.duration}s`,
                        animationDelay: `${col.delay}s`,
                    }}
                >
                    {col.snippets.map((char, charIndex) => (
                        <span key={charIndex} className="matrix-char">
                            {char}
                        </span>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default CodeMatrixBackground;