
import React, { useState, useEffect } from 'react';
import FinancialInputForm from './components/FinancialInputForm';
import AnalysisResult from './components/AnalysisResult';
import HistorySidebar from './components/HistorySidebar';
import { analyzeFinancials } from './services/geminiService';
import type { FinancialEntry, HistoricalAnalysis } from './types';

interface HistoryIconProps {
  className?: string;
}

const HistoryIcon: React.FC<HistoryIconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Header = () => (
    <header className="text-center py-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
            AI Financial Health Analyzer
        </h1>
        <p className="mt-2 text-md md:text-lg text-slate-500 max-w-2xl mx-auto">
            Get an instant assessment of your small business's financial health against industry benchmarks.
        </p>
    </header>
);

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center space-y-4 my-16">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
        <p className="text-lg text-slate-600 font-semibold">Analyzing your financials...</p>
        <p className="text-sm text-slate-500">This may take a moment.</p>
    </div>
);

const App: React.FC = () => {
    const initialFinancialData: FinancialEntry[] = [
        { id: crypto.randomUUID(), category: 'Total Revenue', value: '500000' },
        { id: crypto.randomUUID(), category: 'Cost of Goods Sold (COGS)', value: '200000' },
        { id: crypto.randomUUID(), category: 'Operating Expenses', value: '150000' },
        { id: crypto.randomUUID(), category: 'Net Profit', value: '100000' },
    ];
    
    const [industry, setIndustry] = useState<string>('Local Coffee Shop');
    const [period, setPeriod] = useState<string>('Annual');
    const [financialData, setFinancialData] = useState<FinancialEntry[]>(initialFinancialData);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<HistoricalAnalysis[]>([]);
    const [isHistoryVisible, setIsHistoryVisible] = useState(false);

    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem('financialAnalysisHistory');
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
        } catch (e) {
            console.error("Failed to parse history from localStorage", e);
            localStorage.removeItem('financialAnalysisHistory');
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('financialAnalysisHistory', JSON.stringify(history));
        } catch (e) {
            console.error("Failed to save history to localStorage", e);
        }
    }, [history]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const result = await analyzeFinancials(industry, period, financialData);
            setAnalysisResult(result);

            const newHistoryEntry: HistoricalAnalysis = {
                id: crypto.randomUUID(),
                timestamp: Date.now(),
                industry,
                period,
                financialData: JSON.parse(JSON.stringify(financialData)),
                result,
            };
            setHistory(prevHistory => [newHistoryEntry, ...prevHistory]);

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setIndustry('Local Coffee Shop');
        setPeriod('Annual');
        setFinancialData(initialFinancialData);
        setAnalysisResult(null);
        setError(null);
        setIsLoading(false);
    };

    const handleSelectHistory = (analysis: HistoricalAnalysis) => {
        setIndustry(analysis.industry);
        setPeriod(analysis.period);
        setFinancialData(analysis.financialData);
        setAnalysisResult(analysis.result);
        setError(null);
        setIsLoading(false);
        setIsHistoryVisible(false);
    };

    const handleClearHistory = () => {
        if (window.confirm("Are you sure you want to clear all analysis history? This action cannot be undone.")) {
            setHistory([]);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
                <Header />
                
                <div className="flex justify-end mb-4">
                    <button 
                        onClick={() => setIsHistoryVisible(true)}
                        className="flex items-center space-x-2 bg-white border border-slate-300 text-slate-600 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
                        aria-label="View analysis history"
                    >
                        <HistoryIcon className="h-5 w-5" />
                        <span className="hidden sm:inline">History</span>
                    </button>
                </div>
                
                <div>
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg" role="alert">
                            <p className="font-bold">Error</p>
                            <p>{error}</p>
                        </div>
                    )}

                    {!analysisResult && !isLoading && (
                        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200">
                           <FinancialInputForm
                                industry={industry}
                                setIndustry={setIndustry}
                                period={period}
                                setPeriod={setPeriod}
                                financialData={financialData}
                                setFinancialData={setFinancialData}
                                onSubmit={handleSubmit}
                                isLoading={isLoading}
                            />
                        </div>
                    )}
                    
                    {isLoading && <LoadingSpinner />}

                    {analysisResult && !isLoading && (
                        <AnalysisResult result={analysisResult} onReset={handleReset} />
                    )}
                </div>
            </main>
            <footer className="text-center py-6 text-sm text-slate-400">
                <p>&copy; {new Date().getFullYear()} Financial Health Analyzer. Powered by AI.</p>
            </footer>
            <HistorySidebar
                isVisible={isHistoryVisible}
                history={history}
                onSelect={handleSelectHistory}
                onClear={handleClearHistory}
                onClose={() => setIsHistoryVisible(false)}
            />
        </div>
    );
};

export default App;
