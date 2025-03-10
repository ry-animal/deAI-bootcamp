import Chat from './components/Chat';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-8 md:p-12">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-black">AI Chatbot</h1>
        <p className="text-black mb-4 font-medium">Powered by OpenAI and Next.js</p>

        <div className="max-w-md mx-auto text-left bg-white p-4 rounded-lg shadow-sm border text-sm">
          <h2 className="font-semibold mb-2 text-blue-700">Available Models:</h2>
          <ul className="space-y-2 text-black">
            <li>
              <span className="font-medium">GPT-3.5 Turbo:</span> Fast, efficient, and cost-effective for most tasks.
            </li>
            <li>
              <span className="font-medium">GPT-4:</span> More advanced capabilities for complex tasks, but slower and more expensive.
            </li>
          </ul>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto">
        <Chat />
      </main>

      <footer className="mt-12 text-center text-sm text-gray-700">
        <p>© {new Date().getFullYear()} AI Chatbot - Built with Next.js</p>
      </footer>
    </div>
  );
}
