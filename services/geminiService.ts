
import { GoogleGenAI } from "@google/genai";
import { FinancialEntry } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFinancials = async (
  industry: string,
  period: string,
  data: FinancialEntry[]
): Promise<string> => {
  const financialDataString = data
    .filter(entry => entry.category.trim() && entry.value.trim())
    .map(entry => `- ${entry.category}: $${Number(entry.value).toLocaleString()}`)
    .join('\n');

  if (!financialDataString) {
    throw new Error("No valid financial data provided.");
  }

  const prompt = `
    You are an expert financial analyst specializing in small business health.
    Analyze the following financial data for a small business in the "${industry}" industry, covering the ${period} period.
    Compare their metrics to typical industry standards and provide a comprehensive financial health assessment.

    Business Financial Data (${period}):
    ${financialDataString}

    Your assessment should include:
    1.  **Overall Summary:** A brief, high-level overview of the business's financial health (e.g., Excellent, Good, Fair, Needs Improvement).
    2.  **Key Strengths:** Identify areas where the business is performing well compared to industry benchmarks.
    3.  **Areas for Improvement:** Highlight categories that are lagging behind industry standards and could be potential risks.
    4.  **Actionable Recommendations:** Provide specific, practical advice on how the business can improve its financial health.
    5.  **Key Financial Ratios Analysis:** Based on the data provided, calculate and analyze at least two key financial ratios relevant to the specified industry (e.g., Gross Profit Margin, Net Profit Margin, Current Ratio, etc.). For each ratio:
        *   **Show the Formula:** Clearly state the formula used for the calculation.
        *   **Show the Calculation:** Display the calculation using the provided business data.
        *   **Explain the Significance:** Describe what this ratio measures and why it is important for a business in this industry.
        *   **Provide Industry Benchmark:** Compare the calculated ratio to a typical benchmark for the industry.
        *   **Interpret the Result:** Explain what the business's specific ratio indicates about its performance in detail.

    Format your response in clear, easy-to-understand language using Markdown. Use headings, bold text, and bullet points to structure the report. Ensure the response is well-formatted and professional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from AI. Please check your connection and API key.");
  }
};