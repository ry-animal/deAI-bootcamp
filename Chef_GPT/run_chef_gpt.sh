#!/bin/bash

# Prompt for API key (won't show in terminal)
echo "Enter your OpenAI API key (input will be hidden):"
read -s OPENAI_API_KEY

# Export the key to environment
export OPENAI_API_KEY

# Additional verification before running
if [[ -z "$OPENAI_API_KEY" ]]; then
  echo "Error: API key cannot be empty. Please restart the script."
  exit 1
fi

echo "API key set. Starting Chef-GPT..."

# Run the Python script
python3 Chef-GPT.py

# Cleanup (for security)
unset OPENAI_API_KEY 