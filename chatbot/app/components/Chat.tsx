'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
    role: 'user' | 'assistant' | 'system';
    content: string;
};

type Model = 'gpt-3.5-turbo' | 'gpt-4';

export default function Chat() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Hello! I\'m your AI assistant. How can I help you today?'
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);
    const [model, setModel] = useState<Model>('gpt-3.5-turbo');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streamingMessage?.content]);

    // Focus input on load
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };

        // Clear any previous errors and streaming message
        setError(null);
        setStreamingMessage(null);

        // Update UI immediately with user message
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Use streaming API for better UX
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                    stream: true,
                    model,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
            }

            if (!response.body) {
                throw new Error('Response body is null');
            }

            // Process the streaming response
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;

            setStreamingMessage({ role: 'assistant', content: '' });

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;

                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.replace('data: ', '');

                        if (data === '[DONE]') {
                            // Streaming is complete, add the complete message to the messages array
                            if (streamingMessage) {
                                setMessages(prev => [...prev, streamingMessage]);
                                setStreamingMessage(null);
                            }
                            break;
                        }

                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.message) {
                                setStreamingMessage(parsed.message);
                            }
                        } catch (error) {
                            console.error('Error parsing streaming data:', error);
                        }
                    }
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            console.error('Error:', errorMessage);

            // Set error state
            setError(errorMessage);

            // Add a friendly error message to the chat
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: 'Sorry, there was an error processing your request. Please try again later.' },
            ]);

            // Clear any partial streaming message
            setStreamingMessage(null);
        } finally {
            setIsLoading(false);
            // Focus the input field after sending
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const clearChat = () => {
        setMessages([
            {
                role: 'assistant',
                content: 'Chat cleared. How can I help you today?'
            }
        ]);
        setError(null);
        setStreamingMessage(null);
    };

    const exportChat = () => {
        // Create a formatted conversation log
        const conversationText = messages
            .map(msg => `${msg.role === 'user' ? 'You' : 'AI'}: ${msg.content}`)
            .join('\n\n');

        const fileName = `chat-export-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;

        // Create a blob and download it
        const blob = new Blob([conversationText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto border rounded-lg overflow-hidden shadow-lg">
            <div className="bg-blue-700 text-white p-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">AI Assistant</h2>
                <div className="flex items-center space-x-2">
                    <select
                        value={model}
                        onChange={(e) => setModel(e.target.value as Model)}
                        className="text-sm bg-blue-800 hover:bg-blue-900 px-3 py-1 rounded transition-colors text-white border-none focus:ring-2 focus:ring-white"
                        disabled={isLoading}
                    >
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        <option value="gpt-4">GPT-4</option>
                    </select>
                    <button
                        onClick={clearChat}
                        className="text-sm bg-blue-800 hover:bg-blue-900 px-3 py-1 rounded transition-colors"
                        disabled={isLoading}
                    >
                        Clear
                    </button>
                    <button
                        onClick={exportChat}
                        className="text-sm bg-blue-800 hover:bg-blue-900 px-3 py-1 rounded transition-colors"
                        disabled={isLoading || messages.length <= 1}
                        title={messages.length <= 1 ? "No conversation to export" : "Export conversation"}
                    >
                        Export
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 text-sm">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}

            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {messages.length === 0 && !streamingMessage ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                            <p className="text-blue-800 font-medium">Start a conversation with the AI assistant</p>
                            <p className="text-blue-600 text-sm mt-1">Type a message below and press Send</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg ${message.role === 'user'
                                    ? 'bg-blue-100 ml-auto max-w-[80%] text-right text-black'
                                    : 'bg-white mr-auto max-w-[80%] border border-gray-200 shadow-sm text-black'
                                    }`}
                            >
                                <p className="text-sm font-semibold mb-1 text-black">
                                    {message.role === 'user' ? 'You' : 'AI Assistant'}
                                </p>
                                <p className="whitespace-pre-wrap text-black">{message.content}</p>
                            </div>
                        ))}

                        {streamingMessage && (
                            <div className="bg-white p-3 rounded-lg mr-auto max-w-[80%] border border-gray-200 shadow-sm">
                                <p className="text-sm font-semibold mb-1 text-black">AI Assistant</p>
                                <p className="whitespace-pre-wrap text-black">{streamingMessage.content}</p>
                            </div>
                        )}

                        {isLoading && !streamingMessage && (
                            <div className="bg-white p-3 rounded-lg mr-auto max-w-[80%] border border-gray-200 shadow-sm">
                                <p className="text-sm font-semibold mb-1 text-black">AI Assistant</p>
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit} className="border-t p-4 bg-white">
                <div className="flex space-x-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
} 