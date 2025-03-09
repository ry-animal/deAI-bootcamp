# Chef-GPT 🍽️🔥

**Chef-GPT** is an interactive culinary assistant powered by OpenAI's GPT model. Step into the kitchen with a strict, humorous, and somewhat aggressive Ukrainian master chef who will guide you through the culinary world with wit, wisdom, and a sharp tongue. Whether you're looking for ingredient-based dish suggestions, detailed recipes, or critiques on your cooking, Chef-GPT is here to help — with a dash of humor and spice.

---

## 🚀 Getting Started

Follow these steps to get Chef-GPT running on your local machine and start cooking up some culinary magic!

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/chef-gpt.git
cd chef-gpt
```

### 2. Set Up a Virtual Environment (Recommended)

It’s highly recommended to use a virtual environment to isolate dependencies. Here's how to set it up:

```bash
python -m venv .venv   # Create the virtual environment
```

On Windows:

```bash
.\.venv\Scripts\activate
```

On macOS/Linux:

```
source .venv/bin/activate
```

After activation, your terminal prompt should change, indicating that the virtual environment is active.

### 3. Install Dependencies

Once your virtual environment is activated, install the required dependencies:

```
pip install -r requirements.txt
```

### 4. Set Your OpenAI API Key

Log in to OpenAI

Go to API Keys

Click on Create new secret key

Name your key

Set permissions to All

Click on Create secret key

Copy the key and paste it in an environment variable named exactly OPENAI_API_KEY:

# Linux/MacOS/Bash on Windows

```
export OPENAI_API_KEY="your-api-key-here"
```

```
# Windows Command Prompt
set OPENAI_API_KEY=your-api-key-here
```

```
# Windows PowerShell
$env:OPENAI_API_KEY="your-api-key-here"
```

Also you can hardcode your API key, but it's highy not recommended.

### 5. Run the Script

Now that everything is set up, run the script to start chatting with Chef-GPT:

```
./run_chef_gpt.sh
```

👨‍🍳 How to Use
Once you run the script, you'll be prompted to ask your "chef" for help. Chef-GPT can provide three types of responses:

Ingredient-Based Dish Suggestions 🍗🍅

Provide the chef with ingredients, and he’ll suggest a dish you could cook. Keep it short and simple!
Recipe Requests for Specific Dishes 🍝

Ask for a recipe, and Chef-GPT will give you a detailed, step-by-step guide — with no mercy, of course.
Recipe Critiques and Improvement Suggestions 🍳

Want to make your cooking better? The chef will critique your recipe and suggest improvements with aggressive honesty.
If your prompt doesn’t match one of these categories, Chef-GPT will politely ask for valid input.

Example Interaction:

```
Hello, mon ami! I see you are looking for some advice regarding dishes. What do you need?
> Suggest a dish with chicken

Chef says:
Chicken Kiev, my friend! A classic. If you want to play it safe, try something like boring chicken salad. But do you dare, huh?
```

💡 Script Overview
The script is simple yet powerful:

Messages List: Defines the system's behavior and stores conversation history, including user and assistant messages.
OpenAI API Call: Uses the openai Python package to send the user's query and receive a response.
Culinary Dialog: The script engages in a loop, taking user input and generating chef-like responses until you decide to quit.

🛠️ Troubleshooting
🧑‍🍳 Chef is silent or not responding?
Ensure that your OpenAI API key is correctly set in the environment variables.
Double-check that the virtual environment is activated and dependencies are installed.

No openai package found?
Make sure that you have activated the .venv environment before running the script.

Reinstall the dependencies with:

```
pip install -r requirements.txt
```

Bon Apetit!
