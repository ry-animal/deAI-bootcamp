import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_MODELS = ['gpt-3.5-turbo', 'gpt-4'];

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages, stream = false, model = 'gpt-3.5-turbo' } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages are required and must be an array' },
        { status: 400 }
      );
    }

    // Validate model
    if (!ALLOWED_MODELS.includes(model)) {
      return NextResponse.json(
        { error: 'Invalid model specified' },
        { status: 400 }
      );
    }

    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is missing' },
        { status: 500 }
      );
    }

    // Add system message if not present
    const messagesWithSystem = messages.some(msg => msg.role === 'system')
      ? messages
      : [
          {
            role: 'system',
            content: 'You are a helpful, friendly, and concise assistant. Provide accurate and detailed information while being conversational.',
          },
          ...messages,
        ];

    // If stream is requested, handle streaming response
    if (stream) {
      const encoder = new TextEncoder();
      
      const stream = await openai.chat.completions.create({
        model,
        messages: messagesWithSystem,
        temperature: 0.7,
        stream: true,
      });
      
      const readableStream = new ReadableStream({
        async start(controller) {
          const streamAssistantMessage = { role: 'assistant', content: '' };
          
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            streamAssistantMessage.content += content;
            
            // Send the updated message
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ message: streamAssistantMessage })}\n\n`));
          }
          
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        },
      });
      
      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }
    
    // Handle non-streaming response
    const response = await openai.chat.completions.create({
      model,
      messages: messagesWithSystem,
      temperature: 0.7,
    });

    // Extract just the assistant's message
    if (response.choices && response.choices.length > 0) {
      return NextResponse.json({
        message: response.choices[0].message
      });
    } else {
      return NextResponse.json(
        { error: 'No response generated' },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('Error in chat API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during the request';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 