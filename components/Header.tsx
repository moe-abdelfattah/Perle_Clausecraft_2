import React from 'react';
import { PerleLogo } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/60 sticky top-0 z-20">
      <div className="container mx-auto px-4 md:px-8 py-3 flex items-center justify-center">
        <PerleLogo className="w-7 h-7 mr-3 text-orange-600"/>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          <span className="text-orange-600">Perle</span>
          <span className="font-light text-gray-600">Clausecraft</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;