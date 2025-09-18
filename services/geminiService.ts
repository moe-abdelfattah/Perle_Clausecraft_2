
import { GoogleGenAI } from "@google/genai";
import { CONTRACT_GENERATION_PROMPT, CONTRACT_AMENDMENT_PROMPT, DYNAMIC_FORMATTING_INSTRUCTIONS } from '../constants';

async function callGemini(prompt: object, model: string): Promise<string> {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    throw new Error("API configuration is missing. Please contact support.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: model,
        contents: JSON.stringify(prompt),
    });
    
    const text = response.text;

    if (!text) {
        if (response.promptFeedback?.blockReason) {
             const reason = response.promptFeedback.blockReason;
             const message = `The request was blocked for safety reasons: ${reason}. Please contact support if you believe this is an error.`;
             throw new Error(message);
        }
        throw new Error("The AI returned an empty response. This might be due to content safety filters or a temporary service issue. Please try again.");
    }
    
    return text;
  } catch (error) {
    console.error("Error during Gemini API call:", error);
    
    let errorMessage = "An unexpected error occurred while communicating with the AI. Please try again.";

    if (error instanceof Error) {
        // Re-throw specific, user-facing errors
        if (error.message.startsWith("The request was blocked") || error.message.startsWith("The AI returned an empty response") || error.message.startsWith("API configuration is missing")) {
            throw error;
        }
        
        const lowerCaseMessage = error.message.toLowerCase();
        
        if (lowerCaseMessage.includes('api key not valid')) {
            errorMessage = "Authentication failed due to an invalid API Key. Please notify the administrator.";
        } else if (lowerCaseMessage.includes('429') || lowerCaseMessage.includes('rate limit')) {
            errorMessage = "The service is experiencing high demand. Please wait a moment and try again.";
        } else if (lowerCaseMessage.includes('fetch failed') || lowerCaseMessage.includes('network error')) {
            errorMessage = "A network error occurred. Please check your internet connection and try again.";
        }
    }
    
    throw new Error(errorMessage);
  }
}

export async function generateContract(model: string): Promise<string> {
    // --- DYNAMIC PROMPT INJECTION ---
    // 1. Create a deep copy of the base prompt to avoid mutation.
    const dynamicPrompt = JSON.parse(JSON.stringify(CONTRACT_GENERATION_PROMPT));

    // 2. Select a random formatting instruction.
    const randomIndex = Math.floor(Math.random() * DYNAMIC_FORMATTING_INSTRUCTIONS.length);
    const randomInstruction = DYNAMIC_FORMATTING_INSTRUCTIONS[randomIndex];

    // 3. Inject the dynamic instruction into the core directives.
    dynamicPrompt.instructions.coreDirectives.push(randomInstruction);
    
    // 4. Call the AI with the modified, unique prompt.
    return callGemini(dynamicPrompt, model);
}

export async function generateAmendedContract(originalContractText: string, model: string): Promise<string> {
    const fullPrompt = {
        ...CONTRACT_AMENDMENT_PROMPT,
        input: {
            ...CONTRACT_AMENDMENT_PROMPT.input,
            originalContractText: originalContractText
        }
    };
    return callGemini(fullPrompt, model);
}