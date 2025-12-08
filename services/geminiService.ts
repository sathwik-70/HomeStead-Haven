import { GoogleGenAI } from "@google/genai";
import { MOCK_PROPERTIES } from '../constants';

const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const getGeminiResponse = async (userQuery: string): Promise<string> => {
  if (!ai) {
    return "I'm sorry, I cannot connect to the AI service right now. Please check your API Key configuration.";
  }

  try {
    // We provide the property data as context to the model so it can act as a knowledgeable concierge.
    const propertyContext = JSON.stringify(MOCK_PROPERTIES.map(p => ({
      title: p.title,
      location: p.location,
      price: p.price,
      type: p.type,
      features: p.amenities.join(', '),
      description: p.description
    })));

    const systemInstruction = `
      You are 'HavenHelper', the premier AI Concierge for HomeStead Haven. 
      Your goal is to assist users in finding the perfect luxury rental property from our exclusive list.
      
      Here is our current property portfolio:
      ${propertyContext}

      Rules:
      1. Be polite, professional, and enthusiastic about luxury living.
      2. Only recommend properties from the list provided above.
      3. If a user asks for something we don't have, apologize elegantly and suggest the closest match.
      4. Keep responses concise (under 3 sentences) unless detailed comparison is asked.
      5. Emphasize the unique features (glass walls, views, amenities).
    `;

    const model = 'gemini-2.5-flash';
    
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