import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { GoogleGenAI, Type } from "@google/genai";
import type { Script, Trend, EnhancedTopic, VideoDeconstruction, ViralScoreBreakdown } from '../../types';

// Schemas are identical to the old geminiService.ts file
const scriptResponseSchema = { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING, description: "A catchy, viral-style title for the video. Should be short and intriguing.", }, hook: { type: Type.STRING, description: "A 1-3 second hook to grab the viewer's attention immediately. This is the most crucial part.", }, script: { type: Type.STRING, description: "The full script, formatted with clear sections like '[SCENE]', 'VOICEOVER:', or 'ON-SCREEN TEXT:' for easy readability and production. Must include specific visual cues and action descriptions.", }, }, required: ["title", "hook", "script"], }, };
const singleScriptResponseSchema = { type: Type.OBJECT, properties: { title: { type: Type.STRING, description: "A catchy, viral-style title for the video, adapted for the new topic.", }, hook: { type: Type.STRING, description: "A 1-3 second hook for the new topic, preserving the style of the original hook.", }, script: { type: Type.STRING, description: "The full script for the new topic, preserving the structure, pacing, and formatting (including visual cues) of the original.", }, }, required: ["title", "hook", "script"], };
const viralityAnalysisSchema = { type: Type.OBJECT, properties: { overallScore: { type: Type.NUMBER, description: "A score from 1-100 for overall viral potential." }, hookAnalysis: { type: Type.STRING, description: "1-sentence analysis of the hook's strength and attention-grabbing power." }, pacingAnalysis: { type: Type.STRING, description: "1-sentence analysis of the script's pacing, flow, and ability to hold attention." }, valueAnalysis: { type: Type.STRING, description: "1-sentence analysis of the value (entertainment, education, emotion) delivered to the viewer." }, ctaAnalysis: { type: Type.STRING, description: "1-sentence analysis of the call-to-action's effectiveness and clarity." }, finalVerdict: { type: Type.STRING, description: "A concluding one-sentence rationale for the overall score, summarizing the script's strongest and weakest points." } }, required: ["overallScore", "hookAnalysis", "pacingAnalysis", "valueAnalysis", "ctaAnalysis", "finalVerdict"] };
const topicEnhancementSchema = { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { angle: { type: Type.STRING, description: "A specific, more viral-friendly angle for the original topic. It should spark curiosity, controversy, or a strong emotion." }, rationale: { type: Type.STRING, description: "A short, one-sentence explanation of why this angle is psychologically compelling for social media." } }, required: ["angle", "rationale"], } };

export const QUOTA_ERROR_MESSAGE = "API quota exceeded for the 'gemini-2.5-flash' model. Your Google Cloud project has paid limits, but they might not be applied to this specific model. Please go to the Quotas page in your Google Cloud Console, filter for the 'generativelanguage.googleapis.com' service, and request a quota increase for the 'gemini-2.5-flash' model.";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
    }

    if (!process.env.API_KEY) {
        return { statusCode: 500, body: JSON.stringify({ message: "API_KEY environment variable is not set on the server." }) };
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
        const { action, payload } = JSON.parse(event.body || '{}');

        switch (action) {
            case 'generateScripts': {
                const { topic, tone, lengthInSeconds, platforms } = payload;
                let platformInstruction = "for platforms like TikTok, Instagram Reels, and YouTube Shorts.";
                if (platforms && platforms.length > 0) {
                    const platformNames = platforms.map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join(', ');
                    platformInstruction = `specifically for ${platformNames}.`;
                }
                const prompt = `You are an expert viral video scriptwriter. Your goal is to create 5 unique video script ideas. The topic is: "${topic}". The desired tone is: "${tone}". The target video length is approximately ${lengthInSeconds} seconds. Tailor the scripts ${platformInstruction}. Follow a strict Hook, Pacing, On-Screen Text, Story, and CTA framework. The output must be a valid JSON array of script objects.`;
                const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt, config: { responseMimeType: "application/json", responseSchema: scriptResponseSchema, }, });
                const parsedScripts: Omit<Script, 'tone' | 'id'>[] = JSON.parse(response.text.trim());
                const scriptsWithToneAndId: Script[] = parsedScripts.map(script => ({ ...script, id: crypto.randomUUID(), tone: tone, }));
                return { statusCode: 200, body: JSON.stringify(scriptsWithToneAndId) };
            }
            case 'fetchTrendingTopics': {
                const { niche } = payload;
                const nichePrompt = niche ? `Focus specifically on trends relevant to the "${niche}" niche.` : `Find trends across a variety of popular niches.`;
                const prompt = `You are a viral trend analyst. Use Google Search to identify 4-5 emerging, niche topics with high viral potential on TikTok and YouTube Shorts RIGHT NOW. ${nichePrompt} For each trend, provide topic, summary, trendScore, audienceInsight, suggestedAngles, competition, and trendDirection. Format the entire response as a single, valid JSON array of objects.`;
                const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt, config: { tools: [{ googleSearch: {} }] } });
                const text = response.text.trim();
                const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => chunk.web).filter((source): source is { uri: string; title: string } => !!source?.uri) ?? [];
                const jsonMatch = text.match(/```(?:json)?([\s\S]*?)```/);
                const jsonString = jsonMatch ? jsonMatch[1].trim() : text;
                const trends: Trend[] = JSON.parse(jsonString);
                return { statusCode: 200, body: JSON.stringify({ trends, sources }) };
            }
            case 'analyzeScriptVirality': {
                const { script } = payload;
                const prompt = `Analyze the following script's viral potential: Title: ${script.title}, Hook: ${script.hook}, Script: ${script.script}. Provide a JSON object with a detailed analysis based on the provided schema.`;
                const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt, config: { responseMimeType: "application/json", responseSchema: viralityAnalysisSchema } });
                const analysis: ViralScoreBreakdown = JSON.parse(response.text.trim());
                return { statusCode: 200, body: JSON.stringify(analysis) };
            }
            case 'enhanceTopic': {
                const { topic } = payload;
                const prompt = `You are a viral marketing expert. Generate 3-4 specific, viral-friendly angles for this topic: "${topic}". Return a valid JSON array of objects, where each object has "angle" and "rationale".`;
                const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt, config: { responseMimeType: "application/json", responseSchema: topicEnhancementSchema } });
                const enhancedTopics: EnhancedTopic[] = JSON.parse(response.text.trim());
                return { statusCode: 200, body: JSON.stringify(enhancedTopics) };
            }
             case 'generateVisualsForScript': {
                const { script, artStyle } = payload;
                const prompt = `Based on this script, generate 3 distinct, visually compelling storyboard concepts in a ${artStyle} style: Title: "${script.title}", Script: ${script.script}`;
                const response = await ai.models.generateImages({ model: 'imagen-3.0-generate-002', prompt, config: { numberOfImages: 3, outputMimeType: 'image/jpeg', aspectRatio: '16:9' } });
                if (!response.generatedImages || response.generatedImages.length === 0) throw new Error("The AI failed to generate any images.");
                const visuals = response.generatedImages.map(img => img.image.imageBytes);
                return { statusCode: 200, body: JSON.stringify(visuals) };
            }
            case 'deconstructVideo': {
                const { videoUrl } = payload;
                const prompt = `You are a YouTube viral video analyst. Use Google Search to find info about this video: ${videoUrl}. Perform a full analysis and return a single, valid JSON object with title, analysis (hook, structure, value, cta), thumbnailAnalysis (effectiveness, ideas), and 3 generatedScripts.`;
                const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt, config: { tools: [{ googleSearch: {} }] } });
                const text = response.text.trim();
                const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => chunk.web).filter((source): source is { uri: string; title:string } => !!source?.uri) ?? [];
                const jsonMatch = text.match(/```(?:json)?([\s\S]*?)```/);
                const jsonString = jsonMatch ? jsonMatch[1].trim() : text;
                const deconstruction: VideoDeconstruction = JSON.parse(jsonString);
                deconstruction.generatedScripts = deconstruction.generatedScripts.map(s => ({ ...s, id: crypto.randomUUID(), tone: 'Viral Formula' }));
                return { statusCode: 200, body: JSON.stringify({ deconstruction, sources }) };
            }
            case 'remixScript': {
                const { baseScript, newTopic } = payload;
                const prompt = `Rewrite this base script to be about a new topic: "${newTopic}", while preserving the original's structure, pacing, and tone. Base Script: Title: "${baseScript.title}", Hook: "${baseScript.hook}", Script: ${baseScript.script}. Return a single, valid JSON object.`;
                const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt, config: { responseMimeType: "application/json", responseSchema: singleScriptResponseSchema, }, });
                const remixedPart: Omit<Script, 'id' | 'tone'> = JSON.parse(response.text.trim());
                const newScript: Script = { ...remixedPart, id: crypto.randomUUID(), tone: 'Remixed', isNew: true, };
                return { statusCode: 200, body: JSON.stringify(newScript) };
            }
            default:
                return { statusCode: 400, body: JSON.stringify({ message: "Invalid action" }) };
        }
    } catch (error: any) {
        console.error("Error in Netlify function:", error);
        const errorMessage = error.message.includes('quota') ? QUOTA_ERROR_MESSAGE : error.message;
        return { statusCode: 500, body: JSON.stringify({ message: errorMessage }) };
    }
};

export { handler };
