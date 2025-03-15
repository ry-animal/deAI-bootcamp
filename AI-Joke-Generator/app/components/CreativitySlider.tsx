interface CreativitySliderProps {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CreativitySlider({ value, onChange }: CreativitySliderProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">Creativity Level</h3>
      <div className="space-y-4">
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          name="temperature"
          value={value}
          onChange={onChange}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="text-center">
          <span className="text-gray-300 font-medium">
            {value < 0.4 ? "More Focused" : 
             value < 0.7 ? "Balanced" : "More Creative"}
          </span>
          <span className="text-gray-400 ml-2">({value})</span>
        </div>
      </div>
    </div>
  );
} 