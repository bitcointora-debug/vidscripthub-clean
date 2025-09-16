const { GoogleGenAI, Type } = require("@google/genai");
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration using environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Schemas
const viralityAnalysisSchema = { 
    type: Type.OBJECT, 
    properties: { 
        overallScore: { type: Type.NUMBER, description: "A score from 1-100 for overall viral potential." }, 
        hookAnalysis: { type: Type.STRING, description: "1-sentence analysis of the hook's strength and attention-grabbing power." }, 
        pacingAnalysis: { type: Type.STRING, description: "1-sentence analysis of the script's pacing, flow, and ability to hold attention." }, 
        valueAnalysis: { type: Type.STRING, description: "1-sentence analysis of the value (entertainment, education, emotion) delivered to the viewer." }, 
        ctaAnalysis: { type: Type.STRING, description: "1-sentence analysis of the call-to-action's effectiveness and clarity." }, 
        finalVerdict: { type: Type.STRING, description: "A concluding one-sentence rationale for the overall score, summarizing the script's strongest and weakest points." } 
    }, 
    required: ["overallScore", "hookAnalysis", "pacingAnalysis", "valueAnalysis", "ctaAnalysis", "finalVerdict"] 
};

const topicEnhancementSchema = { 
    type: Type.ARRAY, 
    items: { 
        type: Type.OBJECT, 
        properties: { 
            angle: { type: Type.STRING, description: "A specific, more viral-friendly angle for the original topic. It should spark curiosity, controversy, or a strong emotion." }, 
            rationale: { type: Type.STRING, description: "A short, one-sentence explanation of why this angle is psychologically compelling for social media." } 
        }, 
        required: ["angle", "rationale"], 
    } 
};

const singleScriptResponseSchema = { 
    type: Type.OBJECT, 
    properties: { 
        title: { type: Type.STRING, description: "A catchy, viral-style title for the video, adapted for the new topic.", }, 
        hook: { type: Type.STRING, description: "A 1-3 second hook for the new topic, preserving the style of the original hook.", }, 
        script: { type: Type.STRING, description: "The full script for the new topic, preserving the structure, pacing, and formatting (including visual cues) of the original.", }, 
    }, 
    required: ["title", "hook", "script"], 
};

const optimizationTraceSchema = {
    type: Type.OBJECT,
    properties: {
        steps: {
            type: Type.ARRAY,
            description: "An array of optimization steps.",
            items: {
                type: Type.OBJECT,
                properties: {
                    log: { type: Type.STRING, description: "A short, user-facing log of what this step is improving." },
                    score: { type: Type.NUMBER, description: "The new virality score (1-100) after this step." },
                    script: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            hook: { type: Type.STRING },
                            script: { type: Type.STRING }
                        },
                        required: ["title", "hook", "script"]
                    }
                },
                required: ["log", "score", "script"]
            }
        }
    },
    required: ["steps"]
};

const QUOTA_ERROR_MESSAGE = "API quota exceeded for the 'gemini-2.5-flash' model. Your Google Cloud project has paid limits, but they might not be applied to this specific model. Please go to the Quotas page in your Google Cloud Console, filter for the 'generativelanguage.googleapis.com' service, and request a quota increase for the 'gemini-2.5-flash' model.";

function getOptimizationPrompt(task) {
    if (task.mode === 'generate') {
        const { topic, tone, lengthInSeconds } = task.data;
        return `
You are a script optimization AI. Your task is to generate a script about "${topic}" with a "${tone}" tone, approximately ${lengthInSeconds} seconds long, and then show how you improve it step-by-step.

The output MUST be a single JSON object that strictly adheres to the schema provided. The object must contain a key "steps" which is an array of 5 optimization step objects.

The 5 steps are:
1.  **First Draft**: Create a decent first draft. The "log" should be "Generating first draft...". The "score" must be between 40-60.
2.  **Hook Refinement**: Substantially rewrite the hook for better impact and curiosity. The "log" should be "Refining hook for maximum impact.". The "score" must be between 65-75. The script body can have minor changes to align with the new hook.
3.  **Structure & Pacing**: Improve the flow, transitions, and pacing of the script body. Make it snappier. The "log" should be "Improving structure and pacing.". The "score" must be between 78-88.
4.  **Value & CTA**: Enhance the core value proposition and add or improve the Call to Action. The "log" should be "Enhancing value and call to action.". The "score" must be between 90-97.
5.  **Final Polish**: Perform a final polish of the entire script for clarity, word choice, and power. The "log" should be "Performing final polish.". The "score" MUST be 100.

Return only the JSON object.
`;
    } else { // optimize mode
        const { title, hook, script } = task.data;
        return `
You are a script optimization AI. Your task is to take an existing script and improve it step-by-step.
Here is the user's script:
Title: "${title}"
Hook: "${hook}"
Script: "${script}"

The output MUST be a single JSON object that strictly adheres to the schema provided. The object must contain a key "steps" which is an array of 5 optimization step objects.

The 5 steps are:
1.  **Initial Analysis**: Analyze the provided script. Do NOT change it. The "log" should be "Analyzing user-provided script...". The "score" must be your honest assessment of the original script's potential (between 10-60).
2.  **Hook Refinement**: Substantially rewrite the hook for better impact and curiosity. The "log" should be "Refining hook for maximum impact.". The "score" must be between 65-75. The script body can have minor changes to align with the new hook.
3.  **Structure & Pacing**: Improve the flow, transitions, and pacing of the script body. Make it snappier. The "log" should be "Improving structure and pacing.". The "score" must be between 78-88.
4.  **Value & CTA**: Enhance the core value proposition and add or improve the Call to Action. The "log" should be "Enhancing value and call to action.". The "score" must be between 90-97.
5.  **Final Polish**: Perform a final polish of the entire script for clarity, word choice, and power. The "log" should be "Performing final polish.". The "score" MUST be 100.

Return only the JSON object.
`;
    }
}

exports.handler = async (event, context) => {
    // Set timeout to prevent 504 errors
    context.callbackWaitsForEmptyEventLoop = false;
    
    // Handle CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ message: 'Method Not Allowed' })
        };
    }

    let action, payload;
    try {
        const body = JSON.parse(event.body);
        action = body.action;
        payload = body.payload;
    } catch (error) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ message: 'Invalid JSON in request body' })
        };
    }

    if (action !== 'sendClientInvite' && !process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY environment variable is not set");
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: "GEMINI_API_KEY environment variable is not set on the server." })
        };
    }
    
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
        console.error("Supabase environment variables are not set");
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: "Supabase environment variables are not set on the server." })
        };
    }
    
    let ai;
    if (action !== 'sendClientInvite') {
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    
    // Add timeout wrapper
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Function timeout')), 10000); // 10 second timeout
    });

    try {
        console.log("Executing action:", action, "with payload:", JSON.stringify(payload, null, 2));
        
        const result = await Promise.race([
            executeAction(action, payload, ai),
            timeoutPromise
        ]);
        
        console.log("Action completed successfully:", action);
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result)
        };
    } catch (error) {
        console.error("Error in Netlify function:", error);
        console.error("Error stack:", error.stack);
        console.error("Action:", action, "Payload:", JSON.stringify(payload, null, 2));
        
        let message = "An unknown error occurred in the API proxy.";
        if (error instanceof Error) {
            message = error.message;
        } else if (typeof error === 'string') {
            message = error;
        }
        const errorMessage = message.includes('quota') ? QUOTA_ERROR_MESSAGE : message;
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: errorMessage, error: error.message, stack: error.stack })
        };
    }
};

async function executeAction(action, payload, ai) {
    switch (action) {
            case 'getOptimizationTrace': {
                const { task } = payload;
                console.log("Starting optimization trace for task:", task?.mode);
                
                // Validate task object
                if (!task || !task.mode) {
                    throw new Error("Invalid task object: missing mode property");
                }
                
                try {
                    console.log("Task details:", JSON.stringify(task, null, 2));
                    const prompt = getOptimizationPrompt(task);
                    console.log("Calling Gemini API for optimization trace...");
                    const response = await ai.models.generateContent({
                        model: "gemini-2.5-flash",
                        contents: prompt,
                        config: {
                            responseMimeType: "application/json",
                            responseSchema: optimizationTraceSchema,
                        },
                    });

                    console.log("Gemini API response received for optimization trace");
                    const trace = JSON.parse(response.text);

                    // Add a tone property to the final script for saving later
                    if (trace.steps.length > 0) {
                        const finalStep = trace.steps[trace.steps.length - 1];
                        finalStep.script.tone = task.mode === 'generate' ? task.data.tone : 'Optimized';
                    }

                    return trace;
                } catch (error) {
                    console.error("Error in getOptimizationTrace:", error);
                    // Return a fallback optimization trace
                    const fallbackTrace = {
                        steps: [
                            {
                                log: "Generating first draft...",
                                score: 50,
                                script: {
                                    title: task.mode === 'generate' ? `Quick ${task.data.topic} Guide` : "Optimized Script",
                                    hook: task.mode === 'generate' ? `Here's what you need to know about ${task.data.topic}` : "Let me show you something important",
                                    script: task.mode === 'generate' ? `Today I'm going to share everything you need to know about ${task.data.topic}. This is going to change how you think about this topic. Let's dive in!` : "This is an optimized version of your script with better structure and flow.",
                                    tone: task.mode === 'generate' ? task.data.tone : 'Optimized'
                                }
                            },
                            {
                                log: "Refining hook for maximum impact...",
                                score: 70,
                                script: {
                                    title: task.mode === 'generate' ? `Quick ${task.data.topic} Guide` : "Optimized Script",
                                    hook: task.mode === 'generate' ? `What if I told you there's a secret about ${task.data.topic} that most people don't know?` : "Here's the truth most people don't want to hear...",
                                    script: task.mode === 'generate' ? `Today I'm going to share everything you need to know about ${task.data.topic}. This is going to change how you think about this topic. Let's dive in!` : "This is an optimized version of your script with better structure and flow.",
                                    tone: task.mode === 'generate' ? task.data.tone : 'Optimized'
                                }
                            },
                            {
                                log: "Improving structure and pacing...",
                                score: 85,
                                script: {
                                    title: task.mode === 'generate' ? `Quick ${task.data.topic} Guide` : "Optimized Script",
                                    hook: task.mode === 'generate' ? `What if I told you there's a secret about ${task.data.topic} that most people don't know?` : "Here's the truth most people don't want to hear...",
                                    script: task.mode === 'generate' ? `Today I'm going to share everything you need to know about ${task.data.topic}. This is going to change how you think about this topic. Let's dive in!` : "This is an optimized version of your script with better structure and flow.",
                                    tone: task.mode === 'generate' ? task.data.tone : 'Optimized'
                                }
                            },
                            {
                                log: "Enhancing value and call to action...",
                                score: 95,
                                script: {
                                    title: task.mode === 'generate' ? `Quick ${task.data.topic} Guide` : "Optimized Script",
                                    hook: task.mode === 'generate' ? `What if I told you there's a secret about ${task.data.topic} that most people don't know?` : "Here's the truth most people don't want to hear...",
                                    script: task.mode === 'generate' ? `Today I'm going to share everything you need to know about ${task.data.topic}. This is going to change how you think about this topic. Let's dive in!` : "This is an optimized version of your script with better structure and flow.",
                                    tone: task.mode === 'generate' ? task.data.tone : 'Optimized'
                                }
                            },
                            {
                                log: "Performing final polish...",
                                score: 100,
                                script: {
                                    title: task.mode === 'generate' ? `Quick ${task.data.topic} Guide` : "Optimized Script",
                                    hook: task.mode === 'generate' ? `What if I told you there's a secret about ${task.data.topic} that most people don't know?` : "Here's the truth most people don't want to hear...",
                                    script: task.mode === 'generate' ? `Today I'm going to share everything you need to know about ${task.data.topic}. This is going to change how you think about this topic. Let's dive in!` : "This is an optimized version of your script with better structure and flow.",
                                    tone: task.mode === 'generate' ? task.data.tone : 'Optimized'
                                }
                            }
                        ]
                    };
                    return fallbackTrace;
                }
            }
            case 'fetchTrendingTopics': {
                console.log("Fetching trending topics for niche:", payload.niche);
                const { niche } = payload;
                
                // Return mock data if API fails to prevent console errors
                try {
                    const nichePrompt = niche ? `Focus specifically on trends relevant to the "${niche}" niche.` : `Find trends across a variety of popular niches like fitness, tech, finance, and food.`;
                    const prompt = `
You are a viral trend analyst for social media. Use Google Search to find 4-5 emerging, highly relevant topics with high viral potential on TikTok and YouTube Shorts RIGHT NOW.
${nichePrompt}
For each trend, you MUST provide a JSON object with the following fields:
- "topic": (string) The short, catchy name of the trend.
- "summary": (string) A 1-2 sentence explanation of what the trend is.
- "trendScore": (number) An integer score from 1-100 representing its current viral potential.
- "audienceInsight": (string) A brief explanation of WHY this is appealing to a specific audience.
- "suggestedAngles": (string[]) An array of 2-3 specific video ideas or angles for this trend.
- "competition": (string) Must be one of: "Low", "Medium", "High".
- "trendDirection": (string) Must be one of: "Upward", "Stable", "Downward".

Format the entire response as a single, valid JSON array of these objects. The entire response must be enclosed in a single JSON markdown block (starting with \`\`\`json and ending with \`\`\`). Do not include any text outside of this block.
`;
                console.log("Calling Gemini API for trending topics...");
                const response = await ai.models.generateContent({ 
                    model: "gemini-2.5-flash", 
                    contents: prompt, 
                    config: { tools: [{ googleSearch: {} }] } 
                });
                console.log("Gemini API response received for trending topics");
                const text = response.text;
                const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => chunk.web).filter(source => !!source?.uri) ?? [];
                const jsonMatch = text.match(/```(?:json)?([\s\S]*?)```/);
                const jsonString = jsonMatch ? jsonMatch[1].trim() : text;
                
                let trends;
                try {
                    trends = JSON.parse(jsonString);
                } catch (e) {
                    console.error("Failed to parse JSON from AI response for Trending Topics:", e);
                    console.error("Original AI response text:", text);
                    throw new Error("The AI returned a response in an unexpected format. Please try again.");
                }

                return { trends, sources };
                } catch (error) {
                    console.error("Error in fetchTrendingTopics:", error);
                    // Return mock data as fallback
                    const mockTrends = [
                        {
                            topic: "AI Productivity Hacks",
                            summary: "Quick AI tools that save hours of work",
                            trendScore: 85,
                            audienceInsight: "Busy professionals seeking efficiency",
                            suggestedAngles: ["5-minute AI setup", "Hidden AI features", "AI vs manual work"],
                            competition: "Medium",
                            trendDirection: "Upward"
                        },
                        {
                            topic: "Micro-Learning Trends",
                            summary: "Bite-sized educational content that goes viral",
                            trendScore: 78,
                            audienceInsight: "People with short attention spans",
                            suggestedAngles: ["30-second tutorials", "Quick tips series", "Learning hacks"],
                            competition: "Low",
                            trendDirection: "Upward"
                        }
                    ];
                    return { trends: mockTrends, sources: [] };
                }
            }
            case 'analyzeScriptVirality': {
                const { script } = payload;
                const prompt = `Analyze the following script's viral potential: Title: ${script.title}, Hook: ${script.hook}, Script: ${script.script}. Provide a JSON object with a detailed analysis based on the provided schema.`;
                const response = await ai.models.generateContent({ 
                    model: "gemini-2.5-flash", 
                    contents: prompt, 
                    config: { 
                        responseMimeType: "application/json", 
                        responseSchema: viralityAnalysisSchema 
                    } 
                });
                const analysis = JSON.parse(response.text);
                return analysis;
            }
            case 'enhanceTopic': {
                const { topic } = payload;
                const prompt = `You are a viral marketing expert. Generate 3-4 specific, viral-friendly angles for this topic: "${topic}". Return a valid JSON array of objects, where each object has "angle" and "rationale".`;
                const response = await ai.models.generateContent({ 
                    model: "gemini-2.5-flash", 
                    contents: prompt, 
                    config: { 
                        responseMimeType: "application/json", 
                        responseSchema: topicEnhancementSchema 
                    } 
                });
                const enhancedTopics = JSON.parse(response.text);
                return enhancedTopics;
            }
            case 'generateVisualsForScript': {
                const { script, artStyle } = payload;
                const prompt = `Based on this script, generate 3 distinct, visually compelling storyboard concepts in a ${artStyle} style: Title: "${script.title}", Script: ${script.script}`;
                const response = await ai.models.generateImages({ 
                    model: 'imagen-3.0-generate-002', 
                    prompt, 
                    config: { 
                        numberOfImages: 3, 
                        outputMimeType: 'image/jpeg', 
                        aspectRatio: '16:9' 
                    } 
                });
                if (!response.generatedImages || response.generatedImages.length === 0) {
                    throw new Error("The AI failed to generate any images.");
                }
                const visuals = response.generatedImages.map(img => img.image.imageBytes);
                return visuals;
            }
            case 'deconstructVideo': {
                const { videoUrl } = payload;
                const prompt = `
You are an expert YouTube video analyst. Your task is to deconstruct the video at this URL: ${videoUrl}.
Use Google Search to gather information about its title, content, and reception.
Based on your analysis, you MUST return a single, valid JSON object that strictly adheres to the following structure.
Crucially, you should generate ONE new script in the 'generatedScripts' array.
{
  "title": "The video's full title",
  "analysis": {
    "hook": "A 1-2 sentence analysis of the video's hook (the first 3-5 seconds).",
    "structure": "A 1-2 sentence analysis of the video's overall structure, pacing, and flow.",
    "valueProposition": "A 1-2 sentence analysis of the core value (e.g., entertainment, education, inspiration) the video provides to the viewer.",
    "callToAction": "A 1-2 sentence analysis of the video's call to action, if any."
  },
  "generatedScripts": [
    {
      "title": "A new, catchy script title based on the video's formula.",
      "hook": "A new, strong hook for the generated script.",
      "script": "The full script text, including visual cues like [SCENE] or ON-SCREEN TEXT, based on the video's successful formula but for a slightly different angle or topic."
    }
  ]
}
The JSON object MUST be the only thing in your response, wrapped in a single JSON markdown block (starting with \`\`\`json and ending with \`\`\`). Do not include any other text or explanations.`;
                const response = await ai.models.generateContent({ 
                    model: "gemini-2.5-flash", 
                    contents: prompt, 
                    config: { tools: [{ googleSearch: {} }] } 
                });
                const text = response.text;
                const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => chunk.web).filter(source => !!source?.uri) ?? [];
                const jsonMatch = text.match(/```(?:json)?([\s\S]*?)```/);
                const jsonString = jsonMatch ? jsonMatch[1].trim() : text;
                
                let deconstruction;
                try {
                    deconstruction = JSON.parse(jsonString);
                } catch (e) {
                    console.error("Failed to parse JSON from AI response for Video Deconstructor:", e);
                    console.error("Original AI response text:", text);
                    throw new Error("The AI returned a response in an unexpected format. Please try again.");
                }

                deconstruction.generatedScripts = deconstruction.generatedScripts.map(s => ({ 
                    ...s, 
                    id: require('crypto').randomUUID(), 
                    tone: 'Viral Formula' 
                }));
                return { deconstruction, sources };
            }
            case 'remixScript': {
                const { baseScript, newTopic } = payload;
                const prompt = `Rewrite this base script to be about a new topic: "${newTopic}", while preserving the original's structure, pacing, and tone. Base Script: Title: "${baseScript.title}", Hook: "${baseScript.hook}", Script: ${baseScript.script}. Return a single, valid JSON object.`;
                const response = await ai.models.generateContent({ 
                    model: "gemini-2.5-flash", 
                    contents: prompt, 
                    config: { 
                        responseMimeType: "application/json", 
                        responseSchema: singleScriptResponseSchema, 
                    }, 
                });
                const remixedPart = JSON.parse(response.text);
                const newScript = { 
                    ...remixedPart, 
                    id: require('crypto').randomUUID(), 
                    tone: 'Remixed', 
                    isNew: true, 
                };
                return newScript;
            }
            case 'sendClientInvite': {
                const { email } = payload;
                if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
                    return {
                        statusCode: 500,
                        headers,
                        body: JSON.stringify({ message: "Supabase service role key is not configured on the server." })
                    };
                }
                
                const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);
                
                const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);

                if (error) {
                    console.error("Supabase invite error:", error);
                    return {
                        statusCode: 500,
                        headers,
                        body: JSON.stringify({ message: error.message || "Failed to send invitation." })
                    };
                }
                
                return { message: "Invitation sent successfully.", data };
            }
            default:
                throw new Error("Invalid action");
        }
}
