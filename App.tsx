
import React, { useState } from 'react';
import FinancialInputForm from './components/FinancialInputForm';
import AnalysisResult from './components/AnalysisResult';
import { analyzeFinancials } from './services/geminiService';
import type { FinancialEntry } from './types';

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
    const [financialData, setFinancialData] = useState<FinancialEntry[]>(initialFinancialData);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const result = await analyzeFinancials(industry, financialData);
            setAnalysisResult(result);
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
        setFinancialData(initialFinancialData);
        setAnalysisResult(null);
        setError(null);
        setIsLoading(false);
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
                <Header />
                
                <div className="mt-8">
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
        </div>
    );
};

export default App;
