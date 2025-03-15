"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { JokeEvaluationDisplay } from "./components/JokeEvaluationDisplay";
import { RadioButtonGroup } from "./components/RadioButtonGroup";
import { CreativitySlider } from "./components/CreativitySlider";
import { topics, tones, jokeTypes } from "./constants/jokeOptions";

interface JokeState {
  topic: string;
  tone: string;
  type: string;
  temperature: number;
}

export default function Chat() {
  const { messages, append, isLoading } = useChat();
  const [state, setState] = useState<JokeState>({
    topic: "",
    tone: "",
    type: "",
    temperature: 0.7
  });

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Joke Generator
            </h2>
            <p className="text-gray-400 text-lg">
              Create your unique joke by selecting the options below
            </p>
          </div>

          <div className="w-full space-y-8">
            <RadioButtonGroup
              title="Topic"
              options={topics}
              name="topic"
              selectedValue={state.topic}
              onChange={handleChange}
            />

            <RadioButtonGroup
              title="Tone"
              options={tones}
              name="tone"
              selectedValue={state.tone}
              onChange={handleChange}
            />

            <RadioButtonGroup
              title="Type"
              options={jokeTypes}
              name="type"
              selectedValue={state.type}
              onChange={handleChange}
            />

            <CreativitySlider
              value={state.temperature}
              onChange={handleChange}
            />

            <button
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all
                ${isLoading || !state.topic || !state.tone
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90'
                }
              `}
              disabled={isLoading || !state.topic || !state.tone}
              onClick={() =>
                append({
                  role: "user",
                  content: `Generate a ${state.topic} joke in a ${state.tone} tone, make it a ${state.type} type of joke`,
                })
              }
            >
              {isLoading ? 'Generating...' : 'Generate Joke'}
            </button>

            {messages.length > 0 && !messages[messages.length - 1]?.content.startsWith("Generate") && (
              <div className="mt-8">
                <JokeEvaluationDisplay content={messages[messages.length - 1]?.content || ''} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}