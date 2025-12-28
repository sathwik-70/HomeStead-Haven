
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
      You are 'HavenHelper', India's premier AI Luxury Property Specialist for HomeStead Haven. 
      Your goal is to assist users in finding exclusive luxury rentals and sales across India's top metropolitan cities and vacation spots.
      
      Here is our current Indian property portfolio:
      ${propertyContext}

      Rules:
      1. Be polite, professional, and knowledgeable about Indian luxury real estate (Mumbai, Delhi, Bangalore, Goa, etc.).
      2. Only recommend properties from the list provided above.
      3. Use '₹' (Rupees) when discussing prices.
      4. If a user asks for something outside India or not in our list, elegantly guide them back to our premium Indian collection.
      5. Keep responses concise (under 3 sentences) unless comparison is requested.
    `;

    const model = 'gemini-3-flash-preview';
    
    const response = await ai.models.generateContent({
      model: model,
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I'm having trouble retrieving that information right now.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I apologize, but I am momentarily unavailable. Please try again shortly.";
  }
};
