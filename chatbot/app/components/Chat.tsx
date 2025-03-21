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
        <div className="flex flex-col h-[600px] md:h-[700px] rounded-xl overflow-hidden border border-border bg-card-bg shadow-sm">
            <div className="p-4 border-b border-border bg-secondary/20 flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Chat Session</h2>
                <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                        <label htmlFor="model-select" className="mr-2 text-sm text-foreground/70">Model:</label>
                        <select
                            id="model-select"
                            value={model}
                            onChange={(e) => setModel(e.target.value as Model)}
                            className="text-sm rounded-md border border-border bg-card-bg px-2 py-1 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                            <option value="gpt-4">GPT-4</option>
                        </select>
                    </div>
                    <button
                        onClick={clearChat}
                        className="p-1.5 rounded-md text-foreground/70 hover:text-foreground hover:bg-secondary transition-colors"
                        aria-label="Clear chat"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button
                        onClick={exportChat}
                        className="p-1.5 rounded-md text-foreground/70 hover:text-foreground hover:bg-secondary transition-colors"
                        aria-label="Export chat"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M13.75 7h-3v5.296l1.943-2.048a.75.75 0 011.114 1.004l-3.25 3.5a.75.75 0 01-1.114 0l-3.25-3.5a.75.75 0 111.114-1.004l1.943 2.048V7h1.5V1.75a.75.75 0 00-1.5 0V7h-3A2.25 2.25 0 004 9.25v7.5A2.25 2.25 0 006.25 19h7.5A2.25 2.25 0 0016 16.75v-7.5A2.25 2.25 0 0013.75 7z" />
                        </svg>
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-3 mx-4 mt-4 rounded-lg bg-red-100/80 border-l-4 border-red-500 text-red-700 text-sm">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}

            <div className="flex-1 p-4 overflow-y-auto bg-secondary/10">
                {messages.length === 0 && !streamingMessage ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="bg-primary/5 p-5 rounded-xl border border-primary/20 text-center max-w-md">
                            <svg className="w-12 h-12 mx-auto mb-3 text-primary/60" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <p className="text-foreground font-medium">Start a conversation with the AI assistant</p>
                            <p className="text-foreground/70 text-sm mt-2">Type a message below and press Send</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-xl max-w-[85%] ${message.role === 'user'
                                    ? 'bg-primary/10 ml-auto text-right text-foreground shadow-sm'
                                    : 'bg-card-bg mr-auto border border-border shadow-sm text-foreground'
                                    }`}
                            >
                                <p className="text-sm font-semibold mb-1 text-foreground/80">
                                    {message.role === 'user' ? 'You' : 'AI Assistant'}
                                </p>
                                <p className="whitespace-pre-wrap text-foreground">{message.content}</p>
                            </div>
                        ))}

                        {streamingMessage && (
                            <div className="bg-card-bg p-4 rounded-xl mr-auto max-w-[85%] border border-border shadow-sm">
                                <p className="text-sm font-semibold mb-1 text-foreground/80">AI Assistant</p>
                                <p className="whitespace-pre-wrap text-foreground">{streamingMessage.content}</p>
                            </div>
                        )}

                        {isLoading && !streamingMessage && (
                            <div className="bg-card-bg p-4 rounded-xl mr-auto max-w-[85%] border border-border shadow-sm">
                                <p className="text-sm font-semibold mb-1 text-foreground/80">AI Assistant</p>
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit} className="border-t border-border p-4 bg-card-bg">
                <div className="flex space-x-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-foreground/50"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/70 disabled:opacity-50 transition-colors font-medium flex items-center"
                    >
                        {isLoading ? 'Sending...' : 'Send'}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                            <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
} 