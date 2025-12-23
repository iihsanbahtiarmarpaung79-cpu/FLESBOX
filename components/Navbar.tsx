
import React, { useState } from 'react';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'subjects', label: 'Mapel' },
    { id: 'quiz', label: 'Kuis' },
    { id: 'classroom', label: 'Ruang Kelas' },
    { id: 'about', label: 'Tentang Kami' },
    { id: 'admin', label: 'Admin' }
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="bg-indigo-600 h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-3">F</div>
            <span className="text-2xl font-bold text-indigo-900 tracking-tight">FLESBOX</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-sm font-medium transition-colors ${
                  currentPage === item.id 
                    ? 'text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg' 
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50 px-3 py-2 rounded-lg'
                }`}
              >
                {item.label}
              </button>
            ))}
            <a 
              href="https://wa.me/6282277930100" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
            >
              Kontak Admin
            </a>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-500 hover:text-slate-600 focus:outline-none p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-6 space-y-1 shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                currentPage === item.id ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <a 
            href="https://wa.me/6282277930100"
            className="block w-full text-center mt-4 bg-indigo-600 text-white px-4 py-3 rounded-xl text-base font-semibold"
          >
            Kontak Admin
          </a>
        </div>
      )}
    </nav>
  );
};
