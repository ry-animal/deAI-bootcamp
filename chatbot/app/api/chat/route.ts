import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages, model = 'gpt-3.5-turbo' } = await req.json();

    // Validate messages and model
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages are required and must be an array' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!['gpt-3.5-turbo', 'gpt-4'].includes(model)) {
      return new Response(
        JSON.stringify({ error: 'Invalid model specified' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is missing' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Use the streamText function from the Vercel AI SDK
    const result = await streamText({
      model: openai(model),
      messages,
      temperature: 0.7,
    });

    // Return a streaming response
    return result.toTextStreamResponse();
  } catch (error: unknown) {
    console.error('Error in chat API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during the request';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 