interface Option {
  readonly emoji: string;
  readonly value: string;
  readonly label?: string;
  readonly color: string;
}

interface RadioButtonGroupProps {
  title: string;
  options: readonly Option[];
  name: string;
  selectedValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RadioButtonGroup({ title, options, name, selectedValue, onChange }: RadioButtonGroupProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">{title}</h3>
      <div className="flex flex-wrap justify-center gap-3">
        {options.map(({ value, emoji, label, color }) => (
          <label
            key={value}
            className={`flex items-center p-3 rounded-lg cursor-pointer select-none transition-colors duration-200 ease-in-out
              ${selectedValue === value 
                ? `bg-${color}-500 bg-opacity-20 border border-${color}-500 shadow-[0_0_15px_rgba(var(--${color}-500-rgb),0.5)] ring-1 ring-${color}-500 ring-opacity-50` 
                : 'bg-gray-700 bg-opacity-50 hover:bg-opacity-60 border border-transparent hover:border-gray-500'}`}
          >
            <input
              type="radio"
              name={name}
              value={value}
              onChange={onChange}
              className="hidden"
            />
            <span className="text-lg mr-2">{emoji}</span>
            <span className={`text-gray-200 ${selectedValue === value ? 'text-white font-medium' : ''}`}>
              {label || value}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
} 