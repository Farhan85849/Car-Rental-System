import { GoogleGenAI, Type, Schema } from '@google/genai';
import { Vehicle } from '../models/Vehicle';
import { Booking } from '../models/Booking';

let aiClient: GoogleGenAI | null = null;

const getAIClient = () => {
  if (!aiClient) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
};

export class AiService {
  async processSearch(query: string) {
    const ai = getAIClient();
    
    // First, fetch all active vehicles
    const vehicles = await Vehicle.find({ status: 'AVAILABLE' }).select('-images -features -description');
    
    // Use Gemini to understand the query and return matching vehicle IDs
    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        matchedVehicleIds: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of _id strings of vehicles that match the user's natural language query."
        },
        searchUnderstanding: {
          type: Type.STRING,
          description: "A short natural language explanation of what the user is looking for and why these vehicles were selected."
        }
      },
      required: ["matchedVehicleIds", "searchUnderstanding"]
    };

    const prompt = `
      User Query: "${query}"
      
      Available Vehicles Data (JSON format):
      ${JSON.stringify(vehicles)}
      
      Analyze the user's natural language query (e.g., "luxury suv under 25000", "cheap car for family of 5", "sports car") and match it against the provided vehicles.
      Consider attributes like brand, model, category, seats, and dailyPrice. Return the IDs of the best matching vehicles and a brief explanation.
    `;

    const result = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      }
    });

    if(!result.text) throw new Error("No response from AI");

    const parsed = JSON.parse(result.text);
    
    // Fetch full vehicle details for matches
    const matchedVehicles = await Vehicle.find({ _id: { $in: parsed.matchedVehicleIds } });
    
    return {
      vehicles: matchedVehicles,
      understanding: parsed.searchUnderstanding
    };
  }

  async processChat(message: string, history: any[] = []) {
    const ai = getAIClient();
    
    const chat = ai.chats.create({
      model: "gemini-3.1-flash-lite-preview",
      config: {
        systemInstruction: `You are the AI Smart Assistant for a luxury car rental platform in Pakistan. 
        You help users find cars, explain pricing, understand policies (insurance, daily rate, security deposit), and guide them.
        Keep your answers concise, professional, and friendly. 
        Prices are usually in PKR.
        Always format responses nicely using markdown.`,
      }
    });

    let contextHistory = '';
    if (history && history.length > 0) {
      contextHistory = history.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n');
    }

    const prompt = contextHistory 
      ? `Previous Conversation:\n${contextHistory}\n\nUser: ${message}\nAssistant:` 
      : message;

    const response = await chat.sendMessage({ message: prompt });
    
    return {
      message: response.text
    };
  }

  async processRecommendation(preferences: any) {
    const ai = getAIClient();
    const vehicles = await Vehicle.find({ status: 'AVAILABLE' }).select('-images -features -description');
    
    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        recommendedVehicleIds: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        reasoning: {
          type: Type.STRING,
        }
      },
      required: ["recommendedVehicleIds", "reasoning"]
    };

    const prompt = `
      User Preferences/Context: "${JSON.stringify(preferences)}"
      Available Vehicles Data: ${JSON.stringify(vehicles)}
      Recommend the top 3 best vehicles for this user based on their context (e.g. VIP, Luxury, Economy).
      Provide a brief reasoning why these are recommended.
    `;

    const result = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-preview',
      contents: prompt,
      config: { responseMimeType: 'application/json', responseSchema }
    });

    if(!result.text) throw new Error("No response from AI");
    const parsed = JSON.parse(result.text);
    const matchedVehicles = await Vehicle.find({ _id: { $in: parsed.recommendedVehicleIds } });
    
    return { vehicles: matchedVehicles, reasoning: parsed.reasoning };
  }

  async generateAdminAnalytics() {
    const ai = getAIClient();
    const bookings = await Booking.find().populate('vehicleId', 'brand model category dailyPrice');
    const vehicles = await Vehicle.find();
    
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;
    const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED').length;
    
    const prompt = `
      You are an AI Business Analyst for a Luxury Car Rental platform.
      Analyze this raw business data and provide a concise, 3-sentence professional business insight, highlighting trends or issues. Then provide 1 specific actionable recommendation.
      
      Data Summary:
      Total Vehicles: ${vehicles.length}
      Total Bookings: ${bookings.length}
      Total Revenue: PKR ${totalRevenue}
      Completed Bookings: ${completedBookings}
      Cancelled Bookings: ${cancelledBookings}
    `;

    const result = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-preview',
      contents: prompt
    });

    return { insight: result.text };
  }
}

export const aiService = new AiService();
