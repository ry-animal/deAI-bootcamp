interface JokeEvaluation {
  shock_value: number;
  offensiveness: number;
  creativity: number;
  controversy: number;
  tags: string[];
}

interface JokeEvaluationDisplayProps {
  content: string;
}

export function JokeEvaluationDisplay({ content }: JokeEvaluationDisplayProps) {
  try {
    const jokeText = content.split('{')[0].trim();
    const jsonStr = '{' + content.split('{')[1];
    const evaluation = JSON.parse(jsonStr) as JokeEvaluation;

    return (
      <div className="space-y-6 bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700">
        <div className="text-xl font-medium text-gray-100">{jokeText}</div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="col-span-2">
            <div className="flex flex-wrap gap-2">
              {evaluation.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-blue-500 bg-opacity-20 text-blue-300 rounded-full text-sm font-medium hover:bg-opacity-30 transition-all">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          {Object.entries(evaluation)
            .filter(([key]) => key !== 'tags')
            .map(([key, value]) => (
              <div key={key} className="bg-gray-700 bg-opacity-50 p-4 rounded-lg hover:bg-opacity-60 transition-all">
                <div className="text-sm text-gray-300 font-medium capitalize mb-2">{key.replace('_', ' ')}</div>
                <div className="flex items-center">
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${(Number(value) / 10) * 100}%` }}></div>
                  <span className="ml-3 text-sm font-medium text-gray-300">{value}/10</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  } catch {
    return <div className="text-lg text-gray-100">{content}</div>;
  }
} 