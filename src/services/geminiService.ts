
import { GoogleGenAI } from "@google/genai";
import { MOCK_PROPERTIES } from '../constants';

export const getGeminiResponse = async (userQuery: string): Promise<string> => {
  // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const propertyContext = JSON.stringify(MOCK_PROPERTIES.map(p => ({
      title: p.title,
      location: p.location,
      price: `₹${p.price}`,
      type: p.type,
      features: p.amenities.join(', '),
      description: p.description
    })));

    const systemInstruction = `
      You are 'HavenHelper', the world-class AI Property Specialist for HomeStead Haven. 
      Your mission is to assist users in discovering premium rentals and sales across India's top cities (Mumbai, Delhi, Bangalore, Hyderabad, Goa, etc.).
      
      Active Portfolio:
      ${propertyContext}

      Response Guidelines:
      1. Tone: Professional, welcoming, and elite.
      2. Data: Strictly recommend properties from the provided portfolio.
      3. Pricing: Always use '₹' (Indian Rupees).
      4. Expertise: Provide specific highlights for each property (e.g., "sea view", "private dock").
      5. Constraint: Keep responses under 3 concise sentences unless a detailed comparison is requested.
      6. Contact: If users need technical support, tell them to contact the developer at sathwikpamu@gmail.com.
    `;

    const model = 'gemini-3-flash-preview';
    
    const response = await ai.models.generateContent({
      model: model,
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text || "I'm having trouble analyzing the market data right now. Please try again.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I apologize, but I am momentarily unavailable. Please contact sathwikpamu@gmail.com if the issue persists.";
  }
};
