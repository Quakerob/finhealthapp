
import React from 'react';
import type { FinancialEntry } from '../types';

interface PlusIconProps {
  className?: string;
}

const PlusIcon: React.FC<PlusIconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

interface TrashIconProps {
    className?: string;
}

const TrashIcon: React.FC<TrashIconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);


interface FinancialInputFormProps {
  industry: string;
  setIndustry: (industry: string) => void;
  period: string;
  setPeriod: (period: string) => void;
  financialData: FinancialEntry[];
  setFinancialData: (data: FinancialEntry[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const FinancialInputForm: React.FC<FinancialInputFormProps> = ({
  industry,
  setIndustry,
  period,
  setPeriod,
  financialData,
  setFinancialData,
  onSubmit,
  isLoading,
}) => {
  const handleDataChange = (id: string, field: 'category' | 'value', value: string) => {
    const newData = financialData.map(entry =>
      entry.id === id ? { ...entry, [field]: value } : entry
    );
    setFinancialData(newData);
  };

  const addEntry = () => {
    setFinancialData([...financialData, { id: crypto.randomUUID(), category: '', value: '' }]);
  };

  const removeEntry = (id: string) => {
    if (financialData.length > 1) {
      setFinancialData(financialData.filter(entry => entry.id !== id));
    }
  };
  
  const timePeriods = ['Annual', 'Quarterly', 'Monthly'];

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-700 mb-2">1. Your Industry</h2>
        <p className="text-sm text-slate-500 mb-4">Specify your business industry for a more accurate analysis (e.g., "Restaurant", "Retail Clothing", "Landscaping Services").</p>
        <input
          type="text"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          placeholder="E.g., Coffee Shop"
          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          required
        />
      </div>
      
      <div>
        <h2 className="text-xl font-semibold text-slate-700 mb-2">2. Time Period</h2>
        <p className="text-sm text-slate-500 mb-4">Select the time frame this financial data represents.</p>
        <div className="flex space-x-2 rounded-lg bg-slate-100 p-1">
          {timePeriods.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`w-full font-medium py-2.5 text-sm leading-5 rounded-lg transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 focus:ring-indigo-500 ${
                period === p
                  ? 'bg-white text-indigo-700 shadow'
                  : 'text-slate-600 hover:bg-white/50 hover:text-indigo-600'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-700 mb-2">3. Financial Data</h2>
        <p className="text-sm text-slate-500 mb-4">Enter your key financial metrics for the selected period. Add as many categories as you need.</p>
        <div className="space-y-4">
          {financialData.map((entry, index) => (
            <div key={entry.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center animate-fade-in">
              <input
                type="text"
                value={entry.category}
                onChange={(e) => handleDataChange(entry.id, 'category', e.target.value)}
                placeholder="Category (e.g., Total Revenue)"
                className="md:col-span-6 w-full px-4 py-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                required
              />
               <div className="md:col-span-5 relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                 <input
                    type="number"
                    value={entry.value}
                    onChange={(e) => handleDataChange(entry.id, 'value', e.target.value)}
                    placeholder="Value"
                    className="w-full pl-7 pr-4 py-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    required
                    min="0"
                />
               </div>
              <div className="md:col-span-1 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => removeEntry(entry.id)}
                  className={`p-2 rounded-full transition-colors ${financialData.length > 1 ? 'text-slate-400 hover:bg-red-100 hover:text-red-500' : 'text-slate-300 cursor-not-allowed'}`}
                  disabled={financialData.length <= 1}
                  aria-label="Remove category"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addEntry}
            className="flex items-center space-x-2 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors py-2 px-3 rounded-lg hover:bg-indigo-50"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Category</span>
          </button>
        </div>
      </div>
      <div className="pt-4">
        <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center bg-indigo-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all duration-300 ease-in-out disabled:bg-indigo-400 disabled:cursor-not-allowed transform hover:scale-105"
        >
            Analyze Financial Health
        </button>
      </div>
    </form>
  );
};

export default FinancialInputForm;