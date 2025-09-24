import React, { useState, useEffect } from 'react';
import { PerleLogo } from './Icons';

const Header: React.FC = () => {
  const [initializedText, setInitializedText] = useState('');
  const fullText = '> SYSTEM_STATUS::INITIALIZED';

  useEffect(() => {
    if (initializedText.length < fullText.length) {
      const timeoutId = setTimeout(() => {
        setInitializedText(fullText.slice(0, initializedText.length + 1));
      }, 75);
      return () => clearTimeout(timeoutId);
    }
  }, [initializedText, fullText]);

  return (
    <header className="bg-black/50 backdrop-blur-md border-b border-[var(--border-color)] sticky top-0 z-20">
      <div className="container mx-auto px-4 md:px-8 py-3 flex items-center justify-between relative h-14">
        {/* Left Side: System Status */}
        <div className="hidden md:flex items-center text-xs uppercase tracking-widest text-gray-500">
            <span className="text-[var(--accent-color)]">{initializedText}</span>
            <span className="w-2 h-3.5 border-r-2 animate-blink-caret ml-1"></span>
        </div>

        {/* Center: Logo and Title */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center">
             <PerleLogo className="w-7 h-7 mr-3 text-[var(--accent-color)]"/>
            <h1 className="text-2xl font-bold tracking-widest uppercase">
                <span className="text-[var(--accent-color)]">Perle</span>
                <span className="font-light text-gray-400">Clausecraft</span>
            </h1>
        </div>
       
        {/* Right Side: Online Status */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-[var(--accent-color)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-color)]"></span>
            </span>
            <span className="text-gray-400">Status: <span className="text-[var(--accent-color)] font-semibold">Online</span></span>
        </div>
      </div>
    </header>
  );
};

export default Header;