import Chat from './components/Chat';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/90">
      <header className="pt-8 pb-6 px-4 sm:px-6 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3 text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">AI Chatbot</h1>
          <p className="text-foreground/80 mb-6 font-medium">Powered by OpenAI and Next.js</p>

          <div className="max-w-md mx-auto text-left bg-card-bg p-5 rounded-xl shadow-sm border border-border">
            <h2 className="font-semibold mb-3 text-primary">Available Models:</h2>
            <ul className="space-y-3 text-foreground/90">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 mt-1 mr-2 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <span className="font-medium">GPT-3.5 Turbo:</span> Fast, efficient, and cost-effective for most tasks.
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 mt-1 mr-2 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <span className="font-medium">GPT-4:</span> More advanced capabilities for complex tasks, but slower and more expensive.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        <Chat />
      </main>

      <footer className="py-6 mt-8 text-center text-sm text-foreground/70 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <p>© {new Date().getFullYear()} AI Chatbot - Built with Next.js</p>
        </div>
      </footer>
    </div>
  );
}
