import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function analyzeVitals(vitals: any) {
    if (!apiKey) {
        console.warn("Gemini API Key is missing");
        return "AI analysis unavailable (Missing API Key)";
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `
      Analyze these patient vitals and provide a short, urgent health assessment (max 2 sentences).
      Identify any risks of hypertensive crisis, hypoglycemia, or other emergencies.
      
      Vitals:
      - Heart Rate: ${vitals.heartRate.value} bpm
      - Blood Pressure: ${vitals.bp.systolic}/${vitals.bp.diastolic} mmHg
      - SpO2: ${vitals.spO2.value}%
      - Temperature: ${vitals.temperature.value}°C
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Analysis Failed:", error);
        return "AI analysis failed. Please consult a doctor immediately.";
    }
}
