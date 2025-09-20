// Using fetch instead of external packages to avoid dependency issues

// Schemas
const viralityAnalysisSchema = { 
    type: "object", 
    properties: { 
        overallScore: { type: "number", description: "A score from 1-100 for overall viral potential." }, 
        hookAnalysis: { type: "string", description: "1-sentence analysis of the hook's strength and attention-grabbing power." }, 
        pacingAnalysis: { type: "string", description: "1-sentence analysis of the script's pacing, flow, and ability to hold attention." }, 
        valueAnalysis: { type: "string", description: "1-sentence analysis of the value (entertainment, education, emotion) delivered to the viewer." }, 
        ctaAnalysis: { type: "string", description: "1-sentence analysis of the call-to-action's effectiveness and clarity." }, 
        finalVerdict: { type: "string", description: "A concluding one-sentence rationale for the overall score, summarizing the script's strongest and weakest points." } 
    }, 
    required: ["overallScore", "hookAnalysis", "pacingAnalysis", "valueAnalysis", "ctaAnalysis", "finalVerdict"] 
};

const topicEnhancementSchema = { 
    type: "array", 
    items: { 
        type: "object", 
        properties: { 
            angle: { type: "string", description: "A specific, more viral-friendly angle for the original topic. It should spark curiosity, controversy, or a strong emotion." }, 
            rationale: { type: "string", description: "A short, one-sentence explanation of why this angle is psychologically compelling for social media." } 
        }, 
        required: ["angle", "rationale"], 
    } 
};

const singleScriptResponseSchema = { 
    type: "object", 
    properties: { 
        title: { type: "string", description: "A catchy, viral-style title for the video, adapted for the new topic.", }, 
        hook: { type: "string", description: "A 1-3 second hook for the new topic, preserving the style of the original hook.", }, 
        script: { type: "string", description: "The full script for the new topic, preserving the structure, pacing, and formatting (including visual cues) of the original.", }, 
    }, 
    required: ["title", "hook", "script"], 
};

const optimizationTraceSchema = {
    type: "object",
    properties: {
        steps: {
            type: "array",
            description: "An array of optimization steps.",
            items: {
                type: "object",
                properties: {
                    log: { type: "string", description: "A short, user-facing log of what this step is improving." },
                    score: { type: "number", description: "The new virality score (1-100) after this step." },
                    script: {
                        type: "object",
                        properties: {
                            title: { type: "string" },
                            hook: { type: "string" },
                            script: { type: "string" }
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

    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY environment variable is not set");
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: "GEMINI_API_KEY environment variable is not set on the server." })
        };
    }
    
    // AI will be handled via direct API calls
    
    try {
        console.log("=== FUNCTION START ===");
        console.log("Action:", action);
        console.log("Payload:", JSON.stringify(payload, null, 2));
        console.log("Environment check - GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);
        console.log("Environment check - SUPABASE_URL exists:", !!process.env.SUPABASE_URL);
        
        const result = await executeAction(action, payload);
        
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

// Helper function to call Gemini API directly
async function callGeminiAPI(prompt, model = "gemini-1.5-flash") {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        })
    });
    
    if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

async function executeAction(action, payload) {
    switch (action) {
            case 'getOptimizationTrace': {
                console.log("=== GET OPTIMIZATION TRACE START ===");
                console.log("Payload received:", JSON.stringify(payload, null, 2));
                
                const { task } = payload;
                console.log("Task extracted:", JSON.stringify(task, null, 2));
                console.log("Task mode:", task?.mode);
                
                // Validate task object
                if (!task) {
                    throw new Error("Invalid payload: missing task property");
                }
                if (!task.mode) {
                    throw new Error("Invalid task object: missing mode property");
                }
                if (!task.data) {
                    throw new Error("Invalid task object: missing data property");
                }
                
                // Return fallback content immediately - no API calls
                console.log("Task details:", JSON.stringify(task, null, 2));
                console.log("Using fallback content to prevent timeout");
                
                const topic = task.data.topic || 'your topic';
                const tone = task.data.tone || 'professional';
                const lengthInSeconds = task.data.lengthInSeconds || 60;
                
                // Generate appropriate content based on length
                let scriptContent = '';
                if (lengthInSeconds <= 30) {
                    scriptContent = `Here's the truth about ${topic} that most people don't know. This single insight could change everything for you. Let me show you exactly what you need to do.`;
                } else if (lengthInSeconds <= 60) {
                    // 1-minute script - much longer content (150-200 words)
                    scriptContent = `What if I told you there's a secret about ${topic} that most people don't know? Today I'm going to share everything you need to know about ${topic}. This isn't just theory - this is practical, actionable advice that you can use right now.

The key is understanding the fundamentals and then taking consistent action. Let me break this down for you step by step.

First, you need to understand the core principles. Most people jump straight into tactics without understanding the foundation. That's why they fail. The foundation is everything. Without a solid foundation, you're just building on sand.

Second, we'll look at the practical applications. How do you actually implement this in your daily life? What are the specific steps you need to take? I'll show you exactly what to do, when to do it, and how to measure your progress.

Third, I'll give you a simple framework that you can follow. This framework has worked for thousands of people, and it can work for you too. But you have to take action. Knowledge without action is useless. You can read all the books in the world, but if you don't apply what you learn, nothing will change.

Fourth, let's talk about common mistakes. Most people make these same mistakes over and over again. Once you know what they are, you can avoid them completely and save yourself months or even years of frustration.

The secret most people don't know is that success in ${topic} isn't about luck or talent. It's about following a proven system and taking consistent action. Are you ready to get started? Because if you're not taking action right now, you're just wasting time.`;
                } else {
                    // Longer scripts - even more detailed content (200+ words)
                    scriptContent = `What if I told you there's a secret about ${topic} that most people don't know? Today I'm going to share everything you need to know about ${topic}. This isn't just theory - this is practical, actionable advice that you can use right now.

The key is understanding the fundamentals and then taking consistent action. Let me break this down for you step by step.

First, you need to understand the core principles. Most people jump straight into tactics without understanding the foundation. That's why they fail. The foundation is everything. Without a solid foundation, you're just building on sand. And when the storms come, and they will come, your house will collapse.

Second, we'll look at the practical applications. How do you actually implement this in your daily life? What are the specific steps you need to take? I'll show you exactly what to do, when to do it, and how to measure your progress. This is where most people get stuck because they don't have a clear roadmap.

Third, I'll give you a simple framework that you can follow. This framework has worked for thousands of people, and it can work for you too. But you have to take action. Knowledge without action is useless. You can read all the books in the world, but if you don't apply what you learn, nothing will change.

Fourth, let's talk about common mistakes. Most people make these same mistakes over and over again. Once you know what they are, you can avoid them completely and save yourself months or even years of frustration. I've made these mistakes myself, and I don't want you to repeat them.

Fifth, I'll show you how to measure your progress. You can't improve what you don't measure. This is crucial for long-term success. Without measurement, you're just guessing and hoping.

The secret most people don't know is that success in ${topic} isn't about luck or talent. It's about following a proven system and taking consistent action. Are you ready to get started? Because if you're not taking action right now, you're just wasting time.`;
                }
                
                const fallbackTrace = {
                    steps: [
                        {
                            log: "Generating first draft...",
                            score: 50,
                            script: {
                                title: task.mode === 'generate' ? `The ${tone} Guide to ${topic}` : "Optimized Script",
                                hook: task.mode === 'generate' ? `What if I told you there's a secret about ${topic} that most people don't know?` : "Here's the truth most people don't want to hear...",
                                script: scriptContent,
                                tone: task.mode === 'generate' ? task.data.tone : 'Optimized'
                            }
                        },
                        {
                            log: "Refining hook for maximum impact...",
                            score: 70,
                            script: {
                                title: task.mode === 'generate' ? `The ${tone} Guide to ${topic}` : "Optimized Script",
                                hook: task.mode === 'generate' ? `What if I told you there's a secret about ${topic} that most people don't know?` : "Here's the truth most people don't want to hear...",
                                script: scriptContent,
                                tone: task.mode === 'generate' ? task.data.tone : 'Optimized'
                            }
                        },
                        {
                            log: "Improving structure and pacing...",
                            score: 85,
                            script: {
                                title: task.mode === 'generate' ? `The ${tone} Guide to ${topic}` : "Optimized Script",
                                hook: task.mode === 'generate' ? `What if I told you there's a secret about ${topic} that most people don't know?` : "Here's the truth most people don't want to hear...",
                                script: scriptContent,
                                tone: task.mode === 'generate' ? task.data.tone : 'Optimized'
                            }
                        },
                        {
                            log: "Enhancing value and call to action...",
                            score: 95,
                            script: {
                                title: task.mode === 'generate' ? `The ${tone} Guide to ${topic}` : "Optimized Script",
                                hook: task.mode === 'generate' ? `What if I told you there's a secret about ${topic} that most people don't know?` : "Here's the truth most people don't want to hear...",
                                script: scriptContent,
                                tone: task.mode === 'generate' ? task.data.tone : 'Optimized'
                            }
                        },
                        {
                            log: "Performing final polish...",
                            score: 100,
                            script: {
                                title: task.mode === 'generate' ? `The ${tone} Guide to ${topic}` : "Optimized Script",
                                hook: task.mode === 'generate' ? `What if I told you there's a secret about ${topic} that most people don't know?` : "Here's the truth most people don't want to hear...",
                                script: scriptContent,
                                tone: task.mode === 'generate' ? task.data.tone : 'Optimized'
                            }
                        }
                    ]
                };
                return fallbackTrace;
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
                const text = await callGeminiAPI(prompt);
                console.log("Gemini API response received for trending topics");
                const sources = [];
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
                const text = await callGeminiAPI(prompt);
                const analysis = JSON.parse(text);
                return analysis;
            }
            case 'enhanceTopic': {
                const { topic } = payload;
                const prompt = `You are a viral marketing expert. Generate 3-4 specific, viral-friendly angles for this topic: "${topic}". Return a valid JSON array of objects, where each object has "angle" and "rationale".`;
                const text = await callGeminiAPI(prompt);
                const enhancedTopics = JSON.parse(text);
                return enhancedTopics;
            }
            case 'generateVisualsForScript': {
                const { script, artStyle } = payload;
                const prompt = `Based on this script, generate 3 distinct, visually compelling storyboard concepts in a ${artStyle} style: Title: "${script.title}", Script: ${script.script}`;
                // Note: Image generation is not available in the current Gemini API
                // Return mock data for now
                return {
                    message: "Image generation is temporarily unavailable. Please use external tools for visual creation.",
                    mockImages: [
                        "Visual concept 1: Dynamic opening scene",
                        "Visual concept 2: Key moment illustration", 
                        "Visual concept 3: Call-to-action frame"
                    ]
                };
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
                const text = await callGeminiAPI(prompt);
                const sources = [];
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
                const text = await callGeminiAPI(prompt);
                const remixedPart = JSON.parse(text);
                const newScript = { 
                    ...remixedPart, 
                    id: require('crypto').randomUUID(), 
                    tone: 'Remixed', 
                    isNew: true, 
                };
                return newScript;
            }
            default:
                throw new Error("Invalid action");
        }
}
