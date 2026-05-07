import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const Layout = ({ title, children }) => {
  return (
    <div className="flex min-h-screen bg-white font-inter">
      {/* Fixed Sidebar - width 68 matches Sidebar component */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-68 flex flex-col min-h-screen">
        <TopBar title={title} />
        
        <main className="p-10 flex-1 animate-in fade-in duration-500">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>

        <footer className="p-8 text-center border-t border-zinc-100 mt-auto bg-zinc-50/30">
          <div className="flex items-center justify-center space-x-6 opacity-40 grayscale">
             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900 leading-none">IntelliPlace System</span>
             <div className="w-1 h-1 rounded-full bg-zinc-400"></div>
             <span className="text-[10px] font-bold text-zinc-500 tracking-tight leading-none">&copy; {new Date().getFullYear()} Enterprise v1.2</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
