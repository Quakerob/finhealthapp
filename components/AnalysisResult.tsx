
import React from 'react';

interface AnalysisResultProps {
  result: string;
  onReset: () => void;
}

// Simple Markdown-like text to JSX parser
const ResultRenderer: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');

  return (
    <div className="prose prose-slate max-w-none">
      {lines.map((line, index) => {
        line = line.trim();
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-lg font-semibold text-slate-700 mt-4 mb-2">{line.substring(4)}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-xl font-bold text-slate-800 mt-6 mb-3 border-b pb-2">{line.substring(3)}</h2>;
        }
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-2xl font-extrabold text-slate-900 mt-2 mb-4">{line.substring(2)}</h1>;
        }
        if (line.startsWith('* ') || line.startsWith('- ')) {
           // Handle bold text within list items
           const parts = line.substring(2).split('**');
           const renderedParts = parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part);
           return <li key={index} className="ml-5 list-disc my-1">{renderedParts}</li>;
        }
        if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') || line.startsWith('5. ')) {
          const parts = line.substring(3).split('**');
          const renderedParts = parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part);
          return <li key={index} className="ml-5 list-decimal my-1">{renderedParts}</li>;
        }
        if (line === '') {
          return <br key={index} />;
        }
         // Handle bold text in paragraphs
        const parts = line.split('**');
        const renderedParts = parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-semibold text-slate-800">{part}</strong> : part);

        return <p key={index} className="text-slate-600 leading-relaxed">{renderedParts}</p>;
      })}
    </div>
  );
};


const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onReset }) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 animate-fade-in-up">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">Financial Health Assessment</h2>
      
      <div className="bg-slate-50 p-4 sm:p-6 rounded-xl border border-slate-200/80">
        <ResultRenderer content={result} />
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onReset}
          className="bg-indigo-100 text-indigo-700 font-semibold py-3 px-8 rounded-lg hover:bg-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all duration-300"
        >
          Start New Analysis
        </button>
      </div>
    </div>
  );
};

export default AnalysisResult;
