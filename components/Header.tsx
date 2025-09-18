
import React from 'react';
import { PerleLogo } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <PerleLogo className="w-8 h-8 mr-3 text-orange-600"/>
        <h1 className="text-3xl font-bold text-gray-900 tracking-wide">
          <span className="text-orange-600">Perle</span> <span className="font-light">Clausecraft</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;