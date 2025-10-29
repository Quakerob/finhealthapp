
import React from 'react';
import type { HistoricalAnalysis } from '../types';

interface ClockIconProps { className?: string; }
const ClockIcon: React.FC<ClockIconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface TrashIconProps { className?: string; }
const TrashIcon: React.FC<TrashIconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

interface CloseIconProps { className?: string; }
const CloseIcon: React.FC<CloseIconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


interface HistorySidebarProps {
  isVisible: boolean;
  history: HistoricalAnalysis[];
  onSelect: (analysis: HistoricalAnalysis) => void;
  onClear: () => void;
  onClose: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isVisible,
  history,
  onSelect,
  onClear,
  onClose,
}) => {
  if (!isVisible) return null;

  return (
    <>
        <div 
            className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300" 
            onClick={onClose}
            aria-hidden="true"
        ></div>
        <aside className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex flex-col h-full">
                <header className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold text-slate-800">Analysis History</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100" aria-label="Close history">
                        <CloseIcon className="h-6 w-6 text-slate-600" />
                    </button>
                </header>

                <div className="flex-grow overflow-y-auto p-4">
                    {history.length > 0 ? (
                        <ul className="space-y-3">
                            {history.map(item => (
                                <li key={item.id}>
                                    <button 
                                        onClick={() => onSelect(item)} 
                                        className="w-full text-left p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-200 rounded-lg transition-all duration-200"
                                    >
                                        <p className="font-semibold text-slate-700">{item.industry}</p>
                                        <p className="text-sm text-slate-500 mt-1">{new Date(item.timestamp).toLocaleString()}</p>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-12">
                            <ClockIcon className="h-12 w-12 mx-auto text-slate-300" />
                            <p className="mt-4 text-slate-500">No history yet.</p>
                            <p className="text-sm text-slate-400">Your completed analyses will appear here.</p>
                        </div>
                    )}
                </div>

                {history.length > 0 && (
                    <footer className="p-4 border-t">
                        <button 
                            onClick={onClear} 
                            className="w-full flex items-center justify-center space-x-2 text-sm text-red-600 font-semibold hover:bg-red-50 py-3 px-4 rounded-lg transition-colors"
                        >
                            <TrashIcon className="h-5 w-5" />
                            <span>Clear All History</span>
                        </button>
                    </footer>
                )}
            </div>
        </aside>
    </>
  );
};

export default HistorySidebar;
