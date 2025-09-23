import { GoogleGenAI } from "@google/genai";
import { 
    CONTRACT_GENERATION_PROMPT, 
    CONTRACT_AMENDMENT_PROMPT, 
    CONTRACT_FINALIZATION_PROMPT,
    CONTRACT_GENERATION_PROMPT_REVO,
    OFFICIAL_LETTER_GENERATION_PROMPT,
    OFFICIAL_LETTER_AMENDMENT_PROMPT,
    OFFICIAL_AGREEMENT_GENERATION_PROMPT,
    OFFICIAL_AGREEMENT_AMENDMENT_PROMPT,
    DOCUMENT_QUALITY_JUDGE_PROMPT,
    CORRECTIONAL_GENERATION_PROMPT
} from '../constants';
import { DocumentType, ContractPromptType } from "../state/types";

let aiInstance: GoogleGenAI | null = null;

function getAiInstance(): GoogleGenAI {
    if (!aiInstance) {
        if (!process.env.API_KEY) {
            console.error("API_KEY environment variable not set.");
            throw new Error("API configuration is missing. Please contact support.");
        }
        aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return aiInstance;
}

interface GenerationConfig {
    temperature?: number;
    maxOutputTokens?: number;
}

interface GeminiCallConfig extends GenerationConfig {
    responseMimeType?: "application/json" | "text/plain";
}

interface JudgeVerdict {
    decision: 'APPROVED' | 'REJECTED';
    reason: string;
    errors: { errorCode: string; description: string }[];
}


async function callGemini(prompt: object, model: string, generationConfig: GeminiCallConfig): Promise<string> {
  try {
    const ai = getAiInstance();

    const config: any = {};
    if (generationConfig.temperature !== undefined) {
        config.temperature = generationConfig.temperature;
    }
    if (generationConfig.maxOutputTokens !== undefined && generationConfig.maxOutputTokens > 0) {
        config.maxOutputTokens = generationConfig.maxOutputTokens;
        if (model.includes('flash')) {
            config.thinkingConfig = { thinkingBudget: Math.floor(generationConfig.maxOutputTokens / 2) };
        }
    }
    if (generationConfig.responseMimeType) {
        config.responseMimeType = generationConfig.responseMimeType;
    }
    
    const response = await ai.models.generateContent({
        model: model,
        contents: JSON.stringify(prompt),
        config: Object.keys(config).length > 0 ? config : undefined,
    });
    
    let text = response.text;

    if (!text) {
        if (response.promptFeedback?.blockReason) {
             const reason = response.promptFeedback.blockReason;
             const message = `The request was blocked for safety reasons: ${reason}. Please contact support if you believe this is an error.`;
             throw new Error(message);
        }
        throw new Error("The AI returned an empty response. This might be due to content safety filters or a temporary service issue. Please try again.");
    }
    
    // For non-JSON responses, clean up markdown code blocks if they exist.
    if (generationConfig.responseMimeType !== 'application/json') {
        const codeBlockRegex = /^```(?:\w+)?\n([\s\S]+?)\n```$/;
        const match = text.match(codeBlockRegex);
        if (match && match[1]) {
            text = match[1];
        }
    }
    
    return text.trim();

  } catch (error) {
    console.error("Error during Gemini API call:", error);
    
    let errorMessage = "An unexpected error occurred while communicating with the AI. Please try again.";

    if (error instanceof Error) {
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

async function judgeDocumentQuality(
    originalGenerationPrompt: object,
    generatedDocumentMarkdown: string,
    model: string,
    config: GenerationConfig
): Promise<JudgeVerdict> {
    const judgePrompt = {
        ...DOCUMENT_QUALITY_JUDGE_PROMPT,
        input: {
            originalGenerationPrompt,
            generatedDocumentMarkdown
        }
    };

    const judgeConfig: GeminiCallConfig = {
        ...config,
        temperature: 0.1, // Low temp for consistent judging
        responseMimeType: 'application/json'
    };

    const responseJson = await callGemini(judgePrompt, model, judgeConfig);
    try {
        return JSON.parse(responseJson) as JudgeVerdict;
    } catch (e) {
        console.error("Failed to parse AI Judge response:", e);
        throw new Error("The AI quality judge returned an invalid response. Could not verify document quality.");
    }
}

async function generateAndJudge(
    generationPrompt: object,
    model: string,
    config: GenerationConfig
): Promise<string> {
    const maxAttempts = 2; // Initial attempt + 1 retry
    let lastRejectionReason = "No specific reason provided.";
    let currentPrompt = generationPrompt;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const generatedMarkdown = await callGemini(currentPrompt, model, config);
        
        // The Judge always uses the *original* prompt as the ground truth for quality.
        const originalPromptForJudging = (attempt > 1 && (currentPrompt as any)?.input?.originalGenerationPrompt) 
            ? (currentPrompt as any).input.originalGenerationPrompt 
            : generationPrompt;

        try {
            const qualityCheck = await judgeDocumentQuality(originalPromptForJudging, generatedMarkdown, model, config);
            
            if (qualityCheck.decision === 'APPROVED') {
                return generatedMarkdown; // Success!
            } else {
                lastRejectionReason = qualityCheck.reason;
                console.warn(`AI Judge rejected document on attempt ${attempt}. Reason: ${lastRejectionReason}`);
                
                // If this is not the last attempt, prepare for retry with corrective feedback.
                if (attempt < maxAttempts) {
                    currentPrompt = {
                        ...CORRECTIONAL_GENERATION_PROMPT,
                        input: {
                            originalGenerationPrompt: originalPromptForJudging,
                            errorsToCorrect: {
                                rejectionReason: qualityCheck.reason,
                                specificErrors: qualityCheck.errors
                            }
                        }
                    };
                }
            }
        } catch (judgeError) {
             console.error(`AI Judge failed on attempt ${attempt}:`, judgeError);
             lastRejectionReason = (judgeError instanceof Error) ? judgeError.message : "Unknown judge failure.";
             // Break the loop if the judge fails, as we can't get feedback to improve.
             break;
        }
    }
    
    throw new Error(`AI quality check failed after ${maxAttempts} attempts. Last known issue: ${lastRejectionReason}`);
}


export async function generateDocument(
    model: string, 
    docType: DocumentType, 
    promptType: ContractPromptType, 
    config: GenerationConfig
): Promise<string> {
    let promptToSend;

    switch(docType) {
        case 'contract':
            promptToSend = promptType === 'dyno' ? CONTRACT_GENERATION_PROMPT : CONTRACT_GENERATION_PROMPT_REVO;
            break;
        case 'letter':
            promptToSend = OFFICIAL_LETTER_GENERATION_PROMPT;
            break;
        case 'agreement':
            promptToSend = OFFICIAL_AGREEMENT_GENERATION_PROMPT;
            break;
        default:
            throw new Error(`Unknown document type: ${docType}`);
    }
    
    return generateAndJudge(promptToSend, model, config);
}

export async function generateAmendedDocument(
    originalDocumentText: string, 
    model: string, 
    docType: DocumentType,
    config: GenerationConfig
): Promise<string> {
    let basePrompt;
    let inputVariableName;

    switch(docType) {
        case 'contract':
            basePrompt = CONTRACT_AMENDMENT_PROMPT;
            inputVariableName = 'originalContractText';
            break;
        case 'letter':
            basePrompt = OFFICIAL_LETTER_AMENDMENT_PROMPT;
            inputVariableName = 'originalLetterText';
            break;
        case 'agreement':
            basePrompt = OFFICIAL_AGREEMENT_AMENDMENT_PROMPT;
            inputVariableName = 'originalAgreementText';
            break;
        default:
            throw new Error(`Unknown document type for amendment: ${docType}`);
    }

    const fullPrompt = {
        ...basePrompt,
        input: {
            ...basePrompt.input,
            [inputVariableName]: originalDocumentText
        }
    };
    return generateAndJudge(fullPrompt, model, config);
}

export async function generateFinalDocument(
    draftDocumentText: string,
    model: string,
    docType: DocumentType,
    config: GenerationConfig
): Promise<string> {
    if (docType !== 'contract' && docType !== 'agreement') {
        throw new Error(`Document type "${docType}" does not support finalization.`);
    }

    const fullPrompt = {
        ...CONTRACT_FINALIZATION_PROMPT,
        input: {
            ...CONTRACT_FINALIZATION_PROMPT.input,
            draftContractText: draftDocumentText
        }
    };
    return generateAndJudge(fullPrompt, model, config);
}