
import { GoogleGenAI } from "@google/genai";
import { FinancialEntry } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFinancials = async (
  industry: string,
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
    Analyze the following financial data for a small business in the "${industry}" industry.
    Compare their metrics to typical industry standards and provide a comprehensive financial health assessment.

    Business Financial Data:
    ${financialDataString}

    Your assessment should include:
    1.  **Overall Summary:** A brief, high-level overview of the business's financial health (e.g., Excellent, Good, Fair, Needs Improvement).
    2.  **Key Strengths:** Identify areas where the business is performing well compared to industry benchmarks.
    3.  **Areas for Improvement:** Highlight categories that are lagging behind industry standards and could be potential risks.
    4.  **Actionable Recommendations:** Provide specific, practical advice on how the business can improve its financial health.
    5.  **Important Ratios:** If possible with the data provided, calculate and explain a few key financial ratios relevant to the industry.

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
