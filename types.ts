
export interface FinancialEntry {
  id: string;
  category: string;
  value: string;
}

export interface HistoricalAnalysis {
  id:string;
  timestamp: number;
  industry: string;
  period: string;
  financialData: FinancialEntry[];
  result: string;
}
