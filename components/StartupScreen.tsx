import React, { useState, useEffect } from 'react';
import { PerleLogo } from './Icons';
import CodeMatrixBackground from './CodeMatrixBackground';
import { playClickSound } from '../utils/uiUtils';

const bootSequence = [
    'PERLE_OS BOOT SEQUENCE v3.1',
    'INITIALIZING AI COGNITIVE CORE...',
    'MOUNTING LEGAL ONTOLOGY LIBRARIES...',
    'VERIFYING PROMPT DIRECTIVE CACHE...',
    'CALIBRATING GENERATION MATRIX...',
    'BOOTING CLAUSECRAFT ENGINE...',
    'SYSTEM READY. AWAITING USER INPUT...',
];

interface StartupScreenProps {
    isExiting: boolean;
    onEnter: () => void;
}

const StartupScreen: React.FC<StartupScreenProps> = ({ isExiting, onEnter }) => {
    const [log, setLog] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        // Animate log messages
        const logInterval = setInterval(() => {
            setLog(prevLog => {
                if (prevLog.length < bootSequence.length) {
                    return [...prevLog, bootSequence[prevLog.length]];
                }
                clearInterval(logInterval);
                return prevLog;
            });
        }, 1200); // Slower, for a 10s feel

        // Animate progress bar over ~9.5 seconds
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + 100 / (9500 / 50); // Increased duration
                if (newProgress >= 100) {
                    clearInterval(progressInterval);
                    setIsComplete(true);
                    return 100;
                }
                return newProgress;
            });
        }, 50);

        return () => {
            clearInterval(logInterval);
            clearInterval(progressInterval);
        };
    }, []);

    return (
        <div className={`fixed inset-0 bg-black z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
            <CodeMatrixBackground />
            <div className="text-center animate-fade-in">
                <PerleLogo className="w-24 h-24 mx-auto text-[var(--accent-color)] mb-8" />
                <div className="w-96 max-w-full px-4">
                    <div className="h-48 font-mono text-sm text-left text-gray-400 overflow-hidden">
                        {log.map((line, index) => (
                            <p key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                                <span className="text-[var(--accent-color)] mr-2">{'>'}</span> {line}
                            </p>
                        ))}
                    </div>
                    <div className="w-full bg-black/50 rounded-sm h-2 mt-4 overflow-hidden border border-[var(--border-color)] relative p-0.5">
                        <div
                            className="bg-[var(--accent-color)] h-full transition-all duration-100 ease-linear"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="mt-8 h-12">
                        {isComplete && !isExiting && (
                            <button
                                onClick={() => {
                                    playClickSound();
                                    onEnter();
                                }}
                                className="btn-animated bg-[var(--accent-color)] text-black font-bold py-3 px-8 uppercase tracking-widest animate-fade-in"
                            >
                                Enter System
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartupScreen;