import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    console.log('API route called');
    const { messages, model = 'gpt-3.5-turbo' } = await req.json();
    console.log('Request body parsed:', { model, messageCount: messages.length });

    // Validate messages and model
    if (!messages || !Array.isArray(messages)) {
      console.log('Invalid messages format');
      return new Response(
        JSON.stringify({ error: 'Messages are required and must be an array' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!['gpt-3.5-turbo', 'gpt-4'].includes(model)) {
      console.log('Invalid model:', model);
      return new Response(
        JSON.stringify({ error: 'Invalid model specified' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.log('Missing OpenAI API key');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is missing' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Calling OpenAI with model:', model);
    // Use the streamText function from the Vercel AI SDK
    const result = await streamText({
      model: openai(model),
      messages,
      temperature: 0.7,
    });
    console.log('OpenAI response received');

    // Return a streaming response with explicit headers for text/event-stream
    console.log('Returning streaming response');
    const response = result.toTextStreamResponse({
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    });
    
    return response;
  } catch (error: unknown) {
    console.error('Error in chat API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during the request';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 