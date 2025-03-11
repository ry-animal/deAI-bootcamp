import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

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

    // Add system message if not present
    const messagesWithSystem = messages.some((msg: Message) => msg.role === 'system')
      ? messages
      : [
          {
            role: 'system',
            content: 'You are a helpful, friendly, and concise assistant. Provide accurate and detailed information while being conversational.',
          },
          ...messages,
        ];

    // Request the OpenAI API for the response
    const response = await openai.chat.completions.create({
      model: model,
      messages: messagesWithSystem,
      temperature: 0.7,
      stream: true,
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error: unknown) {
    console.error('Error in chat API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during the request';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 